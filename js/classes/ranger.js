export default {
  key: "ranger",
  name: "Ranger",
  symbol: "🏹",
  role: "DPS",
  cost: 45,
  
  resourceType: ["mana", "endurance"],
  maxMana: 80,
  manaRegenPerTick: 3,
  maxEndurance: 80,
  enduranceRegenPerTick: 3,

  baseHP: 60,
  baseDPS: 14,
  baseHealing: 3,

  skills: [
    { key: "shot", name: "Shot", level: 1, type: "damage", damageType: "physical", minDamage: 8, maxDamage: 12, cost: 10, costType: "endurance", cooldownSeconds: 3 },
    { key: "multishot", name: "Multishot", level: 4, type: "damage", damageType: "physical", minDamage: 18, maxDamage: 24, cost: 25, costType: "endurance", cooldownSeconds: 8 },
    { key: "mend", name: "Mend Wounds", level: 6, type: "heal", amount: 14, cost: 20, costType: "mana", cooldownSeconds: 7 }
  ]
};
