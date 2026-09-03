// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Erud's Crossing" (Odus)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 30,
  id: "ehruds_crossing",
  name: "Ehrud's Crossing",
  levelRange: [6, 13],
  description: "Ehrud's Crossing is the island-studded sea passage between Odrai and Qaelyn, reached by ferry and dotted with small hunting areas away from the docks. The islands mix low-level wildlife with will-o-wisps, so characters crossing the route can hunt wisps and collect greater lightstones!",
  requirements: {
    killsIn: { zoneId: "kethicore_forest", count: 334 }
  },
  copperReward: { min: 27, max: 45 },
  aggroChance: 0.025,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.201, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.07, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.07 },
    { itemId: "health_potion", dropRate: 0.07 },
  ],
  global: {},
  enemies: [
    { id: "eq_will_o_wisps", weight: 1.0, loot: [] },
    { id: "eq_sharks", weight: 1.0, loot: [] },
    { id: "eq_piranhas", weight: 1.0, loot: [] },
    { id: "eq_kodiaks", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_beetles", weight: 1.0, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
