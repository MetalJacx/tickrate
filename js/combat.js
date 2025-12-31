import { state, nextHeroId } from "./state.js";
import { getClassDef, CLASS_DEFS } from "./classes/index.js";
import { getZoneDef, getEnemyForZone, MAX_ZONE, rollSubAreaDiscoveries, ensureZoneDiscovery, getZoneById, getActiveSubArea } from "./zones/index.js";
import { addLog, randInt } from "./util.js";
import { ACCOUNT_SLOT_UNLOCKS, GAME_TICK_MS } from "./defs.js";
import {
  applyACMitigation,
  computeCritChance,
  computeHitChance,
  computeManaRegenPerSecond,
  computeMaxHP,
  computeMaxMana,
  computeRawDamage
} from "./combatMath.js";

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

function refreshHeroDerived(hero) {
  const cls = getClassDef(hero.classKey) || {};
  hero.stats = fillStats(hero.stats || cls.stats);
  hero.baseHP = hero.baseHP ?? cls.baseHP ?? hero.maxHP ?? 50;
  hero.baseDamage = hero.baseDamage ?? cls.baseDamage ?? cls.baseDPS ?? hero.dps ?? 5;
  hero.baseMana = hero.baseMana ?? cls.baseMana ?? 0;
  hero.primaryStat = primaryStatKey(hero, cls);

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

  // Ensure endurance pools exist
  hero.maxEndurance = hero.maxEndurance ?? cls.maxEndurance ?? 0;
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

export function createHero(classKey, customName = null) {
  const cls = getClassDef(classKey);
  if (!cls) return null;

  const hero = {
    id: nextHeroId(),
    classKey: cls.key,
    name: customName || cls.name,
    role: cls.role,
    level: 1,
    baseHP: cls.baseHP,
    baseDamage: cls.baseDamage ?? cls.baseDPS ?? cls.baseHealing ?? 5,
    baseMana: cls.baseMana ?? 0,
    stats: fillStats(cls.stats),
    maxHP: cls.baseHP,
    health: cls.baseHP,
    dps: cls.baseDamage ?? cls.baseDPS ?? 0,
    healing: cls.baseHealing,
    isDead: false,
    deathTime: null,
    primaryStat: cls.primaryStat || null,
    
    // Resource pools based on class type
    resourceType: cls.resourceType, // "mana", "endurance", or ["mana", "endurance"] for Ranger
    maxMana: cls.maxMana || 0,
    mana: cls.maxMana || 0,
    manaRegenPerTick: cls.manaRegenPerTick || 0,
    maxEndurance: cls.maxEndurance || 0,
    endurance: cls.maxEndurance || 0,
    enduranceRegenPerTick: cls.enduranceRegenPerTick || 0,

    // Temporary debuffs
    tempDamageDebuffTicks: 0,
    tempDamageDebuffAmount: 0,

    // Revival countdown tracking
    revivalNotifications: {},

    // Regeneration tick counter (regen happens every 2 ticks)
    regenTickCounter: 0,

    // Ability bar (12 slots, skill keys mapped by slot index)
    abilityBar: {},

    // cooldown tracking per hero:
    skillTimers: {}
  };

  refreshHeroDerived(hero);
  hero.health = hero.maxHP;
  hero.mana = hero.maxMana;
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

export function applyHeroLevelUp(hero) {
  const cost = heroLevelUpCost(hero);
  if (!hero.xp) hero.xp = 0;
  if (hero.xp < cost) return; // Not enough XP

  hero.xp -= cost;
  hero.level += 1;
  // Simple scaling: +12% base HP, +10% base damage/DPS, +10% Healing per level
  hero.baseHP = Math.floor(hero.baseHP * 1.12);
  hero.baseDamage = hero.baseDamage * 1.10;
  hero.dps = hero.baseDamage;
  hero.healing = hero.healing * 1.10;
  refreshHeroDerived(hero);
  // Reset skill cooldowns so new level feels responsive
  if (hero.skillTimers) {
    for (const key of Object.keys(hero.skillTimers)) {
      hero.skillTimers[key] = 0;
    }
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
  return totalXpAtEnd(level) - totalXpAtEnd(level - 1);
}

// Account XP gain multiplier (slower after level 10)
function accountXPMult(accountLevel) {
  return accountLevel <= 10 ? 1.0 : 0.6;
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

function checkAccountLevelUp() {
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
  
  state.currentEnemies = [enemy];
  state.waitingToRespawn = false;
  addLog(`A level ${level} ${enemyDef.name} appears in Zone ${z}.`);
  
  // Check for immediate reinforcement chance
  checkForReinforcement();
}

function spawnEnemyToList() {
  const z = state.zone;
  
  // Get enemy definition from zone
  const discovery = getDiscoveryState(z);
  const enemyDef = getEnemyForZone(z, discovery);
  if (!enemyDef) return;
  const level = resolveEnemyLevel(enemyDef, z);
  
  // Scale enemy stats based on level
  const enemy = buildEnemyFromTemplate(enemyDef, level);
  
  state.currentEnemies.push(enemy);
  addLog(`Oh no! Your luck is not on your side—another ${enemyDef.name} takes notice of your presence!`, "damage_taken");
}

export { spawnEnemyToList };

function checkForReinforcement() {
  // Each enemy has 5% chance per tick to call reinforcements (when in combat)
  if (state.currentEnemies.length > 0) {
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
  let lvl = 1;
  for (const hero of state.party) {
    lvl = Math.max(lvl, hero.level || 1);
  }
  return lvl;
}

function computeKillXP(enemy) {
  const mobLevel = enemy.level || state.zone || 1;
  const playerLevel = partyReferenceLevel();
  const delta = mobLevel - playerLevel;

  // P99-style base XP
  const baseXP = 75 * mobLevel * mobLevel;

  let levelMult = 1;
  if (delta >= 0) {
    const bonusDelta = Math.min(Math.max(delta, 0), 6); // clamp 0..6
    levelMult = 1 + 0.10 * bonusDelta;
  } else {
    if (delta <= -10) {
      levelMult = 0;
    } else {
      levelMult = 1 - (Math.abs(delta) / 10);
    }
  }

  const killXP = Math.floor(baseXP * levelMult);
  return { killXP, baseXP, levelMult, delta, playerLevel, mobLevel };
}

function onEnemyKilled(enemy, totalDPS) {
  const { killXP } = computeKillXP(enemy);
  const gold = 5 + state.zone * 4 + enemy.level;

  // Apply group bonus based on LIVING party size only
  const livingPartySize = state.party.filter(h => !h.isDead).length;
  const groupBonus = 1.0 + (livingPartySize - 1) * 0.1; // 1.0x, 1.1x, 1.2x, 1.3x, 1.4x, 1.5x
  const totalXP = killXP * groupBonus;
  const totalXPRounded = Math.floor(totalXP);

  state.totalXP += totalXPRounded;
  state.gold += gold;
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
    for (const hero of state.party) {
      if (!hero.isDead) {
        if (!hero.xp) hero.xp = 0;
        const heroWeight = hero.level * hero.level;
        const heroShare = totalXPRounded * (heroWeight / totalWeight);
        hero.xp += heroShare;
      }
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

  addLog(`Your party defeats the ${enemy.name}, dealing ${totalDPS.toFixed(1)} damage. +${Math.floor(totalXP)} XP, +${gold} gold.`, "gold");
  state.currentEnemy = null;
  state.waitingToRespawn = true;
  state.huntRemaining = HUNT_TIME_MS; // Start hunt timer
}

function onPartyWipe() {
  addLog("Your party is overwhelmed and wiped out. You drag your corpses back to the campfire...", "damage_taken");
  const lostGold = Math.floor(state.gold * 0.15);
  state.gold = Math.max(0, state.gold - lostGold);
  state.killsThisZone = 0;
  state.partyHP = Math.floor(state.partyMaxHP * 0.5);
  addLog(`You lost ${lostGold} gold and must rebuild your momentum in this zone.`, "damage_taken");
  
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

export function gameTick() {
  // Handle auto-revival for dead members (60 second timer)
  const now = Date.now();
  for (const hero of state.party) {
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
  }

  // Check for reinforcements if in combat
  if (state.currentEnemies.length > 0) {
    checkForReinforcement();
  }

  recalcPartyTotals();
  
  // Determine if in combat (affects regen rates)
  const inCombat = state.currentEnemies.length > 0;
  
  // 1) Regenerate resources for all living members (every 2 ticks)
  for (const hero of state.party) {
    if (hero.isDead) continue;
    
    // Increment regen tick counter
    hero.regenTickCounter = (hero.regenTickCounter || 0) + 1;
    
    // Only apply regen every 2 ticks
    if (hero.regenTickCounter >= 2) {
      hero.regenTickCounter = 0;
      
      // Apply regen rates: full out of combat, 1/3 in combat
      const manaRegenRate = inCombat ? hero.manaRegenPerTick / 3 : hero.manaRegenPerTick;
      const enduranceRegenRate = inCombat ? hero.enduranceRegenPerTick / 3 : hero.enduranceRegenPerTick;
      
      if (manaRegenRate && hero.mana < hero.maxMana) {
        hero.mana = Math.min(hero.maxMana, hero.mana + manaRegenRate);
      }
      if (enduranceRegenRate && hero.endurance < hero.maxEndurance) {
        hero.endurance = Math.min(hero.maxEndurance, hero.endurance + enduranceRegenRate);
      }
    }
  }
  
  // 2) Apply passive health regeneration to living members only (every 2 ticks)
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
    } else {
      // Log camping reason periodically (every 10 ticks to avoid spam)
      if (!state.lastCampLogTick || state.lastCampLogTick >= 10) {
        addLog(`⛺ Camping to recover: ${campCheck.reasons.join(', ')}`, "normal");
        state.lastCampLogTick = 0;
      } else {
        state.lastCampLogTick++;
      }
    }
  }

  // Check if any party member is damaged (for heal checks)
  const anyDamaged = state.party.some(h => !h.isDead && h.health < h.maxHP);

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
        
        if (!hasResources) {
          continue; // Skip this skill if not enough resources or no one needs healing
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
          // Calculate damage with min/max variance
          const minDmg = sk.minDamage || sk.amount || 0;
          const maxDmg = sk.maxDamage || sk.amount || 0;
          const damage = minDmg + Math.random() * (maxDmg - minDmg);
          const damageTypeLabel = sk.damageType ? ` (${sk.damageType})` : "";
          if (state.currentEnemies.length > 0) {
            const target = state.currentEnemies[0];
            const mitigated = applyACMitigation(damage, target);
            target.hp = Math.max(0, target.hp - mitigated);
            totalDamageThisTick += mitigated;
            addLog(`${hero.name} uses ${sk.name}${damageTypeLabel} for ${mitigated.toFixed(1)} damage!`, "damage_dealt");
          } else {
            addLog(`${hero.name} uses ${sk.name}${damageTypeLabel}, but there is nothing to hit.`, "normal");
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
          const healAmount = Math.min(sk.amount, missingHP);
          target.health += healAmount;
          addLog(`${hero.name} casts ${sk.name} on ${target.name} for ${healAmount.toFixed(1)} healing!`, "healing");
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
          if (!revived) {
            addLog(`${hero.name} casts ${sk.name} but no one needs revival.`);
          }
        }
        hero.skillTimers[sk.key] = sk.cooldownSeconds;
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
      // Single-target damage: pick one living member to take the hit
      const target = livingMembers[randInt(livingMembers.length)];
      const hitChance = computeHitChance(enemy, target);
      if (Math.random() > hitChance) {
        addLog(`${enemy.name} misses ${target.name}.`, "damage_taken");
        continue;
      }

      const isCrit = Math.random() < computeCritChance(enemy);
      const rawDamage = computeRawDamage(enemy, isCrit);
      const mitigated = applyACMitigation(rawDamage, target);
      target.health = Math.max(0, target.health - mitigated);
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
