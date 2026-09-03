// Central enemy definitions. Zones reference these by id.
//
// Optional field: resists
// - If defined on an enemyDef, it will override racial resists from races.js
// - Format: { magic: number, elemental: number, contagion: number, physical: number }
// - If omitted, racial resists (if any) will be applied automatically

export const MOBS = {
  // Zone 1 - Humanoids/Undead (delay 30)
  skeleton: { id: "skeleton", name: "Decaying Skeleton", baseHP: 30, baseDPS: 3, naturalDelayTenths: 30, stats: { str: 8, con: 8, dex: 8, agi: 8, ac: 7, wis: 6, int: 6, cha: 6 } },
  gnoll_scout: { id: "gnoll_scout", name: "Gnoll Scout", baseHP: 35, baseDPS: 4, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 9, agi: 9, ac: 8, wis: 6, int: 6, cha: 6 } },
  young_orc: { id: "young_orc", name: "Young Orc", baseHP: 40, baseDPS: 4, naturalDelayTenths: 30, stats: { str: 10, con: 10, dex: 9, agi: 8, ac: 8, wis: 6, int: 6, cha: 6 } },
  rabid_wolf: { id: "rabid_wolf", name: "Rabid Wolf", baseHP: 35, baseDPS: 5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 10, agi: 10, ac: 7, wis: 6, int: 6, cha: 6 } },
  phantom: { 
    id: "phantom", 
    name: "Phantom", 
    baseHP: 25, 
    baseDPS: 6, 
    naturalDelayTenths: 25, 
    stats: { str: 8, con: 8, dex: 9, agi: 10, ac: 9, wis: 10, int: 10, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { magic: 10, cold: 5 },
    drops: [
      { id: "phantom_essence", chance: 0.30 }
    ]
  },

  // Zone 2 - Larger creatures (delay 30-45)
  forest_ghoul: { id: "forest_ghoul", name: "Forest Ghoul", baseHP: 40, baseDPS: 4, naturalDelayTenths: 35, stats: { str: 11, con: 12, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } },
  shadow_sprite: { id: "shadow_sprite", name: "Shadow Sprite", baseHP: 35, baseDPS: 5, naturalDelayTenths: 26, stats: { str: 9, con: 10, dex: 12, agi: 12, ac: 9, wis: 9, int: 9, cha: 7 } },
  cursed_treant: { id: "cursed_treant", name: "Cursed Treant", baseHP: 50, baseDPS: 3, naturalDelayTenths: 50, stats: { str: 12, con: 14, dex: 9, agi: 8, ac: 12, wis: 8, int: 7, cha: 6 } },
  werewolf: { id: "werewolf", name: "Werewolf", baseHP: 45, baseDPS: 6, naturalDelayTenths: 30, stats: { str: 13, con: 13, dex: 12, agi: 12, ac: 10, wis: 8, int: 8, cha: 7 } },
  wood_spirit: { id: "wood_spirit", name: "Wood Spirit", baseHP: 38, baseDPS: 7, naturalDelayTenths: 28, stats: { str: 10, con: 11, dex: 11, agi: 13, ac: 11, wis: 12, int: 12, cha: 9 } },

  // Zone 3 - Bruisers/Knights (delay 40-60)
  skeletal_knight: { id: "skeletal_knight", name: "Skeletal Knight", baseHP: 55, baseDPS: 6, naturalDelayTenths: 45, stats: { str: 14, con: 16, dex: 12, agi: 11, ac: 14, wis: 9, int: 9, cha: 8 } },
  orc_centurion: { id: "orc_centurion", name: "Orc Centurion", baseHP: 60, baseDPS: 7, naturalDelayTenths: 50, stats: { str: 16, con: 16, dex: 13, agi: 12, ac: 13, wis: 9, int: 9, cha: 8 } },
  dark_wolf: { id: "dark_wolf", name: "Dark Wolf", baseHP: 50, baseDPS: 7, naturalDelayTenths: 32, stats: { str: 13, con: 14, dex: 14, agi: 14, ac: 12, wis: 9, int: 9, cha: 8 } },
  bloodsaber_acolyte: { id: "bloodsaber_acolyte", name: "Bloodsaber Acolyte", baseHP: 45, baseDPS: 8, naturalDelayTenths: 35, stats: { str: 12, con: 13, dex: 13, agi: 13, ac: 12, wis: 12, int: 12, cha: 10 } },
  castle_specter: { id: "castle_specter", name: "Castle Specter", baseHP: 48, baseDPS: 9, naturalDelayTenths: 28, stats: { str: 12, con: 13, dex: 14, agi: 15, ac: 13, wis: 13, int: 13, cha: 11 } },

  // Zone 4 - Small creatures (delay 26-30)
  plains_rat: { id: "plains_rat", name: "Plainstrider Rat", baseHP: 18, baseDPS: 2, naturalDelayTenths: 28, stats: { str: 6, con: 6, dex: 9, agi: 9, ac: 6 } },
  grassland_beetle: { id: "grassland_beetle", name: "Grassland Beetle", baseHP: 26, baseDPS: 2, naturalDelayTenths: 30, stats: { str: 6, con: 10, dex: 6, agi: 6, ac: 10 } },
  plains_snake: { id: "plains_snake", name: "Timid Plains Snake", baseHP: 20, baseDPS: 3, naturalDelayTenths: 27, stats: { str: 7, con: 7, dex: 10, agi: 9, ac: 7 } },
  plains_wolf: { id: "plains_wolf", name: "Mundane Plains Wolf", baseHP: 24, baseDPS: 3, naturalDelayTenths: 30, stats: { str: 8, con: 8, dex: 9, agi: 9, ac: 7 } },
  scavenger_crow: { id: "scavenger_crow", name: "Scavenger Crow", baseHP: 19, baseDPS: 3, naturalDelayTenths: 26, stats: { str: 6, con: 6, dex: 11, agi: 11, ac: 7 } },
  field_gnawer: { id: "field_gnawer", name: "Field Gnawer", baseHP: 23, baseDPS: 4, naturalDelayTenths: 29, stats: { str: 9, con: 7, dex: 8, agi: 8, ac: 7 } },
  plains_marauder: { id: "plains_marauder", name: "Plains Marauder", baseHP: 28, baseDPS: 4, naturalDelayTenths: 32, stats: { str: 10, con: 9, dex: 8, agi: 7, ac: 9 } },
  dusthorn_calf: { id: "dusthorn_calf", name: "Dusthorn Calf", baseHP: 34, baseDPS: 3, naturalDelayTenths: 45, stats: { str: 9, con: 12, dex: 6, agi: 6, ac: 10 } },
  field_spirit: { id: "field_spirit", name: "Restless Field Spirit", baseHP: 25, baseDPS: 5, naturalDelayTenths: 28, stats: { str: 7, con: 8, dex: 9, agi: 10, ac: 9 } },

  // Mundane Plains humanoids (1-3)
  plains_bandit: { id: "plains_bandit", name: "Plains Bandit", baseHP: 34, baseDPS: 4, naturalDelayTenths: 30, stats: { str: 9, con: 9, dex: 9, agi: 9, ac: 8 } },
  field_brigand: { id: "field_brigand", name: "Field Brigand", baseHP: 38, baseDPS: 4, naturalDelayTenths: 32, stats: { str: 10, con: 10, dex: 9, agi: 8, ac: 9 } },

  // Shatterbone (orcs) (4-9)
  shatterbone_scout: { id: "shatterbone_scout", name: "Shatterbone Scout", baseHP: 52, baseDPS: 6, naturalDelayTenths: 30, stats: { str: 13, con: 12, dex: 12, agi: 11, ac: 12 } },
  shatterbone_legionary: { id: "shatterbone_legionary", name: "Shatterbone Legionary", baseHP: 60, baseDPS: 7, naturalDelayTenths: 40, stats: { str: 15, con: 14, dex: 12, agi: 10, ac: 14 } },
  shatterbone_brute: { id: "shatterbone_brute", name: "Shatterbone Brute", baseHP: 70, baseDPS: 8, naturalDelayTenths: 46, stats: { str: 16, con: 15, dex: 11, agi: 9, ac: 15 } },

  // Rolling Hills (6-8)
  hill_skirmisher: { id: "hill_skirmisher", name: "Hill Skirmisher", baseHP: 58, baseDPS: 7, naturalDelayTenths: 32, stats: { str: 14, con: 13, dex: 13, agi: 12, ac: 13 } },

  // Cornfields (8-11)
  cornfield_raider: { id: "cornfield_raider", name: "Cornfield Raider", baseHP: 80, baseDPS: 9, naturalDelayTenths: 34, stats: { str: 16, con: 15, dex: 13, agi: 12, ac: 16 } },

  // Hallowbone Castle (9-12)
  hallowbone_warpriest: { id: "hallowbone_warpriest", name: "Hallowbone Warpriest", baseHP: 95, baseDPS: 11, naturalDelayTenths: 32, stats: { str: 15, con: 16, dex: 13, agi: 12, ac: 18, wis: 14, int: 10 } },
  bone_king: { 
    id: "bone_king", 
    name: "Bone-King Malzor", 
    baseHP: 160, 
    baseDPS: 14, 
    naturalDelayTenths: 40, 
    stats: { str: 20, con: 20, dex: 13, agi: 12, ac: 22, wis: 16, int: 12 },
    isNamed: true,
    namedTier: "apex_named",
    resists: { disease: 25, poison: 25, cold: 15 },
    drops: [
      { id: "malzors_scepter", chance: 0.20 },
      { id: "crown_of_bone", chance: 0.15 }
    ]
  },

  // Zone 6 additional named
  ritual_keeper: {
    id: "ritual_keeper",
    name: "Ritual Keeper",
    baseHP: 88,
    baseDPS: 10,
    naturalDelayTenths: 30,
    stats: { str: 14, con: 15, dex: 13, agi: 12, ac: 17, wis: 16, int: 14 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { magic: 12, disease: 10 },
    drops: [
      { id: "ritual_dagger", chance: 0.23 }
    ]
  },

  bone_adjutant: {
    id: "bone_adjutant",
    name: "Bone Adjutant",
    baseHP: 92,
    baseDPS: 11,
    naturalDelayTenths: 32,
    stats: { str: 16, con: 16, dex: 12, agi: 11, ac: 18, wis: 13, int: 11 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { disease: 15, cold: 10 },
    drops: [
      { id: "adjutant_armor", chance: 0.24 }
    ]
  },

  high_sigil_master: {
    id: "high_sigil_master",
    name: "High Sigil Master",
    baseHP: 100,
    baseDPS: 11,
    naturalDelayTenths: 28,
    stats: { str: 14, con: 16, dex: 14, agi: 13, ac: 19, wis: 17, int: 16 },
    isNamed: true,
    namedTier: "true_named",
    resists: { magic: 18, disease: 12 },
    drops: [
      { id: "sigil_orb", chance: 0.18 },
      { id: "sigil_tome", chance: 0.16 }
    ]
  },

  deathknight_maloth: {
    id: "deathknight_maloth",
    name: "Deathknight Maloth",
    baseHP: 110,
    baseDPS: 12,
    naturalDelayTenths: 35,
    stats: { str: 18, con: 18, dex: 13, agi: 11, ac: 21, wis: 14, int: 12 },
    isNamed: true,
    namedTier: "true_named",
    resists: { disease: 15, cold: 15, physical: 10 },
    drops: [
      { id: "maloth_sword", chance: 0.19 },
      { id: "deathknight_plate", chance: 0.17 }
    ]
  },

  // --- RARE MOBS (LIGHT RESISTS ~10) ---
  ravel_waylaid: {
    id: "ravel_waylaid",
    name: "Ravel the Waylaid",
    baseHP: 55,
    baseDPS: 6,
    naturalDelayTenths: 28,
    stats: { str: 12, con: 12, dex: 14, agi: 14, ac: 12 },
    isNamed: true,
    namedTier: "true_named",
    resists: { poison: 10, magic: 5 },
    drops: [
      { id: "stalk_woven_boots", chance: 0.22 }
    ]
  },

  // Zone 2 additional named
  dusthoof_alpha: {
    id: "dusthoof_alpha",
    name: "Dusthoof Alpha",
    baseHP: 48,
    baseDPS: 5,
    naturalDelayTenths: 36,
    stats: { str: 12, con: 13, dex: 9, agi: 8, ac: 10 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { physical: 10 },
    drops: [
      { id: "dusthoof_horn", chance: 0.28 }
    ]
  },

  roadwarden_thane: {
    id: "roadwarden_thane",
    name: "Roadwarden Thane",
    baseHP: 52,
    baseDPS: 6,
    naturalDelayTenths: 30,
    stats: { str: 13, con: 12, dex: 12, agi: 11, ac: 12 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { physical: 8, magic: 5 },
    drops: [
      { id: "roadwarden_badge", chance: 0.26 }
    ]
  },

  field_overseer: {
    id: "field_overseer",
    name: "Field Overseer",
    baseHP: 58,
    baseDPS: 6,
    naturalDelayTenths: 32,
    stats: { str: 14, con: 13, dex: 13, agi: 12, ac: 13 },
    isNamed: true,
    namedTier: "true_named",
    resists: { magic: 10, fire: 8 },
    drops: [
      { id: "overseers_whip", chance: 0.18 },
      { id: "field_commanders_helm", chance: 0.16 }
    ]
  },

  groundskeeper: {
    id: "groundskeeper",
    name: "The Groundskeeper",
    baseHP: 60,
    baseDPS: 7,
    naturalDelayTenths: 44,
    stats: { str: 15, con: 14, dex: 10, agi: 10, ac: 14 },
    isNamed: true,
    namedTier: "true_named",
    resists: { disease: 15, poison: 15 },
    drops: [
      { id: "reaper_shroud", chance: 0.18 },
      { id: "deathward_charm", chance: 0.15 }
    ]
  },

  // Zone 1 additional named
  crypt_watcher: {
    id: "crypt_watcher",
    name: "Crypt Watcher",
    baseHP: 50,
    baseDPS: 5,
    naturalDelayTenths: 32,
    stats: { str: 11, con: 12, dex: 10, agi: 9, ac: 11 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { disease: 10, cold: 5 },
    drops: [
      { id: "crypt_key", chance: 0.25 }
    ]
  },

  forgotten_one: {
    id: "forgotten_one",
    name: "The Forgotten One",
    baseHP: 65,
    baseDPS: 7,
    naturalDelayTenths: 38,
    stats: { str: 14, con: 13, dex: 11, agi: 10, ac: 13 },
    isNamed: true,
    namedTier: "true_named",
    resists: { magic: 12, disease: 10 },
    drops: [
      { id: "forgotten_shroud", chance: 0.20 }
    ]
  },

  // --- RARE MOBS (MODERATE RESISTS ~15) ---
  captain_arvok: {
    id: "captain_arvok",
    name: "Captain Arvok",
    baseHP: 95,
    baseDPS: 10,
    naturalDelayTenths: 32,
    stats: { str: 16, con: 16, dex: 14, agi: 12, ac: 18 },
    isNamed: true,
    namedTier: "true_named",
    resists: { magic: 10, fear: 15 },
    drops: [
      { id: "arvok_signet", chance: 0.22 }
    ]
  },

  // Zone 4 additional named
  stone_hurler: {
    id: "stone_hurler",
    name: "Stone Hurler",
    baseHP: 64,
    baseDPS: 7,
    naturalDelayTenths: 34,
    stats: { str: 15, con: 14, dex: 11, agi: 10, ac: 14 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { physical: 12 },
    drops: [
      { id: "stone_hurler_sling", chance: 0.24 }
    ]
  },

  ridgewatch_commander: {
    id: "ridgewatch_commander",
    name: "Ridgewatch Commander",
    baseHP: 88,
    baseDPS: 9,
    naturalDelayTenths: 34,
    stats: { str: 16, con: 15, dex: 13, agi: 12, ac: 17 },
    isNamed: true,
    namedTier: "true_named",
    resists: { physical: 10, magic: 10 },
    drops: [
      { id: "ridgewatch_banner", chance: 0.19 },
      { id: "commander_insignia", chance: 0.17 }
    ]
  },

  ancient_earthshaker: {
    id: "ancient_earthshaker",
    name: "Ancient Earthshaker",
    baseHP: 105,
    baseDPS: 11,
    naturalDelayTenths: 42,
    stats: { str: 19, con: 18, dex: 10, agi: 9, ac: 19 },
    isNamed: true,
    namedTier: "apex_named",
    resists: { physical: 20, magic: 12 },
    drops: [
      { id: "earthshaker_hammer", chance: 0.18 },
      { id: "earthshaker_girdle", chance: 0.16 },
      { id: "stone_ward_amulet", chance: 0.14 }
    ]
  },

  warlord_grask: {
    id: "warlord_grask",
    name: "Warlord Grask",
    baseHP: 110,
    baseDPS: 12,
    naturalDelayTenths: 40,
    stats: { str: 18, con: 18, dex: 12, agi: 10, ac: 20 },
    isNamed: true,
    namedTier: "apex_named",
    resists: { magic: 15, fire: 10 },
    drops: [
      { id: "grask_totem", chance: 0.25 }
    ]
  },

  // Zone 3 additional named
  bonecrusher: {
    id: "bonecrusher",
    name: "Bonecrusher",
    baseHP: 68,
    baseDPS: 8,
    naturalDelayTenths: 38,
    stats: { str: 16, con: 15, dex: 10, agi: 9, ac: 15 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { physical: 10, disease: 8 },
    drops: [
      { id: "bonecrusher_maul", chance: 0.24 }
    ]
  },

  skullsplitter: {
    id: "skullsplitter",
    name: "Skullsplitter the Cruel",
    baseHP: 72,
    baseDPS: 9,
    naturalDelayTenths: 35,
    stats: { str: 17, con: 15, dex: 11, agi: 10, ac: 16 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { physical: 12, poison: 8 },
    drops: [
      { id: "skullsplitter_axe", chance: 0.26 }
    ]
  },

  shaman_grimtooth: {
    id: "shaman_grimtooth",
    name: "Shaman Grimtooth",
    baseHP: 78,
    baseDPS: 9,
    naturalDelayTenths: 32,
    stats: { str: 14, con: 16, dex: 12, agi: 11, ac: 17, wis: 15, int: 13 },
    isNamed: true,
    namedTier: "true_named",
    resists: { magic: 15, disease: 10 },
    drops: [
      { id: "grimtooth_fetish", chance: 0.20 },
      { id: "grimtooth_staff", chance: 0.18 }
    ]
  },

  captain_boneclaw: {
    id: "captain_boneclaw",
    name: "Captain Boneclaw",
    baseHP: 85,
    baseDPS: 10,
    naturalDelayTenths: 36,
    stats: { str: 17, con: 17, dex: 13, agi: 11, ac: 18 },
    isNamed: true,
    namedTier: "true_named",
    resists: { physical: 12, disease: 12 },
    drops: [
      { id: "boneclaw_pauldrons", chance: 0.18 },
      { id: "boneclaw_blade", chance: 0.16 }
    ]
  },

  cornreaper: {
    id: "cornreaper",
    name: "The Cornreaper",
    baseHP: 120,
    baseDPS: 12,
    naturalDelayTenths: 30,
    stats: { str: 18, con: 16, dex: 14, agi: 12, ac: 18 },
    isNamed: true,
    namedTier: "apex_named",
    resists: { poison: 20, disease: 10 },
    drops: [
      { id: "malzors_scepter", chance: 0.20 }
    ]
  },

  // Zone 5 additional named
  stalk_hunter: {
    id: "stalk_hunter",
    name: "Stalk Hunter",
    baseHP: 74,
    baseDPS: 8,
    naturalDelayTenths: 28,
    stats: { str: 15, con: 14, dex: 14, agi: 13, ac: 15 },
    isNamed: true,
    namedTier: "lesser_named",
    resists: { poison: 10, disease: 8 },
    drops: [
      { id: "stalk_hunters_bow", chance: 0.25 }
    ]
  },

  fenceline_warden: {
    id: "fenceline_warden",
    name: "Fenceline Warden",
    baseHP: 82,
    baseDPS: 9,
    naturalDelayTenths: 32,
    stats: { str: 16, con: 15, dex: 13, agi: 12, ac: 16 },
    isNamed: true,
    namedTier: "true_named",
    resists: { physical: 12, poison: 10 },
    drops: [
      { id: "warden_cloak", chance: 0.19 },
      { id: "warden_halberd", chance: 0.17 }
    ]
  },

  /* ---------- Mundane Plains mobs ---------- */
  plains_snake: {
    id: "plains_snake",
    name: "Plains Snake",
    baseHP: 26,
    baseDPS: 3,
    naturalDelayTenths: 24,
    stats: { str: 7, con: 7, dex: 11, agi: 11, ac: 6 },
    resists: { poison: 5 }
  },
  grassland_beetle: {
    id: "grassland_beetle",
    name: "Grassland Beetle",
    baseHP: 30,
    baseDPS: 3,
    naturalDelayTenths: 30,
    stats: { str: 8, con: 10, dex: 6, agi: 6, ac: 10 }
  },
  scavenger_vulture: {
    id: "scavenger_vulture",
    name: "Scavenger Vulture",
    baseHP: 28,
    baseDPS: 3,
    naturalDelayTenths: 26,
    stats: { str: 7, con: 8, dex: 10, agi: 12, ac: 7 }
  },

  /* ---------- Graveyard mobs ---------- */
  bone_mite: {
    id: "bone_mite",
    name: "Bone Mite",
    baseHP: 24,
    baseDPS: 3,
    naturalDelayTenths: 28,
    stats: { str: 6, con: 8, dex: 8, agi: 8, ac: 8 },
    resists: { disease: 5 }
  },
  grave_wisp: {
    id: "grave_wisp",
    name: "Grave Wisp",
    baseHP: 22,
    baseDPS: 3,
    naturalDelayTenths: 26,
    stats: { str: 5, con: 7, dex: 10, agi: 10, ac: 7 },
    resists: { magic: 10 }
  },

  /* ---------- Shatterbone Keep mobs ---------- */
  shatterbone_archer: {
    id: "shatterbone_archer",
    name: "Shatterbone Archer",
    baseHP: 54,
    baseDPS: 7,
    naturalDelayTenths: 28,
    stats: { str: 13, con: 12, dex: 14, agi: 12, ac: 12 }
  },
  shatterbone_shaman: {
    id: "shatterbone_shaman",
    name: "Shatterbone Shaman",
    baseHP: 62,
    baseDPS: 7,
    naturalDelayTenths: 32,
    stats: { str: 12, con: 14, dex: 12, agi: 10, ac: 13, wis: 14, int: 10 },
    resists: { magic: 10 }
  },

  /* ---------- Rolling Hills mobs ---------- */
  ridge_bandit: {
    id: "ridge_bandit",
    name: "Ridge Bandit",
    baseHP: 62,
    baseDPS: 7,
    naturalDelayTenths: 30,
    stats: { str: 14, con: 13, dex: 13, agi: 12, ac: 13 }
  },
  rock_scrabbler: {
    id: "rock_scrabbler",
    name: "Rock Scrabbler",
    baseHP: 55,
    baseDPS: 6,
    naturalDelayTenths: 34,
    stats: { str: 12, con: 12, dex: 10, agi: 11, ac: 14 }
  },

  /* ---------- Cornfields mobs ---------- */
  field_serpent: {
    id: "field_serpent",
    name: "Field Serpent",
    baseHP: 70,
    baseDPS: 8,
    naturalDelayTenths: 26,
    stats: { str: 14, con: 14, dex: 15, agi: 14, ac: 14 },
    resists: { poison: 10 }
  },
  stalk_scavenger: {
    id: "stalk_scavenger",
    name: "Stalk Scavenger",
    baseHP: 68,
    baseDPS: 8,
    naturalDelayTenths: 30,
    stats: { str: 15, con: 13, dex: 13, agi: 13, ac: 13 }
  },

  /* ---------- Hallowbone Castle mobs ---------- */
  bone_sentinel: {
    id: "bone_sentinel",
    name: "Bone Sentinel",
    baseHP: 95,
    baseDPS: 11,
    naturalDelayTenths: 36,
    stats: { str: 17, con: 16, dex: 12, agi: 10, ac: 19 },
    resists: { disease: 10, poison: 10 }
  },
  sigil_cultist: {
    id: "sigil_cultist",
    name: "Sigil Cultist",
    baseHP: 88,
    baseDPS: 10,
    naturalDelayTenths: 30,
    stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 16, wis: 13, int: 12 },
    resists: { magic: 10 }
  },
  /* ================================================================
     EQ Legends Tools import (renamed) - see js/zones/index.js for the
     full list of zone files that reference these ids (everything after
     zone6.js, e.g. duskburrow.js, realm_of_dread.js, etc.)
     ================================================================ */
  eq_pyzjyn: { id: "eq_pyzjyn", name: "Pyzjyn", baseHP: 116, baseDPS: 10.5, naturalDelayTenths: 42, stats: { str: 11, con: 12, dex: 11, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Pyzjn (lvl 13)
  eq_haddin: { id: "eq_haddin", name: "Haddin", baseHP: 194, baseDPS: 16.8, naturalDelayTenths: 42, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 20, wis: 12, int: 12, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: Hadden (lvl 28)
  eq_a_lizardman_mystic: { id: "eq_a_lizardman_mystic", name: "a lizardman mystic", baseHP: 74, baseDPS: 7.1, naturalDelayTenths: 36, stats: { str: 8, con: 9, dex: 8, agi: 7, ac: 8, wis: 6, int: 6, cha: 5 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a lizardman mystic (lvl 5)
  eq_mooto_the_goblin_shaman: { id: "eq_mooto_the_goblin_shaman", name: "Mooto the Goblin Shaman", baseHP: 74, baseDPS: 7.1, naturalDelayTenths: 36, stats: { str: 8, con: 9, dex: 8, agi: 7, ac: 8, wis: 6, int: 6, cha: 5 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Mooto; a goblin shaman (lvl 5)
  eq_dragoon_tsanner: { id: "eq_dragoon_tsanner", name: "Dragoon Tsanne`r", baseHP: 308, baseDPS: 26.0, naturalDelayTenths: 36, stats: { str: 27, con: 28, dex: 26, agi: 24, ac: 32, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Dragoon Tsanne (lvl 50)
  eq_dorn_bdynne: { id: "eq_dorn_bdynne", name: "Dorn B`Dynne", baseHP: 121, baseDPS: 10.9, naturalDelayTenths: 44, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Dorn B`Dynn (lvl 14)
  eq_rahoteph: { id: "eq_rahoteph", name: "Rahoteph", baseHP: 131, baseDPS: 11.7, naturalDelayTenths: 38, stats: { str: 13, con: 13, dex: 12, agi: 11, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Rahotep (lvl 16)
  eq_a_dervish_cutthroat: { id: "eq_a_dervish_cutthroat", name: "a Dervish Cutthroat", baseHP: 79, baseDPS: 7.5, naturalDelayTenths: 38, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a Dervish Cutthroat (lvl 6)
  eq_saurnak_spectres: { id: "eq_saurnak_spectres", name: "Saurnak Spectres", baseHP: 79, baseDPS: 7.5, naturalDelayTenths: 38, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Sarnak Spectres (lvl 6)
  eq_a_vitrified_skeleton: { id: "eq_a_vitrified_skeleton", name: "A Vitrified Skeleton", baseHP: 79, baseDPS: 7.5, naturalDelayTenths: 38, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: A Vitrified Skeleton (lvl 6)
  eq_burning_wraith: { id: "eq_burning_wraith", name: "Burning Wraith", baseHP: 79, baseDPS: 7.5, naturalDelayTenths: 38, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Flaming Wraith (lvl 6)
  eq_an_ice_giant: { id: "eq_an_ice_giant", name: "an ice giant", baseHP: 100, baseDPS: 9.2, naturalDelayTenths: 36, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: an ice giant (lvl 10)
  eq_shade_assassin: { id: "eq_shade_assassin", name: "Shade Assassin", baseHP: 308, baseDPS: 26.0, naturalDelayTenths: 36, stats: { str: 27, con: 28, dex: 26, agi: 24, ac: 32, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Dark Assassin (lvl 50)
  eq_mirasol: { id: "eq_mirasol", name: "Mirasol", baseHP: 324, baseDPS: 27.3, naturalDelayTenths: 42, stats: { str: 28, con: 30, dex: 27, agi: 25, ac: 34, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Miragul (lvl 53)
  eq_karg_frostbear: { id: "eq_karg_frostbear", name: "Karg Frostbear", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Karg IceBear (lvl 35)
  eq_grazhak_the_frenzied: { id: "eq_grazhak_the_frenzied", name: "Grazhak the Frenzied", baseHP: 209, baseDPS: 18.0, naturalDelayTenths: 38, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: Grazhak the Berzerker (lvl 31)
  eq_quid_rillstone: { id: "eq_quid_rillstone", name: "Quid Rillstone", baseHP: 225, baseDPS: 19.3, naturalDelayTenths: 44, stats: { str: 20, con: 21, dex: 19, agi: 18, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Quid Rilstone (lvl 34)
  eq_glaron_the_vile: { id: "eq_glaron_the_vile", name: "Glaron the Vile", baseHP: 214, baseDPS: 18.4, naturalDelayTenths: 40, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Glaron the Wicked (lvl 32)
  eq_brother_zephron: { id: "eq_brother_zephron", name: "Brother Zephron", baseHP: 365, baseDPS: 30.6, naturalDelayTenths: 38, stats: { str: 32, con: 33, dex: 30, agi: 28, ac: 39, wis: 22, int: 22, cha: 19 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Brother Zephyl (lvl 61)
  eq_mortificator_syythrek: { id: "eq_mortificator_syythrek", name: "Mortificator Syythrek", baseHP: 246, baseDPS: 21.0, naturalDelayTenths: 42, stats: { str: 22, con: 23, dex: 21, agi: 20, ac: 26, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: Mortificator Syythrak (lvl 38)
  eq_wingshard: { id: "eq_wingshard", name: "Wingshard", baseHP: 147, baseDPS: 13.0, naturalDelayTenths: 44, stats: { str: 14, con: 15, dex: 13, agi: 13, ac: 15, wis: 10, int: 10, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Shardwing (lvl 19)
  eq_petrifyn: { id: "eq_petrifyn", name: "Petrifyn", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Petrifin (lvl 40)
  eq_a_rotting_sentry: { id: "eq_a_rotting_sentry", name: "a rotting sentry", baseHP: 282, baseDPS: 23.9, naturalDelayTenths: 36, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a rotting sentry (lvl 45)
  eq_a_spectre: { id: "eq_a_spectre", name: "a spectre", baseHP: 90, baseDPS: 8.4, naturalDelayTenths: 42, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a spectre (lvl 8)
  eq_a_gelatinous_cube: { id: "eq_a_gelatinous_cube", name: "a gelatinous cube", baseHP: 90, baseDPS: 8.4, naturalDelayTenths: 42, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a gelatinous cube (lvl 8)
  eq_a_necromancer: { id: "eq_a_necromancer", name: "a necromancer", baseHP: 90, baseDPS: 8.4, naturalDelayTenths: 42, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a necromancer (lvl 8)
  eq_dragoon_zytln: { id: "eq_dragoon_zytln", name: "Dragoon Zytl`n", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Dragoon Zytl (lvl 35)
  eq_an_orc_legionnaire: { id: "eq_an_orc_legionnaire", name: "an orc legionnaire", baseHP: 90, baseDPS: 8.4, naturalDelayTenths: 42, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: an orc legionnaire (lvl 8)
  eq_an_ogre_priestess: { id: "eq_an_ogre_priestess", name: "an ogre priestess", baseHP: 188, baseDPS: 16.3, naturalDelayTenths: 40, stats: { str: 17, con: 18, dex: 16, agi: 16, ac: 20, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: an ogre priestess (lvl 27)
  eq_a_werewolf: { id: "eq_a_werewolf", name: "a werewolf", baseHP: 95, baseDPS: 8.8, naturalDelayTenths: 44, stats: { str: 10, con: 10, dex: 9, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a werewolf (lvl 9)
  eq_an_ogre_shaman: { id: "eq_an_ogre_shaman", name: "an ogre shaman", baseHP: 225, baseDPS: 19.3, naturalDelayTenths: 44, stats: { str: 20, con: 21, dex: 19, agi: 18, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: an ogre shaman (lvl 34)
  eq_master_distiller: { id: "eq_master_distiller", name: "Master Distiller", baseHP: 142, baseDPS: 12.6, naturalDelayTenths: 42, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Master Brewer (lvl 18)
  eq_refugee_cleftpaw_monk: { id: "eq_refugee_cleftpaw_monk", name: "Refugee Cleftpaw (Monk)", baseHP: 142, baseDPS: 12.6, naturalDelayTenths: 42, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Refugee Splitpaw (Monk) (lvl 18)
  eq_cleftpaw_sharpshooter: { id: "eq_cleftpaw_sharpshooter", name: "Cleftpaw Sharpshooter", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Splitpaw Sharpshooter (lvl 20)
  eq_cleftpaw_commander: { id: "eq_cleftpaw_commander", name: "Cleftpaw Commander", baseHP: 121, baseDPS: 10.9, naturalDelayTenths: 44, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Splitpaw Commander (lvl 14)
  eq_fangtusk_overseer: { id: "eq_fangtusk_overseer", name: "Fangtusk Overseer", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Sabertooth Overseer (lvl 20)
  eq_lord_elgrun_rare: { id: "eq_lord_elgrun_rare", name: "Lord Elgrun (rare)", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Lord Elgnub (rare drop) (lvl 22)
  eq_fangtusk_clan_necromancer: { id: "eq_fangtusk_clan_necromancer", name: "Fangtusk Clan Necromancer", baseHP: 126, baseDPS: 11.3, naturalDelayTenths: 36, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Sabertooth Clan Necromancer (lvl 15)
  eq_socho_nightpaw: { id: "eq_socho_nightpaw", name: "Socho Nightpaw", baseHP: 116, baseDPS: 10.5, naturalDelayTenths: 42, stats: { str: 11, con: 12, dex: 11, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Socho Darkpaw (lvl 13)
  eq_mannan_of_the_fangtusk: { id: "eq_mannan_of_the_fangtusk", name: "Mannan of the Fangtusk", baseHP: 126, baseDPS: 11.3, naturalDelayTenths: 36, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Mannan of the Sabertooth (lvl 15)
  eq_cleftpaw_explorer: { id: "eq_cleftpaw_explorer", name: "Cleftpaw Explorer", baseHP: 142, baseDPS: 12.6, naturalDelayTenths: 42, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Splitpaw Explorer (lvl 18)
  eq_lord_elgrun: { id: "eq_lord_elgrun", name: "Lord Elgrun", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Lord Elgnub (lvl 22)
  eq_refugee_cleftpaw: { id: "eq_refugee_cleftpaw", name: "Refugee Cleftpaw", baseHP: 121, baseDPS: 10.9, naturalDelayTenths: 44, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Refugee Splitpaw (lvl 14)
  eq_the_gnoll_high_shaman: { id: "eq_the_gnoll_high_shaman", name: "the gnoll high shaman", baseHP: 126, baseDPS: 11.3, naturalDelayTenths: 36, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: the gnoll high shaman (lvl 15)
  eq_a_gnoll_commander: { id: "eq_a_gnoll_commander", name: "a gnoll commander", baseHP: 121, baseDPS: 10.9, naturalDelayTenths: 44, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a gnoll commander (lvl 14)
  eq_an_elite_gnoll_guard: { id: "eq_an_elite_gnoll_guard", name: "an elite gnoll guard", baseHP: 110, baseDPS: 10.0, naturalDelayTenths: 40, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: an elite gnoll guard (lvl 12)
  eq_a_giant_plague_rat: { id: "eq_a_giant_plague_rat", name: "a giant plague rat", baseHP: 100, baseDPS: 9.2, naturalDelayTenths: 36, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a giant plague rat (lvl 10)
  eq_various_gnolls: { id: "eq_various_gnolls", name: "various gnolls", baseHP: 110, baseDPS: 10.0, naturalDelayTenths: 40, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: various gnolls (lvl 12)
  eq_knight_vtan: { id: "eq_knight_vtan", name: "Knight V`Tan", baseHP: 173, baseDPS: 15.1, naturalDelayTenths: 44, stats: { str: 16, con: 17, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 10 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Knight V`Tal (lvl 24)
  eq_footman_of_vzhen: { id: "eq_footman_of_vzhen", name: "Footman of V`Zhen", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Footman of V`Zher (lvl 20)
  eq_a_shadowknight_troll: { id: "eq_a_shadowknight_troll", name: "a shadowknight (Troll)", baseHP: 126, baseDPS: 11.3, naturalDelayTenths: 36, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a shadowknight (Troll) (lvl 15)
  eq_asaka_lrein: { id: "eq_asaka_lrein", name: "Asaka L`Rei`n", baseHP: 131, baseDPS: 11.7, naturalDelayTenths: 38, stats: { str: 13, con: 13, dex: 12, agi: 11, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Asaka L`Rei (lvl 16)
  eq_kahaptra_ztan: { id: "eq_kahaptra_ztan", name: "Kahaptra Z`Tan", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Kahaptra Z`Taj (lvl 22)
  eq_korven_nisera: { id: "eq_korven_nisera", name: "Korven Nisera", baseHP: 173, baseDPS: 15.1, naturalDelayTenths: 44, stats: { str: 16, con: 17, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 10 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Korven Nisere (lvl 24)
  eq_baron_telyx_vzhen: { id: "eq_baron_telyx_vzhen", name: "Baron Telyx V`Zhen", baseHP: 194, baseDPS: 16.8, naturalDelayTenths: 42, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 20, wis: 12, int: 12, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: Baron Telyx V`Zher (lvl 28)
  eq_soldier_of_vzhen: { id: "eq_soldier_of_vzhen", name: "Soldier of V`Zhen", baseHP: 183, baseDPS: 15.9, naturalDelayTenths: 38, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Soldier of V`Zher (lvl 26)
  eq_skeleton_lrodde: { id: "eq_skeleton_lrodde", name: "Skeleton Lrodde", baseHP: 126, baseDPS: 11.3, naturalDelayTenths: 36, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Skeleton Lrodd (lvl 15)
  eq_risen_theurge: { id: "eq_risen_theurge", name: "Risen Theurge", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Arisen Thaumaturgist (lvl 20)
  eq_a_shadowknight_dark_elf_female: { id: "eq_a_shadowknight_dark_elf_female", name: "a shadowknight (Dark Elf Female)", baseHP: 126, baseDPS: 11.3, naturalDelayTenths: 36, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a shadowknight (Dark Elf Female) (lvl 15)
  eq_a_necro_theurgist: { id: "eq_a_necro_theurgist", name: "a necro theurgist", baseHP: 126, baseDPS: 11.3, naturalDelayTenths: 36, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a necro theurgist (lvl 15)
  eq_the_thaumaturgist: { id: "eq_the_thaumaturgist", name: "the thaumaturgist", baseHP: 126, baseDPS: 11.3, naturalDelayTenths: 36, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: the thaumaturgist (lvl 15)
  eq_an_evil_eye: { id: "eq_an_evil_eye", name: "An Evil Eye", baseHP: 121, baseDPS: 10.9, naturalDelayTenths: 44, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: An Evil Eye (lvl 14)
  eq_a_gnoll_embalmer: { id: "eq_a_gnoll_embalmer", name: "a gnoll embalmer", baseHP: 110, baseDPS: 10.0, naturalDelayTenths: 40, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a gnoll embalmer (lvl 12)
  eq_the_froglok_shin_lord: { id: "eq_the_froglok_shin_lord", name: "the froglok shin lord", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: the froglok shin lord (lvl 17)
  eq_a_froglok_gaz_squire: { id: "eq_a_froglok_gaz_squire", name: "a froglok gaz squire", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a froglok gaz squire (lvl 17)
  eq_a_froglok_scryer: { id: "eq_a_froglok_scryer", name: "a froglok scryer", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a froglok scryer (lvl 17)
  eq_an_ancient_croc: { id: "eq_an_ancient_croc", name: "an ancient croc", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: an ancient croc (lvl 17)
  eq_ironjaw: { id: "eq_ironjaw", name: "Ironjaw", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Lockjaw (lvl 25)
  eq_hatarr: { id: "eq_hatarr", name: "Hatarr", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Hatar (lvl 20)
  eq_a_clawrend_destroyer: { id: "eq_a_clawrend_destroyer", name: "a Clawrend Destroyer", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a Pickclaw Destroyer (lvl 17)
  eq_a_sporeling_defender: { id: "eq_a_sporeling_defender", name: "a Sporeling Defender", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a Sporali Defender (lvl 17)
  eq_a_goblin_knight: { id: "eq_a_goblin_knight", name: "a Goblin Knight", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a Goblin Knight (lvl 22)
  eq_warlord_paluk: { id: "eq_warlord_paluk", name: "Warlord Paluk", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Battlelord Paluk (lvl 17)
  eq_the_sporeling_moldmaster: { id: "eq_the_sporeling_moldmaster", name: "The Sporeling Moldmaster", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: The Sporali Moldmaster (lvl 17)
  eq_a_clawrend_foeseeker: { id: "eq_a_clawrend_foeseeker", name: "a Clawrend Foeseeker", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a Pickclaw Foeseeker (lvl 17)
  eq_lord_clawrend: { id: "eq_lord_clawrend", name: "Lord Clawrend", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Lord Pickclaw (lvl 17)
  eq_an_evil_eye_prisoner: { id: "eq_an_evil_eye_prisoner", name: "an evil eye prisoner", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: an evil eye prisoner (lvl 17)
  eq_a_clawrend_mindripper: { id: "eq_a_clawrend_mindripper", name: "a Clawrend mindripper", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a Pickclaw mindripper (lvl 17)
  eq_a_slime_elemental: { id: "eq_a_slime_elemental", name: "a slime elemental", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a slime elemental (lvl 17)
  eq_fallen_crusader: { id: "eq_fallen_crusader", name: "Fallen Crusader", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Lost Crusader (lvl 25)
  eq_the_guard_captain: { id: "eq_the_guard_captain", name: "the guard captain", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: the guard captain (lvl 25)
  eq_unbound_ember: { id: "eq_unbound_ember", name: "Unbound Ember", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Unbound Flame (lvl 25)
  eq_drezna: { id: "eq_drezna", name: "Drezna", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Drelzna (lvl 25)
  eq_the_bonecrusher: { id: "eq_the_bonecrusher", name: "The Bonecrusher", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: The Tenderizer (lvl 22)
  eq_bonesplitter: { id: "eq_bonesplitter", name: "BoneSplitter", baseHP: 173, baseDPS: 15.1, naturalDelayTenths: 44, stats: { str: 16, con: 17, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 10 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: BoneCracker (lvl 24)
  eq_officer_grosh: { id: "eq_officer_grosh", name: "Officer Grosh", baseHP: 173, baseDPS: 15.1, naturalDelayTenths: 44, stats: { str: 16, con: 17, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 10 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Officer Grush (lvl 24)
  eq_a_tentacle_terror: { id: "eq_a_tentacle_terror", name: "a tentacle terror", baseHP: 204, baseDPS: 17.6, naturalDelayTenths: 36, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: a tentacle terror (lvl 30)
  eq_the_widowkeeper: { id: "eq_the_widowkeeper", name: "The Widowkeeper", baseHP: 225, baseDPS: 19.3, naturalDelayTenths: 44, stats: { str: 20, con: 21, dex: 19, agi: 18, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: The Widowmistress (lvl 34)
  eq_a_visiting_priestess: { id: "eq_a_visiting_priestess", name: "A Visiting Priestess", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: A Visiting Priestess (lvl 25)
  eq_nazjena_npc: { id: "eq_nazjena_npc", name: "Nazjena (NPC)", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Najena (NPC) (lvl 35)
  eq_rathael_reincarnate: { id: "eq_rathael_reincarnate", name: "Rathael reincarnate", baseHP: 204, baseDPS: 17.6, naturalDelayTenths: 36, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: Rathyl reincarnate (lvl 30)
  eq_rathael: { id: "eq_rathael", name: "Rathael", baseHP: 188, baseDPS: 16.3, naturalDelayTenths: 40, stats: { str: 17, con: 18, dex: 16, agi: 16, ac: 20, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Rathyl (lvl 27)
  eq_trazdorn: { id: "eq_trazdorn", name: "Trazdorn", baseHP: 173, baseDPS: 15.1, naturalDelayTenths: 44, stats: { str: 16, con: 17, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 10 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Trazdon (lvl 24)
  eq_the_blood_artisan: { id: "eq_the_blood_artisan", name: "The Blood Artisan", baseHP: 188, baseDPS: 16.3, naturalDelayTenths: 40, stats: { str: 17, con: 18, dex: 16, agi: 16, ac: 20, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: The Blood Artist (lvl 27)
  eq_a_greater_skeleton: { id: "eq_a_greater_skeleton", name: "A Greater Skeleton", baseHP: 188, baseDPS: 16.3, naturalDelayTenths: 40, stats: { str: 17, con: 18, dex: 16, agi: 16, ac: 20, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: A Greater Skeleton - confirmed drop in EQL (lvl 27)
  eq_ekaros: { id: "eq_ekaros", name: "Ekaros", baseHP: 183, baseDPS: 15.9, naturalDelayTenths: 38, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Ekeros (lvl 26)
  eq_wandering_warrior: { id: "eq_wandering_warrior", name: "wandering warrior", baseHP: 157, baseDPS: 13.8, naturalDelayTenths: 38, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: wandering warrior (lvl 21)
  eq_undead_cleric: { id: "eq_undead_cleric", name: "undead cleric", baseHP: 220, baseDPS: 18.9, naturalDelayTenths: 42, stats: { str: 20, con: 21, dex: 19, agi: 18, ac: 23, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: undead cleric (lvl 33)
  eq_coercer_qiolm: { id: "eq_coercer_qiolm", name: "Coercer Q`iolm", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Coercer Q`ioul (lvl 55)
  eq_a_priest_of_naganox: { id: "eq_a_priest_of_naganox", name: "a priest of Naganox", baseHP: 303, baseDPS: 25.6, naturalDelayTenths: 44, stats: { str: 27, con: 28, dex: 25, agi: 24, ac: 32, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a priest of Nagafen (lvl 49)
  eq_lady_vexa: { id: "eq_lady_vexa", name: "Lady Vexa", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Lady Vox (lvl 55)
  eq_an_injured_polar_bear: { id: "eq_an_injured_polar_bear", name: "an injured polar bear", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: an injured polar bear (lvl 20)
  eq_a_goblin_preacher: { id: "eq_a_goblin_preacher", name: "a goblin preacher", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a goblin preacher (lvl 20)
  eq_king_thexka_iv_of_the_burrows: { id: "eq_king_thexka_iv_of_the_burrows", name: "King Thex`Ka IV of the Burrows", baseHP: 204, baseDPS: 17.6, naturalDelayTenths: 36, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: King Thex`Ka IV (lvl 30)
  eq_a_goblin_scryer: { id: "eq_a_goblin_scryer", name: "a goblin scryer", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a goblin scryer (lvl 20)
  eq_high_priest_zaharon: { id: "eq_high_priest_zaharon", name: "High Priest Zaharon", baseHP: 204, baseDPS: 17.6, naturalDelayTenths: 36, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: High Priest Zaharn (lvl 30)
  eq_a_goblin_alchemist: { id: "eq_a_goblin_alchemist", name: "a goblin alchemist", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a goblin alchemist (lvl 20)
  eq_coloth_meadowbrook: { id: "eq_coloth_meadowbrook", name: "Coloth Meadowbrook", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Coloth Meadowgreen (lvl 20)
  eq_lord_grimrust: { id: "eq_lord_grimrust", name: "Lord Grimrust", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Lord Grimrot (lvl 22)
  eq_grizzlebark: { id: "eq_grizzlebark", name: "Grizzlebark", baseHP: 204, baseDPS: 17.6, naturalDelayTenths: 36, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: Grizzleknot (lvl 30)
  eq_narra_taneth: { id: "eq_narra_taneth", name: "Narra Taneth", baseHP: 168, baseDPS: 14.7, naturalDelayTenths: 42, stats: { str: 16, con: 16, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Narra Tanith (lvl 23)
  eq_marik_thornclub: { id: "eq_marik_thornclub", name: "Marik Thornclub", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Marik Clubthorn (lvl 22)
  eq_a_rosk_val_gnoll: { id: "eq_a_rosk_val_gnoll", name: "a Rosk Val Gnoll", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a Rosch Val Gnoll (lvl 22)
  eq_brother_kwinn: { id: "eq_brother_kwinn", name: "Brother Kwinn", baseHP: 365, baseDPS: 30.6, naturalDelayTenths: 38, stats: { str: 32, con: 33, dex: 30, agi: 28, ac: 39, wis: 22, int: 22, cha: 19 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Brother Qwinn (lvl 61)
  eq_plumemane: { id: "eq_plumemane", name: "Plumemane", baseHP: 204, baseDPS: 17.6, naturalDelayTenths: 36, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: Quillmane (lvl 30)
  eq_ghanex_drahl: { id: "eq_ghanex_drahl", name: "Ghanex Drahl", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Ghanex Drah (lvl 25)
  eq_aviak_avocet: { id: "eq_aviak_avocet", name: "aviak avocet", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: aviak avocet (lvl 22)
  eq_grenix_mudtail: { id: "eq_grenix_mudtail", name: "Grenix Mudtail", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Grenix Mucktail (lvl 17)
  eq_reckless_efreeti: { id: "eq_reckless_efreeti", name: "reckless efreeti", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: reckless efreeti (lvl 25)
  eq_flame_goblin_foreman: { id: "eq_flame_goblin_foreman", name: "flame goblin foreman", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: flame goblin foreman (lvl 25)
  eq_kobold_predator: { id: "eq_kobold_predator", name: "kobold predator", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: kobold predator (lvl 25)
  eq_agt_unit_exg: { id: "eq_agt_unit_exg", name: "AGT Unit EXG", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: CWG Model EXG (lvl 35)
  eq_captain_bipnoggle: { id: "eq_captain_bipnoggle", name: "Captain Bipnoggle", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Captain Bipnubble (lvl 35)
  eq_inferno_goblin_captain: { id: "eq_inferno_goblin_captain", name: "inferno goblin captain", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: inferno goblin captain (lvl 25)
  eq_scorch: { id: "eq_scorch", name: "Scorch", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Singe (lvl 25)
  eq_fire_goblin_bartender: { id: "eq_fire_goblin_bartender", name: "fire goblin bartender", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: fire goblin bartender (lvl 25)
  eq_solmek_goblin_king: { id: "eq_solmek_goblin_king", name: "Solmek Goblin King", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Solusek Goblin King (lvl 25)
  eq_kindlespark: { id: "eq_kindlespark", name: "Kindlespark", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Kindle (lvl 25)
  eq_goblin_high_shaman: { id: "eq_goblin_high_shaman", name: "goblin high shaman", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: goblin high shaman (lvl 25)
  eq_avatar_of_dread: { id: "eq_avatar_of_dread", name: "Avatar of Dread", baseHP: 272, baseDPS: 23.1, naturalDelayTenths: 42, stats: { str: 24, con: 25, dex: 23, agi: 22, ac: 29, wis: 17, int: 17, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Avatar of Fear (lvl 43)
  eq_a_stone_golem: { id: "eq_a_stone_golem", name: "a stone golem", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: a stone golem (lvl 25)
  eq_tae_iw_templar: { id: "eq_tae_iw_templar", name: "Tae Iw Templar", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Tae Ew Templar (lvl 25)
  eq_tae_iw_archon: { id: "eq_tae_iw_archon", name: "Tae Iw Archon", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Tae Ew Archon (lvl 25)
  eq_a_steel_golem: { id: "eq_a_steel_golem", name: "a steel golem", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: a steel golem (lvl 25)
  eq_zaic_thal_cenobite: { id: "eq_zaic_thal_cenobite", name: "Zaic-Thal Cenobite", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Cazic Cenobite (lvl 25)
  eq_a_clay_golem: { id: "eq_a_clay_golem", name: "A Clay Golem", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: A Clay Golem (lvl 25)
  eq_tae_iw_diviner: { id: "eq_tae_iw_diviner", name: "Tae Iw Diviner", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Tae Ew Diviner (lvl 25)
  eq_dyrna_nlithe: { id: "eq_dyrna_nlithe", name: "Dyrna Nlithe", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Dyrna Nlith (lvl 25)
  eq_a_tesk_val_brute: { id: "eq_a_tesk_val_brute", name: "a Tesk Val Brute", baseHP: 240, baseDPS: 20.5, naturalDelayTenths: 40, stats: { str: 22, con: 23, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a Tesch Val Brute (lvl 37)
  eq_vereshe_mal_executioner: { id: "eq_vereshe_mal_executioner", name: "Vereshe Mal Executioner", baseHP: 266, baseDPS: 22.6, naturalDelayTenths: 40, stats: { str: 24, con: 25, dex: 22, agi: 21, ac: 28, wis: 17, int: 17, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Verishe Mal Executioner (lvl 42)
  eq_tesk_val_devalnmek: { id: "eq_tesk_val_devalnmek", name: "Tesk Val Deval`Nmek", baseHP: 251, baseDPS: 21.4, naturalDelayTenths: 44, stats: { str: 22, con: 23, dex: 21, agi: 20, ac: 26, wis: 16, int: 16, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: Tesch Val Deval`Nmak (lvl 39)
  eq_tesk_val_kadvern: { id: "eq_tesk_val_kadvern", name: "Tesk Val Kadvern", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Tesch Val Kadvem (lvl 40)
  eq_nesch_val_torash_mashk: { id: "eq_nesch_val_torash_mashk", name: "Nesch Val Torash Mashk", baseHP: 251, baseDPS: 21.4, naturalDelayTenths: 44, stats: { str: 22, con: 23, dex: 21, agi: 20, ac: 26, wis: 16, int: 16, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: Nisch Val Torash Mashk (lvl 39)
  eq_a_ltesh_mas_gnoll: { id: "eq_a_ltesh_mas_gnoll", name: "a Ltesh Mas Gnoll", baseHP: 157, baseDPS: 13.8, naturalDelayTenths: 38, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a Lteth Mas Gnoll (lvl 21)
  eq_a_nesch_mas_mender: { id: "eq_a_nesch_mas_mender", name: "a Nesch Mas Mender", baseHP: 204, baseDPS: 17.6, naturalDelayTenths: 36, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: a Nisch Mas Mender (lvl 30)
  eq_the_yshva_mal: { id: "eq_the_yshva_mal", name: "The Yshva Mal", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: The Ishva Mal (lvl 40)
  eq_yshma_mas_apprentice: { id: "eq_yshma_mas_apprentice", name: "Yshma Mas Apprentice", baseHP: 214, baseDPS: 18.4, naturalDelayTenths: 40, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Ishma Mas Apprentice (lvl 32)
  eq_yshva_mas_apprentice: { id: "eq_yshva_mas_apprentice", name: "Yshva Mas Apprentice", baseHP: 214, baseDPS: 18.4, naturalDelayTenths: 40, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Ishva Mas Apprentice (lvl 32)
  eq_rosk_val_lvlor_rare: { id: "eq_rosk_val_lvlor_rare", name: "Rosk Val L'Vlor (Rare)", baseHP: 251, baseDPS: 21.4, naturalDelayTenths: 44, stats: { str: 22, con: 23, dex: 21, agi: 20, ac: 26, wis: 16, int: 16, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: Rosch Val L'Vlor (Rare) (lvl 39)
  eq_rosk_val_lvlor: { id: "eq_rosk_val_lvlor", name: "Rosk Val L'Vlor", baseHP: 251, baseDPS: 21.4, naturalDelayTenths: 44, stats: { str: 22, con: 23, dex: 21, agi: 20, ac: 26, wis: 16, int: 16, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: Rosch Val L'Vlor (lvl 39)
  eq_a_ltesh_val_deviant: { id: "eq_a_ltesh_val_deviant", name: "a Ltesh Val Deviant", baseHP: 220, baseDPS: 18.9, naturalDelayTenths: 42, stats: { str: 20, con: 21, dex: 19, agi: 18, ac: 23, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: a Lteth Val Deviant (lvl 33)
  eq_the_froglok_king: { id: "eq_the_froglok_king", name: "the froglok king", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: the froglok king (lvl 36)
  eq_a_ghoul_executioner: { id: "eq_a_ghoul_executioner", name: "a ghoul executioner", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a ghoul executioner (lvl 36)
  eq_a_ghoul_cavalier: { id: "eq_a_ghoul_cavalier", name: "a ghoul cavalier", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a ghoul cavalier (lvl 36)
  eq_the_ghoul_lord: { id: "eq_the_ghoul_lord", name: "the ghoul lord", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: the ghoul lord (lvl 36)
  eq_a_ghoul_assassin: { id: "eq_a_ghoul_assassin", name: "a ghoul assassin", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a ghoul assassin (lvl 36)
  eq_a_ghoul_savant: { id: "eq_a_ghoul_savant", name: "a ghoul savant", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a ghoul savant (lvl 36)
  eq_a_frenzied_ghoul: { id: "eq_a_frenzied_ghoul", name: "a frenzied ghoul", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a frenzied ghoul (lvl 36)
  eq_a_ghoul_sentinel: { id: "eq_a_ghoul_sentinel", name: "a ghoul sentinel", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a ghoul sentinel (lvl 36)
  eq_the_ghoul_arch_magi: { id: "eq_the_ghoul_arch_magi", name: "the ghoul arch magi", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: the ghoul arch magi (lvl 36)
  eq_a_ghoul_supplier: { id: "eq_a_ghoul_supplier", name: "a ghoul supplier", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a ghoul supplier (lvl 36)
  eq_a_froglok_tactician: { id: "eq_a_froglok_tactician", name: "a froglok tactician", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a froglok tactician (lvl 36)
  eq_a_froglok_crusader: { id: "eq_a_froglok_crusader", name: "a froglok crusader", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a froglok crusader (lvl 36)
  eq_a_froglok_yun_priest: { id: "eq_a_froglok_yun_priest", name: "A Froglok Yun Priest", baseHP: 240, baseDPS: 20.5, naturalDelayTenths: 40, stats: { str: 22, con: 23, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: A Froglok Yun Priest (lvl 37)
  eq_a_froglok_noble: { id: "eq_a_froglok_noble", name: "A Froglok Noble", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: A Froglok Noble (lvl 36)
  eq_a_ghoul_sage: { id: "eq_a_ghoul_sage", name: "a ghoul sage", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a ghoul sage (lvl 36)
  eq_a_reanimated_hand_lower_gukta: { id: "eq_a_reanimated_hand_lower_gukta", name: "a reanimated hand (Lower Gukta)", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a reanimated hand (Lower Guk) (lvl 36)
  eq_a_minotaur_patriarch: { id: "eq_a_minotaur_patriarch", name: "a minotaur patriarch", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a minotaur patriarch (lvl 36)
  eq_a_minotaur_elder: { id: "eq_a_minotaur_elder", name: "a minotaur elder", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: a minotaur elder (lvl 36)
  eq_a_yun_priest: { id: "eq_a_yun_priest", name: "A Yun Priest", baseHP: 240, baseDPS: 20.5, naturalDelayTenths: 40, stats: { str: 22, con: 23, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: A Yun Priest (lvl 37)
  eq_a_ghoul_ritualist: { id: "eq_a_ghoul_ritualist", name: "a ghoul ritualist", baseHP: 225, baseDPS: 19.3, naturalDelayTenths: 44, stats: { str: 20, con: 21, dex: 19, agi: 18, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: a ghoul ritualist (lvl 34)
  eq_warlord_skarlorn: { id: "eq_warlord_skarlorn", name: "Warlord Skarlorn", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Warlord Skarlon (lvl 40)
  eq_fire_giant_warrior: { id: "eq_fire_giant_warrior", name: "fire giant warrior", baseHP: 318, baseDPS: 26.8, naturalDelayTenths: 40, stats: { str: 28, con: 29, dex: 26, agi: 25, ac: 34, wis: 19, int: 19, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: fire giant warrior (lvl 52)
  eq_lord_naganox: { id: "eq_lord_naganox", name: "Lord Naganox", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Lord Nagafen (lvl 55)
  eq_solmek_kobold_king: { id: "eq_solmek_kobold_king", name: "Solmek kobold king", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Solusek kobold king (lvl 40)
  eq_kobold_champion: { id: "eq_kobold_champion", name: "kobold champion", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: kobold champion (lvl 40)
  eq_kobold_noble: { id: "eq_kobold_noble", name: "kobold noble", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: kobold noble (lvl 40)
  eq_stone_spider: { id: "eq_stone_spider", name: "stone spider", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: stone spider (lvl 40)
  eq_kobold_priest: { id: "eq_kobold_priest", name: "kobold priest", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: kobold priest (lvl 40)
  eq_noxious_spider: { id: "eq_noxious_spider", name: "noxious spider", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: noxious spider (lvl 40)
  eq_king_tranyx: { id: "eq_king_tranyx", name: "King Tranyx", baseHP: 318, baseDPS: 26.8, naturalDelayTenths: 40, stats: { str: 28, con: 29, dex: 26, agi: 25, ac: 34, wis: 19, int: 19, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: King Tranix (lvl 52)
  eq_magus_rokael: { id: "eq_magus_rokael", name: "Magus Rokael", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Magus Rokyl (lvl 40)
  eq_guano_harvester: { id: "eq_guano_harvester", name: "guano harvester", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: guano harvester (lvl 40)
  eq_djinn_lord_djarn: { id: "eq_djinn_lord_djarn", name: "Djinn Lord Djarn", baseHP: 308, baseDPS: 26.0, naturalDelayTenths: 36, stats: { str: 27, con: 28, dex: 26, agi: 24, ac: 32, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Efreeti Lord Djarn (lvl 50)
  eq_death_beetle: { id: "eq_death_beetle", name: "death beetle", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: death beetle (lvl 40)
  eq_a_goblin_shaman_a_goblin_wizard: { id: "eq_a_goblin_shaman_a_goblin_wizard", name: "a goblin shaman; a goblin wizard", baseHP: 69, baseDPS: 6.7, naturalDelayTenths: 44, stats: { str: 8, con: 8, dex: 7, agi: 7, ac: 7, wis: 5, int: 5, cha: 5 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a goblin shaman; a goblin wizard (lvl 4)
  eq_yendar_starflare: { id: "eq_yendar_starflare", name: "Yendar Starflare", baseHP: 386, baseDPS: 32.3, naturalDelayTenths: 36, stats: { str: 33, con: 35, dex: 32, agi: 30, ac: 41, wis: 23, int: 23, cha: 20 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Yendar Starpyre (lvl 65)
  eq_lord_darrish: { id: "eq_lord_darrish", name: "Lord Darrish", baseHP: 105, baseDPS: 9.6, naturalDelayTenths: 38, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Lord Darish (lvl 11)
  eq_ambassador_dovenne: { id: "eq_ambassador_dovenne", name: "Ambassador Dovenne", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Ambassador DVinn (lvl 20)
  eq_bonepyre: { id: "eq_bonepyre", name: "Bonepyre", baseHP: 142, baseDPS: 12.6, naturalDelayTenths: 42, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Bonefire (lvl 18)
  eq_orc_warmonger: { id: "eq_orc_warmonger", name: "Orc Warmonger", baseHP: 131, baseDPS: 11.7, naturalDelayTenths: 38, stats: { str: 13, con: 13, dex: 12, agi: 11, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Orc Warlord (lvl 16)
  eq_bloodgargler: { id: "eq_bloodgargler", name: "Bloodgargler", baseHP: 147, baseDPS: 13.0, naturalDelayTenths: 44, stats: { str: 14, con: 15, dex: 13, agi: 13, ac: 15, wis: 10, int: 10, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Bloodgurgler (lvl 19)
  eq_emperor_krush: { id: "eq_emperor_krush", name: "Emperor Krush", baseHP: 142, baseDPS: 12.6, naturalDelayTenths: 42, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Emperor Crush (lvl 18)
  eq_orc_trainer: { id: "eq_orc_trainer", name: "orc trainer", baseHP: 116, baseDPS: 10.5, naturalDelayTenths: 42, stats: { str: 11, con: 12, dex: 11, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: orc trainer (lvl 13)
  eq_orc_oracle: { id: "eq_orc_oracle", name: "orc oracle", baseHP: 105, baseDPS: 9.6, naturalDelayTenths: 38, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: orc oracle (lvl 11)
  eq_the_oracle: { id: "eq_the_oracle", name: "The Oracle", baseHP: 136, baseDPS: 12.1, naturalDelayTenths: 40, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: The Prophet (lvl 17)
  eq_marnowbane: { id: "eq_marnowbane", name: "Marnowbane", baseHP: 105, baseDPS: 9.6, naturalDelayTenths: 38, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Marrowbane (lvl 11)
  eq_orc_slaver: { id: "eq_orc_slaver", name: "orc slaver", baseHP: 105, baseDPS: 9.6, naturalDelayTenths: 38, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: orc slaver (lvl 11)
  eq_orc_warlord: { id: "eq_orc_warlord", name: "orc warlord", baseHP: 131, baseDPS: 11.7, naturalDelayTenths: 38, stats: { str: 13, con: 13, dex: 12, agi: 11, ac: 14, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: orc warlord (lvl 16)
  eq_chokegrip: { id: "eq_chokegrip", name: "Chokegrip", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Chokehold (lvl 20)
  eq_orc_legionnaire: { id: "eq_orc_legionnaire", name: "orc legionnaire", baseHP: 105, baseDPS: 9.6, naturalDelayTenths: 38, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: orc legionnaire (lvl 11)
  eq_orc_taskmaster: { id: "eq_orc_taskmaster", name: "orc taskmaster", baseHP: 110, baseDPS: 10.0, naturalDelayTenths: 40, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: orc taskmaster (lvl 12)
  eq_crookstinger: { id: "eq_crookstinger", name: "Crookstinger", baseHP: 90, baseDPS: 8.4, naturalDelayTenths: 42, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Crookstinger (mob) (lvl 8)
  eq_bracken_undergrowth: { id: "eq_bracken_undergrowth", name: "Bracken Undergrowth", baseHP: 142, baseDPS: 12.6, naturalDelayTenths: 42, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Bracken Underbrush (lvl 18)
  eq_bilge_deepfathom: { id: "eq_bilge_deepfathom", name: "Bilge Deepfathom", baseHP: 204, baseDPS: 17.6, naturalDelayTenths: 36, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: Bilge Farfathom (lvl 30)
  eq_a_zombie_of_an_unrest_noble: { id: "eq_a_zombie_of_an_unrest_noble", name: "a zombie of an unrest noble", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a zombie of an unrest noble (lvl 20)
  eq_lesser_edge_fiend: { id: "eq_lesser_edge_fiend", name: "Lesser Edge Fiend", baseHP: 147, baseDPS: 13.0, naturalDelayTenths: 44, stats: { str: 14, con: 15, dex: 13, agi: 13, ac: 15, wis: 10, int: 10, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Lesser Blade Fiend (lvl 19)
  eq_an_undead_barkeep: { id: "eq_an_undead_barkeep", name: "an undead barkeep", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: an undead barkeep (lvl 25)
  eq_a_priest_of_najena: { id: "eq_a_priest_of_najena", name: "a priest of najena", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a priest of najena (lvl 20)
  eq_an_undead_knight_of_malaise: { id: "eq_an_undead_knight_of_malaise", name: "an undead knight of Malaise", baseHP: 194, baseDPS: 16.8, naturalDelayTenths: 42, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 20, wis: 12, int: 12, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: an undead knight of Unrest (lvl 28)
  eq_an_undead_brewer: { id: "eq_an_undead_brewer", name: "an undead brewer", baseHP: 142, baseDPS: 12.6, naturalDelayTenths: 42, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: an undead brewer (lvl 18)
  eq_garanel_ruckstaff: { id: "eq_garanel_ruckstaff", name: "Garanel Ruckstaff", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Garanel Rucksif (lvl 35)
  eq_khrix_frostoff: { id: "eq_khrix_frostoff", name: "Khrix Frostoff", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Khrix Fritchoff (lvl 35)
  eq_a_festering_hag: { id: "eq_a_festering_hag", name: "a festering hag", baseHP: 152, baseDPS: 13.4, naturalDelayTenths: 36, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a festering hag (lvl 20)
  eq_reclusive_ghoul_magus: { id: "eq_reclusive_ghoul_magus", name: "reclusive ghoul magus", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: reclusive ghoul magus (lvl 25)
  eq_a_reanimated_hand_malaise: { id: "eq_a_reanimated_hand_malaise", name: "a reanimated hand (Malaise)", baseHP: 157, baseDPS: 13.8, naturalDelayTenths: 38, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a reanimated hand (Unrest) (lvl 21)
  eq_a_reanimated_hand: { id: "eq_a_reanimated_hand", name: "a reanimated hand", baseHP: 157, baseDPS: 13.8, naturalDelayTenths: 38, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: a reanimated hand (lvl 21)
  eq_oracle_of_karnos: { id: "eq_oracle_of_karnos", name: "Oracle of K`Arnos", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Oracle of K`Arnon (lvl 40)
  eq_antinyme: { id: "eq_antinyme", name: "Antinyme", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Antinime (lvl 25)
  eq_princess_cheriste: { id: "eq_princess_cheriste", name: "Princess Cheriste", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Princess Cherista (lvl 35)
  eq_a_hemo_enologist: { id: "eq_a_hemo_enologist", name: "a hemo enologist", baseHP: 220, baseDPS: 18.9, naturalDelayTenths: 42, stats: { str: 20, con: 21, dex: 19, agi: 18, ac: 23, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: a hemo enologist (lvl 33)
  eq_an_imp_familiar: { id: "eq_an_imp_familiar", name: "an imp familiar", baseHP: 183, baseDPS: 15.9, naturalDelayTenths: 38, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: an imp familiar (lvl 26)
  eq_a_dark_librarian: { id: "eq_a_dark_librarian", name: "a dark librarian", baseHP: 209, baseDPS: 18.0, naturalDelayTenths: 38, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: a dark librarian (lvl 31)
  eq_a_glyphed_ghoul: { id: "eq_a_glyphed_ghoul", name: "a glyphed ghoul", baseHP: 188, baseDPS: 16.3, naturalDelayTenths: 40, stats: { str: 17, con: 18, dex: 16, agi: 16, ac: 20, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: a glyphed ghoul (lvl 27)
  eq_garton_viswyn: { id: "eq_garton_viswyn", name: "Garton Viswyn", baseHP: 240, baseDPS: 20.5, naturalDelayTenths: 40, stats: { str: 22, con: 23, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: Garton Viswin (lvl 37)
  eq_enynthi: { id: "eq_enynthi", name: "Enynthi", baseHP: 188, baseDPS: 16.3, naturalDelayTenths: 40, stats: { str: 17, con: 18, dex: 16, agi: 16, ac: 20, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: Enynti (lvl 27)
  eq_a_cloaked_dhampyre: { id: "eq_a_cloaked_dhampyre", name: "a cloaked dhampyre", baseHP: 220, baseDPS: 18.9, naturalDelayTenths: 42, stats: { str: 20, con: 21, dex: 19, agi: 18, ac: 23, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: a cloaked dhampyre (lvl 33)
  eq_an_avenging_caitiff: { id: "eq_an_avenging_caitiff", name: "an avenging caitiff", baseHP: 204, baseDPS: 17.6, naturalDelayTenths: 36, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: an avenging caitiff (lvl 30)
  eq_steward_syncall: { id: "eq_steward_syncall", name: "Steward Syncall", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Butler Syncall (lvl 35)
  eq_maid_issara: { id: "eq_maid_issara", name: "Maid Issara", baseHP: 230, baseDPS: 19.7, naturalDelayTenths: 36, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 24, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: Maid Issis (lvl 35)
  eq_lasna_cheron: { id: "eq_lasna_cheron", name: "Lasna Cheron", baseHP: 235, baseDPS: 20.1, naturalDelayTenths: 38, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 },
    isNamed: true,
    namedTier: "true_named" }, // src: Lasna Cheroon (lvl 36)
  eq_a_fallen_noble: { id: "eq_a_fallen_noble", name: "a fallen noble", baseHP: 194, baseDPS: 16.8, naturalDelayTenths: 42, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 20, wis: 12, int: 12, cha: 11 },
    isNamed: true,
    namedTier: "true_named" }, // src: a fallen noble (lvl 28)
  eq_phinigel_autropar: { id: "eq_phinigel_autropar", name: "Phinigel Autropar", baseHP: 324, baseDPS: 27.3, naturalDelayTenths: 42, stats: { str: 28, con: 30, dex: 27, agi: 25, ac: 34, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Phinigel Autropos (lvl 53)
  eq_estrella_of_gloomtide: { id: "eq_estrella_of_gloomtide", name: "Estrella of Gloomtide", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Estrella of Gloomwater (lvl 51)
  eq_a_fierce_impaler: { id: "eq_a_fierce_impaler", name: "a fierce impaler", baseHP: 266, baseDPS: 22.6, naturalDelayTenths: 40, stats: { str: 24, con: 25, dex: 22, agi: 21, ac: 28, wis: 17, int: 17, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a fierce impaler (lvl 42)
  eq_cauldronseethe: { id: "eq_cauldronseethe", name: "Cauldronseethe", baseHP: 303, baseDPS: 25.6, naturalDelayTenths: 44, stats: { str: 27, con: 28, dex: 25, agi: 24, ac: 32, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Cauldronboil (lvl 49)
  eq_cauldronfroth: { id: "eq_cauldronfroth", name: "Cauldronfroth", baseHP: 303, baseDPS: 25.6, naturalDelayTenths: 44, stats: { str: 27, con: 28, dex: 25, agi: 24, ac: 32, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Cauldronbubble (lvl 49)
  eq_coilspine_guardian: { id: "eq_coilspine_guardian", name: "Coilspine Guardian", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Swirlspine Guardian (lvl 51)
  eq_a_seahorse_patriarch: { id: "eq_a_seahorse_patriarch", name: "a seahorse patriarch", baseHP: 292, baseDPS: 24.7, naturalDelayTenths: 40, stats: { str: 26, con: 27, dex: 24, agi: 23, ac: 31, wis: 18, int: 18, cha: 15 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a seahorse patriarch (lvl 47)
  eq_shellara_tidehunter: { id: "eq_shellara_tidehunter", name: "Shellara Tidehunter", baseHP: 287, baseDPS: 24.3, naturalDelayTenths: 38, stats: { str: 25, con: 27, dex: 24, agi: 23, ac: 30, wis: 18, int: 18, cha: 15 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Shellara Ebbhunter (lvl 46)
  eq_riptide: { id: "eq_riptide", name: "Riptide", baseHP: 303, baseDPS: 25.6, naturalDelayTenths: 44, stats: { str: 27, con: 28, dex: 25, agi: 24, ac: 32, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Undertow (lvl 49)
  eq_a_frenzied_bull_shark: { id: "eq_a_frenzied_bull_shark", name: "a frenzied bull shark", baseHP: 214, baseDPS: 18.4, naturalDelayTenths: 40, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 },
    isNamed: true,
    namedTier: "true_named" }, // src: a frenzied bull shark (lvl 32)
  eq_a_seahorse_matriarch: { id: "eq_a_seahorse_matriarch", name: "a seahorse matriarch", baseHP: 292, baseDPS: 24.7, naturalDelayTenths: 40, stats: { str: 26, con: 27, dex: 24, agi: 23, ac: 31, wis: 18, int: 18, cha: 15 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a seahorse matriarch (lvl 47)
  eq_packmaster_dledshn: { id: "eq_packmaster_dledshn", name: "Packmaster Dledsh`n", baseHP: 142, baseDPS: 12.6, naturalDelayTenths: 42, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Packmaster Dledsh (lvl 18)
  eq_the_mudlwump: { id: "eq_the_mudlwump", name: "The Mudlwump", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: The Muglwump (lvl 25)
  eq_grodl_rendclaw: { id: "eq_grodl_rendclaw", name: "Grodl Rendclaw", baseHP: 105, baseDPS: 9.6, naturalDelayTenths: 38, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Grodl Ripclaw (lvl 11)
  eq_king_gragnor: { id: "eq_king_gragnor", name: "King Gragnor", baseHP: 173, baseDPS: 15.1, naturalDelayTenths: 44, stats: { str: 16, con: 17, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 10 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: King Gragnar (lvl 24)
  eq_kerran_tiger_spahi: { id: "eq_kerran_tiger_spahi", name: "kerran tiger spahi", baseHP: 162, baseDPS: 14.2, naturalDelayTenths: 40, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: kerran tiger spahi (lvl 22)
  eq_shazda_assad: { id: "eq_shazda_assad", name: "Shazda Assad", baseHP: 168, baseDPS: 14.7, naturalDelayTenths: 42, stats: { str: 16, con: 16, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Shazda Asad (lvl 23)
  eq_jelquar_the_soulrender: { id: "eq_jelquar_the_soulrender", name: "Jelquar the Soulrender", baseHP: 157, baseDPS: 13.8, naturalDelayTenths: 38, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 },
    isNamed: true,
    namedTier: "lesser_named" }, // src: Jelquar the Soulslayer (lvl 21)
  eq_slyder_the_elder: { id: "eq_slyder_the_elder", name: "Slyder the Elder", baseHP: 256, baseDPS: 21.8, naturalDelayTenths: 36, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Slyder the Ancient (lvl 40)
  eq_a_highland_kobold: { id: "eq_a_highland_kobold", name: "a highland kobold", baseHP: 178, baseDPS: 15.5, naturalDelayTenths: 36, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 },
    isNamed: true,
    namedTier: "true_named" }, // src: a highland kobold (lvl 25)
  eq_a_rock_golem: { id: "eq_a_rock_golem", name: "a rock golem", baseHP: 329, baseDPS: 27.7, naturalDelayTenths: 44, stats: { str: 29, con: 30, dex: 27, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a rock golem (lvl 54)
  eq_master_yaelen: { id: "eq_master_yaelen", name: "Master Yaelen", baseHP: 339, baseDPS: 28.5, naturalDelayTenths: 38, stats: { str: 30, con: 31, dex: 28, agi: 27, ac: 36, wis: 21, int: 21, cha: 18 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Master Yael (lvl 56)
  eq_an_elemental_deceiver: { id: "eq_an_elemental_deceiver", name: "an elemental deceiver", baseHP: 282, baseDPS: 23.9, naturalDelayTenths: 36, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 },
    isNamed: true,
    namedTier: "apex_named" }, // src: an elemental deceiver (lvl 45)
  eq_dartain_the_forsaken: { id: "eq_dartain_the_forsaken", name: "Dartain the Forsaken", baseHP: 282, baseDPS: 23.9, naturalDelayTenths: 36, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Dartain the Lost (lvl 45)
  eq_ulrik_the_pious: { id: "eq_ulrik_the_pious", name: "Ulrik the Pious", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Ulrik the Devout (lvl 51)
  eq_stonesoul_the_immovable: { id: "eq_stonesoul_the_immovable", name: "Stonesoul the Immovable", baseHP: 282, baseDPS: 23.9, naturalDelayTenths: 36, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Stonesoul the Unmoving (lvl 45)
  eq_a_revenant: { id: "eq_a_revenant", name: "a revenant", baseHP: 282, baseDPS: 23.9, naturalDelayTenths: 36, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a revenant (lvl 45)
  eq_gibartek: { id: "eq_gibartek", name: "Gibartek", baseHP: 282, baseDPS: 23.9, naturalDelayTenths: 36, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Gibartik (lvl 45)
  eq_stonemill_minion: { id: "eq_stonemill_minion", name: "Stonemill Minion", baseHP: 303, baseDPS: 25.6, naturalDelayTenths: 44, stats: { str: 27, con: 28, dex: 25, agi: 24, ac: 32, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Stonegrinder Minion (lvl 49)
  eq_initiate_sirlin: { id: "eq_initiate_sirlin", name: "Initiate Sirlin", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Initiate Sirlis (lvl 55)
  eq_irslak_the_ruined: { id: "eq_irslak_the_ruined", name: "Irslak the Ruined", baseHP: 308, baseDPS: 26.0, naturalDelayTenths: 36, stats: { str: 27, con: 28, dex: 26, agi: 24, ac: 32, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Irslak the Wretched (lvl 50)
  eq_niltoth_the_profane: { id: "eq_niltoth_the_profane", name: "Niltoth the Profane", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Niltoth the Unholy (lvl 51)
  eq_commander_yarrik: { id: "eq_commander_yarrik", name: "Commander Yarrik", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Commander Yarik (lvl 51)
  eq_slizik_the_colossal: { id: "eq_slizik_the_colossal", name: "Slizik the Colossal", baseHP: 329, baseDPS: 27.7, naturalDelayTenths: 44, stats: { str: 29, con: 30, dex: 27, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Slizik the Mighty (lvl 54)
  eq_a_dracoliche: { id: "eq_a_dracoliche", name: "a dracoliche", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a dracoliche (lvl 55)
  eq_zaic_thal_god: { id: "eq_zaic_thal_god", name: "Zaic-Thal (God)", baseHP: 376, baseDPS: 31.5, naturalDelayTenths: 42, stats: { str: 32, con: 34, dex: 31, agi: 29, ac: 40, wis: 23, int: 23, cha: 19 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Cazic Thule (God) (lvl 63)
  eq_panic: { id: "eq_panic", name: "Panic", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Fright (lvl 55)
  eq_a_scareling: { id: "eq_a_scareling", name: "a scareling", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a scareling (lvl 51)
  eq_a_turmoil_toad: { id: "eq_a_turmoil_toad", name: "a turmoil toad", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a turmoil toad (lvl 51)
  eq_terror_dread_and_panic: { id: "eq_terror_dread_and_panic", name: "Terror, Dread, and Panic", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Terror , Dread , and Fright (lvl 51)
  eq_a_samhain: { id: "eq_a_samhain", name: "a samhain", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a samhain (lvl 51)
  eq_amygdaline_knight: { id: "eq_amygdaline_knight", name: "amygdaline knight", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: amygdalan knight (lvl 51)
  eq_a_glare_lord: { id: "eq_a_glare_lord", name: "a glare lord", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a glare lord (lvl 51)
  eq_dracolich: { id: "eq_dracolich", name: "Dracolich", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Dracoliche (lvl 55)
  eq_a_gorgon: { id: "eq_a_gorgon", name: "a gorgon", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a gorgon (lvl 51)
  eq_a_spinechiller_spider: { id: "eq_a_spinechiller_spider", name: "a spinechiller spider", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a spinechiller spider (lvl 51)
  eq_grandmaster_rtan: { id: "eq_grandmaster_rtan", name: "Grandmaster R`Tan", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Grandmaster R`Tal (lvl 51)
  eq_lord_of_wrath: { id: "eq_lord_of_wrath", name: "Lord of Wrath", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Lord of Ire (lvl 55)
  eq_a_kiraikuei: { id: "eq_a_kiraikuei", name: "a kiraikuei", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a kiraikuei (lvl 51)
  eq_an_ire_ghast: { id: "eq_an_ire_ghast", name: "an ire ghast", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: an ire ghast (lvl 51)
  eq_master_of_venom: { id: "eq_master_of_venom", name: "Master of Venom", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Master of Spite (lvl 55)
  eq_magi_ptasyn: { id: "eq_magi_ptasyn", name: "Magi P`Tasyn", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Magi P`Tasa (lvl 55)
  eq_mistress_of_disdain: { id: "eq_mistress_of_disdain", name: "Mistress of Disdain", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Mistress of Scorn (lvl 51)
  eq_avatar_of_malice: { id: "eq_avatar_of_malice", name: "Avatar of Malice", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Avatar of Abhorrence (lvl 55)
  eq_maestro_of_bile: { id: "eq_maestro_of_bile", name: "Maestro of Bile", baseHP: 350, baseDPS: 29.4, naturalDelayTenths: 42, stats: { str: 30, con: 32, dex: 29, agi: 27, ac: 37, wis: 21, int: 21, cha: 18 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Maestro of Rancor (lvl 58)
  eq_an_eerie_chest: { id: "eq_an_eerie_chest", name: "an eerie chest", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: an eerie chest (lvl 51)
  eq_a_scorn_banshee: { id: "eq_a_scorn_banshee", name: "a scorn banshee", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a scorn banshee (lvl 51)
  eq_innorath_god: { id: "eq_innorath_god", name: "Innorath (God)", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Innoruuk (God) (lvl 55)
  eq_lord_of_contempt: { id: "eq_lord_of_contempt", name: "Lord of Contempt", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Lord of Loathing (lvl 51)
  eq_coercer_tvalyn: { id: "eq_coercer_tvalyn", name: "Coercer T`valyn", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Coercer T`vala (lvl 51)
  eq_an_abhorrent: { id: "eq_an_abhorrent", name: "an abhorrent", baseHP: 334, baseDPS: 28.1, naturalDelayTenths: 36, stats: { str: 29, con: 31, dex: 28, agi: 26, ac: 35, wis: 20, int: 20, cha: 17 },
    isNamed: true,
    namedTier: "apex_named" }, // src: an abhorrent (lvl 55)
  eq_innorath: { id: "eq_innorath", name: "Innorath", baseHP: 376, baseDPS: 31.5, naturalDelayTenths: 42, stats: { str: 32, con: 34, dex: 31, agi: 29, ac: 40, wis: 23, int: 23, cha: 19 },
    isNamed: true,
    namedTier: "apex_named" }, // src: Innoruuk (lvl 63)
  eq_haunted_chest: { id: "eq_haunted_chest", name: "haunted chest", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: haunted chest (lvl 51)
  eq_an_agent_of_innorath: { id: "eq_an_agent_of_innorath", name: "an Agent of Innorath", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: an Agent of Innoruuk (lvl 51)
  eq_a_blade_storm: { id: "eq_a_blade_storm", name: "a blade storm", baseHP: 376, baseDPS: 31.5, naturalDelayTenths: 42, stats: { str: 32, con: 34, dex: 31, agi: 29, ac: 40, wis: 23, int: 23, cha: 19 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a blade storm (lvl 63)
  eq_a_soul_harvester: { id: "eq_a_soul_harvester", name: "a soul harvester", baseHP: 313, baseDPS: 26.4, naturalDelayTenths: 38, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a soul harvester (lvl 51)
  eq_a_thunder_spirit: { id: "eq_a_thunder_spirit", name: "a thunder spirit", baseHP: 376, baseDPS: 31.5, naturalDelayTenths: 42, stats: { str: 32, con: 34, dex: 31, agi: 29, ac: 40, wis: 23, int: 23, cha: 19 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a thunder spirit (lvl 63)
  eq_a_gust_of_wind: { id: "eq_a_gust_of_wind", name: "a gust of wind", baseHP: 376, baseDPS: 31.5, naturalDelayTenths: 42, stats: { str: 32, con: 34, dex: 31, agi: 29, ac: 40, wis: 23, int: 23, cha: 19 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a gust of wind (lvl 63)
  eq_a_thunder_spirit_princess: { id: "eq_a_thunder_spirit_princess", name: "a thunder spirit princess", baseHP: 376, baseDPS: 31.5, naturalDelayTenths: 42, stats: { str: 32, con: 34, dex: 31, agi: 29, ac: 40, wis: 23, int: 23, cha: 19 },
    isNamed: true,
    namedTier: "apex_named" }, // src: a thunder spirit princess (lvl 63)
  eq_rats: { id: "eq_rats", name: "Rats", baseHP: 54, baseDPS: 4.9, naturalDelayTenths: 30, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 9, wis: 6, int: 6, cha: 5 } }, // src: rats (lvl 7)
  eq_bats: { id: "eq_bats", name: "Bats", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: bats (lvl 10)
  eq_fire_beetles: { id: "eq_fire_beetles", name: "Fire Beetles", baseHP: 39, baseDPS: 3.7, naturalDelayTenths: 34, stats: { str: 8, con: 8, dex: 7, agi: 7, ac: 7, wis: 5, int: 5, cha: 5 } }, // src: fire beetles (lvl 4)
  eq_decaying_skeletons: { id: "eq_decaying_skeletons", name: "Decaying Skeletons", baseHP: 28, baseDPS: 2.8, naturalDelayTenths: 30, stats: { str: 7, con: 7, dex: 6, agi: 6, ac: 6, wis: 5, int: 5, cha: 4 } }, // src: decaying skeletons (lvl 2)
  eq_gnoll_pups: { id: "eq_gnoll_pups", name: "Gnoll Pups", baseHP: 28, baseDPS: 2.8, naturalDelayTenths: 30, stats: { str: 7, con: 7, dex: 6, agi: 6, ac: 6, wis: 5, int: 5, cha: 4 } }, // src: gnoll pups (lvl 2)
  eq_skippy_nightpaw: { id: "eq_skippy_nightpaw", name: "Skippy Nightpaw", baseHP: 28, baseDPS: 2.8, naturalDelayTenths: 30, stats: { str: 7, con: 7, dex: 6, agi: 6, ac: 6, wis: 5, int: 5, cha: 4 } }, // src: Fippy Darkpaw (lvl 2)
  eq_orcs: { id: "eq_orcs", name: "Orcs", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: orcs (lvl 11)
  eq_snakes: { id: "eq_snakes", name: "Snakes", baseHP: 54, baseDPS: 4.9, naturalDelayTenths: 30, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 9, wis: 6, int: 6, cha: 5 } }, // src: snakes (lvl 7)
  eq_alligators: { id: "eq_alligators", name: "Alligators", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: alligators (lvl 12)
  eq_skeletons: { id: "eq_skeletons", name: "Skeletons", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: skeletons (lvl 12)
  eq_zombies: { id: "eq_zombies", name: "Zombies", baseHP: 86, baseDPS: 7.5, naturalDelayTenths: 32, stats: { str: 11, con: 12, dex: 11, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: zombies (lvl 13)
  eq_kobolds: { id: "eq_kobolds", name: "Kobolds", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: kobolds (lvl 12)
  eq_fungus_men: { id: "eq_fungus_men", name: "Fungus Men", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: fungus men (lvl 10)
  eq_frogloks: { id: "eq_frogloks", name: "Frogloks", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: frogloks (lvl 14)
  eq_gnolls: { id: "eq_gnolls", name: "Gnolls", baseHP: 106, baseDPS: 9.1, naturalDelayTenths: 30, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: gnolls (lvl 17)
  eq_wolves: { id: "eq_wolves", name: "Wolves", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: wolves (lvl 10)
  eq_bears: { id: "eq_bears", name: "Bears", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: bears (lvl 11)
  eq_rabid_wildlife: { id: "eq_rabid_wildlife", name: "Rabid Wildlife", baseHP: 39, baseDPS: 3.7, naturalDelayTenths: 34, stats: { str: 8, con: 8, dex: 7, agi: 7, ac: 7, wis: 5, int: 5, cha: 5 } }, // src: rabid wildlife (lvl 4)
  eq_lizard_men: { id: "eq_lizard_men", name: "Lizard Men", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: lizard men (lvl 12)
  eq_spiders: { id: "eq_spiders", name: "Spiders", baseHP: 65, baseDPS: 5.8, naturalDelayTenths: 34, stats: { str: 10, con: 10, dex: 9, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: spiders (lvl 9)
  eq_spectres: { id: "eq_spectres", name: "Spectres", baseHP: 86, baseDPS: 7.5, naturalDelayTenths: 32, stats: { str: 11, con: 12, dex: 11, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: spectres (lvl 13)
  eq_bixies: { id: "eq_bixies", name: "Bixies", baseHP: 86, baseDPS: 7.5, naturalDelayTenths: 32, stats: { str: 11, con: 12, dex: 11, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: bixies (lvl 13)
  eq_wasps: { id: "eq_wasps", name: "Wasps", baseHP: 54, baseDPS: 4.9, naturalDelayTenths: 30, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 9, wis: 6, int: 6, cha: 5 } }, // src: wasps (lvl 7)
  eq_goblins: { id: "eq_goblins", name: "Goblins", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: goblins (lvl 12)
  eq_undead: { id: "eq_undead", name: "Undead", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: undead (lvl 10)
  eq_mummies: { id: "eq_mummies", name: "Mummies", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: mummies (lvl 11)
  eq_halflings: { id: "eq_halflings", name: "Halflings", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: halflings (lvl 6)
  eq_shadowed_men: { id: "eq_shadowed_men", name: "Shadowed Men", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: shadowed men (lvl 14)
  eq_dark_elf_guards: { id: "eq_dark_elf_guards", name: "Dark Elf Guards", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: dark elf guards (lvl 6)
  eq_jackals: { id: "eq_jackals", name: "Jackals", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: jackals (lvl 6)
  eq_tarantulas: { id: "eq_tarantulas", name: "Tarantulas", baseHP: 65, baseDPS: 5.8, naturalDelayTenths: 34, stats: { str: 10, con: 10, dex: 9, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: tarantulas (lvl 9)
  eq_dervishes: { id: "eq_dervishes", name: "Dervishes", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: dervishes (lvl 10)
  eq_ghouls: { id: "eq_ghouls", name: "Ghouls", baseHP: 112, baseDPS: 9.6, naturalDelayTenths: 32, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 } }, // src: ghouls (lvl 18)
  eq_madmen: { id: "eq_madmen", name: "Madmen", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: madmen (lvl 11)
  eq_sand_giants: { id: "eq_sand_giants", name: "Sand Giants", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: sand giants (lvl 11)
  eq_scalebones: { id: "eq_scalebones", name: "Scalebones", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: scalebones (lvl 6)
  eq_iksar_ghosts: { id: "eq_iksar_ghosts", name: "Iksar Ghosts", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: iksar ghosts (lvl 6)
  eq_sarnak_ghosts: { id: "eq_sarnak_ghosts", name: "Sarnak Ghosts", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: sarnak ghosts (lvl 6)
  eq_spiderlings: { id: "eq_spiderlings", name: "Spiderlings", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: spiderlings (lvl 6)
  eq_wraiths: { id: "eq_wraiths", name: "Wraiths", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: wraiths (lvl 6)
  eq_failed_experiments: { id: "eq_failed_experiments", name: "Failed Experiments", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: failed experiments (lvl 6)
  eq_ice_goblins: { id: "eq_ice_goblins", name: "Ice Goblins", baseHP: 96, baseDPS: 8.3, naturalDelayTenths: 26, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 } }, // src: ice goblins (lvl 15)
  eq_snow_spiders: { id: "eq_snow_spiders", name: "Snow Spiders", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: snow spiders (lvl 10)
  eq_polar_bears: { id: "eq_polar_bears", name: "Polar Bears", baseHP: 96, baseDPS: 8.3, naturalDelayTenths: 26, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 } }, // src: polar bears (lvl 15)
  eq_snow_leopards: { id: "eq_snow_leopards", name: "Snow Leopards", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: snow leopards (lvl 10)
  eq_mammoths: { id: "eq_mammoths", name: "Mammoths", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: mammoths (lvl 10)
  eq_icy_orcs: { id: "eq_icy_orcs", name: "Icy Orcs", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: icy orcs (lvl 10)
  eq_ice_giants: { id: "eq_ice_giants", name: "Ice Giants", baseHP: 96, baseDPS: 8.3, naturalDelayTenths: 26, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 } }, // src: ice giants (lvl 15)
  eq_drakes: { id: "eq_drakes", name: "Drakes", baseHP: 148, baseDPS: 12.5, naturalDelayTenths: 26, stats: { str: 16, con: 17, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: drakes (lvl 25)
  eq_basilisks: { id: "eq_basilisks", name: "Basilisks", baseHP: 117, baseDPS: 10.0, naturalDelayTenths: 34, stats: { str: 14, con: 15, dex: 13, agi: 13, ac: 15, wis: 10, int: 10, cha: 8 } }, // src: basilisks (lvl 19)
  eq_cyclopes: { id: "eq_cyclopes", name: "Cyclopes", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: cyclopes (lvl 21)
  eq_hill_giants: { id: "eq_hill_giants", name: "Hill Giants", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: hill giants (lvl 14)
  eq_pumas: { id: "eq_pumas", name: "Pumas", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: pumas (lvl 10)
  eq_scarabs: { id: "eq_scarabs", name: "Scarabs", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: scarabs (lvl 11)
  eq_will_o_wisps: { id: "eq_will_o_wisps", name: "Will-O-Wisps", baseHP: 60, baseDPS: 5.4, naturalDelayTenths: 32, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 } }, // src: will-o-wisps (lvl 8)
  eq_griffins: { id: "eq_griffins", name: "Griffins", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: griffins (lvl 10)
  eq_beetles: { id: "eq_beetles", name: "Beetles", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: beetles (lvl 12)
  eq_fish: { id: "eq_fish", name: "Fish", baseHP: 60, baseDPS: 5.4, naturalDelayTenths: 32, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 } }, // src: fish (lvl 8)
  eq_beggars: { id: "eq_beggars", name: "Beggars", baseHP: 60, baseDPS: 5.4, naturalDelayTenths: 32, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 } }, // src: beggars (lvl 8)
  eq_mercenaries: { id: "eq_mercenaries", name: "Mercenaries", baseHP: 60, baseDPS: 5.4, naturalDelayTenths: 32, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 } }, // src: mercenaries (lvl 8)
  eq_thugs: { id: "eq_thugs", name: "Thugs", baseHP: 60, baseDPS: 5.4, naturalDelayTenths: 32, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 } }, // src: thugs (lvl 8)
  eq_smugglers: { id: "eq_smugglers", name: "Smugglers", baseHP: 117, baseDPS: 10.0, naturalDelayTenths: 34, stats: { str: 14, con: 15, dex: 13, agi: 13, ac: 15, wis: 10, int: 10, cha: 8 } }, // src: smugglers (lvl 19)
  eq_necromancers: { id: "eq_necromancers", name: "Necromancers", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: necromancers (lvl 14)
  eq_gelatinous_cubes: { id: "eq_gelatinous_cubes", name: "Gelatinous Cubes", baseHP: 60, baseDPS: 5.4, naturalDelayTenths: 32, stats: { str: 9, con: 10, dex: 9, agi: 8, ac: 9, wis: 7, int: 7, cha: 6 } }, // src: gelatinous cubes (lvl 8)
  eq_bandits: { id: "eq_bandits", name: "Bandits", baseHP: 86, baseDPS: 7.5, naturalDelayTenths: 32, stats: { str: 11, con: 12, dex: 11, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: bandits (lvl 13)
  eq_lions: { id: "eq_lions", name: "Lions", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: lions (lvl 14)
  eq_scarecrows: { id: "eq_scarecrows", name: "Scarecrows", baseHP: 65, baseDPS: 5.8, naturalDelayTenths: 34, stats: { str: 10, con: 10, dex: 9, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: scarecrows (lvl 9)
  eq_gnoll_shamans: { id: "eq_gnoll_shamans", name: "Gnoll Shamans", baseHP: 132, baseDPS: 11.2, naturalDelayTenths: 30, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 } }, // src: gnoll shamans (lvl 22)
  eq_gnoll_guards: { id: "eq_gnoll_guards", name: "Gnoll Guards", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: gnoll guards (lvl 12)
  eq_giant_snakes: { id: "eq_giant_snakes", name: "Giant Snakes", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: giant snakes (lvl 12)
  eq_plague_rats: { id: "eq_plague_rats", name: "Plague Rats", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: plague rats (lvl 12)
  eq_razorgills: { id: "eq_razorgills", name: "Razorgills", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: razorgills (lvl 12)
  eq_shadow_knights: { id: "eq_shadow_knights", name: "Shadow Knights", baseHP: 190, baseDPS: 15.9, naturalDelayTenths: 32, stats: { str: 20, con: 21, dex: 19, agi: 18, ac: 23, wis: 14, int: 14, cha: 12 } }, // src: shadow knights (lvl 33)
  eq_dark_elves: { id: "eq_dark_elves", name: "Dark Elves", baseHP: 164, baseDPS: 13.8, naturalDelayTenths: 32, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 20, wis: 12, int: 12, cha: 11 } }, // src: dark elves (lvl 28)
  eq_raiders: { id: "eq_raiders", name: "Raiders", baseHP: 101, baseDPS: 8.7, naturalDelayTenths: 28, stats: { str: 13, con: 13, dex: 12, agi: 11, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: raiders (lvl 16)
  eq_griffawns: { id: "eq_griffawns", name: "Griffawns", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: griffawns (lvl 12)
  eq_treants: { id: "eq_treants", name: "Treants", baseHP: 96, baseDPS: 8.3, naturalDelayTenths: 26, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 } }, // src: treants (lvl 15)
  eq_gorge_hounds: { id: "eq_gorge_hounds", name: "Gorge Hounds", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: gorge hounds (lvl 14)
  eq_evil_eyes: { id: "eq_evil_eyes", name: "Evil Eyes", baseHP: 143, baseDPS: 12.1, naturalDelayTenths: 34, stats: { str: 16, con: 17, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 10 } }, // src: evil eyes (lvl 24)
  eq_aqua_goblins: { id: "eq_aqua_goblins", name: "Aqua Goblins", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: aqua goblins (lvl 21)
  eq_deepwater_goblins: { id: "eq_deepwater_goblins", name: "Deepwater Goblins", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: deepwater goblins (lvl 12)
  eq_water_snakes: { id: "eq_water_snakes", name: "Water Snakes", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: water snakes (lvl 12)
  eq_sharks: { id: "eq_sharks", name: "Sharks", baseHP: 138, baseDPS: 11.7, naturalDelayTenths: 32, stats: { str: 16, con: 16, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 9 } }, // src: sharks (lvl 23)
  eq_aviaks: { id: "eq_aviaks", name: "Aviaks", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: aviaks (lvl 21)
  eq_stone_skeletons: { id: "eq_stone_skeletons", name: "Stone Skeletons", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: stone skeletons (lvl 12)
  eq_froglok_shamans: { id: "eq_froglok_shamans", name: "Froglok Shamans", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: froglok shamans (lvl 26)
  eq_froglok_knights: { id: "eq_froglok_knights", name: "Froglok Knights", baseHP: 106, baseDPS: 9.1, naturalDelayTenths: 30, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: froglok knights (lvl 17)
  eq_crocodiles: { id: "eq_crocodiles", name: "Crocodiles", baseHP: 101, baseDPS: 8.7, naturalDelayTenths: 28, stats: { str: 13, con: 13, dex: 12, agi: 11, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: crocodiles (lvl 16)
  eq_heart_spiders: { id: "eq_heart_spiders", name: "Heart Spiders", baseHP: 106, baseDPS: 9.1, naturalDelayTenths: 30, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: heart spiders (lvl 17)
  eq_skeletal_monks: { id: "eq_skeletal_monks", name: "Skeletal Monks", baseHP: 106, baseDPS: 9.1, naturalDelayTenths: 30, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: skeletal monks (lvl 17)
  eq_fire_drakes: { id: "eq_fire_drakes", name: "Fire Drakes", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: fire drakes (lvl 14)
  eq_fire_elementals: { id: "eq_fire_elementals", name: "Fire Elementals", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: fire elementals (lvl 20)
  eq_fire_sprites: { id: "eq_fire_sprites", name: "Fire Sprites", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: fire sprites (lvl 14)
  eq_lava_crawlers: { id: "eq_lava_crawlers", name: "Lava Crawlers", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: lava crawlers (lvl 14)
  eq_rock_dervishes: { id: "eq_rock_dervishes", name: "Rock Dervishes", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: rock dervishes (lvl 14)
  eq_fire_imps: { id: "eq_fire_imps", name: "Fire Imps", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: fire imps (lvl 14)
  eq_lava_basilisks: { id: "eq_lava_basilisks", name: "Lava Basilisks", baseHP: 91, baseDPS: 7.9, naturalDelayTenths: 34, stats: { str: 12, con: 12, dex: 11, agi: 11, ac: 13, wis: 8, int: 8, cha: 7 } }, // src: lava basilisks (lvl 14)
  eq_fire_goblins: { id: "eq_fire_goblins", name: "Fire Goblins", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: fire goblins (lvl 20)
  eq_caimans: { id: "eq_caimans", name: "Caimans", baseHP: 96, baseDPS: 8.3, naturalDelayTenths: 26, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 } }, // src: caimans (lvl 15)
  eq_dry_bones: { id: "eq_dry_bones", name: "Dry Bones", baseHP: 96, baseDPS: 8.3, naturalDelayTenths: 26, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 } }, // src: dry bones (lvl 15)
  eq_goblin_shamans: { id: "eq_goblin_shamans", name: "Goblin Shamans", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: goblin shamans (lvl 20)
  eq_goblin_guards: { id: "eq_goblin_guards", name: "Goblin Guards", baseHP: 106, baseDPS: 9.1, naturalDelayTenths: 30, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: goblin guards (lvl 17)
  eq_goblin_miners: { id: "eq_goblin_miners", name: "Goblin Miners", baseHP: 106, baseDPS: 9.1, naturalDelayTenths: 30, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: goblin miners (lvl 17)
  eq_goblin_overseers: { id: "eq_goblin_overseers", name: "Goblin Overseers", baseHP: 106, baseDPS: 9.1, naturalDelayTenths: 30, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: goblin overseers (lvl 17)
  eq_slime_elementals: { id: "eq_slime_elementals", name: "Slime Elementals", baseHP: 106, baseDPS: 9.1, naturalDelayTenths: 30, stats: { str: 13, con: 14, dex: 12, agi: 12, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: slime elementals (lvl 17)
  eq_ogre_guards: { id: "eq_ogre_guards", name: "Ogre Guards", baseHP: 117, baseDPS: 10.0, naturalDelayTenths: 34, stats: { str: 14, con: 15, dex: 13, agi: 13, ac: 15, wis: 10, int: 10, cha: 8 } }, // src: ogre guards (lvl 19)
  eq_magicians: { id: "eq_magicians", name: "Magicians", baseHP: 117, baseDPS: 10.0, naturalDelayTenths: 34, stats: { str: 14, con: 15, dex: 13, agi: 13, ac: 15, wis: 10, int: 10, cha: 8 } }, // src: magicians (lvl 19)
  eq_elementals: { id: "eq_elementals", name: "Elementals", baseHP: 138, baseDPS: 11.7, naturalDelayTenths: 32, stats: { str: 16, con: 16, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 9 } }, // src: elementals (lvl 23)
  eq_giant_spiders: { id: "eq_giant_spiders", name: "Giant Spiders", baseHP: 169, baseDPS: 14.2, naturalDelayTenths: 34, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 21, wis: 13, int: 13, cha: 11 } }, // src: giant spiders (lvl 29)
  eq_froglok_ghouls: { id: "eq_froglok_ghouls", name: "Froglok Ghouls", baseHP: 164, baseDPS: 13.8, naturalDelayTenths: 32, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 20, wis: 12, int: 12, cha: 11 } }, // src: froglok ghouls (lvl 28)
  eq_tentacle_terrors: { id: "eq_tentacle_terrors", name: "Tentacle Terrors", baseHP: 174, baseDPS: 14.6, naturalDelayTenths: 26, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 } }, // src: tentacle terrors (lvl 30)
  eq_muddites: { id: "eq_muddites", name: "Muddites", baseHP: 96, baseDPS: 8.3, naturalDelayTenths: 26, stats: { str: 12, con: 13, dex: 12, agi: 11, ac: 13, wis: 9, int: 9, cha: 7 } }, // src: muddites (lvl 15)
  eq_minotaurs: { id: "eq_minotaurs", name: "Minotaurs", baseHP: 117, baseDPS: 10.0, naturalDelayTenths: 34, stats: { str: 14, con: 15, dex: 13, agi: 13, ac: 15, wis: 10, int: 10, cha: 8 } }, // src: minotaurs (lvl 19)
  eq_dread_wolves: { id: "eq_dread_wolves", name: "Dread Wolves", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: dread wolves (lvl 21)
  eq_undead_soldiers: { id: "eq_undead_soldiers", name: "Undead Soldiers", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: undead soldiers (lvl 21)
  eq_goblin_casters: { id: "eq_goblin_casters", name: "Goblin Casters", baseHP: 143, baseDPS: 12.1, naturalDelayTenths: 34, stats: { str: 16, con: 17, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 10 } }, // src: goblin casters (lvl 24)
  eq_dire_wolves: { id: "eq_dire_wolves", name: "Dire Wolves", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: dire wolves (lvl 20)
  eq_icy_terrors: { id: "eq_icy_terrors", name: "Icy Terrors", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: icy terrors (lvl 20)
  eq_centaurs: { id: "eq_centaurs", name: "Centaurs", baseHP: 132, baseDPS: 11.2, naturalDelayTenths: 30, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 } }, // src: centaurs (lvl 22)
  eq_elephants: { id: "eq_elephants", name: "Elephants", baseHP: 132, baseDPS: 11.2, naturalDelayTenths: 30, stats: { str: 15, con: 16, dex: 14, agi: 14, ac: 17, wis: 11, int: 11, cha: 9 } }, // src: elephants (lvl 22)
  eq_werewolves: { id: "eq_werewolves", name: "Werewolves", baseHP: 143, baseDPS: 12.1, naturalDelayTenths: 34, stats: { str: 16, con: 17, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 10 } }, // src: werewolves (lvl 24)
  eq_orc_casters: { id: "eq_orc_casters", name: "Orc Casters", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: orc casters (lvl 21)
  eq_goblin_wizards: { id: "eq_goblin_wizards", name: "Goblin Wizards", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: goblin wizards (lvl 26)
  eq_gnome_miners: { id: "eq_gnome_miners", name: "Gnome Miners", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: gnome miners (lvl 26)
  eq_gnome_casters: { id: "eq_gnome_casters", name: "Gnome Casters", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: gnome casters (lvl 26)
  eq_clockworks: { id: "eq_clockworks", name: "Clockworks", baseHP: 101, baseDPS: 8.7, naturalDelayTenths: 28, stats: { str: 13, con: 13, dex: 12, agi: 11, ac: 14, wis: 9, int: 9, cha: 8 } }, // src: clockworks (lvl 16)
  eq_lizardmen: { id: "eq_lizardmen", name: "Lizardmen", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: lizardmen (lvl 26)
  eq_lizard_priests: { id: "eq_lizard_priests", name: "Lizard Priests", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: lizard priests (lvl 26)
  eq_lizard_crusaders: { id: "eq_lizard_crusaders", name: "Lizard Crusaders", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: lizard crusaders (lvl 26)
  eq_gorillas: { id: "eq_gorillas", name: "Gorillas", baseHP: 138, baseDPS: 11.7, naturalDelayTenths: 32, stats: { str: 16, con: 16, dex: 15, agi: 14, ac: 18, wis: 11, int: 11, cha: 9 } }, // src: gorillas (lvl 23)
  eq_clay_golems: { id: "eq_clay_golems", name: "Clay Golems", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: clay golems (lvl 26)
  eq_stone_golems: { id: "eq_stone_golems", name: "Stone Golems", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: stone golems (lvl 26)
  eq_steel_golems: { id: "eq_steel_golems", name: "Steel Golems", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: steel golems (lvl 26)
  eq_pickclaw_goblins: { id: "eq_pickclaw_goblins", name: "Pickclaw Goblins", baseHP: 164, baseDPS: 13.8, naturalDelayTenths: 32, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 20, wis: 12, int: 12, cha: 11 } }, // src: pickclaw goblins (lvl 28)
  eq_gnoll_warriors: { id: "eq_gnoll_warriors", name: "Gnoll Warriors", baseHP: 184, baseDPS: 15.4, naturalDelayTenths: 30, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 } }, // src: gnoll warriors (lvl 32)
  eq_gnoll_rogues: { id: "eq_gnoll_rogues", name: "Gnoll Rogues", baseHP: 184, baseDPS: 15.4, naturalDelayTenths: 30, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 } }, // src: gnoll rogues (lvl 32)
  eq_gnoll_clerics: { id: "eq_gnoll_clerics", name: "Gnoll Clerics", baseHP: 184, baseDPS: 15.4, naturalDelayTenths: 30, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 } }, // src: gnoll clerics (lvl 32)
  eq_gnoll_casters: { id: "eq_gnoll_casters", name: "Gnoll Casters", baseHP: 184, baseDPS: 15.4, naturalDelayTenths: 30, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 } }, // src: gnoll casters (lvl 32)
  eq_gnoll_prisoners: { id: "eq_gnoll_prisoners", name: "Gnoll Prisoners", baseHP: 184, baseDPS: 15.4, naturalDelayTenths: 30, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 } }, // src: gnoll prisoners (lvl 32)
  eq_gaduladian_widemouths: { id: "eq_gaduladian_widemouths", name: "Gaduladian Widemouths", baseHP: 184, baseDPS: 15.4, naturalDelayTenths: 30, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 23, wis: 14, int: 14, cha: 12 } }, // src: gaduladian widemouths (lvl 32)
  eq_froglok_wizards: { id: "eq_froglok_wizards", name: "Froglok Wizards", baseHP: 205, baseDPS: 17.1, naturalDelayTenths: 28, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 } }, // src: froglok wizards (lvl 36)
  eq_gargoyles: { id: "eq_gargoyles", name: "Gargoyles", baseHP: 174, baseDPS: 14.6, naturalDelayTenths: 26, stats: { str: 19, con: 20, dex: 18, agi: 17, ac: 22, wis: 13, int: 13, cha: 11 } }, // src: gargoyles (lvl 30)
  eq_vampire_bats: { id: "eq_vampire_bats", name: "Vampire Bats", baseHP: 205, baseDPS: 17.1, naturalDelayTenths: 28, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 } }, // src: vampire bats (lvl 36)
  eq_ice_bone_skeletons: { id: "eq_ice_bone_skeletons", name: "Ice-Bone Skeletons", baseHP: 205, baseDPS: 17.1, naturalDelayTenths: 28, stats: { str: 21, con: 22, dex: 20, agi: 19, ac: 25, wis: 15, int: 15, cha: 13 } }, // src: ice-bone skeletons (lvl 36)
  eq_lava_guardians: { id: "eq_lava_guardians", name: "Lava Guardians", baseHP: 226, baseDPS: 18.8, naturalDelayTenths: 26, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 } }, // src: lava guardians (lvl 40)
  eq_imps: { id: "eq_imps", name: "Imps", baseHP: 257, baseDPS: 21.3, naturalDelayTenths: 28, stats: { str: 25, con: 27, dex: 24, agi: 23, ac: 30, wis: 18, int: 18, cha: 15 } }, // src: imps (lvl 46)
  eq_fire_giants: { id: "eq_fire_giants", name: "Fire Giants", baseHP: 226, baseDPS: 18.8, naturalDelayTenths: 26, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 } }, // src: fire giants (lvl 40)
  eq_efreeti: { id: "eq_efreeti", name: "Efreeti", baseHP: 226, baseDPS: 18.8, naturalDelayTenths: 26, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 } }, // src: efreeti (lvl 40)
  eq_fire_dragon: { id: "eq_fire_dragon", name: "Fire Dragon", baseHP: 226, baseDPS: 18.8, naturalDelayTenths: 26, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 27, wis: 16, int: 16, cha: 14 } }, // src: fire dragon (lvl 40)
  eq_pixies: { id: "eq_pixies", name: "Pixies", baseHP: 54, baseDPS: 4.9, naturalDelayTenths: 30, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 9, wis: 6, int: 6, cha: 5 } }, // src: pixies (lvl 7)
  eq_faeries: { id: "eq_faeries", name: "Faeries", baseHP: 54, baseDPS: 4.9, naturalDelayTenths: 30, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 9, wis: 6, int: 6, cha: 5 } }, // src: faeries (lvl 7)
  eq_dwarf_bandits: { id: "eq_dwarf_bandits", name: "Dwarf Bandits", baseHP: 39, baseDPS: 3.7, naturalDelayTenths: 34, stats: { str: 8, con: 8, dex: 7, agi: 7, ac: 7, wis: 5, int: 5, cha: 5 } }, // src: dwarf bandits (lvl 4)
  eq_giant_scarabs: { id: "eq_giant_scarabs", name: "Giant Scarabs", baseHP: 39, baseDPS: 3.7, naturalDelayTenths: 34, stats: { str: 8, con: 8, dex: 7, agi: 7, ac: 7, wis: 5, int: 5, cha: 5 } }, // src: giant scarabs (lvl 4)
  eq_earth_elementals: { id: "eq_earth_elementals", name: "Earth Elementals", baseHP: 49, baseDPS: 4.5, naturalDelayTenths: 28, stats: { str: 9, con: 9, dex: 8, agi: 8, ac: 8, wis: 6, int: 6, cha: 5 } }, // src: earth elementals (lvl 6)
  eq_harpies: { id: "eq_harpies", name: "Harpies", baseHP: 164, baseDPS: 13.8, naturalDelayTenths: 32, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 20, wis: 12, int: 12, cha: 11 } }, // src: harpies (lvl 28)
  eq_orc_pawns: { id: "eq_orc_pawns", name: "Orc Pawns", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: orc pawns (lvl 11)
  eq_orc_centurions: { id: "eq_orc_centurions", name: "Orc Centurions", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: orc centurions (lvl 11)
  eq_orc_legionnaires: { id: "eq_orc_legionnaires", name: "Orc Legionnaires", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: orc legionnaires (lvl 11)
  eq_orc_slavers: { id: "eq_orc_slavers", name: "Orc Slavers", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: orc slavers (lvl 11)
  eq_orc_oracles: { id: "eq_orc_oracles", name: "Orc Oracles", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: orc oracles (lvl 11)
  eq_orc_emissaries: { id: "eq_orc_emissaries", name: "Orc Emissaries", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: orc emissaries (lvl 11)
  eq_orc_royal_guards: { id: "eq_orc_royal_guards", name: "Orc Royal Guards", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: orc royal guards (lvl 11)
  eq_brownies: { id: "eq_brownies", name: "Brownies", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: brownies (lvl 10)
  eq_fae_drakes: { id: "eq_fae_drakes", name: "Fae Drakes", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: fae drakes (lvl 10)
  eq_undertow_skeletons: { id: "eq_undertow_skeletons", name: "Undertow Skeletons", baseHP: 112, baseDPS: 9.6, naturalDelayTenths: 32, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 } }, // src: undertow skeletons (lvl 18)
  eq_serpents: { id: "eq_serpents", name: "Serpents", baseHP: 112, baseDPS: 9.6, naturalDelayTenths: 32, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 } }, // src: serpents (lvl 18)
  eq_undead_knights: { id: "eq_undead_knights", name: "Undead Knights", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: undead knights (lvl 20)
  eq_reanimated_hands: { id: "eq_reanimated_hands", name: "Reanimated Hands", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: reanimated hands (lvl 20)
  eq_festering_hags: { id: "eq_festering_hags", name: "Festering Hags", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: festering hags (lvl 20)
  eq_werebats: { id: "eq_werebats", name: "Werebats", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: werebats (lvl 20)
  eq_fungi: { id: "eq_fungi", name: "Fungi", baseHP: 122, baseDPS: 10.4, naturalDelayTenths: 26, stats: { str: 14, con: 15, dex: 14, agi: 13, ac: 16, wis: 10, int: 10, cha: 9 } }, // src: fungi (lvl 20)
  eq_isle_goblins: { id: "eq_isle_goblins", name: "Isle Goblins", baseHP: 169, baseDPS: 14.2, naturalDelayTenths: 34, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 21, wis: 13, int: 13, cha: 11 } }, // src: isle goblins (lvl 29)
  eq_sirens: { id: "eq_sirens", name: "Sirens", baseHP: 169, baseDPS: 14.2, naturalDelayTenths: 34, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 21, wis: 13, int: 13, cha: 11 } }, // src: sirens (lvl 29)
  eq_pirates: { id: "eq_pirates", name: "Pirates", baseHP: 169, baseDPS: 14.2, naturalDelayTenths: 34, stats: { str: 18, con: 19, dex: 17, agi: 16, ac: 21, wis: 13, int: 13, cha: 11 } }, // src: pirates (lvl 29)
  eq_vampires: { id: "eq_vampires", name: "Vampires", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: vampires (lvl 26)
  eq_dhampyres: { id: "eq_dhampyres", name: "Dhampyres", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: dhampyres (lvl 26)
  eq_familiars: { id: "eq_familiars", name: "Familiars", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: familiars (lvl 26)
  eq_undead_servants: { id: "eq_undead_servants", name: "Undead Servants", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: undead servants (lvl 26)
  eq_gypsies: { id: "eq_gypsies", name: "Gypsies", baseHP: 153, baseDPS: 12.9, naturalDelayTenths: 28, stats: { str: 17, con: 18, dex: 16, agi: 15, ac: 19, wis: 12, int: 12, cha: 10 } }, // src: gypsies (lvl 26)
  eq_piranhas: { id: "eq_piranhas", name: "Piranhas", baseHP: 112, baseDPS: 9.6, naturalDelayTenths: 32, stats: { str: 14, con: 14, dex: 13, agi: 12, ac: 15, wis: 9, int: 9, cha: 8 } }, // src: piranhas (lvl 18)
  eq_swordfish: { id: "eq_swordfish", name: "Swordfish", baseHP: 231, baseDPS: 19.2, naturalDelayTenths: 28, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 28, wis: 16, int: 16, cha: 14 } }, // src: swordfish (lvl 41)
  eq_seahorses: { id: "eq_seahorses", name: "Seahorses", baseHP: 231, baseDPS: 19.2, naturalDelayTenths: 28, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 28, wis: 16, int: 16, cha: 14 } }, // src: seahorses (lvl 41)
  eq_mermaids: { id: "eq_mermaids", name: "Mermaids", baseHP: 231, baseDPS: 19.2, naturalDelayTenths: 28, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 28, wis: 16, int: 16, cha: 14 } }, // src: mermaids (lvl 41)
  eq_sailfins: { id: "eq_sailfins", name: "Sailfins", baseHP: 231, baseDPS: 19.2, naturalDelayTenths: 28, stats: { str: 23, con: 24, dex: 22, agi: 21, ac: 28, wis: 16, int: 16, cha: 14 } }, // src: sailfins (lvl 41)
  eq_poachers: { id: "eq_poachers", name: "Poachers", baseHP: 39, baseDPS: 3.7, naturalDelayTenths: 34, stats: { str: 8, con: 8, dex: 7, agi: 7, ac: 7, wis: 5, int: 5, cha: 5 } }, // src: poachers (lvl 4)
  eq_kobold_shamans: { id: "eq_kobold_shamans", name: "Kobold Shamans", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: kobold shamans (lvl 11)
  eq_kobold_brawlers: { id: "eq_kobold_brawlers", name: "Kobold Brawlers", baseHP: 75, baseDPS: 6.6, naturalDelayTenths: 28, stats: { str: 11, con: 11, dex: 10, agi: 10, ac: 11, wis: 7, int: 7, cha: 6 } }, // src: kobold brawlers (lvl 11)
  eq_kodiaks: { id: "eq_kodiaks", name: "Kodiaks", baseHP: 70, baseDPS: 6.2, naturalDelayTenths: 26, stats: { str: 10, con: 11, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } }, // src: kodiaks (lvl 10)
  eq_kerrowfolk: { id: "eq_kerrowfolk", name: "Kerrowfolk", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: Kerrans (lvl 12)
  eq_cats: { id: "eq_cats", name: "Cats", baseHP: 80, baseDPS: 7.0, naturalDelayTenths: 30, stats: { str: 11, con: 12, dex: 10, agi: 10, ac: 12, wis: 8, int: 8, cha: 7 } }, // src: cats (lvl 12)
  eq_highland_kobolds: { id: "eq_highland_kobolds", name: "Highland Kobolds", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: highland kobolds (lvl 21)
  eq_kejekans: { id: "eq_kejekans", name: "Kejekans", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: Kejekans (lvl 21)
  eq_pandas: { id: "eq_pandas", name: "Pandas", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: pandas (lvl 21)
  eq_leopards: { id: "eq_leopards", name: "Leopards", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: leopards (lvl 21)
  eq_tigers: { id: "eq_tigers", name: "Tigers", baseHP: 127, baseDPS: 10.8, naturalDelayTenths: 28, stats: { str: 15, con: 16, dex: 14, agi: 13, ac: 17, wis: 10, int: 10, cha: 9 } }, // src: tigers (lvl 21)
  eq_ehrudite_ghosts: { id: "eq_ehrudite_ghosts", name: "Ehrudite ghosts", baseHP: 252, baseDPS: 20.9, naturalDelayTenths: 26, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 } }, // src: Erudite ghosts (lvl 45)
  eq_golems: { id: "eq_golems", name: "Golems", baseHP: 252, baseDPS: 20.9, naturalDelayTenths: 26, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 } }, // src: golems (lvl 45)
  eq_ratmen: { id: "eq_ratmen", name: "Ratmen", baseHP: 252, baseDPS: 20.9, naturalDelayTenths: 26, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 } }, // src: ratmen (lvl 45)
  eq_mimics: { id: "eq_mimics", name: "Mimics", baseHP: 252, baseDPS: 20.9, naturalDelayTenths: 26, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 } }, // src: mimics (lvl 45)
  eq_constructs: { id: "eq_constructs", name: "Constructs", baseHP: 252, baseDPS: 20.9, naturalDelayTenths: 26, stats: { str: 25, con: 26, dex: 24, agi: 22, ac: 30, wis: 17, int: 17, cha: 15 } }, // src: constructs (lvl 45)
  eq_fear_golems: { id: "eq_fear_golems", name: "Fear Golems", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: fear golems (lvl 51)
  eq_scarelings: { id: "eq_scarelings", name: "Scarelings", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: scarelings (lvl 51)
  eq_nightmares: { id: "eq_nightmares", name: "Nightmares", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: nightmares (lvl 51)
  eq_shiverbacks: { id: "eq_shiverbacks", name: "Shiverbacks", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: shiverbacks (lvl 51)
  eq_dracoliche: { id: "eq_dracoliche", name: "Dracoliche", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: dracoliche (lvl 51)
  eq_ashenbone_skeletons: { id: "eq_ashenbone_skeletons", name: "Ashenbone Skeletons", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: ashenbone skeletons (lvl 51)
  eq_spite_golems: { id: "eq_spite_golems", name: "Spite Golems", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: spite golems (lvl 51)
  eq_banshees: { id: "eq_banshees", name: "Banshees", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: banshees (lvl 51)
  eq_clerics: { id: "eq_clerics", name: "Clerics", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: clerics (lvl 51)
  eq_undead_casters: { id: "eq_undead_casters", name: "Undead Casters", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: undead casters (lvl 51)
  eq_thunder_spirits: { id: "eq_thunder_spirits", name: "Thunder Spirits", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: thunder spirits (lvl 51)
  eq_air_elementals: { id: "eq_air_elementals", name: "Air Elementals", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: air elementals (lvl 51)
  eq_griffons: { id: "eq_griffons", name: "Griffons", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: griffons (lvl 51)
  eq_gorgalasks: { id: "eq_gorgalasks", name: "Gorgalasks", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: gorgalasks (lvl 51)
  eq_spirocs: { id: "eq_spirocs", name: "Spirocs", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: spirocs (lvl 51)
  eq_djinn: { id: "eq_djinn", name: "Djinn", baseHP: 283, baseDPS: 23.4, naturalDelayTenths: 28, stats: { str: 27, con: 29, dex: 26, agi: 25, ac: 33, wis: 19, int: 19, cha: 16 } }, // src: djinn (lvl 51)
};

export function getMobDef(id) {
  return MOBS[id];
}