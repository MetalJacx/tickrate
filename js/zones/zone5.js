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
    { id: "field_gnawer", weight: 0.9, loot: [{ itemId: "cloth_wraps", dropRate: 0.08 }] },
    { id: "cornreaper", weight: 0.002, loot: [{ itemId: "cornreaper_sickle", dropRate: 0.40 }] },
    { id: "field_serpent", weight: 0.7, loot: [{ itemId: "snake_fang", dropRate: 0.12 }] },
    { id: "stalk_scavenger", weight: 0.8, loot: [{ itemId: "stalk_husk", dropRate: 0.35, minQty: 1, maxQty: 3 }, { itemId: "gnawer_incisor", dropRate: 0.06 }] }
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0.05, mobWeightModifiers: { cornreaper: 0 } },
    { id: "fenceline", name: "Fenceline", discovered: false, discoveryChance: 0.04, mobWeightModifiers: { cornfield_raider: 1.1, field_gnawer: 1.0, cornreaper: 0 } },
    { id: "deep_rows", name: "Deep Rows", discovered: false, discoveryChance: 0.03, mobWeightModifiers: { cornfield_raider: 1.3, field_gnawer: 0.8, cornreaper: 300 } }
  ]
};
