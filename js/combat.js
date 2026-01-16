import { state, nextHeroId, updateCurrencyDisplay, formatPGSC } from "./state.js";
import { getClassDef, CLASS_DEFS } from "./classes/index.js";
import { getZoneDef, getEnemyForZone, MAX_ZONE, rollSubAreaDiscoveries, ensureZoneDiscovery, getZoneById, getActiveSubArea } from "./zones/index.js";
import { addLog, randInt, isExpiredEffect, unwrapEffect, purgeExpiredActive } from "./util.js";
import { ACCOUNT_SLOT_UNLOCKS, GAME_TICK_MS, MEDITATE_UNLOCK_LEVEL, MEDITATE_SKILL_HARD_CAP, MEDITATE_BASE_REGEN_FACTOR, COMBAT_REGEN_MULT, OOC_REGEN_MULT, XP_TEST_REDUCTION_PERCENT, SKILL_UP_RATE_MULT } from "./defs.js";
import { getItemDef } from "./items.js";
import { getRaceDef, DEFAULT_RACE_KEY } from "./races.js";
import { ACTIONS } from "./actions.js";
import { tryWeaponSkillUp, getEquippedWeaponType, ensureWeaponSkills } from "./weaponSkills.js";
import { onNamedSpawned, onMobKilled } from "./namedSpawns.js";
import { debugLog } from "./debug.js";
import {
  startCast,
  tickCasting,
  onHeroDamaged,
  getFinalManaCost,
  onSpellCastCompleteForSkills,
  ensureMagicSkills,
  isMagicCategoryUnlocked,
  getMagicSkillDisplayName
} from "./magicSkills.js";
import { resolveActionResist, getResistLogMessage, ensureActorResists, applyRacialResists } from "./resist.js";
import {
  applyACMitigation,
  computeCritChance,
  computeHitChance,
  computeManaRegenPerSecond,
  computeMaxHP,
  computeMaxMana,
  computeRawDamage
} from "./combatMath.js";

// Meditate regen tick multiplier: meditateTick runs every 2 game ticks (6 seconds)
// manaRegenPerTick is per game tick (3 sec), so multiply by 2
const REGEN_TICK_MULT = 2;

// Simple loot entry shape: { itemId, dropRate (0-1), minQty?, maxQty? }
function rollLoot(enemyDef, zoneDef) {
  const rolls = [];

  // Use enemy-specific loot first
  const enemyLoot = Array.isArray(enemyDef?.loot) ? enemyDef.loot : [];

  // Global loot applies unless enemy is marked rare
  const globalLoot = enemyDef?.rare ? [] : (zoneDef?.globalLoot || []);

  for (const entry of [...enemyLoot, ...globalLoot]) {
    const dropRate = entry.dropRate ?? 0;
    if (Math.random() <= dropRate) {
      const minQty = Math.max(1, entry.minQty ?? 1);
      const maxQty = Math.max(minQty, entry.maxQty ?? minQty);
      const qty = minQty === maxQty ? minQty : (minQty + randInt(maxQty - minQty + 1));
      rolls.push({ id: entry.itemId, quantity: qty });
    }
  }

  return rolls;
}

function applyEnemyEquipmentBonuses(enemy, drops) {
  if (!drops || drops.length === 0) return;
  enemy.equipment = [];
  for (const drop of drops) {
    const itemDef = getItemDef(drop.id);
    if (!itemDef || !itemDef.stats) continue;

    // Apply offensive bonuses
    if (itemDef.stats.dps) {
      enemy.baseDamage = (enemy.baseDamage || enemy.dps || 0) + itemDef.stats.dps;
      enemy.dps = enemy.baseDamage;
    }
    // Defensive/secondary stats (minimal use, but keep for future)
    if (itemDef.stats.ac) enemy.ac = (enemy.ac || enemy.stats?.ac || 0) + itemDef.stats.ac;
    if (itemDef.stats.con) enemy.stats.con = (enemy.stats.con || 0) + itemDef.stats.con;
    if (itemDef.stats.str) enemy.stats.str = (enemy.stats.str || 0) + itemDef.stats.str;
    if (itemDef.stats.dex) enemy.stats.dex = (enemy.stats.dex || 0) + itemDef.stats.dex;
    if (itemDef.stats.agi) enemy.stats.agi = (enemy.stats.agi || 0) + itemDef.stats.agi;
    if (itemDef.stats.wis) enemy.stats.wis = (enemy.stats.wis || 0) + itemDef.stats.wis;
    if (itemDef.stats.int) enemy.stats.int = (enemy.stats.int || 0) + itemDef.stats.int;
    if (itemDef.stats.cha) enemy.stats.cha = (enemy.stats.cha || 0) + itemDef.stats.cha;

    enemy.equipment.push(drop.id);
  }
}

// Hunt timer configuration (milliseconds)
const HUNT_TIME_MS = 4000; // 4 seconds between kills

const DEFAULT_STATS = {
  str: 10,
  con: 10,
  dex: 10,
  agi: 10,
  ac: 10,
  wis: 8,
  int: 8,
  cha: 8
};

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

// ===========================
// DELAY & HASTE SYSTEM
// ===========================

/**
 * Get base delay in tenths of a second for an actor
 * Heroes: use equipped weapon delay, or 30 if unarmed
 * Mobs: use naturalDelayTenths, or 30 as default
 */
export function getBaseDelayTenths(actor) {
  if (actor.heroId) {
    // Hero: check equipped weapon
    const equippedWeaponSlot = actor.equipment?.["main"] ?? actor.equipment?.["main_hand"];
    if (equippedWeaponSlot) {
      const itemDef = getItemDef(equippedWeaponSlot.id);
      if (itemDef?.delayTenths) {
        return itemDef.delayTenths;
      }
    }
    return 30; // Unarmed default
  } else {
    // Mob: use naturalDelayTenths or 30
    return actor.naturalDelayTenths || 30;
  }
}

// Normalize buff storage: prefer activeBuffs, fallback to legacy buffs array
function getBuffList(actor, nowMs = state.nowMs ?? 0) {
  const active = actor?.activeBuffs;
  if (active && Object.keys(active).length > 0) {
    const list = [];
    for (const entry of Object.values(active)) {
      if (isExpiredEffect(entry, nowMs)) continue;
      list.push(unwrapEffect(entry));
    }
    return list;
  }
  if (Array.isArray(actor?.buffs)) {
    return actor.buffs;
  }
  return [];
}

// Normalize debuff storage: prefer activeDebuffs, fallback to legacy debuffs array
function getDebuffList(actor, nowMs = state.nowMs ?? 0) {
  const active = actor?.activeDebuffs;
  if (active && Object.keys(active).length > 0) {
    const list = [];
    for (const entry of Object.values(active)) {
      if (isExpiredEffect(entry, nowMs)) continue;
      list.push(unwrapEffect(entry));
    }
    return list;
  }
  if (Array.isArray(actor?.debuffs)) {
    return actor.debuffs;
  }
  return [];
}

/**
 * Get total haste percentage for an actor (clamped to [-0.75, +3.00])
 * Includes equipment bonuses, buffs, debuffs (active-first)
 */
export function getTotalHastePct(actor, nowMs = state.nowMs ?? 0) {
  let hastePct = 0;

  // Equipment haste (if any)
  if (actor.equipment) {
    for (const slot of Object.values(actor.equipment)) {
      if (slot) {
        const itemDef = getItemDef(slot.id);
        if (itemDef?.stats?.hastePct) {
          hastePct += itemDef.stats.hastePct;
        }
      }
    }
  }

  // Buff haste (active-first)
  const buffs = getBuffList(actor, nowMs);
  for (const buff of buffs) {
    if (buff?.hastePct) {
      hastePct += buff.hastePct;
    }
  }

  // Debuff slow (active-first)
  const debuffs = getDebuffList(actor, nowMs);
  for (const debuff of debuffs) {
    if (debuff?.slowPct) {
      hastePct -= debuff.slowPct;
    }
  }

  // Clamp to [-0.75, +3.00]
  return clamp(hastePct, -0.75, 3.0);
}

/**
 * Compute swing ticks from base delay and total haste
 * Internally clamps haste to [-0.75, +3.00] and uses standard rounding
 * swingTicks = max(1, round((baseDelayTenths / (1 + clampedHaste)) / 30))
 */
export function computeSwingTicks(baseDelayTenths, totalHastePct) {
  const clampedHaste = clamp(totalHastePct, -0.75, 3.0);
  const effectiveDelayTenths = baseDelayTenths / (1 + clampedHaste);
  return Math.max(1, Math.round(effectiveDelayTenths / 30));
}

/**
 * Compute extra swing chance and overflow bonuses when at 1-tick floor
 * Returns { extraSwingChance, autoDmgMult, procMult }
 */
function computeOverflowBonuses(baseDelayTenths, totalHastePct) {
  const effectiveDelayTenths = baseDelayTenths / (1 + totalHastePct);
  const swingTicks = computeSwingTicks(baseDelayTenths, totalHastePct);

  if (swingTicks > 1) {
    // Not at floor, no overflow
    return { extraSwingChance: 0, autoDmgMult: 1.0, procMult: 1.0 };
  }

  // At 1-tick floor, compute overflow
  const overflowPct = Math.max(0, (30 - effectiveDelayTenths) / 30);
  const extraSwingChance = clamp(overflowPct, 0, 0.50);
  const overflow2 = Math.max(0, overflowPct - 0.50);

  const autoDmgMult = 1 + Math.min(overflow2 * 0.20, 0.10); // cap at +10%
  const procMult = 1 + Math.min(overflow2 * 0.40, 0.20); // cap at +20%

  return { extraSwingChance, autoDmgMult, procMult };
}

/**
 * Rescale remaining swing cooldown when tick window changes due to haste/slow
 * Preserves progress through the current swing window without granting free swings.
 * - If oldSwingCd was 0 (already ready), remains 0
 * - Otherwise, clamps to at least 1 tick to avoid immediate swings
 */
function rescaleSwingCd(oldSwingTicks, oldSwingCd, newSwingTicks) {
  if (!Number.isFinite(oldSwingTicks) || !Number.isFinite(oldSwingCd) || oldSwingTicks <= 0) {
    return Math.min(Number.isFinite(newSwingTicks) ? newSwingTicks : 1, newSwingTicks || 1);
  }
  // If already ready to swing, remain ready regardless of haste/slow
  if (oldSwingCd === 0) return 0;

  const progress = clamp(1 - (oldSwingCd / oldSwingTicks), 0, 1);
  let newSwingCd = Math.round((1 - progress) * newSwingTicks);
  // Prevent immediate swing on non-ready rescale (both haste and slow)
  newSwingCd = Math.max(1, newSwingCd);
  return newSwingCd;
}

/**
 * Initialize or refresh swing timer for an actor
 * Sets swingTicks and swingCd (with random stagger)
 */
function initializeSwingTimer(actor) {
  const baseDelay = getBaseDelayTenths(actor);
  const hastePct = getTotalHastePct(actor);
  const swingTicks = computeSwingTicks(baseDelay, hastePct);

  actor.swingTicks = swingTicks;
  actor.swingCd = randInt(swingTicks + 1); // Random between 0 and swingTicks (inclusive)
  actor.lastSwingTicks = swingTicks; // Track for comparisons
}

export function doubleAttackCap(level) {
  if (level < 5) return 0;
  const growth = level - 4; // Level 5 -> 1, Level 60 -> 56
  const rawCap = growth * (250 / 56);
  const flooredToFive = Math.floor(rawCap / 5) * 5;
  const capped = clamp(flooredToFive, 5, 250);
  return capped;
}

export function doubleAttackProcChance(skill) {
  if (!skill) return 0;
  // Start at 5% for skill 1, scale to 70% at skill 250
  // (70% - 5%) / (250 - 1) = 0.261% per skill point
  const baseChance = 0.05; // 5% at skill 1
  const perPointChance = 0.00261; // scales to 70% at 250
  const procChance = baseChance + (skill - 1) * perPointChance;
  return Math.min(0.70, procChance);
}

// Resolve copper reward using enemy override, then zone override, else fallback formula
function resolveCopperReward(enemy, zoneDef) {
  const rewardDef = enemy.copperReward ?? zoneDef?.copperReward;
  if (rewardDef != null) {
    if (typeof rewardDef === "number") return rewardDef;
    if (typeof rewardDef === "object") {
      const min = Math.max(0, rewardDef.min ?? 0);
      const max = Math.max(min, rewardDef.max ?? min);
      return randInt(max - min + 1) + min; // inclusive range
    }
  }

  // Fallback to legacy formula: 5 + zone*4 + enemy level
  return 5 + state.zone * 4 + (enemy.level ?? 1);
}

function doubleAttackSkillUpChance(hero, cap) {
  const skill = hero.doubleAttackSkill || 0;
  const gap = Math.max(0, cap - skill);
  if (gap <= 0) return 0;
  
  // Base chance: 2.5% per gap point, min 10%, max 40%
  const baseChance = clamp(gap * 0.025, 0.10, 0.40);
  
  // Skill progression penalty: gets harder as skill increases
  // At skill 1-50: 100%, at skill 100: 67%, at skill 150: 50%, at skill 200: 40%, at skill 250: 33%
  const progressPenalty = Math.max(0.33, 1.0 - (skill / 250) * 0.67);
  
  // Level-based DR for very high levels
  const levelDR = hero.level < 50 ? 1.0 : (hero.level <= 54 ? 0.6 : 0.4);
  
  // FIX 15: Apply skill-up rate multiplier to normalize for tickrate
  return baseChance * progressPenalty * levelDR * SKILL_UP_RATE_MULT;
}

function getZoneKey(zoneNumber) {
  const zone = getZoneDef(zoneNumber);
  return zone?.id || `zone_${zoneNumber}`;
}

function getDiscoveryState(zoneNumber) {
  const key = getZoneKey(zoneNumber);
  const zone = getZoneDef(zoneNumber);
  const seeded = ensureZoneDiscovery(zone, state.zoneDiscoveries[key]);
  state.zoneDiscoveries[key] = seeded;
  return seeded;
}

function fillStats(stats = {}) {
  return { ...DEFAULT_STATS, ...stats };
}

function primaryStatKey(hero, cls) {
  return hero.primaryStat || cls?.primaryStat || null;
}

