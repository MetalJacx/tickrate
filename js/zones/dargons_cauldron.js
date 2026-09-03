// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Dagnor's Cauldron" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 48,
  id: "dargons_cauldron",
  name: "Dargon's Cauldron",
  levelRange: [15, 20],
  description: "Dagnor’s Cauldron is a broken, barren basin separating Cleaverblock Mountains from Malaise, with steep terrain surrounding a central lake. Roaming aqua goblins and undertow skeletons are the main threats, and the underwater entrance to Kelpe Keep makes the zone an important crossroads for higher-level adventurers. The recommended range is 15–20, although travelers bound for Malaise or Kelpe Keep may encounter higher-level threats. Be on the lookout for the fabled Bilge Farfathom.",
  requirements: {
    killsIn: { zoneId: "stonebrindle_mountains", count: 478 }
  },
  copperReward: { min: 44, max: 73 },
  aggroChance: 0.038,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.185, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.065, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.065 },
    { itemId: "health_potion", dropRate: 0.065 },
  ],
  global: {},
  enemies: [
    { id: "eq_aqua_goblins", weight: 1.0, loot: [] },
    { id: "eq_undertow_skeletons", weight: 1.0, loot: [] },
    { id: "eq_rats", weight: 1.0, loot: [] },
    { id: "eq_serpents", weight: 1.0, loot: [] },
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_goblin_shamans", weight: 1.0, loot: [] },
    { id: "eq_bilge_deepfathom", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
