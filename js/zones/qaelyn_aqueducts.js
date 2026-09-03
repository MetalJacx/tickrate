// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Qeynos Aqueducts" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 23,
  id: "qaelyn_aqueducts",
  name: "Qaelyn Aqueducts",
  levelRange: [3, 13],
  description: "Qaelyn Aqueducts are the sprawling abandoned waterworks and catacombs beneath the city of Qaelyn. Rats, bats, beetles, spiders, snakes and sewer creatures fill the early tunnels, while smugglers, thugs, beggars, undead, frogloks and darker cult activity occupy the deeper passages. Multiple entrances connect the underground maze to both halves of Qaelyn. Recommended levels 3–13. Most of the Aqueducts are low-level hunting territory, although a small set of substantially higher-level enemies also exists deeper in the system. Entrances and exits connect to both North Qaelyn and South Qaelyn.",
  requirements: {
    killsIn: { zoneId: "east_commonwilds", count: 278 }
  },
  copperReward: { min: 24, max: 40 },
  aggroChance: 0.023,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.204, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.071, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.071 },
    { itemId: "health_potion", dropRate: 0.071 },
  ],
  global: {},
  enemies: [
    { id: "eq_rats", weight: 1.0, loot: [] },
    { id: "eq_bats", weight: 1.0, loot: [] },
    { id: "eq_beetles", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_alligators", weight: 1.0, loot: [] },
    { id: "eq_fish", weight: 1.0, loot: [] },
    { id: "eq_frogloks", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_undead", weight: 1.0, loot: [] },
    { id: "eq_beggars", weight: 1.0, loot: [] },
    { id: "eq_mercenaries", weight: 1.0, loot: [] },
    { id: "eq_thugs", weight: 1.0, loot: [] },
    { id: "eq_smugglers", weight: 1.0, loot: [] },
    { id: "eq_necromancers", weight: 1.0, loot: [] },
    { id: "eq_gelatinous_cubes", weight: 1.0, loot: [] },
    { id: "eq_a_rotting_sentry", weight: 0.1, loot: [] },
    { id: "eq_a_spectre", weight: 0.1, loot: [] },
    { id: "eq_a_gelatinous_cube", weight: 0.1, loot: [] },
    { id: "eq_a_necromancer", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