export function refreshHeroDerived(hero) {
  const cls = getClassDef(hero.classKey) || {};
  const race = getRaceDef(hero.raceKey || DEFAULT_RACE_KEY);
  const raceMods = race?.statMods || {};
  hero.raceKey = hero.raceKey || race?.key || DEFAULT_RACE_KEY;
  hero.raceName = hero.raceName || race?.name;

  // Store old delay/haste info for weapon swap detection during refreshHeroDerived
  const oldBaseDelayTenths = hero.swingTicks ? getBaseDelayTenths(hero) : null;
  const oldTotalHastePct = hero.swingTicks ? getTotalHastePct(hero) : null;
  // Capture current swing window to enable proportional rescale on haste/slow
  const hadSwingWindow = Number.isFinite(hero.swingTicks) && Number.isFinite(hero.swingCd);
  const oldSwingTicks = hadSwingWindow ? hero.swingTicks : null;
  const oldSwingCd = hadSwingWindow ? hero.swingCd : null;

  // Reset stats to class base first (don't accumulate) then apply race modifiers
  const baseStats = fillStats({ ...cls.stats });
  for (const [stat, delta] of Object.entries(raceMods)) {
    baseStats[stat] = (baseStats[stat] || 0) + (delta || 0);
  }
  hero.stats = baseStats;
  
  // ALWAYS reset base values from class, then apply level bonuses
  hero.baseHP = (cls.baseHP ?? 50);
  hero.baseMana = (cls.baseMana ?? 0);
  
  // Store original class base damage if not already stored
  if (hero.classBaseDamage === undefined) {
    hero.classBaseDamage = cls.baseDamage ?? cls.baseDPS ?? hero.dps ?? 5;
  }
  
  // Always reset baseDamage to class base before applying equipment
  hero.baseDamage = hero.classBaseDamage;
  
  // Reset derived AC (will add base stats.ac + equipment AC)
  hero.ac = 0;
  
  // APPLY ADDITIVE LEVEL BONUSES to base values
  // Initialize levelBonus if it doesn't exist (for loaded old saves)
  hero.levelBonus = hero.levelBonus || { hp: 0, dmg: 0, mana: 0, end: 0 };
  const bonus = hero.levelBonus;
  
  // Add level bonuses to base stats
  hero.baseHP = hero.baseHP + bonus.hp;
  hero.baseDamage = hero.baseDamage + bonus.dmg;
  hero.baseMana = hero.baseMana + bonus.mana;
  
  hero.primaryStat = primaryStatKey(hero, cls);

  // Start with base AC from class/race stats
  hero.ac = hero.stats.ac || 0;

  // Apply equipment bonuses to stats
  if (hero.equipment) {
    for (const [slotKey, equippedItem] of Object.entries(hero.equipment)) {
      if (equippedItem) {
        const itemDef = getItemDef(equippedItem.id);
        if (itemDef && itemDef.stats) {
          // Add stat bonuses from equipped item
          if (itemDef.stats.dps) hero.baseDamage += itemDef.stats.dps;
          if (itemDef.stats.str) hero.stats.str = (hero.stats.str || 0) + itemDef.stats.str;
          if (itemDef.stats.con) hero.stats.con = (hero.stats.con || 0) + itemDef.stats.con;
          if (itemDef.stats.dex) hero.stats.dex = (hero.stats.dex || 0) + itemDef.stats.dex;
          if (itemDef.stats.agi) hero.stats.agi = (hero.stats.agi || 0) + itemDef.stats.agi;
          if (itemDef.stats.ac) hero.ac = (hero.ac || 0) + itemDef.stats.ac;
          if (itemDef.stats.wis) hero.stats.wis = (hero.stats.wis || 0) + itemDef.stats.wis;
          if (itemDef.stats.int) hero.stats.int = (hero.stats.int || 0) + itemDef.stats.int;
          if (itemDef.stats.cha) hero.stats.cha = (hero.stats.cha || 0) + itemDef.stats.cha;
        }
      }
    }
  }

  // === HASTE/SLOW HANDLING (in combat only) ===
  // Do NOT hard reset here; weapon swap reset is handled in the equip handler.
  if (hero.inCombat && state.currentEnemies.length > 0 && oldBaseDelayTenths !== null) {
    const newBaseDelayTenths = getBaseDelayTenths(hero);
    const newTotalHastePct = getTotalHastePct(hero);
    
    const delayChanged = Math.abs(newBaseDelayTenths - oldBaseDelayTenths) > 0.01;
    const hasteChanged = Math.abs(newTotalHastePct - oldTotalHastePct) > 0.01;
    
    // HASTE/SLOW BUFF: update swing ticks and proportionally rescale remaining time
    if (!delayChanged && hasteChanged) {
      const newSwingTicks = computeSwingTicks(newBaseDelayTenths, newTotalHastePct);
      if (oldSwingTicks && oldSwingCd != null && oldSwingTicks > 0) {
        const newSwingCd = rescaleSwingCd(oldSwingTicks, oldSwingCd, newSwingTicks);
        hero.swingTicks = newSwingTicks;
        hero.swingCd = newSwingCd;
      } else {
        // Fallback if prior window unknown: update and clamp
        hero.swingTicks = newSwingTicks;
        hero.swingCd = Math.min(hero.swingCd ?? newSwingTicks, newSwingTicks);
      }
    }
  }

  const con = hero.stats.con || 0;
  hero.maxHP = computeMaxHP(hero.baseHP, con);
  hero.health = Math.min(hero.health ?? hero.maxHP, hero.maxHP);

  const pKey = primaryStatKey(hero, cls);
  const primaryStat = pKey ? hero.stats[pKey] || 0 : 0;
  const maxMana = computeMaxMana(hero.baseMana, primaryStat);
  hero.maxMana = maxMana;
  if (hero.mana == null) {
    hero.mana = maxMana;
  } else {
    hero.mana = Math.min(hero.mana, maxMana);
  }

  const regenPerSec = pKey ? computeManaRegenPerSecond(primaryStat) : 0;
  hero.manaRegenPerTick = regenPerSec * (GAME_TICK_MS / 1000);

  // Keep legacy DPS field in sync with base damage
  hero.dps = hero.baseDamage;

  // Ensure endurance pools exist and apply level bonuses
  hero.maxEndurance = (cls.maxEndurance ?? 0) + bonus.end;
  if (hero.endurance == null) {
    hero.endurance = hero.maxEndurance;
  } else {
    hero.endurance = Math.min(hero.endurance, hero.maxEndurance);
  }
  hero.enduranceRegenPerTick = hero.enduranceRegenPerTick ?? cls.enduranceRegenPerTick ?? 0;
}

function buildEnemyFromTemplate(enemyDef, level) {
  const stats = fillStats(enemyDef.stats);
  const levelBump = Math.max(0, level - 1);
  stats.str += Math.floor(levelBump / 2);
  stats.con += Math.floor(levelBump / 2);
  stats.dex += Math.floor(levelBump / 3);
  stats.agi += Math.floor(levelBump / 3);
  stats.ac += Math.floor(levelBump);

  const baseHP = (enemyDef.baseHP ?? 30) + level * 10;
  const baseDamage = (enemyDef.baseDamage ?? enemyDef.baseDPS ?? 5) + Math.floor(level * 0.5);
  const baseMana = enemyDef.baseMana ?? 0;
  const primaryStat = enemyDef.primaryStat || null;
  const primaryValue = primaryStat ? stats[primaryStat] || 0 : 0;
  const maxMana = computeMaxMana(baseMana, primaryValue);
  const maxHP = Math.floor(computeMaxHP(baseHP, stats.con || 0));

  const enemy = {
    type: "mob",
    name: enemyDef.name,
    level,
    baseHP,
    baseDamage,
    baseMana,
    stats,
    maxHP,
    hp: maxHP,
    dps: baseDamage,
    xp: enemyDef.xp,
    debuffs: enemyDef.debuffs || [],
    resourceType: enemyDef.resourceType || null,
    primaryStat,
    maxMana,
    mana: maxMana,
    spellTimers: {}
  };

  // Apply optional per-mob resist overrides
  if (enemyDef.resists && typeof enemyDef.resists === "object") {
    enemy.resists = { ...enemyDef.resists };
  }

  // Ensure all resist buckets exist and are finite (no racial bonuses for mobs)
  ensureActorResists(enemy);

  return enemy;
}

export function createHero(classKey, customName = null, raceKey = DEFAULT_RACE_KEY) {
  const cls = getClassDef(classKey);
  if (!cls) return null;
  const race = getRaceDef(raceKey || DEFAULT_RACE_KEY);

  const baseDmg = cls.baseDamage ?? cls.baseDPS ?? cls.baseHealing ?? 5;
  const hero = {
    type: "player",
    id: nextHeroId(),
    classKey: cls.key,
    name: customName || cls.name,
    raceKey: race?.key || DEFAULT_RACE_KEY,
    raceName: race?.name,
    role: cls.role,
    level: 1,
    baseHP: cls.baseHP,
    baseDamage: baseDmg,
    classBaseDamage: baseDmg,  // Store the original class base damage
    baseMana: cls.baseMana ?? 0,
    stats: fillStats(cls.stats),
    maxHP: cls.baseHP,
    health: cls.baseHP,
    dps: baseDmg,
    healing: cls.baseHealing,
    isDead: false,
    deathTime: null,
    primaryStat: cls.primaryStat || null,
    
    // Additive level bonuses (NEW)
    levelBonus: { hp: 0, dmg: 0, mana: 0, end: 0 },
    
    // Resource pools based on class type
    resourceType: cls.resourceType, // "mana", "endurance", or ["mana", "endurance"] for Ranger
    maxMana: cls.maxMana || 0,
    mana: cls.maxMana || 0,
    manaRegenPerTick: cls.manaRegenPerTick || 0,
    maxEndurance: cls.maxEndurance || 0,
    endurance: cls.maxEndurance || 0,
    enduranceRegenPerTick: cls.enduranceRegenPerTick || 0,

    // Meditate skill (casters only; 0-252)
    meditateSkill: 0,
    gearManaRegen: 0,
    buffManaRegen: 0,
    inCombat: false,

    // Double Attack progression (warrior-only; unlocks at 5)
    doubleAttackSkill: cls.key === "warrior" ? 0 : undefined,

    // Temporary debuffs
    tempDamageDebuffTicks: 0,
    tempDamageDebuffAmount: 0,

    // Temporary buffs
    tempACBuffTicks: 0,
    tempACBuffAmount: 0,

    // Active buffs (key -> { expiresAt timestamp, data })
    activeBuffs: {},

    // Revival countdown tracking
    revivalNotifications: {},

    // Regeneration tick counter (regen happens every 2 ticks)
    regenTickCounter: 0,

    // Ability bar (12 slots, skill keys mapped by slot index)
    abilityBar: {},

    // Equipment slots (shared globally, but heroes have individual assignments)
    equipment: {
      head: null,      // { id, quantity }
      chest: null,
      legs: null,
      feet: null,
      main: null,      // Main hand weapon
      off: null        // Off hand
    },

    // cooldown tracking per hero:
    skillTimers: {},

    // Quick consumables (assigned from shared inventory)
    consumableSlots: Array(4).fill(null),
    
    // Swing timer for auto-attacks
    swingTicks: 0,
    swingCd: 0,
    
    // Equip cooldown (2 ticks after weapon swap in combat)
    equipCd: 0
  };

  refreshHeroDerived(hero);
  hero.health = hero.maxHP;
  hero.mana = hero.maxMana;
  if (hero.equipCd == null) hero.equipCd = 0;
  if (cls.key === "warrior" && hero.level >= 5 && hero.doubleAttackSkill < 1) {
    hero.doubleAttackSkill = 1;
  }
  
  // Ensure skill objects exist for new heroes
  ensureWeaponSkills(hero);
  ensureMagicSkills(hero);
  
  // Initialize resist stats and apply racials
  ensureActorResists(hero);
  applyRacialResists(hero);

  // Initialize swing timer
  initializeSwingTimer(hero);
  return hero;
}

function getUnlockedSkills(hero) {
  const cls = getClassDef(hero.classKey);
  if (!cls?.skills) return [];
  return cls.skills.filter(s => hero.level >= s.level);
}
export function recalcPartyTotals() {
  for (const h of state.party) {
    refreshHeroDerived(h);
  }

  let totalMaxHP = 0;
  let totalCurrentHP = 0;
  let totalDPS = 0;
  let totalHealing = 0;

  for (const h of state.party) {
    if (h?.isDead) continue; // Skip dead members
    totalMaxHP += h?.maxHP ?? 0;
    totalCurrentHP += h?.health ?? 0;
    let heroDPS = h?.dps ?? 0;
    if (h?.tempDamageDebuffTicks > 0) {
      const debuff = h.tempDamageDebuffAmount || 0;
      heroDPS = Math.max(0, heroDPS - debuff);
    }
    totalDPS += heroDPS;
    totalHealing += h?.healing ?? 0;
  }

  state.partyMaxHP = totalMaxHP;
  state.partyHP = totalCurrentHP;

  return { totalDPS, totalHealing };
}

// XP needed for the next hero level (P99 curve)
export function heroLevelUpCost(hero) {
  return p99XpToNext(hero.level);
}

function applyLevelScaling(hero) {
  // Additive per-level scaling based on class growth rates
  hero.level += 1;
  
  // Initialize levelBonus if missing (shouldn't happen, but safety)
  hero.levelBonus = hero.levelBonus || { hp: 0, dmg: 0, mana: 0, end: 0 };
  
  // Per-class growth constants
  const GROWTH = {
    warrior:   { hp: 40,  dmg: 1.2, mana: 0,  end: 3 },
    ranger:    { hp: 30,  dmg: 1.6, mana: 10, end: 2 },
    cleric:    { hp: 28,  dmg: 1.0, mana: 18, end: 0 },
    wizard:    { hp: 18,  dmg: 2.0, mana: 20, end: 0 },
    enchanter: { hp: 22,  dmg: 1.2, mana: 20, end: 0 },
  };
  
  // Get growth for this class (default to warrior if unknown)
  const g = GROWTH[hero.classKey] || { hp: 40, dmg: 1.2, mana: 0, end: 3 };
  
  // Accumulate bonuses (these persist on the hero object)
  hero.levelBonus.hp += g.hp;
  hero.levelBonus.dmg += g.dmg;
  hero.levelBonus.mana += g.mana;
  hero.levelBonus.end += g.end;
  
  // Recalculate all derived stats with new bonuses
  refreshHeroDerived(hero);
  
  // Healing scales with class damage growth
  hero.healing = (hero.healing || 5) * 1.10;
  
  // Warrior double attack progression
  if (hero.classKey === "warrior") {
    const cap = doubleAttackCap(hero.level);
    if (hero.level >= 5 && (hero.doubleAttackSkill == null || hero.doubleAttackSkill < 1)) {
      hero.doubleAttackSkill = 1;
    }
    if (hero.doubleAttackSkill != null) {
      hero.doubleAttackSkill = Math.min(hero.doubleAttackSkill, cap);
    }
  }
  
  // Reset skill cooldowns so new level feels responsive
  if (hero.skillTimers) {
    for (const key of Object.keys(hero.skillTimers)) {
      hero.skillTimers[key] = 0;
    }
  }
}

