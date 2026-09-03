// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Lake Rathetear" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 37,
  id: "lake_wrathtear",
  name: "Lake Wrathtear",
  levelRange: [9, 16],
  description: "Lake Wrathtear is a sprawling lake broken up by islands, cliffs, towers and isolated camps, so movement often matters as much as combat. Gnolls and undead crowd the northern approach, while aqua goblins, sharks, aviaks, bandits and other scattered camps occupy the shorelines and water itself. The recommended range is 9–16 for early camps and travel. Many aquatic and isolated encounters in the zone are significantly higher level.",
  requirements: {
    killsIn: { zoneId: "east_karrow", count: 390 }
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
    { id: "eq_gnolls", weight: 1.0, loot: [] },
    { id: "eq_undead", weight: 1.0, loot: [] },
    { id: "eq_aqua_goblins", weight: 1.0, loot: [] },
    { id: "eq_deepwater_goblins", weight: 1.0, loot: [] },
    { id: "eq_water_snakes", weight: 1.0, loot: [] },
    { id: "eq_sharks", weight: 1.0, loot: [] },
    { id: "eq_aviaks", weight: 1.0, loot: [] },
    { id: "eq_bandits", weight: 1.0, loot: [] },
    { id: "eq_stone_skeletons", weight: 1.0, loot: [] },
    { id: "eq_a_gnoll_embalmer", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
