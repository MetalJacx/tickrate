export default {
  key: "warrior",
  name: "Warrior",
  symbol: "🛡️",
  role: "Tank",
  cost: 50,
  
  resourceType: "endurance",
  maxEndurance: 100,
  enduranceRegenPerTick: 5,

  baseHP: 120,
  baseDPS: 8,
  baseHealing: 2,

  skills: [
    { key: "slash", name: "Slash", level: 1, type: "damage", damageType: "physical", minDamage: 4, maxDamage: 6, cost: 15, cooldownSeconds: 4 },
    { key: "shield_bash", name: "Shield Bash", level: 3, type: "damage", damageType: "physical", minDamage: 10, maxDamage: 14, cost: 25, cooldownSeconds: 8 },
    { key: "fortify", name: "Fortify", level: 5, type: "heal", amount: 10, cost: 20, cooldownSeconds: 10 }
  ]
};
