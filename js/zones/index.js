import Town from "./zoneTown.js";
import Zone1 from "./zone1.js";
import Zone2 from "./zone2.js";
import Zone3 from "./zone3.js";
import Zone4 from "./zone4.js";
import Zone5 from "./zone5.js";
import Zone6 from "./zone6.js";
import Zone7 from "./zone7.js";
import Zone8 from "./zone8.js";
import Zone9 from "./zone9.js";
import Zone10 from "./zone10.js";
import Zone11 from "./zone11.js";
import Zone12 from "./zone12.js";
import Zone13 from "./zone13.js";
import Zone14 from "./zone14.js";
import Zone15 from "./zone15.js";
import Zone16 from "./zone16.js";
import Zone17 from "./zone17.js";
import Zone18 from "./zone18.js";
import Zone19 from "./zone19.js";
import Zone20 from "./zone20.js";
import Zone21 from "./zone21.js";
import Zone22 from "./zone22.js";
import Zone23 from "./zone23.js";
import Zone24 from "./zone24.js";
import Zone25 from "./zone25.js";
import Zone26 from "./zone26.js";
import Zone27 from "./zone27.js";
import Zone28 from "./zone28.js";
import Zone29 from "./zone29.js";
import Zone30 from "./zone30.js";
import Zone31 from "./zone31.js";
import Zone32 from "./zone32.js";
import Zone33 from "./zone33.js";
import Zone34 from "./zone34.js";
import Zone35 from "./zone35.js";
import Zone36 from "./zone36.js";
import Zone37 from "./zone37.js";
import Zone38 from "./zone38.js";
import Zone39 from "./zone39.js";
import Zone40 from "./zone40.js";
import Zone41 from "./zone41.js";
import Zone42 from "./zone42.js";
import Zone43 from "./zone43.js";
import Zone44 from "./zone44.js";
import Zone45 from "./zone45.js";
import Zone46 from "./zone46.js";
import Zone47 from "./zone47.js";
import Zone48 from "./zone48.js";
import Zone49 from "./zone49.js";
import Zone50 from "./zone50.js";
import Zone51 from "./zone51.js";
import Zone52 from "./zone52.js";
import Zone53 from "./zone53.js";
import Zone54 from "./zone54.js";
import Zone55 from "./zone55.js";
import Zone56 from "./zone56.js";
import Zone57 from "./zone57.js";
import Zone58 from "./zone58.js";
import Zone59 from "./zone59.js";
import Zone60 from "./zone60.js";
import Zone61 from "./zone61.js";
import Zone62 from "./zone62.js";
import { getMobDef } from "../mobs.js";
import { getNamedSmoothingMultiplier } from "../namedSpawns.js";
import { state } from "../state.js";

export const ZONES = [Town, Zone1, Zone2, Zone3, Zone4, Zone5, Zone6, Zone7, Zone8, Zone9, Zone10, Zone11, Zone12, Zone13, Zone14, Zone15, Zone16, Zone17, Zone18, Zone19, Zone20, Zone21, Zone22, Zone23, Zone24, Zone25, Zone26, Zone27, Zone28, Zone29, Zone30, Zone31, Zone32, Zone33, Zone34, Zone35, Zone36, Zone37, Zone38, Zone39, Zone40, Zone41, Zone42, Zone43, Zone44, Zone45, Zone46, Zone47, Zone48, Zone49, Zone50, Zone51, Zone52, Zone53, Zone54, Zone55, Zone56, Zone57, Zone58, Zone59, Zone60, Zone61, Zone62];
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
