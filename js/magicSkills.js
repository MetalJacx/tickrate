/**
 * ============================================================
 * magicSkills.js — EQ-style magic skills for an idle game (1t=3s)
 * Model B Specializations (functional, readable):
 *   - destruction, restoration, control, enhancement, summoning, utility
 *
 * Goals:
 * - Add cast time + interrupts (channeling) without needing movement
 * - Add specialization as mana efficiency (easy to understand)
 * - Add "school mastery" (spell reliability / resist) optionally; keep simple
 * - Use monotonic gameplay clock: state.nowMs
 *
 * Integration points (expected):
 * - spells.js (or action defs) add: castTimeTicks, specialization (Model B), optional school
 * - combat.js / actions.js call: startCast(), tickCasting(), onHeroDamaged()
 * - state load: ensureMagicSkills(hero) + applyMagicUnlocks(hero)
 * - UI: show specialization + channeling + (optional) school skill progress
 *
 * NOTE: This file is gameplay-rule only. Do NOT use Date.now().
 * ============================================================
 */

// FIX 15: Import skill-up rate multiplier for tickrate normalization
import { SKILL_UP_RATE_MULT } from "./defs.js";

// ---------------------------
// Constants / Enums
// ---------------------------

export const MAGIC_SCHOOLS = [
  // Optional: keep if you want "school mastery" similar to EQ
  "destruction",   // (can serve as school if you skip classic abj/alt/etc)
  "restoration",
  "control",
  "enhancement",
  "summoning",
  "utility"
];

// Model B specializations (use these exact keys in spell defs)
export const SPECIALIZATIONS = [
  "destruction",
  "restoration",
  "control",
  "enhancement",
  "summoning",
  "utility"
];

export const MAGIC_SKILLS = {
  // School mastery: used for reliability/resist/partial (optional but recommended)
  // You can treat these as "school skills" and keep them identical to specialization keys
  // for simplicity & readability.
  school: {
    destruction: "school_destruction",
    restoration: "school_restoration",
    control: "school_control",
    enhancement: "school_enhancement",
    summoning: "school_summoning",
    utility: "school_utility"
  },

  // Specialization: used for mana reduction only (initially)
  spec: {
    destruction: "spec_destruction",
    restoration: "spec_restoration",
    control: "spec_control",
    enhancement: "spec_enhancement",
    summoning: "spec_summoning",
    utility: "spec_utility"
  },

  // Channeling: used to resist interruption while casting under damage
  channeling: "channeling"
};

const MAGIC_SKILL_DISPLAY_NAMES = {
  [MAGIC_SKILLS.channeling]: "Channeling"
};

