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
      description: "Ranged bow attack. Mechanics live in actions.js."
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
      description: "Minor healing ability targeting the most injured ally. Mechanics live in actions.js."
    },
    {
      key: "woodskin",
      name: "WoodSkin",
      kind: "ability",
      level: 8,
      type: "buff",
      buffType: "woodskin",
      targetMode: "individual",
      description: "Defensive barkskin buff. Single target. Mechanics live in actions.js."
    },
    {
      key: "hawk_eye",
      name: "Hawk Eye",
      kind: "ability",
      level: 10,
      type: "buff",
      buffType: "hawk_eye",
      targetMode: "self",
      description: "Improves ranged accuracy. Mechanics live in actions.js."
    }
  ]
};
