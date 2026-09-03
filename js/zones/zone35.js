// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "South Ro" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 35,
  id: "south_rho",
  name: "South Rho",
  levelRange: [8, 17],
  description: "South Rho spans sun-baked dunes and a greener southern fringe between the Oasis of Marn and Murkthule Swamp. Orc camps, dervishes, snakes, tarantulas and plentiful undead provide steady hunting through the teens, but roaming sand giants and rare desert predators can turn an otherwise routine pull into a very short story. The recommended range is 8–17. Sand giants and certain rare encounters are substantially higher level than the normal hunting population.",
  requirements: {
    killsIn: { zoneId: "lesser_faedark", count: 374 }
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
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_tarantulas", weight: 1.0, loot: [] },
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_dervishes", weight: 1.0, loot: [] },
    { id: "eq_madmen", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_zombies", weight: 1.0, loot: [] },
    { id: "eq_ghouls", weight: 1.0, loot: [] },
    { id: "eq_mummies", weight: 1.0, loot: [] },
    { id: "eq_scarabs", weight: 1.0, loot: [] },
    { id: "eq_sand_giants", weight: 1.0, loot: [] },
    { id: "eq_a_dervish_cutthroat", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
