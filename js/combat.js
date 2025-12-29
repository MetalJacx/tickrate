import { state, nextHeroId } from "./state.js";
import { getClassDef, CLASS_DEFS } from "./classes/index.js";
import { getZoneDef, getEnemyForZone, MAX_ZONE } from "./zones/index.js";
import { addLog, randInt } from "./util.js";
import { SLOT_UNLOCKS } from "./defs.js";

export function createHero(classKey) {
  const cls = getClassDef(classKey);
  if (!cls) return null;

  return {
    id: nextHeroId(),
    classKey: cls.key,
    name: cls.name,
    role: cls.role,
    level: 1,
    maxHP: cls.baseHP,
    dps: cls.baseDPS,
    healing: cls.baseHealing,

    // cooldown tracking per hero:
    skillTimers: {}
  };
}

function getUnlockedSkills(hero) {
  const cls = getClassDef(hero.classKey);
  if (!cls?.skills) return [];
  return cls.skills.filter(s => hero.level >= s.level);
}
export function recalcPartyTotals() {
  let totalMaxHP = 0;
  let totalDPS = 0;
  let totalHealing = 0;

  for (const h of state.party) {
    totalMaxHP += h?.maxHP ?? 0;
    totalDPS += h?.dps ?? 0;
    totalHealing += h?.healing ?? 0;
  }

  state.partyMaxHP = totalMaxHP;
  if (state.partyHP == null) {
    state.partyHP = totalMaxHP;
  } else {
    state.partyHP = Math.min(state.partyHP, totalMaxHP);
  }

  return { totalDPS, totalHealing };
}

export function heroLevelUpCost(hero) {
  const base = 25;
  const scaling = Math.floor(hero.level * 15);
  return base + scaling;
}

export function applyHeroLevelUp(hero) {
  hero.level += 1;
  // Simple scaling: +12% HP, +10% DPS, +10% Healing per level
  hero.maxHP = Math.floor(hero.maxHP * 1.12);
  hero.dps = hero.dps * 1.10;
  hero.healing = hero.healing * 1.10;
  // Reset skill cooldowns so new level feels responsive
  if (hero.skillTimers) {
    for (const key of Object.keys(hero.skillTimers)) {
      hero.skillTimers[key] = 0;
    }
  }
}

function checkAccountLevelUp() {
  while (state.accountLevelXP >= state.accountLevelUpCost) {
    state.accountLevelXP -= state.accountLevelUpCost;
    state.accountLevel += 1;
    // Increase next requirement progressively
    state.accountLevelUpCost = Math.floor(state.accountLevelUpCost * 1.5);
    addLog(`SYSTEM: Account reaches level ${state.accountLevel}!`, "xp");
  }
}

export function spawnEnemy() {
  const z = state.zone;
  const level = z + randInt(3);
  
  // Get enemy definition from zone
  const enemyDef = getEnemyForZone(z);
  if (!enemyDef) {
    addLog("No enemies in this zone!");
    return;
  }
  
  // Scale enemy stats based on level
  const maxHP = enemyDef.baseHP + level * 10;
  const dps = enemyDef.baseDPS + level;

  state.currentEnemy = { name: enemyDef.name, level, maxHP, hp: maxHP, dps };
  state.waitingToRespawn = false;
  addLog(`A level ${level} ${enemyDef.name} appears in Zone ${z}.`);
}

function checkSlotUnlocks() {
  for (const rule of SLOT_UNLOCKS) {
    if (state.zone >= rule.zone && state.partySlotsUnlocked < rule.slots) {
      state.partySlotsUnlocked = rule.slots;
      addLog(`SYSTEM: Your reputation grows. You can now have up to ${rule.slots} party members.`);
    }
  }
}

function onEnemyKilled(enemy, totalDPS) {
  const xp = 5 + state.zone * 3 + enemy.level * 2;
  const gold = 5 + state.zone * 4 + enemy.level;

  state.totalXP += xp;
  state.gold += gold;
  state.killsThisZone += 1;

  // Award combat XP to all party members
  const combatXPPerMember = xp;
  for (const hero of state.party) {
    if (!hero.xp) hero.xp = 0;
    hero.xp += combatXPPerMember;
  }

  // Award to account
  state.accountLevelXP += xp;
  checkAccountLevelUp();

  addLog(`Your party defeats the ${enemy.name}, dealing ${totalDPS.toFixed(1)} damage. +${xp} XP, +${gold} gold.`, "gold");
  state.currentEnemy = null;
  state.waitingToRespawn = true;
}

function onPartyWipe() {
  addLog("Your party is overwhelmed and wiped out. You drag your corpses back to the campfire...", "damage_taken");
  const lostGold = Math.floor(state.gold * 0.15);
  state.gold = Math.max(0, state.gold - lostGold);
  state.killsThisZone = 0;
  state.partyHP = Math.floor(state.partyMaxHP * 0.5);
  addLog(`You lost ${lostGold} gold and must rebuild your momentum in this zone.`, "damage_taken");
  
  state.currentEnemy = null;
  state.waitingToRespawn = true;
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
  state.killsThisZone = 0;
  addLog(`SYSTEM: You retreat to Zone ${state.zone}.`);
  spawnEnemy();
  checkSlotUnlocks();
}

