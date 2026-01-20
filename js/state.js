import { SAVE_KEY } from "./defs.js";
import { DEFAULT_RACE_KEY } from "./races.js";
import { getClassDef } from "./classes/index.js";
import { isExpiredEffect, purgeExpiredActive } from "./util.js";
import { ensureWeaponSkills, applyWeaponUnlocks } from "./weaponSkills.js";
import { ensureMagicSkills, applyMagicUnlocks } from "./magicSkills.js";
import { ensureActorResists, applyRacialResists } from "./resist.js";
import { ensureEquipmentSlots } from "./equip.js";

// ===== Currency conversion helpers =====
export function normalizePGSC(pgsc = {}) {
  const p = pgsc.plat || 0;
  const g = pgsc.gold || 0;
  const s = pgsc.silver || 0;
  const c = pgsc.copper || 0;
  return p * 1000 + g * 100 + s * 10 + c;
}

export function splitCopper(totalCopper = 0) {
  totalCopper = Math.floor(Math.max(0, totalCopper)); // Clamp to 0
  const plat = Math.floor(totalCopper / 1000);
  const remainder1 = totalCopper % 1000;
  const gold = Math.floor(remainder1 / 100);
  const remainder2 = remainder1 % 100;
  const silver = Math.floor(remainder2 / 10);
  const copper = remainder2 % 10;
  return { plat, gold, silver, copper };
}

export function formatPGSC(amount, useColors = false) {
  const pgsc = typeof amount === 'number' ? splitCopper(amount) : amount;
  const { plat, gold, silver, copper } = pgsc;
  
  const parts = [];
  if (plat > 0) parts.push(`${plat}p`);
  if (gold > 0 || (parts.length > 0 && (silver > 0 || copper > 0))) parts.push(`${gold}g`);
  if (silver > 0 || (parts.length > 0 && copper > 0)) parts.push(`${silver}s`);
  if (copper > 0 || parts.length === 0) parts.push(`${copper}c`);
  
  if (useColors) {
    return parts
      .map((p, i) => {
        const colors = ['#d8b3ff', '#ffd700', '#c0c0c0', '#b87333']; // plat, gold, silver, copper
        return `<span style="color:${colors[i]}">${p}</span>`;
      })
      .join(' ');
  }
  
  return parts.join(' ');
}

function doubleAttackCap(level) {
  if (level < 5) return 0;
  const rawCap = (level - 4) * (250 / 56);
  const floored = Math.floor(rawCap / 5) * 5;
  if (floored < 5) return 5;
  if (floored > 250) return 250;
  return floored;
}

let heroIdCounter = 1;

export const state = {
  accountName: "",
  characterName: "",
  playerClassKey: "",
  playerRaceKey: DEFAULT_RACE_KEY,
  currencyCopper: 0,  // Internal: total copper
  // Display breakdown (auto-computed): { plat, gold, silver, copper }
  currencyDisplay: { plat: 0, gold: 0, silver: 0, copper: 0 },
  totalXP: 0,
  accountLevel: 1,
  accountLevelXP: 0,
  accountLevelUpCost: 0, // Will be set at runtime using P99 curve
  nowMs: 0,
  zone: 1,
  activeZoneId: "graveyard",
  activeSubAreaIdByZone: {},  // NEW: remember chosen subArea per zoneId
  killsThisZone: 0,
  killsForNextZone: 10,
  zoneKillCounts: {},
  partySlotsUnlocked: 1,
  party: [],
  bench: [],  // Benched party members
  partyMaxHP: 0,
  partyHP: 0,
  currentEnemies: [],
  log: [],
  waitingToRespawn: false,
  huntRemaining: 0, // Milliseconds remaining for hunt timer (0 = not hunting)
  highestUnlockedZone: 1,
  logFilters: {
    healing: true,
    mana_regen: true,
    damage_dealt: true,
    damage_taken: true,
    normal: true,
    gold: true,
    skill: true
  },
  showXPBreakdown: false,
  offlineSummary: null,
  zoneDiscoveries: {},
  campThresholds: {
    health: 80,
    mana: 50,
    endurance: 30
  },
  lastCampLogTick: 0, // Counter for periodic camping messages
  lastCampLogTime: 0, // Timestamp of last camping log (ms)

  // Named spawn tracking (Phase 3: spawn smoothing)
  killsSinceLastNamed: {}, // { zoneId: killCount }
  namedCooldownKills: {}, // { zoneId: remainingCooldownKills }

  // Shared inventory (all characters use this)
  sharedInventory: Array(100).fill(null),
  
  // Inventory unlock system
  inventoryPaidSlotsUnlocked: 0, // Number of paid slots unlocked beyond character unlocks

  // Settings (persisted)
  settings: {
    debugLogs: false  // Global debug logging toggle
  }
};

