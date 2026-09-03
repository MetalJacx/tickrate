// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Greater Faydark" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 11,
  id: "greater_faedark",
  name: "Greater Faedark",
  levelRange: [1, 7],
  description: "Greater Faedark is the vast woodland surrounding Kelethin, filled with winding paths, towering trees and early hunting grounds for elves and visiting adventurers. Wildlife and insects occupy much of the forest, while Crookbone orcs become increasingly common toward the northern approaches to their stronghold. The recommended range is 1–7, with the northern orc camps providing a natural stepping stone into Crookbone.",
  requirements: {
    killsIn: { zoneId: "qaelyn_hills", count: 182 }
  },
  copperReward: { min: 15, max: 25 },
  aggroChance: 0.016,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.212, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.074, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.074 },
    { itemId: "health_potion", dropRate: 0.074 },
  ],
  global: {},
  enemies: [
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_bats", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_wasps", weight: 1.0, loot: [] },
    { id: "eq_pixies", weight: 1.0, loot: [] },
    { id: "eq_faeries", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
