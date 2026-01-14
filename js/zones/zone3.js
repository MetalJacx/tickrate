export default {
  zoneNumber: 3,
  id: "shatterbone_keep",
  name: "Shatterbone Keep",
  levelRange: [4, 9],
  description: "A brutal orc-held stronghold built for war and raiding.",
  requirements: {
    killsIn: { zoneId: "mundane_plains", count: 100 }
  },
  copperReward: { min: 22, max: 38 },
  aggroChance: 0.05,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.25, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.07, minQty: 1, maxQty: 2 },
    { itemId: "rusty_spear", dropRate: 0.08 },
    { itemId: "rusty_mace", dropRate: 0.08 },
    { itemId: "cloth_leggings", dropRate: 0.10 },
    { itemId: "cloth_wraps", dropRate: 0.10 }
  ],
  global: {},
  enemies: [
    { id: "shatterbone_scout", weight: 1.2, loot: [{ itemId: "rusty_short_sword", dropRate: 0.06 }] },
    { id: "shatterbone_legionary", weight: 1.0, loot: [{ itemId: "rusty_spear", dropRate: 0.05 }] },
    { id: "shatterbone_brute", weight: 0.8, loot: [{ itemId: "rusty_mace", dropRate: 0.06 }] },
    { id: "warlord_grask", weight: 0.023, loot: [{ itemId: "shatterbone_warhelm", dropRate: 0.30 }, { itemId: "orcish_cleaver_heavy", dropRate: 0.20 }, { itemId: "grask_totem", dropRate: 0.25 }] },
    { id: "shatterbone_archer", weight: 0.9, loot: [{ itemId: "orc_tooth", dropRate: 0.25, minQty: 1, maxQty: 2 }] },
    { id: "shatterbone_shaman", weight: 0.6, loot: [{ itemId: "crude_bone_charm", dropRate: 0.05 }, { itemId: "orc_tooth", dropRate: 0.20, minQty: 1, maxQty: 2 }] }
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: { warlord_grask: 0 } },
    {
      id: "outer_barricades",
      name: "Outer Barricades",
      discovered: false,
      discoveryChance: 0.05,
      mobWeightModifiers: { shatterbone_scout: 1.4, shatterbone_legionary: 0.9, shatterbone_brute: 0.7, warlord_grask: 0 }
    },
    {
      id: "war_yard",
      name: "War Yard",
      discovered: false,
      discoveryChance: 0.03,
      mobWeightModifiers: { shatterbone_legionary: 1.3, shatterbone_brute: 1.1, shatterbone_scout: 0.8, warlord_grask: 300 }
    }
  ]
};
