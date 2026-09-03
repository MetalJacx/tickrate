// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Misty Thicket" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 15,
  id: "foggy_coppice",
  name: "Foggy Coppice",
  levelRange: [1, 10],
  description: "Misty Thicket is the halfling homeland outside Rivervale, split by an old defensive wall into a very safe eastern newbie area and a rougher western half. Wildlife, bixies and insects dominate the safer side, while goblins, orcs and occasional undead become more common toward Weepeye. The wall makes the 1–10 progression unusually forgiving, though named goblins such as Mooto are much tougher than nearby common spawns.",
  requirements: {
    killsIn: { zoneId: "ferrowake", count: 214 }
  },
  copperReward: { min: 18, max: 30 },
  aggroChance: 0.019,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.209, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.073, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.073 },
    { itemId: "health_potion", dropRate: 0.073 },
  ],
  global: {},
  enemies: [
    { id: "eq_rats", weight: 1.0, loot: [] },
    { id: "eq_bats", weight: 1.0, loot: [] },
    { id: "eq_snakes", weight: 1.0, loot: [] },
    { id: "eq_bixies", weight: 1.0, loot: [] },
    { id: "eq_wasps", weight: 1.0, loot: [] },
    { id: "eq_spiders", weight: 1.0, loot: [] },
    { id: "eq_goblins", weight: 1.0, loot: [] },
    { id: "eq_orcs", weight: 1.0, loot: [] },
    { id: "eq_undead", weight: 1.0, loot: [] },
    { id: "eq_mooto_the_goblin_shaman", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
