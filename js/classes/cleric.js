export default {
  key: "cleric",
  name: "Cleric",
  symbol: "✨",
  role: "Healer",
  cost: 55,

  baseHP: 70,
  baseDPS: 6,
  baseHealing: 16,

  skills: [
    { key: "heal", name: "Heal", level: 1, type: "heal", amount: 18, cooldownSeconds: 4 },
    { key: "prayer", name: "Prayer of Protection", level: 3, type: "heal", amount: 35, cooldownSeconds: 10 },
    { key: "smite", name: "Smite", level: 5, type: "damage", damageType: "holy", amount: 8, cooldownSeconds: 6 },
    { key: "resurrection", name: "Resurrection", level: 10, type: "resurrect", cooldownSeconds: 30 }
  ]
};
