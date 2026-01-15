// Debug to check what named are spawning from mundane_plains
import { state } from '../state.js';
import { getZoneById, getEnemyForZone } from '../zones/index.js';
import { getMobDef } from '../mobs.js';

state.activeZoneId = 'mundane_plains';
state.activeSubAreaIdByZone = { 'mundane_plains': 'windworn_fields' };
state.killsSinceLastNamed = { 'mundane_plains': 0 };
state.namedCooldownKills = { 'mundane_plains': 0 };
state.zoneDiscoveries = { 'mundane_plains': { 'windworn_fields': true, 'broken_trade_road': true, 'open_world': true } };
state.zone = 2;

const zone = getZoneById('mundane_plains');

const tiers = {};
let count = 0;

for (let i = 0; i < 10000; i++) {
  const enemy = getEnemyForZone(zone.zoneNumber, state.zoneDiscoveries['mundane_plains']);
  const mobDef = getMobDef(enemy.id);
  
  if (mobDef?.isNamed) {
    count++;
    const tier = mobDef.namedTier || 'unknown';
    tiers[tier] = (tiers[tier] || 0) + 1;
  }
}

console.log(`Named spawns: ${count}`);
console.log('Tiers:', tiers);
