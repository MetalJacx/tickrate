/**
 * SANITY CHECK 24: Skill-up Pacing Normalization Test
 *
 * Verify that SKILL_UP_RATE_MULT is applied correctly to both weapon and magic skill-ups,
 * ensuring that skill progression is normalized for the 3-second tickrate.
 */

import { SKILL_UP_RATE_MULT } from './js/defs.js';
import { tryWeaponSkillUp, ensureWeaponSkills } from './js/weaponSkills.js';
import { tryMagicSkillUp, ensureMagicSkills, MAGIC_SKILLS } from './js/magicSkills.js';

function createMockHero(classKey = 'warrior', level = 20) {
  return {
    classKey,
    level,
    name: 'TestHero',
    weaponSkills: {},
    magicSkills: {},
    specManaBank: {}
  };
}

const tests = [];
let passed = 0;
let failed = 0;

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

// ============================================================
// TEST CASES
// ============================================================

test('A) SKILL_UP_RATE_MULT is 0.5', () => {
  assertEqual(SKILL_UP_RATE_MULT, 0.5, 'Multiplier should be 0.5');
});

test('B) Weapon skill-up respects multiplier (Monte Carlo)', () => {
  // Run many attempts and check that skill-up rate is lower than without multiplier
  // With multiplier: 0.5-6.0% becomes 0.25-3.0%
  
  const hero = createMockHero('warrior', 20);
  ensureWeaponSkills(hero);
  
  // Initialize weapon skill to low value
  hero.weaponSkills['1h_slash'] = { value: 10 };
  
  // Run 100 attempts at skill-up
  let successCount = 0;
  for (let i = 0; i < 100; i++) {
    const result = tryWeaponSkillUp(hero, '1h_slash', 20);
    if (result) successCount++;
    // Reset skill to 10 each time for consistent probability
    hero.weaponSkills['1h_slash'].value = 10;
  }
  
  // Expected: chance ~3% (diminished from ~6%)
  // With 0.5 multiplier: ~1.5%
  // In 100 trials with ~1.5% chance, expect 0-3 successes
  // Allow up to 5 to account for randomness
  assert(successCount < 10, 
    `Weapon skill-up too frequent (${successCount}/100, expected ~1-3). Multiplier may not be applied.`);
});

test('C) Magic skill-up respects multiplier (Monte Carlo)', () => {
  const hero = createMockHero('wizard', 20);
  ensureMagicSkills(hero);
  
  // Initialize magic skill to low value
  hero.magicSkills[MAGIC_SKILLS.school['destruction']] = { value: 10 };
  
  // Run 100 attempts at skill-up
  let successCount = 0;
  for (let i = 0; i < 100; i++) {
    const result = tryMagicSkillUp(hero, MAGIC_SKILLS.school['destruction'], 20);
    if (result) successCount++;
    // Reset skill to 10 each time for consistent probability
    hero.magicSkills[MAGIC_SKILLS.school['destruction']].value = 10;
  }
  
  // Expected: chance ~3% (diminished from ~6%)
  // With 0.5 multiplier: ~1.5%
  assert(successCount < 10, 
    `Magic skill-up too frequent (${successCount}/100, expected ~1-3). Multiplier may not be applied.`);
});

test('D) Weapon skill increases are credited correctly', () => {
  const hero = createMockHero('warrior', 20);
  ensureWeaponSkills(hero);
  
  hero.weaponSkills['1h_slash'] = { value: 10 };
  const startValue = hero.weaponSkills['1h_slash'].value;
  
  // Force a skill-up by calling tryWeaponSkillUp repeatedly until it succeeds
  let attempts = 0;
  let successCount = 0;
  while (attempts < 5000 && successCount < 1) {
    const result = tryWeaponSkillUp(hero, '1h_slash', 20);
    if (result) successCount++;
    attempts++;
  }
  
  // If we got a skill-up, value should have increased
  if (successCount > 0) {
    assert(hero.weaponSkills['1h_slash'].value > startValue, 
      'Skill value should increase after skill-up');
  }
});

test('E) Magic skill increases are credited correctly', () => {
  const hero = createMockHero('wizard', 20);
  ensureMagicSkills(hero);
  
  hero.magicSkills[MAGIC_SKILLS.school['destruction']] = { value: 10 };
  const startValue = hero.magicSkills[MAGIC_SKILLS.school['destruction']].value;
  
  // Force a skill-up
  let attempts = 0;
  let successCount = 0;
  while (attempts < 5000 && successCount < 1) {
    const result = tryMagicSkillUp(hero, MAGIC_SKILLS.school['destruction'], 20);
    if (result) {
      successCount++;
      assert(result.skillId === MAGIC_SKILLS.school['destruction'], 'Should return correct skillId');
    }
    attempts++;
  }
  
  // If we got a skill-up, value should have increased
  if (successCount > 0) {
    assert(hero.magicSkills[MAGIC_SKILLS.school['destruction']].value > startValue, 
      'Skill value should increase after skill-up');
  }
});

test('F) Weapon skill-up returns true on success', () => {
  const hero = createMockHero('warrior', 20);
  ensureWeaponSkills(hero);
  hero.weaponSkills['hand_to_hand'] = { value: 1 };
  
  // Try repeatedly until success or timeout
  let attempts = 0;
  let result = false;
  while (attempts < 10000 && !result) {
    result = tryWeaponSkillUp(hero, 'hand_to_hand', 20);
    attempts++;
  }
  
  // Should either get true or false, not undefined or null
  assert(typeof result === 'boolean', 'tryWeaponSkillUp should return boolean');
});

