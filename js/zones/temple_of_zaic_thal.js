// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Temple of Cazic-Thule" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 52,
  id: "temple_of_zaic_thal",
  name: "Temple of Zaic-Thal",
  levelRange: [18, 33],
  description: "The Temple of Zaic-Thal is a ruined jungle temple deep in the Ferrowake, controlled by organized lizardman devotees of the Faceless. Its courtyards and chambers mix many ranks of lizard warriors and priests with alligators, hulking gorillas and increasingly dangerous clay, stone and steel golems. The recommended range is 18–33. The Avatar of Fear is the main outlier here, being much higher level than everything else and carrying the Rubicite Breastplate.",
  requirements: {
    killsIn: { zoneId: "solmeks_eye", count: 510 }
  },
  copperReward: { min: 62, max: 102 },
  aggroChance: 0.051,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.169, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.059, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.059 },
    { itemId: "health_potion", dropRate: 0.059 },
  ],
  global: {},
  enemies: [
    { id: "eq_lizardmen", weight: 1.0, loot: [] },
    { id: "eq_lizard_priests", weight: 1.0, loot: [] },
    { id: "eq_lizard_crusaders", weight: 1.0, loot: [] },
    { id: "eq_alligators", weight: 1.0, loot: [] },
    { id: "eq_gorillas", weight: 1.0, loot: [] },
    { id: "eq_clay_golems", weight: 1.0, loot: [] },
    { id: "eq_stone_golems", weight: 1.0, loot: [] },
    { id: "eq_steel_golems", weight: 1.0, loot: [] },
    { id: "eq_avatar_of_dread", weight: 0.1, loot: [] },
    { id: "eq_a_stone_golem", weight: 0.1, loot: [] },
    { id: "eq_tae_iw_templar", weight: 0.1, loot: [] },
    { id: "eq_tae_iw_archon", weight: 0.1, loot: [] },
    { id: "eq_a_steel_golem", weight: 0.1, loot: [] },
    { id: "eq_zaic_thal_cenobite", weight: 0.1, loot: [] },
    { id: "eq_a_clay_golem", weight: 0.1, loot: [] },
    { id: "eq_tae_iw_diviner", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
