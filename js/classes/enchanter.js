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
    { key: "feedback", name: "Feedback", kind: "ability", level: 1, type: "damage", damageType: "magic", minDamage: 3, maxDamage: 8, cost: 7, cooldownTicks: 3, description: "Deal magic damage to a target with a 25% chance to stun for 1 tick." },
    { key: "mesmerize", name: "Mesmerize", kind: "spell", level: 3, type: "debuff" },
    { key: "suffocate", name: "Suffocate", kind: "ability", level: 8, type: "damage", damageType: "magic", minDamage: 13, maxDamage: 13, cost: 15, cooldownTicks: 6, description: "Deal magic damage and reduce target's STR and AGI by 2 for 6 ticks." },
    { key: "lesserRune", name: "Lesser Rune", kind: "ability", level: 10, type: "buff", buffType: "lesser_rune", cost: 25, cooldownTicks: 8, description: "Apply a single-hit damage absorption shield that absorbs 20 damage and breaks on any hit." }
  ]
};
