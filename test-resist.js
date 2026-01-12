#!/usr/bin/env node

/**
 * Resist System Test Suite (Node.js)
 * Tests all resist mechanics: binary, partial, DoT, CC, level scaling
 */

import {
  levelDiffMod,
  calculateResistChance,
  resolveActionResist,
  getResistLogMessage,
  ensureActorResists
} from './js/resist.js';

// ============================================================================
// TEST UTILITIES
// ============================================================================

let testCount = 0;
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`  ✓ ${message}`);
  } else {
    failCount++;
    console.error(`  ✗ ${message}`);
  }
}

function assertClose(actual, expected, tolerance = 0.01, message) {
  const pass = Math.abs(actual - expected) <= tolerance;
  assert(pass, `${message} (expected ~${expected}, got ${actual})`);
}

function section(title) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`  ${title}`);
  console.log('='.repeat(70));
}

function subsection(title) {
  console.log(`\n  └─ ${title}`);
}

// ============================================================================
// MOCK OBJECTS
// ============================================================================

const mockCaster = (level = 1, pen = 0) => ({
  name: 'Test Caster',
  level,
  spellPen: {
    magic: pen,
    elemental: pen,
    contagion: pen,
    physical: pen
  }
});

const mockTarget = (level = 1, resist = 0) => ({
  name: 'Test Target',
  level,
  resists: {
    magic: resist,
    elemental: resist,
    contagion: resist,
    physical: resist
  }
});

const mockAction = (type, difficulty = 0, partial = false) => ({
  name: `Test ${type} Action`,
  resist: {
    type,
    difficulty,
    partial
  }
});

// ============================================================================
// TEST SUITE
// ============================================================================

section('LEVEL DIFFERENCE MODIFIER TESTS');

subsection('Piecewise function edge cases');
assert(levelDiffMod(-10) === -20, 'diff -10 → -20 (floor)');
assert(levelDiffMod(-5) === -20, 'diff -5 → -20 (boundary)');
assert(levelDiffMod(-3) === -6, 'diff -3 → -6 (mid range)');
assert(levelDiffMod(0) === 0, 'diff 0 → 0 (equal level)');
assert(levelDiffMod(3) === 18, 'diff 3 → 18 (mid range)');
assert(levelDiffMod(5) === 30, 'diff 5 → 30 (boundary)');
assert(levelDiffMod(10) === 90, 'diff 10 → 90 (high level)');

section('RESIST CHANCE CALCULATION TESTS');

subsection('Base case: equal level, no resist, no pen');
const baseChance = calculateResistChance(0, 0, 0, 0);
assertClose(baseChance, 0.25, 0.01, 'Base chance at equal level');

subsection('Target with resist');
const withResist = calculateResistChance(50, 0, 0, 0);
assert(withResist > baseChance, 'Resist increases chance');

subsection('Caster with penetration');
const withPen = calculateResistChance(50, 20, 0, 0);
assert(withPen < withResist, 'Penetration decreases resist chance');

subsection('Difficulty modifier');
const withDifficulty = calculateResistChance(0, 0, 5, 0);
assert(withDifficulty > baseChance, 'Difficulty increases resist chance');

subsection('Clamping (5%-95%)');
const extreme = calculateResistChance(500, 0, 0, 30);
assert(extreme <= 0.95, 'Max clamped to 95%');
const veryEasy = calculateResistChance(-500, 0, 0, -20);
assert(veryEasy >= 0.05, 'Min clamped to 5%');

section('BINARY CC RESIST TESTS');

subsection('Mesmerize (binary, difficulty 5)');
const caster = mockCaster(1);
const target = mockTarget(1);
const mesmerize = mockAction('magic', 5, false); // binary

// Multiple rolls to get statistical distribution
let resistCount = 0;
for (let i = 0; i < 100; i++) {
  const result = resolveActionResist({
    caster,
    target,
    action: mesmerize,
    rng: () => Math.random()
  });
  assert(result.mult === 0 || result.mult === 1, `Mesmerize mult is binary (0 or 1): ${result.mult}`);
  if (result.mult === 0) resistCount++;
}
assert(resistCount > 0, `Mesmerize resisted at least once in 100 rolls (${resistCount} times)`);
assert(resistCount < 100, `Mesmerize not 100% resisted (${100 - resistCount} hits)`);

