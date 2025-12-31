export default {
  key: "warrior",
  name: "Warrior",
  symbol: "🛡️",
  role: "Tank",
  cost: 50,
  primaryStat: null,
  baseMana: 0,
  
  resourceType: "endurance",
  maxEndurance: 100,
  enduranceRegenPerTick: 5,

  baseHP: 120,
  baseDamage: 8,
  baseDPS: 8,
  baseHealing: 2,

  stats: {
    str: 14,
    con: 12,
    dex: 10,
    agi: 9,
    ac: 22,
    wis: 6,
    int: 6,
    cha: 8
  },

  skills: [
    { key: "slash", name: "Slash", level: 1, type: "damage", damageType: "physical", minDamage: 4, maxDamage: 6, cost: 15, cooldownSeconds: 4 },
    { key: "shield_bash", name: "Shield Bash", level: 3, type: "damage", damageType: "physical", minDamage: 10, maxDamage: 14, cost: 25, cooldownSeconds: 8 },
    { key: "fortify", name: "Fortify", level: 5, type: "heal", amount: 10, cost: 20, cooldownSeconds: 10 }
  ]
};
