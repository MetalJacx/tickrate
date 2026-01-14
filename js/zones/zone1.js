export default {
  zoneNumber: 1,
  id: "graveyard",
  name: "Graveyard",
  levelRange: [1, 4],
  description: "A forgotten burial ground",
  copperReward: { min: 8, max: 12 },
  aggroChance: 0.01,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.15, minQty: 1, maxQty: 3 },
    { itemId: "health_potion_small", dropRate: 0.05, minQty: 1, maxQty: 2 },
    { itemId: "stick", dropRate: 0.02 }
  ],
  global: {},
  enemies: [
    { id: "skeleton", weight: 1.0, loot: [{ itemId: "rusty_dagger", dropRate: 0.08 }] },
    { id: "gnoll_scout", weight: 1.0, loot: [{ itemId: "health_potion_small", dropRate: 0.06 }] },
    { id: "young_orc", weight: 1.0, loot: [{ itemId: "stick", dropRate: 0.04 }] },
    { id: "rabid_wolf", weight: 1.0, loot: [{ itemId: "health_potion_small", dropRate: 0.05 }] },
    { id: "phantom", weight: 0, rare: true, loot: [{ itemId: "enchanted_branch", dropRate: 0.12 }] },
    { id: "groundskeeper", weight: 0.002, loot: [{ itemId: "groundskeeper_haft", dropRate: 0.22 }, { itemId: "gravebinder_wraps", dropRate: 0.20 }] },
    { id: "bone_mite", weight: 0.8, loot: [{ itemId: "bone_shard", dropRate: 0.30, minQty: 1, maxQty: 2 }] },
    { id: "grave_wisp", weight: 0.5, loot: [{ itemId: "grave_dust", dropRate: 0.25, minQty: 1, maxQty: 2 }] }
  ],
  subAreas: [
    {
      id: "open_world",
      name: "Open World",
      discovered: true,
      discoveryChance: 0,
      mobWeightModifiers: { groundskeeper: 0 }
    },
    {
      id: "open_graves",
      name: "Open Graves",
      discovered: false,
      discoveryChance: 0.05,
      mobWeightModifiers: {
        young_orc: 1.2,
        rabid_wolf: 0.8,
        skeleton: 1.0,
        gnoll_scout: 1.0,
        phantom: 0,
        groundskeeper: 0
      }
    },
    {
      id: "unknown_tomb",
      name: "Unknown Tomb",
      discovered: false,
      discoveryChance: 0.05,
      mobWeightModifiers: {
        skeleton: 2.0,
        gnoll_scout: 1.1,
        young_orc: 0.9,
        rabid_wolf: 0.8,
        phantom: 0.15,
        groundskeeper: 250
      }
    }
  ]
};