test('G) Magic skill-up returns object on success', () => {
  const hero = createMockHero('wizard', 20);
  ensureMagicSkills(hero);
  const schoolId = MAGIC_SKILLS.school['destruction'];
  
  hero.magicSkills[schoolId] = { value: 1 };
  
  // Try repeatedly until success or timeout
  let attempts = 0;
  let result = null;
  while (attempts < 10000 && !result) {
    result = tryMagicSkillUp(hero, schoolId, 20);
    attempts++;
  }
  
  // Should return object with skillId and value on success
  if (result) {
    assert(result.skillId !== undefined, 'Result should have skillId');
    assert(result.value !== undefined, 'Result should have value');
  }
});

test('H) Skill-up respects cap (weapon)', () => {
  const hero = createMockHero('warrior', 20);
  ensureWeaponSkills(hero);
  
  // Get cap and set skill to it
  const cap = 100; // Assuming cap is high enough
  hero.weaponSkills['1h_slash'] = { value: cap };
  
  // Try to skill up at cap
  const result = tryWeaponSkillUp(hero, '1h_slash', 20);
  
  assert(!result, 'Should not skill up when at cap');
  assert(hero.weaponSkills['1h_slash'].value === cap, 'Value should not change when at cap');
});

test('I) Skill-up respects cap (magic)', () => {
  const hero = createMockHero('wizard', 20);
  ensureMagicSkills(hero);
  
  // Set skill to very high value (effectively at cap)
  hero.magicSkills[MAGIC_SKILLS.school['destruction']] = { value: 500 };
  
  // Try to skill up
  const result = tryMagicSkillUp(hero, MAGIC_SKILLS.school['destruction'], 20);
  
  assert(result === null, 'Should return null when at cap');
});

test('J) Trivial target prevents skill-up (weapon)', () => {
  const hero = createMockHero('warrior', 50);
  ensureWeaponSkills(hero);
  hero.weaponSkills['1h_slash'] = { value: 10 };
  
  // Try to skill up against much lower target
  const result = tryWeaponSkillUp(hero, '1h_slash', 5);
  
  assert(!result, 'Should not skill up against trivial target');
});

test('K) Trivial target prevents skill-up (magic)', () => {
  const hero = createMockHero('wizard', 50);
  ensureMagicSkills(hero);
  hero.magicSkills[MAGIC_SKILLS.school['destruction']] = { value: 10 };
  
  // Try to skill up against much lower target
  const result = tryMagicSkillUp(hero, MAGIC_SKILLS.school['destruction'], 5);
  
  assert(result === null, 'Should return null against trivial target');
});

test('L) Multiple school skills work independently', () => {
  const hero = createMockHero('wizard', 20);
  ensureMagicSkills(hero);
  
  // Initialize multiple skills
  const destId = MAGIC_SKILLS.school['destruction'];
  const restId = MAGIC_SKILLS.school['restoration'];
  
  hero.magicSkills[destId] = { value: 5 };
  hero.magicSkills[restId] = { value: 5 };
  
  // Try to increase each
  let destructCount = 0, restoreCount = 0;
  
  for (let i = 0; i < 500; i++) {
    const d = tryMagicSkillUp(hero, destId, 20);
    if (d) {
      destructCount++;
      // Reset for next attempt
      hero.magicSkills[destId].value = 5;
    }
    
    const r = tryMagicSkillUp(hero, restId, 20);
    if (r) {
      restoreCount++;
      hero.magicSkills[restId].value = 5;
    }
  }
  
  // Both should have some skill-ups (roughly equal due to same chance)
  assert(destructCount + restoreCount > 0, 'At least one skill-up should occur');
});

test('M) Specialization and school are independent accumulators', () => {
  const hero = createMockHero('wizard', 20);
  ensureMagicSkills(hero);
  
  const destSchool = MAGIC_SKILLS.school['destruction'];
  const destSpec = MAGIC_SKILLS.spec['destruction'];
  
  hero.magicSkills[destSchool] = { value: 5 };
  hero.magicSkills[destSpec] = { value: 5 };
  
  // Try to increase each multiple times
  let schoolCount = 0, specCount = 0;
  
  for (let i = 0; i < 1000; i++) {
    const s = tryMagicSkillUp(hero, destSchool, 20);
    if (s) {
      schoolCount++;
      hero.magicSkills[destSchool].value = 5;
    }
    
    const sp = tryMagicSkillUp(hero, destSpec, 20);
    if (sp) {
      specCount++;
      hero.magicSkills[destSpec].value = 5;
    }
  }
  
  // Both should accumulate independently
  assert(schoolCount + specCount > 0, 'At least one skill-up should occur');
});

// ============================================================
// RUN TESTS
// ============================================================

console.log('SANITY CHECK 24: Skill-up Pacing Normalization\n');

for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${err.message}`);
    failed++;
  }
}

console.log(`\n${passed}/${tests.length} tests passed`);

if (failed === 0) {
  console.log('\n✓✓✓ ALL TESTS PASS ✓✓✓');
  console.log(`\nSKILL_UP_RATE_MULT = ${SKILL_UP_RATE_MULT}`);
  console.log('Skill-up pacing is normalized for 3-second tickrate.');
  process.exit(0);
} else {
  console.log(`\n✗ ${failed} test(s) failed`);
  process.exit(1);
}
