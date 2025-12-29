export default {
  key: "warrior",
  name: "Warrior",
  role: "Tank",
  cost: 50,

  baseHP: 120,
  baseDPS: 8,
  baseHealing: 2,

  skills: [
    { key: "slash", name: "Slash", level: 1, type: "damage", damageType: "physical", amount: 5, cooldownSeconds: 4 },
    { key: "shield_bash", name: "Shield Bash", level: 3, type: "damage", damageType: "physical", amount: 12, cooldownSeconds: 8 },
    { key: "fortify", name: "Fortify", level: 5, type: "heal", amount: 10, cooldownSeconds: 10 }
  ]
};
