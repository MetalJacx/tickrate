import { state, nextHeroId, updateCurrencyDisplay, formatPGSC } from "./state.js";
import { getClassDef, CLASS_DEFS } from "./classes/index.js";
import { getZoneDef, getEnemyForZone, MAX_ZONE, rollSubAreaDiscoveries, ensureZoneDiscovery, getZoneById, getActiveSubArea } from "./zones/index.js";
import { addLog, randInt } from "./util.js";
import { ACCOUNT_SLOT_UNLOCKS, GAME_TICK_MS, MEDITATE_UNLOCK_LEVEL, MEDITATE_SKILL_HARD_CAP, MEDITATE_BASE_REGEN_FACTOR, COMBAT_REGEN_MULT, OOC_REGEN_MULT, XP_TEST_REDUCTION_PERCENT } from "./defs.js";
import { updateStatsModalSkills } from "./ui.js";
import { getItemDef } from "./items.js";
import { getRaceDef, DEFAULT_RACE_KEY } from "./races.js";
import {
  applyACMitigation,
  computeCritChance,
  computeHitChance,
  computeManaRegenPerSecond,
  computeMaxHP,
  computeMaxMana,
  computeRawDamage
} from "./combatMath.js";

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
  
  return baseChance * progressPenalty * levelDR;
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
  
  // Reset AC too
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

  return {
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
    mana: maxMana
  };
}

export function createHero(classKey, customName = null, raceKey = DEFAULT_RACE_KEY) {
  const cls = getClassDef(classKey);
  if (!cls) return null;
  const race = getRaceDef(raceKey || DEFAULT_RACE_KEY);

  const baseDmg = cls.baseDamage ?? cls.baseDPS ?? cls.baseHealing ?? 5;
  const hero = {
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
    skillTimers: {}
  };

  refreshHeroDerived(hero);
  hero.health = hero.maxHP;
  hero.mana = hero.maxMana;
  if (cls.key === "warrior" && hero.level >= 5 && hero.doubleAttackSkill < 1) {
    hero.doubleAttackSkill = 1;
  }
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

  state.currentEnemies = [enemy];
  state.waitingToRespawn = false;
  addLog(`A level ${level} ${enemyDef.name} appears in Zone ${z}.`);
  
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

  state.currentEnemies.push(enemy);
  addLog(`Oh no! Your luck is not on your side—another ${enemyDef.name} takes notice of your presence!`, "damage_taken");
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
    const reinforcementChance = zone?.aggroChance ?? 0.05;
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

export function canTravelForward() {
  // Allowed if zone already unlocked or kills requirement met
  return state.zone < state.highestUnlockedZone || canTravel();
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
  return Math.min(MEDITATE_SKILL_HARD_CAP, Math.floor((level - MEDITATE_UNLOCK_LEVEL) * MEDITATE_SKILL_HARD_CAP / 55));
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
  
  // Base mana regen (always available)
  const baseManaRegen = Math.max(1, Math.floor(hero.maxMana * MEDITATE_BASE_REGEN_FACTOR));
  
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
    if (Math.random() < skillUpChance) {
      hero.meditateSkill = Math.min(hero.meditateSkill + 1, cap);
    }
  }
}

// Apply a buff to a hero
export function applyBuff(hero, buffKey, durationMs, data = {}) {
  hero.activeBuffs = hero.activeBuffs || {};
  hero.activeBuffs[buffKey] = {
    expiresAt: Date.now() + durationMs,
    data
  };
}

// Check if a hero has an active buff
export function hasBuff(hero, buffKey) {
  if (!hero.activeBuffs) return false;
  const buff = hero.activeBuffs[buffKey];
  if (!buff) return false;
  // Check if buff has expired
  if (Date.now() > buff.expiresAt) {
    delete hero.activeBuffs[buffKey];
    return false;
  }
  return true;
}

// Get buff data if active
export function getBuff(hero, buffKey) {
  if (!hasBuff(hero, buffKey)) return null;
  return hero.activeBuffs[buffKey].data;
}

