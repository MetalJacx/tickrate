// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Rathe Mountains" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 21,
  id: "rathkeep_mountains",
  name: "Rathkeep Mountains",
  levelRange: [1, 37],
  description: "Rathkeep Mountains is a sprawling maze of valleys and ridgelines along Ostrallis’s southern overland route. Its scattered camps support everything from low-level lizard men and wildlife to drakes, undead, cyclopes and hill giants, with unusually powerful named enemies hidden among otherwise modest hunting areas. The 1–37 range covers the broad spread of ordinary hunting, including the popular Hill Giants whose pockets are heavy with platinum pieces.",
  requirements: {
    killsIn: { zoneId: "everrime_peaks", count: 262 }
  },
  copperReward: { min: 48, max: 79 },
  aggroChance: 0.04,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.182, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.064, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.064 },
    { itemId: "health_potion", dropRate: 0.064 },
  ],
  global: {},
  enemies: [
    { id: "eq_lizard_men", weight: 1.0, loot: [] },
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_undead", weight: 1.0, loot: [] },
    { id: "eq_bears", weight: 1.0, loot: [] },
    { id: "eq_drakes", weight: 1.0, loot: [] },
    { id: "eq_basilisks", weight: 1.0, loot: [] },
    { id: "eq_cyclopes", weight: 1.0, loot: [] },
    { id: "eq_hill_giants", weight: 1.0, loot: [] },
    { id: "eq_grazhak_the_frenzied", weight: 0.1, loot: [] },
    { id: "eq_quid_rillstone", weight: 0.1, loot: [] },
    { id: "eq_glaron_the_vile", weight: 0.1, loot: [] },
    { id: "eq_brother_zephron", weight: 0.1, loot: [] },
    { id: "eq_mortificator_syythrek", weight: 0.1, loot: [] },
    { id: "eq_wingshard", weight: 0.1, loot: [] },
    { id: "eq_petrifyn", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
