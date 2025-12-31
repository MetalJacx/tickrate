export default {
  key: "wizard",
  name: "Wizard",
  symbol: "🔥",
  role: "DPS",
  cost: 60,
  primaryStat: "int",
  baseMana: 0,
  
  resourceType: "mana",
  maxMana: 120,
  manaRegenPerTick: 6,

  baseHP: 40,
  baseDamage: 18,
  baseDPS: 18,
  baseHealing: 1,

  stats: {
    str: 6,
    con: 7,
    dex: 10,
    agi: 9,
    ac: 10,
    wis: 8,
    int: 12,
    cha: 9
  },

  skills: [
    { key: "fireball", name: "Fireball", level: 1, type: "damage", damageType: "fire", minDamage: 12, maxDamage: 18, cost: 30, cooldownSeconds: 5 },
    { key: "meteor", name: "Meteor", level: 4, type: "damage", damageType: "fire", minDamage: 30, maxDamage: 40, cost: 50, cooldownSeconds: 12 },
    { key: "arcane_shield", name: "Arcane Shield", level: 6, type: "heal", amount: 12, cost: 25, cooldownSeconds: 8 }
  ]
};
