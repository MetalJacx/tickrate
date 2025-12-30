export default {
  key: "wizard",
  name: "Wizard",
  symbol: "🔥",
  role: "DPS",
  cost: 60,

  baseHP: 40,
  baseDPS: 18,
  baseHealing: 1,

  skills: [
    { key: "fireball", name: "Fireball", level: 1, type: "damage", damageType: "fire", amount: 15, cooldownSeconds: 5 },
    { key: "meteor", name: "Meteor", level: 4, type: "damage", damageType: "fire", amount: 35, cooldownSeconds: 12 },
    { key: "arcane_shield", name: "Arcane Shield", level: 6, type: "heal", amount: 12, cooldownSeconds: 8 }
  ]
};
