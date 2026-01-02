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
  mana_potion: {
    id: "mana_potion",
    name: "Mana Potion",
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
  }
};

export function getItemDef(itemId) {
  return ITEMS[itemId];
}
