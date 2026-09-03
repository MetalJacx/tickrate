// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Nektulos Forest" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 16,
  id: "nocturas_forest",
  name: "Nocturas Forest",
  levelRange: [1, 11],
  description: "Nocturas Forest is the shadowed woodland surrounding the dark elven city of Neriak. The cramped newbie grounds quickly give way to aggressive wolves, undead, bears, halfling camps and powerful Teir’Dal patrols, with routes north toward Cindersong and south toward the Commonwilds. The recommended range is 1–11 for ordinary hunting; the dark elf dragoons and several roaming threats are dramatically higher level. Great zone for culling halflings.",
  requirements: {
    killsIn: { zoneId: "foggy_coppice", count: 222 }
  },
  copperReward: { min: 19, max: 31 },
  aggroChance: 0.02,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.208, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.073, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.073 },
    { itemId: "health_potion", dropRate: 0.073 },
  ],
  global: {},
  enemies: [
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_fire_beetles", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_mummies", weight: 1.0, loot: [] },
    { id: "eq_bears", weight: 1.0, loot: [] },
    { id: "eq_halflings", weight: 1.0, loot: [] },
    { id: "eq_shadowed_men", weight: 1.0, loot: [] },
    { id: "eq_dark_elf_guards", weight: 1.0, loot: [] },
    { id: "eq_dragoon_tsanner", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
