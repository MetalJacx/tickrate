// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Toxxulia Forest" (Odus)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 13,
  id: "toxwillow_forest",
  name: "Toxwillow Forest",
  levelRange: [1, 8],
  description: "Toxwillow Forest is the shadowy woodland surrounding the Ehrudite settlements of Odrai. Its northern areas provide forgiving early hunting, while the southern forest grows more dangerous with kobolds, undead and hostile casters. The river and dense terrain can make navigation surprisingly tricky for a starting zone. Ehrudite/Kerrown noobie starting area. The southern half near Painmere is noticeably more dangerous than the north.",
  requirements: {
    killsIn: { zoneId: "cleaverblock_mountains", count: 198 }
  },
  copperReward: { min: 16, max: 26 },
  aggroChance: 0.017,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.211, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.074, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.074 },
    { itemId: "health_potion", dropRate: 0.074 },
  ],
  global: {},
  enemies: [
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_spiderlings", weight: 1.0, loot: [] },
    { id: "eq_fire_beetles", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_kobolds", weight: 1.0, loot: [] },
    { id: "eq_piranhas", weight: 1.0, loot: [] },
    { id: "eq_poachers", weight: 1.0, loot: [] },
    { id: "eq_elementals", weight: 1.0, loot: [] },
    { id: "eq_spectres", weight: 1.0, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