export function applyHeroLevelUp(hero) {
  const cost = heroLevelUpCost(hero);
  if (!hero.xp) hero.xp = 0;
  if (hero.xp < cost) return; // Not enough XP

  hero.xp -= cost;
  applyLevelScaling(hero);
}

export function levelHeroTo(hero, targetLevel) {
  const desired = Math.max(1, Math.floor(targetLevel || 1));
  while ((hero.level || 1) < desired) {
    applyLevelScaling(hero);
  }
}

// Project 1999-style XP curve for Account leveling
function p99Multiplier(level) {
  if (level >= 45) return 1.4;
  if (level >= 40) return 1.3;
  if (level >= 35) return 1.2;
  if (level >= 30) return 1.1;
  return 1.0;
}

// Total XP required at end of level (matches P99 pattern)
function totalXpAtEnd(level) {
  return Math.floor(1000 * Math.pow(level, 3) * p99Multiplier(level));
}

// XP needed to complete current level (exported for reuse)
export function p99XpToNext(level) {
  if (level <= 0) return 0;
  const baseCost = totalXpAtEnd(level) - totalXpAtEnd(level - 1);
  const multiplier = 1 - (XP_TEST_REDUCTION_PERCENT / 100);
  return Math.floor(baseCost * multiplier);
}

// Account XP gain multiplier (slower after level 10)
function accountXPMult(accountLevel) {
  return accountLevel <= 10 ? 1.0 : 0.6;
}

// Calculate what level you should be given total XP with current reduction
export function calculateLevelFromTotalXP(totalXP) {
  let level = 1;
  let xpUsed = 0;
  
  // Keep leveling up until we run out of XP
  while (level < 100) { // Safety cap at level 100
    const xpForNextLevel = p99XpToNext(level);
    if (xpUsed + xpForNextLevel > totalXP) {
      // Not enough XP for next level
      break;
    }
    xpUsed += xpForNextLevel;
    level++;
  }
  
  return {
    level: level,
    xpIntoCurrentLevel: totalXP - xpUsed,
    xpForNextLevel: p99XpToNext(level)
  };
}

function resolveEnemyLevel(enemyDef, zoneNumber) {
  const zoneBase = zoneNumber || 1;

  // Explicit single level wins
  if (Number.isFinite(enemyDef?.level)) {
    return enemyDef.level;
  }

  // Range support: levelMin/levelMax (inclusive)
  const hasMin = Number.isFinite(enemyDef?.levelMin);
  const hasMax = Number.isFinite(enemyDef?.levelMax);
  if (hasMin && hasMax) {
    const min = enemyDef.levelMin;
    const max = enemyDef.levelMax;
    if (max <= min) return min;
    return min + randInt(max - min + 1);
  }
  if (hasMin && !hasMax) {
    return enemyDef.levelMin;
  }
  if (!hasMin && hasMax) {
    // If only max provided, pick up to max but at least zone base
    const min = zoneBase;
    const max = enemyDef.levelMax;
    if (max <= min) return max;
    return min + randInt(max - min + 1);
  }

  // Default: zone-based roll (zone .. zone+2)
  return zoneBase + randInt(3);
}

export function checkAccountLevelUp() {
  if (!state.accountLevelUpCost) {
    state.accountLevelUpCost = p99XpToNext(state.accountLevel);
  }
  while (state.accountLevelXP >= state.accountLevelUpCost) {
    state.accountLevelXP -= state.accountLevelUpCost;
    state.accountLevel += 1;
    // Use P99 curve for next level requirement
    state.accountLevelUpCost = p99XpToNext(state.accountLevel);
    addLog(`SYSTEM: Account reaches level ${state.accountLevel}!`, "xp");
  }
}

export function spawnEnemy() {
  const z = state.zone;
  const zoneDef = getZoneDef(z);

  // Town zones have no combat
  if (zoneDef?.isTown) {
    state.currentEnemies = [];
    state.waitingToRespawn = false;
    return;
  }
  // Enemy level is zone-based by default; allow explicit level or ranges on the template

  // Get enemy definition from zone
  const discovery = getDiscoveryState(z);
  const enemyDef = getEnemyForZone(z, discovery);
  if (!enemyDef) {
    addLog("No enemies in this zone!");
    return;
  }
  const level = resolveEnemyLevel(enemyDef, z);
  
  // Scale enemy stats based on level
  const enemy = buildEnemyFromTemplate(enemyDef, level);
  enemy.drops = rollLoot(enemyDef, getZoneDef(z));
  applyEnemyEquipmentBonuses(enemy, enemy.drops);
  enemy.hp = enemy.maxHP;
  
  // Initialize swing timer
  initializeSwingTimer(enemy);

  state.currentEnemies = [enemy];
  state.waitingToRespawn = false;
  addLog(`A level ${level} ${enemyDef.name} appears in Zone ${z}.`);
  
  // Track named spawn for smoothing system
  if (enemyDef.isNamed) {
    onNamedSpawned(state.activeZoneId || zoneDef?.id);
  }
  
  // Check for immediate reinforcement chance
  checkForReinforcement();
}

function spawnEnemyToList() {
  const z = state.zone;
  const zoneDef = getZoneDef(z);
  if (zoneDef?.isTown) return;
  
  // Get enemy definition from zone
  const discovery = getDiscoveryState(z);
  const enemyDef = getEnemyForZone(z, discovery);
  if (!enemyDef) return;
  const level = resolveEnemyLevel(enemyDef, z);
  
  // Scale enemy stats based on level
  const enemy = buildEnemyFromTemplate(enemyDef, level);
  enemy.drops = rollLoot(enemyDef, getZoneDef(z));
  applyEnemyEquipmentBonuses(enemy, enemy.drops);
  enemy.hp = enemy.maxHP;
  
  // Initialize resist stats
  ensureActorResists(enemy);
  
  // Initialize swing timer
  initializeSwingTimer(enemy);

  state.currentEnemies.push(enemy);
  addLog(`Oh no! Your luck is not on your side - another ${enemyDef.name} takes notice of your presence!`, "damage_taken");
  
  // Track named spawn for smoothing system
  if (enemyDef.isNamed) {
    onNamedSpawned(state.activeZoneId || zoneDef?.id);
  }
}

export { spawnEnemyToList };

// Toggle target dummy for testing
export function toggleTargetDummy() {
  // Check if dummy already exists
  const dummyIndex = state.currentEnemies.findIndex(e => e.name === "Target Dummy");
  
  if (dummyIndex >= 0) {
    // Despawn dummy
    state.currentEnemies.splice(dummyIndex, 1);
    addLog("Target Dummy despawned.", "normal");
  } else {
    // Spawn dummy
    const dummy = {
      name: "Target Dummy",
      level: 1,
      baseHP: 10000,
      baseDamage: 0,
      baseMana: 0,
      stats: { str: 0, con: 0, dex: 0, agi: 0, ac: 0, wis: 0, int: 0, cha: 0 },
      maxHP: 10000,
      hp: 10000,
      dps: 0,
      xp: 0,
      debuffs: [],
      resourceType: null,
      primaryStat: null,
      maxMana: 0,
      mana: 0,
      activeBuffs: {}
    };
    state.currentEnemies.push(dummy);
    addLog("Target Dummy spawned.", "normal");
  }
}

function checkForReinforcement() {
  // Each enemy has 5% chance per tick to call reinforcements (when in combat)
  // Don't spawn reinforcements if only a target dummy is present
  if (state.currentEnemies.length > 0) {
    const hasRealEnemy = state.currentEnemies.some(e => e.name !== "Target Dummy");
    if (!hasRealEnemy) return; // Skip reinforcements if only target dummy
    
    const zone = getZoneDef(state.zone);
    let reinforcementChance = zone?.aggroChance ?? 0.05;

    // If any enemy is currently feared, scale aggro risk by the fear's defined multiplier
    const fearMultipliers = state.currentEnemies
      .filter(e => hasBuff(e, "fear"))
      .map(e => getBuff(e, "fear")?.fearAggroMultiplier ?? 1.0);
    if (fearMultipliers.length > 0) {
      const maxMult = Math.max(...fearMultipliers, 1.0);
      reinforcementChance = Math.min(0.9, reinforcementChance * maxMult);
    }

    if (Math.random() < reinforcementChance) {
      spawnEnemyToList();
    }
  }
}

function checkSlotUnlocks() {
  for (const rule of ACCOUNT_SLOT_UNLOCKS) {
    if (state.accountLevel >= rule.level && state.partySlotsUnlocked < rule.slots) {
      state.partySlotsUnlocked = rule.slots;
      addLog(`SYSTEM: Your growing renown allows up to ${rule.slots} party members.`);
    }
  }
}

function partyReferenceLevel() {
  const living = state.party.filter(h => !h.isDead);
  if (living.length === 0) return 1;
  const avg = living.reduce((sum, h) => sum + (h.level || 1), 0) / living.length;
  return Math.max(1, Math.floor(avg));
}

function computeKillXP(enemy) {
  const mobLevel = enemy.level || state.zone || 1;
  const referenceLevel = partyReferenceLevel();
  const delta = mobLevel - referenceLevel;

  // Base XP from mob level only
  const baseXP = 75 * mobLevel * mobLevel;

  // Lower-level penalty only; no bonus for higher-level mobs
  let levelMult;
  if (delta >= 0) {
    levelMult = 1.0;
  } else if (delta <= -10) {
    levelMult = 0;
  } else {
    levelMult = 1.0 - (Math.abs(delta) / 10.0);
  }

  const killXP = Math.floor(baseXP * levelMult);
  return { killXP, baseXP, levelMult, delta, referenceLevel, mobLevel };
}

function tryStackItem(slot, itemDef, quantity) {
  if (!slot || slot.id !== itemDef.id) return { stacked: 0 };
  const maxStack = itemDef.maxStack || 1;
  if (maxStack <= 1) return { stacked: 0 };
  const room = maxStack - (slot.quantity || 0);
  if (room <= 0) return { stacked: 0 };
  const stacked = Math.min(room, quantity);
  slot.quantity = (slot.quantity || 0) + stacked;
  return { stacked };
}

function awardLoot(enemy) {
  const results = [];
  const drops = enemy?.drops || [];
  if (drops.length === 0) return results;

  const unlockedSlots = 30;
  let remaining = 0;
  
  // Sum up all drop quantities
  for (const drop of drops) {
    remaining += drop.quantity || 1;
  }

  let totalPlaced = 0;

  for (const drop of drops) {
    const itemDef = getItemDef(drop.id);
    if (!itemDef) continue;
    let qty = drop.quantity || 1;
    let placed = 0;

    // First try stacking in shared inventory
    for (let i = 0; i < unlockedSlots && qty > 0; i++) {
      const slot = state.sharedInventory[i];
      const { stacked } = tryStackItem(slot, itemDef, qty);
      qty -= stacked;
      placed += stacked;
    }

    // Then place into empty slots
    for (let i = 0; i < unlockedSlots && qty > 0; i++) {
      if (state.sharedInventory[i] == null) {
        const toAdd = Math.min(qty, itemDef.maxStack || qty);
        state.sharedInventory[i] = { id: itemDef.id, quantity: toAdd };
        qty -= toAdd;
        placed += toAdd;
      }
    }

    if (placed > 0) {
      results.push(`Loots ${placed > 1 ? placed + 'x ' : ''}${itemDef.name}.`);
      totalPlaced += placed;
    }
  }

  return results;
}

function onEnemyKilled(enemy, totalDPS) {
  const { killXP } = computeKillXP(enemy);
  const zoneDef = getZoneDef(state.zone);
  const copper = resolveCopperReward(enemy, zoneDef);
  const lootAwarded = awardLoot(enemy);

  // Apply group bonus based on LIVING party size only
  const livingPartySize = state.party.filter(h => !h.isDead).length;
  const groupBonus = 1.0 + (livingPartySize - 1) * 0.1; // 1.0x, 1.1x, 1.2x, 1.3x, 1.4x, 1.5x
  const totalXP = killXP * groupBonus;
  const totalXPRounded = Math.floor(totalXP);

  state.totalXP += totalXPRounded;
  state.currencyCopper += copper;
  updateCurrencyDisplay();
  state.killsThisZone += 1;

  // Track total kills by zone id
  const zid = state.activeZoneId || getZoneDef(state.zone)?.id;
  if (zid) {
    state.zoneKillCounts = state.zoneKillCounts || {};
    state.zoneKillCounts[zid] = (state.zoneKillCounts[zid] || 0) + 1;
    debugLog(state, `[KILL] Zone ${state.zone} (id=${zid}): zoneKillCounts[${zid}]=${state.zoneKillCounts[zid]}, killsThisZone=${state.killsThisZone}`);
    
    // Track named spawn smoothing (Phase 3)
    onMobKilled(enemy, zid);
  }

  // Calculate level-weighted XP distribution (only for living heroes)
  // weight = level^2
  let totalWeight = 0;
  for (const hero of state.party) {
    if (!hero.isDead) {
      totalWeight += hero.level * hero.level;
    }
  }

  // Distribute XP proportionally by level weight (only to living heroes)
  if (totalWeight > 0 && totalXPRounded > 0) {
    const breakdown = [];
    for (const hero of state.party) {
      if (!hero.isDead) {
        if (!hero.xp) hero.xp = 0;
        const heroWeight = hero.level * hero.level;
        const heroShare = totalXPRounded * (heroWeight / totalWeight);
        hero.xp += heroShare;
        if (state.showXPBreakdown) {
          breakdown.push({ name: hero.name, share: heroShare });
        }
      }
    }
    if (state.showXPBreakdown && breakdown.length > 0) {
      const parts = breakdown.map(h => `${h.name} +${h.share.toFixed(1)} XP`);
      addLog(`XP breakdown: ${parts.join(', ')}`, "gold");
    }
  }

  // Award to account (use total XP with account multiplier)
  const accountXP = totalXPRounded * accountXPMult(state.accountLevel);
  state.accountLevelXP += accountXP;
  checkAccountLevelUp();

  // Passive sub-area discovery rolls
  const zoneKey = getZoneKey(state.zone);
  const currentDiscovery = getDiscoveryState(state.zone);
  const { discoveredIds, updated } = rollSubAreaDiscoveries(state.zone, currentDiscovery);
  state.zoneDiscoveries[zoneKey] = updated;
  if (discoveredIds.length > 0) {
    const zone = getZoneDef(state.zone);
    for (const id of discoveredIds) {
      const sub = zone?.subAreas?.find(s => s.id === id);
      if (sub) {
        addLog(`You discover ${sub.name} in ${zone.name}!`, "xp");
      }
    }
  }

  addLog(`Your party defeats the level ${enemy.level} ${enemy.name}, dealing ${totalDPS.toFixed(1)} damage. +${Math.floor(totalXP)} XP, +${formatPGSC(copper)}.`, "gold");
  if (lootAwarded.length > 0) {
    for (const msg of lootAwarded) addLog(msg, "gold");
  }
  state.currentEnemy = null;
  state.waitingToRespawn = true;
  state.huntRemaining = HUNT_TIME_MS; // Start hunt timer
}

