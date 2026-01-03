export const GAME_TICK_MS = 3000;
export const TICK_SECONDS = GAME_TICK_MS / 1000; // 3 seconds per tick

export const SAVE_KEY = "tickrate_save_v2";
export const AUTO_SAVE_EVERY_MS = 5000;
// Cap both offline and background catch-up to 3 hours
export const MAX_OFFLINE_SECONDS = 3 * 60 * 60;
export const MAX_PARTY_SIZE = 6;

// Meditate skill constants (EQ-authentic)
export const MEDITATE_UNLOCK_LEVEL = 5;
export const MEDITATE_SKILL_HARD_CAP = 252;
export const MEDITATE_BASE_REGEN_FACTOR = 0.002; // max(1, floor(maxMana * this))
export const COMBAT_REGEN_MULT = 0.25;
export const OOC_REGEN_MULT = 1.0;
// Party slot unlocks based on Account level (not zone)
export const ACCOUNT_SLOT_UNLOCKS = [
  { level: 1, slots: 1 },
  { level: 3, slots: 2 },
  { level: 10, slots: 3 },
  { level: 14, slots: 4 },
  { level: 18, slots: 5 },
  { level: 24, slots: 6 }
];
