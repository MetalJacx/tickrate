export default {
  zoneNumber: 3,
  id: "ruined_castle",
  name: "Ruined Castle",
  levelRange: [3, 6],
  description: "An ancient stronghold in decay",
  aggroChance: 0.05, 
  global: {
    baseHP: 55,
    baseDPS: 7,
    xp: 22
  },
  enemies: [
    { id: "skeletal_knight", name: "Skeletal Knight", baseHP: 55, baseDPS: 6, xp: 75, weight: 1.0 },
    { id: "orc_centurion", name: "Orc Centurion", baseHP: 60, baseDPS: 7, xp: 75, weight: 1.0 },
    { id: "dark_wolf", name: "Dark Wolf", baseHP: 50, baseDPS: 7, xp: 75, weight: 1.0 },
    { id: "bloodsaber_acolyte", name: "Bloodsaber Acolyte", baseHP: 45, baseDPS: 8, xp: 75, weight: 1.0 }
  ],
  subAreas: [
    {
      id: "outer_keep",
      name: "Outer Keep",
      discovered: true,
      discoveryChance: 0,
      mobWeightModifiers: {
        skeletal_knight: 1.1,
        orc_centurion: 1.1,
        dark_wolf: 0.9,
        bloodsaber_acolyte: 0.9
      }
    },
    {
      id: "unknown_tomb",
      name: "Unknown Tomb",
      discovered: false,
      discoveryChance: 0.03,
      mobWeightModifiers: {
        skeletal_knight: 1.8,
        bloodsaber_acolyte: 1.2,
        dark_wolf: 0.8,
        orc_centurion: 0.9
      }
    },
    {
      id: "forgotten_halls",
      name: "Forgotten Halls",
      discovered: false,
      discoveryChance: 0.025,
      mobWeightModifiers: {
        dark_wolf: 1.4,
        skeletal_knight: 1.0,
        bloodsaber_acolyte: 1.1,
        orc_centurion: 0.9
      }
    },
    {
      id: "deep_crypts",
      name: "Deep Crypts",
      discovered: false,
      discoveryChance: 0.02,
      mobWeightModifiers: {
        bloodsaber_acolyte: 1.6,
        skeletal_knight: 1.2,
        dark_wolf: 0.8,
        orc_centurion: 0.9
      }
    }
  ]
};
