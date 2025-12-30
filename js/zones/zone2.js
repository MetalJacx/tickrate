export default {
  zoneNumber: 2,
  name: "Dark Forest",
  description: "An eerie woodland",
  aggroChance: 0.05,
  enemies: [
    { name: "Forest Ghoul", baseHP: 40, baseDPS: 4 },
    {
      name: "Shadow Sprite",
      baseHP: 35,
      baseDPS: 5,
      debuffs: [
        { type: "weaken_damage", amount: 1, durationTicks: 5, chance: 0.25 }
      ]
    },
    { name: "Cursed Treant", baseHP: 50, baseDPS: 3 },
    {
      name: "Werewolf",
      baseHP: 45,
      baseDPS: 6,
      debuffs: [
        { type: "weaken_damage", amount: 1, durationTicks: 5, chance: 0.25 }
      ]
    }
  ]
};
