// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Mistmoore Castle" (Faydwer)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 53,
  id: "mistmourn_castle",
  name: "Mistmourn Castle",
  levelRange: [18, 35],
  description: "Mistmourn Castle is a vampire stronghold hidden beyond Lesser Faedark, with a maze-like approach, dense social aggro and progressively harder castle interiors. the Legendrealm has refreshed the zone’s population and loot, and its mixture of vampires, undead servants, familiars and gargoyles makes it one of Faedrun’s signature mid-level dungeons.",
  requirements: {
    killsIn: { zoneId: "temple_of_zaic_thal", count: 518 }
  },
  copperReward: { min: 64, max: 106 },
  aggroChance: 0.052,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.167, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.058, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.058 },
    { itemId: "health_potion", dropRate: 0.058 },
  ],
  global: {},
  enemies: [
    { id: "eq_vampires", weight: 1.0, loot: [] },
    { id: "eq_dhampyres", weight: 1.0, loot: [] },
    { id: "eq_ghouls", weight: 1.0, loot: [] },
    { id: "eq_gargoyles", weight: 1.0, loot: [] },
    { id: "eq_familiars", weight: 1.0, loot: [] },
    { id: "eq_undead_servants", weight: 1.0, loot: [] },
    { id: "eq_gypsies", weight: 1.0, loot: [] },
    { id: "eq_werewolves", weight: 1.0, loot: [] },
    { id: "eq_princess_cheriste", weight: 0.1, loot: [] },
    { id: "eq_a_hemo_enologist", weight: 0.1, loot: [] },
    { id: "eq_an_imp_familiar", weight: 0.1, loot: [] },
    { id: "eq_a_dark_librarian", weight: 0.1, loot: [] },
    { id: "eq_a_glyphed_ghoul", weight: 0.1, loot: [] },
    { id: "eq_garton_viswyn", weight: 0.1, loot: [] },
    { id: "eq_enynthi", weight: 0.1, loot: [] },
    { id: "eq_a_cloaked_dhampyre", weight: 0.1, loot: [] },
    { id: "eq_an_avenging_caitiff", weight: 0.1, loot: [] },
    { id: "eq_steward_syncall", weight: 0.1, loot: [] },
    { id: "eq_maid_issara", weight: 0.1, loot: [] },
    { id: "eq_lasna_cheron", weight: 0.1, loot: [] },
    { id: "eq_a_fallen_noble", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
