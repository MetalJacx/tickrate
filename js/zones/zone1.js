export default {
  zoneNumber: 1,
  id: "graveyard",
  name: "Graveyard",
  levelRange: [1, 4],
  description: "A forgotten burial ground",
  aggroChance: 0.01,
  global: {
    baseHP: 35,
    baseDPS: 4,
    xp: 75
  },
  enemies: [
    { id: "skeleton", name: "Decaying Skeleton", baseHP: 30, baseDPS: 3, xp: 75, weight: 1.0 },
    { id: "gnoll_scout", name: "Gnoll Scout", baseHP: 35, baseDPS: 4, xp: 75, weight: 1.0 },
    { id: "young_orc", name: "Young Orc", baseHP: 40, baseDPS: 4, xp: 75, weight: 1.0 },
    { id: "rabid_wolf", name: "Rabid Wolf", baseHP: 35, baseDPS: 5, xp: 75, weight: 1.0 }
  ],
  subAreas: [
    {
      id: "open_graves",
      name: "Open Graves",
      discovered: true,
      discoveryChance: 0,
      mobWeightModifiers: {
        young_orc: 1.2,
        rabid_wolf: 0.8,
        skeleton: 1.0,
        gnoll_scout: 1.0
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
        rabid_wolf: 0.8
      }
    }
  ]
};
