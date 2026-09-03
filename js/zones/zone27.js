// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Crushbone" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 27,
  id: "crookbone",
  name: "Crookbone",
  levelRange: [5, 17],
  description: "Crookbone is the fortified home of the Crookbone orc clan, a compact dungeon of tents, slave pens and castle rooms packed closely enough that bad pulls can rapidly become trains. the Legendrealm has revamped the zone with additional named enemies and fresh loot, while the throne-room end of the dungeon remains its most dangerous early-game camp. The recommended range is 5–17, while the Legends revamp adds named encounters reaching roughly level 20.",
  requirements: {
    killsIn: { zoneId: "west_karrow", count: 310 }
  },
  copperReward: { min: 30, max: 50 },
  aggroChance: 0.028,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.198, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.069, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.069 },
    { itemId: "health_potion", dropRate: 0.069 },
  ],
  global: {},
  enemies: [
    { id: "eq_orc_pawns", weight: 1.0, loot: [] },
    { id: "eq_orc_centurions", weight: 1.0, loot: [] },
    { id: "eq_orc_legionnaires", weight: 1.0, loot: [] },
    { id: "eq_orc_slavers", weight: 1.0, loot: [] },
    { id: "eq_orc_oracles", weight: 1.0, loot: [] },
    { id: "eq_orc_emissaries", weight: 1.0, loot: [] },
    { id: "eq_orc_royal_guards", weight: 1.0, loot: [] },
    { id: "eq_lord_darrish", weight: 0.1, loot: [] },
    { id: "eq_ambassador_dovenne", weight: 0.1, loot: [] },
    { id: "eq_bonepyre", weight: 0.1, loot: [] },
    { id: "eq_orc_warmonger", weight: 0.1, loot: [] },
    { id: "eq_bloodgargler", weight: 0.1, loot: [] },
    { id: "eq_emperor_krush", weight: 0.1, loot: [] },
    { id: "eq_orc_trainer", weight: 0.1, loot: [] },
    { id: "eq_orc_oracle", weight: 0.1, loot: [] },
    { id: "eq_the_oracle", weight: 0.1, loot: [] },
    { id: "eq_marnowbane", weight: 0.1, loot: [] },
    { id: "eq_orc_slaver", weight: 0.1, loot: [] },
    { id: "eq_orc_warlord", weight: 0.1, loot: [] },
    { id: "eq_chokegrip", weight: 0.1, loot: [] },
    { id: "eq_orc_legionnaire", weight: 0.1, loot: [] },
    { id: "eq_orc_taskmaster", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
