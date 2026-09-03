// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Gorge of King Xorbb" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 45,
  id: "gorge_of_king_zorbb",
  name: "Gorge of King Zorbb",
  levelRange: [12, 18],
  description: "Gorge of King Zorbb, also known as Beholder’s Maze, is a twisting network of narrow ravines between East Karrow and Weepeye. Goblin scouts share the cramped passages with muddites and powerful minotaurs, while the zone’s signature evil eyes bring dangerous spellcasting and charm into terrain where nearby enemies are rarely far away. Recommended range is 12–18, although named evil eyes and King Zorbb himself can be substantially higher level.",
  requirements: {
    killsIn: { zoneId: "nazjena", count: 454 }
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
    { id: "eq_goblins", weight: 1.0, loot: [] },
    { id: "eq_muddites", weight: 1.0, loot: [] },
    { id: "eq_minotaurs", weight: 1.0, loot: [] },
    { id: "eq_evil_eyes", weight: 1.0, loot: [] },
    { id: "eq_an_evil_eye", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
