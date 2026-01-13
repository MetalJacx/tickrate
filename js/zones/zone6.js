export default {
  zoneNumber: 6,
  id: "hallowbone_castle",
  name: "Hallowbone Castle",
  levelRange: [9, 12],
  description: "An ancient fortress where bone rites fuel endless war.",
  requirements: {
    killsIn: { zoneId: "shatterbone_keep", count: 500 }
  },
  copperReward: { min: 45, max: 70 },
  aggroChance: 0.05,
  globalLoot: [
    { itemId: "health_potion", dropRate: 0.08, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.06, minQty: 1, maxQty: 2 }
  ],
  global: {},
  enemies: [
    { id: "hallowbone_warpriest", weight: 1.0, loot: [{ itemId: "enchanted_branch", dropRate: 0.06 }] },
    { id: "bone_king", weight: 0.0, rare: true, loot: [{ itemId: "bonekings_talisman", dropRate: 0.50 }, { itemId: "ritual_robes", dropRate: 0.30 }] }
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0.03, mobWeightModifiers: { bone_king: 0 } },
    { id: "lower_halls", name: "Lower Halls", discovered: false, discoveryChance: 0.02, mobWeightModifiers: { hallowbone_warpriest: 1.2, bone_king: 0 } },
    { id: "throne_of_bone", name: "Throne of Bone", discovered: false, discoveryChance: 0.01, mobWeightModifiers: { hallowbone_warpriest: 1.0, bone_king: 0.25 } }
  ]
};
