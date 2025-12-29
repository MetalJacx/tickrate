import { state, nextHeroId } from "./state.js";
import { getClassDef, CLASS_DEFS } from "./classes/index.js";
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

let skillBonusDamage = 0;
let skillBonusHeal = 0;

for (const hero of state.party) {
  const skills = getUnlockedSkills(hero);

  for (const sk of skills) {
    if (hero.skillTimers[sk.key] == null) hero.skillTimers[sk.key] = 0;

    // tick cooldown down
    hero.skillTimers[sk.key] = Math.max(0, hero.skillTimers[sk.key] - 1);

    // fire if ready
    if (hero.skillTimers[sk.key] === 0) {
      if (sk.type === "damage") skillBonusDamage += sk.amount;
      if (sk.type === "heal") skillBonusHeal += sk.amount;

      hero.skillTimers[sk.key] = sk.cooldownSeconds;
    }
  }
}

export function heroLevelUpCost(hero) {
  return Math.floor(20 * hero.level * (1 + state.zone * 0.4));
}

export function applyHeroLevelUp(hero) {
  const oldMax = hero.maxHP;
  hero.level += 1;
  hero.maxHP = Math.floor(hero.maxHP * 1.25);
  hero.dps = parseFloat((hero.dps * 1.25).toFixed(1));
  hero.healing = parseFloat((hero.healing * 1.25).toFixed(1));

  const delta = hero.maxHP - oldMax;
  state.partyMaxHP += delta;
  state.partyHP += delta;
}

export function recalcPartyTotals() {
  let maxHP = 0, totalDPS = 0, totalHealing = 0;
  for (const h of state.party) {
    maxHP += h.maxHP;
    totalDPS += h.dps;
    totalHealing += h.healing;
  }
  state.partyMaxHP = maxHP;
  if (state.partyHP > maxHP) state.partyHP = maxHP;
  if (state.partyHP === 0 && maxHP > 0) state.partyHP = maxHP;

  return {
    maxHP,
    totalDPS: parseFloat(totalDPS.toFixed(1)),
    totalHealing: parseFloat(totalHealing.toFixed(1))
  };
}

function checkAccountLevelUp() {
  while (state.accountLevelXP >= state.accountLevelUpCost) {
    state.accountLevelXP -= state.accountLevelUpCost;
    state.accountLevel += 1;
    state.accountLevelUpCost = Math.ceil(state.accountLevelUpCost * 1.15); // Costs increase by 15%
    addLog(`Account leveled up to level ${state.accountLevel}!`, "gold");
  }
}

function pickEnemyNameForZone(zone) {
  if (zone <= 2) return ["Decaying Skeleton", "Gnoll Scout", "Young Orc", "Rabid Wolf"][randInt(4)];
  if (zone <= 4) return ["Skeletal Knight", "Orc Centurion", "Dark Wolf", "Bloodsaber Acolyte"][randInt(4)];
  if (zone <= 6) return ["Plague Knight", "Shadow Assassin", "Ghoul", "Corrupted Treant"][randInt(4)];
  return ["Ancient Lich", "Avatar of Rot", "Eternal Horror", "Doomcaller"][randInt(4)];
}

export function spawnEnemy() {
  const z = state.zone;
  const level = z + randInt(3);
  const maxHP = 60 + z * 15 + level * 10;
  const dps = 4 + z * 2 + level;
  const name = pickEnemyNameForZone(z);

  state.currentEnemy = { name, level, maxHP, hp: maxHP, dps };
  state.waitingToRespawn = false;
  addLog(`A level ${level} ${name} appears in Zone ${z}.`);
}

function checkSlotUnlocks() {
  for (const rule of SLOT_UNLOCKS) {
    if (state.zone >= rule.zone && state.partySlotsUnlocked < rule.slots) {
      state.partySlotsUnlocked = rule.slots;
      addLog(`Your reputation grows. You can now have up to ${rule.slots} party members.`);
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

export function canTravel() {
  return state.killsThisZone >= state.killsForNextZone;
}

export function travelToNextZone() {
  if (!canTravel()) return;
  state.zone += 1;
  state.killsThisZone = 0;
  addLog(`You travel deeper into the wilds to Zone ${state.zone}.`);
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
    if (actualHealed > 0.1) { // Only log if meaningful healing
      addLog(`Party regenerates ${actualHealed.toFixed(1)} HP!`, "healing");
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
          addLog(`${hero.name} uses ${sk.name} for ${sk.amount} damage!`, "damage_dealt");
        }
        if (sk.type === "heal") {
          skillBonusHeal += sk.amount;
          addLog(`${hero.name} casts ${sk.name} for ${sk.amount} healing!`, "healing");
        }
        hero.skillTimers[sk.key] = sk.cooldownSeconds;
      }
    }
  }

  // 3) Apply damage to enemy
  const totalDamage = totals.totalDPS + skillBonusDamage;
  if (totalDamage > 0) {
    enemy.hp = Math.max(0, enemy.hp - totalDamage);
    addLog(`Party attacks for ${totalDamage.toFixed(1)} damage!`, "damage_dealt");
  }

  // 4) Apply enemy damage to party, reduced by healing
  const rawDamage = enemy.dps;
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
