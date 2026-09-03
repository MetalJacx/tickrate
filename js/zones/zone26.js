// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "West Karana" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 26,
  id: "west_karrow",
  name: "West Karrow",
  levelRange: [5, 13],
  description: "West Karrow is the enormous westernmost plain of the Karrow region, stretching from Qaelyn Hills toward the northern plains. Its farms, roads and open grasslands are populated by bandits, wildlife, spiders and wandering undead, making travel distances as important a consideration as the enemies themselves. The recommended range is 5–13 for normal hunting, though named NPCs and roaming threats can be much stronger. Several bandit camps and the mid-level Ogre shaman camp are the main attractions.",
  requirements: {
    killsIn: { zoneId: "the_burrows", count: 302 }
  },
  copperReward: { min: 26, max: 43 },
  aggroChance: 0.024,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.202, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.071, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.071 },
    { itemId: "health_potion", dropRate: 0.071 },
  ],
  global: {},
  enemies: [
    { id: "eq_bandits", weight: 1.0, loot: [] },
    { id: "eq_wolves", weight: 1.0, loot: [] },
    { id: "eq_lions", weight: 1.0, loot: [] },
    { id: "eq_bears", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_scarecrows", weight: 1.0, loot: [] },
    { id: "eq_undead", weight: 1.0, loot: [] },
    { id: "eq_an_ogre_priestess", weight: 0.1, loot: [] },
    { id: "eq_a_werewolf", weight: 0.1, loot: [] },
    { id: "eq_an_ogre_shaman", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
