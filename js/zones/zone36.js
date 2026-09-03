// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "East Karana" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 36,
  id: "east_karrow",
  name: "East Karrow",
  levelRange: [8, 20],
  description: "East Karrow is a rugged, rocky stretch of the Karrow plains squeezed between long passes and river crossings. Its hills are shared by lions, spiders, bandits, wolves and gnolls, with griffins, evil eyes, cyclopes, hill giants and treants appearing as the difficulty climbs toward the zone’s upper reaches. The recommended range is 8–20, although several roaming giants, griffins and cyclopes present a much greater threat.",
  requirements: {
    killsIn: { zoneId: "south_rho", count: 382 }
  },
  copperReward: { min: 37, max: 61 },
  aggroChance: 0.032,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.192, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.067, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.067 },
    { itemId: "health_potion", dropRate: 0.067 },
  ],
  global: {},
  enemies: [
    { id: "eq_lions", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_bandits", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_gnolls", weight: 1.0, loot: [] },
    { id: "eq_gorge_hounds", weight: 1.0, loot: [] },
    { id: "eq_griffawns", weight: 1.0, loot: [] },
    { id: "eq_griffins", weight: 1.0, loot: [] },
    { id: "eq_evil_eyes", weight: 1.0, loot: [] },
    { id: "eq_cyclopes", weight: 1.0, loot: [] },
    { id: "eq_hill_giants", weight: 1.0, loot: [] },
    { id: "eq_treants", weight: 1.0, loot: [] },
    { id: "eq_an_evil_eye", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
