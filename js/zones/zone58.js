// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Kedge Keep" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 58,
  id: "kelpe_keep",
  name: "Kelpe Keep",
  levelRange: [37, 45],
  description: "Kelpe Keep is a drowned fortress hidden beneath Dargon's Cauldron and one of EverQuest's most unusual dungeons because nearly the entire adventure takes place underwater. Its chambers are filled with hostile sea life and mermaids, with powerful named creatures guarding valuable loot deeper inside. Reliable underwater breathing and careful vertical pulling are essential because enemies can be above or below you as easily as across a room. The recommended leveling range is 37–45 and the zone provides considerable bonus exp. Don't forget to bring a fishbone earring!",
  requirements: {
    killsIn: { zoneId: "naganoxs_lair", count: 558 }
  },
  copperReward: { min: 96, max: 158 },
  aggroChance: 0.076,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.138, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.048, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.048 },
    { itemId: "health_potion", dropRate: 0.048 },
  ],
  global: {},
  enemies: [
    { id: "eq_sharks", weight: 1.0, loot: [] },
    { id: "eq_piranhas", weight: 1.0, loot: [] },
    { id: "eq_swordfish", weight: 1.0, loot: [] },
    { id: "eq_seahorses", weight: 1.0, loot: [] },
    { id: "eq_mermaids", weight: 1.0, loot: [] },
    { id: "eq_sailfins", weight: 1.0, loot: [] },
    { id: "eq_aqua_goblins", weight: 1.0, loot: [] },
    { id: "eq_phinigel_autropar", weight: 0.1, loot: [] },
    { id: "eq_estrella_of_gloomtide", weight: 0.1, loot: [] },
    { id: "eq_a_fierce_impaler", weight: 0.1, loot: [] },
    { id: "eq_cauldronseethe", weight: 0.1, loot: [] },
    { id: "eq_cauldronfroth", weight: 0.1, loot: [] },
    { id: "eq_coilspine_guardian", weight: 0.1, loot: [] },
    { id: "eq_a_seahorse_patriarch", weight: 0.1, loot: [] },
    { id: "eq_shellara_tidehunter", weight: 0.1, loot: [] },
    { id: "eq_riptide", weight: 0.1, loot: [] },
    { id: "eq_a_frenzied_bull_shark", weight: 0.1, loot: [] },
    { id: "eq_a_seahorse_matriarch", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
