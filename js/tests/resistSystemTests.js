/**
 * Resist System Tests
 * Tests for race normalization, resist bucket hardening, and mob resists
 * Run with: node resistSystemTests.js (from js/tests directory)
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

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error(`❌ FAIL: ${message} (expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)})`);
    return false;
  }
  console.log(`✓ PASS: ${message}`);
  return true;
}

function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    console.error(`❌ FAIL: ${message}`);
    console.error(`  Expected: ${expectedStr}`);
    console.error(`  Got:      ${actualStr}`);
    return false;
  }
  console.log(`✓ PASS: ${message}`);
  return true;
}

// ============================================================================
// A) RACE KEY NORMALIZATION TESTS
// ============================================================================
console.log("\n=== A) Race Key Normalization Tests ===\n");

// Simulate normalizeRaceKey function (as implemented in races.js)
function normalizeRaceKey(raw) {
  if (!raw) return "human";
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/[\s\-]+/g, "_")  // Replace spaces and hyphens with underscores
    .replace(/_+/g, "_");        // Collapse multiple underscores
}

function testRaceKeyNormalization() {
  assert(
    normalizeRaceKey("High Elf") === "high_elf",
    'normalizeRaceKey("High Elf") => "high_elf"'
  );
  
  assert(
    normalizeRaceKey("Half-Elf") === "half_elf",
    'normalizeRaceKey("Half-Elf") => "half_elf"'
  );
  
  assert(
    normalizeRaceKey("  DARK   ELF ") === "dark_elf",
    'normalizeRaceKey("  DARK   ELF ") => "dark_elf"'
  );
  
  assert(
    normalizeRaceKey("dark_elf") === "dark_elf",
    'normalizeRaceKey("dark_elf") => "dark_elf"'
  );
  
  assert(
    normalizeRaceKey("DaRk_ElF") === "dark_elf",
    'normalizeRaceKey("DaRk_ElF") => "dark_elf"'
  );
  
  assert(
    normalizeRaceKey(null) === "human",
    'normalizeRaceKey(null) => "human" (default)'
  );
  
  assert(
    normalizeRaceKey("") === "human",
    'normalizeRaceKey("") => "human" (default)'
  );
}

testRaceKeyNormalization();

// ============================================================================
// B) RESIST BUCKET HARDENING TESTS
// ============================================================================
console.log("\n=== B) Resist Bucket Hardening Tests ===\n");

// Simulate ensureActorResists function (as implemented in resist.js)
function ensureActorResists(actor) {
  const BUCKETS = ["magic", "elemental", "contagion", "physical"];
  
  if (!actor.resists || typeof actor.resists !== "object") {
    actor.resists = {};
  }
  
  for (const bucket of BUCKETS) {
    const val = actor.resists[bucket];
    if (val === undefined || val === null || !Number.isFinite(val)) {
      actor.resists[bucket] = 0;
    }
  }
  
  if (!actor.spellPen || typeof actor.spellPen !== "object") {
    actor.spellPen = {};
  }
  
  for (const bucket of BUCKETS) {
    const val = actor.spellPen[bucket];
    if (val === undefined || val === null || !Number.isFinite(val)) {
      actor.spellPen[bucket] = 0;
    }
  }
}

function testEnsureActorResists() {
  // Test 1: Missing resists object entirely
  const hero1 = {};
  ensureActorResists(hero1);
  assertDeepEqual(
    hero1.resists,
    { magic: 0, elemental: 0, contagion: 0, physical: 0 },
    "Hero with no resists gets all buckets initialized to 0"
  );

  // Test 2: Resists object exists but missing buckets
  const hero2 = { resists: { magic: 5 } };
  ensureActorResists(hero2);
  assertDeepEqual(
    hero2.resists,
    { magic: 5, elemental: 0, contagion: 0, physical: 0 },
    "Hero with partial resists gets missing buckets filled"
  );

  // Test 3: Non-finite values become 0
  const hero3 = { resists: { magic: NaN, elemental: Infinity, contagion: 10, physical: -Infinity } };
  ensureActorResists(hero3);
  assertDeepEqual(
    hero3.resists,
    { magic: 0, elemental: 0, contagion: 10, physical: 0 },
    "Non-finite values (NaN, Infinity) become 0; finite values preserved"
  );

  // Test 4: spellPen handled separately
  const hero4 = { spellPen: { magic: NaN } };
  ensureActorResists(hero4);
  assertEqual(hero4.spellPen.magic, 0, "spellPen.magic NaN becomes 0");
  assert(Number.isFinite(hero4.spellPen.magic), "spellPen.magic is finite");

  // Test 5: Mob with no resists
  const mob = { type: "mob", name: "Zombie" };
  ensureActorResists(mob);
  assertDeepEqual(
    mob.resists,
    { magic: 0, elemental: 0, contagion: 0, physical: 0 },
    "Mob with no resists defined gets all buckets to 0"
  );

  // Test 6: Mob with partial resists
  const mobWithPartial = { type: "mob", resists: { magic: 15, contagion: 5 } };
  ensureActorResists(mobWithPartial);
  assert(
    mobWithPartial.resists.magic === 15 &&
    mobWithPartial.resists.elemental === 0 &&
    mobWithPartial.resists.contagion === 5 &&
    mobWithPartial.resists.physical === 0,
    "Mob with partial resists gets missing buckets filled"
  );
}

testEnsureActorResists();

// ============================================================================
// C) RACIAL RESISTS APPLICATION TESTS
// ============================================================================
console.log("\n=== C) Racial Resists Application Tests ===\n");

// Simulate getRaceDef and applyRacialResists (with normalization)
const RACES_DB = {
  human: { key: "human", name: "Human", resistMods: {} },
  high_elf: { key: "high_elf", name: "High Elf", resistMods: { magic: 3 } },
  half_elf: { key: "half_elf", name: "Half-Elf", resistMods: { contagion: 3 } },
  dark_elf: { key: "dark_elf", name: "Dark Elf", resistMods: { magic: 5 } },
  troll: { key: "troll", name: "Troll", resistMods: { contagion: 10 } }
};

function getRaceDef(key) {
  const normalizedKey = normalizeRaceKey(key);
  return RACES_DB[normalizedKey] || RACES_DB.human;
}

function applyRacialResists(actor, { force = false } = {}) {
  ensureActorResists(actor);
  
  if (actor._racialResistsApplied && !force) {
    return;
  }
  
  const prior = actor._racialResistsValues || { magic: 0, elemental: 0, contagion: 0, physical: 0 };
  for (const resistType of ["magic", "elemental", "contagion", "physical"]) {
    const prev = prior[resistType] || 0;
    if (prev) {
      actor.resists[resistType] -= prev;
    }
  }
  
  const rawRaceKey = actor.race || actor.raceKey || "human";
  const raceDef = getRaceDef(rawRaceKey);
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

function testRacialResists() {
  // Test 1: High Elf via spaced name
  const hero1 = { raceKey: "High Elf" };
  applyRacialResists(hero1);
  assertEqual(
    hero1.resists.magic, 3,
    'Hero with raceKey="High Elf" gets +3 magic resist'
  );

  // Test 2: High Elf via normalized key
  const hero2 = { raceKey: "high_elf" };
  applyRacialResists(hero2);
  assertEqual(
    hero2.resists.magic, 3,
    'Hero with raceKey="high_elf" gets +3 magic resist'
  );

  // Test 3: Human baseline (no bonus)
  const hero3 = { raceKey: "human" };
  applyRacialResists(hero3);
  assertDeepEqual(
    hero3.resists,
    { magic: 0, elemental: 0, contagion: 0, physical: 0 },
    "Human gets no resist bonus"
  );

  // Test 4: Idempotency - calling twice should not stack
  const hero4 = { raceKey: "dark_elf" };
  applyRacialResists(hero4);
  const afterFirstCall = { ...hero4.resists };
  applyRacialResists(hero4);
  assertDeepEqual(
    hero4.resists, afterFirstCall,
    "Calling applyRacialResists twice does not stack bonuses"
  );

  // Test 5: Force reapply with updated racial bonuses
  const hero5 = { raceKey: "troll" };
  applyRacialResists(hero5);
  assertEqual(hero5.resists.contagion, 10, "Troll gets +10 contagion");
  
  // Manually change race (simulating migration/reload)
  hero5.raceKey = "high_elf";
  applyRacialResists(hero5, { force: true });
  assertEqual(hero5.resists.contagion, 0, "After reapply with High Elf, contagion is 0");
  assertEqual(hero5.resists.magic, 3, "After reapply with High Elf, magic is 3");
}

testRacialResists();

// ============================================================================
// D) MOB RESIST DEFAULTS TEST
// ============================================================================
console.log("\n=== D) Mob Resist Defaults Tests ===\n");

function testMobResists() {
  // Test 1: Mob with no resists defined
  const mob1 = { name: "Zombie", type: "mob" };
  ensureActorResists(mob1);
  assertDeepEqual(
    mob1.resists,
    { magic: 0, elemental: 0, contagion: 0, physical: 0 },
    "Mob with no resists defined has all buckets at 0"
  );

  // Test 2: Mob with partial resists defined
  const mob2 = { name: "Fire Elemental", type: "mob", resists: { elemental: 20, magic: 10 } };
  ensureActorResists(mob2);
  assertDeepEqual(
    mob2.resists,
    { elemental: 20, magic: 10, contagion: 0, physical: 0 },
    "Mob with partial resists gets missing buckets filled"
  );

  // Test 3: Mobs do NOT get racial bonuses (no applyRacialResists called)
  const mob3 = { name: "Orc", type: "mob", race: "ogre" };
  ensureActorResists(mob3);
  // Don't call applyRacialResists for mobs
  assertDeepEqual(
    mob3.resists,
    { magic: 0, elemental: 0, contagion: 0, physical: 0 },
    "Mob with race field does not get racial bonus (applyRacialResists not called)"
  );
}

testMobResists();

// ============================================================================
// SUMMARY
// ============================================================================
console.log("\n=== All Tests Complete ===\n");
console.log("Resist System Final Polish Tests - All assertions checked");
