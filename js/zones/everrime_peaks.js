// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Everfrost Peaks" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 20,
  id: "everrime_peaks",
  name: "Everrime Peaks",
  levelRange: [1, 20],
  description: "Everrime Peaks is the frozen homeland surrounding Halas, with narrow snowbound canyons opening into a broad and much more dangerous tundra. New adventurers face goblins, wolves, spiders and bears near the barbarian city, while mammoths, undead, icy orcs and ice giants roam farther out toward Icebound. Alchemy vendors are located in the far north, just west of the frozen river.",
  requirements: {
    killsIn: { zoneId: "new_sebilith_expedition", count: 254 }
  },
  copperReward: { min: 29, max: 48 },
  aggroChance: 0.027,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.199, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.07, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.07 },
    { itemId: "health_potion", dropRate: 0.07 },
  ],
  global: {},
  enemies: [
    { id: "eq_ice_goblins", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_snow_spiders", weight: 1.0, loot: [] },
    { id: "eq_polar_bears", weight: 1.0, loot: [] },
    { id: "eq_snow_leopards", weight: 1.0, loot: [] },
    { id: "eq_mammoths", weight: 1.0, loot: [] },
    { id: "eq_icy_orcs", weight: 1.0, loot: [] },
    { id: "eq_undead", weight: 1.0, loot: [] },
    { id: "eq_ice_giants", weight: 1.0, loot: [] },
    { id: "eq_an_ice_giant", weight: 0.1, loot: [] },
    { id: "eq_shade_assassin", weight: 0.1, loot: [] },
    { id: "eq_mirasol", weight: 0.1, loot: [] },
    { id: "eq_karg_frostbear", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