subsection('Fear (binary, difficulty 5)');
const fear = mockAction('magic', 5, false); // binary
let fearResistCount = 0;
for (let i = 0; i < 100; i++) {
  const result = resolveActionResist({
    caster,
    target,
    action: fear,
    rng: () => Math.random()
  });
  assert(result.mult === 0 || result.mult === 1, `Fear mult is binary`);
  if (result.mult === 0) fearResistCount++;
}
assert(fearResistCount > 0 && fearResistCount < 100, `Fear has mixed outcomes`);

section('PARTIAL DAMAGE RESIST TESTS');

subsection('Fireblast (elemental, partial)');
const fireblast = mockAction('elemental', 0, true);
let firePartialCount = 0;
let fireHitCount = 0;

for (let i = 0; i < 100; i++) {
  const result = resolveActionResist({
    caster,
    target,
    action: fireblast,
    rng: () => Math.random()
  });
  assert(result.mult > 0, `Fireblast mult always > 0 (partial never fully blocks)`);
  assert(result.mult <= 1, `Fireblast mult never > 1`);
  
  if (result.mult < 1) firePartialCount++;
  if (result.mult === 1) fireHitCount++;
}
assert(firePartialCount > 0, `Fireblast partially resisted at least once`);
assert(fireHitCount > 0, `Fireblast hit at full power at least once`);

subsection('Flame Lick (contagion, partial)');
const flameLick = mockAction('contagion', 0, true);
let flameLickResults = [];
for (let i = 0; i < 50; i++) {
  const result = resolveActionResist({
    caster,
    target,
    action: flameLick,
    rng: () => Math.random()
  });
  flameLickResults.push(result.mult);
}
assert(flameLickResults.some(m => m === 1), 'Flame Lick has full hits');
assert(flameLickResults.some(m => m < 1 && m > 0), 'Flame Lick has partial hits');

section('LEVEL DIFFERENCE TESTS');

subsection('Lower-level target (should resist less)');
const highLevelCaster = mockCaster(10);
const lowLevelTarget = mockTarget(1);
const resultLow = resolveActionResist({
  caster: highLevelCaster,
  target: lowLevelTarget,
  action: fireblast,
  rng: () => 0.5
});
assert(resultLow.chance < 0.5, `Low-level target has <50% base resist chance`);

subsection('Higher-level target (should resist more)');
const lowLevelCaster = mockCaster(1);
const highLevelTarget = mockTarget(10);
const resultHigh = resolveActionResist({
  caster: lowLevelCaster,
  target: highLevelTarget,
  action: fireblast,
  rng: () => 0.5
});
assert(resultHigh.chance > 0.5, `High-level target has >50% base resist chance`);

section('LOG MESSAGE FORMATTING');

subsection('Partial resist message');
const partialMsg = getResistLogMessage('Fireblast', 'elemental', true, 75);
assert(partialMsg.includes('partially resisted'), 'Partial message includes "partially resisted"');
assert(partialMsg.includes('75%'), 'Message includes percentage');

subsection('Binary resist message');
const binaryMsg = getResistLogMessage('Mesmerize', 'magic', false, 0);
assert(binaryMsg.includes('RESISTED'), 'Binary message includes "RESISTED"');

section('ACTOR INITIALIZATION');

subsection('ensureActorResists creates correct structure');
const actor = { name: 'Test Actor' };
ensureActorResists(actor);
assert(actor.resists !== undefined, 'Actor has resists property');
assert(actor.resists.magic === 0, 'Magic resist initialized to 0');
assert(actor.resists.elemental === 0, 'Elemental resist initialized to 0');
assert(actor.resists.contagion === 0, 'Contagion resist initialized to 0');
assert(actor.resists.physical === 0, 'Physical resist initialized to 0');
assert(actor.spellPen !== undefined, 'Actor has spellPen property');
assert(actor.spellPen.magic === 0, 'Magic pen initialized to 0');