// Clean up expired buffs for a hero
function cleanupExpiredBuffs(hero) {
  if (!hero.activeBuffs) return;
  const now = Date.now();
  for (const key of Object.keys(hero.activeBuffs)) {
    if (now > hero.activeBuffs[key].expiresAt) {
      delete hero.activeBuffs[key];
    }
  }
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
  // AC scales: +3 @ L8 → +7 @ L18
  const acBonus = Math.min(7, 3 + Math.floor((rangerLevel - 8) * 4 / 10));
  const conBonus = 2;
  
  // Duration: 3 min @ L8 → 25 min @ L18
  const durationMinutes = Math.min(25, 3 + Math.floor((rangerLevel - 8) * 22 / 10));
  const durationMs = durationMinutes * 60 * 1000;
  
  applyBuff(hero, "woodskin", durationMs, { acBonus, conBonus });
}

// Hawk Eye buff handler - hit chance bonus
export function applyHawkEyeBuff(hero, rangerLevel) {
  const hitChanceBonus = 2; // +2% to hit
  
  // Duration: 33.3 min @ L11 → 70 min @ L24
  const durationMinutes = Math.min(70, 33.3 + Math.floor((rangerLevel - 11) * 36.7 / 13));
  const durationMs = durationMinutes * 60 * 1000;
  
  applyBuff(hero, "hawk_eye", durationMs, { hitChanceBonus });
}


