import { SAVE_KEY } from "./defs.js";
import { DEFAULT_RACE_KEY } from "./races.js";
import { getClassDef } from "./classes/index.js";

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
  zone: 1,
  activeZoneId: "graveyard",
  killsThisZone: 0,
  killsForNextZone: 10,
  partySlotsUnlocked: 1,
  party: [],
  partyMaxHP: 0,
  partyHP: 0,
  currentEnemies: [],
  log: [],
  waitingToRespawn: false,
  huntRemaining: 0, // Milliseconds remaining for hunt timer (0 = not hunting)
  highestUnlockedZone: 1,
  logFilters: {
    healing: true,
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

  // Shared inventory (all characters use this)
  sharedInventory: Array(100).fill(null)
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
    killsThisZone: state.killsThisZone,
    killsForNextZone: state.killsForNextZone,
    partySlotsUnlocked: state.partySlotsUnlocked,
    partyHP: state.partyHP,
    partyMaxHP: state.partyMaxHP,
    currentEnemies: state.currentEnemies.map(e => ({ ...e })),
    party: state.party.map(h => ({ ...h })),
    sharedInventory: state.sharedInventory?.map(i => i ? { ...i } : null) || [],
    huntRemaining: state.huntRemaining,
    highestUnlockedZone: state.highestUnlockedZone,
    zoneDiscoveries: state.zoneDiscoveries,
    logFilters: state.logFilters || {
      healing: true,
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
    lastSavedAt: Date.now()
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
    state.killsThisZone = data.killsThisZone ?? 0;
    state.killsForNextZone = data.killsForNextZone ?? 10;
    state.partySlotsUnlocked = data.partySlotsUnlocked ?? 1;
    state.sharedInventory = Array.isArray(data.sharedInventory) ? data.sharedInventory.map(i => i ? { ...i } : null) : Array(100).fill(null);
    state.party = Array.isArray(data.party) ? data.party.map(h => {
      // Initialize health for old saves that don't have it
      if (!h.raceKey) {
        h.raceKey = data.playerRaceKey || DEFAULT_RACE_KEY;
      }
      if (!h.raceName) {
        // defer to runtime lookup; keep simple string for now
        h.raceName = h.raceKey;
      }
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
          head: null,
          chest: null,
          legs: null,
          feet: null,
          main: null,
          off: null
        };
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
      if (h.classKey === "warrior") {
        const cap = doubleAttackCap(h.level || 1);
        if (h.doubleAttackSkill === undefined) {
          h.doubleAttackSkill = h.level >= 5 ? 1 : 0;
        }
        h.doubleAttackSkill = Math.min(h.doubleAttackSkill || 0, cap);
      }
      return h;
    }) : [];
    state.partyMaxHP = data.partyMaxHP ?? 0;
    state.partyHP = data.partyHP ?? 0;
    state.huntRemaining = data.huntRemaining ?? 0;
    state.highestUnlockedZone = data.highestUnlockedZone ?? 1;
    state.zoneDiscoveries = data.zoneDiscoveries ?? {};
    state.showXPBreakdown = data.showXPBreakdown ?? false;
    state.automationRules = data.automationRules ?? [];
    state.campThresholds = data.campThresholds ?? { health: 80, mana: 50, endurance: 30 };
    state.lastCampLogTick = data.lastCampLogTick ?? 0;
    state.lastCampLogTime = data.lastCampLogTime ?? 0;

    const maxId = state.party.reduce((m, h) => Math.max(m, h.id || 0), 0);
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
