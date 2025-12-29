export default {
  key: "enchanter",
  name: "Enchanter",
  role: "Support",
  cost: 65,

  baseHP: 55,
  baseDPS: 10,
  baseHealing: 12,

  skills: [
    { key: "hex", name: "Hex", level: 1, type: "damage", damageType: "arcane", amount: 9, cooldownSeconds: 5 },
    { key: "drain", name: "Drain", level: 4, type: "damage", damageType: "shadow", amount: 14, cooldownSeconds: 7 },
    { key: "boost", name: "Boost Spirits", level: 6, type: "heal", amount: 20, cooldownSeconds: 8 }
  ]
};
