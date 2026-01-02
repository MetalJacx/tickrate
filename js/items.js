// Item definitions
// maxStack: 1 = unique/non-stackable, >1 = consumable/stackable

export const ITEMS = {
  health_potion: {
    id: "health_potion",
    name: "Health Potion",
    rarity: "common",
    maxStack: 99,
    icon: "🧪" // Placeholder icon
  },
  health_potion_small: {
    id: "health_potion_small",
    name: "Small Health Potion",
    rarity: "common",
    maxStack: 99,
    icon: "🧪"
  },
  mana_potion: {
    id: "mana_potion",
    name: "Mana Potion",
    rarity: "common",
    maxStack: 99,
    icon: "🧪"
  },
  mana_potion_small: {
    id: "mana_potion_small",
    name: "Small Mana Potion",
    rarity: "common",
    maxStack: 99,
    icon: "🧪"
  },
  copper_ore: {
    id: "copper_ore",
    name: "Copper Ore",
    rarity: "common",
    maxStack: 50,
    icon: "⛏️"
  },
  iron_sword: {
    id: "iron_sword",
    name: "Iron Sword",
    rarity: "uncommon",
    maxStack: 1,
    icon: "⚔️",
    stats: { str: 2, dps: 3 }
  },
  wooden_shield: {
    id: "wooden_shield",
    name: "Wooden Shield",
    rarity: "common",
    maxStack: 1,
    icon: "🛡️",
    stats: { ac: 2 }
  },
  stick: {
    id: "stick",
    name: "Stick",
    rarity: "common",
    maxStack: 1,
    icon: "🪵",
    stats: { dps: 1 }
  },
  rusty_dagger: {
    id: "rusty_dagger",
    name: "Rusty Dagger",
    rarity: "common",
    maxStack: 1,
    icon: "🗡️",
    stats: { dps: 2 }
  },
  enchanted_branch: {
    id: "enchanted_branch",
    name: "Enchanted Branch",
    rarity: "rare",
    maxStack: 1,
    icon: "🌿",
    stats: { dps: 3, int: 1 }
  },
  steel_mace: {
    id: "steel_mace",
    name: "Steel Mace",
    rarity: "uncommon",
    maxStack: 1,
    icon: "🔨",
    stats: { dps: 4, str: 1 }
  }
};

export function getItemDef(itemId) {
  return ITEMS[itemId];
}
