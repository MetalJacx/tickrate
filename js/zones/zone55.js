// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Splitpaw Lair" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 55,
  id: "cleftpaw_lair",
  name: "Cleftpaw Lair",
  levelRange: [25, 40],
  description: "Cleftpaw Lair is the gnoll stronghold beneath the enormous stone pawprint in South Karrow. the Legendrealm has substantially revamped the dungeon, beginning with level 22 enemies near the entrance and ramping through several difficulty bands into tougher interior camps. The winding halls are packed with ranked gnoll warriors, rogues, shamans and casters, with prisoners and other creatures mixed into the deeper sections. Recommended levels 25–40 for typical progression. The revamped dungeon begins around level 22 at the entrance and increases through multiple difficulty bands; some of the deepest encounters can extend beyond the recommended range.",
  requirements: {
    killsIn: { zoneId: "highridge_keep", count: 534 }
  },
  copperReward: { min: 78, max: 129 },
  aggroChance: 0.062,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.155, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.054, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.054 },
    { itemId: "health_potion", dropRate: 0.054 },
  ],
  global: {},
  enemies: [
    { id: "eq_gnolls", weight: 1.0, loot: [] },
    { id: "eq_gnoll_warriors", weight: 1.0, loot: [] },
    { id: "eq_gnoll_rogues", weight: 1.0, loot: [] },
    { id: "eq_gnoll_shamans", weight: 1.0, loot: [] },
    { id: "eq_gnoll_clerics", weight: 1.0, loot: [] },
    { id: "eq_gnoll_casters", weight: 1.0, loot: [] },
    { id: "eq_gnoll_prisoners", weight: 1.0, loot: [] },
    { id: "eq_gaduladian_widemouths", weight: 1.0, loot: [] },
    { id: "eq_a_tesk_val_brute", weight: 0.1, loot: [] },
    { id: "eq_vereshe_mal_executioner", weight: 0.1, loot: [] },
    { id: "eq_tesk_val_devalnmek", weight: 0.1, loot: [] },
    { id: "eq_tesk_val_kadvern", weight: 0.1, loot: [] },
    { id: "eq_nesch_val_torash_mashk", weight: 0.1, loot: [] },
    { id: "eq_a_ltesh_mas_gnoll", weight: 0.1, loot: [] },
    { id: "eq_a_nesch_mas_mender", weight: 0.1, loot: [] },
    { id: "eq_the_yshva_mal", weight: 0.1, loot: [] },
    { id: "eq_yshma_mas_apprentice", weight: 0.1, loot: [] },
    { id: "eq_yshva_mas_apprentice", weight: 0.1, loot: [] },
    { id: "eq_rosk_val_lvlor_rare", weight: 0.1, loot: [] },
    { id: "eq_rosk_val_lvlor", weight: 0.1, loot: [] },
    { id: "eq_a_ltesh_val_deviant", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