export function nextHeroId() {
  return heroIdCounter++;
}

export function bumpHeroIdCounterToAtLeast(n) {
  heroIdCounter = Math.max(heroIdCounter, n);
}

/**
 * Update the display breakdown (PGSC) from the internal copper total
 */
export function updateCurrencyDisplay() {
  state.currencyDisplay = splitCopper(state.currencyCopper);
}

export function serializeState() {
  return {
    accountName: state.accountName,
    characterName: state.characterName,
    playerClassKey: state.playerClassKey,
    playerRaceKey: state.playerRaceKey,
    currencyCopper: state.currencyCopper,
    totalXP: state.totalXP,
    accountLevel: state.accountLevel,
    accountLevelXP: state.accountLevelXP,
    accountLevelUpCost: state.accountLevelUpCost,
    zone: state.zone,
    activeZoneId: state.activeZoneId,
    activeSubAreaIdByZone: state.activeSubAreaIdByZone || {},
    killsThisZone: state.killsThisZone,
    killsForNextZone: state.killsForNextZone,
    zoneKillCounts: state.zoneKillCounts,
    partySlotsUnlocked: state.partySlotsUnlocked,
    partyHP: state.partyHP,
    partyMaxHP: state.partyMaxHP,
    currentEnemies: state.currentEnemies.map(e => ({ ...e })),
    party: state.party.map(h => ({ ...h })),
    bench: (state.bench || []).map(h => ({ ...h })),
    sharedInventory: state.sharedInventory?.map(i => i ? { ...i } : null) || [],
    inventoryPaidSlotsUnlocked: state.inventoryPaidSlotsUnlocked || 0,
    huntRemaining: state.huntRemaining,
    highestUnlockedZone: state.highestUnlockedZone,
    zoneDiscoveries: state.zoneDiscoveries,
    logFilters: state.logFilters || {
      healing: true,
      mana_regen: true,
      damage_dealt: true,
      damage_taken: true,
      normal: true,
      gold: true
    },
    showXPBreakdown: state.showXPBreakdown ?? false,
    automationRules: state.automationRules || [],
    campThresholds: state.campThresholds || { health: 80, mana: 50, endurance: 30 },
    lastCampLogTick: state.lastCampLogTick ?? 0,
    lastCampLogTime: state.lastCampLogTime ?? 0,
    killsSinceLastNamed: state.killsSinceLastNamed || {},
    namedCooldownKills: state.namedCooldownKills || {},
    nowMs: state.nowMs ?? 0,
    lastSavedAt: state.nowMs ?? 0,
    settings: state.settings || { debugLogs: false }
  };
}

export function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState()));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

