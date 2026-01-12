#!/usr/bin/env node

/**
 * Racial Resist Test Suite (Node.js)
 * Tests racial resist application, idempotency, and safety
 */

import {
  ensureActorResists,
  applyRacialResists,
  RACE_RESISTS
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

function assertEqual(actual, expected, message) {
  const pass = actual === expected;
  assert(pass, `${message} (expected ${expected}, got ${actual})`);
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
// MOCK HELPERS
// ============================================================================

function createActor(race, initialResists = null) {
  const actor = {
    name: `Test ${race}`,
    race: race
  };
  
  if (initialResists) {
    actor.resists = { ...initialResists };
  }
  
  return actor;
}

// ============================================================================
// TEST SUITE
// ============================================================================

section('ENSURE ACTOR RESISTS (INITIALIZATION)');

subsection('Test 1: ensureActorResists initializes missing buckets');
const actor1 = { name: 'Test Actor' };
ensureActorResists(actor1);

assert(actor1.resists !== undefined, 'actor.resists exists');
assert(actor1.spellPen !== undefined, 'actor.spellPen exists');
assert(typeof actor1.resists.magic === 'number', 'resists.magic is a number');
assert(typeof actor1.resists.elemental === 'number', 'resists.elemental is a number');
assert(typeof actor1.resists.contagion === 'number', 'resists.contagion is a number');
assert(typeof actor1.resists.physical === 'number', 'resists.physical is a number');
assert(typeof actor1.spellPen.magic === 'number', 'spellPen.magic is a number');
assert(typeof actor1.spellPen.elemental === 'number', 'spellPen.elemental is a number');
assert(typeof actor1.spellPen.contagion === 'number', 'spellPen.contagion is a number');
assert(typeof actor1.spellPen.physical === 'number', 'spellPen.physical is a number');

subsection('ensureActorResists preserves existing values');
const actor2 = {
  name: 'Test Actor 2',
  resists: { magic: 10, elemental: 5, contagion: 3, physical: 7 },
  spellPen: { magic: 2, elemental: 1, contagion: 0, physical: 0 }
};
ensureActorResists(actor2);
assertEqual(actor2.resists.magic, 10, 'Existing resists.magic preserved');
assertEqual(actor2.resists.elemental, 5, 'Existing resists.elemental preserved');
assertEqual(actor2.spellPen.magic, 2, 'Existing spellPen.magic preserved');

section('RACIAL RESIST DATA VALIDATION');

subsection('RACE_RESISTS structure');
assert(typeof RACE_RESISTS === 'object', 'RACE_RESISTS is an object');
assert(RACE_RESISTS.human !== undefined, 'RACE_RESISTS.human exists');
assert(Object.keys(RACE_RESISTS.human).length === 0, 'human has no bonuses (baseline)');

subsection('Known races have valid bonuses');
const testRaces = ['dwarf', 'noetian', 'troll', 'high_elf'];
for (const race of testRaces) {
  assert(RACE_RESISTS[race] !== undefined, `RACE_RESISTS.${race} exists`);
  const bonuses = RACE_RESISTS[race];
  for (const key of Object.keys(bonuses)) {
    assert(['magic', 'elemental', 'contagion', 'physical'].includes(key), 
      `${race} bonus key "${key}" is valid resist type`);
    assert(typeof bonuses[key] === 'number', `${race}.${key} is a number`);
    assert(bonuses[key] >= 0, `${race}.${key} is non-negative`);
  }
}

section('RACIAL RESIST APPLICATION');

subsection('Test 2: Unknown race does nothing');
const actorUnknown = createActor('SomeNewRace');
ensureActorResists(actorUnknown);
const resistsBefore = { ...actorUnknown.resists };
applyRacialResists(actorUnknown);
assertEqual(actorUnknown.resists.magic, resistsBefore.magic, 'Unknown race: magic unchanged');
assertEqual(actorUnknown.resists.elemental, resistsBefore.elemental, 'Unknown race: elemental unchanged');
assertEqual(actorUnknown.resists.contagion, resistsBefore.contagion, 'Unknown race: contagion unchanged');
assertEqual(actorUnknown.resists.physical, resistsBefore.physical, 'Unknown race: physical unchanged');
assert(actorUnknown._racialResistsApplied === true, 'Unknown race marked as applied');

subsection('Test 3: Human baseline does nothing');
const actorHuman = createActor('human');
ensureActorResists(actorHuman);
applyRacialResists(actorHuman);
assertEqual(actorHuman.resists.magic, 0, 'Human: magic = 0');
assertEqual(actorHuman.resists.elemental, 0, 'Human: elemental = 0');
assertEqual(actorHuman.resists.contagion, 0, 'Human: contagion = 0');
assertEqual(actorHuman.resists.physical, 0, 'Human: physical = 0');
assert(actorHuman._racialResistsApplied === true, 'Human marked as applied');

subsection('Test 4: Additive application works (Dwarf)');
// Dwarf has: contagion: 5, magic: 5
const actorDwarf = createActor('dwarf', { magic: 1, elemental: 2, contagion: 3, physical: 4 });
ensureActorResists(actorDwarf);
applyRacialResists(actorDwarf);
assertEqual(actorDwarf.resists.magic, 1 + 5, 'Dwarf: magic = base(1) + racial(5)');
assertEqual(actorDwarf.resists.elemental, 2, 'Dwarf: elemental = base(2) + racial(0)');
assertEqual(actorDwarf.resists.contagion, 3 + 5, 'Dwarf: contagion = base(3) + racial(5)');
assertEqual(actorDwarf.resists.physical, 4, 'Dwarf: physical = base(4) + racial(0)');

subsection('Test 4b: Additive application works (Troll)');
// Troll has: contagion: 10
const actorTroll = createActor('troll', { magic: 0, elemental: 0, contagion: 0, physical: 0 });
ensureActorResists(actorTroll);
applyRacialResists(actorTroll);
assertEqual(actorTroll.resists.magic, 0, 'Troll: magic = 0');
assertEqual(actorTroll.resists.elemental, 0, 'Troll: elemental = 0');
assertEqual(actorTroll.resists.contagion, 10, 'Troll: contagion = base(0) + racial(10)');
assertEqual(actorTroll.resists.physical, 0, 'Troll: physical = 0');

subsection('Test 4c: Additive application works (Noetian)');
// Noetian has: magic: 5
const actorNoetian = createActor('noetian', { magic: 2, elemental: 1, contagion: 1, physical: 1 });
ensureActorResists(actorNoetian);
applyRacialResists(actorNoetian);
assertEqual(actorNoetian.resists.magic, 2 + 5, 'Noetian: magic = base(2) + racial(5)');
assertEqual(actorNoetian.resists.elemental, 1, 'Noetian: elemental = base(1) + racial(0)');
assertEqual(actorNoetian.resists.contagion, 1, 'Noetian: contagion = base(1) + racial(0)');
assertEqual(actorNoetian.resists.physical, 1, 'Noetian: physical = base(1) + racial(0)');

section('IDEMPOTENCY');

subsection('Test 5: No double application');
const actorIdempotent = createActor('dwarf', { magic: 0, elemental: 0, contagion: 0, physical: 0 });
ensureActorResists(actorIdempotent);
applyRacialResists(actorIdempotent);
const resistsAfterFirst = { ...actorIdempotent.resists };
applyRacialResists(actorIdempotent); // Second call
assertEqual(actorIdempotent.resists.magic, resistsAfterFirst.magic, 'Second apply: magic unchanged');
assertEqual(actorIdempotent.resists.elemental, resistsAfterFirst.elemental, 'Second apply: elemental unchanged');
assertEqual(actorIdempotent.resists.contagion, resistsAfterFirst.contagion, 'Second apply: contagion unchanged');
assertEqual(actorIdempotent.resists.physical, resistsAfterFirst.physical, 'Second apply: physical unchanged');
assert(actorIdempotent._racialResistsApplied === true, 'Guard flag still true');

subsection('Multiple calls with different actors');
const actor5a = createActor('troll', { magic: 0, elemental: 0, contagion: 0, physical: 0 });
const actor5b = createActor('troll', { magic: 0, elemental: 0, contagion: 0, physical: 0 });
ensureActorResists(actor5a);
ensureActorResists(actor5b);
applyRacialResists(actor5a);
applyRacialResists(actor5b);
applyRacialResists(actor5a); // Second call on actor5a
assertEqual(actor5a.resists.contagion, 10, 'Actor 5a: contagion = 10 (not 20)');
assertEqual(actor5b.resists.contagion, 10, 'Actor 5b: contagion = 10');

section('SPELL PENETRATION SAFETY');

subsection('Test 6: applyRacialResists does not alter spellPen');
const actor6 = createActor('dwarf');
ensureActorResists(actor6);
actor6.spellPen = { magic: 3, elemental: 2, contagion: 1, physical: 0 };
const spellPenBefore = { ...actor6.spellPen };
applyRacialResists(actor6);
assertEqual(actor6.spellPen.magic, spellPenBefore.magic, 'spellPen.magic unchanged');
assertEqual(actor6.spellPen.elemental, spellPenBefore.elemental, 'spellPen.elemental unchanged');
assertEqual(actor6.spellPen.contagion, spellPenBefore.contagion, 'spellPen.contagion unchanged');
assertEqual(actor6.spellPen.physical, spellPenBefore.physical, 'spellPen.physical unchanged');

section('CALL ORDER FROM MISSING STATE');

subsection('Test 7: ensureActorResists then applyRacialResists (Dwarf)');
const actor7 = { name: 'Fresh Dwarf', race: 'dwarf' }; // No resists/spellPen
ensureActorResists(actor7);
applyRacialResists(actor7);
assert(actor7.resists !== undefined, 'resists initialized');
assert(actor7.spellPen !== undefined, 'spellPen initialized');
assertEqual(actor7.resists.magic, 5, 'Dwarf racial magic bonus applied');
assertEqual(actor7.resists.contagion, 5, 'Dwarf racial contagion bonus applied');
assertEqual(actor7.resists.elemental, 0, 'Dwarf elemental = 0');
assertEqual(actor7.resists.physical, 0, 'Dwarf physical = 0');

subsection('Test 7b: applyRacialResists without prior ensureActorResists');
const actor7b = { name: 'Another Troll', race: 'troll' };
applyRacialResists(actor7b); // Should call ensureActorResists internally
assert(actor7b.resists !== undefined, 'resists auto-initialized');
assertEqual(actor7b.resists.contagion, 10, 'Troll racial contagion bonus applied');

section('CASE SENSITIVITY');

subsection('Race key case handling');
const actorUpperCase = createActor('DWARF', { magic: 0, elemental: 0, contagion: 0, physical: 0 });
ensureActorResists(actorUpperCase);
applyRacialResists(actorUpperCase);
assertEqual(actorUpperCase.resists.magic, 5, 'DWARF (uppercase) applies magic bonus');
assertEqual(actorUpperCase.resists.contagion, 5, 'DWARF (uppercase) applies contagion bonus');

const actorMixedCase = createActor('DaRk_ElF', { magic: 0, elemental: 0, contagion: 0, physical: 0 });
ensureActorResists(actorMixedCase);
applyRacialResists(actorMixedCase);
assertEqual(actorMixedCase.resists.magic, 5, 'DaRk_ElF (mixed case) applies magic bonus');

section('EDGE CASES');

subsection('Actor with undefined race');
const actorNoRace = { name: 'No Race Actor' };
ensureActorResists(actorNoRace);
applyRacialResists(actorNoRace); // Should default to human
assertEqual(actorNoRace.resists.magic, 0, 'Undefined race defaults to human baseline');
assert(actorNoRace._racialResistsApplied === true, 'Applied flag set');

subsection('Actor with null race');
const actorNullRace = { name: 'Null Race Actor', race: null };
ensureActorResists(actorNullRace);
applyRacialResists(actorNullRace);
assertEqual(actorNullRace.resists.magic, 0, 'Null race defaults to human baseline');

subsection('Actor with empty string race');
const actorEmptyRace = { name: 'Empty Race Actor', race: '' };
ensureActorResists(actorEmptyRace);
applyRacialResists(actorEmptyRace);
assertEqual(actorEmptyRace.resists.magic, 0, 'Empty race defaults to human baseline');

subsection('Negative initial resists (sanitization check)');
const actorNegative = createActor('dwarf', { magic: -5, elemental: 0, contagion: -3, physical: 0 });
ensureActorResists(actorNegative);
applyRacialResists(actorNegative);
assertEqual(actorNegative.resists.magic, -5 + 5, 'Dwarf: negative base + racial = 0');
assertEqual(actorNegative.resists.contagion, -3 + 5, 'Dwarf: negative contagion base + racial = 2');

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
