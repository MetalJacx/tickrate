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
    { itemId: "mana_potion", dropRate: 0.03, minQty: 1, maxQty: 1 },
    { itemId: "health_potion", dropRate: 0.03, minQty: 1, maxQty: 1 },
    { itemId: "rusty_spear", dropRate: 0.06 },
    { itemId: "cloth_leggings", dropRate: 0.10 }
  ],
  global: {},
  enemies: [
    { id: "hill_skirmisher", weight: 1.0, loot: [{ itemId: "rusty_spear", dropRate: 0.05 }] },
    { id: "dark_wolf", weight: 0.9, loot: [{ itemId: "health_potion_small", dropRate: 0.06 }] },
    { id: "stone_hurler", weight: 0.13, loot: [{ itemId: "stone_hurler_sling", dropRate: 0.24 }] },
    { id: "ridgewatch_commander", weight: 0.092, loot: [{ itemId: "ridgewatch_banner", dropRate: 0.19 }, { itemId: "commander_insignia", dropRate: 0.17 }] },
    { id: "captain_arvok", weight: 0.034, loot: [{ itemId: "hill_captains_blade", dropRate: 0.35 }, { itemId: "ridgewatch_vest", dropRate: 0.25 }, { itemId: "arvok_signet", dropRate: 0.28 }] },
    { id: "ancient_earthshaker", weight: 0.023, loot: [{ itemId: "earthshaker_hammer", dropRate: 0.18 }, { itemId: "earthshaker_girdle", dropRate: 0.16 }, { itemId: "stone_ward_amulet", dropRate: 0.14 }] },
    { id: "ridge_bandit", weight: 0.8, loot: [{ itemId: "ridge_stone", dropRate: 0.12, minQty: 1, maxQty: 2 }] },
    { id: "rock_scrabbler", weight: 0.7, loot: [{ itemId: "ridge_stone", dropRate: 0.25, minQty: 1, maxQty: 3 }] }
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0.05, mobWeightModifiers: { captain_arvok: 0, stone_hurler: 0, ridgewatch_commander: 0, ancient_earthshaker: 0 } },
    { 
      id: "ridgewatch", 
      name: "Ridgewatch Slopes", 
      discovered: false, 
      discoveryChance: 0.04, 
      mobWeightModifiers: { 
        hill_skirmisher: 1.2, 
        dark_wolf: 0.9, 
        captain_arvok: 0,
        stone_hurler: 280,
        ridgewatch_commander: 270,
        ancient_earthshaker: 0
      } 
    },
    { 
      id: "stonewatch_ruins", 
      name: "Stonewatch Ruins", 
      discovered: false, 
      discoveryChance: 0.03, 
      mobWeightModifiers: { 
        hill_skirmisher: 1.3, 
        dark_wolf: 0.8, 
        captain_arvok: 300,
        stone_hurler: 0,
        ridgewatch_commander: 0,
        ancient_earthshaker: 290
      } 
    }
  ]
};
