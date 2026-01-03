export default {
  key: "enchanter",
  name: "Enchanter",
  symbol: "🌀",
  role: "Support",
  cost: 65,
  primaryStat: "int",
  baseMana: 0,
  
  resourceType: "mana",
  maxMana: 110,
  manaRegenPerTick: 6,

  baseHP: 50,
  baseDamage: 10,
  baseDPS: 10,
  baseHealing: 8,

  stats: {
    str: 7,
    con: 8,
    dex: 11,
    agi: 11,
    ac: 11,
    wis: 9,
    int: 11,
    cha: 12
  },

  passives: [
    {
      key: "meditate",
      name: "Meditate",
      level: 5,
      description: "Unlocks at level 5 and increases mana regeneration out of combat. Skill grows from 0-252 as you meditate while recovering mana."
    }
  ],

  skills: [
    { key: "hex", name: "Hex", level: 1, type: "damage", damageType: "arcane", minDamage: 7, maxDamage: 11, cost: 20, cooldownSeconds: 5 },
    { key: "drain", name: "Drain", level: 3, type: "damage", damageType: "shadow", minDamage: 9, maxDamage: 13, cost: 25, cooldownSeconds: 6 },
    { key: "enhance", name: "Enhance", level: 5, type: "heal", amount: 15, cost: 30, cooldownSeconds: 8 }
  ]
};
