// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Runnyeye" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 41,
  id: "weepeye",
  name: "Weepeye",
  levelRange: [10, 24],
  description: "Weepeye is a compact goblin citadel built into the mountains beyond Misty Thicket. Its halls are dominated by goblin workers, guards, shamans and miners, with slimes and evil eyes adding variety deeper inside; tight corridors and clustered spawns make controlled pulls especially important. The supplied recommended range is 10–24, covering progression from the outer goblin ranks into the stronger inhabitants deeper in the citadel. The main attractions here are the Black Alloy Medallion and Blackened Alloy Bastard sword.",
  requirements: {
    killsIn: { zoneId: "oasis_of_marn", count: 422 }
  },
  copperReward: { min: 43, max: 71 },
  aggroChance: 0.037,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.186, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.065, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.065 },
    { itemId: "health_potion", dropRate: 0.065 },
  ],
  global: {},
  enemies: [
    { id: "eq_goblins", weight: 1.0, loot: [] },
    { id: "eq_goblin_shamans", weight: 1.0, loot: [] },
    { id: "eq_goblin_guards", weight: 1.0, loot: [] },
    { id: "eq_goblin_miners", weight: 1.0, loot: [] },
    { id: "eq_goblin_overseers", weight: 1.0, loot: [] },
    { id: "eq_slime_elementals", weight: 1.0, loot: [] },
    { id: "eq_evil_eyes", weight: 1.0, loot: [] },
    { id: "eq_a_clawrend_destroyer", weight: 0.1, loot: [] },
    { id: "eq_a_sporeling_defender", weight: 0.1, loot: [] },
    { id: "eq_a_goblin_knight", weight: 0.1, loot: [] },
    { id: "eq_warlord_paluk", weight: 0.1, loot: [] },
    { id: "eq_the_sporeling_moldmaster", weight: 0.1, loot: [] },
    { id: "eq_a_clawrend_foeseeker", weight: 0.1, loot: [] },
    { id: "eq_lord_clawrend", weight: 0.1, loot: [] },
    { id: "eq_an_evil_eye_prisoner", weight: 0.1, loot: [] },
    { id: "eq_a_clawrend_mindripper", weight: 0.1, loot: [] },
    { id: "eq_a_slime_elemental", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
