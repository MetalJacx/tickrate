import { state, nextHeroId } from "./state.js";
import { getClassDef, CLASS_DEFS } from "./classes/index.js";
import { getZoneDef, getEnemyForZone, MAX_ZONE } from "./zones/index.js";
import { addLog, randInt } from "./util.js";
import { SLOT_UNLOCKS } from "./defs.js";

export function createHero(classKey, customName = null) {
  const cls = getClassDef(classKey);
  if (!cls) return null;

  return {
    id: nextHeroId(),
    classKey: cls.key,
    name: customName || cls.name,
    role: cls.role,
    level: 1,
    maxHP: cls.baseHP,
    health: cls.baseHP,
    dps: cls.baseDPS,
    healing: cls.baseHealing,
    isDead: false,
    deathTime: null,

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
  let totalCurrentHP = 0;
  let totalDPS = 0;
  let totalHealing = 0;

  for (const h of state.party) {
    if (h?.isDead) continue; // Skip dead members
    totalMaxHP += h?.maxHP ?? 0;
    totalCurrentHP += h?.health ?? 0;
    totalDPS += h?.dps ?? 0;
    totalHealing += h?.healing ?? 0;
  }

  state.partyMaxHP = totalMaxHP;
  state.partyHP = totalCurrentHP;

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
  const baseXP = 5 + state.zone * 3 + enemy.level * 2;
  const gold = 5 + state.zone * 4 + enemy.level;

  // Apply group bonus based on party size
  const partySize = state.party.length;
  const groupBonus = 1.0 + (partySize - 1) * 0.1; // 1.0x, 1.1x, 1.2x, 1.3x, 1.4x, 1.5x
  const totalXP = baseXP * groupBonus;

  state.totalXP += Math.floor(totalXP);
  state.gold += gold;
  state.killsThisZone += 1;

  // Calculate level-weighted XP distribution
  // weight = level^2
  let totalWeight = 0;
  for (const hero of state.party) {
    totalWeight += hero.level * hero.level;
  }

  // Distribute XP proportionally by level weight
  for (const hero of state.party) {
    if (!hero.xp) hero.xp = 0;
    const heroWeight = hero.level * hero.level;
    const heroShare = totalXP * (heroWeight / totalWeight);
    hero.xp += heroShare;
  }

  // Award to account (use base XP to avoid double-counting bonus)
  state.accountLevelXP += baseXP;
  checkAccountLevelUp();

  addLog(`Your party defeats the ${enemy.name}, dealing ${totalDPS.toFixed(1)} damage. +${Math.floor(totalXP)} XP, +${gold} gold.`, "gold");
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
  // Handle auto-revival for dead members (60 second timer)
  const now = Date.now();
  for (const hero of state.party) {
    if (hero.isDead && hero.deathTime) {
      const timeSinceDeath = (now - hero.deathTime) / 1000; // seconds
      if (timeSinceDeath >= 60) {
        hero.isDead = false;
        hero.deathTime = null;
        hero.health = Math.max(1, hero.maxHP * 0.1); // Revive at 10% HP
        addLog(`${hero.name} has been automatically revived with 10% health!`);
      }
    }
  }

  const totals = recalcPartyTotals();
  
  // 1) Apply passive health regeneration to living members only
  const baseRegenPerTick = 2;
  const scalingRegenPerTick = totals.totalHealing * 0.2;
  const passiveRegenAmount = baseRegenPerTick + scalingRegenPerTick;
  
  for (const hero of state.party) {
    if (hero.isDead) continue; // Skip dead members
    if (passiveRegenAmount > 0 && hero.health < hero.maxHP) {
      const oldHP = hero.health;
      hero.health = Math.min(hero.maxHP, hero.health + passiveRegenAmount);
      const actualHealed = hero.health - oldHP;
      if (actualHealed > 0.1) {
        addLog(`${hero.name} regenerates ${actualHealed.toFixed(1)} HP!`, "regen");
      }
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
    if (hero.isDead) continue; // Dead heroes can't use skills
    
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

  // 3) Apply damage to enemy (with variance)
  const baseTotalDamage = totals.totalDPS + skillBonusDamage;
  const variance = baseTotalDamage * 0.2; // ±20% variance
  const totalDamage = Math.max(1, baseTotalDamage - variance + Math.random() * (variance * 2));
  if (totalDamage > 0) {
    enemy.hp = Math.max(0, enemy.hp - totalDamage);
    addLog(`Party attacks for ${totalDamage.toFixed(1)} damage!`, "damage_dealt");
  }

  // 4) Apply enemy damage to living party members
  const baseRawDamage = enemy.dps;
  const enemyVariance = baseRawDamage * 0.2; // ±20% variance
  const rawDamage = Math.max(1, baseRawDamage - enemyVariance + Math.random() * (enemyVariance * 2));
  
  // Get living members
  const livingMembers = state.party.filter(h => !h.isDead);
  if (livingMembers.length > 0) {
    // Apply healing reduction to total damage FIRST, then split among members
    const effectiveHealing = totals.totalHealing + skillBonusHeal;
    const mitigatedTotal = Math.max(0, rawDamage - effectiveHealing);
    const damagePerMember = mitigatedTotal / livingMembers.length;
    
    if (mitigatedTotal > 0) {
      // Distribute damage across living members
      for (const hero of livingMembers) {
        hero.health = Math.max(0, hero.health - damagePerMember);
        
        // Check for death
        if (hero.health <= 0 && !hero.isDead) {
          hero.isDead = true;
          hero.deathTime = Date.now();
          addLog(`${hero.name} has been defeated!`, "damage_taken");
        }
      }
      addLog(`${enemy.name} deals ${damagePerMember.toFixed(1)} damage to each member!`, "damage_taken");
    } else if (effectiveHealing > rawDamage) {
      const healed = (effectiveHealing - rawDamage) * 0.3;
      for (const hero of livingMembers) {
        hero.health = Math.min(hero.maxHP, hero.health + healed);
      }
      addLog(`Party heals for ${healed.toFixed(1)} HP!`, "healing");
    }
  }

  if (enemy.hp <= 0) {
    onEnemyKilled(enemy, totalDamage);
  } else if (livingMembers.length === 0) {
    onPartyWipe();
  }

  checkSlotUnlocks();
}
