// EverQuest-style weapon skill system
import { getItemDef } from "./items.js";
import { addLog } from "./util.js";
import { SKILL_UP_RATE_MULT } from "./defs.js";
import { state } from "./state.js";

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

// FIX 17: Centralized weapon type key normalization
// Purpose: Ensure equipment, combat, and UI all use identical weapon type keys
// Prevents key mismatch bugs where skill-ups write to one key but UI reads another
//
// Rules:
// - All weapon types must be one of the canonical keys in WEAPON_TYPES
// - Default to "hand_to_hand" if weapon type is null/undefined/unrecognized
// - This ensures skill-ups and displays never diverge
export function normalizeWeaponType(weaponType) {
  if (!weaponType) return "hand_to_hand";
  const normalized = String(weaponType).toLowerCase().trim();
  if (WEAPON_TYPES.includes(normalized)) return normalized;
  // Unrecognized weapon type: fallback to hand_to_hand (safe default)
  return "hand_to_hand";
}

// FIX 20: Sanitize skill values during load/migration
// Purpose: Handle saves with corrupted/old data (NaN, undefined, negative, above-cap values)
// - If value is not finite (NaN, Infinity) => reset to 1
// - If value is negative => reset to 1
// - If value exceeds cap => clamp to cap
// This ensures skills remain valid after formula/gating changes
export function sanitizeWeaponSkillValue(value, cap) {
  // Not finite (NaN, Infinity) => invalid
  if (!Number.isFinite(value)) return 1;
  // Negative values are invalid
  if (value < 0) return 1;
  // Clamp to valid range [1, cap]
  return Math.max(1, Math.min(value, cap));
}

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
    if (!hero.weaponSkills[wt]) {
      hero.weaponSkills[wt] = { value: 1 };
    } else {
      // FIX 20: Sanitize skill values during load
      // Clamp to current cap and handle corrupted data (NaN, negative, etc)
      const cap = getWeaponSkillCap(hero, wt);
      hero.weaponSkills[wt].value = sanitizeWeaponSkillValue(hero.weaponSkills[wt].value, cap);
    }
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
    1: ["1h_blunt","hand_to_hand"],
    // Progression unlocks: allow 2H weapons at level 10
    10: ["2h_blunt","2h_pierce"]
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
    1: ["hand_to_hand","1h_blunt"],
    // Progression unlocks: allow 2H weapons at level 10
    10: ["2h_blunt","2h_pierce"]
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
  // FIX 17: Normalize weapon type to ensure consistent keys across combat/UI
  return normalizeWeaponType(def?.weaponType);
}

// Melee hit chance and damage based on spec
const BASE_HIT = 0.70;
const HIT_MIN = 0.05;
const HIT_MAX = 0.95;
const SKILL_HIT_BONUS_MAX = 0.15;

function isTrivialTarget(heroLevel, targetLevel) {
  const hl = heroLevel || 1;
  const tl = targetLevel || 1;
  const gap = hl <= 10 ? 3 : 5;
  return tl <= hl - gap;
}

export function getMeleeHitChance(hero, weaponType, target) {
  // FIX 17: Normalize weapon type to prevent key mismatch
  const normalizedType = normalizeWeaponType(weaponType);
  const skillRatio = getWeaponSkillRatio(hero, normalizedType);
  let hitChance = BASE_HIT;
  hitChance += (hero.level || 1) * 0.002;
  hitChance += skillRatio * SKILL_HIT_BONUS_MAX;
  const dex = hero?.stats?.dex || 0;
  const dexHitBonus = Math.min(0.05, dex * 0.00025);
  hitChance += dexHitBonus;
  return Math.max(HIT_MIN, Math.min(HIT_MAX, hitChance));
}

export function getMeleeDamage(hero, weaponBaseDamage, weaponType) {
  // FIX 17: Normalize weapon type to prevent key mismatch
  const normalizedType = normalizeWeaponType(weaponType);
  const skillRatio = getWeaponSkillRatio(hero, normalizedType);
  const skillScalar = 0.85 + 0.15 * skillRatio;
  const str = hero?.stats?.str || 0;
  const strScalar = 1 + str * 0.01;
  return weaponBaseDamage * strScalar * skillScalar;
}

export function tryWeaponSkillUp(hero, weaponType, targetLevel) {
  // FIX 17: Normalize weapon type to prevent key mismatch bugs
  const normalizedType = normalizeWeaponType(weaponType);
  
  ensureWeaponSkills(hero);
  const entry = hero.weaponSkills[normalizedType];
  if (!entry) return false;
  const skill = entry.value || 1;
  const cap = getWeaponSkillCap(hero, normalizedType);
  if (skill >= cap) return false;
  if (isTrivialTarget(hero.level, targetLevel)) return false;
  const minChance = 0.5;
  const maxChance = 6.0;
  const chance = (maxChance - minChance) * Math.pow(0.99, skill) + minChance;
  // FIX 15: Apply skill-up rate multiplier to normalize for tickrate
  if (Math.random() * 100 < chance * SKILL_UP_RATE_MULT) {
    entry.value = skill + 1;
    const weaponName = WEAPON_TYPE_NAMES[normalizedType] || normalizedType;
    const heroName = hero.name || "Hero";
    addLog(`${heroName}'s ${weaponName} skill increases to ${entry.value}!`, "skill");
    // FIX 25: Throttle stats modal refresh to once per tick
    // Set flag; ui.renderAll will flush a single update if modal open
    state.needsSkillsUiRefresh = true;
    return true;
  }
  return false;
}
