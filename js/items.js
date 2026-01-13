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
  }
};

export function getItemDef(itemId) {
  return ITEMS[itemId];
}
