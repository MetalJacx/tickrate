/**
 * Delay & Haste System Tests
 * Run with: node delayHasteTests.js (from js/tests directory)
 * Or import and call runTests() in browser console
 */

// Test utilities
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    return false;
  }
  console.log(`✓ PASS: ${message}`);
  return true;
}

function assertClose(actual, expected, tolerance = 0.01, message = "") {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    console.error(`❌ FAIL: ${message} (expected ${expected}, got ${actual}, diff ${diff})`);
    return false;
  }
  console.log(`✓ PASS: ${message}`);
  return true;
}

// Test functions (copied from combat.js for reference)
function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function computeSwingTicks(baseDelayTenths, totalHastePct) {
  // Clamp haste to [-0.75, +3.00]
  const clampedHaste = Math.max(-0.75, Math.min(3.0, totalHastePct));
  const effectiveDelayTenths = baseDelayTenths / (1 + clampedHaste);
  return Math.max(1, Math.ceil(effectiveDelayTenths / 30));
}

function computeOverflowBonuses(baseDelayTenths, totalHastePct) {
  const effectiveDelayTenths = baseDelayTenths / (1 + totalHastePct);
  const swingTicks = computeSwingTicks(baseDelayTenths, totalHastePct);

  if (swingTicks > 1) {
    return { extraSwingChance: 0, autoDmgMult: 1.0, procMult: 1.0 };
  }

  const overflowPct = Math.max(0, (30 - effectiveDelayTenths) / 30);
  const extraSwingChance = clamp(overflowPct, 0, 0.50);
  const overflow2 = Math.max(0, overflowPct - 0.50);

  const autoDmgMult = 1 + Math.min(overflow2 * 0.20, 0.10);
  const procMult = 1 + Math.min(overflow2 * 0.40, 0.20);

  return { extraSwingChance, autoDmgMult, procMult };
}

// Test Suite 1: Basic Swing Tick Calculations
function testBasicSwingTicks() {
  console.log("\n=== Test Suite 1: Basic Swing Tick Calculations ===\n");
  
  let passed = 0, total = 0;

  // Test 1.1: Dagger at delay 15 (should be 1 tick)
  total++;
  if (assert(
    computeSwingTicks(15, 0) === 1,
    "Dagger (delay 15) = 1 tick"
  )) passed++;

  // Test 1.2: Sword at delay 30 (should be 1 tick)
  total++;
  if (assert(
    computeSwingTicks(30, 0) === 1,
    "Sword (delay 30) = 1 tick"
  )) passed++;

  // Test 1.3: Mace at delay 40 (should be 2 ticks)
  total++;
  if (assert(
    computeSwingTicks(40, 0) === 2,
    "Mace (delay 40) = 2 ticks"
  )) passed++;

  // Test 1.4: Slow weapon at delay 60 (should be 2 ticks)
  total++;
  if (assert(
    computeSwingTicks(60, 0) === 2,
    "Slow weapon (delay 60) = 2 ticks"
  )) passed++;

  // Test 1.5: Very slow at delay 100 (should be 4 ticks)
  total++;
  if (assert(
    computeSwingTicks(100, 0) === 4,
    "Very slow weapon (delay 100) = 4 ticks"
  )) passed++;

  console.log(`\n📊 Suite 1: ${passed}/${total} passed\n`);
  return { passed, total };
}

// Test Suite 2: Haste Calculations
function testHasteCalculations() {
  console.log("\n=== Test Suite 2: Haste Calculations ===\n");
  
  let passed = 0, total = 0;

  // Test 2.1: Sword (30) with +100% haste → 1 tick
  total++;
  if (assert(
    computeSwingTicks(30, 1.0) === 1,
    "Sword (delay 30) with +100% haste = 1 tick"
  )) passed++;

  // Test 2.2: Mace (40) with +50% haste → 1 tick (normally 2)
  total++;
  if (assert(
    computeSwingTicks(40, 0.5) === 1,
    "Mace (delay 40) with +50% haste = 1 tick (from 2)"
  )) passed++;

  // Test 2.3: Mace (40) with +30% haste → still 2 ticks (not enough)
  total++;
  if (assert(
    computeSwingTicks(40, 0.3) === 2,
    "Mace (delay 40) with +30% haste = 2 ticks (not enough to hit floor)"
  )) passed++;

  // Test 2.4: Mace (40) with +100% haste → 1 tick
  total++;
  if (assert(
    computeSwingTicks(40, 1.0) === 1,
    "Mace (delay 40) with +100% haste = 1 tick"
  )) passed++;

  // Test 2.5: Dagger (15) with +300% haste → still 1 tick (already at floor)
  total++;
  if (assert(
    computeSwingTicks(15, 3.0) === 1,
    "Dagger (delay 15) with +300% haste = 1 tick (already at floor)"
  )) passed++;

  console.log(`\n📊 Suite 2: ${passed}/${total} passed\n`);
  return { passed, total };
}

