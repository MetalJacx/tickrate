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
    stats: { dps: 2, dex: 1 }
  },
  iron_sword: {
    id: "iron_sword",
    name: "Iron Sword",
    rarity: "uncommon",
    maxStack: 1,
    baseValue: 20,
    icon: "⚔️",
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
    stats: { dps: 1 }
  },
  enchanted_branch: {
    id: "enchanted_branch",
    name: "Enchanted Branch",
    rarity: "rare",
    maxStack: 1,
    baseValue: 40,
    icon: "🌿",
    stats: { dps: 4, wis: 2, int: 2 }
  },
  steel_mace: {
    id: "steel_mace",
    name: "Steel Mace",
    rarity: "uncommon",
    maxStack: 1,
    baseValue: 26,
    icon: "🔨",
    stats: { dps: 4, str: 2 }
  }
};

export function getItemDef(itemId) {
  return ITEMS[itemId];
}