function onPartyWipe() {
  addLog("Your party is overwhelmed and wiped out. You drag your corpses back to the campfire...", "damage_taken");
  const lostCopper = Math.floor(state.currencyCopper * 0.15);
  state.currencyCopper = Math.max(0, state.currencyCopper - lostCopper);
  state.killsThisZone = 0;
  state.partyHP = Math.floor(state.partyMaxHP * 0.5);
  addLog(`You lost ${lostCopper} copper and must rebuild your momentum in this zone.`, "damage_taken");
  
  state.currentEnemies = [];
  state.waitingToRespawn = true;
  addLog("Your party will begin reviving in 60 seconds.", "normal");
}

export function killsRequiredForZone(z) {
  return 10 + z * 2;
}

export function canTravel() {
  // Dynamic per-zone kill requirement
  return state.killsThisZone >= killsRequiredForZone(state.zone);
}

function meetsZoneRequirement(nextZoneDef) {
  const req = nextZoneDef?.requirements;
  if (!req) return true;

  // Map-style unlock: "kills in X zone"
  if (req.killsIn?.zoneId && typeof req.killsIn.count === "number") {
    const have = state.zoneKillCounts?.[req.killsIn.zoneId] ?? 0;
    const meets = have >= req.killsIn.count;
    debugLog(state, `[ZONE REQ] ${nextZoneDef?.name}: need ${req.killsIn.count} kills in ${req.killsIn.zoneId}, have ${have}, meets=${meets}`);
    return meets;
  }

  return true;
}

export function canTravelForward() {
  if (state.zone >= MAX_ZONE) return false;
  
  // Already unlocked by visiting before
  if (state.zone < state.highestUnlockedZone) return true;

  // Requirement for the *next* zone
  const next = getZoneDef(state.zone + 1);
  const reqMet = next && meetsZoneRequirement(next);
  const momentumOk = canTravel();
  
  debugLog(state, `[TRAVEL] Zone ${state.zone} -> ${state.zone + 1}: reqMet=${reqMet}, momentum=${state.killsThisZone}/${killsRequiredForZone(state.zone)} ok=${momentumOk}`);
  
  if (next && !reqMet) return false;

  // Still require momentum (kills in current zone)
  return momentumOk;
}

export function travelToNextZone() {
  if (state.zone >= MAX_ZONE) {
    addLog("SYSTEM: You have reached the end of the known world.", "damage_taken");
    return;
  }
  if (!canTravelForward()) return;
  state.zone += 1;
  state.activeZoneId = getZoneDef(state.zone)?.id || state.activeZoneId;
  state.killsThisZone = 0;
  addLog(`SYSTEM: You travel deeper into the wilds to Zone ${state.zone}.`);
  // Mark zone as unlocked for free travel later
  state.highestUnlockedZone = Math.max(state.highestUnlockedZone, state.zone);
  spawnEnemy();
  checkSlotUnlocks();
}

export function travelToPreviousZone() {
  if (state.zone <= 1) return;
  state.zone -= 1;
  state.activeZoneId = getZoneDef(state.zone)?.id || state.activeZoneId;
  state.killsThisZone = 0;
  addLog(`SYSTEM: You retreat to Zone ${state.zone}.`);
  spawnEnemy();
  checkSlotUnlocks();
}

function checkCampThresholds() {
  // Calculate party stat percentages
  const healthPercent = state.partyMaxHP > 0 ? (state.partyHP / state.partyMaxHP) * 100 : 100;
  
  // Calculate total mana and endurance
  let totalMana = 0;
  let maxMana = 0;
  let totalEndurance = 0;
  let maxEndurance = 0;
  
  for (const hero of state.party) {
    if (!hero.isDead) {
      totalMana += hero.mana || 0;
      maxMana += hero.maxMana || 0;
      totalEndurance += hero.endurance || 0;
      maxEndurance += hero.maxEndurance || 0;
    }
  }
  
  const manaPercent = maxMana > 0 ? (totalMana / maxMana) * 100 : 100;
  const endurancePercent = maxEndurance > 0 ? (totalEndurance / maxEndurance) * 100 : 100;
  
  // Check if any threshold is breached
  const reasons = [];
  if (healthPercent < state.campThresholds.health) {
    reasons.push(`Health ${healthPercent.toFixed(0)}% < ${state.campThresholds.health}%`);
  }
  if (manaPercent < state.campThresholds.mana) {
    reasons.push(`Mana ${manaPercent.toFixed(0)}% < ${state.campThresholds.mana}%`);
  }
  if (endurancePercent < state.campThresholds.endurance) {
    reasons.push(`Endurance ${endurancePercent.toFixed(0)}% < ${state.campThresholds.endurance}%`);
  }
  
  if (reasons.length > 0) {
    return { shouldCamp: true, reasons };
  }
  return { shouldCamp: false, reasons: [] };
}

// Meditate skill helper: get skill cap by level
export function getMeditateCap(level) {
  if (level < MEDITATE_UNLOCK_LEVEL) return 0;
  return Math.min(MEDITATE_SKILL_HARD_CAP, level * 5);
}

// Meditate tick: mana regen with meditate bonus and skill progression
function meditateTick(hero) {
  // Only casters with mana
  if (!hero.maxMana || hero.maxMana <= 0) return;
  
  // Get skill cap
  const cap = getMeditateCap(hero.level);
  
  // Initialize meditateSkill if missing (old saves)
  if (hero.meditateSkill === undefined) {
    hero.meditateSkill = 0;
  }
  
  // Unlock at level 5: initialize skill to 10 if it's 0
  if (hero.level >= MEDITATE_UNLOCK_LEVEL && hero.meditateSkill === 0) {
    hero.meditateSkill = Math.min(10, cap);
  }
  
  // Base mana regen: use stat-based manaRegenPerTick (scaled for 2-tick interval)
  const baseManaRegen = Math.max(1, Math.floor((hero.manaRegenPerTick || 0) * REGEN_TICK_MULT));
  
  // Meditate bonus (only if level >= 5)
  let meditateBonusPerTick = 0;
  if (hero.level >= MEDITATE_UNLOCK_LEVEL && cap > 0) {
    const skillNorm = Math.min(1, hero.meditateSkill / MEDITATE_SKILL_HARD_CAP);
    const levelNorm = Math.min(1, (hero.level - MEDITATE_UNLOCK_LEVEL) / 55);
    const meditateBonus = 2 + 18 * Math.pow(skillNorm, 0.9);
    const levelFactor = 0.25 + 0.75 * levelNorm;
    meditateBonusPerTick = Math.floor(meditateBonus * levelFactor);
  }
  
  // Total regen before combat multiplier
  const gearRegen = hero.gearManaRegen || 0;
  const buffRegen = hero.buffManaRegen || 0;
  const totalRegenRaw = baseManaRegen + meditateBonusPerTick + gearRegen + buffRegen;
  
  // Apply combat multiplier
  const stateMult = hero.inCombat ? COMBAT_REGEN_MULT : OOC_REGEN_MULT;
  let regenAfterState = totalRegenRaw * stateMult;
  
  // Apply missing-mana bonus ONLY if out-of-combat
  if (!hero.inCombat) {
    const manaPct = Math.max(0, Math.min(1, hero.mana / hero.maxMana));
    if (manaPct < 0.5) {
      // Missing-mana multiplier: scales from 1.00x at 50% to 1.50x at 0%
      const missingManaMult = 1.0 + (0.5 - manaPct) * 1.0;
      regenAfterState = regenAfterState * missingManaMult;
    }
  }
  
  const manaRegenThisTick = Math.floor(regenAfterState);
  
  // Apply regen and detect if mana actually increased
  const manaBefore = hero.mana;
  const manaAfter = Math.min(hero.maxMana, manaBefore + manaRegenThisTick);
  const didRegenMana = manaAfter > manaBefore;
  hero.mana = manaAfter;
  
  // Log mana regen if it occurred
  const actualManaRegen = manaAfter - manaBefore;
  if (didRegenMana && actualManaRegen > 0.1) {
    addLog(`${hero.name} regenerates ${actualManaRegen.toFixed(1)} mana!`, "mana_regen");
  }
  
  // Meditate skill-up: only OOC, only if mana increased, only if skill < cap
  if (!hero.inCombat && didRegenMana && hero.level >= MEDITATE_UNLOCK_LEVEL && hero.meditateSkill < cap) {
    const skillNorm = Math.min(1, hero.meditateSkill / MEDITATE_SKILL_HARD_CAP);
    const skillUpChance = Math.max(0.01, Math.min(0.06, 0.06 - skillNorm * 0.05));
    // FIX 15: Apply skill-up rate multiplier to normalize for tickrate
    if (Math.random() < skillUpChance * SKILL_UP_RATE_MULT) {
      hero.meditateSkill = Math.min(hero.meditateSkill + 1, cap);
      // Request a single stats modal refresh this tick
      state.needsSkillsUiRefresh = true;
    }
  }
}

// Apply a buff to a hero
export function applyBuff(hero, buffKey, durationMs, data = {}, nowMs = state.nowMs ?? 0) {
  hero.activeBuffs = hero.activeBuffs || {};
  hero.activeBuffs[buffKey] = {
    expiresAt: nowMs + durationMs,
    data
  };
}

// Check if a hero has an active buff
export function hasBuff(hero, buffKey, nowMs = state.nowMs ?? 0) {
  if (!hero.activeBuffs) return false;
  const buff = hero.activeBuffs[buffKey];
  if (!buff) return false;
  // Check if buff has expired
  if (isExpiredEffect(buff, nowMs)) {
    delete hero.activeBuffs[buffKey];
    return false;
  }
  return true;
}

// Remove a buff immediately (used for one-hit runes and break-on-damage controls)
export function removeBuff(hero, buffKey) {
  if (!hero?.activeBuffs) return;
  if (hero.activeBuffs[buffKey]) {
    delete hero.activeBuffs[buffKey];
  }
}

// Get buff data if active
export function getBuff(hero, buffKey) {
  if (!hasBuff(hero, buffKey)) return null;
  return hero.activeBuffs[buffKey].data;
}

// Clean up expired buffs for a hero
function cleanupExpiredBuffs(hero) {
  if (!hero.activeBuffs) return;
  const now = state.nowMs ?? 0;
  purgeExpiredActive(hero.activeBuffs, now);
}

// Courage buff handler - applies AC and HP bonus
export function applyCourageBuff(hero, clericLevel) {
  const acBonus = Math.min(7, 3 + Math.floor((clericLevel - 3) / 2));
  const hpBonus = Math.min(11, 6 + Math.floor((clericLevel - 3) / 2));
  
  const durationMinutes = Math.min(25, 3 + (clericLevel - 3) * 3);
  const durationMs = durationMinutes * 60 * 1000;
  
  applyBuff(hero, "courage", durationMs, { acBonus, hpBonus });
  
  // Apply immediate HP bonus
  hero.maxHP = (hero.maxHP || 0) + hpBonus;
  if (hero.health > 0) {
    hero.health = Math.min(hero.health + hpBonus, hero.maxHP);
  }
}

// Fortify buff handler - applies AC bonus
export function applyFortifyBuff(hero, warriorLevel) {
  const intervalLevels = 2;
  const perInterval = 1;
  const minLevelForScale = 8;
  let acBonus = 10;
  
  if (intervalLevels > 0 && perInterval !== 0) {
    const steps = Math.floor(Math.max(0, warriorLevel - minLevelForScale) / intervalLevels);
    acBonus += steps * perInterval;
  }
  
  acBonus = Math.min(acBonus, 15); // acMax
  acBonus = Math.max(0, Math.floor(acBonus));
  
  const durationTicks = 8;
  const durationMs = durationTicks * 3000; // GAME_TICK_MS
  
  applyBuff(hero, "fortify", durationMs, { acBonus });
}

// WoodSkin buff handler - AC and CON bonus
export function applyWoodSkinBuff(hero, rangerLevel) {
  // AC scales: +3 @ L8 -> +7 @ L18
  const acBonus = Math.min(7, 3 + Math.floor((rangerLevel - 8) * 4 / 10));
  const conBonus = 2;
  
  // Duration: 3 min @ L8 -> 25 min @ L18
  const durationMinutes = Math.min(25, 3 + Math.floor((rangerLevel - 8) * 22 / 10));
  const durationMs = durationMinutes * 60 * 1000;
  
  applyBuff(hero, "woodskin", durationMs, { acBonus, conBonus });
}

// Hawk Eye buff handler - hit chance bonus
export function applyHawkEyeBuff(hero, rangerLevel) {
  const hitChanceBonus = 2; // +2% to hit
  
  // Duration: 33.3 min @ L11 -> 70 min @ L24
  const durationMinutes = Math.min(70, 33.3 + Math.floor((rangerLevel - 11) * 36.7 / 13));
  const durationMs = durationMinutes * 60 * 1000;
  
  applyBuff(hero, "hawk_eye", durationMs, { hitChanceBonus });
}

function normalizeActionId(skillKey) {
  if (!skillKey) return skillKey;
  if (ACTIONS[skillKey]) return skillKey;
  const snake = skillKey.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  if (ACTIONS[snake]) return snake;
  return skillKey;
}

function getActionTimerStore(actor) {
  if (!actor) return null;
  if (actor.type === "player") {
    actor.skillTimers = actor.skillTimers || {};
    return actor.skillTimers;
  }
  if (actor.type === "mob") {
    if (!actor.actionTimers && actor.spellTimers) {
      actor.actionTimers = actor.spellTimers; // migrate legacy
    }
    actor.actionTimers = actor.actionTimers || {};
    actor.spellTimers = actor.actionTimers; // keep alias for legacy save fields
    return actor.actionTimers;
  }
  return null;
}

function canUseAction(actor, actionDef) {
  if (!actor || !actionDef) return false;
  const allowed = actionDef.allowedUsers || {};
  if (actor.type === "player") {
    const classKey = actor.classKey || actor.className || actor.class;
    return !!allowed.players?.includes(classKey);
  }
  if (actor.type === "mob") {
    return allowed.mobs === true;
  }
  return false;
}

