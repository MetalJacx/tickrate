export default {
  key: "wizard",
  name: "Wizard",
  symbol: "🧙",
  role: "Caster",
  cost: 50,
  primaryStat: "int",
  baseMana: 100,
  
  resourceType: "mana",
  maxMana: 100,
  manaRegenPerTick: 3,

  baseHP: 50,
  baseDamage: 3,
  baseDPS: 3,
  baseHealing: 1,

  stats: {
    str: 6,
    con: 8,
    dex: 10,
    agi: 11,
    ac: 14,
    wis: 9,
    int: 16,
    cha: 10
  },

  passives: [
    {
      key: "meditate",
      name: "Meditate",
      level: 5,
      description: "Out of combat only: regenerate mana progressively as skill increases. Max cap 252."
    }
  ],

  skills: [
    {
      key: "fireblast",
      name: "Fireblast",
      kind: "spell",
      level: 1,
      type: "damage",
      description: "Starter nuke. Mechanics live in actions.js."
    },
    {
      key: "gather_mana",
      name: "Gather Mana",
      kind: "ability",
      level: 3,
      type: "utility",
      description: "Restore mana out of combat. Mechanics live in actions.js."
    },
    {
      key: "iceblast",
      name: "Iceblast",
      kind: "spell",
      level: 7,
      type: "damage",
      description: "Higher burst nuke. Mechanics live in actions.js."
    },
    {
      key: "rain_of_fire",
      name: "Rain of Fire",
      kind: "ability",
      level: 8,
      type: "damage",
      description: "AOE nuke. Mechanics live in actions.js."
    },
    {
      key: "arcane_shield",
      name: "Arcane Shield",
      kind: "ability",
      level: 10,
      type: "buff",
      buffType: "arcane_shield",
      description: "Grant self temp HP; see actions.js for mechanics."
    }
  ]
};
