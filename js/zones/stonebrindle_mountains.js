// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Stonebrunt Mountains" (Odus)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 47,
  id: "stonebrindle_mountains",
  name: "Stonebrindle Mountains",
  levelRange: [14, 28],
  description: "Stonebrindle Mountains is a vast wilderness beyond The Burrows, shifting from jungle into valleys, rocky mountains and snowy highlands. Highland kobolds are common, but the zone also contains Kejekans, pandas, leopards, tigers, gorillas and powerful wandering Ancients, with long stretches of open terrain between camps. The typical progression range is 14–28. Some roaming creatures and named encounters are considerably more dangerous than the ordinary camps.",
  requirements: {
    killsIn: { zoneId: "icebound_keep", count: 470 }
  },
  copperReward: { min: 52, max: 86 },
  aggroChance: 0.044,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.178, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.062, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.062 },
    { itemId: "health_potion", dropRate: 0.062 },
  ],
  global: {},
  enemies: [
    { id: "eq_highland_kobolds", weight: 1.0, loot: [] },
    { id: "eq_kejekans", weight: 1.0, loot: [] },
    { id: "eq_pandas", weight: 1.0, loot: [] },
    { id: "eq_leopards", weight: 1.0, loot: [] },
    { id: "eq_tigers", weight: 1.0, loot: [] },
    { id: "eq_gorillas", weight: 1.0, loot: [] },
    { id: "eq_beetles", weight: 1.0, loot: [] },
    { id: "eq_jelquar_the_soulrender", weight: 0.1, loot: [] },
    { id: "eq_slyder_the_elder", weight: 0.1, loot: [] },
    { id: "eq_a_highland_kobold", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
