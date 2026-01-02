// Central enemy definitions. Zones reference these by id.

export const MOBS = {
  // Zone 1
  skeleton: { id: "skeleton", name: "Decaying Skeleton", baseHP: 30, baseDPS: 3, stats: { str: 8, con: 8, dex: 8, agi: 8, ac: 7, wis: 6, int: 6, cha: 6 } },
  gnoll_scout: { id: "gnoll_scout", name: "Gnoll Scout", baseHP: 35, baseDPS: 4, stats: { str: 9, con: 9, dex: 9, agi: 9, ac: 8, wis: 6, int: 6, cha: 6 } },
  young_orc: { id: "young_orc", name: "Young Orc", baseHP: 40, baseDPS: 4, stats: { str: 10, con: 10, dex: 9, agi: 8, ac: 8, wis: 6, int: 6, cha: 6 } },
  rabid_wolf: { id: "rabid_wolf", name: "Rabid Wolf", baseHP: 35, baseDPS: 5, stats: { str: 9, con: 9, dex: 10, agi: 10, ac: 7, wis: 6, int: 6, cha: 6 } },
  phantom: { id: "phantom", name: "Phantom", baseHP: 25, baseDPS: 6, stats: { str: 8, con: 8, dex: 9, agi: 10, ac: 9, wis: 10, int: 10, cha: 8 } },

  // Zone 2
  forest_ghoul: { id: "forest_ghoul", name: "Forest Ghoul", baseHP: 40, baseDPS: 4, stats: { str: 11, con: 12, dex: 10, agi: 9, ac: 10, wis: 7, int: 7, cha: 6 } },
  shadow_sprite: { id: "shadow_sprite", name: "Shadow Sprite", baseHP: 35, baseDPS: 5, stats: { str: 9, con: 10, dex: 12, agi: 12, ac: 9, wis: 9, int: 9, cha: 7 } },
  cursed_treant: { id: "cursed_treant", name: "Cursed Treant", baseHP: 50, baseDPS: 3, stats: { str: 12, con: 14, dex: 9, agi: 8, ac: 12, wis: 8, int: 7, cha: 6 } },
  werewolf: { id: "werewolf", name: "Werewolf", baseHP: 45, baseDPS: 6, stats: { str: 13, con: 13, dex: 12, agi: 12, ac: 10, wis: 8, int: 8, cha: 7 } },
  wood_spirit: { id: "wood_spirit", name: "Wood Spirit", baseHP: 38, baseDPS: 7, stats: { str: 10, con: 11, dex: 11, agi: 13, ac: 11, wis: 12, int: 12, cha: 9 } },

  // Zone 3
  skeletal_knight: { id: "skeletal_knight", name: "Skeletal Knight", baseHP: 55, baseDPS: 6, stats: { str: 14, con: 16, dex: 12, agi: 11, ac: 14, wis: 9, int: 9, cha: 8 } },
  orc_centurion: { id: "orc_centurion", name: "Orc Centurion", baseHP: 60, baseDPS: 7, stats: { str: 16, con: 16, dex: 13, agi: 12, ac: 13, wis: 9, int: 9, cha: 8 } },
  dark_wolf: { id: "dark_wolf", name: "Dark Wolf", baseHP: 50, baseDPS: 7, stats: { str: 13, con: 14, dex: 14, agi: 14, ac: 12, wis: 9, int: 9, cha: 8 } },
  bloodsaber_acolyte: { id: "bloodsaber_acolyte", name: "Bloodsaber Acolyte", baseHP: 45, baseDPS: 8, stats: { str: 12, con: 13, dex: 13, agi: 13, ac: 12, wis: 12, int: 12, cha: 10 } },
  castle_specter: { id: "castle_specter", name: "Castle Specter", baseHP: 48, baseDPS: 9, stats: { str: 12, con: 13, dex: 14, agi: 15, ac: 13, wis: 13, int: 13, cha: 11 } }
};

export function getMobDef(id) {
  return MOBS[id];
}