function resolveActionTargets(actionDef, actor, context, explicitTarget = null) {
  if (explicitTarget) return [explicitTarget];
  const enemies = context?.enemies || [];
  const party = context?.party || [];
  switch (actionDef.target) {
    case "enemy": {
      const target = enemies.find(e => e && !e.isDead && (e.hp ?? e.health) > 0) || null;
      return target ? [target] : [];
    }
    case "xt_enemy": {
      if (enemies.length > 1) {
        const candidate = enemies[1];
        const hp = candidate?.hp ?? candidate?.health;
        if (candidate && !candidate.isDead && hp > 0) return [candidate];
      }
      return [];
    }
    case "aoe_enemies": {
      return enemies.filter(e => e && !e.isDead && (e.hp ?? e.health) > 0);
    }
    case "aoe_allies": {
      return party.filter(h => h && !h.isDead);
    }
    case "ally": {
      return party.filter(h => h && !h.isDead);
    }
    case "self":
      return actor ? [actor] : [];
    default:
      return [];
  }
}

function hasActionResources(actor, cost) {
  if (!cost) return { ok: true };
  const manaCost = cost.mana || 0;
  const endCost = cost.endurance || 0;
  if (actor.type === "player") {
    if (manaCost > 0 && (actor.mana ?? 0) < manaCost) return { ok: false, reason: "no_mana" };
    if (endCost > 0 && (actor.endurance ?? 0) < endCost) return { ok: false, reason: "no_endurance" };
  } else if (actor.type === "mob") {
    if (manaCost > 0 && actor.mana != null && actor.mana < manaCost) return { ok: false, reason: "no_mana" };
  }
  return { ok: true };
}

function spendActionResources(actor, cost) {
  if (!cost) return;
  if (actor.type === "player") {
    if (cost.mana) actor.mana = Math.max(0, (actor.mana ?? 0) - cost.mana);
    if (cost.endurance) actor.endurance = Math.max(0, (actor.endurance ?? 0) - cost.endurance);
  } else if (actor.type === "mob") {
    if (cost.mana && actor.mana != null) actor.mana = Math.max(0, actor.mana - cost.mana);
  }
}

function refundActionResources(actor, cost) {
  if (!cost || actor.type !== "player") return;
  if (cost.mana) actor.mana = Math.min(actor.maxMana || actor.mana, (actor.mana ?? 0) + cost.mana);
  if (cost.endurance) actor.endurance = Math.min(actor.maxEndurance || actor.endurance, (actor.endurance ?? 0) + cost.endurance);
}

function setActionCooldown(actor, actionId, cooldownTicks) {
  const timers = getActionTimerStore(actor);
  if (!timers) return;
  timers[actionId] = Math.max(0, cooldownTicks || 0);
}

function tickActionCooldown(actor, actionId) {
  const timers = getActionTimerStore(actor);
  if (!timers) return;
  if (timers[actionId] == null) timers[actionId] = 0;
  timers[actionId] = Math.max(0, timers[actionId] - 1);
}

function breakMesmerizeOnDamage(target) {
  if (hasBuff(target, "mesmerize")) {
    removeBuff(target, "mesmerize");
    addLog(`${target.name} is jolted awake!`, "skill");
  }
}

function performAction(actionId, actionDef, actor, targets, context, quality = { mult: 1, outcome: "full" }) {
  const actorLevel = actor.spellLevel ?? actor.level ?? 1;
  let damageDealt = 0;
  let attempted = true;
  let success = false;
  let refund = false;
  let cooldownOverride = null;

  const primaryTarget = targets?.[0] ?? null;
  const q = Math.max(0, quality?.mult ?? 1);
  const outcome = quality?.outcome || "full";
  const isPartial = q > 0 && q < 1;
  const isResisted = q === 0 || outcome === "resisted";
  const outcomeTag = isPartial ? " (partial)" : "";

  switch (actionId) {
    case "fireblast": {
      if (!primaryTarget) break;
      if (isResisted) { addLog(`${actor.name}'s ${actionDef.name} was resisted by ${primaryTarget.name}.`, "skill"); attempted = true; success = false; break; }
      const scale = actionDef.scaling;
      const bonusSteps = Math.max(0, Math.floor((actorLevel - 1) / (scale.maxDamageBonusIntervalLevels || 1)));
      const maxBonus = Math.min(scale.maxDamageBonusCap || 0, bonusSteps);
      const minDmg = scale.minDamage || 0;
      const maxDmg = (scale.maxDamageBase || 0) + maxBonus;
      const raw = (minDmg + Math.random() * (maxDmg - minDmg)) * q;
      const mitigated = applyACMitigation(raw, primaryTarget);
      primaryTarget.hp = Math.max(0, primaryTarget.hp - mitigated);
      damageDealt += mitigated;
      success = true;
      addLog(`${actor.name} uses ${actionDef.name} (${scale.damageType}) for ${mitigated.toFixed(1)} damage${outcomeTag}!`, "damage_dealt");
      breakMesmerizeOnDamage(primaryTarget);
      break;
    }
    case "iceblast": {
      if (!primaryTarget) break;
      if (isResisted) { addLog(`${actor.name}'s ${actionDef.name} was resisted by ${primaryTarget.name}.`, "skill"); attempted = true; success = false; break; }
      const scale = actionDef.scaling;
      const bonusSteps = Math.max(0, Math.floor((actorLevel - 7) / (scale.maxDamageBonusIntervalLevels || 1)));
      const maxBonus = Math.min(scale.maxDamageBonusCap || 0, bonusSteps);
      const minDmg = scale.minDamage || 0;
      const maxDmg = (scale.maxDamageBase || 0) + maxBonus;
      const raw = (minDmg + Math.random() * (maxDmg - minDmg)) * q;
      const mitigated = applyACMitigation(raw, primaryTarget);
      primaryTarget.hp = Math.max(0, primaryTarget.hp - mitigated);
      damageDealt += mitigated;
      success = true;
      addLog(`${actor.name} uses ${actionDef.name} (${scale.damageType}) for ${mitigated.toFixed(1)} damage${outcomeTag}!`, "damage_dealt");
      breakMesmerizeOnDamage(primaryTarget);
      break;
    }
    case "rain_of_fire": {
      const targetList = targets || [];
      if (targetList.length === 0) break;
      if (isResisted) { addLog(`${actor.name}'s ${actionDef.name} was resisted.`, "skill"); attempted = true; success = false; break; }
      const scale = actionDef.scaling || {};
      const minDmg = scale.minDamage || 0;
      const maxDmg = scale.maxDamage || 0;
      const cleaveLimit = scale.cleaveTargets || targetList.length;
      const chosen = targetList.slice(0, cleaveLimit);
      chosen.forEach((t, idx) => {
        let raw = (minDmg + Math.random() * (maxDmg - minDmg)) * q;
        if (scale.aoeDiminishing && idx >= 3) {
          const diminishCount = idx - 2;
          const diminishPercent = Math.max(0.4, 1.0 - diminishCount * 0.2);
          raw *= diminishPercent;
        }
        const mitigated = applyACMitigation(raw, t);
        t.hp = Math.max(0, t.hp - mitigated);
        damageDealt += mitigated;
        addLog(`${actor.name} scorches ${t.name} for ${mitigated.toFixed(1)} damage${outcomeTag}!`, "damage_dealt");
        breakMesmerizeOnDamage(t);
      });
      success = true;
      break;
    }
    case "arcane_shield": {
      if (hasBuff(actor, "arcane_shield")) {
        refund = true;
        attempted = false;
        break;
      }
      const tempHP = actionDef.scaling?.tempHP ?? 50;
      applyBuff(actor, "arcane_shield", 90000, { tempHP });
      actor.arcaneShieldLockout = actionDef.scaling?.castLockoutTicks ?? 1;
      addLog(`${actor.name} casts ${actionDef.name} and gains a protective shield!`, "normal");
      success = true;
      break;
    }
    case "gather_mana": {
      const manaRestored = Math.floor(Math.min(actor.level ?? 1, 12) * 1.5);
      const newMana = Math.min(actor.maxMana ?? actor.mana ?? 0, (actor.mana ?? 0) + manaRestored);
      const actualRestored = newMana - (actor.mana ?? 0);
      actor.mana = newMana;
      if (actualRestored > 0) {
        addLog(`${actor.name} gathers mana, restoring ${actualRestored.toFixed(0)} mana!`, "skill");
      }
      success = true;
      break;
    }
    case "shot": {
      if (!primaryTarget) break;
      const scale = actionDef.scaling || {};
      const scaledDamage = Math.min(scale.scalesTo ?? scale.minDamage, (scale.minDamage || 2) + Math.floor(Math.max(0, (actorLevel - 1) * 3 / 7)));
      const calcDamage = scale.scaleLevel ? Math.min(scale.scalesTo ?? scaledDamage, scaledDamage) : scaledDamage;
      const mitigated = applyACMitigation(calcDamage, primaryTarget);
      primaryTarget.hp = Math.max(0, primaryTarget.hp - mitigated);
      damageDealt += mitigated;
      success = true;
      addLog(`${actor.name} uses ${actionDef.name} for ${mitigated.toFixed(1)} damage!`, "damage_dealt");
      breakMesmerizeOnDamage(primaryTarget);
      break;
    }
    case "flame_lick": {
      if (!primaryTarget) break;
      if (isResisted) { addLog(`${actor.name}'s ${actionDef.name} was resisted by ${primaryTarget.name}.`, "skill"); attempted = true; success = false; break; }
      const scale = actionDef.scaling || {};
      let durationTicks = scale.durationTicks ?? 6;
      if (isPartial) durationTicks = Math.max(1, Math.floor(durationTicks * q));
      const durationMs = durationTicks * GAME_TICK_MS;
      const steps = Math.max(0, Math.floor(Math.max(0, actorLevel - (scale.dotScaleFromLevel ?? 3)) * 2 / 3));
      const dotDamage = Math.max(1, Math.min(scale.dotMax ?? 3, Math.floor(((scale.dotBase ?? 1) + steps) * q)));
      applyBuff(primaryTarget, "flame_lick", durationMs, {
        durationTicks,
        dotDamagePerTick: dotDamage,
        acReduction: scale.acReduction || 3,
        sourceHero: actor.name,
        effectMult: q  // Store resist mult for damage calculation
      });
      addLog(`${actor.name} casts ${actionDef.name} on ${primaryTarget.name}! Fire burns for ${durationTicks} ticks (${dotDamage} dmg/tick, -${scale.acReduction || 3} AC)${outcomeTag}!`, "skill");
      success = true;
      break;
    }
    case "salve": {
      const healable = (context?.party || []).filter(h => !h.isDead && h.health < h.maxHP);
      if (healable.length === 0) {
        refund = true;
        attempted = false;
        break;
      }
      const target = healable.reduce((lowest, h) => {
        const missing = h.maxHP - h.health;
        const lowMissing = lowest.maxHP - lowest.health;
        return missing > lowMissing ? h : lowest;
      }, healable[0]);
      const scale = actionDef.scaling || {};
      const baseHeal = (scale.minHeal || 0) + Math.random() * ((scale.maxHeal || scale.minHeal || 0) - (scale.minHeal || 0));
      const healAmount = Math.min(baseHeal, target.maxHP - target.health);
      target.health += healAmount;
      addLog(`${actor.name} applies ${actionDef.name} to ${target.name} for ${healAmount.toFixed(1)} healing!`, "healing");
      success = true;
      break;
    }
    case "woodskin": {
      const needsBuff = (context?.party || []).find(h => !h.isDead && !hasBuff(h, "woodskin"));
      if (!needsBuff) {
        refund = true;
        attempted = false;
        break;
      }
      applyWoodSkinBuff(needsBuff, actor.level || actorLevel);
      addLog(`${actor.name} casts ${actionDef.name} on ${needsBuff.name}!`, "normal");
      success = true;
      break;
    }
    case "hawk_eye": {
      if (hasBuff(actor, "hawk_eye")) {
        refund = true;
        attempted = false;
        break;
      }
      applyHawkEyeBuff(actor, actor.level || actorLevel);
      addLog(`${actor.name} focuses with ${actionDef.name}, gaining +2% to hit!`, "skill");
      success = true;
      break;
    }
    case "minor_heal":
    case "healing": {
      const healable = (context?.party || []).filter(h => !h.isDead && h.health < h.maxHP);
      if (healable.length === 0) {
        refund = true;
        attempted = false;
        break;
      }
      const target = healable.reduce((lowest, h) => {
        const missing = h.maxHP - h.health;
        const lowMissing = lowest.maxHP - lowest.health;
        return missing > lowMissing ? h : lowest;
      }, healable[0]);
      const scale = actionDef.scaling || {};
      const minHeal = scale.minHeal || 0;
      const maxHeal = scale.maxHeal || minHeal;
      const baseHeal = (minHeal + Math.random() * (maxHeal - minHeal)) * q;
      const healAmount = Math.min(baseHeal, target.maxHP - target.health);
      target.health += healAmount;
      addLog(`${actor.name} casts ${actionDef.name} on ${target.name} for ${healAmount.toFixed(1)} healing${outcomeTag}!`, "healing");
      success = true;
      break;
    }
    case "courage": {
      const needsBuff = (context?.party || []).find(h => !h.isDead && !hasBuff(h, "courage"));
      if (!needsBuff) {
        refund = true;
        attempted = false;
        break;
      }
      applyCourageBuff(needsBuff, actor.level || actorLevel);
      addLog(`${actor.name} casts ${actionDef.name} on ${needsBuff.name}!`, "normal");
      success = true;
      break;
    }
    case "fear": {
      if (!primaryTarget) break;
      if (isResisted) { addLog(`${actor.name}'s ${actionDef.name} was resisted by ${primaryTarget.name}.`, "skill"); attempted = true; success = false; break; }
      const scale = actionDef.scaling || {};
      if (primaryTarget.level > (scale.levelCap ?? 52)) {
        addLog(`${actor.name} attempts ${actionDef.name}, but ${primaryTarget.name} is too powerful.`, "normal");
        success = false;
        break;
      }
      const drCount = primaryTarget.fearDRCount || 0;
      const baseDuration = scale.baseDurationTicks ?? 2;
      const bonusDuration = actorLevel >= (scale.bonusDurationAtLevel ?? 9) ? 1 : 0;
      let effectiveDuration = Math.max(scale.minDurationTicks ?? 1, baseDuration + bonusDuration - drCount);
      if (isPartial) effectiveDuration = Math.max(scale.minDurationTicks ?? 1, Math.floor(effectiveDuration * q));
      const durationMs = effectiveDuration * GAME_TICK_MS;
      let fearAggroMultiplier = scale.fearAggroMultiplier ?? 1.4;
      if (hasBuff(primaryTarget, "root")) {
        fearAggroMultiplier = 1.0;
      } else if (hasBuff(primaryTarget, "snare")) {
        const bonusPortion = fearAggroMultiplier - 1;
        fearAggroMultiplier = 1 + Math.max(0, bonusPortion * 0.5);
      }
      applyBuff(primaryTarget, "fear", durationMs, { durationTicks: effectiveDuration, fleeing: true, fearAggroMultiplier, sourceHero: actor.name, sourceLevel: actor.level, ccGraceTicksRemaining: 1 });
      primaryTarget.fearDRCount = drCount + 1;
      addLog(`${actor.name} casts ${actionDef.name} on ${primaryTarget.name}! ${primaryTarget.name} flees for ${effectiveDuration} ticks${outcomeTag}.`, "skill");
      success = true;
      break;
    }
    case "divine_focus": {
      if (hasBuff(actor, "divine_focus")) {
        refund = true;
        attempted = false;
        break;
      }
      const durationTicks = actionDef.scaling?.durationTicks ?? 4;
      applyBuff(actor, "divine_focus", durationTicks * GAME_TICK_MS, {});
      addLog(`${actor.name} enters Divine Focus for ${durationTicks} ticks, becoming immune to damage.`, "skill");
      success = true;
      break;
    }
    case "feedback": {
      if (!primaryTarget) break;
      if (isResisted) { addLog(`${actor.name}'s ${actionDef.name} was resisted by ${primaryTarget.name}.`, "skill"); attempted = true; success = false; break; }
      const scaled = Math.min(8, 3 + ((actorLevel - 1) * 5) / 4) * q;
      const mitigated = applyACMitigation(scaled, primaryTarget);
      primaryTarget.hp = Math.max(0, primaryTarget.hp - mitigated);
      damageDealt += mitigated;
      addLog(`${actor.name} deals ${mitigated.toFixed(1)} magic damage to ${primaryTarget.name}${outcomeTag}.`, "damage_dealt");
      const canStun = mitigated > 0 && primaryTarget.level <= 30 && !hasBuff(primaryTarget, "stun");
      if (canStun && Math.random() < 0.25) {
        applyBuff(primaryTarget, "stun", GAME_TICK_MS, {});
        addLog(`${primaryTarget.name} is stunned!`, "normal");
      }
      breakMesmerizeOnDamage(primaryTarget);
      success = true;
      break;
    }
    case "mesmerize": {
      if (!primaryTarget) break;
      if (isResisted) { addLog(`${actor.name}'s ${actionDef.name} was resisted by ${primaryTarget.name}.`, "skill"); attempted = true; success = false; break; }
      const durationTicks = actionDef.scaling?.durationTicks ?? 4;
      const finalDuration = isPartial ? Math.max(1, Math.floor(durationTicks * q)) : durationTicks;
      if (hasBuff(primaryTarget, "mesmerize")) {
        attempted = false;
        success = false;
        refund = true;
        break;
      }
      applyBuff(primaryTarget, "mesmerize", finalDuration * GAME_TICK_MS, { sourceHeroId: actor.id, sourceHero: actor.name, sourceLevel: actor.level, ccGraceTicksRemaining: 1 });
      addLog(`${actor.name} mesmerizes ${primaryTarget.name} for ${finalDuration} ticks${outcomeTag}!`, "skill");
      success = true;
      break;
    }
    case "suffocate": {
      if (!primaryTarget) break;
      if (isResisted) { addLog(`${actor.name}'s ${actionDef.name} was resisted by ${primaryTarget.name}.`, "skill"); attempted = true; success = false; cooldownOverride = 1; break; }
      if (hasBuff(primaryTarget, "suffocate")) {
        attempted = false;
        refund = true;
        cooldownOverride = 1;
        break;
      }
      const damage = 13 * q;
      const mitigated = applyACMitigation(damage, primaryTarget);
      primaryTarget.hp = Math.max(0, primaryTarget.hp - mitigated);
      damageDealt += mitigated;
      applyBuff(primaryTarget, "suffocate", 6 * GAME_TICK_MS, { strDebuff: -2, agiDebuff: -2 });
      addLog(`${actor.name} is suffocated (-2 STR, -2 AGI for 6 ticks).`, "skill");
      addLog(`${actor.name} deals ${mitigated.toFixed(1)} magic damage to ${primaryTarget.name}${outcomeTag}.`, "damage_dealt");
      breakMesmerizeOnDamage(primaryTarget);
      success = true;
      break;
    }
    case "lesser_rune": {
      if (hasBuff(actor, "lesser_rune")) {
        refund = true;
        attempted = false;
        break;
      }
      const absorb = Math.min(40, 20 + Math.max(0, actorLevel - 10) * (20 / 8));
      applyBuff(actor, "lesser_rune", 24 * 60 * 60 * 1000, { absorbRemaining: absorb, sourceHeroId: actor.id });
      addLog(`${actor.name} casts ${actionDef.name}, absorbing up to ${absorb.toFixed(0)} damage from the next hit.`, "skill");
      success = true;
      break;
    }
    case "kick":
    case "shield_bash":
    case "melee_basic": {
      if (!primaryTarget) break;
      const scale = actionDef.scaling || {};
      const raw = (scale.minDamage || 0) + Math.random() * ((scale.maxDamage || scale.minDamage || 0) - (scale.minDamage || 0));
      const mitigated = applyACMitigation(raw, primaryTarget);
      primaryTarget.hp = Math.max(0, primaryTarget.hp - mitigated);
      damageDealt += mitigated;
      addLog(`${actor.name} uses ${actionDef.name} for ${mitigated.toFixed(1)} damage!`, "damage_dealt");
      breakMesmerizeOnDamage(primaryTarget);
      success = true;
      break;
    }
    case "cleave": {
      const targetList = targets || [];
      if (targetList.length === 0) break;
      const limit = actionDef.scaling?.cleaveTargets || 1;
      targetList.slice(0, limit).forEach(t => {
        const base = actor.baseDamage || actor.dps || 0;
        const mitigated = applyACMitigation(base, t);
        t.hp = Math.max(0, t.hp - mitigated);
        damageDealt += mitigated;
        addLog(`${actor.name} cleaves ${t.name} for ${mitigated.toFixed(1)} damage!`, "damage_dealt");
        breakMesmerizeOnDamage(t);
      });
      success = true;
      break;
    }
    case "taunt": {
      if (!primaryTarget) break;
      const duration =  actionDef.durationTicks ?? 3;
      primaryTarget.forcedTargetId = actor.id;
      primaryTarget.forcedTargetTicks = duration;
      addLog(`${actor.name} taunts ${primaryTarget.name}, forcing attacks for ${duration} ticks!`, "skill");
      success = true;
      break;
    }
    case "fortify": {
      if (hasBuff(actor, "fortify")) {
        refund = true;
        attempted = false;
        break;
      }
      applyFortifyBuff(actor, actor.level || actorLevel);
      const buffData = getBuff(actor, "fortify");
      if (buffData) {
        addLog(`${actor.name} fortifies, gaining +${buffData.acBonus} AC for 8 ticks.`, "skill");
      }
      success = true;
      break;
    }
    default:
      attempted = false;
      break;
  }

  return { attempted, success, damageDealt, refund, cooldownOverride };
}

