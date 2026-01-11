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

  cleric: 1.00,
  druid: 1.00,
  shaman: 1.00,

  enchanter: 1.05,
  wizard: 1.05,
  magician: 1.05,
  necromancer: 1.05
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

export function ensureMagicSkills(hero) {
  hero.magicSkills ??= {};

  // School mastery skills
  for (const key of SPECIALIZATIONS) {
    const schoolSkillId = MAGIC_SKILLS.school[key];
    if (!hero.magicSkills[schoolSkillId]) hero.magicSkills[schoolSkillId] = { value: 1 };

    const specSkillId = MAGIC_SKILLS.spec[key];
    if (!hero.magicSkills[specSkillId]) hero.magicSkills[specSkillId] = { value: 1 };
  }

  // Channeling
  if (!hero.magicSkills[MAGIC_SKILLS.channeling]) {
    hero.magicSkills[MAGIC_SKILLS.channeling] = { value: 1 };
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

export function getFinalManaCost(hero, spellDef) {
  // spellDef.specialization must be one of SPECIALIZATIONS
  const specKey = spellDef.specialization;
  const base = (spellDef.manaCost ?? spellDef.cost?.mana ?? 0);
  if (!specKey) return base;

  const ratio = getSpecRatio(hero, specKey);
  const reduction = SPEC_MANA_REDUCTION_AT_CAP * ratio; // up to 10%
  const finalCost = base * (1 - reduction);

  // FIX 16: Guarantee at least 1 mana saved early-game when specialization is trained
  // Problem: rounding causes low-cost spells to lose savings (5 * 0.1 = 0.5 rounds to 0)
  // Solution: If reduction would save < 1 mana but spec is trained, force-save 1 mana
  const roundedCost = Math.round(finalCost);
  const manaSaved = base - roundedCost;
  
  if (ratio > 0 && manaSaved === 0 && base >= 2 && reduction > 0) {
    // Force at least 1 mana saved to make specialization feel effective early-game
    return Math.max(0, base - 1);
  }
  
  return Math.max(0, roundedCost);
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
    wasHitDuringCast: false,
    hitsTakenDuringCast: 0,
    interrupted: false,
    // If you reserve mana, track it:
    reserveMana: !!opts.reserveMana
  };

  return { ok: true };
}

/**
 * Mark that the hero took damage. Call from your damage pipeline.
 * This enables channeling checks during tickCasting().
 */
export function onHeroDamaged(hero, damageAmount) {
  if (!hero?.casting) return;
  if (damageAmount <= 0) return;

  hero.casting.wasHitDuringCast = true;
  hero.casting.hitsTakenDuringCast += 1;
}

/**
 * Channeling: chance to avoid interruption when hit while casting.
 * Idle-friendly model:
 * - More hits during cast => more interrupt pressure
 * - Channeling reduces interrupt chance by up to 10% at cap
 */
export function getInterruptChance(hero, castingState) {
  const hits = castingState.hitsTakenDuringCast ?? 0;

  // Base interrupt grows with hits; clamp to max
  let base = 0.15 + 0.10 * hits; // 15% + 10% per hit
  base = Math.min(base, INTERRUPT_MAX);

  const chanRatio = getMagicSkillRatio(hero, MAGIC_SKILLS.channeling);
  const reduction = 0.10 * chanRatio; // up to -10%

  const finalChance = Math.max(INTERRUPT_MIN, Math.min(INTERRUPT_MAX, base - reduction));
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

  // Each tick: if hero was hit during cast since last tick, do a channel check
  // We're using a simple "flag + count" model; if you need per-tick hit tracking,
  // reset wasHitDuringCast at end of tick.
  if (c.wasHitDuringCast) {
    const interruptChance = getInterruptChance(hero, c);

    if (Math.random() < interruptChance) {
      // Interrupted
      c.interrupted = true;

      // Mana handling: if reserveMana, spend fraction now; if already spent, optionally refund some
      const frac = opts.spendManaOnInterrupt ?? INTERRUPT_MANA_FRACTION;

      if (c.reserveMana) {
        const spend = Math.round((c.manaCost ?? 0) * frac);
        if (opts.spendManaFn) opts.spendManaFn(hero, spend);
        else hero.mana = Math.max(0, (hero.mana ?? 0) - spend);
      }
      // If not reserveMana, we already spent full mana; keep as-is for simplicity.

      const interruptedState = hero.casting;
      hero.casting = null;

      if (opts.onInterrupt) opts.onInterrupt(hero, interruptedState);

      return { interrupted: true, reason: "channel_failed" };
    }

    // Passed channel check; clear per-tick flag (keeps checks from repeating without new hits)
    c.wasHitDuringCast = false;
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
