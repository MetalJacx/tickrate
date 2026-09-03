// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "North Qeynos" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 7,
  id: "north_qaelyn",
  name: "North Qaelyn",
  levelRange: [1, 3],
  description: "North Qaelyn is the fortified northern district of the human city of Qaelyn. It contains several guild halls, city services and the main gate into Qaelyn Hills, while hidden passages lead down into the Qaelyn Aqueducts and streets continue south into the harbor district.",
  requirements: {
    killsIn: { zoneId: "hallowbone_castle", count: 150 }
  },
  copperReward: { min: 10, max: 16 },
  aggroChance: 0.013,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.216, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.076, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.076 },
    { itemId: "health_potion", dropRate: 0.076 },
  ],
  global: {},
  enemies: [
    { id: "eq_rats", weight: 1.0, loot: [] },
    { id: "eq_bats", weight: 1.0, loot: [] },
    { id: "eq_fire_beetles", weight: 1.0, loot: [] },
    { id: "eq_decaying_skeletons", weight: 1.0, loot: [] },
    { id: "eq_gnoll_pups", weight: 1.0, loot: [] },
    { id: "eq_skippy_nightpaw", weight: 1.0, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
