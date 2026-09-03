// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "New Sebilis Expedition" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 19,
  id: "new_sebilith_expedition",
  name: "New Sebilith Expedition",
  levelRange: [1, 12],
  description: "New Sebilith Expedition is the the Legendrealm starting settlement for Iksar characters, an expedition outpost established over mysterious ruins beneath the Desert of Rho. Beyond its protected vendor and guild areas, the newly opened lower passages lead into a beginner dungeon filled with restless undead, ghosts, spiderlings and failed experiments tied to the buried site’s history. the Legendrealm introduced this zone as the Iksar starting home and later opened the barricaded dungeon section. Many races use this zone to purchase all class spells by swapping to a Rogue class and sneaking behind the merchants to buy.",
  requirements: {
    killsIn: { zoneId: "steamvent_mountains", count: 246 }
  },
  copperReward: { min: 20, max: 33 },
  aggroChance: 0.02,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.207, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.072, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.072 },
    { itemId: "health_potion", dropRate: 0.072 },
  ],
  global: {},
  enemies: [
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_scalebones", weight: 1.0, loot: [] },
    { id: "eq_iksar_ghosts", weight: 1.0, loot: [] },
    { id: "eq_sarnak_ghosts", weight: 1.0, loot: [] },
    { id: "eq_spiderlings", weight: 1.0, loot: [] },
    { id: "eq_wraiths", weight: 1.0, loot: [] },
    { id: "eq_failed_experiments", weight: 1.0, loot: [] },
    { id: "eq_undead", weight: 1.0, loot: [] },
    { id: "eq_saurnak_spectres", weight: 0.1, loot: [] },
    { id: "eq_a_vitrified_skeleton", weight: 0.1, loot: [] },
    { id: "eq_burning_wraith", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
