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
  global: {
    baseHP: 35,
    baseDPS: 4,
    xp: 75
  },
  enemies: [
    { id: "skeleton", name: "Decaying Skeleton", baseHP: 30, baseDPS: 3, xp: 75, weight: 1.0, loot: [{ itemId: "rusty_dagger", dropRate: 0.08 }] },
    { id: "gnoll_scout", name: "Gnoll Scout", baseHP: 35, baseDPS: 4, xp: 75, weight: 1.0, loot: [{ itemId: "health_potion_small", dropRate: 0.06 }] },
    { id: "young_orc", name: "Young Orc", baseHP: 40, baseDPS: 4, xp: 75, weight: 1.0, loot: [{ itemId: "stick", dropRate: 0.04 }] },
    { id: "rabid_wolf", name: "Rabid Wolf", baseHP: 35, baseDPS: 5, xp: 75, weight: 1.0, loot: [{ itemId: "health_potion_small", dropRate: 0.05 }] },
    { id: "phantom", name: "Phantom", baseHP: 25, baseDPS: 6, xp: 150, weight: 0, rare: true, loot: [{ itemId: "enchanted_branch", dropRate: 0.12 }] }
  ],
  subAreas: [
    {
      id: "open_world",
      name: "Open World",
      discovered: true,
      discoveryChance: 0,
      mobWeightModifiers: {}
    },
    {
      id: "open_graves",
      name: "Open Graves",
      discovered: false,
      discoveryChance: 0,
      mobWeightModifiers: {
        young_orc: 1.2,
        rabid_wolf: 0.8,
        skeleton: 1.0,
        gnoll_scout: 1.0,
        phantom: 0
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
        phantom: 0.15
      }
    }
  ]
};
