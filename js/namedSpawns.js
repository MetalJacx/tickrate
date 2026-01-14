// Named spawn smoothing system (Phase 3: Kunark-style spawn cadence)
// Prevents back-to-back named spawns (cooldown) and long droughts (pity ramp)

import { state } from "./state.js";
import { getZoneDef } from "./zones/index.js";

// Cooldown kills after a named spawn (prevents back-to-back)
const COOLDOWN_KILLS_OUTDOOR = 10;
const COOLDOWN_KILLS_DUNGEON = 6;

// Expected kills between named spawns (pity ramp starts after this)
const EXPECTED_KILLS_OUTDOOR = 45;
const EXPECTED_KILLS_DUNGEON = 30;

// Pity ramp caps (maximum multiplier boost)
const PITY_CAP_OUTDOOR = 3.0;
const PITY_CAP_DUNGEON = 2.5;

/**
 * Determine if a zone is a dungeon (vs outdoor)
 * Dungeons are zones with higher aggro chance and indoor setting
 */
function isZoneDungeon(zoneId) {
  const zoneDef = getZoneDef(state.zone);
  if (!zoneDef) return false;
  
  // Dungeon indicators: higher aggro chance, specific zone names
  const dungeonZones = ["shatterbone_keep", "hallowbone_castle"];
  if (dungeonZones.includes(zoneId)) return true;
  
  // Default to outdoor
  return false;
}

/**
 * Get cooldown kills for current zone type
 */
function getCooldownKills(zoneId) {
  return isZoneDungeon(zoneId) ? COOLDOWN_KILLS_DUNGEON : COOLDOWN_KILLS_OUTDOOR;
}

/**
 * Get expected kills for current zone type
 */
function getExpectedKills(zoneId) {
  return isZoneDungeon(zoneId) ? EXPECTED_KILLS_DUNGEON : EXPECTED_KILLS_OUTDOOR;
}

/**
 * Get pity cap for current zone type
 */
function getPityCap(zoneId) {
  return isZoneDungeon(zoneId) ? PITY_CAP_DUNGEON : PITY_CAP_OUTDOOR;
}

/**
 * Calculate the smoothing multiplier for a named mob
 * Returns:
 * - 0 during cooldown (no named spawns allowed)
 * - 1.0 for normal RNG (before pity threshold)
 * - >1.0 for pity ramp (increasing chance after drought)
 */
export function getNamedSmoothingMultiplier(zoneId) {
  if (!zoneId) return 1.0;
  
  // Initialize tracking if needed
  if (state.killsSinceLastNamed[zoneId] === undefined) {
    state.killsSinceLastNamed[zoneId] = 0;
  }
  if (state.namedCooldownKills[zoneId] === undefined) {
    state.namedCooldownKills[zoneId] = 0;
  }
  
  const cooldownRemaining = state.namedCooldownKills[zoneId] || 0;
  
  // During cooldown: no named spawns
  if (cooldownRemaining > 0) {
    return 0;
  }
  
  const killsSince = state.killsSinceLastNamed[zoneId] || 0;
  const expectedKills = getExpectedKills(zoneId);
  
  // Before expected kills threshold: normal RNG
  if (killsSince <= expectedKills) {
    return 1.0;
  }
  
  // After expected kills: pity ramp
  // ramp = 1 + (killsSince - expected) / expected
  const excess = killsSince - expectedKills;
  const ramp = 1.0 + (excess / expectedKills);
  const cap = getPityCap(zoneId);
  
  return Math.min(ramp, cap);
}

/**
 * Called when a named mob spawns
 * Resets kill counter and starts cooldown
 */
export function onNamedSpawned(zoneId) {
  if (!zoneId) return;
  
  state.killsSinceLastNamed[zoneId] = 0;
  state.namedCooldownKills[zoneId] = getCooldownKills(zoneId);
  
  console.log(`[NAMED SPAWN] Zone ${zoneId}: cooldown started (${getCooldownKills(zoneId)} kills)`);
}

/**
 * Called when any mob (named or not) is killed
 * Updates tracking counters
 */
export function onMobKilled(mobDef, zoneId) {
  if (!zoneId) return;
  
  // Initialize tracking if needed
  if (state.killsSinceLastNamed[zoneId] === undefined) {
    state.killsSinceLastNamed[zoneId] = 0;
  }
  if (state.namedCooldownKills[zoneId] === undefined) {
    state.namedCooldownKills[zoneId] = 0;
  }
  
  const isNamed = mobDef?.isNamed === true;
  
  if (isNamed) {
    // Named killed: the named itself counts as one kill toward the cooldown
    // Cooldown was already set when it spawned, now decrement it once
    if (state.namedCooldownKills[zoneId] > 0) {
      state.namedCooldownKills[zoneId] -= 1;
    }
  } else {
    // Regular mob killed: increment counter and decrement cooldown
    state.killsSinceLastNamed[zoneId] = (state.killsSinceLastNamed[zoneId] || 0) + 1;
    
    if (state.namedCooldownKills[zoneId] > 0) {
      state.namedCooldownKills[zoneId] -= 1;
    }
    
    // Log pity status if getting close to cap
    const multiplier = getNamedSmoothingMultiplier(zoneId);
    if (multiplier > 1.5) {
      console.log(`[PITY] Zone ${zoneId}: ${state.killsSinceLastNamed[zoneId]} kills since last named, multiplier: ${multiplier.toFixed(2)}x`);
    }
  }
}
