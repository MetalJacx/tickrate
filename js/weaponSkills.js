// EverQuest-style weapon skill system
import { getItemDef } from "./items.js";
import { addLog } from "./util.js";

export const WEAPON_TYPES = [
  "1h_slash",
  "1h_blunt",
  "1h_pierce",
  "2h_slash",
  "2h_blunt",
  "2h_pierce",
  "hand_to_hand",
  "archery"
];

// Human-readable weapon type names
export const WEAPON_TYPE_NAMES = {
  "1h_slash": "1H Slashing",
  "1h_blunt": "1H Blunt",
  "1h_pierce": "1H Piercing",
  "2h_slash": "2H Slashing",
  "2h_blunt": "2H Blunt",
  "2h_pierce": "2H Piercing",
  "hand_to_hand": "Hand to Hand",
  "archery": "Archery"
};

const HARD_SKILL_CAP = 300;

const CLASS_SKILL_MULTIPLIER = {
  warrior: 1.10,
  rogue: 1.05,
  monk: 1.10,
  ranger: 1.05,
  paladin: 1.00,
  shadowknight: 1.00,
  cleric: 0.90,
  druid: 0.90,
  shaman: 0.90,
  enchanter: 0.85,
  wizard: 0.85,
  magician: 0.85,
  necromancer: 0.85
};

export function ensureWeaponSkills(hero) {
  hero.weaponSkills = hero.weaponSkills || {};
  for (const wt of WEAPON_TYPES) {
    if (!hero.weaponSkills[wt]) hero.weaponSkills[wt] = { value: 1 };
  }
}

export function getWeaponSkillCap(hero, skillId) {
  const baseCap = 5 * (hero.level || 1);
  const mult = CLASS_SKILL_MULTIPLIER[hero.classKey] ?? 1.0;
  return Math.min(Math.floor(baseCap * mult), HARD_SKILL_CAP);
}

export function getWeaponSkillRatio(hero, skillId) {
  ensureWeaponSkills(hero);
  const skill = hero.weaponSkills?.[skillId]?.value ?? 1;
  const cap = getWeaponSkillCap(hero, skillId);
  if (cap <= 0) return 0;
  return Math.max(0, Math.min(1, skill / cap));
}

const WEAPON_UNLOCKS = {
  warrior: {
    1: ["1h_slash","1h_blunt","1h_pierce","2h_slash","2h_blunt","hand_to_hand"],
    10: ["2h_pierce"],
    15: ["archery"]
  },
  rogue: {
    1: ["1h_slash","1h_pierce","hand_to_hand"],
    8: ["archery"]
  },
  cleric: {
    1: ["1h_blunt","hand_to_hand"]
  },
  paladin: {
    1: ["1h_slash","1h_blunt","2h_slash","hand_to_hand"]
  },
  ranger: {
    1: ["1h_slash","1h_blunt","hand_to_hand"],
    5: ["archery"],
    10: ["2h_slash"]
  },
  monk: {
    1: ["hand_to_hand"]
  },
  wizard: {
    1: ["hand_to_hand","1h_pierce"]
  },
  enchanter: {
    1: ["hand_to_hand","1h_pierce"]
  },
  // Add other classes with hand_to_hand at minimum
  druid: {
    1: ["hand_to_hand","1h_blunt"]
  },
  shaman: {
    1: ["hand_to_hand","1h_blunt"]
  },
  shadowknight: {
    1: ["1h_slash","1h_blunt","2h_slash","hand_to_hand"]
  },
  necromancer: {
    1: ["hand_to_hand","1h_pierce"]
  },
  magician: {
    1: ["hand_to_hand","1h_pierce"]
  }
};

export function isWeaponTypeUnlocked(hero, weaponType) {
  // hand_to_hand is always unlocked for all classes (universal fallback)
  if (weaponType === "hand_to_hand") return true;
  
  const unlocks = WEAPON_UNLOCKS[hero.classKey];
  if (!unlocks) return false;
  const levels = Object.keys(unlocks).map(n => parseInt(n, 10)).sort((a,b)=>a-b);
  for (const levelReq of levels) {
    if ((hero.level || 1) >= levelReq && unlocks[levelReq].includes(weaponType)) {
      return true;
    }
  }
  return false;
}

export function getUnlockedWeaponTypes(hero) {
  const unlocked = [];
  for (const weaponType of WEAPON_TYPES) {
    if (isWeaponTypeUnlocked(hero, weaponType)) {
      unlocked.push(weaponType);
    }
  }
  return unlocked;
}

export function applyWeaponUnlocks(hero) {
  const unlocks = WEAPON_UNLOCKS[hero.classKey];
  if (!unlocks) return;
  ensureWeaponSkills(hero);
  const newlyUnlocked = unlocks[hero.level];
  if (!newlyUnlocked) return;
  for (const skillId of newlyUnlocked) {
    if (!hero.weaponSkills[skillId]) {
      hero.weaponSkills[skillId] = { value: 1 };
    }
  }
}

export function canEquipWeapon(hero, itemDef) {
  const wt = itemDef?.weaponType;
  if (!wt) return true; // Non-weapon or unspecified: allow
  return isWeaponTypeUnlocked(hero, wt);
}

export function getEquippedWeaponType(entity) {
  const itemEntry = entity?.equipment?.main;
  if (!itemEntry?.id) return "hand_to_hand";
  const def = getItemDef(itemEntry.id);
  return def?.weaponType || "hand_to_hand";
}

// Melee hit chance and damage based on spec
const BASE_HIT = 0.70;
const HIT_MIN = 0.05;
const HIT_MAX = 0.95;
const SKILL_HIT_BONUS_MAX = 0.15;

export function getMeleeHitChance(hero, weaponType, target) {
  const skillRatio = getWeaponSkillRatio(hero, weaponType);
  let hitChance = BASE_HIT;
  hitChance += (hero.level || 1) * 0.002;
  hitChance += skillRatio * SKILL_HIT_BONUS_MAX;
  const dex = hero?.stats?.dex || 0;
  const dexHitBonus = Math.min(0.05, dex * 0.00025);
  hitChance += dexHitBonus;
  return Math.max(HIT_MIN, Math.min(HIT_MAX, hitChance));
}

export function getMeleeDamage(hero, weaponBaseDamage, weaponType) {
  const skillRatio = getWeaponSkillRatio(hero, weaponType);
  const skillScalar = 0.85 + 0.15 * skillRatio;
  const str = hero?.stats?.str || 0;
  const strScalar = 1 + str * 0.01;
  return weaponBaseDamage * strScalar * skillScalar;
}

export function tryWeaponSkillUp(hero, weaponType, targetLevel) {
  ensureWeaponSkills(hero);
  const entry = hero.weaponSkills[weaponType];
  if (!entry) return false;
  const skill = entry.value || 1;
  const cap = getWeaponSkillCap(hero, weaponType);
  if (skill >= cap) return false;
  if ((targetLevel || 1) <= (hero.level || 1) - 5) return false;
  const minChance = 0.5;
  const maxChance = 6.0;
  const chance = (maxChance - minChance) * Math.pow(0.99, skill) + minChance;
  if (Math.random() * 100 < chance) {
    entry.value = skill + 1;
    const weaponName = WEAPON_TYPE_NAMES[weaponType] || weaponType;
    const heroName = hero.name || "Hero";
    addLog(`${heroName}'s ${weaponName} skill increases to ${entry.value}!`, "skill");
    return true;
  }
  return false;
}
