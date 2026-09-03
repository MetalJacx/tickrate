// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "West Freeport" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 8,
  id: "west_portholme",
  name: "West Portholme",
  levelRange: [1, 3],
  description: "West Portholme is one of the central districts of the sprawling human city of Portholme, packed with guild halls, merchants, taverns and militia patrols. It serves as a major travel hub between the other Portholme districts and the Commonwilds beyond the western gate.",
  requirements: {
    killsIn: { zoneId: "north_qaelyn", count: 158 }
  },
  copperReward: { min: 10, max: 16 },
  aggroChance: 0.013,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.216, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.076, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.076 },
    { itemId: "health_potion", dropRate: 0.076 },
  ],
  global: {},
  enemies: [
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_rats", weight: 1.0, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
