import Zone1 from "./zone1.js";
import Zone2 from "./zone2.js";
import Zone3 from "./zone3.js";

export const ZONES = [Zone1, Zone2, Zone3];
export const MAX_ZONE = ZONES.length;

export function getZoneDef(zoneNumber) {
  return ZONES.find(z => z.zoneNumber === zoneNumber);
}

export function getEnemyForZone(zoneNumber) {
  const zone = getZoneDef(zoneNumber);
  if (!zone || !zone.enemies.length) return null;
  
  // Pick random enemy from the zone's enemy list
  const enemyDef = zone.enemies[Math.floor(Math.random() * zone.enemies.length)];
  return enemyDef;
}
