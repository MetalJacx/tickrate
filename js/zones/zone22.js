// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "East Commonlands" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 22,
  id: "east_commonwilds",
  name: "East Commonwilds",
  levelRange: [2, 12],
  description: "East Commonwilds is the open frontier immediately west of Portholme, with broad grasslands, scattered ruins and well-traveled roads linking the city to Nocturas Forest and the Desert of Rho. Low-level wildlife and orcs dominate the safer stretches, while dervishes, undead, will-o-wisps and occasional stronger roamers make the countryside progressively more hazardous away from the gates.",
  requirements: {
    killsIn: { zoneId: "rathkeep_mountains", count: 270 }
  },
  copperReward: { min: 21, max: 35 },
  aggroChance: 0.021,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.206, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.072, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.072 },
    { itemId: "health_potion", dropRate: 0.072 },
  ],
  global: {},
  enemies: [
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_dervishes", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_bears", weight: 1.0, loot: [] },
    { id: "eq_pumas", weight: 1.0, loot: [] },
    { id: "eq_scarabs", weight: 1.0, loot: [] },
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_zombies", weight: 1.0, loot: [] },
    { id: "eq_mummies", weight: 1.0, loot: [] },
    { id: "eq_will_o_wisps", weight: 1.0, loot: [] },
    { id: "eq_griffins", weight: 1.0, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
