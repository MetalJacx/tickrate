// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Befallen" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 32,
  id: "befallow",
  name: "Befallow",
  levelRange: [6, 25],
  description: "Befallen is a ruined, multi-level crypt tucked beneath the western Commonwilds. Its narrow halls are packed with undead and dark cultists, and progression through the deeper floors revolves around keys carried by shadow knights. It is especially attractive for groups hunting named enemies and early gear upgrades, but the tight rooms make careless pulls dangerous. Most of the regular hunting fits the 6–25 range. The basement camps yield a handful of powerful weapons and leather armor.",
  requirements: {
    killsIn: { zoneId: "kerrow_isle", count: 350 }
  },
  copperReward: { min: 40, max: 66 },
  aggroChance: 0.035,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.189, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.066, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.066 },
    { itemId: "health_potion", dropRate: 0.066 },
  ],
  global: {},
  enemies: [
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_ghouls", weight: 1.0, loot: [] },
    { id: "eq_mummies", weight: 1.0, loot: [] },
    { id: "eq_necromancers", weight: 1.0, loot: [] },
    { id: "eq_shadow_knights", weight: 1.0, loot: [] },
    { id: "eq_dark_elves", weight: 1.0, loot: [] },
    { id: "eq_knight_vtan", weight: 0.1, loot: [] },
    { id: "eq_footman_of_vzhen", weight: 0.1, loot: [] },
    { id: "eq_a_shadowknight_troll", weight: 0.1, loot: [] },
    { id: "eq_asaka_lrein", weight: 0.1, loot: [] },
    { id: "eq_kahaptra_ztan", weight: 0.1, loot: [] },
    { id: "eq_korven_nisera", weight: 0.1, loot: [] },
    { id: "eq_baron_telyx_vzhen", weight: 0.1, loot: [] },
    { id: "eq_soldier_of_vzhen", weight: 0.1, loot: [] },
    { id: "eq_skeleton_lrodde", weight: 0.1, loot: [] },
    { id: "eq_risen_theurge", weight: 0.1, loot: [] },
    { id: "eq_a_shadowknight_dark_elf_female", weight: 0.1, loot: [] },
    { id: "eq_a_necro_theurgist", weight: 0.1, loot: [] },
    { id: "eq_the_thaumaturgist", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
