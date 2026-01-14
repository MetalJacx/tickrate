// Quick diagnostic test to see why named spawns are so rare
import { getZoneById, getEnemyForZone } from '../zones/index.js';
import { getMobDef } from '../mobs.js';
import { getNamedSmoothingMultiplier, onNamedSpawned, onMobKilled } from '../namedSpawns.js';
import { state } from '../state.js';

// Reset state
state.zone = 2;
state.activeZoneId = 'mundane_plains';
state.activeSubAreaIdByZone = { 'mundane_plains': 'windworn_fields' };
state.killsSinceLastNamed = { 'mundane_plains': 0 };
state.namedCooldownKills = { 'mundane_plains': 0 };
state.zoneDiscoveries = {
  'mundane_plains': {
    'open_world': true,
    'broken_trade_road': true,
    'windworn_fields': true
  }
};

console.log('Starting spawn test...');
console.log('Zone:', state.activeZoneId);
console.log('SubArea:', state.activeSubAreaIdByZone['mundane_plains']);
console.log('');

let namedCount = 0;
let ravelCount = 0;

for (let i = 0; i < 10000; i++) {
  const multiplier = getNamedSmoothingMultiplier('mundane_plains');
  const enemy = getEnemyForZone(2, state.zoneDiscoveries['mundane_plains']);
  const mobDef = getMobDef(enemy.id);
  
  if (mobDef?.isNamed) {
    namedCount++;
    if (enemy.id === 'ravel_waylaid') ravelCount++;
    console.log(`Kill ${i}: Named spawn! ${enemy.id} (tier: ${mobDef.namedTier}, multiplier: ${multiplier.toFixed(2)})`);
    onNamedSpawned('mundane_plains');
  }
  
  onMobKilled(mobDef, 'mundane_plains');
  
  // Debug every 1000 kills
  if (i > 0 && i % 1000 === 0) {
    console.log(`Kill ${i}: killsSinceLast=${state.killsSinceLastNamed['mundane_plains']}, cooldown=${state.namedCooldownKills['mundane_plains']}, multiplier=${multiplier.toFixed(2)}`);
  }
}

console.log('');
console.log('Results:');
console.log(`Total kills: 10000`);
console.log(`Named spawns: ${namedCount}`);
console.log(`Ravel spawns: ${ravelCount}`);
console.log(`Named rate: ${(namedCount / 10000 * 100).toFixed(2)}%`);
