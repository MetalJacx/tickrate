export const GAME_TICK_MS = 1000;

export const SAVE_KEY = "tickrate_save_v1";
export const AUTO_SAVE_EVERY_MS = 5000;
export const MAX_OFFLINE_SECONDS = 6 * 60 * 60;

export const CLASS_DEFS = [
  { key:"warrior", name:"Warrior", role:"Tank", baseHP:120, baseDPS:8,  baseHealing:0, cost:30, desc:"Front-line bruiser. High HP, steady DPS." },
  { key:"cleric",  name:"Cleric",  role:"Healer", baseHP:90,  baseDPS:4,  baseHealing:8, cost:35, desc:"Primarily healing to keep the party standing." },
  { key:"wizard",  name:"Wizard",  role:"Nuker", baseHP:70,  baseDPS:14, baseHealing:0, cost:40, desc:"Glass cannon. High DPS, low HP." },
  { key:"ranger",  name:"Ranger",  role:"DPS", baseHP:85,  baseDPS:10, baseHealing:2, cost:35, desc:"Ranged damage with a bit of self-sustain." },
  { key:"enchanter", name:"Enchanter", role:"Support", baseHP:75, baseDPS:6, baseHealing:4, cost:38, desc:"Moderate DPS and healing." }
];

export const SLOT_UNLOCKS = [
  { zone: 1, slots: 1 },
  { zone: 2, slots: 2 },
  { zone: 4, slots: 3 },
  { zone: 6, slots: 4 }
];
