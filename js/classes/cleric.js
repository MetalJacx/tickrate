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
    { 
      key: "minor_heal", 
      name: "Minor Heal", 
      level: 1, 
      type: "heal", 
      minAmount: 10,
      maxAmount: 20, 
      cost: 10, 
      cooldownSeconds: 24 // 4 ticks × 6 seconds
    },
    { 
      key: "courage", 
      name: "Courage", 
      level: 3, 
      type: "buff",
      buffType: "courage",
      cost: 12, 
      cooldownSeconds: 6, // Minimum 1-tick cooldown to prevent spam; cast cycle manages who gets buffed
      targetMode: "individual", // Cast on one party member at a time
      notes: "Grants AC and HP bonus. Long-duration buff. Scales with cleric level."
    },
    { 
      key: "fear", 
      name: "Fear", 
      level: 8, 
      type: "debuff",
      debuffType: "fear",
      cost: 40, 
      cooldownSeconds: 42 // 7 ticks × 6 seconds
    },
    { 
      key: "healing", 
      name: "Healing", 
      level: 10, 
      type: "heal", 
      minAmount: 95,
      maxAmount: 175, 
      cost: 65, 
      cooldownSeconds: 72 // 12 ticks × 6 seconds
    }
  ]
};
