// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Nagafen's Lair" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 57,
  id: "naganoxs_lair",
  name: "Naganox's Lair",
  levelRange: [34, 47],
  description: "Naganox’s Lair, commonly called SolB, is the deeper volcanic dungeon beneath Cindersong. Greater kobolds, bats, spiders, lava guardians and imps give way to powerful fire giants, efreeti and ultimately Lord Naganox himself in the deepest chambers. The recommended range is 34–47 for ordinary progression. Fire giants and Lord Naganox present the greatest challenge.",
  requirements: {
    killsIn: { zoneId: "lower_gukta", count: 550 }
  },
  copperReward: { min: 95, max: 157 },
  aggroChance: 0.075,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.139, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.049, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.049 },
    { itemId: "health_potion", dropRate: 0.049 },
  ],
  global: {},
  enemies: [
    { id: "eq_kobolds", weight: 1.0, loot: [] },
    { id: "eq_bats", weight: 1.0, loot: [] },
    { id: "eq_giant_spiders", weight: 1.0, loot: [] },
    { id: "eq_lava_guardians", weight: 1.0, loot: [] },
    { id: "eq_imps", weight: 1.0, loot: [] },
    { id: "eq_fire_giants", weight: 1.0, loot: [] },
    { id: "eq_efreeti", weight: 1.0, loot: [] },
    { id: "eq_fire_dragon", weight: 1.0, loot: [] },
    { id: "eq_warlord_skarlorn", weight: 0.1, loot: [] },
    { id: "eq_fire_giant_warrior", weight: 0.1, loot: [] },
    { id: "eq_lord_naganox", weight: 0.1, loot: [] },
    { id: "eq_solmek_kobold_king", weight: 0.1, loot: [] },
    { id: "eq_kobold_champion", weight: 0.1, loot: [] },
    { id: "eq_kobold_noble", weight: 0.1, loot: [] },
    { id: "eq_stone_spider", weight: 0.1, loot: [] },
    { id: "eq_kobold_priest", weight: 0.1, loot: [] },
    { id: "eq_noxious_spider", weight: 0.1, loot: [] },
    { id: "eq_king_tranyx", weight: 0.1, loot: [] },
    { id: "eq_magus_rokael", weight: 0.1, loot: [] },
    { id: "eq_guano_harvester", weight: 0.1, loot: [] },
    { id: "eq_djinn_lord_djarn", weight: 0.1, loot: [] },
    { id: "eq_death_beetle", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
