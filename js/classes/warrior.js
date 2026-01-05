export default {
  key: "warrior",
  name: "Warrior",
  symbol: "🛡️",
  role: "Tank",
  cost: 50,
  primaryStat: null,
  baseMana: 0,
  
  resourceType: "endurance",
  maxEndurance: 100,
  enduranceRegenPerTick: 5,

  baseHP: 120,
  baseDamage: 8,
  baseDPS: 8,
  baseHealing: 2,

  stats: {
    str: 14,
    con: 12,
    dex: 10,
    agi: 9,
    ac: 22,
    wis: 6,
    int: 6,
    cha: 8
  },

  passives: [
    {
      key: "double_attack",
      name: "Double Attack",
      level: 5,
      description: "Unlocks at level 5 and increases over time, granting a chance for an extra melee swing."
    }
  ],

  skills: [
    { key: "kick", name: "Kick", kind: "ability", level: 1, type: "damage", damageType: "physical" },
    { key: "shield_bash", name: "Shield Bash", kind: "ability", level: 3, type: "damage", damageType: "physical" },
    {
      key: "taunt",
      name: "Taunt",
      kind: "ability",
      level: 3,
      type: "debuff",
      debuff: "taunt",
      description: "Forces the main target to attack the Warrior. Mechanics live in actions.js."
    },
    {
      key: "fortify",
      name: "Fortify",
      kind: "ability",
      level: 8,
      type: "buff",
      buffType: "fortify",
      description: "Increases AC. Mechanics live in actions.js."
    },
    { key: "cleave", name: "Cleave", kind: "ability", level: 10, type: "damage", damageType: "physical", usesBaseDamage: true, cleaveTargets: 3 }
  ]
};
