export default {
  zoneNumber: 3,
  name: "Ruined Castle",
  description: "An ancient stronghold in decay",
  aggroChance: 0.05, 
  global: {
    baseHP: 55,
    baseDPS: 7,
    xp: 22
  },
  enemies: [
    { name: "Skeletal Knight", baseHP: 55, baseDPS: 6, xp: 75 },
    { name: "Orc Centurion", baseHP: 60, baseDPS: 7, xp: 75 },
    { name: "Dark Wolf", baseHP: 50, baseDPS: 7, xp: 75 },
    { name: "Bloodsaber Acolyte", baseHP: 45, baseDPS: 8, xp: 75 }
  ]
};
