// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Qeynos Hills" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 10,
  id: "qaelyn_hills",
  name: "Qaelyn Hills",
  levelRange: [1, 7],
  description: "Qaelyn Hills is the wooded low-level region outside Qaelyn and an important western Ostrallis crossroads. New adventurers hunt wildlife, undead and Duskburrow gnolls here, while roads lead onward toward the Karrows, Surefall Glade and the gnoll tunnels beneath the mountains. Give fisherman Hadden a visit at his pond in the northwest to obtain the coveted Fishbone Earring.",
  requirements: {
    killsIn: { zoneId: "murkthule_swamp", count: 174 }
  },
  copperReward: { min: 15, max: 25 },
  aggroChance: 0.016,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.212, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.074, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.074 },
    { itemId: "health_potion", dropRate: 0.074 },
  ],
  global: {},
  enemies: [
    { id: "eq_gnolls", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_bears", weight: 1.0, loot: [] },
    { id: "eq_rats", weight: 1.0, loot: [] },
    { id: "eq_bats", weight: 1.0, loot: [] },
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_rabid_wildlife", weight: 1.0, loot: [] },
    { id: "eq_pyzjyn", weight: 0.1, loot: [] },
    { id: "eq_haddin", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
