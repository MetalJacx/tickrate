// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Highpass Hold" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 50,
  id: "highridge_hold",
  name: "Highridge Hold",
  levelRange: [16, 26],
  description: "Highridge Hold is the fortified mountain pass linking eastern and western Ostrallis. Gnolls pressure the northern approach while Shralok orcs dominate the southern side, with guards, smugglers and bandits occupying the settlement between them. The recommended range is 16–26. The zone functions both as a hunting ground and as the central travel corridor between East Karrow, Kethicore and Highridge Keep.",
  requirements: {
    killsIn: { zoneId: "south_karrow", count: 494 }
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
    { id: "eq_gnolls", weight: 1.0, loot: [] },
    { id: "eq_gnoll_shamans", weight: 1.0, loot: [] },
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_orc_casters", weight: 1.0, loot: [] },
    { id: "eq_bandits", weight: 1.0, loot: [] },
    { id: "eq_smugglers", weight: 1.0, loot: [] },
    { id: "eq_grenix_mudtail", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
