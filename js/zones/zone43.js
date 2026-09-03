// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Ocean of Tears" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 43,
  id: "sea_of_sorrows",
  name: "Sea of Sorrows",
  levelRange: [10, 48],
  description: "The Sea of Sorrows is the island-dotted sea route between Faedrun and Portholme. Its scattered islands each have their own hazards, ranging from goblins, pirates and sirens to gargoyles, spectres and high-level cyclopes, making the zone useful across an unusually wide span of levels. The recommended level range is 10–48 because difficulty varies dramatically from island to island; adventurers should treat each island as its own hunting area. Seafury cyclops island and the elite goblin island are suitable for high-level characters.",
  requirements: {
    killsIn: { zoneId: "the_manor_of_malaise", count: 438 }
  },
  copperReward: { min: 70, max: 116 },
  aggroChance: 0.056,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.162, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.057, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.057 },
    { itemId: "health_potion", dropRate: 0.057 },
  ],
  global: {},
  enemies: [
    { id: "eq_aqua_goblins", weight: 1.0, loot: [] },
    { id: "eq_isle_goblins", weight: 1.0, loot: [] },
    { id: "eq_sirens", weight: 1.0, loot: [] },
    { id: "eq_sharks", weight: 1.0, loot: [] },
    { id: "eq_pirates", weight: 1.0, loot: [] },
    { id: "eq_cyclopes", weight: 1.0, loot: [] },
    { id: "eq_spectres", weight: 1.0, loot: [] },
    { id: "eq_gargoyles", weight: 1.0, loot: [] },
    { id: "eq_aviaks", weight: 1.0, loot: [] },
    { id: "eq_oracle_of_karnos", weight: 0.1, loot: [] },
    { id: "eq_antinyme", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
