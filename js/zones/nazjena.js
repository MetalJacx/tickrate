// Auto-generated from EQ Legends Tools zone data (renamed to avoid reusing EverQuest IP).
// Source zone: "Najena" (Antonica)
// TODO: review pacing/requirements, add itemized loot once corresponding items.js entries exist.
export default {
  zoneNumber: 44,
  id: "nazjena",
  name: "Nazjena",
  levelRange: [11, 27],
  description: "Nazjena is a hidden laboratory-dungeon carved into the Cindersong Mountains by the dark elf magician whose name it bears. Skeleton-packed front rooms lead toward ogre guards, elementals, goblin and dark elf spellcasters, spiders, froglok undead and stranger experiments, with keys controlling access to several deeper sections. Recommended range is 11–27. the Legendrealm has revamped Nazjena with smoother progression, new named enemies and improved loot. Dispose of Drelzna to acquire some Journeyman's Boots.",
  requirements: {
    killsIn: { zoneId: "sea_of_sorrows", count: 446 }
  },
  copperReward: { min: 48, max: 79 },
  aggroChance: 0.04,
  globalLoot: [
    { itemId: "copper_ore", dropRate: 0.182, minQty: 1, maxQty: 4 },
    { itemId: "health_potion_small", dropRate: 0.064, minQty: 1, maxQty: 2 },
    { itemId: "mana_potion", dropRate: 0.064 },
    { itemId: "health_potion", dropRate: 0.064 },
  ],
  global: {},
  enemies: [
    { id: "eq_skeletons", weight: 1.0, loot: [] },
    { id: "eq_ogre_guards", weight: 1.0, loot: [] },
    { id: "eq_magicians", weight: 1.0, loot: [] },
    { id: "eq_necromancers", weight: 1.0, loot: [] },
    { id: "eq_elementals", weight: 1.0, loot: [] },
    { id: "eq_goblins", weight: 1.0, loot: [] },
    { id: "eq_giant_spiders", weight: 1.0, loot: [] },
    { id: "eq_froglok_ghouls", weight: 1.0, loot: [] },
    { id: "eq_tentacle_terrors", weight: 1.0, loot: [] },
    { id: "eq_dark_elves", weight: 1.0, loot: [] },
    { id: "eq_fallen_crusader", weight: 0.1, loot: [] },
    { id: "eq_the_guard_captain", weight: 0.1, loot: [] },
    { id: "eq_unbound_ember", weight: 0.1, loot: [] },
    { id: "eq_drezna", weight: 0.1, loot: [] },
    { id: "eq_the_bonecrusher", weight: 0.1, loot: [] },
    { id: "eq_bonesplitter", weight: 0.1, loot: [] },
    { id: "eq_officer_grosh", weight: 0.1, loot: [] },
    { id: "eq_a_tentacle_terror", weight: 0.1, loot: [] },
    { id: "eq_the_widowkeeper", weight: 0.1, loot: [] },
    { id: "eq_a_visiting_priestess", weight: 0.1, loot: [] },
    { id: "eq_nazjena_npc", weight: 0.1, loot: [] },
    { id: "eq_rathael_reincarnate", weight: 0.1, loot: [] },
    { id: "eq_rathael", weight: 0.1, loot: [] },
    { id: "eq_trazdorn", weight: 0.1, loot: [] },
    { id: "eq_the_blood_artisan", weight: 0.1, loot: [] },
    { id: "eq_a_greater_skeleton", weight: 0.1, loot: [] },
    { id: "eq_ekaros", weight: 0.1, loot: [] },
  ],
  subAreas: [
    { id: "open_world", name: "Open World", discovered: true, discoveryChance: 0, mobWeightModifiers: {} }
  ]
};
