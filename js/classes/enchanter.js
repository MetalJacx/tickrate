export default {
  key: "enchanter",
  name: "Enchanter",
  symbol: "🌀",
  role: "Support",
  cost: 65,
  
  resourceType: "mana",
  maxMana: 110,
  manaRegenPerTick: 6,

  baseHP: 50,
  baseDPS: 10,
  baseHealing: 8,

  skills: [
    { key: "hex", name: "Hex", level: 1, type: "damage", damageType: "arcane", minDamage: 7, maxDamage: 11, cost: 20, cooldownSeconds: 5 },
    { key: "drain", name: "Drain", level: 3, type: "damage", damageType: "shadow", minDamage: 9, maxDamage: 13, cost: 25, cooldownSeconds: 6 },
    { key: "enhance", name: "Enhance", level: 5, type: "heal", amount: 15, cost: 30, cooldownSeconds: 8 }
  ]
};
