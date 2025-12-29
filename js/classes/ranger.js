export default {
  key: "ranger",
  name: "Ranger",
  role: "DPS",
  cost: 35,

  baseHP: 85,
  baseDPS: 10,
  baseHealing: 2,

  skills: [
    { key: "kick", name: "Kick", level: 1, type: "damage", amount: 6, cooldownSeconds: 6 },
    { key: "aimed_shot", name: "Aimed Shot", level: 4, type: "damage", amount: 16, cooldownSeconds: 10 },
    { key: "field_dress", name: "Field Dress", level: 6, type: "heal", amount: 8, cooldownSeconds: 12 }
  ]
};
