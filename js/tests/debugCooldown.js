// Debug script to understand cooldown violations
import { state } from '../state.js';
import { getZoneById } from '../zones/index.js';
import { getEnemyForZone } from '../zones/index.js';
import { getMobDef } from '../mobs.js';
import { onNamedSpawned, onMobKilled } from '../namedSpawns.js';

function resetState() {
  state.activeZoneId = 'shatterbone_keep';
  state.activeSubAreaIdByZone = { 'shatterbone_keep': 'war_yard' };
  state.killsSinceLastNamed = { 'shatterbone_keep': 0 };
  state.namedCooldownKills = { 'shatterbone_keep': 0 };
  state.zoneDiscoveries = { 'shatterbone_keep': { 'war_yard': true, 'bone_hall': true } };
  state.zone = 3;
}

resetState();
const zone = getZoneById('shatterbone_keep');
const cooldown = 6; // dungeon

let lastNamedKill = -1;
const gaps = [];

for (let i = 1; i <= 1000; i++) {
  const enemy = getEnemyForZone(zone.zoneNumber, state.zoneDiscoveries['shatterbone_keep']);
  const mobDef = getMobDef(enemy.id);
  
  if (mobDef?.isNamed) {
    const gap = lastNamedKill >= 0 ? (i - lastNamedKill) : -1;
    if (gap >= 0) {
      gaps.push(gap);
      if (gap < cooldown) {
        console.log(`VIOLATION at kill ${i}: gap=${gap}, expected>=${cooldown}`);
      }
    }
    lastNamedKill = i;
    onNamedSpawned('shatterbone_keep');
  }
  onMobKilled(mobDef, 'shatterbone_keep');
}

console.log(`\nGaps (first 20): ${gaps.slice(0, 20).join(', ')}`);
console.log(`Min gap: ${Math.min(...gaps)}`);
console.log(`Max gap: ${Math.max(...gaps)}`);
console.log(`Average gap: ${(gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(1)}`);
console.log(`Total named: ${gaps.length + 1}`);
console.log(`Violations (gap < ${cooldown}): ${gaps.filter(g => g < cooldown).length}`);
