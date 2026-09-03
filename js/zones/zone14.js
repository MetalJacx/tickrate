// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Feerrott" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 14,
  id: "ferrowake",
  name: "Ferrowake",
  levelRange: [1, 9],
  description: "The Ferrowake is a dark, humid wilderness of dense jungle and swamp surrounding the ogre city of Oggok and the ruined Temple of Zaic-Thal. Lizard men dominate many camps, while spiders, alligators, undead and dangerous spectres become more common as adventurers move deeper into the zone. The normal starting progression is 1–9, but the zone contains isolated high-level threats and entrances to Zaic-Thal and the Realm of Dread.",
  requirements: {
    killsIn: { zoneId: "toxwillow_forest", count: 206 }
  },
  copperReward: { min: 17, max: 28 },
  aggroChance: 0.018,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.21, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.073, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.073 },
    { itemId: "health_potion", dropRate: 0.073 },
  ],
  global: {},
  enemies: [
    { id: "eq_lizard_men", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_alligators", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_frogloks", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_zombies", weight: 1.0, loot: [] },
    { id: "eq_spectres", weight: 1.0, loot: [] },
    { id: "eq_a_lizardman_mystic", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
