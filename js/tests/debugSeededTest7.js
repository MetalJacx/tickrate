// Debug seeded RNG for Test 7
import { state } from '../state.js';
import { getZoneById, getEnemyForZone } from '../zones/index.js';
import { getMobDef } from '../mobs.js';

class SeededRNG {
  constructor(seed = 12345) {
    this.seed = seed;
  }
  
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const testRNG = new SeededRNG(7001);
Math.random = () => testRNG.next();

state.activeZoneId = 'mundane_plains';
state.activeSubAreaIdByZone = { 'mundane_plains': 'windworn_fields' };
state.killsSinceLastNamed = { 'mundane_plains': 0 };
state.namedCooldownKills = { 'mundane_plains': 0 };
state.zoneDiscoveries = { 'mundane_plains': { 'windworn_fields': true, 'broken_trade_road': true, 'open_world': true } };
state.zone = 2;

const zone = getZoneById('mundane_plains');

const tiers = {};
let count = 0;
const firstNamed = [];

for (let i = 0; i < 100000; i++) {
  const enemy = getEnemyForZone(zone.zoneNumber, state.zoneDiscoveries['mundane_plains']);
  const mobDef = getMobDef(enemy.id);
  
  if (mobDef?.isNamed) {
    count++;
    const tier = mobDef.namedTier || 'unknown';
    tiers[tier] = (tiers[tier] || 0) + 1;
    if (firstNamed.length < 20) {
      firstNamed.push(`${enemy.id} (${tier})`);
    }
  }
}

console.log(`Named spawns: ${count}`);
console.log('Tiers:', tiers);
console.log('First 20 named:', firstNamed);
