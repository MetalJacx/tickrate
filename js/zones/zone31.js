// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Kerra Island" (Odus)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 31,
  id: "kerrow_isle",
  name: "Kerrow Isle",
  levelRange: [6, 19],
  description: "Kerrow Isle is the Kerrown settlement and hunting area off the western side of Toxwillow Forest. The zone is home to the cat-like Kerrowfolk and a mixture of local wildlife and faction-sensitive inhabitants, making it an unusual low-level destination where careless fighting can have lasting faction consequences. The main attraction here is the Talisman of Kejaar Kerrowth quest.",
  requirements: {
    killsIn: { zoneId: "ehruds_crossing", count: 342 }
  },
  copperReward: { min: 34, max: 56 },
  aggroChance: 0.03,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.195, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.068, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.068 },
    { itemId: "health_potion", dropRate: 0.068 },
  ],
  global: {},
  enemies: [
    { id: "eq_kerrowfolk", weight: 1.0, loot: [] },
    { id: "eq_cats", weight: 1.0, loot: [] },
    { id: "eq_beetles", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_kerran_tiger_spahi", weight: 0.1, loot: [] },
    { id: "eq_shazda_assad", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
