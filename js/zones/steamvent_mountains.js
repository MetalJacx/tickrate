// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Steamfont Mountains" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 18,
  id: "steamvent_mountains",
  name: "Steamvent Mountains",
  levelRange: [1, 11],
  description: "Steamvent Mountains is the rocky homeland surrounding Ak’Anon, mixing low-level gnome hunting grounds with clockworks, kobold camps and increasingly dangerous creatures around the minotaur caves and crater country. The zone has a mechanical flavor unlike most of Faedrun, but still mixes in drakes, elementals, harpies and undead. The recommended range is 1–11 for ordinary hunting, while the minotaur caves present the greatest challenge. Beware the gnome in the minotaur caves!",
  requirements: {
    killsIn: { zoneId: "north_rho", count: 238 }
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
    { id: "eq_kobolds", weight: 1.0, loot: [] },
    { id: "eq_clockworks", weight: 1.0, loot: [] },
    { id: "eq_minotaurs", weight: 1.0, loot: [] },
    { id: "eq_earth_elementals", weight: 1.0, loot: [] },
    { id: "eq_drakes", weight: 1.0, loot: [] },
    { id: "eq_harpies", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_yendar_starflare", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
