// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Blackburrow" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 28,
  id: "duskburrow",
  name: "Duskburrow",
  levelRange: [5, 20],
  description: "Duskburrow is the stronghold of the Duskburrow gnolls, a layered cave network linking Qaelyn Hills with Everrime Peaks. The upper tunnels mix open ledges with a notorious central pit, while deeper rooms pack increasingly dangerous gnoll guards, shamans and commanders into tight spaces where trains can escalate quickly. The recommended range is 5–20. the Legendrealm has revamped Duskburrow with updated population and loot, so its useful progression extends beyond the original classic-era low teens.",
  requirements: {
    killsIn: { zoneId: "crookbone", count: 318 }
  },
  copperReward: { min: 34, max: 56 },
  aggroChance: 0.03,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.195, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.068, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.068 },
    { itemId: "health_potion", dropRate: 0.068 },
  ],
  global: {},
  enemies: [
    { id: "eq_gnolls", weight: 1.0, loot: [] },
    { id: "eq_gnoll_shamans", weight: 1.0, loot: [] },
    { id: "eq_gnoll_guards", weight: 1.0, loot: [] },
    { id: "eq_giant_snakes", weight: 1.0, loot: [] },
    { id: "eq_plague_rats", weight: 1.0, loot: [] },
    { id: "eq_razorgills", weight: 1.0, loot: [] },
    { id: "eq_bears", weight: 1.0, loot: [] },
    { id: "eq_master_distiller", weight: 0.1, loot: [] },
    { id: "eq_refugee_cleftpaw_monk", weight: 0.1, loot: [] },
    { id: "eq_cleftpaw_sharpshooter", weight: 0.1, loot: [] },
    { id: "eq_cleftpaw_commander", weight: 0.1, loot: [] },
    { id: "eq_fangtusk_overseer", weight: 0.1, loot: [] },
    { id: "eq_lord_elgrun_rare", weight: 0.1, loot: [] },
    { id: "eq_fangtusk_clan_necromancer", weight: 0.1, loot: [] },
    { id: "eq_socho_nightpaw", weight: 0.1, loot: [] },
    { id: "eq_mannan_of_the_fangtusk", weight: 0.1, loot: [] },
    { id: "eq_cleftpaw_explorer", weight: 0.1, loot: [] },
    { id: "eq_lord_elgrun", weight: 0.1, loot: [] },
    { id: "eq_refugee_cleftpaw", weight: 0.1, loot: [] },
    { id: "eq_the_gnoll_high_shaman", weight: 0.1, loot: [] },
    { id: "eq_a_gnoll_commander", weight: 0.1, loot: [] },
    { id: "eq_an_elite_gnoll_guard", weight: 0.1, loot: [] },
    { id: "eq_a_giant_plague_rat", weight: 0.1, loot: [] },
    { id: "eq_various_gnolls", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
