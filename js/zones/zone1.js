export default {
  zoneNumber: 1,
  name: "Graveyard",
  description: "A forgotten burial ground",
  aggroChance: 0.05, // chance per tick for an extra add
  enemies: [
    { name: "Decaying Skeleton", baseHP: 30, baseDPS: 3 },
    { name: "Gnoll Scout", baseHP: 35, baseDPS: 4 },
    { name: "Young Orc", baseHP: 40, baseDPS: 4 },
    { name: "Rabid Wolf", baseHP: 35, baseDPS: 5 }
  ]
};
