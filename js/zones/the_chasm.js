// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "The Hole" (Odus)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 59,
  id: "the_chasm",
  name: "The Chasm",
  levelRange: [40, 50],
  description: "The Chasm, the ruined remains of Old Painmere, descends deep beneath Odrai toward the Plane of Underfoot. The dungeon is packed with elementals, golems, undead Ehrudites, ratmen and other powerful creatures, culminating in dangerous named enemies and raid-level threats. Its vertical layout and long recovery routes make mistakes especially punishing. The typical progression range is 40–50, though brave adventurers can arrive earlier for a challenge. The ratman Slizik the Mighty drops the coveted Idol of the Underking.",
  requirements: {
    killsIn: { zoneId: "kelpe_keep", count: 566 }
  },
  copperReward: { min: 105, max: 173 },
  aggroChance: 0.082,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.13, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.045, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.045 },
    { itemId: "health_potion", dropRate: 0.045 },
  ],
  global: {},
  enemies: [
    { id: "eq_elementals", weight: 1.0, loot: [] },
    { id: "eq_ehrudite_ghosts", weight: 1.0, loot: [] },
    { id: "eq_golems", weight: 1.0, loot: [] },
    { id: "eq_ratmen", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_imps", weight: 1.0, loot: [] },
    { id: "eq_mimics", weight: 1.0, loot: [] },
    { id: "eq_constructs", weight: 1.0, loot: [] },
    { id: "eq_a_rock_golem", weight: 0.1, loot: [] },
    { id: "eq_master_yaelen", weight: 0.1, loot: [] },
    { id: "eq_an_elemental_deceiver", weight: 0.1, loot: [] },
    { id: "eq_dartain_the_forsaken", weight: 0.1, loot: [] },
    { id: "eq_ulrik_the_pious", weight: 0.1, loot: [] },
    { id: "eq_stonesoul_the_immovable", weight: 0.1, loot: [] },
    { id: "eq_a_revenant", weight: 0.1, loot: [] },
    { id: "eq_gibartek", weight: 0.1, loot: [] },
    { id: "eq_stonemill_minion", weight: 0.1, loot: [] },
    { id: "eq_initiate_sirlin", weight: 0.1, loot: [] },
    { id: "eq_irslak_the_ruined", weight: 0.1, loot: [] },
    { id: "eq_niltoth_the_profane", weight: 0.1, loot: [] },
    { id: "eq_commander_yarrik", weight: 0.1, loot: [] },
    { id: "eq_slizik_the_colossal", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
