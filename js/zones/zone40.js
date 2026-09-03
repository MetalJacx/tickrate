// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Oasis of Marr" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 40,
  id: "oasis_of_marn",
  name: "Oasis of Marn",
  levelRange: [10, 20],
  description: "Oasis of Marn is the palm-lined lake and desert corridor between the Northern and Southern Deserts of Rho. Crocodiles and caimans crowd the waterline while orcs, dervishes, madmen, undead and roaming sand giants make the dunes increasingly dangerous away from the safer camps. A tall tower rising from the lake also contains the one-way mortal portal to the Realm of Malice. Recommended levels 10–20. Oasis separates North Rho from South Rho. Characters level 46+ can reach the Realm of Malice through the one-way portal at the tower in the lake; the Realm of Malice raid instance is accessed from the same tower.",
  requirements: {
    killsIn: { zoneId: "cindersong_mountains", count: 414 }
  },
  copperReward: { min: 39, max: 64 },
  aggroChance: 0.034,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.19, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.066, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.066 },
    { itemId: "health_potion", dropRate: 0.066 },
  ],
  global: {},
  enemies: [
    { id: "eq_crocodiles", weight: 1.0, loot: [] },
    { id: "eq_caimans", weight: 1.0, loot: [] },
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_dervishes", weight: 1.0, loot: [] },
    { id: "eq_madmen", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_zombies", weight: 1.0, loot: [] },
    { id: "eq_mummies", weight: 1.0, loot: [] },
    { id: "eq_dry_bones", weight: 1.0, loot: [] },
    { id: "eq_pumas", weight: 1.0, loot: [] },
    { id: "eq_scarabs", weight: 1.0, loot: [] },
    { id: "eq_sand_giants", weight: 1.0, loot: [] },
    { id: "eq_ironjaw", weight: 0.1, loot: [] },
    { id: "eq_hatarr", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
