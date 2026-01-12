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
  
  // Calculate chance (constants from defs.js)
  const minChance = action.resist.minChance ?? RESIST_MIN_CHANCE;
  const maxChance = action.resist.maxChance ?? RESIST_MAX_CHANCE;
  
  const resistScore = (targetResist - casterPen) + difficulty + levelMod;
  const rawChance = (resistScore + RESIST_BASE) / RESIST_SCALE;
  const chance = clamp(rawChance, minChance, maxChance);
  
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
 */
export function ensureActorResists(actor) {
  if (!actor.resists) {
    actor.resists = {
      magic: 0,
      elemental: 0,
      contagion: 0,
      physical: 0
    };
  }
  if (!actor.spellPen) {
    actor.spellPen = {
      magic: 0,
      elemental: 0,
      contagion: 0,
      physical: 0
    };
  }
}

/**
 * Apply racial resist bonuses to an actor
 * Idempotent - will only apply once per actor
 * 
 * @param {Object} actor - Actor to apply racial bonuses to
 */
export function applyRacialResists(actor) {
  // Guard: only apply once
  if (actor._racialResistsApplied) {
    return;
  }
  
  // Ensure resists exist first
  ensureActorResists(actor);
  
  // Get race definition (support both actor.race and actor.raceKey)
  const raceKey = (actor.race || actor.raceKey || DEFAULT_RACE_KEY).toLowerCase();
  const raceDef = getRaceDef(raceKey);
  const racialBonuses = raceDef?.resistMods || {};
  
  // Apply additive bonuses
  for (const resistType of ["magic", "elemental", "contagion", "physical"]) {
    const bonus = racialBonuses[resistType] || 0;
    if (bonus) {
      actor.resists[resistType] += bonus;
    }
  }
  
  // Mark as applied
  actor._racialResistsApplied = true;
}
