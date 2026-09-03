// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Innothule Swamp" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 9,
  id: "murkthule_swamp",
  name: "Murkthule Swamp",
  levelRange: [1, 6],
  description: "Murkthule Swamp is the murky homeland surrounding the troll city of Grobb. Its shallow waterways and dense vegetation are filled with snakes, alligators, undead, kobolds and fungus creatures, and it forms the southern travel corridor between the Ferrowake, Gukta and the Desert of Rho. The recommended range is 1–6 for the ordinary swamp hunting grounds, with scattered higher-level enemies elsewhere in the zone. Lynuga roams the swamp, searching for rubies.",
  requirements: {
    killsIn: { zoneId: "west_portholme", count: 166 }
  },
  copperReward: { min: 14, max: 23 },
  aggroChance: 0.016,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.213, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.075, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.075 },
    { itemId: "health_potion", dropRate: 0.075 },
  ],
  global: {},
  enemies: [
    { id: "eq_rats", weight: 1.0, loot: [] },
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_alligators", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_zombies", weight: 1.0, loot: [] },
    { id: "eq_kobolds", weight: 1.0, loot: [] },
    { id: "eq_fungus_men", weight: 1.0, loot: [] },
    { id: "eq_frogloks", weight: 1.0, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
