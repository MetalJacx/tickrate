// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Plane of Sky" (Planes)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 62,
  id: "skyward_expanse",
  name: "Skyward Expanse",
  levelRange: [46, 56],
  description: "The Skyward Expanse is a chain of floating islands suspended high above Norrath, built around keyed progression from island to island. Each island introduces increasingly dangerous planar creatures and raid encounters, with many of the zone’s signature class quests and rewards tied to its bosses and island inhabitants. Minimum player level 46. This is much like a raid zone, but without the raid voidling and lockout timers; ordinary enemies begin around level 50 and island progression is gated by keys.",
  requirements: {
    killsIn: { zoneId: "realm_of_malice", count: 590 }
  },
  copperReward: { min: 118, max: 195 },
  aggroChance: 0.092,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.118, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.041, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.041 },
    { itemId: "health_potion", dropRate: 0.041 },
  ],
  global: {},
  enemies: [
    { id: "eq_thunder_spirits", weight: 1.0, loot: [] },
    { id: "eq_air_elementals", weight: 1.0, loot: [] },
    { id: "eq_harpies", weight: 1.0, loot: [] },
    { id: "eq_griffons", weight: 1.0, loot: [] },
    { id: "eq_gorgalasks", weight: 1.0, loot: [] },
    { id: "eq_spirocs", weight: 1.0, loot: [] },
    { id: "eq_drakes", weight: 1.0, loot: [] },
    { id: "eq_djinn", weight: 1.0, loot: [] },
    { id: "eq_a_blade_storm", weight: 0.1, loot: [] },
    { id: "eq_a_soul_harvester", weight: 0.1, loot: [] },
    { id: "eq_a_thunder_spirit", weight: 0.1, loot: [] },
    { id: "eq_a_gust_of_wind", weight: 0.1, loot: [] },
    { id: "eq_a_thunder_spirit_princess", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
