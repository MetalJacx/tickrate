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
      level: 1,
      type: "damage",
      damageType: "fire",
      minDamage: 12,
      maxDamage: 20,
      cost: 10,
      cooldownTicks: 6,
      description: "Starter nuke. Damage scales +1 max per 2 levels, capping at level 10 (12–25)."
    },
    {
      key: "gather_mana",
      name: "Gather Mana",
      level: 3,
      type: "utility",
      cost: 0,
      cooldownTicks: 24,
      manaRestoration: null, // Calculated as floor(level * 1.5) in handler
      description: "Restore mana out of combat. Restores floor(Level × 1.5) mana, capping at level 12 (18 max)."
    },
    {
      key: "iceblast",
      name: "Iceblast",
      level: 7,
      type: "damage",
      damageType: "frost",
      minDamage: 18,
      maxDamage: 30,
      cost: 18,
      cooldownTicks: 8,
      description: "Higher burst nuke. Damage scales +1 max per 2 levels, capping at level 18 (18–39)."
    },
    {
      key: "rain_of_fire",
      name: "Rain of Fire",
      level: 8,
      type: "damage",
      damageType: "fire",
      minDamage: 10,
      maxDamage: 16,
      cost: 30,
      cooldownTicks: 16,
      cleaveTargets: 99, // Affects all targets
      aoeDiminishing: true, // Flag for AOE diminishing logic
      description: "AOE nuke. Full damage to first 3 targets, then -20% per additional target (min 40%)."
    },
    {
      key: "arcane_shield",
      name: "Arcane Shield",
      level: 10,
      type: "buff",
      buffType: "arcane_shield",
      cost: 25,
      cooldownTicks: 30,
      tempHP: 50,
      castLockoutTicks: 1,
      description: "Grant self 50 Temp HP. Cannot cast offensive spells for 1 tick after."
    }
  ]
};
