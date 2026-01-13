import Town from "./zoneTown.js";
import Zone1 from "./zone1.js";
import Zone2 from "./zone2.js";
import Zone3 from "./zone3.js";
import Zone4 from "./zone4.js";
import Zone5 from "./zone5.js";
import Zone6 from "./zone6.js";
import { getMobDef } from "../mobs.js";

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
  const weighted = [];
  let total = 0;
  for (const enemy of enemies) {
    const base = enemy.weight ?? 1;
    const mod = modifiers[enemy.id] ?? 1;
    const weight = Math.max(0.01, base * mod);
    total += weight;
    weighted.push({ enemy, weight });
  }
  if (total <= 0) return enemies[0];
  const roll = Math.random() * total;
  let accum = 0;
  for (const entry of weighted) {
    accum += entry.weight;
    if (roll <= accum) return entry.enemy;
  }
  return weighted[weighted.length - 1].enemy;
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

  const globalDefaults = zone.global || {};
  const activeSub = getActiveSubArea(zone, discoveryState);
  const modifiers = activeSub?.mobWeightModifiers || {};
  const enemyTemplate = pickWeighted(zone.enemies, modifiers);
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
