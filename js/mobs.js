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
  }
};

export function getMobDef(id) {
  return MOBS[id];
}