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
      description: "Starter nuke. Mechanics live in spells.js."
    },
    {
      key: "gather_mana",
      name: "Gather Mana",
      kind: "ability",
      level: 3,
      type: "utility",
      cost: 0,
      cooldownTicks: 12,
      manaRestoration: null, // Calculated as floor(level * 1.5) in handler
      description: "Restore mana out of combat. Restores floor(Level × 1.5) mana, capping at level 12 (18 max)."
    },
    {
      key: "iceblast",
      name: "Iceblast",
      kind: "spell",
      level: 7,
      type: "damage",
      description: "Higher burst nuke. Mechanics live in spells.js."
    },
    {
      key: "rain_of_fire",
      name: "Rain of Fire",
      kind: "ability",
      level: 8,
      type: "damage",
      damageType: "fire",
      minDamage: 10,
      maxDamage: 16,
      cost: 30,
      cooldownTicks: 8,
      cleaveTargets: 99, // Affects all targets
      aoeDiminishing: true, // Flag for AOE diminishing logic
      description: "AOE nuke. Full damage to first 3 targets, then -20% per additional target (min 40%)."
    },
    {
      key: "arcane_shield",
      name: "Arcane Shield",
      kind: "ability",
      level: 10,
      type: "buff",
      buffType: "arcane_shield",
      cost: 25,
      cooldownTicks: 15,
      tempHP: 50,
      castLockoutTicks: 1,
      description: "Grant self 50 Temp HP. Cannot cast offensive spells for 1 tick after."
    }
  ]
};