export function gameTick() {
  // Handle auto-revival for dead members (60 second timer)
  const now = Date.now();
  for (const hero of state.party) {
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
      const now = Date.now();
      if (now <= flameLick.expiresAt && flameLick.data?.dotDamagePerTick) {
        const dotDamage = flameLick.data.dotDamagePerTick;
        enemy.hp = Math.max(0, enemy.hp - dotDamage);
        addLog(`${enemy.name} burns for ${dotDamage.toFixed(1)} fire damage!`, "damage_dealt");
        
        if (enemy.hp <= 0) {
          addLog(`${enemy.name} succumbs to the flames!`, "gold");
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
      const now = Date.now();
      const ticksSinceLog = state.lastCampLogTick ?? 0;
      const msSinceLog = state.lastCampLogTime ? now - state.lastCampLogTime : Infinity;
      const shouldLogNow = ticksSinceLog >= 10 || msSinceLog >= 30000;

      if (shouldLogNow) {
        addLog(`⛺ Camping to recover: ${campCheck.reasons.join(', ')}`, "normal");
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
  let totalDamageThisTick = 0;

  for (const hero of state.party) {
    if (hero.isDead) continue; // Dead heroes can't use skills
    
    const cls = getClassDef(hero.classKey);
    if (!cls?.skills) continue;

    // Get skills that are available and assigned to ability bar
    const abilityBarSkills = new Set(Object.values(hero.abilityBar || {}));
    const skills = cls.skills.filter(s => hero.level >= s.level && abilityBarSkills.has(s.key));

    for (const sk of skills) {
      if (hero.skillTimers[sk.key] == null) hero.skillTimers[sk.key] = 0;

      // Tick cooldown down
      hero.skillTimers[sk.key] = Math.max(0, hero.skillTimers[sk.key] - 1);

      // Fire if ready
      if (hero.skillTimers[sk.key] === 0) {
        // If this is a damage skill but no enemies are present, hold fire until combat starts
        if (sk.type === "damage" && state.currentEnemies.length === 0) {
          continue;
        }
        // Debuffs (e.g., taunt) require an enemy present
        if (sk.type === "debuff" && state.currentEnemies.length === 0) {
          continue;
        }
        // Check resource availability
        const costType = sk.costType || (hero.resourceType === "mana" ? "mana" : (hero.resourceType === "endurance" ? "endurance" : "mana"));
        const cost = sk.cost || 0;
        
        let hasResources = true;
        if (costType === "mana" && hero.mana < cost) {
          hasResources = false;
        } else if (costType === "endurance" && hero.endurance < cost) {
          hasResources = false;
        }
        
        // For heals, only cast if someone is damaged
        if (sk.type === "heal" && !anyDamaged) {
          hasResources = false;
        }
        // For resurrect, only cast if someone is dead
        if (sk.type === "resurrect" && !anyDead) {
          hasResources = false;
        }
        // For buffs, only cast if someone doesn't have it
        if (sk.type === "buff" && sk.buffType === "courage") {
          const needsBuff = state.party.find(h => !h.isDead && !hasBuff(h, "courage"));
          if (!needsBuff) {
            hasResources = false; // Everyone has the buff, don't cast
          }
        }
        // Fortify is self-only
        if (sk.type === "buff" && sk.buffType === "fortify") {
          if (hasBuff(hero, "fortify")) {
            hasResources = false; // Hero already has Fortify, don't cast
          }
        }
        // Arcane Shield is self-only and can't stack
        if (sk.type === "buff" && sk.buffType === "arcane_shield") {
          if (hasBuff(hero, "arcane_shield")) {
            hasResources = false; // Hero already has shield, don't cast
          }
        }
        // WoodSkin: check if anyone needs the buff
        if (sk.type === "buff" && sk.buffType === "woodskin") {
          const needsBuff = state.party.find(h => !h.isDead && !hasBuff(h, "woodskin"));
          if (!needsBuff) {
            hasResources = false; // Everyone has the buff, don't cast
          }
        }
        // Hawk Eye is self-only and can't stack
        if (sk.type === "buff" && sk.buffType === "hawk_eye") {
          if (hasBuff(hero, "hawk_eye")) {
            hasResources = false; // Hero already has Hawk Eye, don't cast
          }
        }
        // Prevent offensive spells after Arcane Shield cast (1 tick lockout)
        if ((sk.type === "damage" || sk.type === "debuff") && hero.arcaneShieldLockout > 0) {
          hasResources = false; // Still in lockout, don't cast
        }
        
        if (!hasResources) {
          continue; // Skip this skill if not enough resources or no one needs healing
        }

        // Skip recasting AC buff if it's still running; recheck in 1 tick
        if (sk.type === "buff" && sk.buff === "ac" && hero.tempACBuffTicks > 1) {
          hero.skillTimers[sk.key] = 1;
          continue;
        }
        
        // Deduct resources
        if (costType === "mana") {
          hero.mana -= cost;
        } else if (costType === "endurance") {
          hero.endurance -= cost;
        }
        
        // Award ability XP for using skill
        const abilityXP = 2;
        if (!hero.xp) hero.xp = 0;
        hero.xp += abilityXP;
        state.accountLevelXP += abilityXP * accountXPMult(state.accountLevel);
        checkAccountLevelUp();

        if (sk.type === "damage") {
          const damageTypeLabel = sk.damageType ? ` (${sk.damageType})` : "";

          // Determine base damage for this skill
          let minDmg = sk.minDamage || sk.amount || 0;
          let maxDmg = sk.maxDamage || sk.amount || 0;
          
          // Apply Wizard damage scaling
          if (sk.key === "fireblast") {
            // Fireblast: +1 max damage per 2 levels, caps at level 10
            const levelScaling = Math.min(5, Math.floor((hero.level - 1) / 2)); // 0-5 scaling
            maxDmg = 20 + levelScaling;
          } else if (sk.key === "iceblast") {
            // Iceblast: +1 max damage per 2 levels, caps at level 18
            const levelScaling = Math.min(9, Math.floor((hero.level - 7) / 2)); // 0-9 scaling
            maxDmg = 30 + levelScaling;
          } else if (sk.key === "shot") {
            // Ranger Shot: damage scales from 2 @ L1 to 5 @ L8
            const scaledDamage = Math.min(5, 2 + Math.floor((hero.level - 1) * 3 / 7));
            minDmg = scaledDamage;
            maxDmg = scaledDamage;
          }
          
          let calcDamage = 0;
          if (sk.usesBaseDamage) {
            // Use hero's current base damage (after gear/bonuses)
            calcDamage = hero.baseDamage || hero.dps || 0;
          } else {
            calcDamage = minDmg + Math.random() * (maxDmg - minDmg);
          }

          // Cleave: hit multiple targets from the front of the list
          let targets = sk.cleaveTargets ? state.currentEnemies.slice(0, sk.cleaveTargets) : (state.currentEnemies[0] ? [state.currentEnemies[0]] : []);

          if (targets.length === 0) {
            addLog(`${hero.name} uses ${sk.name}${damageTypeLabel}, but there is nothing to hit.`, "normal");
          } else {
            for (let i = 0; i < targets.length; i++) {
              const target = targets[i];
              let damageToApply = calcDamage;
              
              // AOE diminishing returns: full damage first 3, then -20% per additional
              if (sk.aoeDiminishing && i >= 3) {
                const diminishCount = i - 2; // 1 for 4th target, 2 for 5th, etc.
                let diminishPercent = Math.max(0.4, 1.0 - (diminishCount * 0.2)); // Min 40%
                damageToApply = calcDamage * diminishPercent;
              }
              
              const mitigated = applyACMitigation(damageToApply, target);
              target.hp = Math.max(0, target.hp - mitigated);
              totalDamageThisTick += mitigated;
              addLog(`${hero.name} uses ${sk.name}${damageTypeLabel} for ${mitigated.toFixed(1)} damage!`, "damage_dealt");
            }
          }
        }
        if (sk.type === "buff") {
          // Handle buff skills (e.g., Courage, Fortify)
          if (sk.buffType === "courage") {
            // Find first party member without Courage buff
            const needsBuff = state.party.find(h => !h.isDead && !hasBuff(h, "courage"));
            if (needsBuff) {
              applyCourageBuff(needsBuff, hero.level);
              addLog(`${hero.name} casts ${sk.name} on ${needsBuff.name}!`, "normal");
            } else {
              // Everyone has the buff; refund mana
              hero.mana += cost;
            }
          } else if (sk.buffType === "fortify") {
            // Fortify is self-only
            applyFortifyBuff(hero, hero.level);
            const buffData = getBuff(hero, "fortify");
            if (buffData) {
              addLog(`${hero.name} fortifies, gaining +${buffData.acBonus} AC for 8 ticks.`, "skill");
            }
          } else if (sk.buffType === "woodskin") {
            // WoodSkin: single target buff (self or ally)
            const needsBuff = state.party.find(h => !h.isDead && !hasBuff(h, "woodskin"));
            if (needsBuff) {
              applyWoodSkinBuff(needsBuff, hero.level);
              addLog(`${hero.name} casts ${sk.name} on ${needsBuff.name}!`, "normal");
            } else {
              // Everyone has the buff; refund mana
              hero.mana += cost;
            }
          } else if (sk.buffType === "hawk_eye") {
            // Hawk Eye: self-only
            if (hasBuff(hero, "hawk_eye")) {
              // Already has buff; refund mana
              hero.mana += cost;
            } else {
              applyHawkEyeBuff(hero, hero.level);
              addLog(`${hero.name} focuses with ${sk.name}, gaining +${sk.hitChanceBonus}% to hit!`, "skill");
            }
          } else if (sk.buffType === "arcane_shield") {
            // Check if hero already has Arcane Shield
            if (hasBuff(hero, "arcane_shield")) {
              // Already shielded; refund mana and skip
              hero.mana += cost;
            } else {
              // Apply Arcane Shield buff (90 second duration)
              applyBuff(hero, "arcane_shield", 90000, { tempHP: 50 });
              addLog(`${hero.name} casts ${sk.name} and gains a protective shield!`, "normal");
              // Set cast lockout: prevent offensive spells for next tick
              hero.arcaneShieldLockout = 1;
            }
          }
        }
        if (sk.type === "debuff") {
          if (sk.debuff === "taunt") {
            const targetEnemy = state.currentEnemies[0];
            if (targetEnemy) {
              const duration = sk.durationTicks ?? 3;
              targetEnemy.forcedTargetId = hero.id;
              targetEnemy.forcedTargetTicks = duration;
              addLog(`${hero.name} taunts ${targetEnemy.name}, forcing attacks for ${duration} ticks!`, "skill");
            }
          } else if (sk.debuffType === "fear") {
            // Fear debuff on first enemy
            const targetEnemy = state.currentEnemies[0];
            if (targetEnemy) {
              // Fear duration: 2 ticks at level 8, 3+ at level 9+
              const durationTicks = hero.level >= 9 ? 3 : 2;
              const durationMs = durationTicks * 3000; // GAME_TICK_MS
              applyBuff(targetEnemy, "fear", durationMs, { durationTicks });
              addLog(`${hero.name} casts ${sk.name} on ${targetEnemy.name}! ${targetEnemy.name} runs in fear for ${durationTicks} ticks!`, "skill");
            }
          } else if (sk.debuffType === "flame_lick") {
            // Flame Lick: DOT + AC reduction
            const targetEnemy = state.currentEnemies[0];
            if (targetEnemy) {
              const durationTicks = sk.durationTicks || 6;
              const durationMs = durationTicks * 3000; // GAME_TICK_MS
              // DOT damage scales: 1 @ L3 → 3 @ L6+
              const dotDamage = Math.min(3, 1 + Math.floor((hero.level - 3) * 2 / 3));
              applyBuff(targetEnemy, "flame_lick", durationMs, {
                durationTicks,
                dotDamagePerTick: dotDamage,
                acReduction: sk.acReduction || 3,
                sourceHero: hero.name
              });
              addLog(`${hero.name} casts ${sk.name} on ${targetEnemy.name}! Fire burns for ${durationTicks} ticks (${dotDamage} dmg/tick, -${sk.acReduction || 3} AC)!`, "skill");
            }
          }
        }
        if (sk.type === "heal") {
          // Target the most injured living ally (by missing HP)
          const healable = state.party.filter(h => !h.isDead && h.health < h.maxHP);
          if (healable.length === 0) {
            // No one needs healing; skip the cast
            hero.mana += costType === "mana" ? cost : 0;
            hero.endurance += costType === "endurance" ? cost : 0;
            continue;
          }
          const target = healable.reduce((lowest, h) => {
            const missing = h.maxHP - h.health;
            const lowestMissing = lowest.maxHP - lowest.health;
            return missing > lowestMissing ? h : lowest;
          }, healable[0]);

          const missingHP = target.maxHP - target.health;
          // Support both old (amount) and new (minAmount/maxAmount) formats
          let baseHeal = sk.amount || sk.minAmount || 0;
          if (sk.minAmount !== undefined && sk.maxAmount !== undefined) {
            baseHeal = sk.minAmount + Math.random() * (sk.maxAmount - sk.minAmount);
          }
          const healAmount = Math.min(baseHeal, missingHP);
          target.health += healAmount;
          addLog(`${hero.name} casts ${sk.name} on ${target.name} for ${healAmount.toFixed(1)} healing!`, "healing");
        }
        if (sk.type === "utility") {
          // Handle utility skills (e.g., Gather Mana)
          if (sk.key === "gather_mana") {
            // Gather Mana: restore mana based on hero level, capped at 18
            const manaRestored = Math.floor(Math.min(hero.level, 12) * 1.5);
            const newMana = Math.min(hero.maxMana, hero.mana + manaRestored);
            const actualRestored = newMana - hero.mana;
            hero.mana = newMana;
            if (actualRestored > 0) {
              addLog(`${hero.name} gathers mana, restoring ${actualRestored.toFixed(0)} mana!`, "skill");
            }
          }
        }
        if (sk.type === "resurrect") {
          // Find first dead party member and revive them at 10% HP
          let revived = false;
          for (const target of state.party) {
            if (target.isDead) {
              target.isDead = false;
              target.deathTime = null;
              target.health = target.maxHP * 0.1;
              addLog(`${hero.name} casts ${sk.name} and revives ${target.name} with 10% health!`, "healing");
              revived = true;
              break;
            }
          }
          // If no one was dead, skill is skipped earlier; no log needed here
        }
        hero.skillTimers[sk.key] = sk.cooldownTicks;
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

  // 3) Apply damage to main enemy (first in list)
  const mainEnemy = state.currentEnemies[0];
  if (!mainEnemy) {
    checkSlotUnlocks();
    return;
  }
  const livingAttackers = state.party.filter(h => !h.isDead);
  for (const hero of livingAttackers) {
    const debuff = hero.tempDamageDebuffTicks > 0 ? hero.tempDamageDebuffAmount || 0 : 0;
    const attackBaseDamage = Math.max(0, (hero.baseDamage ?? hero.dps ?? 0) - debuff);
    const hitChance = computeHitChance(hero, mainEnemy);
    if (Math.random() > hitChance) {
      addLog(`${hero.name} misses ${mainEnemy.name}.`, "damage_dealt");
      continue;
    }

    const isCrit = Math.random() < computeCritChance(hero);
    const rawDamage = computeRawDamage({ ...hero, baseDamage: attackBaseDamage }, isCrit);
    const mitigated = applyACMitigation(rawDamage, mainEnemy);
    mainEnemy.hp = Math.max(0, mainEnemy.hp - mitigated);
    totalDamageThisTick += mitigated;
    addLog(`${hero.name} hits ${mainEnemy.name} for ${mitigated.toFixed(1)}${isCrit ? " (CRIT)" : ""}!`, "damage_dealt");

    // Warrior-only: Double Attack proc and skill-ups
    if (hero.classKey === "warrior" && mainEnemy.hp > 0) {
      const cap = doubleAttackCap(hero.level);
      const skill = hero.doubleAttackSkill || 0;
      const procChance = doubleAttackProcChance(skill);
      if (cap > 0 && procChance > 0 && Math.random() < procChance) {
        const daHitChance = computeHitChance(hero, mainEnemy);
        if (Math.random() <= daHitChance) {
          const daCrit = Math.random() < computeCritChance(hero);
          const daRaw = computeRawDamage({ ...hero, baseDamage: attackBaseDamage }, daCrit);
          const daMitigated = applyACMitigation(daRaw, mainEnemy);
          mainEnemy.hp = Math.max(0, mainEnemy.hp - daMitigated);
          totalDamageThisTick += daMitigated;
          addLog(`${hero.name} strikes again (Double Attack) for ${daMitigated.toFixed(1)}${daCrit ? " (CRIT)" : ""}!`, "skill");
        } else {
          addLog(`${hero.name}'s double attack misses ${mainEnemy.name}.`, "damage_dealt");
        }

        // Skill-up roll only when double attack procs
        if (skill < cap) {
          const skillChance = doubleAttackSkillUpChance(hero, cap);
          if (skillChance > 0 && Math.random() < skillChance) {
            hero.doubleAttackSkill = Math.min(cap, skill + 1);
            addLog(`${hero.name}'s Double Attack skill increases to ${hero.doubleAttackSkill}!`, "skill");
            updateStatsModalSkills(hero);
          }
        }
      }
    }

    if (mainEnemy.hp <= 0) {
      break;
    }
  }

  // Check if main enemy is killed
  if (mainEnemy.hp <= 0) {
    onEnemyKilled(mainEnemy, Math.max(1, totalDamageThisTick));
    totalDamageThisTick = 0;
    state.currentEnemies.shift(); // Remove main enemy from list
    
    // If no more enemies, trigger respawn
    if (state.currentEnemies.length === 0) {
      state.waitingToRespawn = true;
      return;
    }
  }

  // 4) All living enemies attack party
  let livingMembers = state.party.filter(h => !h.isDead);
  if (livingMembers.length > 0) {
    for (const enemy of state.currentEnemies) {
      // Check if enemy is feared and skip attack
      if (hasBuff(enemy, "fear")) {
        addLog(`${enemy.name} is running for its life and cannot attack!`, "normal");
        continue;
      }
      
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
        continue;
      }

      const isCrit = Math.random() < computeCritChance(enemy);
      const rawDamage = computeRawDamage(enemy, isCrit);
      const mitigated = applyACMitigation(rawDamage, target);
      
      // Apply tempHP absorption (e.g., from Arcane Shield buff)
      let damageToHealth = mitigated;
      const arcaneShieldBuff = getBuff(target, "arcane_shield");
      if (arcaneShieldBuff && arcaneShieldBuff.data && arcaneShieldBuff.data.tempHP > 0) {
        const tempHPAbsorbed = Math.min(arcaneShieldBuff.data.tempHP, damageToHealth);
        arcaneShieldBuff.data.tempHP -= tempHPAbsorbed;
        damageToHealth -= tempHPAbsorbed;
      }
      
      target.health = Math.max(0, target.health - damageToHealth);
      addLog(`${enemy.name} hits ${target.name} for ${mitigated.toFixed(1)}${isCrit ? " (CRIT)" : ""}!`, "damage_taken");

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

      // Check for death on the target
      if (target.health <= 0 && !target.isDead) {
        target.isDead = true;
        target.deathTime = Date.now();
        addLog(`${target.name} has been defeated!`, "damage_taken");
      }
    }
    // Re-evaluate living members after attacks; if none left, wipe ends combat
    livingMembers = state.party.filter(h => !h.isDead);
    if (livingMembers.length === 0) {
      onPartyWipe();
      return;
    }
  } else if (state.currentEnemies.length > 0) {
    onPartyWipe();
    return;
  }

  checkSlotUnlocks();
}
