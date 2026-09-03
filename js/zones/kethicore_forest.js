// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Kithicor Forest" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 29,
  id: "kethicore_forest",
  name: "Kethicore Forest",
  levelRange: [5, 37],
  description: "Kethicore Forest is a wooded travel corridor that changes character completely after sunset. By day it supports low-level wildlife, bixies, spiders and Shralok orcs; at night the forest becomes a haunted gauntlet as powerful undead patrol among the trees, making the same route dramatically more dangerous. Daytime hunting is recommended around levels 5–10. At night, high-level undead replace much of the ordinary population, making the zone appropriate for levels 30+ and dangerous for young travelers.",
  requirements: {
    killsIn: { zoneId: "duskburrow", count: 326 }
  },
  copperReward: { min: 52, max: 86 },
  aggroChance: 0.044,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.178, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.062, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.062 },
    { itemId: "health_potion", dropRate: 0.062 },
  ],
  global: {},
  enemies: [
    { id: "eq_bixies", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_bears", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_shadowed_men", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_zombies", weight: 1.0, loot: [] },
    { id: "eq_ghouls", weight: 1.0, loot: [] },
    { id: "eq_dread_wolves", weight: 1.0, loot: [] },
    { id: "eq_undead_soldiers", weight: 1.0, loot: [] },
    { id: "eq_wandering_warrior", weight: 0.1, loot: [] },
    { id: "eq_undead_cleric", weight: 0.1, loot: [] },
    { id: "eq_coercer_qiolm", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
