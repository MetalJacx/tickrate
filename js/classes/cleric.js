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
      kind: "ability",
      level: 1, 
      type: "heal", 
      description: "Baseline heal. Mechanics live in actions.js."
    },
    { 
      key: "courage", 
      name: "Courage", 
      kind: "ability",
      level: 3, 
      type: "buff",
      buffType: "courage",
      targetMode: "individual", // Cast on one party member at a time
      notes: "Grants AC and HP bonus. Mechanics live in actions.js."
    },
    { 
      key: "fear", 
      name: "Fear", 
      kind: "spell",
      level: 8, 
      type: "debuff"
    },
    { 
      key: "divine_focus", 
      name: "Divine Focus", 
      kind: "ability",
      level: 7, 
      type: "buff",
      buffType: "divine_focus",
      description: "Self-only immunity window. Mechanics live in actions.js."
    },
    { 
      key: "healing", 
      name: "Healing", 
      kind: "ability",
      level: 10, 
      type: "heal", 
      description: "Big heal. Mechanics live in actions.js."
    }
  ]
};
