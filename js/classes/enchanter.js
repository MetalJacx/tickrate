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
    { key: "feedback", name: "Feedback", kind: "ability", level: 1, type: "damage", description: "Magic strike with stun chance. Mechanics live in actions.js." },
    { key: "mesmerize", name: "Mesmerize", kind: "spell", level: 3, type: "debuff" },
    { key: "suffocate", name: "Suffocate", kind: "ability", level: 8, type: "damage", description: "Magic damage plus stat debuff. Mechanics live in actions.js." },
    { key: "lesser_rune", name: "Lesser Rune", kind: "ability", level: 10, type: "buff", buffType: "lesser_rune", description: "Single-hit absorb shield. Mechanics live in actions.js." }
  ]
};
