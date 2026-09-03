// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Plane of Fear" (Planes)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 60,
  id: "realm_of_dread",
  name: "Realm of Dread",
  levelRange: [46, 56],
  description: "The Realm of Dread is Zaic-Thal’s blood-red realm, where enormous aggro ranges and hostile planar creatures turn even the zone-in into a raid problem. Golems, scarelings, tentacled terrors, evil eyes, nightmares and other servants of fear surround major encounters including the dracoliche and Zaic-Thal himself. Minimum player level 46. This is a raid zone; monsters are generally level 48+ and many enemies see through invisibility. The scarelings and phantasms present a unique challenge.",
  requirements: {
    killsIn: { zoneId: "the_chasm", count: 574 }
  },
  copperReward: { min: 118, max: 195 },
  aggroChance: 0.092,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.118, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.041, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.041 },
    { itemId: "health_potion", dropRate: 0.041 },
  ],
  global: {},
  enemies: [
    { id: "eq_fear_golems", weight: 1.0, loot: [] },
    { id: "eq_scarelings", weight: 1.0, loot: [] },
    { id: "eq_tentacle_terrors", weight: 1.0, loot: [] },
    { id: "eq_evil_eyes", weight: 1.0, loot: [] },
    { id: "eq_nightmares", weight: 1.0, loot: [] },
    { id: "eq_shiverbacks", weight: 1.0, loot: [] },
    { id: "eq_dracoliche", weight: 1.0, loot: [] },
    { id: "eq_a_dracoliche", weight: 0.1, loot: [] },
    { id: "eq_zaic_thal_god", weight: 0.1, loot: [] },
    { id: "eq_panic", weight: 0.1, loot: [] },
    { id: "eq_a_scareling", weight: 0.1, loot: [] },
    { id: "eq_a_turmoil_toad", weight: 0.1, loot: [] },
    { id: "eq_terror_dread_and_panic", weight: 0.1, loot: [] },
    { id: "eq_a_samhain", weight: 0.1, loot: [] },
    { id: "eq_amygdaline_knight", weight: 0.1, loot: [] },
    { id: "eq_a_glare_lord", weight: 0.1, loot: [] },
    { id: "eq_dracolich", weight: 0.1, loot: [] },
    { id: "eq_a_gorgon", weight: 0.1, loot: [] },
    { id: "eq_a_spinechiller_spider", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
