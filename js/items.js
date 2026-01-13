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
};

export function getItemDef(itemId) {
  return ITEMS[itemId];
}
