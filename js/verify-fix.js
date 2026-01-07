// Quick verification of the fix
// Run this in browser console to verify ceil() formula works

console.log("=== TESTING CEIL() FIX ===\n");

function computeSwingTicks(baseDelayTenths, totalHastePct) {
  const effectiveDelayTenths = baseDelayTenths / (1 + totalHastePct);
  return Math.max(1, Math.ceil(effectiveDelayTenths / 30));
}

const tests = [
  { delay: 15, haste: 0, expected: 1, name: "Dagger (15)" },
  { delay: 30, haste: 0, expected: 1, name: "Sword (30)" },
  { delay: 40, haste: 0, expected: 2, name: "Mace (40)" },
  { delay: 60, haste: 0, expected: 2, name: "Slow weapon (60)" },
  { delay: 100, haste: 0, expected: 4, name: "Very slow (100)" },
  { delay: 40, haste: 0.5, expected: 1, name: "Mace (40) with +50% haste" },
  { delay: 40, haste: 0.3, expected: 2, name: "Mace (40) with +30% haste" },
  { delay: 40, haste: -0.5, expected: 3, name: "Mace (40) with -50% slow" },
  { delay: 40, haste: -0.75, expected: 5, name: "Mace (40) with -75% slow" },
];

let passed = 0;
tests.forEach(t => {
  const result = computeSwingTicks(t.delay, t.haste);
  const status = result === t.expected ? "✓ PASS" : "❌ FAIL";
  console.log(`${status}: ${t.name} = ${result} tick(s) (expected ${t.expected})`);
  if (result === t.expected) passed++;
});

console.log(`\n✅ RESULT: ${passed}/${tests.length} tests passed`);