export function loadGame() {
  try {
    let raw = localStorage.getItem(SAVE_KEY);
    
    // Migration: check old key if new key doesn't exist
    if (!raw) {
      const oldKey = "tickrate-save";
      raw = localStorage.getItem(oldKey);
      if (raw) {
        console.log("Migrating from old save key:", oldKey);
        // Re-save to new key immediately
        localStorage.setItem(SAVE_KEY, raw);
        localStorage.removeItem(oldKey);
      }
    }
    
    if (!raw) return { loaded: false, lastSavedAt: null };

    const data = JSON.parse(raw);

    state.accountName = data.accountName ?? "";
    state.characterName = data.characterName ?? "";
    state.playerClassKey = data.playerClassKey ?? "";
    state.playerRaceKey = data.playerRaceKey ?? DEFAULT_RACE_KEY;
    // Handle migration from old 'gold' to new 'currencyCopper'
    state.currencyCopper = data.currencyCopper ?? (data.gold ?? 0) * 1; // If old save has gold, treat as copper
    state.totalXP = data.totalXP ?? 0;
    state.accountLevel = data.accountLevel ?? 1;
    state.accountLevelXP = data.accountLevelXP ?? 0;
    state.accountLevelUpCost = data.accountLevelUpCost ?? 0; // Will be initialized using P99 curve
    state.zone = data.zone ?? 1;
    state.activeZoneId = data.activeZoneId ?? state.activeZoneId ?? "graveyard";
    
    // NEW: load chosen subArea per zoneId
    state.activeSubAreaIdByZone = data.activeSubAreaIdByZone ?? {};
    
    state.killsThisZone = data.killsThisZone ?? 0;
    state.killsForNextZone = data.killsForNextZone ?? 10;
    state.zoneKillCounts = data.zoneKillCounts ?? {};
    state.partySlotsUnlocked = data.partySlotsUnlocked ?? 1;
    state.sharedInventory = Array.isArray(data.sharedInventory) ? data.sharedInventory.map(i => i ? { ...i } : null) : Array(100).fill(null);
    state.inventoryPaidSlotsUnlocked = data.inventoryPaidSlotsUnlocked ?? 0;
    state.party = Array.isArray(data.party) ? data.party.map(h => {
      // Initialize health for old saves that don't have it
      if (!h.raceKey) {
        h.raceKey = data.playerRaceKey || DEFAULT_RACE_KEY;
      }
      if (!h.raceName) {
        // defer to runtime lookup; keep simple string for now
        h.raceName = h.raceKey;
      }
      ensureActorResists(h);
      applyRacialResists(h, { force: true });
      if (h.health === undefined) {
        h.health = h.maxHP || 0;
      }
      if (h.isDead === undefined) {
        h.isDead = false;
      }
      if (h.deathTime === undefined) {
        h.deathTime = null;
      }
      // Initialize resources from class definition if missing
      const cls = getClassDef(h.classKey);
      if (h.maxMana === undefined) {
        h.maxMana = cls?.maxMana || 0;
        h.mana = cls?.maxMana || 0;
        h.manaRegenPerTick = cls?.manaRegenPerTick || 0;
      }
      if (h.maxEndurance === undefined) {
        h.maxEndurance = cls?.maxEndurance || 0;
        h.endurance = cls?.maxEndurance || 0;
        h.enduranceRegenPerTick = cls?.enduranceRegenPerTick || 0;
      }
      // Initialize temporary debuff fields
      if (h.tempDamageDebuffTicks === undefined) {
        h.tempDamageDebuffTicks = 0;
      }
      if (h.tempDamageDebuffAmount === undefined) {
        h.tempDamageDebuffAmount = 0;
      }
      // Initialize ability bar
      if (h.abilityBar === undefined) {
        h.abilityBar = {};
      }
      // Initialize inventory
      if (h.inventory === undefined) {
        h.inventory = Array(100).fill(null);
      }
      // Initialize equipment
      if (h.equipment === undefined) {
        h.equipment = {
          charm: null,
          ear1: null,
          head: null,
          face: null,
          ear2: null,
          neck: null,
          shoulders: null,
          arms: null,
          back: null,
          wrist1: null,
          wrist2: null,
          ranged: null,
          hands: null,
          main: null,
          off: null,
          finger1: null,
          finger2: null,
          chest: null,
          legs: null,
          feet: null,
          waist: null,
          power: null,
          ammo: null
        };
      } else {
        // Ensure all slots exist for saves missing some
        ensureEquipmentSlots(h);
      }
      // Initialize per-hero consumable slots (4 total)
      if (!Array.isArray(h.consumableSlots)) {
        h.consumableSlots = Array(4).fill(null);
      } else {
        h.consumableSlots = Array.from({ length: 4 }, (_, idx) => h.consumableSlots[idx] ?? null);
      }
      // Initialize regen tick counter
      if (h.regenTickCounter === undefined) {
        h.regenTickCounter = 0;
      }
      // Initialize classBaseDamage (store original class damage for equipment bonuses)
      if (h.classBaseDamage === undefined) {
        const cls = getClassDef(h.classKey);
        h.classBaseDamage = cls?.baseDamage ?? cls?.baseDPS ?? h.baseDamage ?? 5;
      }
      // Initialize levelBonus for additive scaling (new system)
      // Migrate old saves that don't have proper levelBonus yet
      const hasProperLevelBonus = h.levelBonus && (h.levelBonus.hp > 0 || h.level === 1);
      if (!hasProperLevelBonus) {
        // Restore original class base values
        const cls = getClassDef(h.classKey);
        h.baseHP = cls?.baseHP ?? 50;
        h.baseMana = cls?.baseMana ?? 0;
        h.baseDamage = h.classBaseDamage; // Use the stored original class damage
        h.maxEndurance = cls?.maxEndurance ?? 0; // Restore original endurance cap
        
        // Recalculate bonuses from scratch based on hero level
        const GROWTH = {
          warrior:   { hp: 40,  dmg: 1.2, mana: 0,  end: 3 },
          ranger:    { hp: 30,  dmg: 1.6, mana: 10, end: 2 },
          cleric:    { hp: 28,  dmg: 1.0, mana: 18, end: 0 },
          wizard:    { hp: 18,  dmg: 2.0, mana: 20, end: 0 },
          enchanter: { hp: 22,  dmg: 1.2, mana: 20, end: 0 },
        };
        const g = GROWTH[h.classKey] || { hp: 20, dmg: 1.0, mana: 10, end: 0 };
        const numLevelUps = Math.max(0, (h.level || 1) - 1);
        h.levelBonus = {
          hp: numLevelUps * g.hp,
          dmg: numLevelUps * g.dmg,
          mana: numLevelUps * g.mana,
          end: numLevelUps * g.end
        };
      }
      if (h.classKey === "warrior") {
        const cap = doubleAttackCap(h.level || 1);
        if (h.doubleAttackSkill === undefined) {
          h.doubleAttackSkill = h.level >= 5 ? 1 : 0;
        }
        h.doubleAttackSkill = Math.min(h.doubleAttackSkill || 0, cap);
      }
      // Initialize meditate skill and regen fields (new system)
      if (h.meditateSkill === undefined) {
        h.meditateSkill = 0;
      }
      if (h.gearManaRegen === undefined) {
        h.gearManaRegen = 0;
      }
      if (h.buffManaRegen === undefined) {
        h.buffManaRegen = 0;
      }
      if (h.inCombat === undefined) {
        h.inCombat = false;
      }
      // Initialize active buffs (need to clean up expired ones on load)
      if (h.activeBuffs === undefined) {
        h.activeBuffs = {};
      }
      // Remove expired buffs from old saves
      const now = state.nowMs ?? 0;
      purgeExpiredActive(h.activeBuffs, now);
      
      // Migrate old-style buff timestamps (before game clock was used)
      // If a buff's expiresAt is much larger than state.nowMs, it was created with an old clock
      const MAX_REASONABLE_BUFF_DURATION_MS = 2000000; // ~33 minutes (max buff duration)
      for (const [buffKey, buffData] of Object.entries(h.activeBuffs)) {
        if (buffData && typeof buffData === "object" && buffData.expiresAt) {
          // If expiresAt is way ahead of now + max duration, it's an old timestamp
          if (buffData.expiresAt > now + MAX_REASONABLE_BUFF_DURATION_MS) {
            // Old-style buff: recalculate as if applied fresh now with ~30 min duration
            buffData.expiresAt = now + 1800000; // 30 minutes
          }
        }
      }
      
      // FIX 21: Ensure heroes always have type = "player" after load
      // Critical for isPlayerActor() check in combatMath.js weapon skill routing
      if (!h.type) h.type = "player";
      
      // Ensure weapon skills and apply unlocks per current level
      ensureWeaponSkills(h);
      applyWeaponUnlocks(h);
      // Ensure magic skills and apply unlocks per current level
      ensureMagicSkills(h);
      applyMagicUnlocks(h);
      
      return h;
    }) : [];
    
    // Load bench members (same processing as party members)
    state.bench = Array.isArray(data.bench) ? data.bench.map(h => {
      if (!h.raceKey) {
        h.raceKey = data.playerRaceKey || DEFAULT_RACE_KEY;
      }
      if (!h.raceName) {
        h.raceName = h.raceKey;
      }
      ensureActorResists(h);
      applyRacialResists(h, { force: true });
      if (h.health === undefined) {
        h.health = h.maxHP || 0;
      }
      if (h.isDead === undefined) {
        h.isDead = false;
      }
      if (h.deathTime === undefined) {
        h.deathTime = null;
      }
      const cls = getClassDef(h.classKey);
      if (h.maxMana === undefined) {
        h.maxMana = cls?.maxMana || 0;
        h.mana = cls?.maxMana || 0;
        h.manaRegenPerTick = cls?.manaRegenPerTick || 0;
      }
      if (h.maxEndurance === undefined) {
        h.maxEndurance = cls?.maxEndurance || 0;
        h.endurance = cls?.maxEndurance || 0;
        h.enduranceRegenPerTick = cls?.enduranceRegenPerTick || 0;
      }
      if (h.tempDamageDebuffTicks === undefined) {
        h.tempDamageDebuffTicks = 0;
      }
      if (h.tempDamageDebuffAmount === undefined) {
        h.tempDamageDebuffAmount = 0;
      }
      if (h.abilityBar === undefined) {
        h.abilityBar = {};
      }
      if (h.inventory === undefined) {
        h.inventory = Array(100).fill(null);
      }
      if (h.equipment === undefined) {
        h.equipment = {
          charm: null, ear1: null, head: null, face: null, ear2: null, neck: null,
          shoulders: null, arms: null, back: null, wrist1: null, wrist2: null,
          ranged: null, hands: null, main: null, off: null, finger1: null,
          finger2: null, chest: null, legs: null, feet: null, waist: null,
          power: null, ammo: null
        };
      } else {
        ensureEquipmentSlots(h);
      }
      if (!Array.isArray(h.consumableSlots)) {
        h.consumableSlots = Array(4).fill(null);
      } else {
        h.consumableSlots = Array.from({ length: 4 }, (_, idx) => h.consumableSlots[idx] ?? null);
      }
      if (h.regenTickCounter === undefined) {
        h.regenTickCounter = 0;
      }
      if (h.classBaseDamage === undefined) {
        const cls = getClassDef(h.classKey);
        h.classBaseDamage = cls?.baseDamage ?? cls?.baseDPS ?? h.baseDamage ?? 5;
      }
      if (!h.type) h.type = "player";
      ensureWeaponSkills(h);
      applyWeaponUnlocks(h);
      ensureMagicSkills(h);
      applyMagicUnlocks(h);
      return h;
    }) : [];
    
    state.partyMaxHP = data.partyMaxHP ?? 0;
    state.partyHP = data.partyHP ?? 0;
    state.huntRemaining = data.huntRemaining ?? 0;
    state.highestUnlockedZone = data.highestUnlockedZone ?? 1;
    // Ensure current zone is always considered unlocked (fixes greyed zones on old saves)
    state.highestUnlockedZone = Math.max(state.highestUnlockedZone, state.zone);
    state.zoneDiscoveries = data.zoneDiscoveries ?? {};
    state.showXPBreakdown = data.showXPBreakdown ?? false;
    state.automationRules = data.automationRules ?? [];
    state.campThresholds = data.campThresholds ?? { health: 80, mana: 50, endurance: 30 };
    state.lastCampLogTick = data.lastCampLogTick ?? 0;
    state.lastCampLogTime = data.lastCampLogTime ?? 0;
    state.killsSinceLastNamed = data.killsSinceLastNamed ?? {};
    state.namedCooldownKills = data.namedCooldownKills ?? {};
    state.nowMs = Math.max(0, data.nowMs ?? 0);
    state.settings = data.settings ?? { debugLogs: false };

    const maxId = Math.max(
      state.party.reduce((m, h) => Math.max(m, h.id || 0), 0),
      (state.bench || []).reduce((m, h) => Math.max(m, h.id || 0), 0)
    );
    bumpHeroIdCounterToAtLeast(maxId + 1);

    // enemies will be respawned after load
    state.currentEnemies = [];

    return { loaded: true, lastSavedAt: data.lastSavedAt ?? null };
  } catch (e) {
    console.error("Load failed:", e);
    return { loaded: false, lastSavedAt: null };
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
