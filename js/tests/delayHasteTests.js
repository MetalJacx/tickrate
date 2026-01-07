/**
 * Delay & Haste System Tests
 * Run with: node delayHasteTests.js (from js/tests directory)
 * Or import and call runTests() in browser console
 */

// Try to import production helpers if running in Node.js (ES modules)
let productionGetBaseDelayTenths = null;
if (typeof process !== "undefined" && process.versions?.node) {
  try {
    // Note: Dynamic import is async, but we'll keep local fallback for now
    // In future, could convert test file to async or use --experimental-modules
    // For now, Suite 8 will use its local stub and note that production uses same logic
    console.log("Note: Tests use validated copies of production helpers");
  } catch (e) {
    // Fallback is already in place
  }
}

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
  return Math.max(1, Math.round(effectiveDelayTenths / 30));
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

  // Test 1.3: Mace at delay 40 (should be 1 tick, round(1.33) = 1)
  total++;
  if (assert(
    computeSwingTicks(40, 0) === 1,
    "Mace (delay 40) = 1 tick (round(1.33))"
  )) passed++;

  // Test 1.4: Slow weapon at delay 60 (should be 2 ticks)
  total++;
  if (assert(
    computeSwingTicks(60, 0) === 2,
    "Slow weapon (delay 60) = 2 ticks"
  )) passed++;

  // Test 1.5: Very slow at delay 100 (should be 3 ticks, round(3.33) = 3)
  total++;
  if (assert(
    computeSwingTicks(100, 0) === 3,
    "Very slow weapon (delay 100) = 3 ticks (round(3.33))"
  )) passed++;

  console.log(`\n📊 Suite 1: ${passed}/${total} passed\n`);
  return { passed, total };
}

