export default {
  zoneNumber: 2,
  name: "Dark Forest",
  description: "An eerie woodland",
  aggroChance: 0.05,
  global: {
    baseHP: 45,
    baseDPS: 5,
    xp: 17
  },
  enemies: [
    { name: "Forest Ghoul", baseHP: 40, baseDPS: 4, xp: 16 },
    {
      name: "Shadow Sprite",
      baseHP: 35,
      baseDPS: 5,
      xp: 17,
      debuffs: [
        { type: "weaken_damage", amount: 1, durationTicks: 5, chance: 0.25 }
      ]
    },
    { name: "Cursed Treant", baseHP: 50, baseDPS: 3, xp: 18 },
    {
      name: "Werewolf",
      baseHP: 45,
      baseDPS: 6,
      xp: 19,
      debuffs: [
        { type: "weaken_damage", amount: 1, durationTicks: 5, chance: 0.25 }
      ]
    }
  ]
};
