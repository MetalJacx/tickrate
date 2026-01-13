export default {
  zoneNumber: 4,
  id: "rolling_hills",
  name: "Rolling Hills",
  levelRange: [6, 8],
  description: "Rocky hills with ruin camps and dangerous patrols.",
  requirements: {
    killsIn: { zoneId: "mundane_plains", count: 300 }
  },
  copperReward: { min: 26, max: 44 },
  aggroChance: 0.03,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.22, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.07, minQty: 1, maxQty: 2 },
    { itemId: "rusty_spear", dropRate: 0.06 },
    { itemId: "cloth_leggings", dropRate: 0.10 }
  ],
  global: {},
  enemies: [
    { id: "hill_skirmisher", weight: 1.0, loot: [{ itemId: "rusty_spear", dropRate: 0.05 }] },
    { id: "dark_wolf", weight: 0.9, loot: [{ itemId: "health_potion_small", dropRate: 0.06 }] },
    { id: "captain_arvok", weight: 0.0015, loot: [{ itemId: "hill_captains_blade", dropRate: 0.35 }, { itemId: "ridgewatch_vest", dropRate: 0.25 }] }
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: { captain_arvok: 0 } },
    { id: "ridgewatch", name: "Ridgewatch Slopes", discovered: false, discoveryChance: 0, mobWeightModifiers: { hill_skirmisher: 1.2, dark_wolf: 0.9, captain_arvok: 0 } },
    { id: "stonewatch_ruins", name: "Stonewatch Ruins", discovered: false, discoveryChance: 0.03, mobWeightModifiers: { hill_skirmisher: 1.3, dark_wolf: 0.8, captain_arvok: 300 } }
  ]
};