export function resolveActionUse({ actor, actionId, target = null, context = {} }) {
  const actionDef = ACTIONS[actionId];
  if (!actionDef) return { cast: false, reason: "no_def" };
  if (!canUseAction(actor, actionDef)) return { cast: false, reason: "not_allowed" };

  // Cooldown gate
  const timers = getActionTimerStore(actor);
  if (timers && timers[actionId] > 0) {
    return { cast: false, reason: "cooldown" };
  }

  const targets = resolveActionTargets(actionDef, actor, context, target);
  if (actionDef.target && targets.length === 0) {
    return { cast: false, reason: "no_target" };
  }

  // Check for spells with cast time - start casting instead of immediate execution
  const hasCastTime = (actionDef.castTimeTicks && actionDef.castTimeTicks > 0);
  const usesMana = ((actionDef.cost?.mana ?? 0) > 0);
  const isSpellKind = (actionDef.kind === "spell");

  // Only route into casting for mana-based or explicit spell actions
  if (hasCastTime && actor.classKey && (usesMana || isSpellKind)) {
    // Optional hard gating: block casting if magic category is locked
    const category = actionDef.specialization;
    if (category && !isMagicCategoryUnlocked(actor, category)) {
      addLog(`You have not unlocked ${category} magic yet.`, "normal");
      return { cast: false, reason: "locked_magic", attempted: false };
    }

    // Verify mana cost using magic skill system
    const manaCost = getFinalManaCost(actor, actionDef);
    const hasMana = (actor.mana ?? 0) >= manaCost;
    
    if (!hasMana) {
      return { cast: false, reason: "no_resources", attempted: false };
    }
    
    const targetId = targets[0]?.id || null;
    const castStart = startCast(actor, actionDef, targetId, state.nowMs, GAME_TICK_MS, {
      reserveMana: false,
      spendManaFn: (hero, amount) => {
        hero.mana = Math.max(0, (hero.mana ?? 0) - amount);
      },
      setCooldownFn: (hero, spell) => {
        const timers = getActionTimerStore(hero);
        if (timers) timers[actionId] = spell.cooldownTicks;
      }
    });
    
    if (!castStart.ok) {
      return { cast: false, reason: castStart.reason, attempted: false };
    }
    
    addLog(`${actor.name} begins casting ${actionDef.name}...`, "skill");
    return { cast: true, target: targets?.[0] || null, attempted: true };
  }

  // Non-casting actions proceed as normal
  const resourceCheck = hasActionResources(actor, actionDef.cost);
  if (!resourceCheck.ok) {
    return { cast: false, reason: resourceCheck.reason || "no_resources", attempted: false };
  }

  spendActionResources(actor, actionDef.cost);

  // Check resist for non-casting actions (instant casts)
  let quality = { mult: 1, outcome: "full" };
  if (actionDef.resist && targets.length > 0) {
    const primaryTarget = targets[0];
    const resistResult = resolveActionResist({
      caster: actor,
      target: primaryTarget,
      action: actionDef
    });
    
    if (resistResult.mult === 0) {
      // Binary resisted: log and skip effect
      addLog(getResistLogMessage(actionDef.name, resistResult.type, false, 0), "skill");
      refundActionResources(actor, actionDef.cost);
      if (true) { // Log resist and cooldown anyway
        const cd = actionDef.cooldownTicks;
        setActionCooldown(actor, actionId, cd);
      }
      return { cast: false, reason: "resisted", attempted: true };
    } else if (resistResult.mult < 1) {
      // Partial: reduce effect
      quality = { mult: resistResult.mult, outcome: "partial" };
      const resistMsg = getResistLogMessage(actionDef.name, resistResult.type, true, resistResult.partialPct);
      if (resistMsg) addLog(resistMsg, "skill");
    }
  }

  const result = performAction(actionId, actionDef, actor, targets, context, quality);

  if (result.refund) {
    refundActionResources(actor, actionDef.cost);
  }

  if (result.attempted !== false) {
    const cd = result.cooldownOverride != null ? result.cooldownOverride : actionDef.cooldownTicks;
    setActionCooldown(actor, actionId, cd);
  }

  return { cast: result.success, damageDealt: result.damageDealt || 0, target: targets?.[0] || null, attempted: result.attempted !== false };
}

function tryEnemyActionUses() {
  if (!state.currentEnemies || state.currentEnemies.length === 0) return;

  for (const enemy of state.currentEnemies) {
    if (!enemy || enemy.hp <= 0) continue;
    enemy.type = enemy.type || "mob";
    enemy.actionTimers = enemy.actionTimers || enemy.spellTimers || {};
    enemy.spellTimers = enemy.actionTimers;

    const actionbook = Array.isArray(enemy.actionbook) ? enemy.actionbook : (Array.isArray(enemy.spellbook) ? enemy.spellbook : []);
    if (actionbook.length === 0) continue;

    for (const actionId of actionbook) {
      tickActionCooldown(enemy, actionId);
    }

    const castChance = enemy.castChancePerTick ?? 0;
    const maxCasts = enemy.maxCastsPerTick ?? 1;
    if (castChance <= 0) continue;
    if (Math.random() > castChance) continue;

    let castsThisTick = 0;
    const readyActions = actionbook.filter(id => (enemy.actionTimers?.[id] ?? 0) === 0);
    while (readyActions.length > 0 && castsThisTick < maxCasts) {
      const pickIndex = randInt(readyActions.length);
      const actionId = readyActions.splice(pickIndex, 1)[0];
      const timers = getActionTimerStore(enemy);
      if (timers && timers[actionId] > 0) continue;

      const result = resolveActionUse({
        actor: enemy,
        actionId,
        context: { enemies: state.party.filter(h => !h.isDead), party: state.currentEnemies }
      });

      if (result.cast) {
        castsThisTick += 1;
      }
    }
  }
}

/**
 * Perform a single hero auto-attack against a target enemy
 */
function performAutoAttack(hero, enemy) {
  if (!enemy || enemy.hp <= 0) return;
  
  // Weapon skill-up roll on swing attempt (hit or miss)
  tryWeaponSkillUp(hero, getEquippedWeaponType(hero), enemy.level);
  
  const debuff = hero.tempDamageDebuffTicks > 0 ? hero.tempDamageDebuffAmount || 0 : 0;
  const attackBaseDamage = Math.max(0, (hero.baseDamage ?? hero.dps ?? 0) - debuff);
  const hitChance = computeHitChance(hero, enemy);
  if (Math.random() > hitChance) {
    addLog(`${hero.name} misses ${enemy.name}.`, "damage_dealt");
    return;
  }

  const isCrit = Math.random() < computeCritChance(hero);
  const rawDamage = computeRawDamage({ ...hero, baseDamage: attackBaseDamage }, isCrit);
  const mitigated = applyACMitigation(rawDamage, enemy);
  enemy.hp = Math.max(0, enemy.hp - mitigated);
  addLog(`${hero.name} hits ${enemy.name} for ${mitigated.toFixed(1)}${isCrit ? " (CRIT)" : ""}!`, "damage_dealt");

  // Warrior: attempt Double Attack skill-up on successful main-hand hit (independent of proc)
  if (hero.classKey === "warrior") {
    const cap = doubleAttackCap(hero.level);
    const skill = hero.doubleAttackSkill || 0;
    if (cap > 0 && skill < cap) {
      const skillChance = doubleAttackSkillUpChance(hero, cap);
      if (skillChance > 0 && Math.random() < skillChance) {
        hero.doubleAttackSkill = Math.min(cap, skill + 1);
        addLog(`${hero.name}'s Double Attack skill increases to ${hero.doubleAttackSkill}!`, "skill");
        // Request a single stats modal refresh this tick
        state.needsSkillsUiRefresh = true;
      }
    }
  }

  // Break mesmerize on any damage taken by the enemy
  if (hasBuff(enemy, "mesmerize")) {
    removeBuff(enemy, "mesmerize");
    addLog(`${enemy.name} is jolted awake!`, "skill");
  }

  // Warrior-only: Double Attack proc (skill-up now handled on main hit above)
  if (hero.classKey === "warrior" && enemy.hp > 0) {
    const cap = doubleAttackCap(hero.level);
    const skill = hero.doubleAttackSkill || 0;
    const procChance = doubleAttackProcChance(skill);
    if (cap > 0 && procChance > 0 && Math.random() < procChance) {
      // Weapon skill-up roll on double attack swing attempt
      tryWeaponSkillUp(hero, getEquippedWeaponType(hero), enemy.level);
      
      const daHitChance = computeHitChance(hero, enemy);
      if (Math.random() <= daHitChance) {
        const daCrit = Math.random() < computeCritChance(hero);
        const daRaw = computeRawDamage({ ...hero, baseDamage: attackBaseDamage }, daCrit);
        const daMitigated = applyACMitigation(daRaw, enemy);
        enemy.hp = Math.max(0, enemy.hp - daMitigated);
        addLog(`${hero.name} strikes again (Double Attack) for ${daMitigated.toFixed(1)}${daCrit ? " (CRIT)" : ""}!`, "skill");
      } else {
        addLog(`${hero.name}'s double attack misses ${enemy.name}.`, "damage_dealt");
      }

      // Note: skill-up no longer rolls here to avoid double-rolls
    }
  }
}

