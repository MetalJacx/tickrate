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
    { key: "kick", name: "Kick", level: 1, type: "damage", damageType: "physical", minDamage: 2, maxDamage: 7, cost: 5, cooldownTicks: 4 },
    { key: "shield_bash", name: "Shield Bash", level: 3, type: "damage", damageType: "physical", minDamage: 10, maxDamage: 14, cost: 12, cooldownTicks: 8 },
    {
      key: "taunt",
      name: "Taunt",
      level: 3,
      type: "debuff",
      debuff: "taunt",
      durationTicks: 3,
      costType: "endurance",
      cost: 1,
      cooldownSeconds: 10,
      description: "Forces the main target to attack the Warrior for 3 ticks."
    },
    {
      key: "fortify",
      name: "Fortify",
      level: 8,
      type: "buff",
      buffType: "fortify",
      costType: "endurance",
      cost: 15,
      cooldownSeconds: 12,
      description: "Increases AC by 10 at level 8. Bonus scales by +1 AC every 2 levels, reaching a maximum of +15 AC at level 18."
    },
    { key: "cleave", name: "Cleave", level: 10, type: "damage", damageType: "physical", usesBaseDamage: true, cleaveTargets: 3, cost: 25, cooldownTicks: 5 }
  ]
};
