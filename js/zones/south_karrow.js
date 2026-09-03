// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "South Karana" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 49,
  id: "south_karrow",
  name: "South Karrow",
  levelRange: [15, 30],
  description: "South Karrow is a vast grassland dominated by aviak settlements, Cleftpaw gnolls and roaming wildlife. Centaurs, elephants, treants, undead, raiders and the legendary Quillmane add variety across the open plains, while the zone also serves as the approach to Lake Wrathtear and the Cleftpaw region. Recommended level range is 15–30, with the Aviak treehouse and centaur stables presenting the greatest danger.",
  requirements: {
    killsIn: { zoneId: "dargons_cauldron", count: 486 }
  },
  copperReward: { min: 56, max: 92 },
  aggroChance: 0.046,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.175, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.061, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.061 },
    { itemId: "health_potion", dropRate: 0.061 },
  ],
  global: {},
  enemies: [
    { id: "eq_aviaks", weight: 1.0, loot: [] },
    { id: "eq_gnolls", weight: 1.0, loot: [] },
    { id: "eq_centaurs", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_lions", weight: 1.0, loot: [] },
    { id: "eq_elephants", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_zombies", weight: 1.0, loot: [] },
    { id: "eq_werewolves", weight: 1.0, loot: [] },
    { id: "eq_shadowed_men", weight: 1.0, loot: [] },
    { id: "eq_treants", weight: 1.0, loot: [] },
    { id: "eq_cyclopes", weight: 1.0, loot: [] },
    { id: "eq_raiders", weight: 1.0, loot: [] },
    { id: "eq_coloth_meadowbrook", weight: 0.1, loot: [] },
    { id: "eq_lord_grimrust", weight: 0.1, loot: [] },
    { id: "eq_grizzlebark", weight: 0.1, loot: [] },
    { id: "eq_narra_taneth", weight: 0.1, loot: [] },
    { id: "eq_marik_thornclub", weight: 0.1, loot: [] },
    { id: "eq_a_rosk_val_gnoll", weight: 0.1, loot: [] },
    { id: "eq_brother_kwinn", weight: 0.1, loot: [] },
    { id: "eq_plumemane", weight: 0.1, loot: [] },
    { id: "eq_ghanex_drahl", weight: 0.1, loot: [] },
    { id: "eq_aviak_avocet", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
