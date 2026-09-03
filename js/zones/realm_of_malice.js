// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Plane of Hate" (Planes)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 61,
  id: "realm_of_malice",
  name: "Realm of Malice",
  levelRange: [46, 56],
  description: "The Realm of Malice is Innorath’s hostile domain, a grim planar stronghold filled with undead, spiteful constructs, powerful dark-elven servants and other manifestations of hatred. Its dense population, see-invisibility enemies and major named encounters make it a dangerous raid destination from the moment a force arrives. Minimum player level 46. This is a raid zone; monsters are generally level 48+ and the zone has no conventional walk-out exit.",
  requirements: {
    killsIn: { zoneId: "realm_of_dread", count: 582 }
  },
  copperReward: { min: 118, max: 195 },
  aggroChance: 0.092,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.118, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.041, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.041 },
    { itemId: "health_potion", dropRate: 0.041 },
  ],
  global: {},
  enemies: [
    { id: "eq_ashenbone_skeletons", weight: 1.0, loot: [] },
    { id: "eq_spite_golems", weight: 1.0, loot: [] },
    { id: "eq_banshees", weight: 1.0, loot: [] },
    { id: "eq_clerics", weight: 1.0, loot: [] },
    { id: "eq_shadow_knights", weight: 1.0, loot: [] },
    { id: "eq_dark_elves", weight: 1.0, loot: [] },
    { id: "eq_undead_casters", weight: 1.0, loot: [] },
    { id: "eq_imps", weight: 1.0, loot: [] },
    { id: "eq_grandmaster_rtan", weight: 0.1, loot: [] },
    { id: "eq_lord_of_wrath", weight: 0.1, loot: [] },
    { id: "eq_a_kiraikuei", weight: 0.1, loot: [] },
    { id: "eq_an_ire_ghast", weight: 0.1, loot: [] },
    { id: "eq_master_of_venom", weight: 0.1, loot: [] },
    { id: "eq_magi_ptasyn", weight: 0.1, loot: [] },
    { id: "eq_mistress_of_disdain", weight: 0.1, loot: [] },
    { id: "eq_avatar_of_malice", weight: 0.1, loot: [] },
    { id: "eq_maestro_of_bile", weight: 0.1, loot: [] },
    { id: "eq_an_eerie_chest", weight: 0.1, loot: [] },
    { id: "eq_a_scorn_banshee", weight: 0.1, loot: [] },
    { id: "eq_innorath_god", weight: 0.1, loot: [] },
    { id: "eq_lord_of_contempt", weight: 0.1, loot: [] },
    { id: "eq_coercer_tvalyn", weight: 0.1, loot: [] },
    { id: "eq_an_abhorrent", weight: 0.1, loot: [] },
    { id: "eq_innorath", weight: 0.1, loot: [] },
    { id: "eq_haunted_chest", weight: 0.1, loot: [] },
    { id: "eq_an_agent_of_innorath", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
