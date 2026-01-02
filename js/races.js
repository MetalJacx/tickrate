export const DEFAULT_RACE_KEY = "human";

// P99-inspired racial baselines scaled relative to Human (75) into small stat modifiers
export const RACES = [
  { key: "human", name: "Human", statMods: { str: 0, con: 0, agi: 0, dex: 0, wis: 0, int: 0, cha: 0 } },
  { key: "erudite", name: "Erudite", statMods: { str: -2, con: -1, agi: -1, dex: -1, wis: 1, int: 3, cha: -1 } },
  { key: "barbarian", name: "Barbarian", statMods: { str: 3, con: 2, agi: 1, dex: -1, wis: -1, int: -2, cha: -2 } },
  { key: "halfling", name: "Halfling", statMods: { str: -1, con: 0, agi: 2, dex: 2, wis: 1, int: -1, cha: -3 } },
  { key: "dwarf", name: "Dwarf", statMods: { str: 2, con: 2, agi: -1, dex: 2, wis: 1, int: -2, cha: -3 } },
  { key: "gnome", name: "Gnome", statMods: { str: -2, con: -1, agi: 1, dex: 1, wis: -1, int: 2, cha: -2 } },
  { key: "half_elf", name: "Half-Elf", statMods: { str: -1, con: -1, agi: 2, dex: 1, wis: -2, int: 0, cha: 0 } },
  { key: "wood_elf", name: "Wood Elf", statMods: { str: -1, con: -1, agi: 2, dex: 1, wis: 1, int: 0, cha: 0 } },
  { key: "high_elf", name: "High Elf", statMods: { str: -2, con: -1, agi: 1, dex: -1, wis: 2, int: 2, cha: 1 } },
  { key: "dark_elf", name: "Dark Elf", statMods: { str: -2, con: -1, agi: 2, dex: 0, wis: 1, int: 2, cha: -2 } },
  { key: "ogre", name: "Ogre", statMods: { str: 6, con: 5, agi: -1, dex: -1, wis: -1, int: -2, cha: -4 } },
  { key: "troll", name: "Troll", statMods: { str: 3, con: 3, agi: 1, dex: 0, wis: -2, int: -2, cha: -4 } }
];

export function getRaceDef(key) {
  return RACES.find(r => r.key === key) || RACES.find(r => r.key === DEFAULT_RACE_KEY);
}
