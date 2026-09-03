// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "North Karana" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 33,
  id: "north_karrow",
  name: "North Karrow",
  levelRange: [7, 12],
  description: "North Karrow is a wide river plain and major crossroads between the western and eastern halves of Ostrallis. Lions, wolves, bears, beetles and raiders cover the lower hunting range, while griffins, undead, treants and hill giants create pockets of danger for anyone roaming too far from the roads and bridges. The recommended range is 7–12 for early hunting. Griffins, hill giants, treants and several named enemies are far above that range, so beware.",
  requirements: {
    killsIn: { zoneId: "befallow", count: 358 }
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
    { id: "eq_lions", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_bears", weight: 1.0, loot: [] },
    { id: "eq_beetles", weight: 1.0, loot: [] },
    { id: "eq_raiders", weight: 1.0, loot: [] },
    { id: "eq_will_o_wisps", weight: 1.0, loot: [] },
    { id: "eq_ghouls", weight: 1.0, loot: [] },
    { id: "eq_griffawns", weight: 1.0, loot: [] },
    { id: "eq_griffins", weight: 1.0, loot: [] },
    { id: "eq_hill_giants", weight: 1.0, loot: [] },
    { id: "eq_treants", weight: 1.0, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
