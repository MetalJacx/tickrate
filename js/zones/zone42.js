// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "The Estate of Unrest" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 42,
  id: "the_manor_of_malaise",
  name: "The Manor of Malaise",
  levelRange: [10, 30],
  description: "The Manor of Malaise is a haunted manor complex overrun by undead, with progression moving from the yard and first floor into increasingly dangerous upper rooms and basement camps. Tight stairways, social aggro and frequent trains make the mansion much more dangerous than its compact footprint suggests. the Legendrealm has refreshed the zone while removing the old placeholder-based named-spawn system. The recommended range is 10–30, with the basement presenting the greatest challenge.",
  requirements: {
    killsIn: { zoneId: "weepeye", count: 430 }
  },
  copperReward: { min: 50, max: 82 },
  aggroChance: 0.042,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.18, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.063, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.063 },
    { itemId: "health_potion", dropRate: 0.063 },
  ],
  global: {},
  enemies: [
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_ghouls", weight: 1.0, loot: [] },
    { id: "eq_mummies", weight: 1.0, loot: [] },
    { id: "eq_zombies", weight: 1.0, loot: [] },
    { id: "eq_undead_knights", weight: 1.0, loot: [] },
    { id: "eq_reanimated_hands", weight: 1.0, loot: [] },
    { id: "eq_festering_hags", weight: 1.0, loot: [] },
    { id: "eq_werebats", weight: 1.0, loot: [] },
    { id: "eq_tentacle_terrors", weight: 1.0, loot: [] },
    { id: "eq_fungi", weight: 1.0, loot: [] },
    { id: "eq_a_zombie_of_an_unrest_noble", weight: 0.1, loot: [] },
    { id: "eq_lesser_edge_fiend", weight: 0.1, loot: [] },
    { id: "eq_a_tentacle_terror", weight: 0.1, loot: [] },
    { id: "eq_an_undead_barkeep", weight: 0.1, loot: [] },
    { id: "eq_a_priest_of_najena", weight: 0.1, loot: [] },
    { id: "eq_an_undead_knight_of_malaise", weight: 0.1, loot: [] },
    { id: "eq_an_undead_brewer", weight: 0.1, loot: [] },
    { id: "eq_garanel_ruckstaff", weight: 0.1, loot: [] },
    { id: "eq_khrix_frostoff", weight: 0.1, loot: [] },
    { id: "eq_a_festering_hag", weight: 0.1, loot: [] },
    { id: "eq_reclusive_ghoul_magus", weight: 0.1, loot: [] },
    { id: "eq_a_reanimated_hand_malaise", weight: 0.1, loot: [] },
    { id: "eq_a_reanimated_hand", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
