// Item definitions
// maxStack: 1 = unique/non-stackable, >1 = consumable/stackable

export const ITEMS = {
  health_potion_small: {
    id: "health_potion_small",
    name: "Minor Health Potion",
    rarity: "common",
    maxStack: 99,
    baseValue: 12,
    icon: "🧪"
  },
  mana_potion_small: {
    id: "mana_potion_small",
    name: "Minor Mana Potion",
    rarity: "common",
    maxStack: 99,
    baseValue: 12,
    icon: "🔮"
  },
  health_potion: {
    id: "health_potion",
    name: "Health Potion",
    rarity: "common",
    maxStack: 99,
    baseValue: 25,
    icon: "🧪"
  },
  mana_potion: {
    id: "mana_potion",
    name: "Mana Potion",
    rarity: "common",
    maxStack: 99,
    baseValue: 25,
    icon: "🧪"
  },
  copper_ore: {
    id: "copper_ore",
    name: "Copper Ore",
    rarity: "common",
    maxStack: 50,
    baseValue: 8,
    icon: "⛏️"
  },
  rusty_dagger: {
    id: "rusty_dagger",
    name: "Rusty Dagger",
    rarity: "common",
    maxStack: 1,
    baseValue: 10,
    icon: "🗡️",
    weaponType: "1h_pierce",
    delayTenths: 15,
    stats: { dps: 2}
  },
  iron_sword: {
    id: "iron_sword",
    name: "Iron Sword",
    rarity: "uncommon",
    maxStack: 1,
    baseValue: 20,
    icon: "⚔️",
    weaponType: "1h_slash",
    delayTenths: 30,
    stats: { str: 2, dps: 3 }
  },
  wooden_shield: {
    id: "wooden_shield",
    name: "Wooden Shield",
    rarity: "common",
    maxStack: 1,
    baseValue: 14,
    icon: "🛡️",
    stats: { ac: 2 }
  },
  stick: {
    id: "stick",
    name: "Stick",
    rarity: "common",
    maxStack: 1,
    baseValue: 2,
    icon: "🪵",
    weaponType: "1h_blunt",
    delayTenths: 30,
    stats: { dps: 1 }
  },
  enchanted_branch: {
    id: "enchanted_branch",
    name: "Enchanted Branch",
    rarity: "rare",
    maxStack: 1,
    baseValue: 40,
    icon: "🌿",
    weaponType: "1h_blunt",
    delayTenths: 28,
    stats: { dps: 4, wis: 2, int: 2 }
  },
  phantom_essence: {
    id: "phantom_essence",
    name: "Phantom Essence Vial",
    rarity: "rare",
    maxStack: 1,
    baseValue: 50,
    icon: "👻",
    stats: { int: 1, wis: 1, maxMana: 10 }
  },
  iron_mace: {
    id: "steel_mace",
    name: "Steel Mace",
    rarity: "uncommon",
    maxStack: 1,
    baseValue: 26,
    icon: "🔨",
    weaponType: "1h_blunt",
    delayTenths: 40,
    stats: { dps: 4, str: 1 }
  },
  rusty_sword: {
    id: "rusty_sword",
    name: "Rusty Sword",
    rarity: "uncommon",
    maxStack: 1,
    baseValue: 20,
    icon: "⚔️",
    weaponType: "1h_slash",
    delayTenths: 30,
    stats: { dps: 3 }
  },
    rusty_mace: {
    id: "rusty_mace",
    name: "Rusty Mace",
    rarity: "uncommon",
    maxStack: 1,
    baseValue: 20,
    icon: "🔨",
    weaponType: "1h_blunt",
    delayTenths: 40,
    stats: { dps: 3 }
  },

  // --- Cloth Armor (early drops) ---
  cloth_cap: {
    id: "cloth_cap",
    name: "Frayed Cloth Cap",
    rarity: "common",
    maxStack: 1,
    baseValue: 6,
    icon: "🧢",
    stats: { ac: 1 }
  },
  tattered_robe: {
    id: "tattered_robe",
    name: "Tattered Robe",
    rarity: "common",
    maxStack: 1,
    baseValue: 10,
    icon: "🥻",
    stats: { ac: 2 }
  },
  cloth_wraps: {
    id: "cloth_wraps",
    name: "Cloth Wraps",
    rarity: "common",
    maxStack: 1,
    baseValue: 6,
    icon: "🧤",
    stats: { ac: 1 }
  },
  cloth_sandals: {
    id: "cloth_sandals",
    name: "Cloth Sandals",
    rarity: "common",
    maxStack: 1,
    baseValue: 6,
    icon: "🩴",
    stats: { ac: 1 }
  },
  cloth_leggings: {
    id: "cloth_leggings",
    name: "Patched Leggings",
    rarity: "common",
    maxStack: 1,
    baseValue: 9,
    icon: "👖",
    stats: { ac: 2 }
  },

  // --- More Rust Weapons (early drops) ---
  rusty_axe: {
    id: "rusty_axe",
    name: "Rusty Axe",
    rarity: "common",
    maxStack: 1,
    baseValue: 10,
    icon: "🪓",
    weaponType: "1h_slash",
    delayTenths: 32,
    stats: { dps: 2 }
  },
  rusty_spear: {
    id: "rusty_spear",
    name: "Rusty Spear",
    rarity: "common",
    maxStack: 1,
    baseValue: 12,
    icon: "🔱",
    weaponType: "2h_pierce",
    delayTenths: 44,
    stats: { dps: 3 }
  },
  rusty_short_sword: {
    id: "rusty_short_sword",
    name: "Rusty Short Sword",
    rarity: "common",
    maxStack: 1,
    baseValue: 10,
    icon: "⚔️",
    weaponType: "1h_slash",
    delayTenths: 28,
    stats: { dps: 2 }
  },

  // --- Rare Unique Items ---
  waylaid_ring: {
    id: "waylaid_ring",
    name: "Waylaid Copper Ring",
    rarity: "rare",
    maxStack: 1,
    baseValue: 60,
    icon: "💍",
    stats: { str: 1, dex: 1 }
  },
  traveler_cloak: {
    id: "traveler_cloak",
    name: "Traveler's Faded Cloak",
    rarity: "rare",
    maxStack: 1,
    baseValue: 75,
    icon: "🧥",
    stats: { ac: 2, agi: 1 }
  },

  groundskeeper_haft: {
    id: "groundskeeper_haft",
    name: "Groundskeeper's Rusted Haft",
    rarity: "rare",
    maxStack: 1,
    baseValue: 90,
    icon: "🪚",
    weaponType: "2h_blunt",
    delayTenths: 46,
    stats: { dps: 4 }
  },
  gravebinder_wraps: {
    id: "gravebinder_wraps",
    name: "Gravebinder Wraps",
    rarity: "rare",
    maxStack: 1,
    baseValue: 80,
    icon: "🧤",
    stats: { ac: 2, maxHP: 6 }
  },

  hill_captains_blade: {
    id: "hill_captains_blade",
    name: "Captain's Etched Hillblade",
    rarity: "rare",
    maxStack: 1,
    baseValue: 120,
    icon: "⚔️",
    weaponType: "1h_slash",
    delayTenths: 28,
    stats: { dps: 4 }
  },
  ridgewatch_vest: {
    id: "ridgewatch_vest",
    name: "Ridgewatch Vest",
    rarity: "rare",
    maxStack: 1,
    baseValue: 110,
    icon: "🧞",
    stats: { ac: 4, con: 1 }
  },

  shatterbone_warhelm: {
    id: "shatterbone_warhelm",
    name: "Shatterbone War Helm",
    rarity: "rare",
    maxStack: 1,
    baseValue: 140,
    icon: "⚔️",
    stats: { ac: 4, str: 1 }
  },
  orcish_cleaver_heavy: {
    id: "orcish_cleaver_heavy",
    name: "Heavy Orcish Cleaver",
    rarity: "rare",
    maxStack: 1,
    baseValue: 170,
    icon: "🪓",
    weaponType: "2h_slash",
    delayTenths: 44,
    stats: { dps: 6 }
  },

  cornreaper_sickle: {
    id: "cornreaper_sickle",
    name: "Cornreaper Sickle",
    rarity: "rare",
    maxStack: 1,
    baseValue: 180,
    icon: "🌾",
    weaponType: "1h_slash",
    delayTenths: 26,
    stats: { dps: 6 }
  },

  bonekings_talisman: {
    id: "bonekings_talisman",
    name: "Bone-King's Talisman",
    rarity: "rare",
    maxStack: 1,
    baseValue: 260,
    icon: "💀",
    stats: { ac: 3, wis: 2, maxHP: 10 }
  },

  ritual_robes: {
    id: "ritual_robes",
    name: "Ritual-Stitched Robes",
    rarity: "rare",
    maxStack: 1,
    baseValue: 220,
    icon: "🧛",
    stats: { ac: 4, int: 2 }
  },

  grask_totem: {
    id: "grask_totem",
    name: "Grask's War Totem",
    rarity: "rare",
    maxStack: 1,
    baseValue: 150,
    icon: "🗿",
    stats: { str: 2, maxHP: 8 }
  },

  arvok_signet: {
    id: "arvok_signet",
    name: "Arvok's Command Signet",
    rarity: "rare",
    maxStack: 1,
    baseValue: 130,
    icon: "💍",
    stats: { str: 1, cha: 1, ac: 1 }
  },

  reaper_shroud: {
    id: "reaper_shroud",
    name: "Reaper's Shroud",
    rarity: "rare",
    maxStack: 1,
    baseValue: 190,
    icon: "🧥",
    stats: { ac: 3, agi: 2, maxHP: 5 }
  },

  stalk_woven_boots: {
    id: "stalk_woven_boots",
    name: "Stalk-Woven Boots",
    rarity: "rare",
    maxStack: 1,
    baseValue: 160,
    icon: "🥾",
    stats: { ac: 2, agi: 1, dex: 1 }
  },

  malzors_scepter: {
    id: "malzors_scepter",
    name: "Malzor's Bone Scepter",
    rarity: "rare",
    maxStack: 1,
    baseValue: 280,
    icon: "🦴",
    weaponType: "1h_blunt",
    delayTenths: 32,
    stats: { dps: 7, wis: 2 }
  },

  crown_of_bone: {
    id: "crown_of_bone",
    name: "Crown of Bone",
    rarity: "rare",
    maxStack: 1,
    baseValue: 300,
    icon: "👑",
    stats: { ac: 5, int: 2, wis: 1, maxMana: 15 }
  },

  // Zone 1 additional named loot
  crypt_key: {
    id: "crypt_key",
    name: "Ancient Crypt Key",
    rarity: "rare",
    maxStack: 1,
    baseValue: 45,
    icon: "🔑",
    stats: { agi: 1, maxHP: 5 }
  },

  forgotten_shroud: {
    id: "forgotten_shroud",
    name: "Forgotten Shroud",
    rarity: "rare",
    maxStack: 1,
    baseValue: 85,
    icon: "🧥",
    stats: { ac: 3, int: 1, maxMana: 8 }
  },

  deathward_charm: {
    id: "deathward_charm",
    name: "Deathward Charm",
    rarity: "rare",
    maxStack: 1,
    baseValue: 75,
    icon: "✨",
    stats: { wis: 1, diseaseResist: 5 }
  },

  // Zone 2 additional named loot
  dusthoof_horn: {
    id: "dusthoof_horn",
    name: "Dusthoof War Horn",
    rarity: "rare",
    maxStack: 1,
    baseValue: 50,
    icon: "📯",
    stats: { str: 1, maxHP: 6 }
  },

  roadwarden_badge: {
    id: "roadwarden_badge",
    name: "Roadwarden's Badge",
    rarity: "rare",
    maxStack: 1,
    baseValue: 55,
    icon: "🛡️",
    stats: { ac: 2, cha: 1 }
  },

  overseers_whip: {
    id: "overseers_whip",
    name: "Overseer's Lash",
    rarity: "rare",
    maxStack: 1,
    baseValue: 95,
    icon: "🔗",
    weaponType: "1h_slash",
    delayTenths: 25,
    stats: { dps: 4 }
  },

  field_commanders_helm: {
    id: "field_commanders_helm",
    name: "Field Commander's Helm",
    rarity: "rare",
    maxStack: 1,
    baseValue: 90,
    icon: "⚔️",
    stats: { ac: 3, str: 1 }
  },

  // Zone 3 additional named loot
  bonecrusher_maul: {
    id: "bonecrusher_maul",
    name: "Bonecrusher's Maul",
    rarity: "rare",
    maxStack: 1,
    baseValue: 115,
    icon: "🔨",
    weaponType: "2h_blunt",
    delayTenths: 48,
    stats: { dps: 5 }
  },

  skullsplitter_axe: {
    id: "skullsplitter_axe",
    name: "Skullsplitter Axe",
    rarity: "rare",
    maxStack: 1,
    baseValue: 120,
    icon: "🪓",
    weaponType: "1h_slash",
    delayTenths: 30,
    stats: { dps: 5 }
  },

  grimtooth_fetish: {
    id: "grimtooth_fetish",
    name: "Grimtooth's Fetish",
    rarity: "rare",
    maxStack: 1,
    baseValue: 135,
    icon: "🗿",
    stats: { wis: 2, int: 1, maxMana: 10 }
  },

  grimtooth_staff: {
    id: "grimtooth_staff",
    name: "Grimtooth's Cursed Staff",
    rarity: "rare",
    maxStack: 1,
    baseValue: 145,
    icon: "🪄",
    weaponType: "2h_blunt",
    delayTenths: 38,
    stats: { dps: 5, wis: 1 }
  },

  boneclaw_pauldrons: {
    id: "boneclaw_pauldrons",
    name: "Boneclaw Pauldrons",
    rarity: "rare",
    maxStack: 1,
    baseValue: 140,
    icon: "🦴",
    stats: { ac: 4, str: 1, con: 1 }
  },

  boneclaw_blade: {
    id: "boneclaw_blade",
    name: "Boneclaw's Jagged Blade",
    rarity: "rare",
    maxStack: 1,
    baseValue: 155,
    icon: "⚔️",
    weaponType: "1h_slash",
    delayTenths: 29,
    stats: { dps: 6 }
  },

  // Zone 4 additional named loot
  stone_hurler_sling: {
    id: "stone_hurler_sling",
    name: "Stone Hurler's Sling",
    rarity: "rare",
    maxStack: 1,
    baseValue: 105,
    icon: "🪨",
    weaponType: "1h_blunt",
    delayTenths: 26,
    stats: { dps: 5 }
  },

  ridgewatch_banner: {
    id: "ridgewatch_banner",
    name: "Ridgewatch Banner",
    rarity: "rare",
    maxStack: 1,
    baseValue: 145,
    icon: "🚩",
    stats: { str: 1, cha: 2, maxHP: 8 }
  },

  commander_insignia: {
    id: "commander_insignia",
    name: "Commander's Insignia",
    rarity: "rare",
    maxStack: 1,
    baseValue: 140,
    icon: "💍",
    stats: { ac: 2, str: 1, cha: 1 }
  },

  earthshaker_hammer: {
    id: "earthshaker_hammer",
    name: "Earthshaker's Hammer",
    rarity: "rare",
    maxStack: 1,
    baseValue: 195,
    icon: "🔨",
    weaponType: "2h_blunt",
    delayTenths: 50,
    stats: { dps: 7 }
  },

  earthshaker_girdle: {
    id: "earthshaker_girdle",
    name: "Earthshaker's Girdle",
    rarity: "rare",
    maxStack: 1,
    baseValue: 185,
    icon: "⚔️",
    stats: { ac: 3, str: 2, maxHP: 12 }
  },

  stone_ward_amulet: {
    id: "stone_ward_amulet",
    name: "Stone Ward Amulet",
    rarity: "rare",
    maxStack: 1,
    baseValue: 175,
    icon: "📿",
    stats: { ac: 2, con: 1, physicalResist: 5 }
  },

  // Zone 5 additional named loot
  stalk_hunters_bow: {
    id: "stalk_hunters_bow",
    name: "Stalk Hunter's Bow",
    rarity: "rare",
    maxStack: 1,
    baseValue: 125,
    icon: "🏹",
    weaponType: "1h_pierce",
    delayTenths: 24,
    stats: { dps: 6 }
  },

  warden_cloak: {
    id: "warden_cloak",
    name: "Fenceline Warden's Cloak",
    rarity: "rare",
    maxStack: 1,
    baseValue: 155,
    icon: "🧥",
    stats: { ac: 3, agi: 1, dex: 1, maxHP: 6 }
  },

  warden_halberd: {
    id: "warden_halberd",
    name: "Warden's Halberd",
    rarity: "rare",
    maxStack: 1,
    baseValue: 165,
    icon: "🪓",
    weaponType: "2h_slash",
    delayTenths: 42,
    stats: { dps: 6 }
  },

  // Zone 6 additional named loot
  ritual_dagger: {
    id: "ritual_dagger",
    name: "Ritual Keeper's Dagger",
    rarity: "rare",
    maxStack: 1,
    baseValue: 170,
    icon: "🗡️",
    weaponType: "1h_pierce",
    delayTenths: 24,
    stats: { dps: 7 }
  },

  adjutant_armor: {
    id: "adjutant_armor",
    name: "Bone Adjutant's Armor",
    rarity: "rare",
    maxStack: 1,
    baseValue: 180,
    icon: "🦴",
    stats: { ac: 5, con: 1, diseaseResist: 8 }
  },

  sigil_orb: {
    id: "sigil_orb",
    name: "High Sigil Orb",
    rarity: "rare",
    maxStack: 1,
    baseValue: 210,
    icon: "🔮",
    stats: { int: 2, wis: 1, maxMana: 20, magicResist: 5 }
  },

  sigil_tome: {
    id: "sigil_tome",
    name: "Tome of High Sigils",
    rarity: "rare",
    maxStack: 1,
    baseValue: 200,
    icon: "📖",
    stats: { int: 3, maxMana: 15 }
  },

  maloth_sword: {
    id: "maloth_sword",
    name: "Maloth's Deathblade",
    rarity: "rare",
    maxStack: 1,
    baseValue: 225,
    icon: "⚔️",
    weaponType: "2h_slash",
    delayTenths: 40,
    stats: { dps: 8 }
  },

  deathknight_plate: {
    id: "deathknight_plate",
    name: "Deathknight's Plate",
    rarity: "rare",
    maxStack: 1,
    baseValue: 240,
    icon: "🛡️",
    stats: { ac: 6, str: 1, con: 1, maxHP: 15 }
  },

  /* ---------- Mundane Plains drops ---------- */

  snake_fang: {
    id: "snake_fang",
    name: "Snake Fang",
    rarity: "common",
    maxStack: 1,
    baseValue: 12,
    icon: "🦷",
    weaponType: "1h_pierce",
    delayTenths: 26,
    stats: { dps: 2 } // low-tier piercing weapon
  },
  beetle_shell: {
    id: "beetle_shell",
    name: "Beetle Shell",
    rarity: "common",
    maxStack: 10,
    baseValue: 4,
    icon: "🪲",
    stats: {}
  },
  vulture_feather: {
    id: "vulture_feather",
    name: "Vulture Feather",
    rarity: "common",
    maxStack: 25,
    baseValue: 3,
    icon: "🪶",
    stats: {}
  },

  /* ---------- Graveyard drops ---------- */

  bone_shard: {
    id: "bone_shard",
    name: "Bone Shard",
    rarity: "common",
    maxStack: 25,
    baseValue: 3,
    icon: "🦴",
    stats: {}
  },
  grave_dust: {
    id: "grave_dust",
    name: "Grave Dust",
    rarity: "common",
    maxStack: 25,
    baseValue: 4,
    icon: "💨",
    stats: {}
  },

  /* ---------- Shatterbone Keep drops ---------- */

  orc_tooth: {
    id: "orc_tooth",
    name: "Orc Tooth",
    rarity: "common",
    maxStack: 25,
    baseValue: 5,
    icon: "🦷",
    stats: {}
  },
  crude_bone_charm: {
    id: "crude_bone_charm",
    name: "Crude Bone Charm",
    rarity: "uncommon",
    maxStack: 1,
    baseValue: 45,
    icon: "🧿",
    stats: { maxHP: 6 }
  },
  jagged_orc_shiv: {
    id: "jagged_orc_shiv",
    name: "Jagged Orc Shiv",
    rarity: "uncommon",
    maxStack: 1,
    baseValue: 55,
    icon: "🔪",
    weaponType: "1h_pierce",
    delayTenths: 24,
    stats: { dps: 3 }
  },

  /* ---------- Rolling Hills drops ---------- */

  wolf_pelt_patch: {
    id: "wolf_pelt_patch",
    name: "Wolf Pelt Patch",
    rarity: "common",
    maxStack: 10,
    baseValue: 6,
    icon: "🟤",
    stats: {}
  },
  ridge_stone: {
    id: "ridge_stone",
    name: "Ridge Stone",
    rarity: "common",
    maxStack: 25,
    baseValue: 3,
    icon: "🪨",
    stats: {}
  },

  /* ---------- Cornfields drops ---------- */

  gnawer_incisor: {
    id: "gnawer_incisor",
    name: "Gnawer Incisor",
    rarity: "common",
    maxStack: 1,
    baseValue: 14,
    icon: "🦷",
    weaponType: "1h_pierce",
    delayTenths: 28,
    stats: { dps: 2 }
  },
  stalk_husk: {
    id: "stalk_husk",
    name: "Stalk Husk",
    rarity: "common",
    maxStack: 25,
    baseValue: 2,
    icon: "🌾",
    stats: {}
  },

  /* ---------- Hallowbone Castle drops ---------- */

  ritual_bone_fragment: {
    id: "ritual_bone_fragment",
    name: "Ritual Bone Fragment",
    rarity: "common",
    maxStack: 25,
    baseValue: 6,
    icon: "🦴",
    stats: {}
  },
  sigil_scrap: {
    id: "sigil_scrap",
    name: "Sigil Scrap",
    rarity: "uncommon",
    maxStack: 25,
    baseValue: 9,
    icon: "📜",
    stats: {}
  }
};

export function getItemDef(itemId) {
  return ITEMS[itemId];
}
