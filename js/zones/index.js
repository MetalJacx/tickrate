import Town from "./zoneTown.js";
import Zone1 from "./zone1.js";
import Zone2 from "./zone2.js";
import Zone3 from "./zone3.js";
import Zone4 from "./zone4.js";
import Zone5 from "./zone5.js";
import Zone6 from "./zone6.js";
import { getMobDef } from "../mobs.js";
import { getNamedSmoothingMultiplier } from "../namedSpawns.js";
import { state } from "../state.js";

export const ZONES = [Town, Zone1, Zone2, Zone3, Zone4, Zone5, Zone6];
export const MAX_ZONE = ZONES.length;

export function getZoneDef(zoneNumber) {
  return ZONES.find(z => z.zoneNumber === zoneNumber);
}

export function getZoneById(id) {
  return ZONES.find(z => z.id === id);
}

export function listZones() {
  return ZONES;
}

function pickWeighted(enemies, modifiers = {}) {
  const zoneId = state.activeZoneId;
  const namedMultiplier = getNamedSmoothingMultiplier(zoneId);
  
  const weighted = [];
  let total = 0;
  
  for (const enemy of enemies) {
    const base = enemy.weight ?? 1;
    const mod = modifiers[enemy.id] ?? 1;
    
    // IMPORTANT: allow true zero (used to block spawns)
    let weight = base * mod;
    
    // Apply named spawn smoothing (cooldown + pity)
    const mobDef = getMobDef(enemy.id);
    if (mobDef?.isNamed) {
      weight *= namedMultiplier;
    }
    
    // If blocked or suppressed, skip entirely
    if (weight <= 0) continue;
    
    total += weight;
    weighted.push({ enemy, weight });
  }
  
  // Fallback: pick first enemy that isn't blocked by modifiers
  if (total <= 0) {
    for (const enemy of enemies) {
      const base = enemy.weight ?? 1;
      const mod = modifiers[enemy.id] ?? 1;
      if (base * mod > 0) return enemy;
    }
    return enemies[0];
  }
  
  const roll = Math.random() * total;
  let accum = 0;
  for (const entry of weighted) {
    accum += entry.weight;
    if (roll <= accum) return entry.enemy;
  }
  return weighted[weighted.length - 1]?.enemy ?? enemies[0];
}

function dedupeEnemiesById(enemies) {
  const map = new Map();
  for (const e of enemies) {
    const existing = map.get(e.id);
    if (!existing) {
      map.set(e.id, { ...e });
    } else {
      existing.weight = (existing.weight ?? 1) + (e.weight ?? 1);
      // Keep the first loot definition to avoid double-loot quirks
    }
  }
  return [...map.values()];
}

function getSelectedSubArea(zone, discoveryState) {
  if (!zone?.subAreas?.length) return null;
  
  const zoneId = zone.id;
  const chosenId = state.activeSubAreaIdByZone?.[zoneId];
  
  if (chosenId) {
    const chosen = zone.subAreas.find(s => s.id === chosenId);
    if (chosen) {
      const discovered = discoveryState?.[chosen.id] ?? chosen.discovered;
      if (discovered) return { ...chosen, discovered: true };
    }
  }
  
  // Fallback to first discovered subArea (old behavior)
  return getActiveSubArea(zone, discoveryState);
}

export function getActiveSubArea(zone, discoveryState) {
  if (!zone?.subAreas?.length) return null;
  for (const sub of zone.subAreas) {
    const discovered = discoveryState?.[sub.id] ?? sub.discovered;
    if (discovered) return { ...sub, discovered: true };
  }
  return null;
}

export function getEnemyForZone(zoneNumber, discoveryState = null) {
  const zone = getZoneDef(zoneNumber);
  if (!zone || !zone.enemies.length) return null;

  // Use deduped enemy list to neutralize accidental duplicate entries
  const enemies = dedupeEnemiesById(zone.enemies);

  const globalDefaults = zone.global || {};
  const activeSub = getSelectedSubArea(zone, discoveryState);
  const modifiers = activeSub?.mobWeightModifiers || {};
  const enemyTemplate = pickWeighted(enemies, modifiers);
  const mobDef = getMobDef(enemyTemplate.id) || {};
  return { ...mobDef, ...globalDefaults, ...enemyTemplate };
}

export function rollSubAreaDiscoveries(zoneNumber, discoveryState) {
  const zone = getZoneDef(zoneNumber);
  if (!zone?.subAreas?.length) return { discoveredIds: [], updated: discoveryState };
  const stateCopy = { ...(discoveryState || {}) };
  const discoveredIds = [];
  for (const sub of zone.subAreas) {
    const already = stateCopy[sub.id] ?? sub.discovered;
    if (already) {
      stateCopy[sub.id] = true;
      continue;
    }
    const chance = sub.discoveryChance ?? 0;
    if (Math.random() < chance) {
      stateCopy[sub.id] = true;
      discoveredIds.push(sub.id);
    }
  }
  return { discoveredIds, updated: stateCopy };
}

export function ensureZoneDiscovery(zone, discoveryState) {
  if (!zone?.subAreas?.length) return discoveryState || {};
  const next = { ...(discoveryState || {}) };
  for (const sub of zone.subAreas) {
    if (next[sub.id] === undefined) {
      next[sub.id] = sub.discovered || false;
    }
  }
  return next;
}
