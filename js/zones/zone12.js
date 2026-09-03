// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Butcherblock Mountains" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 12,
  id: "cleaverblock_mountains",
  name: "Cleaverblock Mountains",
  levelRange: [1, 8],
  description: "Cleaverblock Mountains is a rugged coastal region surrounding the dwarven homeland of Kaladim, with broad newbie hunting grounds that give way to goblin camps, bandits and dangerous undead pockets. The open terrain makes it easy to move between camps, while the docks on the eastern coast connect Faedrun to the Sea of Sorrows. The recommended range is 1–8 for ordinary progression, though several isolated camps and named creatures are substantially higher level.",
  requirements: {
    killsIn: { zoneId: "greater_faedark", count: 190 }
  },
  copperReward: { min: 16, max: 26 },
  aggroChance: 0.017,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.211, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.074, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.074 },
    { itemId: "health_potion", dropRate: 0.074 },
  ],
  global: {},
  enemies: [
    { id: "eq_bats", weight: 1.0, loot: [] },
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_goblins", weight: 1.0, loot: [] },
    { id: "eq_dwarf_bandits", weight: 1.0, loot: [] },
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_kobolds", weight: 1.0, loot: [] },
    { id: "eq_giant_scarabs", weight: 1.0, loot: [] },
    { id: "eq_aqua_goblins", weight: 1.0, loot: [] },
    { id: "eq_a_goblin_shaman_a_goblin_wizard", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
