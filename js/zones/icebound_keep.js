// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Permafrost Keep" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 46,
  id: "icebound_keep",
  name: "Icebound Keep",
  levelRange: [14, 26],
  description: "Icebound Keep is an ancient frozen fortress buried beneath Everrime and occupied by ice goblins serving the dragon Lady Vexa. Its icy tunnels progress from goblin warriors and spellcasters into dire wolves, giant spiders, icy terrors, polar bears and finally ice giants guarding the deepest reaches. Recommended level range is 14–26 for normal progression, while ice giants, wolves and spiders deep within can provide a challenge up into the late 30s.",
  requirements: {
    killsIn: { zoneId: "gorge_of_king_zorbb", count: 462 }
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
    { id: "eq_ice_goblins", weight: 1.0, loot: [] },
    { id: "eq_goblin_casters", weight: 1.0, loot: [] },
    { id: "eq_dire_wolves", weight: 1.0, loot: [] },
    { id: "eq_giant_spiders", weight: 1.0, loot: [] },
    { id: "eq_icy_terrors", weight: 1.0, loot: [] },
    { id: "eq_polar_bears", weight: 1.0, loot: [] },
    { id: "eq_ice_giants", weight: 1.0, loot: [] },
    { id: "eq_a_priest_of_naganox", weight: 0.1, loot: [] },
    { id: "eq_lady_vexa", weight: 0.1, loot: [] },
    { id: "eq_an_injured_polar_bear", weight: 0.1, loot: [] },
    { id: "eq_a_goblin_preacher", weight: 0.1, loot: [] },
    { id: "eq_king_thexka_iv_of_the_burrows", weight: 0.1, loot: [] },
    { id: "eq_a_goblin_scryer", weight: 0.1, loot: [] },
    { id: "eq_high_priest_zaharon", weight: 0.1, loot: [] },
    { id: "eq_a_goblin_alchemist", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
