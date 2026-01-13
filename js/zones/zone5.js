export default {
  zoneNumber: 5,
  id: "cornfields",
  name: "Cornfields",
  levelRange: [8, 11],
  description: "Tall crops, broken fences, and raiders hiding in the stalks.",
  requirements: {
    killsIn: { zoneId: "rolling_hills", count: 100 }
  },
  copperReward: { min: 34, max: 55 },
  aggroChance: 0.035,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.18, minQty: 1, maxQty: 5 },
    { itemId: "health_potion", dropRate: 0.06, minQty: 1, maxQty: 2 },
    { itemId: "tattered_robe", dropRate: 0.08 },
    { itemId: "rusty_sword", dropRate: 0.06 }
  ],
  global: {},
  enemies: [
    { id: "cornfield_raider", weight: 1.0, loot: [{ itemId: "rusty_sword", dropRate: 0.06 }] },
    { id: "field_gnawer", weight: 0.9, loot: [{ itemId: "cloth_wraps", dropRate: 0.08 }] }
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} },
    { id: "fenceline", name: "Fenceline", discovered: false, discoveryChance: 0, mobWeightModifiers: { cornfield_raider: 1.1, field_gnawer: 1.0 } },
    { id: "deep_rows", name: "Deep Rows", discovered: false, discoveryChance: 0.03, mobWeightModifiers: { cornfield_raider: 1.3, field_gnawer: 0.8 } }
  ]
};
