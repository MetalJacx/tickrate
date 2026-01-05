export default {
  key: "ranger",
  name: "Ranger",
  symbol: "🏹",
  role: "DPS",
  cost: 45,
  primaryStat: "wis",
  baseMana: 0,
  
  resourceType: ["mana", "endurance"],
  maxMana: 80,
  manaRegenPerTick: 3,
  maxEndurance: 80,
  enduranceRegenPerTick: 3,

  baseHP: 60,
  baseDamage: 14,
  baseDPS: 14,
  baseHealing: 3,

  stats: {
    str: 12,
    con: 10,
    dex: 13,
    agi: 12,
    ac: 14,
    wis: 8,
    int: 8,
    cha: 9
  },

  skills: [
    {
      key: "shot",
      name: "Shot",
      kind: "ability",
      level: 1,
      type: "damage",
      damageType: "physical",
      minDamage: 2,
      maxDamage: 2,
      cost: 1,
      costType: "endurance",
      cooldownTicks: 1,
      description: "Ranged bow attack. Damage scales to 5 at level 8."
    },
    {
      key: "flame_lick",
      name: "Flame Lick",
      kind: "spell",
      level: 3,
      type: "debuff",
      debuffType: "flame_lick"
    },
    {
      key: "salve",
      name: "Salve",
      kind: "ability",
      level: 5,
      type: "heal",
      minAmount: 5,
      maxAmount: 9,
      cost: 8,
      costType: "endurance",
      cooldownTicks: 5,
      description: "Minor healing ability targeting the most injured ally."
    },
    {
      key: "woodskin",
      name: "WoodSkin",
      kind: "ability",
      level: 8,
      type: "buff",
      buffType: "woodskin",
      acBonus: 3, // Scales to 7 at level 18
      conBonus: 2,
      cost: 10,
      costType: "mana",
      cooldownTicks: 1,
      targetMode: "individual",
      description: "Defensive barkskin buff. Single target (self or ally). Duration: 3 min @ L8 → 25 min @ L18."
    },
    {
      key: "hawk_eye",
      name: "Hawk Eye",
      kind: "ability",
      level: 10,
      type: "buff",
      buffType: "hawk_eye",
      hitChanceBonus: 2, // +2% to hit
      cost: 45,
      costType: "mana",
      cooldownTicks: 1,
      targetMode: "self",
      description: "Improves ranged accuracy. Self-only. Duration: 33.3 min @ L11 → 70 min @ L24."
    }
  ]
};
