import { state, nextHeroId } from "./state.js";
import { CLASS_DEFS, SLOT_UNLOCKS } from "./defs.js";
import { addLog, randInt } from "./util.js";

export function getClassDef(key) {
  return CLASS_DEFS.find(c => c.key === key);
}

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
    healing: cls.baseHealing
  };
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

  addLog(`Your party defeats the ${enemy.name}, dealing ${totalDPS.toFixed(1)} damage. +${xp} XP, +${gold} gold.`);

  spawnEnemy();
}

function onPartyWipe() {
  addLog("Your party is overwhelmed and wiped out. You drag your corpses back to the campfire...");
  const lostGold = Math.floor(state.gold * 0.15);
  state.gold = Math.max(0, state.gold - lostGold);
  state.killsThisZone = 0;
  state.partyHP = Math.floor(state.partyMaxHP * 0.5);
  spawnEnemy();
  addLog(`You lost ${lostGold} gold and must rebuild your momentum in this zone.`);
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
  if (!state.currentEnemy || state.party.length === 0) {
    if (!state.currentEnemy) spawnEnemy();
    return;
  }

  const totals = recalcPartyTotals();
  const enemy = state.currentEnemy;

  enemy.hp = Math.max(0, enemy.hp - totals.totalDPS);

  const rawDamage = enemy.dps;
  const mitigated = Math.max(rawDamage - totals.totalHealing, 0);

  if (mitigated > 0) {
    state.partyHP = Math.max(0, state.partyHP - mitigated);
  } else if (totals.totalHealing > rawDamage) {
    state.partyHP = Math.min(state.partyMaxHP, state.partyHP + (totals.totalHealing - rawDamage) * 0.3);
  }

  if (enemy.hp <= 0) {
    onEnemyKilled(enemy, totals.totalDPS);
  } else if (state.partyHP <= 0 && state.partyMaxHP > 0) {
    onPartyWipe();
  }

  checkSlotUnlocks();
}
