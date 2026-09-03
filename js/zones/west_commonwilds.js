// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "West Commonlands" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 24,
  id: "west_commonwilds",
  name: "West Commonwilds",
  levelRange: [3, 14],
  description: "West Commonwilds is the rougher western half of the Commonwilds corridor, stretching toward Kethicore Forest and the ruined dungeon of Befallen. Orc camps, dervishes, wandering wildlife and undead make it a natural early hunting ground, while griffins, shadowed men and other dangerous roamers punish travelers who stray too casually from familiar routes.",
  requirements: {
    killsIn: { zoneId: "qaelyn_aqueducts", count: 286 }
  },
  copperReward: { min: 25, max: 41 },
  aggroChance: 0.024,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.203, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.071, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.071 },
    { itemId: "health_potion", dropRate: 0.071 },
  ],
  global: {},
  enemies: [
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_dervishes", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_bears", weight: 1.0, loot: [] },
    { id: "eq_pumas", weight: 1.0, loot: [] },
    { id: "eq_scarabs", weight: 1.0, loot: [] },
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_zombies", weight: 1.0, loot: [] },
    { id: "eq_mummies", weight: 1.0, loot: [] },
    { id: "eq_will_o_wisps", weight: 1.0, loot: [] },
    { id: "eq_griffins", weight: 1.0, loot: [] },
    { id: "eq_shadowed_men", weight: 1.0, loot: [] },
    { id: "eq_dragoon_zytln", weight: 0.1, loot: [] },
    { id: "eq_an_orc_legionnaire", weight: 0.1, loot: [] },
    { id: "eq_a_dervish_cutthroat", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
