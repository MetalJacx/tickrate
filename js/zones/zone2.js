export default {
  zoneNumber: 2,
  id: "dark_forest",
  name: "Dark Forest",
  levelRange: [2, 5],
  description: "An eerie woodland",
  aggroChance: 0.05,
  global: {
    baseHP: 45,
    baseDPS: 5,
    xp: 17
  },
  enemies: [
    { id: "forest_ghoul", name: "Forest Ghoul", baseHP: 40, baseDPS: 4, xp: 16, weight: 1.0 },
    {
      id: "shadow_sprite",
      name: "Shadow Sprite",
      baseHP: 35,
      baseDPS: 5,
      xp: 17,
      debuffs: [
        { type: "weaken_damage", amount: 1, durationTicks: 5, chance: 0.25 }
      ],
      weight: 1.0
    },
    { id: "cursed_treant", name: "Cursed Treant", baseHP: 50, baseDPS: 3, xp: 18, weight: 1.0 },
    {
      id: "werewolf",
      name: "Werewolf",
      baseHP: 45,
      baseDPS: 6,
      xp: 19,
      debuffs: [
        { type: "weaken_damage", amount: 1, durationTicks: 5, chance: 0.25 }
      ],
      weight: 1.0
    },
    { id: "wood_spirit", name: "Wood Spirit", baseHP: 38, baseDPS: 7, xp: 180, weight: 0 }
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
      id: "forest_edge",
      name: "Forest Edge",
      discovered: false,
      discoveryChance: 0,
      mobWeightModifiers: {
        forest_ghoul: 1.2,
        shadow_sprite: 1.0,
        cursed_treant: 0.9,
        werewolf: 0.9,
        wood_spirit: 0
      }
    },
    {
      id: "shadowed_glen",
      name: "Shadowed Glen",
      discovered: false,
      discoveryChance: 0.04,
      mobWeightModifiers: {
        shadow_sprite: 1.5,
        forest_ghoul: 0.9,
        cursed_treant: 1.1,
        werewolf: 1.0,
        wood_spirit: 0.12
      }
    },
    {
      id: "blighted_thicket",
      name: "Blighted Thicket",
      discovered: false,
      discoveryChance: 0.03,
      mobWeightModifiers: {
        cursed_treant: 1.6,
        forest_ghoul: 1.0,
        shadow_sprite: 0.8,
        werewolf: 1.0,
        wood_spirit: 0.18
      }
    }
  ]
};
