export default {
  zoneNumber: 2,
  id: "mundane_plains",
  name: "Mundane Plains",
  levelRange: [1, 3],
  description: "Wide open plains crossed by old trade roads and wandering threats.",
  copperReward: { min: 10, max: 18 },
  aggroChance: 0.02,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.20, minQty: 1, maxQty: 3 },
    { itemId: "health_potion_small", dropRate: 0.06, minQty: 1, maxQty: 2 },
    { itemId: "rusty_short_sword", dropRate: 0.10 },
    { itemId: "rusty_axe", dropRate: 0.08 },
    { itemId: "tattered_robe", dropRate: 0.10 },
    { itemId: "cloth_cap", dropRate: 0.10 }
  ],
  global: {},
  enemies: [
    { id: "plains_rat", weight: 1.1, loot: [{ itemId: "cloth_sandals", dropRate: 0.08 }] },
    { id: "plains_wolf", weight: 1.0, loot: [{ itemId: "health_potion_small", dropRate: 0.05 }] },
    { id: "plains_bandit", weight: 1.0, loot: [{ itemId: "rusty_short_sword", dropRate: 0.07 }] },
    { id: "field_brigand", weight: 0.9, loot: [{ itemId: "tattered_robe", dropRate: 0.08 }] }
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} },
    {
      id: "broken_trade_road",
      name: "Broken Trade Road",
      discovered: false,
      discoveryChance: 0,
      mobWeightModifiers: { plains_bandit: 1.2, plains_wolf: 0.9, plains_rat: 1.0, field_brigand: 0.8 }
    },
    {
      id: "windworn_fields",
      name: "Windworn Fields",
      discovered: false,
      discoveryChance: 0.04,
      mobWeightModifiers: { field_brigand: 1.3, plains_wolf: 1.0, plains_bandit: 1.0, plains_rat: 0.9 }
    }
  ]
};
