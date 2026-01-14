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
    { id: "ritual_keeper", weight: 0.13, loot: [{ itemId: "ritual_dagger", dropRate: 0.23 }] },
    { id: "bone_adjutant", weight: 0.13, loot: [{ itemId: "adjutant_armor", dropRate: 0.24 }] },
    { id: "high_sigil_master", weight: 0.092, loot: [{ itemId: "sigil_orb", dropRate: 0.18 }, { itemId: "sigil_tome", dropRate: 0.16 }] },
    { id: "deathknight_maloth", weight: 0.092, loot: [{ itemId: "maloth_sword", dropRate: 0.19 }, { itemId: "deathknight_plate", dropRate: 0.17 }] },
    { id: "bone_king", weight: 0.013, loot: [{ itemId: "bonekings_talisman", dropRate: 0.50 }, { itemId: "ritual_robes", dropRate: 0.30 }, { itemId: "malzors_scepter", dropRate: 0.40 }, { itemId: "crown_of_bone", dropRate: 0.35 }] },
    { id: "bone_sentinel", weight: 0.8, loot: [{ itemId: "ritual_bone_fragment", dropRate: 0.30, minQty: 1, maxQty: 2 }] },
    { id: "sigil_cultist", weight: 0.7, loot: [{ itemId: "sigil_scrap", dropRate: 0.20, minQty: 1, maxQty: 2 }, { itemId: "mana_potion", dropRate: 0.05 }] }
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0.03, mobWeightModifiers: { bone_king: 0, ritual_keeper: 0, bone_adjutant: 0, high_sigil_master: 0, deathknight_maloth: 0 } },
    { 
      id: "lower_halls", 
      name: "Lower Halls", 
      discovered: false, 
      discoveryChance: 0.02, 
      mobWeightModifiers: { 
        hallowbone_warpriest: 1.2, 
        bone_king: 0,
        ritual_keeper: 280,
        bone_adjutant: 270,
        high_sigil_master: 0,
        deathknight_maloth: 0
      } 
    },
    { 
      id: "throne_of_bone", 
      name: "Throne of Bone", 
      discovered: false, 
      discoveryChance: 0.01, 
      mobWeightModifiers: { 
        hallowbone_warpriest: 1.0, 
        bone_king: 0.25,
        ritual_keeper: 0,
        bone_adjutant: 0,
        high_sigil_master: 260,
        deathknight_maloth: 270
      } 
    }
  ]
};
