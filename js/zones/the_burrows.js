// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "The Warrens" (Odus)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 25,
  id: "the_burrows",
  name: "The Burrows",
  levelRange: [4, 18],
  description: "The Burrows is a sprawling kobold cave network beneath Odrai, occupied by Clan Kolbok and expanded into older underground structures. Its tunnels are dense with kobolds, bats and rats, with tougher shamans, brawlers and named leaders deeper inside. The average range is 4–18, with tougher named encounters reaching into the mid-20s.",
  requirements: {
    killsIn: { zoneId: "west_commonwilds", count: 294 }
  },
  copperReward: { min: 30, max: 50 },
  aggroChance: 0.028,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.198, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.069, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.069 },
    { itemId: "health_potion", dropRate: 0.069 },
  ],
  global: {},
  enemies: [
    { id: "eq_kobolds", weight: 1.0, loot: [] },
    { id: "eq_kobold_shamans", weight: 1.0, loot: [] },
    { id: "eq_kobold_brawlers", weight: 1.0, loot: [] },
    { id: "eq_bats", weight: 1.0, loot: [] },
    { id: "eq_rats", weight: 1.0, loot: [] },
    { id: "eq_packmaster_dledshn", weight: 0.1, loot: [] },
    { id: "eq_the_mudlwump", weight: 0.1, loot: [] },
    { id: "eq_grodl_rendclaw", weight: 0.1, loot: [] },
    { id: "eq_king_gragnor", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
