export default {
  key: "ranger",
  name: "Ranger",
  symbol: "🏹",
  role: "DPS",
  cost: 45,
  primaryStat: "wis",
  baseMana: 0,
  
  resourceType: ["mana", "endurance"],
  maxMana: 80,
  manaRegenPerTick: 3,
  maxEndurance: 80,
  enduranceRegenPerTick: 3,

  baseHP: 60,
  baseDamage: 14,
  baseDPS: 14,
  baseHealing: 3,

  stats: {
    str: 12,
    con: 10,
    dex: 13,
    agi: 12,
    ac: 14,
    wis: 8,
    int: 8,
    cha: 9
  },

  skills: [
    { key: "shot", name: "Shot", level: 1, type: "damage", damageType: "physical", minDamage: 8, maxDamage: 12, cost: 10, costType: "endurance", cooldownTicks: 3 },
    { key: "multishot", name: "Multishot", level: 4, type: "damage", damageType: "physical", minDamage: 18, maxDamage: 24, cost: 25, costType: "endurance", cooldownTicks: 8 },
    { key: "mend", name: "Mend Wounds", level: 6, type: "heal", amount: 14, cost: 20, costType: "mana", cooldownTicks: 7 }
  ]
};
