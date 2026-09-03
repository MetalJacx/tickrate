// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Lavastorm Mountains" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 39,
  id: "cindersong_mountains",
  name: "Cindersong Mountains",
  levelRange: [10, 17],
  description: "Cindersong Mountains is a shattered volcanic basin of lava pits, broken ridges and scorched pathways surrounding Solmek’s Eye. Fire drakes, elementals, lava crawlers and goblins make it a natural mid-teen hunting ground, while shadowed men and other stronger creatures lurk in pockets well above the normal progression range. The recommended range is 10–17, while Shadowed men are higher level.",
  requirements: {
    killsIn: { zoneId: "upper_gukta", count: 406 }
  },
  copperReward: { min: 36, max: 59 },
  aggroChance: 0.032,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.193, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.068, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.068 },
    { itemId: "health_potion", dropRate: 0.068 },
  ],
  global: {},
  enemies: [
    { id: "eq_fire_drakes", weight: 1.0, loot: [] },
    { id: "eq_fire_elementals", weight: 1.0, loot: [] },
    { id: "eq_fire_sprites", weight: 1.0, loot: [] },
    { id: "eq_lava_crawlers", weight: 1.0, loot: [] },
    { id: "eq_rock_dervishes", weight: 1.0, loot: [] },
    { id: "eq_fire_imps", weight: 1.0, loot: [] },
    { id: "eq_lava_basilisks", weight: 1.0, loot: [] },
    { id: "eq_fire_goblins", weight: 1.0, loot: [] },
    { id: "eq_shadowed_men", weight: 1.0, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
