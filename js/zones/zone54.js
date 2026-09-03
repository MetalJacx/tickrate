// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Highpass Keep" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 54,
  id: "highridge_keep",
  name: "Highridge Keep",
  levelRange: [25, 30],
  description: "Highridge Keep is the fortified seat overlooking Highridge Hold and a hub for trade across central Ostrallis. Beneath its civilized upper levels, Clawrend goblins, prisoners, smugglers and other hostile occupants turn the keep’s lower passages into a compact dungeon hunting ground. The recommended range is 25–30 for the principal hunting areas inside the keep. The number of enemies to kill is quite limited, so not suitable for a group.",
  requirements: {
    killsIn: { zoneId: "mistmourn_castle", count: 526 }
  },
  copperReward: { min: 66, max: 109 },
  aggroChance: 0.054,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.165, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.058, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.058 },
    { itemId: "health_potion", dropRate: 0.058 },
  ],
  global: {},
  enemies: [
    { id: "eq_pickclaw_goblins", weight: 1.0, loot: [] },
    { id: "eq_goblin_casters", weight: 1.0, loot: [] },
    { id: "eq_smugglers", weight: 1.0, loot: [] },
    { id: "eq_dyrna_nlithe", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
