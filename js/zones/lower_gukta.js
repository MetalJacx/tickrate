// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Lower Guk" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 56,
  id: "lower_gukta",
  name: "Lower Gukta",
  levelRange: [28, 44],
  description: "Lower Gukta is the deepest portion of the Gukta complex, divided between living frogloks and the infamous undead “dead side.” Froglok knights, shamans and wizards share the maze with ghouls, gargoyles, minotaurs, spiders, vampire bats and other dangerous creatures guarding some of classic Norrath’s most coveted camps. The recommended range is 28–44. The King, Lord and Frenzied camps present the greatest challenge for the best rewards.",
  requirements: {
    killsIn: { zoneId: "cleftpaw_lair", count: 542 }
  },
  copperReward: { min: 85, max: 140 },
  aggroChance: 0.068,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.148, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.052, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.052 },
    { itemId: "health_potion", dropRate: 0.052 },
  ],
  global: {},
  enemies: [
    { id: "eq_frogloks", weight: 1.0, loot: [] },
    { id: "eq_froglok_ghouls", weight: 1.0, loot: [] },
    { id: "eq_ghouls", weight: 1.0, loot: [] },
    { id: "eq_froglok_shamans", weight: 1.0, loot: [] },
    { id: "eq_froglok_wizards", weight: 1.0, loot: [] },
    { id: "eq_gargoyles", weight: 1.0, loot: [] },
    { id: "eq_minotaurs", weight: 1.0, loot: [] },
    { id: "eq_giant_spiders", weight: 1.0, loot: [] },
    { id: "eq_vampire_bats", weight: 1.0, loot: [] },
    { id: "eq_ice_bone_skeletons", weight: 1.0, loot: [] },
    { id: "eq_the_froglok_king", weight: 0.1, loot: [] },
    { id: "eq_a_ghoul_executioner", weight: 0.1, loot: [] },
    { id: "eq_a_ghoul_cavalier", weight: 0.1, loot: [] },
    { id: "eq_the_ghoul_lord", weight: 0.1, loot: [] },
    { id: "eq_a_ghoul_assassin", weight: 0.1, loot: [] },
    { id: "eq_a_ghoul_savant", weight: 0.1, loot: [] },
    { id: "eq_a_frenzied_ghoul", weight: 0.1, loot: [] },
    { id: "eq_a_ghoul_sentinel", weight: 0.1, loot: [] },
    { id: "eq_the_ghoul_arch_magi", weight: 0.1, loot: [] },
    { id: "eq_a_ghoul_supplier", weight: 0.1, loot: [] },
    { id: "eq_a_froglok_tactician", weight: 0.1, loot: [] },
    { id: "eq_a_froglok_crusader", weight: 0.1, loot: [] },
    { id: "eq_a_froglok_yun_priest", weight: 0.1, loot: [] },
    { id: "eq_a_froglok_noble", weight: 0.1, loot: [] },
    { id: "eq_a_ghoul_sage", weight: 0.1, loot: [] },
    { id: "eq_a_reanimated_hand_lower_gukta", weight: 0.1, loot: [] },
    { id: "eq_a_minotaur_patriarch", weight: 0.1, loot: [] },
    { id: "eq_a_minotaur_elder", weight: 0.1, loot: [] },
    { id: "eq_a_yun_priest", weight: 0.1, loot: [] },
    { id: "eq_a_ghoul_ritualist", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