/**
 * Perform a single enemy auto-attack against a random party member
 */
function performEnemyAutoAttack(enemy, livingMembers) {
  if (!livingMembers || livingMembers.length === 0) return;
  
  // Single-target damage: pick one living member to take the hit
  let target = null;
  if (enemy.forcedTargetId && enemy.forcedTargetTicks > 0) {
    target = livingMembers.find(h => h.id === enemy.forcedTargetId);
    if (!target) {
      enemy.forcedTargetId = null;
      enemy.forcedTargetTicks = 0;
    }
  }
  if (!target) {
    target = livingMembers[randInt(livingMembers.length)];
  }
  
  const hitChance = computeHitChance(enemy, target);
  if (Math.random() > hitChance) {
    addLog(`${enemy.name} misses ${target.name}.`, "damage_taken");
    return;
  }

  const isCrit = Math.random() < computeCritChance(enemy);
  const rawDamage = computeRawDamage(enemy, isCrit);
  const mitigated = applyACMitigation(rawDamage, target);
  
  // Divine Focus: complete immunity to incoming damage
  if (hasBuff(target, "divine_focus")) {
    addLog(`${enemy.name} attacks ${target.name}, but Divine Focus makes them immune.`, "skill");
    return;
  }

  // Apply tempHP absorption (e.g., from Arcane Shield buff)
  let damageToHealth = mitigated;
  const arcaneShieldBuff = getBuff(target, "arcane_shield");
  if (arcaneShieldBuff && arcaneShieldBuff.data && arcaneShieldBuff.data.tempHP > 0) {
    const tempHPAbsorbed = Math.min(arcaneShieldBuff.data.tempHP, damageToHealth);
    arcaneShieldBuff.data.tempHP -= tempHPAbsorbed;
    damageToHealth -= tempHPAbsorbed;
  }

  // Apply Lesser Rune (single-hit absorb, then removed)
  const runeData = getBuff(target, "lesser_rune");
  if (runeData) {
    const absorbRemaining = runeData.absorbRemaining ?? 0;
    const absorbed = Math.min(absorbRemaining, damageToHealth);
    damageToHealth -= absorbed;
    removeBuff(target, "lesser_rune");
    addLog(`${target.name}'s Lesser Rune absorbs ${absorbed.toFixed(1)} damage and shatters.`, "skill");
  }
  
  target.health = Math.max(0, target.health - damageToHealth);
  if (damageToHealth > 0) {
    addLog(`${enemy.name} attacks ${target.name} for ${damageToHealth.toFixed(1)} damage${isCrit ? " (CRIT)" : ""}!`, "damage_taken");
    // Track damage for channeling interrupt checks
    if (target.type === "player" || target.classKey) {
      onHeroDamaged(target, damageToHealth);
    }
  }

  // Apply any enemy-sourced debuffs defined on the enemy
  if (enemy.debuffs && enemy.debuffs.length) {
    for (const debuff of enemy.debuffs) {
      if (debuff.type === "weaken_damage") {
        const chance = debuff.chance ?? 1;
        if (Math.random() < chance) {
          const duration = debuff.durationTicks ?? 5;
          const amount = debuff.amount ?? 1;
          target.tempDamageDebuffTicks = duration;
          target.tempDamageDebuffAmount = amount;
          addLog(`${target.name} is weakened! -${amount} damage for ${duration} ticks.`, "damage_taken");
        }
      }
    }
  }

  if (target.health <= 0) {
    target.isDead = true;
    target.deathTime = state.nowMs ?? 0;
    addLog(`${target.name} has been defeated.`, "damage_taken");
  }
}

/**
 * FIX 13: Centralized logic to determine target level for skill-up gating.
 * Ensures consistent behavior across all spell types.
 * 
 * Rules:
 * - For hostile spells (damage/debuff): use enemy level (allows trivial-enemy gating)
 * - For non-hostile spells (self/ally/party heals/buffs): use caster level
 *   (support spells are always meaningful, don't trivialize)
 */
export function getTargetLevelForSkillUps(hero, spellDef, resolvedTargets) {
  const isNonHostile = ["self", "ally", "party"].includes(spellDef?.target);
  
  if (isNonHostile) {
    // For heals/buffs/self, always use caster's level
    return hero.level;
  }
  
  // For hostile spells, use the target's level
  if (resolvedTargets && resolvedTargets.length > 0) {
    const primaryTarget = resolvedTargets[0];
    if (primaryTarget && primaryTarget.level != null) {
      return primaryTarget.level;
    }
  }
  
  // Fallback to caster level if no valid target found
  return hero.level;
}