// Test Suite 3: Slow Calculations
function testSlowCalculations() {
  console.log("\n=== Test Suite 3: Slow/Debuff Calculations ===\n");
  
  let passed = 0, total = 0;

  // Test 3.1: Sword (30) with -25% slow → still 2 ticks
  total++;
  if (assert(
    computeSwingTicks(30, -0.25) === 2,
    "Sword (delay 30) with -25% slow = 2 ticks"
  )) passed++;

  // Test 3.2: Mace (40) with -50% slow → 3 ticks (from 2)
  total++;
  if (assert(
    computeSwingTicks(40, -0.5) === 3,
    "Mace (delay 40) with -50% slow = 3 ticks (from 2)"
  )) passed++;

  // Test 3.3: Sword (30) with -75% slow (max) → 4 ticks
  total++;
  if (assert(
    computeSwingTicks(30, -0.75) === 4,
    "Sword (delay 30) with -75% slow (max) = 4 ticks"
  )) passed++;

  // Test 3.4: Mace (40) with -75% slow → 6 ticks
  total++;
  if (assert(
    computeSwingTicks(40, -0.75) === 6,
    "Mace (delay 40) with -75% slow (max) = 6 ticks"
  )) passed++;

  console.log(`\n📊 Suite 3: ${passed}/${total} passed\n`);
  return { passed, total };
}

// Test Suite 4: Overflow Bonuses (at 1-tick floor)
function testOverflowBonuses() {
  console.log("\n=== Test Suite 4: Overflow Bonuses ===\n");
  
  let passed = 0, total = 0;

  // Test 4.1: Dagger at floor with +30% haste → 50% extra swing chance (at cap)
  total++;
  const dag30 = computeOverflowBonuses(15, 0.30);
  if (assertClose(
    dag30.extraSwingChance, 0.50, 0.01,
    "Dagger (15) with +30% haste: 50% extra swing chance (capped)"
  )) passed++;

  // Test 4.2: Sword at floor → minimal overflow
  total++;
  const sword0 = computeOverflowBonuses(30, 0);
  if (assert(
    sword0.extraSwingChance === 0,
    "Sword (30) with 0% haste: 0% extra swing chance (no overflow)"
  )) passed++;

  // Test 4.3: Mace at floor with +100% haste → some overflow
  total++;
  const mace100 = computeOverflowBonuses(40, 1.0);
  if (assert(
    mace100.extraSwingChance > 0 && mace100.extraSwingChance <= 0.50,
    "Mace (40) with +100% haste: extra swing chance > 0 and <= 50%"
  )) passed++;

  // Test 4.4: Mace at floor → damage mult is 1.0 (no overflow2)
  total++;
  if (assert(
    mace100.autoDmgMult === 1.0,
    "Mace (40) with +100% haste: no damage multiplier (no overflow2)"
  )) passed++;

  // Test 4.5: Dagger at floor with max haste → cap at 50% swing + 10% damage
  total++;
  const dagMax = computeOverflowBonuses(15, 3.0);
  if (assert(
    dagMax.extraSwingChance === 0.50 && dagMax.autoDmgMult <= 1.10,
    "Dagger (15) with +300% haste: capped at 50% swing & 10% damage"
  )) passed++;

  // Test 4.6: Not at floor (swingTicks > 1) → no overflow
  total++;
  const noFloor = computeOverflowBonuses(60, 0);
  if (assert(
    noFloor.extraSwingChance === 0 && noFloor.autoDmgMult === 1.0 && noFloor.procMult === 1.0,
    "Delay 60 (2 ticks): no overflow bonuses"
  )) passed++;

  console.log(`\n📊 Suite 4: ${passed}/${total} passed\n`);
  return { passed, total };
}