export function gameTick() {
  const totals = recalcPartyTotals();
  
  // 1) Apply passive health regeneration (always, even when no enemy)
  // Minimum 2 HP per tick + scaling bonus from healing stat
  const baseRegenPerTick = 2;
  const scalingRegenPerTick = totals.totalHealing * 0.2; // Additional scaling per healing point
  const passiveRegenAmount = baseRegenPerTick + scalingRegenPerTick;
  
  if (passiveRegenAmount > 0 && state.partyHP < state.partyMaxHP) {
    const oldHP = state.partyHP;
    state.partyHP = Math.min(state.partyMaxHP, state.partyHP + passiveRegenAmount);
    const actualHealed = state.partyHP - oldHP;
    if (actualHealed > 0.1) { // Only log if meaningful regen
      addLog(`Party regenerates ${actualHealed.toFixed(1)} HP!`, "regen");
    }
  }
  
  // Check if we should respawn
  if (state.waitingToRespawn && !state.currentEnemy) {
    if (state.partyMaxHP > 0) {
      const healthPercent = (state.partyHP / state.partyMaxHP) * 100;
      if (healthPercent >= state.autoRestartHealthPercent) {
        spawnEnemy();
      }
    } else {
      spawnEnemy();
    }
  }

  const enemy = state.currentEnemy;
  if (!enemy) return;

  // 2) Process skills and calculate bonuses
  let skillBonusDamage = 0;
  let skillBonusHeal = 0;

  for (const hero of state.party) {
    const cls = getClassDef(hero.classKey);
    if (!cls?.skills) continue;

    const skills = cls.skills.filter(s => hero.level >= s.level);

    for (const sk of skills) {
      if (hero.skillTimers[sk.key] == null) hero.skillTimers[sk.key] = 0;

      // Tick cooldown down
      hero.skillTimers[sk.key] = Math.max(0, hero.skillTimers[sk.key] - 1);

      // Fire if ready
      if (hero.skillTimers[sk.key] === 0) {
        // Award ability XP for using skill
        const abilityXP = 2;
        if (!hero.xp) hero.xp = 0;
        hero.xp += abilityXP;
        state.accountLevelXP += abilityXP;
        checkAccountLevelUp();

        if (sk.type === "damage") {
          skillBonusDamage += sk.amount;
          const damageTypeLabel = sk.damageType ? ` (${sk.damageType})` : "";
          addLog(`${hero.name} uses ${sk.name}${damageTypeLabel} for ${sk.amount} damage!`, "damage_dealt");
        }
        if (sk.type === "heal") {
          skillBonusHeal += sk.amount;
          addLog(`${hero.name} casts ${sk.name} for ${sk.amount} healing!`, "healing");
        }
        hero.skillTimers[sk.key] = sk.cooldownSeconds;
      }
    }
  }

  // 3) Apply damage to enemy (with variance)
  const baseTotalDamage = totals.totalDPS + skillBonusDamage;
  const variance = baseTotalDamage * 0.2; // ±20% variance
  const totalDamage = Math.max(1, baseTotalDamage - variance + Math.random() * (variance * 2));
  if (totalDamage > 0) {
    enemy.hp = Math.max(0, enemy.hp - totalDamage);
    addLog(`Party attacks for ${totalDamage.toFixed(1)} damage!`, "damage_dealt");
  }

  // 4) Apply enemy damage to party, reduced by healing (with variance)
  const baseRawDamage = enemy.dps;
  const enemyVariance = baseRawDamage * 0.2; // ±20% variance
  const rawDamage = Math.max(1, baseRawDamage - enemyVariance + Math.random() * (enemyVariance * 2));
  const effectiveHealing = totals.totalHealing + skillBonusHeal;
  const mitigated = Math.max(rawDamage - effectiveHealing, 0);

  if (mitigated > 0) {
    state.partyHP = Math.max(0, state.partyHP - mitigated);
    addLog(`${enemy.name} deals ${mitigated.toFixed(1)} damage!`, "damage_taken");
  } else if (effectiveHealing > rawDamage) {
    const healed = (effectiveHealing - rawDamage) * 0.3;
    state.partyHP = Math.min(state.partyMaxHP, state.partyHP + healed);
    addLog(`Party heals for ${healed.toFixed(1)} HP!`, "healing");
  }

  if (enemy.hp <= 0) {
    onEnemyKilled(enemy, totalDamage);
  } else if (state.partyHP <= 0 && state.partyMaxHP > 0) {
    onPartyWipe();
  }

  checkSlotUnlocks();
}