function toTitleCase(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

for (const key of SPECIALIZATIONS) {
  const label = toTitleCase(key);
  MAGIC_SKILL_DISPLAY_NAMES[MAGIC_SKILLS.school[key]] = `${label} Mastery`;
  MAGIC_SKILL_DISPLAY_NAMES[MAGIC_SKILLS.spec[key]] = `${label} Specialization`;
}

export function getMagicSkillDisplayName(skillId) {
  return MAGIC_SKILL_DISPLAY_NAMES[skillId] || skillId || "Magic Skill";
}

// Hard caps so values don't explode
const HARD_SKILL_CAP = 300;

// Cast rules defaults (tune freely)
const INTERRUPT_MIN = 0.03;
const INTERRUPT_MAX = 0.60;

// Mana handling on interrupt (idle-friendly)
const INTERRUPT_MANA_FRACTION = 0.50; // spend 50% mana on interrupt

// Specialization efficiency (keep small at first)
const SPEC_MANA_REDUCTION_AT_CAP = 0.10; // 10% at cap

// School mastery reliability (idle equivalent of fizzle/resist)
// Base "partial/resist" chance without mastery (tune per spell later if desired)
const BASE_PARTIAL_CHANCE = 0.12; // 12% glancing/partial
const BASE_RESIST_CHANCE = 0.04;  // 4% fully resisted
const MASTERY_REDUCTION_AT_CAP = 0.10; // reduces partial+resist total by up to 10% at cap

// ---------------------------
// Class multipliers (caps)
// ---------------------------

const CLASS_MAGIC_MULTIPLIER = {
  // Hybrids / priests slightly better than pure melee for magic mastery
  warrior: 0.70,
  rogue: 0.70,
  monk: 0.70,
  ranger: 0.80,
  paladin: 0.90,
  shadowknight: 0.90,

  cleric: 1.05,
  druid: 1.05,
  shaman: 1.05,

  enchanter: 1.10,
  wizard: 1.10,
  magician: 1.10,
  necromancer: 1.10
};

// Channeling tends to matter for casters; keep it slightly better for caster classes
const CLASS_CHANNELING_MULTIPLIER = {
  warrior: 0.80,
  rogue: 0.80,
  monk: 0.80,
  ranger: 0.85,
  paladin: 0.90,
  shadowknight: 0.90,

  cleric: 1.05,
  druid: 1.05,
  shaman: 1.05,

  enchanter: 1.10,
  wizard: 1.10,
  magician: 1.10,
  necromancer: 1.10
};

// ---------------------------
// Unlock progression
// ---------------------------
//
// You can keep this simple: all casters start with all 6 categories at level 1,
// or gate a few to reduce early UI clutter. This table gates only specialization
// usage (skills still exist, but "training" can be restricted if you want).
//
// Recommended: unlock everything at 1 for caster classes.
// For melee classes, only unlock a couple (utility/enhancement) if they even cast.
//
// This table controls which specialization buckets can be *trained/used*.
// Spells can still be cast; if the specialization is locked, treat spec ratio as 0.
// (Keeps gameplay simple.)
//
const MAGIC_UNLOCKS = {
  warrior: { 1: ["enhancement", "utility"] },
  rogue: { 1: ["utility"] },
  monk: { 1: ["utility"] },
  ranger: { 1: ["enhancement", "utility"], 8: ["control"] },
  paladin: { 1: ["enhancement", "restoration"], 10: ["control"] },
  shadowknight: { 1: ["destruction", "enhancement"], 10: ["control"] },

  cleric: { 1: ["restoration", "enhancement", "utility"], 6: ["control"] },
  druid: { 1: ["restoration", "enhancement", "utility"], 6: ["control"], 10: ["destruction"] },
  shaman: { 1: ["restoration", "enhancement", "utility"], 6: ["control"], 10: ["destruction"] },

  enchanter: { 1: ["control", "enhancement", "utility"], 6: ["restoration"], 10: ["destruction"], 12: ["summoning"] },
  wizard: { 1: ["destruction", "utility"], 6: ["enhancement"], 10: ["control"], 12: ["summoning"] },
  magician: { 1: ["summoning", "destruction", "utility"], 6: ["enhancement"], 10: ["control"], 12: ["restoration"] },
  necromancer: { 1: ["destruction", "summoning", "utility"], 6: ["control"], 10: ["enhancement"], 12: ["restoration"] }
};

export function isMagicCategoryUnlocked(hero, categoryKey) {
  const unlocks = MAGIC_UNLOCKS[hero.classKey];
  if (!unlocks) return true; // default: unlocked
  for (const levelReq of Object.keys(unlocks)) {
    if (hero.level >= Number(levelReq) && unlocks[levelReq].includes(categoryKey)) return true;
  }
  return false;
}

export function applyMagicUnlocks(hero) {
  // If you later want to store unlocked categories, do it here.
  // For now, unlocks are computed from table, so no state mutation required.
  // This exists for parity with weaponSkills.js and future expansion.
}

// ---------------------------
// Skill state initialization
// ---------------------------

// FIX 20: Sanitize magic skill values during load/migration
// Purpose: Handle saves with corrupted/old data (NaN, undefined, negative, above-cap values)
// - If value is not finite (NaN, Infinity) => reset to 1
// - If value is negative => reset to 1
// - If value exceeds cap => clamp to cap
// This ensures skills remain valid after formula/gating changes
export function sanitizeMagicSkillValue(value, cap) {
  // Not finite (NaN, Infinity) => invalid
  if (!Number.isFinite(value)) return 1;
  // Negative values are invalid
  if (value < 0) return 1;
  // Clamp to valid range [1, cap]
  return Math.max(1, Math.min(value, cap));
}

// Helper: Calculate magic skill cap without calling ensure (prevents infinite recursion during load)
function calculateMagicSkillCap(hero, skillId) {
  // Baseline: 5 per level, multiplied by class
  const baseCap = 5 * hero.level;

  if (skillId === MAGIC_SKILLS.channeling) {
    const mult = CLASS_CHANNELING_MULTIPLIER[hero.classKey] ?? 1.0;
    return Math.min(Math.floor(baseCap * mult), HARD_SKILL_CAP);
  }

  // school_*/spec_* use magic multiplier
  const mult = CLASS_MAGIC_MULTIPLIER[hero.classKey] ?? 1.0;
  return Math.min(Math.floor(baseCap * mult), HARD_SKILL_CAP);
}

export function ensureMagicSkills(hero) {
  hero.magicSkills ??= {};

  // School mastery skills
  for (const key of SPECIALIZATIONS) {
    const schoolSkillId = MAGIC_SKILLS.school[key];
    if (!hero.magicSkills[schoolSkillId]) {
      hero.magicSkills[schoolSkillId] = { value: 1 };
    } else {
      // FIX 20: Sanitize skill values during load
      const cap = calculateMagicSkillCap(hero, schoolSkillId);
      hero.magicSkills[schoolSkillId].value = sanitizeMagicSkillValue(hero.magicSkills[schoolSkillId].value, cap);
    }

    const specSkillId = MAGIC_SKILLS.spec[key];
    if (!hero.magicSkills[specSkillId]) {
      hero.magicSkills[specSkillId] = { value: 1 };
    } else {
      // FIX 20: Sanitize skill values during load
      const cap = calculateMagicSkillCap(hero, specSkillId);
      hero.magicSkills[specSkillId].value = sanitizeMagicSkillValue(hero.magicSkills[specSkillId].value, cap);
    }
  }

  // Channeling
  if (!hero.magicSkills[MAGIC_SKILLS.channeling]) {
    hero.magicSkills[MAGIC_SKILLS.channeling] = { value: 1 };
  } else {
    // FIX 20: Sanitize skill values during load
    const cap = calculateMagicSkillCap(hero, MAGIC_SKILLS.channeling);
    hero.magicSkills[MAGIC_SKILLS.channeling].value = sanitizeMagicSkillValue(hero.magicSkills[MAGIC_SKILLS.channeling].value, cap);
  }

  // SANITY CHECK 23: Initialize fractional mana bank for each specialization
  // This accumulates fractional mana savings to prevent low-cost spells from losing effectiveness
  if (!hero.specManaBank) {
    hero.specManaBank = {};
  }
  // Ensure each specialization has a bank entry; sanitize old saves
  for (const specKey of SPECIALIZATIONS) {
    if (hero.specManaBank[specKey] === undefined) {
      hero.specManaBank[specKey] = 0;
    } else if (!Number.isFinite(hero.specManaBank[specKey]) || hero.specManaBank[specKey] < 0) {
      // Sanitize corrupted bank values
      hero.specManaBank[specKey] = 0;
    }
  }
}

// ---------------------------
// Caps / ratios
// ---------------------------

export function getMagicSkillCap(hero, skillId) {
  ensureMagicSkills(hero);
  // Baseline: 5 per level, multiplied by class
  const baseCap = 5 * hero.level;

  if (skillId === MAGIC_SKILLS.channeling) {
    const mult = CLASS_CHANNELING_MULTIPLIER[hero.classKey] ?? 1.0;
    return Math.min(Math.floor(baseCap * mult), HARD_SKILL_CAP);
  }

  // school_*/spec_* use magic multiplier
  const mult = CLASS_MAGIC_MULTIPLIER[hero.classKey] ?? 1.0;
  return Math.min(Math.floor(baseCap * mult), HARD_SKILL_CAP);
}

export function getMagicSkillValue(hero, skillId) {
  ensureMagicSkills(hero);
  return hero.magicSkills?.[skillId]?.value ?? 1;
}

export function getMagicSkillRatio(hero, skillId) {
  const v = getMagicSkillValue(hero, skillId);
  const cap = getMagicSkillCap(hero, skillId);
  return Math.max(0, Math.min(1, v / Math.max(1, cap)));
}

// Convenience: specialization ratio for a category
export function getSpecRatio(hero, specializationKey) {
  // If category locked, treat as 0 so mana reduction doesn't apply
  if (!isMagicCategoryUnlocked(hero, specializationKey)) return 0;
  const skillId = MAGIC_SKILLS.spec[specializationKey];
  return getMagicSkillRatio(hero, skillId);
}

// Convenience: school mastery ratio for a category
export function getSchoolRatio(hero, categoryKey) {
  const skillId = MAGIC_SKILLS.school[categoryKey];
  return getMagicSkillRatio(hero, skillId);
}

// ---------------------------
// Mana cost with specialization
// ---------------------------
// SANITY CHECK 23: Helper to extract stable specialization key from spell definition
// Returns the specialization key if valid; undefined if spell has no specialization
function getSpecKeyForSpell(spellDef) {
  const specKey = spellDef.specialization;
  // Validate: key must be in SPECIALIZATIONS list
  if (specKey && SPECIALIZATIONS.includes(specKey)) {
    return specKey;
  }
  return undefined;
}

export function getFinalManaCost(hero, spellDef) {
  // SANITY CHECK 23: Fractional mana bank implementation
  // Accumulate fractional mana savings per specialization to prevent low-cost spells
  // from losing savings due to rounding (e.g., 5 mana spell × 10% = 0.5, which rounds to 0).
  //
  // Instead: accumulate 0.5 in the bank, and when bank ≥ 1, convert to whole mana savings.
  // This ensures long-run average mana reduction matches SPEC_MANA_REDUCTION_AT_CAP * ratio.

  const specKey = getSpecKeyForSpell(spellDef);
  const base = (spellDef.manaCost ?? spellDef.cost?.mana ?? 0);
  if (!specKey) return base;

  ensureMagicSkills(hero); // Ensure bank exists

  const ratio = getSpecRatio(hero, specKey);
  const reduction = SPEC_MANA_REDUCTION_AT_CAP * ratio; // up to 10%
  const fractionalSaving = base * reduction;

  // Accumulate fractional savings into bank
  hero.specManaBank[specKey] += fractionalSaving;

  // Extract whole mana units from bank
  const wholeSaved = Math.floor(hero.specManaBank[specKey]);
  hero.specManaBank[specKey] -= wholeSaved;

  // Final cost = base - whole units saved, clamped to [0, base]
  const finalCost = Math.max(0, base - wholeSaved);

  // Optional debug logging (disabled by default)
  const DEBUG_MANA = false;
  if (DEBUG_MANA && wholeSaved > 0) {
    console.log(
      `[Mana] ${spellDef.name} (${specKey}): ` +
      `base=${base} → saving=${fractionalSaving.toFixed(2)} (bank=${hero.specManaBank[specKey].toFixed(2)}) ` +
      `→ cost=${finalCost}`
    );
  }

  return finalCost;
}

// ---------------------------
// Reliability (idle equivalent of fizzle/resist)
// ---------------------------
//
// If you don't want resists yet, you can skip this entire section.
// This provides a clean hook: roll spell quality based on school mastery.
//

export function rollSpellQuality(hero, spellDef, target) {
  // Returns: { mult, outcome } where mult applies to spell magnitude
  // outcome: "full" | "partial" | "resisted"
  //
  // partial: apply 0.5x effect (or pick a different scalar)
  // resisted: apply 0x effect
  //
  // You can later incorporate target resists/level diffs here.

  const cat = spellDef.specialization; // reuse category for mastery
  if (!cat) return { mult: 1, outcome: "full" };

  const masteryRatio = getSchoolRatio(hero, cat);

  // Reduce combined partial+resist by mastery, capped
  const totalBadBase = BASE_PARTIAL_CHANCE + BASE_RESIST_CHANCE; // e.g. 16%
  const totalBadReduced = Math.max(0, totalBadBase - (MASTERY_REDUCTION_AT_CAP * masteryRatio));

  // Maintain proportions between partial and resist
  const partialWeight = BASE_PARTIAL_CHANCE / totalBadBase;
  const resistWeight = BASE_RESIST_CHANCE / totalBadBase;

  const partialChance = totalBadReduced * partialWeight;
  const resistChance = totalBadReduced * resistWeight;

  const r = Math.random();
  if (r < resistChance) return { mult: 0, outcome: "resisted" };
  if (r < resistChance + partialChance) return { mult: 0.5, outcome: "partial" };
  return { mult: 1, outcome: "full" };
}

// ---------------------------
// Casting state + cast-time engine
// ---------------------------
//
// You must store casting state on the hero.
// The engine below assumes you call tickCasting(hero, state.nowMs, ...)
// each game tick.
//

/**
 * Start casting a spell.
 * - Creates hero.casting state
 * - Consumes mana up-front (recommended) using getFinalManaCost()
 * - Sets cooldown immediately (recommended) via your action timer system
 *
 * Requirements:
 * - spellDef.castTimeTicks >= 1
 * - hero must not already be casting (unless you later allow queued casting)
 */
export function startCast(hero, spellDef, targetId, nowMs, gameTickMs, opts = {}) {
  // opts:
  // - reserveMana: if true, don't spend mana now; spend on completion
  // - spendManaOnInterrupt: fraction (default INTERRUPT_MANA_FRACTION)
  // - setCooldownFn(hero, spellDef): caller injects to set cooldown
  // - hasManaFn(hero, cost): optional
  // - spendManaFn(hero, amount): optional

  const castTimeTicks = Math.max(1, spellDef.castTimeTicks ?? 1);
  const endsAtMs = nowMs + castTimeTicks * gameTickMs;

  const manaCost = getFinalManaCost(hero, spellDef);

  if (opts.hasManaFn && !opts.hasManaFn(hero, manaCost)) return { ok: false, reason: "not_enough_mana" };

  if (!opts.reserveMana) {
    if (opts.spendManaFn) opts.spendManaFn(hero, manaCost);
    else hero.mana = Math.max(0, (hero.mana ?? 0) - manaCost);
  }

  if (opts.setCooldownFn) opts.setCooldownFn(hero, spellDef);

  hero.casting = {
    spellId: spellDef.id,
    specialization: spellDef.specialization, // category key
    manaCost,
    targetId,
    startedAtMs: nowMs,
    endsAtMs,
    lastTickMs: nowMs,
    hitsTakenDuringCast: 0,
    interrupted: false,
    // FIX 18: Track if interrupted by damage (roll happens immediately per hit)
    wasInterruptedByDamage: false,
    // If you reserve mana, track it:
    reserveMana: !!opts.reserveMana
  };

  return { ok: true };
}

/**
 * Mark that the hero took damage. Call from your damage pipeline.
 * 
 * FIX 18: Interrupt roll happens immediately per hit (not per tick).
 * - Computes interrupt chance based on hits taken so far
 * - One roll per hit event
 * - If interrupted, clears casting immediately
 * - If survives, increments hitsSoFar counter for next interrupt
 */
export function onHeroDamaged(hero, damageAmount) {
  if (!hero?.casting) return;
  if (damageAmount <= 0) return;

  const c = hero.casting;
  
  // Track this hit for future calculations
  c.hitsTakenDuringCast += 1;
  const hitsSoFar = c.hitsTakenDuringCast;

  // FIX 18: Single interrupt roll per hit
  const interruptChance = getInterruptChance(hero, c, hitsSoFar);
  
  if (Math.random() < interruptChance) {
    // Interrupted immediately on this hit
    c.interrupted = true;
    
    // Mana handling: spend fraction of mana on interrupt
    const frac = INTERRUPT_MANA_FRACTION;
    if (c.reserveMana) {
      const spend = Math.round((c.manaCost ?? 0) * frac);
      hero.mana = Math.max(0, (hero.mana ?? 0) - spend);
    }
    // If not reserveMana, mana already spent at cast start
    
    // Mark casting as complete so tickCasting() will clean it up
    c.wasInterruptedByDamage = true;
  }
}

/**
 * Channeling: chance to avoid interruption when hit while casting.
 * 
 * FIX 18: One interrupt roll per hit event.
 * - Base: 15% base interrupt chance
 * - Per-hit penalty: 10% additional per hit taken during cast
 * - Channeling reduction: reduces final chance by up to 10% at cap
 * - Formula: finalChance = clamp(base + perHitPenalty*hitsSoFar - channelingReduction, min, max)
 * 
 * @param hero The casting hero
 * @param castingState The casting state object
 * @param hitsSoFar Number of hits taken during this cast (used to scale interrupt chance)
 * @returns The probability [0,1] that this hit will interrupt the cast
 */
export function getInterruptChance(hero, castingState, hitsSoFar = 1) {
  // Base interrupt grows with hits taken so far
  const BASE_INTERRUPT = 0.15;
  const PER_HIT_PENALTY = 0.10;
  
  let chance = BASE_INTERRUPT + PER_HIT_PENALTY * hitsSoFar;
  chance = Math.min(chance, INTERRUPT_MAX);

  const chanRatio = getMagicSkillRatio(hero, MAGIC_SKILLS.channeling);
  const reduction = 0.10 * chanRatio; // up to -10% at cap

  const finalChance = Math.max(INTERRUPT_MIN, Math.min(INTERRUPT_MAX, chance - reduction));
  return finalChance;
}

/**
 * Tick casting state.
 * Call once per game tick for each hero.
 *
 * Returns:
 * - { finished: true, cast: {spellId,...}, quality } on completion
 * - { interrupted: true, reason } on interruption
 * - { casting: true, remainingMs } while still casting
 */
export function tickCasting(hero, nowMs, gameTickMs, opts = {}) {
  // opts:
  // - onInterrupt(hero, castingState): optional callback (logging)
  // - onComplete(hero, castingState, quality): optional callback (apply spell)
  // - spendManaFn(hero, amount): optional
  // - setCooldownOnInterruptFn(hero, spellDef): optional (if you want different)
  // - getSpellDefById(spellId): required if using onComplete hooks for spellDef

  const c = hero.casting;
  if (!c) return { idle: true };

  // FIX 18: Check if already interrupted by a hit during this tick
  // (interrupt roll happens immediately in onHeroDamaged(), not here)
  if (c.wasInterruptedByDamage) {
    const interruptedState = hero.casting;
    hero.casting = null;

    if (opts.onInterrupt) opts.onInterrupt(hero, interruptedState);

    return { interrupted: true, reason: "channel_failed" };
  }

  // Completion check
  if (nowMs >= c.endsAtMs) {
    const finishedState = hero.casting;
    hero.casting = null;

    // If mana was reserved, spend full mana on completion
    if (finishedState.reserveMana) {
      const spend = finishedState.manaCost ?? 0;
      if (opts.spendManaFn) opts.spendManaFn(hero, spend);
      else hero.mana = Math.max(0, (hero.mana ?? 0) - spend);
    }

    // Roll quality based on mastery (optional)
    const spellDef = opts.getSpellDefById ? opts.getSpellDefById(finishedState.spellId) : null;
    const quality = spellDef ? rollSpellQuality(hero, spellDef, null) : { mult: 1, outcome: "full" };

    if (opts.onComplete) opts.onComplete(hero, finishedState, quality);

    return { finished: true, cast: finishedState, quality };
  }

  const remainingMs = Math.max(0, c.endsAtMs - nowMs);
  return { casting: true, remainingMs };
}

// ---------------------------
// Skill-ups
// ---------------------------
//
// Trigger skill-ups on *successful cast completion* (EQ-like).
// Channeling skill-up only if you were hit during the cast AND still completed.
//

function isTrivialTarget(heroLevel, targetLevel) {
  const hl = heroLevel || 1;
  const tl = targetLevel || 1;
  const gap = hl <= 10 ? 3 : 5;
  return tl <= hl - gap;
}

export function tryMagicSkillUp(hero, skillId, targetLevel) {
  ensureMagicSkills(hero);
  const entry = hero.magicSkills?.[skillId];
  if (!entry) return null;

  const skill = entry.value;
  const cap = getMagicSkillCap(hero, skillId);

  if (skill >= cap) return null;

  // Trivial target gating (optional): if you don't have "spell triviality", keep simple
  // For utility spells with no target, pass targetLevel = hero.level
  if (typeof targetLevel === "number" && isTrivialTarget(hero.level, targetLevel)) return null;

  // Diminishing chance: same curve as weapon skills
  const minChance = 0.5; // %
  const maxChance = 6.0; // %
  const chance = (maxChance - minChance) * Math.pow(0.99, skill) + minChance;

  // FIX 15: Apply skill-up rate multiplier to normalize for tickrate
  if (Math.random() * 100 < chance * SKILL_UP_RATE_MULT) {
    entry.value += 1;
    return { skillId, value: entry.value };
  }
  return null;
}

/**
 * Call on cast completion (not on start).
 * - Increases "school mastery" for the category
 * - Increases specialization skill for the category (slower)
 * - Increases channeling if you were hit during cast and still completed
 */
export function onSpellCastCompleteForSkills(hero, spellDef, castingState, targetLevel) {
  if (!spellDef?.specialization) return [];

  const cat = spellDef.specialization;
  const skillUps = [];

  // Always attempt school mastery skill-up
  const schoolUp = tryMagicSkillUp(hero, MAGIC_SKILLS.school[cat], targetLevel);
  if (schoolUp) skillUps.push(schoolUp);

  // Attempt specialization skill-up, but slower:
  // Easiest approach: just halve maxChance by temporarily lowering it (simple hack),
  // OR do a second roll with a smaller chance by calling tryMagicSkillUp twice conditionally.
  // Here: 50% gate before attempting spec skill-up.
  if (Math.random() < 0.5) {
    const specUp = tryMagicSkillUp(hero, MAGIC_SKILLS.spec[cat], targetLevel);
    if (specUp) skillUps.push(specUp);
  }

  // Channeling: only if you were hit during cast AND still completed
  if (castingState?.hitsTakenDuringCast > 0) {
    // Give a small "bonus" to improve feel: attempt twice if you took hits
    const u1 = tryMagicSkillUp(hero, MAGIC_SKILLS.channeling, targetLevel);
    if (u1) skillUps.push(u1);
    if (!u1 && Math.random() < 0.5) {
      const u2 = tryMagicSkillUp(hero, MAGIC_SKILLS.channeling, targetLevel);
      if (u2) skillUps.push(u2);
    }
  }

  return skillUps;
}

/**
 * ============================================================
 * SPELL DEF REQUIREMENTS (what to add to your spells/actions)
 * ============================================================
 *
 * Each castable spell must define:
 * - id: string
 * - manaCost: number
 * - cooldownTicks: number
 * - castTimeTicks: number (>=1)   // NEW
 * - specialization: one of SPECIALIZATIONS   // Model B
 *
 * Example:
 * {
 *   id: "fireblast",
 *   manaCost: 10,
 *   cooldownTicks: 6,
 *   castTimeTicks: 2,
 *   specialization: "destruction"
 * }
 *
 * ============================================================
 * INTEGRATION CHECKLIST (where to wire it)
 * ============================================================
 *
 * state.js (load/migrate):
 * - import { ensureMagicSkills, applyMagicUnlocks } from "./magicSkills.js"
 * - for each hero on load:
 *     ensureMagicSkills(hero);
 *     applyMagicUnlocks(hero);
 *
 * combat.js / action execution:
 * - when deciding to cast a spell:
 *     startCast(hero, spellDef, targetId, state.nowMs, GAME_TICK_MS, { setCooldownFn, hasManaFn, spendManaFn })
 *
 * - each tick:
 *     const res = tickCasting(hero, state.nowMs, GAME_TICK_MS, {
 *       getSpellDefById,
 *       onComplete: (hero, castState, quality) => {
 *         // apply spell effects using quality.mult
 *         // then:
 *         onSpellCastCompleteForSkills(hero, getSpellDefById(castState.spellId), castState, enemy.level);
 *       },
 *       onInterrupt: (hero, castState) => addLog(`${hero.name}'s cast was interrupted!`)
 *     });
 *
 * damage pipeline:
 * - whenever hero takes damage:
 *     onHeroDamaged(hero, damageAmount);
 *
 * UI:
 * - Character modal: show
 *   - Channeling: value/cap
 *   - Specializations: each spec value/cap and mana reduction %
 *   - (Optional) School mastery: value/cap
 *
 * ============================================================
 * DESIGN CONTRACT (DO NOT VIOLATE)
 * ============================================================
 *
 * - Specializations are functional categories (Model B), not abjuration/alteration.
 * - Specialization affects mana cost only (for now).
 * - Channeling governs interruption under damage during cast time.
 * - Skill-ups happen on successful cast completion (EQ-like).
 * - Uses state.nowMs monotonic game clock only.
 */
