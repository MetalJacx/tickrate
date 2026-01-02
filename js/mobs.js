// Central enemy definitions. Zones reference these by id.

export const MOBS = {
  // Zone 1
  skeleton: { id: "skeleton", name: "Decaying Skeleton", baseHP: 30, baseDPS: 3 },
  gnoll_scout: { id: "gnoll_scout", name: "Gnoll Scout", baseHP: 35, baseDPS: 4 },
  young_orc: { id: "young_orc", name: "Young Orc", baseHP: 40, baseDPS: 4 },
  rabid_wolf: { id: "rabid_wolf", name: "Rabid Wolf", baseHP: 35, baseDPS: 5 },
  phantom: { id: "phantom", name: "Phantom", baseHP: 25, baseDPS: 6 },

  // Zone 2
  forest_ghoul: { id: "forest_ghoul", name: "Forest Ghoul", baseHP: 40, baseDPS: 4 },
  shadow_sprite: { id: "shadow_sprite", name: "Shadow Sprite", baseHP: 35, baseDPS: 5 },
  cursed_treant: { id: "cursed_treant", name: "Cursed Treant", baseHP: 50, baseDPS: 3 },
  werewolf: { id: "werewolf", name: "Werewolf", baseHP: 45, baseDPS: 6 },
  wood_spirit: { id: "wood_spirit", name: "Wood Spirit", baseHP: 38, baseDPS: 7 },

  // Zone 3
  skeletal_knight: { id: "skeletal_knight", name: "Skeletal Knight", baseHP: 55, baseDPS: 6 },
  orc_centurion: { id: "orc_centurion", name: "Orc Centurion", baseHP: 60, baseDPS: 7 },
  dark_wolf: { id: "dark_wolf", name: "Dark Wolf", baseHP: 50, baseDPS: 7 },
  bloodsaber_acolyte: { id: "bloodsaber_acolyte", name: "Bloodsaber Acolyte", baseHP: 45, baseDPS: 8 },
  castle_specter: { id: "castle_specter", name: "Castle Specter", baseHP: 48, baseDPS: 9 }
};

export function getMobDef(id) {
  return MOBS[id];
}