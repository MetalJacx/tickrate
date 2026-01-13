/**
 * Resist System (EQ-flavored)
 * 
 * 4 resist buckets: magic, elemental, contagion, physical
 * Applies to everything except raw melee auto-attacks
 * Binary for CC/debuffs, Partial for damage spells + DoTs
 */

import {
  RESIST_BASE,
  RESIST_SCALE,
  RESIST_MIN_CHANCE,
  RESIST_MAX_CHANCE,
  RESIST_PARTIAL_STRENGTH,
  RESIST_PARTIAL_FLOOR
} from "./defs.js";
import { getRaceDef, DEFAULT_RACE_KEY } from "./races.js";

// Resist types
export const RESIST_TYPES = {
  MAGIC: "magic",
  ELEMENTAL: "elemental",
  CONTAGION: "contagion",
  PHYSICAL: "physical",
  NONE: "none"
};

/**
 * Calculate level difference modifier (piecewise EQ-ish)
 * diff = targetLevel - casterLevel
 */
export function levelDiffMod(diff) {
  if (diff <= -5) return -20;
  if (diff <= 0) return diff * 2;
  if (diff <= 5) return diff * 6;
  return 30 + (diff - 5) * 12;
}

/**
 * Calculate final resist chance
 * 
 * Inputs:
 * - targetResist: target.resists[type] (default 0)
 * - pen: caster.spellPen[type] (default 0)
 * - difficulty: action.resist.difficulty (default 0)
 * - levelMod: levelDiffMod(targetLevel - casterLevel)
 */
export function calculateResistChance(targetResist, pen, difficulty, levelMod) {
  const resistScore = (targetResist - pen) + difficulty + levelMod;
  
  const rawChance = (resistScore + RESIST_BASE) / RESIST_SCALE;
  
  return clamp(rawChance, RESIST_MIN_CHANCE, RESIST_MAX_CHANCE);
}

/**
 * Clamp value between min and max
 */
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Resolve a single resist roll
 * 
 * Returns:
 * {
 *   type: string,           // resist type
 *   chance: number,         // final resistChance (0-1)
 *   resisted: boolean,      // for binary CC/debuffs
 *   mult: number,           // effectiveness multiplier (0-1)
 *   partialPct: number      // 0-100 (for display)
 * }
 */
export function resolveActionResist({ caster, target, action, rng = Math.random }) {
  // No resist block or missing type => always lands
  if (!action?.resist || !action.resist.type || action.resist.type === "none") {
    return {
      type: action?.resist?.type || "none",
      chance: 0,
      resisted: false,
      mult: 1,
      partialPct: 100
    };
  }
  
  const resistType = action.resist.type;
  const difficulty = action.resist.difficulty ?? 0;
  const isPartial = action.resist.partial === true;
  
  // Get actor resists/pens (default to 0)
  const targetResist = target.resists?.[resistType] ?? 0;
  const casterPen = caster.spellPen?.[resistType] ?? 0;
  
  // Calculate level modifier
  const levelDiff = target.level - caster.level;
  const levelMod = levelDiffMod(levelDiff);
  
  // Calculate chance using centralized function
  const minChance = action.resist.minChance ?? RESIST_MIN_CHANCE;
  const maxChance = action.resist.maxChance ?? RESIST_MAX_CHANCE;
  
  let chance = calculateResistChance(targetResist, casterPen, difficulty, levelMod);
  chance = clamp(chance, minChance, maxChance);
  
  // Roll for resist
  const roll = rng();
  const isResisted = roll < chance;
  
  if (!isPartial) {
    // Binary: either resisted or not
    return {
      type: resistType,
      chance,
      resisted: isResisted,
      mult: isResisted ? 0 : 1,
      partialPct: isResisted ? 0 : 100
    };
  } else {
    // Partial: reduce effectiveness if resisted
    if (isResisted) {
      const mult = clamp(1 - RESIST_PARTIAL_STRENGTH * chance, RESIST_PARTIAL_FLOOR, 1);
      const partialPct = Math.round(mult * 100);
      return {
        type: resistType,
        chance,
        resisted: false,  // partial actions don't "resisted" as binary
        mult,
        partialPct
      };
    } else {
      return {
        type: resistType,
        chance,
        resisted: false,
        mult: 1,
        partialPct: 100
      };
    }
  }
}

/**
 * Generate resist log message
 */
export function getResistLogMessage(actionName, resistType, isPartial, partialPct) {
  if (isPartial && partialPct < 100) {
    return `${actionName} partially resisted (${resistType}) — ${partialPct}% effect.`;
  } else if (!isPartial || partialPct === 0) {
    return `${actionName} was RESISTED (${resistType})!`;
  }
  return null;
}

/**
 * Initialize actor resists and spell pen (for heroes and mobs)
 * Ensures all buckets exist and are finite numbers (not NaN or Infinity)
 * Preserves existing finite values; resets non-finite values to 0
 */
export function ensureActorResists(actor) {
  const BUCKETS = ["magic", "elemental", "contagion", "physical"];
  
  // Ensure resists object exists
  if (!actor.resists || typeof actor.resists !== "object") {
    actor.resists = {};
  }
  
  // Fill/sanitize each bucket: 0 if missing, non-finite, or uninitialized
  for (const bucket of BUCKETS) {
    const val = actor.resists[bucket];
    if (val === undefined || val === null || !Number.isFinite(val)) {
      actor.resists[bucket] = 0;
    }
  }
  
  // Ensure spellPen object exists (for heroes casting against targets)
  if (!actor.spellPen || typeof actor.spellPen !== "object") {
    actor.spellPen = {};
  }
  
  // Fill/sanitize each spellPen bucket
  for (const bucket of BUCKETS) {
    const val = actor.spellPen[bucket];
    if (val === undefined || val === null || !Number.isFinite(val)) {
      actor.spellPen[bucket] = 0;
    }
  }
}

/**
 * Apply racial resist bonuses to an actor
 * Idempotent - will only apply once per actor
 * 
 * @param {Object} actor - Actor to apply racial bonuses to
 */
export function applyRacialResists(actor, { force = false } = {}) {
  ensureActorResists(actor);

  // If already applied and not forcing, exit
  if (actor._racialResistsApplied && !force) {
    return;
  }

  // Remove previously applied racial bonuses if present to avoid stacking
  const prior = actor._racialResistsValues || { magic: 0, elemental: 0, contagion: 0, physical: 0 };
  for (const resistType of ["magic", "elemental", "contagion", "physical"]) {
    const prev = prior[resistType] || 0;
    if (prev) {
      actor.resists[resistType] -= prev;
    }
  }

  // Apply current racial bonuses using normalized race key
  const rawRaceKey = actor.race || actor.raceKey || DEFAULT_RACE_KEY;
  const raceDef = getRaceDef(rawRaceKey);  // getRaceDef internally normalizes
  const racialBonuses = raceDef?.resistMods || {};

  const applied = { magic: 0, elemental: 0, contagion: 0, physical: 0 };
  for (const resistType of ["magic", "elemental", "contagion", "physical"]) {
    const bonus = racialBonuses[resistType] || 0;
    if (bonus) {
      actor.resists[resistType] += bonus;
      applied[resistType] = bonus;
    }
  }

  actor._racialResistsValues = applied;
  actor._racialResistsApplied = true;
}
