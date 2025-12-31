export default {
  zoneNumber: 1,
  name: "Graveyard",
  description: "A forgotten burial ground",
  aggroChance: 0.01,
  global: {
    baseHP: 35,
    baseDPS: 4,
    xp: 75
  },
  enemies: [
    { name: "Decaying Skeleton", baseHP: 30, baseDPS: 3, xp: 75 },
    { name: "Gnoll Scout", baseHP: 35, baseDPS: 4, xp: 75 },
    { name: "Young Orc", baseHP: 40, baseDPS: 4, xp: 75 },
    { name: "Rabid Wolf", baseHP: 35, baseDPS: 5, xp: 75 }
  ]
};