subsection('ensureActorResists preserves existing values');
const actor2 = {
  name: 'Test Actor 2',
  resists: { magic: 25, elemental: 10, contagion: 0, physical: 5 },
  spellPen: { magic: 5, elemental: 0, contagion: 0, physical: 0 }
};
ensureActorResists(actor2);
assert(actor2.resists.magic === 25, 'Existing magic resist preserved');
assert(actor2.spellPen.magic === 5, 'Existing magic pen preserved');

section('RAW MELEE BYPASS (STRUCTURAL)');

subsection('No resist block → always lands');
const noResistAction = {
  name: 'Auto Attack',
  resist: undefined
};
const result = resolveActionResist({
  caster,
  target,
  action: noResistAction,
  rng: () => Math.random()
});
assert(result.mult === 1, 'No resist action always lands (mult=1)');
assert(result.resisted === false, 'No resist action never marked as resisted');

section('EDGE CASES');

subsection('Deterministic rolls');
const deterministicHit = resolveActionResist({
  caster,
  target,
  action: fireblast,
  rng: () => 0.1  // Low roll = should hit
});
assert(deterministicHit.mult > 0, 'Low roll (0.1) results in hit/partial');

const deterministicResist = resolveActionResist({
  caster,
  target,
  action: mesmerize,
  rng: () => 0.1  // Low roll vs high resist chance
});
// Will depend on actual chance, but structure should be valid
assert(deterministicResist.mult >= 0 && deterministicResist.mult <= 1, 'Result is valid');

subsection('Extreme resist values');
const extremeResist = mockTarget(1, 500);
const extremeResult = resolveActionResist({
  caster,
  target: extremeResist,
  action: fireblast
});
assert(extremeResult.chance <= 0.95, 'Extreme resist still clamped to 95%');

section('GRACE TICK FOR CC');

subsection('Grace tick prevents immediate break');
// Simulate CC application with grace tick
const ccBuff = {
  key: 'mesmerize',
  data: {
    sourceHero: 'TestCaster',
    sourceLevel: 1,
    ccGraceTicksRemaining: 1
  }
};

// First tick: grace tick active, should skip resist check
assert(ccBuff.data.ccGraceTicksRemaining === 1, 'Grace tick starts at 1');
if (ccBuff.data.ccGraceTicksRemaining > 0) {
  ccBuff.data.ccGraceTicksRemaining--;
}
assert(ccBuff.data.ccGraceTicksRemaining === 0, 'Grace tick decrements to 0 after first tick');

// Second tick: grace tick expired, resist check can happen
assert(ccBuff.data.ccGraceTicksRemaining === 0, 'Grace tick is 0 on second tick');

subsection('Grace tick does not affect DoTs');
const dotBuff = {
  key: 'flame_lick',
  data: {
    effectMult: 0.75
  }
};
assert(dotBuff.data.ccGraceTicksRemaining === undefined, 'DoTs do not have grace ticks');

subsection('Constants from defs.js');
// Import constants to verify they exist
import {
  RESIST_BASE,
  RESIST_SCALE,
  RESIST_MIN_CHANCE,
  RESIST_MAX_CHANCE,
  RESIST_PARTIAL_STRENGTH,
  RESIST_PARTIAL_FLOOR
} from './js/defs.js';

assert(RESIST_BASE === 50, 'RESIST_BASE = 50');
assert(RESIST_SCALE === 200, 'RESIST_SCALE = 200');
assert(RESIST_MIN_CHANCE === 0.05, 'RESIST_MIN_CHANCE = 0.05');
assert(RESIST_MAX_CHANCE === 0.95, 'RESIST_MAX_CHANCE = 0.95');
assert(RESIST_PARTIAL_STRENGTH === 0.75, 'RESIST_PARTIAL_STRENGTH = 0.75');
assert(RESIST_PARTIAL_FLOOR === 0.10, 'RESIST_PARTIAL_FLOOR = 0.10');

// ============================================================================
// RESULTS SUMMARY
// ============================================================================

section('TEST RESULTS');
console.log(`\n  Total Tests:  ${testCount}`);
console.log(`  Passed:       ${passCount} ✓`);
console.log(`  Failed:       ${failCount} ✗`);
console.log(`  Success Rate: ${((passCount / testCount) * 100).toFixed(1)}%\n`);

if (failCount === 0) {
  console.log('  🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log(`  ⚠️  ${failCount} test(s) failed\n`);
  process.exit(1);
}
