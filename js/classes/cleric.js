export default {
  key: "cleric",
  name: "Cleric",
  symbol: "✨",
  role: "Healer",
  cost: 55,
  primaryStat: "wis",
  baseMana: 0,
  
  resourceType: "mana",
  maxMana: 130,
  manaRegenPerTick: 7,

  baseHP: 70,
  baseDamage: 6,
  baseDPS: 6,
  baseHealing: 16,

  stats: {
    str: 8,
    con: 9,
    dex: 9,
    agi: 8,
    ac: 12,
    wis: 13,
    int: 8,
    cha: 10
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
    { key: "heal", name: "Heal", level: 1, type: "heal", amount: 18, cost: 5, cooldownSeconds: 4 },
    { key: "prayer", name: "Prayer of Protection", level: 3, type: "heal", amount: 35, cost: 10, cooldownSeconds: 10 },
    { key: "smite", name: "Smite", level: 5, type: "damage", damageType: "holy", minDamage: 6, maxDamage: 10, cost: 25, cooldownSeconds: 6 },
    { key: "resurrection", name: "Resurrection", level: 10, type: "resurrect", cost: 60, cooldownSeconds: 30 }
  ]
};
