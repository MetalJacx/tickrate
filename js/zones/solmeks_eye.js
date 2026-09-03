// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Solusek's Eye" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 51,
  id: "solmeks_eye",
  name: "Solmek's Eye",
  levelRange: [16, 35],
  description: "Solmek’s Eye, commonly called SolA, is a lava-filled mining complex shared uneasily by fire goblins, gnome miners and their clockwork servants. Goblin warriors and casters dominate the outer caverns, while deeper gnomes, clockworks and blazing elementals turn the maze into a dangerous mid-level dungeon. The recommended range is 16–35. Lava, pit traps and tightly packed social enemies make navigation nearly as important as raw combat strength.",
  requirements: {
    killsIn: { zoneId: "highridge_hold", count: 502 }
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
    { id: "eq_fire_goblins", weight: 1.0, loot: [] },
    { id: "eq_goblin_shamans", weight: 1.0, loot: [] },
    { id: "eq_goblin_wizards", weight: 1.0, loot: [] },
    { id: "eq_gnome_miners", weight: 1.0, loot: [] },
    { id: "eq_gnome_casters", weight: 1.0, loot: [] },
    { id: "eq_clockworks", weight: 1.0, loot: [] },
    { id: "eq_fire_elementals", weight: 1.0, loot: [] },
    { id: "eq_reckless_efreeti", weight: 0.1, loot: [] },
    { id: "eq_flame_goblin_foreman", weight: 0.1, loot: [] },
    { id: "eq_kobold_predator", weight: 0.1, loot: [] },
    { id: "eq_agt_unit_exg", weight: 0.1, loot: [] },
    { id: "eq_captain_bipnoggle", weight: 0.1, loot: [] },
    { id: "eq_inferno_goblin_captain", weight: 0.1, loot: [] },
    { id: "eq_scorch", weight: 0.1, loot: [] },
    { id: "eq_fire_goblin_bartender", weight: 0.1, loot: [] },
    { id: "eq_solmek_goblin_king", weight: 0.1, loot: [] },
    { id: "eq_kindlespark", weight: 0.1, loot: [] },
    { id: "eq_goblin_high_shaman", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
