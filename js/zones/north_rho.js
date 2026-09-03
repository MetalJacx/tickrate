// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "North Ro" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 17,
  id: "north_rho",
  name: "North Rho",
  levelRange: [1, 11],
  description: "North Rho is the northern stretch of the Desert of Rho immediately south of Portholme. Low dunes and sparse vegetation give way to dervish camps, tarantulas, mummies, orcs and wandering madmen, while much more dangerous sand giants occasionally cross the travel routes. The progression range is 1–11, though dervishes, mummies and especially sand giants can exceed that range.",
  requirements: {
    killsIn: { zoneId: "nocturas_forest", count: 230 }
  },
  copperReward: { min: 19, max: 31 },
  aggroChance: 0.02,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.208, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.073, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.073 },
    { itemId: "health_potion", dropRate: 0.073 },
  ],
  global: {},
  enemies: [
    { id: "eq_jackals", weight: 1.0, loot: [] },
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_tarantulas", weight: 1.0, loot: [] },
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_dervishes", weight: 1.0, loot: [] },
    { id: "eq_mummies", weight: 1.0, loot: [] },
    { id: "eq_ghouls", weight: 1.0, loot: [] },
    { id: "eq_madmen", weight: 1.0, loot: [] },
    { id: "eq_sand_giants", weight: 1.0, loot: [] },
    { id: "eq_dorn_bdynne", weight: 0.1, loot: [] },
    { id: "eq_rahoteph", weight: 0.1, loot: [] },
    { id: "eq_a_dervish_cutthroat", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