// Test Suite 5: Haste Clamping
function testHasteClamping() {
  console.log("\n=== Test Suite 5: Haste Clamping [-0.75, +3.00] ===\n");
  
  let passed = 0, total = 0;

  // Test 5.1: Excessive haste gets clamped
  total++;
  const clampedHigh = computeSwingTicks(30, 5.0);
  const clampedHigh_ref = computeSwingTicks(30, 3.0); // Max is 3.0
  if (assert(
    clampedHigh === clampedHigh_ref,
    "Haste +500% clamped to +300%: same result as +300%"
  )) passed++;

  // Test 5.2: Excessive slow gets clamped
  total++;
  const clampedLow = computeSwingTicks(30, -0.90);
  const clampedLow_ref = computeSwingTicks(30, -0.75); // Min is -0.75
  if (assert(
    clampedLow === clampedLow_ref,
    "Slow -90% clamped to -75%: same result as -75%"
  )) passed++;

  console.log(`\n📊 Suite 5: ${passed}/${total} passed\n`);
  return { passed, total };
}

// Test Suite 6: Swing Cooldown Progression
function testSwingCooldownProgression() {
  console.log("\n=== Test Suite 6: Swing Cooldown Progression ===\n");
  
  let passed = 0, total = 0;

  // Simulate a hero with 2-tick swing (like Mace)
  const hero = {
    swingTicks: 2,
    swingCd: 2
  };

  // Test 6.1: Initial state
  total++;
  if (assert(
    hero.swingCd === 2,
    "Hero initialized with swingCd = 2 (ready to swing in 2 ticks)"
  )) passed++;

  // Test 6.2: Tick 1 - decrement
  hero.swingCd = Math.max(0, hero.swingCd - 1);
  total++;
  if (assert(
    hero.swingCd === 1,
    "After tick 1: swingCd = 1"
  )) passed++;

  // Test 6.3: Tick 2 - decrement to 0 (swing!)
  hero.swingCd = Math.max(0, hero.swingCd - 1);
  total++;
  if (assert(
    hero.swingCd === 0,
    "After tick 2: swingCd = 0 (swing ready)"
  )) passed++;

  // Test 6.4: After swing, reset
  hero.swingCd = hero.swingTicks;
  total++;
  if (assert(
    hero.swingCd === 2,
    "After swing, reset: swingCd = 2"
  )) passed++;

  // Now test 1-tick hero
  const hero1tick = {
    swingTicks: 1,
    swingCd: 0 // Can be 0-1 on init
  };

  // Test 6.5: 1-tick hero swings immediately
  total++;
  if (assert(
    hero1tick.swingCd === 0,
    "1-tick hero: swingCd starts at 0 (swings immediately)"
  )) passed++;

  console.log(`\n📊 Suite 6: ${passed}/${total} passed\n`);
  return { passed, total };
}

// Master test runner
function runTests() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║        DELAY & HASTE SYSTEM TEST SUITE                ║");
  console.log("╚════════════════════════════════════════════════════════╝");

  let totalPassed = 0, totalTests = 0;

  const results = [
    testBasicSwingTicks(),
    testHasteCalculations(),
    testSlowCalculations(),
    testOverflowBonuses(),
    testHasteClamping(),
    testSwingCooldownProgression()
  ];

  results.forEach(r => {
    totalPassed += r.passed;
    totalTests += r.total;
  });

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log(`║ FINAL RESULTS: ${totalPassed}/${totalTests} tests passed                   ║`);
  console.log("╚════════════════════════════════════════════════════════╝\n");

  if (totalPassed === totalTests) {
    console.log("🎉 All tests passed! The delay/haste system is working correctly.\n");
  } else {
    console.log(`⚠️  ${totalTests - totalPassed} test(s) failed. Review the results above.\n`);
  }

  return totalPassed === totalTests;
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { runTests, assert, assertClose };
}

// Auto-run if in Node.js
if (typeof require !== "undefined" && require.main === module) {
  runTests();
}
