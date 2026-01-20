export const GAME_TICK_MS = 3000;
export const TICK_SECONDS = GAME_TICK_MS / 1000; // 3 seconds per tick

// FIX 15: Skill-up rate multiplier to normalize for tickrate
// Game runs on 3s ticks, but skill-up formulas appear tuned for ~6s
// This multiplier compensates so skills don't level 2x as fast
// Set to 0.5 to halve skill-up chances across the board
export const SKILL_UP_RATE_MULT = 0.5;

// Resist System Constants (tunable for balance)
export const RESIST_BASE = 50;
export const RESIST_SCALE = 200;
export const RESIST_MIN_CHANCE = 0.05;   // 5% minimum resist chance
export const RESIST_MAX_CHANCE = 0.95;   // 95% maximum resist chance
export const RESIST_PARTIAL_STRENGTH = 0.75;  // Multiplier for partial resist calculation
export const RESIST_PARTIAL_FLOOR = 0.10;     // Minimum effectiveness for partial resists (10%)

export const SAVE_KEY = "tickrate_save_v2";
export const AUTO_SAVE_EVERY_MS = 5000;
// Cap both offline and background catch-up to 3 hours
export const MAX_OFFLINE_SECONDS = 3 * 60 * 60;
export const MAX_PARTY_SIZE = 6;
export const MAX_BENCH_SIZE = 12;
export const RECRUIT_UNLOCK_LEVEL = 60;
export const ROSTER_CAP = MAX_PARTY_SIZE + MAX_BENCH_SIZE;  // 18

// Meditate skill constants (EQ-authentic)
export const MEDITATE_UNLOCK_LEVEL = 5;
export const MEDITATE_SKILL_HARD_CAP = 252;
export const MEDITATE_BASE_REGEN_FACTOR = 0.002; // max(1, floor(maxMana * this))
export const COMBAT_REGEN_MULT = 0.25;
export const OOC_REGEN_MULT = 1.0;
// TESTING: XP requirement reduction (0-100)
// Set to 0 for normal XP requirements
// Set to 20 to reduce requirements by 20%
// Set to 90 to reduce requirements by 90%
export const XP_TEST_REDUCTION_PERCENT = 0;

// Party slot unlocks based on Account level (not zone)
export const ACCOUNT_SLOT_UNLOCKS = [
  { level: 1, slots: 1 },
  { level: 3, slots: 2 },
  { level: 10, slots: 3 },
  { level: 14, slots: 4 },
  { level: 18, slots: 5 },
  { level: 24, slots: 6 }
];

// Per-hero consumable slots unlock at these hero levels
export const CONSUMABLE_SLOT_UNLOCK_LEVELS = [1, 15, 30, 50];

// ===== EQ-STYLE EQUIPMENT SLOTS (Single Source of Truth) =====
// Ordered for 4-column grid layout (EQ-inspired)
export const EQUIP_SLOTS = [
  { key: "charm",      label: "Charm" },
  { key: "ear1",       label: "Ear 1" },
  { key: "head",       label: "Head" },
  { key: "face",       label: "Face" },
  { key: "ear2",       label: "Ear 2" },
  { key: "neck",       label: "Neck" },
  { key: "shoulders",  label: "Shoulders" },
  { key: "arms",       label: "Arms" },
  { key: "back",       label: "Back" },
  { key: "wrist1",     label: "Wrist 1" },
  { key: "wrist2",     label: "Wrist 2" },
  { key: "ranged",     label: "Ranged" },
  { key: "hands",      label: "Hands" },
  { key: "main",       label: "Main Hand" },
  { key: "off",        label: "Off Hand" },
  { key: "finger1",    label: "Finger 1" },
  { key: "finger2",    label: "Finger 2" },
  { key: "chest",      label: "Chest" },
  { key: "legs",       label: "Legs" },
  { key: "feet",       label: "Feet" },
  { key: "waist",      label: "Waist" },
  { key: "power",      label: "Power" },
  { key: "ammo",       label: "Ammo" }
];

export const EQUIP_SLOT_KEYS = EQUIP_SLOTS.map(s => s.key);
