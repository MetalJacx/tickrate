// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Lesser Faydark" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 34,
  id: "lesser_faedark",
  name: "Lesser Faedark",
  levelRange: [8, 13],
  description: "Lesser Faedark is a darker, more dangerous forest than Greater Faedark, with corrupted stretches claimed by orcs, bandits and shadowed creatures. Brownies, pixies, faeries and fae drakes also inhabit the woods, producing an unusually varied mix of friendly, neutral and highly aggressive encounters. The recommended range is 8–13, but the zone contains many roaming and named creatures well above that range, so travel can be dangerous for low-level characters. Beware the unicorn!",
  requirements: {
    killsIn: { zoneId: "north_karrow", count: 366 }
  },
  copperReward: { min: 29, max: 48 },
  aggroChance: 0.027,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.199, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.07, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.07 },
    { itemId: "health_potion", dropRate: 0.07 },
  ],
  global: {},
  enemies: [
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_bandits", weight: 1.0, loot: [] },
    { id: "eq_brownies", weight: 1.0, loot: [] },
    { id: "eq_pixies", weight: 1.0, loot: [] },
    { id: "eq_faeries", weight: 1.0, loot: [] },
    { id: "eq_fae_drakes", weight: 1.0, loot: [] },
    { id: "eq_shadowed_men", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_mummies", weight: 1.0, loot: [] },
    { id: "eq_wasps", weight: 1.0, loot: [] },
    { id: "eq_crookstinger", weight: 0.1, loot: [] },
    { id: "eq_bracken_undergrowth", weight: 0.1, loot: [] },
    { id: "eq_orc_legionnaire", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
