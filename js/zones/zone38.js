// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Upper Guk" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 38,
  id: "upper_gukta",
  name: "Upper Gukta",
  levelRange: [9, 25],
  description: "Upper Gukta is the sprawling upper level of the froglok stronghold beneath Murkthule Swamp. Dense clusters of froglok warriors, shamans and knights fill its winding corridors alongside crocodiles, heart spiders, fungus creatures and skeletal monks, with several routes descending into Lower Gukta. The recommended range is 9–25. Tight rooms, runners and clustered spawns make crowd control and pull discipline especially valuable.",
  requirements: {
    killsIn: { zoneId: "lake_wrathtear", count: 398 }
  },
  copperReward: { min: 43, max: 71 },
  aggroChance: 0.037,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.186, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.065, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.065 },
    { itemId: "health_potion", dropRate: 0.065 },
  ],
  global: {},
  enemies: [
    { id: "eq_frogloks", weight: 1.0, loot: [] },
    { id: "eq_froglok_shamans", weight: 1.0, loot: [] },
    { id: "eq_froglok_knights", weight: 1.0, loot: [] },
    { id: "eq_alligators", weight: 1.0, loot: [] },
    { id: "eq_crocodiles", weight: 1.0, loot: [] },
    { id: "eq_heart_spiders", weight: 1.0, loot: [] },
    { id: "eq_fungus_men", weight: 1.0, loot: [] },
    { id: "eq_skeletal_monks", weight: 1.0, loot: [] },
    { id: "eq_the_froglok_shin_lord", weight: 0.1, loot: [] },
    { id: "eq_a_froglok_gaz_squire", weight: 0.1, loot: [] },
    { id: "eq_a_froglok_scryer", weight: 0.1, loot: [] },
    { id: "eq_an_ancient_croc", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