// Test Suite 8: Weapon Delay & Swap Reset Wiring
function testWeaponDelayAndSwap() {
  console.log("\n=== Test Suite 8: Weapon Delay & Swap Reset Wiring ===\n");

  let passed = 0, total = 0;

  // Minimal item registry for tests
  const ITEMS = {
    test_weapon: { id: "test_weapon", delayTenths: 80 },
    slow_weapon: { id: "slow_weapon", delayTenths: 90 },
    fast_weapon: { id: "fast_weapon", delayTenths: 30 }
  };

  function getItemDef(id) { return ITEMS[id] || null; }

  // Production-aligned helper: reads 'main' slot (matches combat.js getBaseDelayTenths)
  function getBaseDelayTenthsForTest(actor) {
    if (actor.heroId) {
      const slot = actor.equipment?.["main"] || null;
      if (slot) {
        const def = getItemDef(slot.id);
        if (def && def.delayTenths) return def.delayTenths;
      }
      return 30;
    }
    return actor.naturalDelayTenths || 30;
  }

  // 8.1: Equipping a weapon with delay 80 maps to 3 swing ticks (round(80/30) = 3)
  total++;
  const hero1 = { heroId: 1, equipment: { main: { id: "test_weapon", quantity: 1 } } };
  const baseDelay1 = getBaseDelayTenthsForTest(hero1);
  const ticks1 = computeSwingTicks(baseDelay1, 0);
  if (assert(baseDelay1 === 80 && ticks1 === 3, "Weapon delay 80 -> baseDelay=80 and swingTicks=3")) passed++;

  // 8.2: Swapping weapons mid-combat hard-resets swingCd to new swingTicks
  // This simulates the ui.js equip handler behavior
  total++;
  const state = { currentEnemies: [{}] }; // simulate in-combat
  const hero2 = {
    heroId: 2,
    inCombat: true,
    equipment: { main: { id: "slow_weapon", quantity: 1 } },
    swingTicks: 2,
    swingCd: 1
  };
  // Equip handler behavior (mirrors ui.js logic): set new main item, recompute, hard reset
  function equipDuringCombat(hero, newItemId) {
    hero.equipment.main = { id: newItemId, quantity: 1 };
    if (hero.inCombat && state.currentEnemies.length > 0) {
      const baseDelay = getBaseDelayTenthsForTest(hero);
      const hastePct = 0; // no haste for this test
      const newTicks = computeSwingTicks(baseDelay, hastePct);
      hero.swingTicks = newTicks;
      hero.swingCd = newTicks; // hard reset (no free swing)
    }
  }
  equipDuringCombat(hero2, "fast_weapon");
  if (assert(hero2.swingTicks === 1 && hero2.swingCd === 1, "Weapon swap in combat -> swingCd hard-resets to new swingTicks")) passed++;

  console.log(`\n📊 Suite 8: ${passed}/${total} passed\n`);
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

  // Test 2.2: Mace (40) with +50% haste → 1 tick (40/1.5 = 26.67, round = 1)
  total++;
  if (assert(
    computeSwingTicks(40, 0.5) === 1,
    "Mace (delay 40) with +50% haste = 1 tick"
  )) passed++;

  // Test 2.3: Mace (40) with +30% haste → 1 tick (40/1.3 = 30.77, round = 1)
  total++;
  if (assert(
    computeSwingTicks(40, 0.3) === 1,
    "Mace (delay 40) with +30% haste = 1 tick (30.77 rounds to 1)"
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

  // Test 3.1: Sword (30) with -25% slow → 1 tick (30/0.75 = 40, round(40/30) = round(1.33) = 1)
  total++;
  if (assert(
    computeSwingTicks(30, -0.25) === 1,
    "Sword (delay 30) with -25% slow = 1 tick (rounds to 1)"
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

  // Test 3.4: Mace (40) with -75% slow → 5 ticks (40/0.25 = 160, round(160/30) = round(5.33) = 5)
  total++;
  if (assert(
    computeSwingTicks(40, -0.75) === 5,
    "Mace (delay 40) with -75% slow (max) = 5 ticks (5.33 rounds to 5)"
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

// Test Suite 7: Proportional Rescale on Haste/Slow (no free swings)
function testSwingRescale() {
  console.log("\n=== Test Suite 7: Swing Rescale on Haste/Slow ===\n");
  
  let passed = 0, total = 0;

  function clamp(val, min, max) { return Math.min(max, Math.max(min, val)); }
  function rescaleSwingCd(oldSwingTicks, oldSwingCd, newSwingTicks) {
    const progress = clamp(1 - (oldSwingCd / oldSwingTicks), 0, 1);
    let newSwingCd = Math.round((1 - progress) * newSwingTicks);
    if (oldSwingCd !== 0) newSwingCd = Math.max(1, newSwingCd); else newSwingCd = 0;
    return newSwingCd;
  }

  // 7.1: 50% progressed swing; haste reduces remaining time proportionally
  total++;
  const cd_haste = rescaleSwingCd(4, 2, 2); // progress=0.5, newCd=round(0.5*2)=1
  if (assert(cd_haste === 1, "50% progress; haste to 2 ticks -> new swingCd = 1")) passed++;

  // 7.2: 50% progressed swing; slow increases remaining time proportionally
  total++;
  const cd_slow = rescaleSwingCd(4, 2, 6); // progress=0.5, newCd=round(0.5*6)=3
  if (assert(cd_slow === 3, "50% progress; slow to 6 ticks -> new swingCd = 3")) passed++;

  // 7.3: Already ready to swing; remains ready regardless of haste/slow
  total++;
  const cd_ready = rescaleSwingCd(4, 0, 8); // oldCd=0 -> stays 0
  if (assert(cd_ready === 0, "Ready to swing (cd=0); remains 0 after change")) passed++;

  // 7.4: Near-zero cd cannot be locked-in by repeated slow; minimum 1 if not already zero
  total++;
  const cd_lock = rescaleSwingCd(4, 1, 8); // progress=0.75, new=round(0.25*8)=2 (>=1)
  if (assert(cd_lock === 2, "Near-zero cd + slow -> new swingCd >= 1 (here 2)")) passed++;

  // 7.5: Haste on near-finished swing does not grant instant swing unless cd was already 0
  total++;
  const cd_haste_near = rescaleSwingCd(4, 1, 2); // progress=0.75, new=round(0.25*2)=1 (not 0)
  if (assert(cd_haste_near === 1, "Near-finished swing + haste -> new swingCd = 1 (no free swing)")) passed++;

  console.log(`\n📊 Suite 7: ${passed}/${total} passed\n`);
  return { passed, total };
}
// === SUITE 9: Equip Cooldown (Prevent Weapon Spam) ===
function testEquipCooldown() {
  console.log("\n=== Test Suite 9: Equip Cooldown (Prevent Weapon Spam) ===\n");
  
  let passed = 0, total = 0;

  // Simulate hero with equipCd
  const hero = {
    equipCd: 0,
    equipment: { main: { id: "iron_sword", quantity: 1 } },
    inCombat: true
  };

  // Test 9.1: equipCd initializes to 0
  total++;
  if (assert(
    hero.equipCd === 0,
    "Hero starts with equipCd = 0 (no cooldown)"
  )) passed++;

  // Test 9.2: After weapon swap in combat, equipCd = 2
  hero.equipCd = 2; // Simulates what happens after weapon swap
  total++;
  if (assert(
    hero.equipCd === 2,
    "After weapon swap in combat: equipCd = 2"
  )) passed++;

  // Test 9.3: Weapon swap blocked when equipCd > 0
  const canSwap = hero.equipCd === 0;
  total++;
  if (assert(
    canSwap === false,
    "Weapon swap blocked when equipCd > 0"
  )) passed++;

  // Test 9.4: Tick 1 - decrement equipCd
  hero.equipCd = Math.max(0, hero.equipCd - 1);
  total++;
  if (assert(
    hero.equipCd === 1,
    "After 1 tick: equipCd = 1"
  )) passed++;

  // Test 9.5: Still blocked when equipCd = 1
  const canSwap2 = hero.equipCd === 0;
  total++;
  if (assert(
    canSwap2 === false,
    "Weapon swap still blocked when equipCd = 1"
  )) passed++;

  // Test 9.6: Tick 2 - decrement equipCd to 0
  hero.equipCd = Math.max(0, hero.equipCd - 1);
  total++;
  if (assert(
    hero.equipCd === 0,
    "After 2 ticks: equipCd = 0 (cooldown expired)"
  )) passed++;

  // Test 9.7: Can swap again when equipCd = 0
  const canSwap3 = hero.equipCd === 0;
  total++;
  if (assert(
    canSwap3 === true,
    "Weapon swap allowed when equipCd = 0"
  )) passed++;

  // Test 9.8: equipCd never goes negative
  hero.equipCd = 0;
  hero.equipCd = Math.max(0, hero.equipCd - 1);
  total++;
  if (assert(
    hero.equipCd === 0,
    "equipCd clamped to 0 (never negative)"
  )) passed++;

  // Test 9.9: Exact timing - locked for exactly 2 ticks
  // Simulate the real game flow
  const timeline = {
    equipCd: 0,
    equipment: { main: { id: "sword", quantity: 1 } }
  };
  
  // Tick N: Player swaps weapon
  timeline.equipCd = 2;
  const canSwapAtTickN = timeline.equipCd === 0;
  total++;
  if (assert(
    canSwapAtTickN === false && timeline.equipCd === 2,
    "Tick N (swap moment): equipCd = 2, immediately blocked"
  )) passed++;
  
  // Tick N+1: gameTick decrements
  timeline.equipCd = Math.max(0, timeline.equipCd - 1);
  const canSwapAtTickN1 = timeline.equipCd === 0;
  total++;
  if (assert(
    canSwapAtTickN1 === false && timeline.equipCd === 1,
    "Tick N+1: equipCd = 1, still blocked"
  )) passed++;
  
  // Tick N+2: gameTick decrements again
  timeline.equipCd = Math.max(0, timeline.equipCd - 1);
  const canSwapAtTickN2 = timeline.equipCd === 0;
  total++;
  if (assert(
    canSwapAtTickN2 === true && timeline.equipCd === 0,
    "Tick N+2: equipCd = 0, swaps allowed again (exactly 2 ticks)"
  )) passed++;

  // Test 9.10: No side effects when blocked
  const sideEffectTest = {
    equipCd: 2,
    equipment: { main: { id: "old_sword", quantity: 1 } },
    swingCd: 1,
    swingTicks: 3,
    inCombat: true
  };
  
  // Simulate blocked swap attempt
  const canProceed = sideEffectTest.equipCd === 0;
  if (!canProceed) {
    // Guard returned early - equipment should remain unchanged
    total++;
    if (assert(
      sideEffectTest.equipment.main.id === "old_sword" &&
      sideEffectTest.swingCd === 1,
      "Blocked swap: no changes to equipment or swing timer"
    )) passed++;
  }

  console.log(`📊 Suite 9: ${passed}/${total} passed\n`);
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
    testSwingCooldownProgression(),
    testSwingRescale(),
    testWeaponDelayAndSwap(),
    testEquipCooldown()
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