export function gameTick() {
  state.nowMs = (state.nowMs ?? 0) + GAME_TICK_MS;
  const now = state.nowMs;
  // Track total damage for this tick (spells, skills, and auto-attacks)
  let totalDamageThisTick = 0;
  // Handle auto-revival for dead members (60 second timer)
  for (const hero of state.party) {
    if (!hero.type) hero.type = "player";
    // Ensure temp AC buff fields exist for older saves
    if (hero.tempACBuffTicks == null) hero.tempACBuffTicks = 0;
    if (hero.tempACBuffAmount == null) hero.tempACBuffAmount = 0;

    if (hero.isDead && hero.deathTime) {
      const timeSinceDeath = (now - hero.deathTime) / 1000; // seconds
      const timeRemaining = 60 - timeSinceDeath;
      
      // Initialize notification tracking if needed
      if (!hero.revivalNotifications) {
        hero.revivalNotifications = {};
      }
      
      // Countdown notifications
      if (timeRemaining <= 30 && timeRemaining > 29 && !hero.revivalNotifications['30s']) {
        addLog(`${hero.name} will revive in 30 seconds...`, "normal");
        hero.revivalNotifications['30s'] = true;
      }
      if (timeRemaining <= 10 && timeRemaining > 9 && !hero.revivalNotifications['10s']) {
        addLog(`${hero.name} will revive in 10 seconds...`, "normal");
        hero.revivalNotifications['10s'] = true;
      }
      if (timeRemaining <= 5 && timeRemaining > 4 && !hero.revivalNotifications['5s']) {
        addLog(`${hero.name} reviving in 5...`, "normal");
        hero.revivalNotifications['5s'] = true;
      }
      if (timeRemaining <= 4 && timeRemaining > 3 && !hero.revivalNotifications['4s']) {
        addLog(`${hero.name} reviving in 4...`, "normal");
        hero.revivalNotifications['4s'] = true;
      }
      if (timeRemaining <= 3 && timeRemaining > 2 && !hero.revivalNotifications['3s']) {
        addLog(`${hero.name} reviving in 3...`, "normal");
        hero.revivalNotifications['3s'] = true;
      }
      if (timeRemaining <= 2 && timeRemaining > 1 && !hero.revivalNotifications['2s']) {
        addLog(`${hero.name} reviving in 2...`, "normal");
        hero.revivalNotifications['2s'] = true;
      }
      if (timeRemaining <= 1 && timeRemaining > 0 && !hero.revivalNotifications['1s']) {
        addLog(`${hero.name} reviving in 1...`, "normal");
        hero.revivalNotifications['1s'] = true;
      }
      
      if (timeSinceDeath >= 60) {
        hero.isDead = false;
        hero.deathTime = null;
        hero.health = Math.max(1, hero.maxHP * 0.1); // Revive at 10% HP
        hero.revivalNotifications = {}; // Reset notifications
        addLog(`${hero.name} has been automatically revived with 10% health!`);
      }
    }
    // Tick down temporary damage debuff
    if (hero.tempDamageDebuffTicks && hero.tempDamageDebuffTicks > 0) {
      hero.tempDamageDebuffTicks -= 1;
      if (hero.tempDamageDebuffTicks === 0) {
        hero.tempDamageDebuffAmount = 0;
        addLog(`${hero.name} shrugs off the weakening hex.`, "normal");
      }
    }

    // Tick down temporary AC buffs
    if (hero.tempACBuffTicks && hero.tempACBuffTicks > 0) {
      hero.tempACBuffTicks -= 1;
      if (hero.tempACBuffTicks === 0) {
        hero.tempACBuffAmount = 0;
        addLog(`${hero.name}'s fortification fades.`, "normal");
      }
    }

    // Tick down Arcane Shield lockout (prevents offensive spells for 1 tick)
    if (hero.arcaneShieldLockout && hero.arcaneShieldLockout > 0) {
      hero.arcaneShieldLockout -= 1;
    }
    
    // Tick casting state (handle interrupts / completions)
    const castRes = tickCasting(hero, now, GAME_TICK_MS, {
      getSpellDefById: (spellId) => ACTIONS[spellId],
      onComplete: (hero, castingState, quality) => {
        const spellDef = ACTIONS[castingState.spellId];
        if (spellDef) {
          // Resolve targets at completion using stored targetId if possible
          let explicitTarget = null;
          if (castingState.targetId != null) {
            explicitTarget = state.currentEnemies.find(e => e && e.id === castingState.targetId)
              || state.party.find(h => h && h.id === castingState.targetId)
              || null;
          }
          if (!explicitTarget && spellDef.target === "self") {
            explicitTarget = hero;
          }

          const context = { enemies: state.currentEnemies, party: state.party };
          const targets = resolveActionTargets(spellDef, hero, context, explicitTarget);

          // Perform resist check for spells (before performAction)
          let quality = { mult: 1, outcome: "full" };
          if (spellDef.resist && targets.length > 0) {
            const primaryTarget = targets[0];
            const resistResult = resolveActionResist({
              caster: hero,
              target: primaryTarget,
              action: spellDef
            });
            
            if (resistResult.mult === 0) {
              // Binary resisted
              addLog(getResistLogMessage(spellDef.name, resistResult.type, false, 0), "skill");
              return; // Don't apply effect
            } else if (resistResult.mult < 1) {
              // Partial: reduce effect
              quality = { mult: resistResult.mult, outcome: "partial" };
              const resistMsg = getResistLogMessage(spellDef.name, resistResult.type, true, resistResult.partialPct);
              if (resistMsg) addLog(resistMsg, "skill");
            }
          }

          // Apply spell effects with quality outcome
          const result = performAction(castingState.spellId, spellDef, hero, targets, context, quality);

          // Log completion outcome (in addition to effect logs)
          addLog(`${hero.name} cast ${spellDef.name} (${quality.outcome}).`, "skill");

          // Track damage dealt this tick
          if (result && result.damageDealt) {
            totalDamageThisTick += result.damageDealt;
          }
          
          // Attempt skill-ups on completion (FIX 13: centralized target level logic)
          if (quality?.outcome !== "resisted") {
            const targetLevelForSkills = getTargetLevelForSkillUps(hero, spellDef, targets);
            const skillUps = onSpellCastCompleteForSkills(hero, spellDef, castingState, targetLevelForSkills) || [];
            if (skillUps.length > 0) {
              for (const up of skillUps) {
                const skillName = getMagicSkillDisplayName(up.skillId);
                const heroName = hero.name || "Hero";
                addLog(`${heroName}'s ${skillName} increases to ${up.value}!`, "skill");
              }
              // FIX 14: Throttle UI refresh to once per tick (set flag, renderAll will refresh)
              state.needsSkillsUiRefresh = true;
            }
          }
        }
      },
      onInterrupt: (hero, castingState) => {
        const spellDef = ACTIONS[castingState.spellId];
        addLog(`${hero.name}'s cast of ${spellDef?.name || "spell"} was interrupted!`, "skill");
      },
      spendManaFn: (hero, amount) => {
        hero.mana = Math.max(0, (hero.mana ?? 0) - amount);
      }
    });
    
    // If casting, prevent action bar from firing (casting blocks actions)
    if (hero.casting) {
      hero.isCasting = true;
    } else {
      hero.isCasting = false;
    }
    
    // Tick down equip cooldown
    // Tick down equip cooldown and clamp
    if (hero.equipCd == null) hero.equipCd = 0;
    if (hero.equipCd > 0) {
      hero.equipCd = Math.max(0, hero.equipCd - 1);
    }

    // Process CC per-tick resist checks (mesmerize, fear, etc.)
    if (hero.activeBuffs) {
      const ccEffects = ["mesmerize", "fear"];  // Binary CC that can break
      for (const ccKey of ccEffects) {
        if (hasBuff(hero, ccKey)) {
          const buff = hero.activeBuffs[ccKey];
          const actionDef = ACTIONS[ccKey];
          if (actionDef && buff.data?.sourceHero) {
            // Check grace tick: CC cannot break on first tick after landing
            if (buff.data.ccGraceTicksRemaining > 0) {
              buff.data.ccGraceTicksRemaining--;
              continue;  // Skip resist check this tick
            }
            
            // CC break logic intentionally isolated here for future DR / escalation
            // Future enhancements: escalating break chance, diminishing returns, CC category stacking rules
            
            // Find the source actor for the resist check (stored name in data)
            // For simplicity, use average enemy level or stored sourceLevel
            const sourceLevel = buff.data?.sourceLevel ?? hero.level ?? 1;
            const fakeSource = { level: sourceLevel, spellPen: { magic: 0, elemental: 0, contagion: 0, physical: 0 } };
            
            const resistResult = resolveActionResist({
              caster: fakeSource,
              target: hero,
              action: actionDef
            });
            
            if (resistResult.resisted) {
              removeBuff(hero, ccKey);
              addLog(`${hero.name}'s ${actionDef.name} was resisted and broke!`, "skill");
            }
          }
        }
      }
    }

    // Clean up expired buffs
    cleanupExpiredBuffs(hero);
  }

  // Check for reinforcements if in combat
  if (state.currentEnemies.length > 0) {
    checkForReinforcement();
  }

  // Tick down forced target locks (taunts)
  for (const enemy of state.currentEnemies) {
    if (enemy.forcedTargetTicks && enemy.forcedTargetTicks > 0) {
      enemy.forcedTargetTicks -= 1;
      if (enemy.forcedTargetTicks <= 0) {
        enemy.forcedTargetTicks = 0;
        enemy.forcedTargetId = null;
      }
    }
    
    // Process DOT effects (Flame Lick)
    if (enemy.activeBuffs?.flame_lick) {
      const flameLick = enemy.activeBuffs.flame_lick;
      if (!isExpiredEffect(flameLick, now) && flameLick.data?.dotDamagePerTick) {
        const baseDotDamage = flameLick.data.dotDamagePerTick;
        const effectMult = flameLick.data.effectMult ?? 1;  // Apply resist mult
        const dotDamage = baseDotDamage * effectMult;
        enemy.hp = Math.max(0, enemy.hp - dotDamage);
        addLog(`${enemy.name} burns for ${dotDamage.toFixed(1)} fire damage!`, "dot_fire");

            if (hasBuff(enemy, "mesmerize")) {
              removeBuff(enemy, "mesmerize");
              addLog(`${enemy.name} wakes as the flames break mesmerize!`, "skill");
            }
        
        if (enemy.hp <= 0) {
          addLog(`${enemy.name} succumbs to the flames!`, "gold");
        }
      }
    }
    
    // Process CC per-tick resist checks (mesmerize, fear, etc.)
    if (enemy.activeBuffs) {
      const ccEffects = ["mesmerize", "fear"];  // Binary CC that can break
      for (const ccKey of ccEffects) {
        if (hasBuff(enemy, ccKey)) {
          const buff = enemy.activeBuffs[ccKey];
          const actionDef = ACTIONS[ccKey];
          if (actionDef && buff.data?.sourceHero) {
            // Check grace tick: CC cannot break on first tick after landing
            if (buff.data.ccGraceTicksRemaining > 0) {
              buff.data.ccGraceTicksRemaining--;
              continue;  // Skip resist check this tick
            }
            
            // CC break logic intentionally isolated here for future DR / escalation
            // Future enhancements: escalating break chance, diminishing returns, CC category stacking rules
            
            // Find the source actor for the resist check (stored name in data)
            // For simplicity, use average party level or stored sourceLevel
            const sourceLevel = buff.data?.sourceLevel ?? state.party?.[0]?.level ?? 1;
            const fakeSource = { level: sourceLevel, spellPen: { magic: 0, elemental: 0, contagion: 0, physical: 0 } };
            
            const resistResult = resolveActionResist({
              caster: fakeSource,
              target: enemy,
              action: actionDef
            });
            
            if (resistResult.resisted) {
              removeBuff(enemy, ccKey);
              addLog(`${enemy.name}'s ${actionDef.name} was resisted and broke!`, "skill");
            }
          }
        }
      }
    }
    
    // Clean up expired buffs on enemies
    cleanupExpiredBuffs(enemy);
  }

  recalcPartyTotals();
  
  // Determine if in combat (affects regen rates)
  const inCombat = state.currentEnemies.length > 0;
  
  // 1) Update inCombat flag for all heroes
  for (const hero of state.party) {
    hero.inCombat = inCombat;
  }
  
  // 2) Regenerate resources for all living members (every 2 ticks)
  for (const hero of state.party) {
    if (hero.isDead) continue;
    
    // Increment regen tick counter
    hero.regenTickCounter = (hero.regenTickCounter || 0) + 1;
    
    // Only apply regen every 2 ticks
    if (hero.regenTickCounter >= 2) {
      hero.regenTickCounter = 0;
      
      // Mana: use meditateTick for casters (has built-in meditate logic)
      if (hero.maxMana && hero.maxMana > 0) {
        meditateTick(hero);
      }
      
      // Endurance: traditional regen (no meditate)
      const enduranceRegenRate = inCombat ? hero.enduranceRegenPerTick / 3 : hero.enduranceRegenPerTick;
      if (enduranceRegenRate && hero.endurance < hero.maxEndurance) {
        hero.endurance = Math.min(hero.maxEndurance, hero.endurance + enduranceRegenRate);
      }
    }
  }
  
  // 3) Apply passive health regeneration to living members only (every 2 ticks)
  // Passive regen: full out of combat, 1/3 in combat
  const passiveRegenAmount = 2;
  const healthRegenRate = inCombat ? passiveRegenAmount / 3 : passiveRegenAmount;
  
  for (const hero of state.party) {
    if (hero.isDead) continue; // Skip dead members
    
    // Only apply health regen every 2 ticks (same counter as resource regen)
    if (hero.regenTickCounter === 0 && healthRegenRate > 0 && hero.health < hero.maxHP) {
      const oldHP = hero.health;
      hero.health = Math.min(hero.maxHP, hero.health + healthRegenRate);
      const actualHealed = hero.health - oldHP;
      if (actualHealed > 0.1) {
        addLog(`${hero.name} regenerates ${actualHealed.toFixed(1)} HP!`, "regen");
      }
    }
  }
  
  const livingAlive = state.party.some(h => !h.isDead);

  // Hunt timer countdown (3000ms per tick)
  if (state.waitingToRespawn && state.huntRemaining > 0) {
    state.huntRemaining -= 3000; // Decrement by tick duration
    if (state.huntRemaining < 0) {
      state.huntRemaining = 0;
    }
  }

  // Check if we should respawn (only if hunt timer finished, someone is alive, and we're out of combat)
  if (state.waitingToRespawn && state.currentEnemies.length === 0 && livingAlive && state.huntRemaining <= 0) {
    // Check automation thresholds
    const campCheck = checkCampThresholds();
    
    if (!campCheck.shouldCamp) {
      // All thresholds met, spawn enemy
      spawnEnemy();
      // Reset camping log counters when we resume hunting
      state.lastCampLogTick = 0;
      state.lastCampLogTime = 0;
    } else {
      // Log camping reason periodically: every 10 ticks OR every 30s (whichever comes first)
      const ticksSinceLog = state.lastCampLogTick ?? 0;
      const msSinceLog = state.lastCampLogTime ? now - state.lastCampLogTime : Infinity;
      const shouldLogNow = ticksSinceLog >= 10 || msSinceLog >= 30000;

      if (shouldLogNow) {
        addLog(`Camping to recover: ${campCheck.reasons.join(', ')}`, "normal");
        state.lastCampLogTick = 0;
        state.lastCampLogTime = now;
      } else {
        state.lastCampLogTick = ticksSinceLog + 1;
      }
    }
  }

  // Check party health/death status for heal/resurrect gating
  const anyDamaged = state.party.some(h => !h.isDead && h.health < h.maxHP);
  const anyDead = state.party.some(h => h.isDead);

  // 3) Process skills and calculate bonuses
  

  for (const hero of state.party) {
    if (hero.isDead) continue; // Dead heroes can't use skills
    if (hero.isCasting) continue; // Skip action bar while casting
    
    const cls = getClassDef(hero.classKey);
    if (!cls?.skills) continue;

    // Get skills that are available and assigned to ability bar
    const abilityBarSkills = new Set(Object.values(hero.abilityBar || {}));
    const skills = cls.skills.filter(s => hero.level >= s.level && abilityBarSkills.has(s.key));

    for (const sk of skills) {
      const actionId = normalizeActionId(sk.key);
      const actionDef = ACTIONS[actionId];
      const timers = getActionTimerStore(hero);
      if (!timers || !actionDef) continue;

      if (actionId !== sk.key && timers[actionId] == null && timers[sk.key] != null) {
        timers[actionId] = timers[sk.key];
        delete timers[sk.key];
      }

      // Tick cooldown down using normalized action id
      tickActionCooldown(hero, actionId);

      // Fire if ready
      if ((timers[actionId] ?? 0) === 0) {
        const hasEnemies = state.currentEnemies.length > 0;

        // If this is a damage/debuff skill but no enemies are present, hold fire until combat starts
        if ((sk.type === "damage" || sk.type === "debuff") && !hasEnemies) {
          continue;
        }

        // Cleric: While Divine Focus is active, only healing spells are allowed; block all others without ending the buff
        if (hero.classKey === "cleric" && hasBuff(hero, "divine_focus") && sk.type !== "heal") {
          continue;
        }

        // Arcane Shield offensive lockout
        if (sk.kind === "spell" && (sk.type === "damage" || sk.type === "debuff") && hero.arcaneShieldLockout > 0) {
          continue;
        }

        // Pre-check mesmerize to avoid re-casting when no eligible XT target
        if (actionId === "mesmerize") {
          const xtTarget = state.currentEnemies.length > 1 ? state.currentEnemies[1] : null;
          const alreadyMesmerized = state.currentEnemies.some(e => hasBuff(e, "mesmerize") && (getBuff(e, "mesmerize")?.sourceHeroId === hero.id));
          if (!xtTarget || hasBuff(xtTarget, "mesmerize") || alreadyMesmerized) {
            continue;
          }
        }

        // Skip heals/res if no one needs it to avoid churn
        if (sk.type === "heal" && !anyDamaged) {
          continue;
        }
        if (sk.type === "resurrect" && !anyDead) {
          continue;
        }

        // Skip long-duration buffs if already active or no valid target
        if (actionId === "courage") {
          const needsBuff = state.party.find(h => !h.isDead && !hasBuff(h, "courage"));
          if (!needsBuff) continue;
        }
        if (actionId === "woodskin") {
          const needsBuff = state.party.find(h => !h.isDead && !hasBuff(h, "woodskin"));
          if (!needsBuff) continue;
        }
        if (actionId === "hawk_eye" && hasBuff(hero, "hawk_eye")) {
          continue;
        }
        if (actionId === "fortify" && hasBuff(hero, "fortify")) {
          continue;
        }
        if (actionId === "arcane_shield" && hasBuff(hero, "arcane_shield")) {
          continue;
        }
        if (actionId === "divine_focus" && hasBuff(hero, "divine_focus")) {
          continue;
        }
        if (actionId === "lesser_rune" && hasBuff(hero, "lesser_rune")) {
          timers[actionId] = 1;
          continue;
        }
        if (actionId === "suffocate") {
          const targetEnemy = state.currentEnemies[0];
          if (!targetEnemy || hasBuff(targetEnemy, "suffocate")) {
            timers[actionId] = 1;
            continue;
          }
        }

        const result = resolveActionUse({
          actor: hero,
          actionId,
          context: { enemies: state.currentEnemies, party: state.party }
        });

        if (result.attempted) {
          const abilityXP = 2;
          hero.xp = (hero.xp || 0) + abilityXP;
          state.accountLevelXP += abilityXP * accountXPMult(state.accountLevel);
          checkAccountLevelUp();
        }

        if (result.cast) {
          totalDamageThisTick += result.damageDealt || 0;
        }
      }
    }
  }

  // If no enemies (out of combat), stop after processing utility/heal skills
  if (state.currentEnemies.length === 0) {
    checkSlotUnlocks();
    return;
  }

  // Handle kills that occurred from skills before auto-attacks
  if (state.currentEnemies[0] && state.currentEnemies[0].hp <= 0) {
    const defeated = state.currentEnemies[0];
    onEnemyKilled(defeated, Math.max(1, totalDamageThisTick));
    totalDamageThisTick = 0;
    state.currentEnemies.shift();
    if (state.currentEnemies.length === 0) {
      state.waitingToRespawn = true;
      checkSlotUnlocks();
      return;
    }
  }

  // 3) Hero auto-attacks (swing timer based)
  const mainEnemy = state.currentEnemies[0];
  if (mainEnemy) {
    const livingAttackers = state.party.filter(h => !h.isDead);
    for (const hero of livingAttackers) {
      // Tick down swing cooldown
      hero.swingCd = Math.max(0, hero.swingCd - 1);
      
      // Check if swing is ready
      if (hero.swingCd === 0) {
        // Option B: hold ready swings while casting; resume immediately when casting ends
        // hero.casting is the source of truth (do not use hero.isCasting here)
        if (hero.casting) continue;

        // Perform auto-attack
        performAutoAttack(hero, mainEnemy);
        
        // Check if hero's weapon changed (delay/haste changed) and recompute swing ticks
        const baseDelay = getBaseDelayTenths(hero);
        const hastePct = getTotalHastePct(hero);
        const newSwingTicks = computeSwingTicks(baseDelay, hastePct);
        if (newSwingTicks !== hero.swingTicks) {
          hero.swingTicks = newSwingTicks;
        }
        
        // Reset swing cooldown
        hero.swingCd = hero.swingTicks;
        
        // Check overflow for extra swing chance
        const overflow = computeOverflowBonuses(baseDelay, hastePct);
        if (overflow.extraSwingChance > 0 && Math.random() < overflow.extraSwingChance) {
          performAutoAttack(hero, mainEnemy);
        }
        
        if (mainEnemy.hp <= 0) {
          break;
        }
      }
    }
  }

  // Check if main enemy is killed
  if (mainEnemy && mainEnemy.hp <= 0) {
    onEnemyKilled(mainEnemy, Math.max(1, totalDamageThisTick));
    totalDamageThisTick = 0;
    state.currentEnemies.shift(); // Remove main enemy from list
    
    // If no more enemies, trigger respawn
    if (state.currentEnemies.length === 0) {
      state.waitingToRespawn = true;
      return;
    }
  }

  // Enemy actions (spells/abilities) occur before their melee swings
  tryEnemyActionUses();

  // 4) Enemy auto-attacks (swing timer based)
  let livingMembers = state.party.filter(h => !h.isDead);
  if (livingMembers.length > 0) {
    for (const enemy of state.currentEnemies) {
      // Tick down swing cooldown
      enemy.swingCd = Math.max(0, enemy.swingCd - 1);
      
      // Check if swing is ready
      if (enemy.swingCd === 0) {
        // Mesmerized enemies do nothing
        if (hasBuff(enemy, "mesmerize")) {
          addLog(`${enemy.name} is mesmerized and cannot act!`, "normal");
        } else if (hasBuff(enemy, "fear")) {
          // Feared enemies do nothing
          addLog(`${enemy.name} is running for its life and cannot attack!`, "normal");
        } else {
          // Perform auto-attack
          performEnemyAutoAttack(enemy, livingMembers);
        }
        
        // Reset swing cooldown (recompute in case of equipment changes, though unlikely for mobs)
        enemy.swingCd = enemy.swingTicks;
      }
    }
  }

  // Re-evaluate living members after attacks; if none left, wipe ends combat
  let updatedLivingMembers = state.party.filter(h => !h.isDead);
  if (updatedLivingMembers.length === 0) {
    onPartyWipe();
    return;
  }

  checkSlotUnlocks();
}


