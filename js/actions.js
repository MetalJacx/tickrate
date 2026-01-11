// Centralized action definitions for both players and mobs.
// Learn levels live in class files; these definitions only describe mechanics and permissions.
// This is the single source of truth for spells/abilities (legacy spells.js removed).

export const ACTIONS = {
  // Wizard
  fireblast: {
    id: "fireblast",
    name: "Fireblast",
    kind: "spell",
    allowedUsers: { players: ["wizard"], mobs: true },
    target: "enemy",
    cooldownTicks: 3,
    cost: { mana: 10 },
    castTimeTicks: 1,
    specialization: "destruction",
    scaling: {
      minDamage: 12,
      maxDamageBase: 20,
      maxDamageBonusIntervalLevels: 2,
      maxDamageBonusCap: 5,
      damageType: "fire"
    },
    handler: "fireblast"
  },
  iceblast: {
    id: "iceblast",
    name: "Iceblast",
    kind: "spell",
    allowedUsers: { players: ["wizard"], mobs: true },
    target: "enemy",
    cooldownTicks: 4,
    cost: { mana: 18 },
    castTimeTicks: 2,
    specialization: "destruction",
    scaling: {
      minDamage: 18,
      maxDamageBase: 30,
      maxDamageBonusIntervalLevels: 2,
      maxDamageBonusCap: 9,
      damageType: "frost"
    },
    handler: "iceblast"
  },
  rain_of_fire: {
    id: "rain_of_fire",
    name: "Rain of Fire",
    kind: "ability",
    allowedUsers: { players: ["wizard"], mobs: false },
    target: "aoe_enemies",
    cooldownTicks: 8,
    cost: { mana: 30 },
    castTimeTicks: 2,
    specialization: "destruction",
    scaling: {
      minDamage: 10,
      maxDamage: 16,
      aoeDiminishing: true,
      cleaveTargets: 99
    },
    handler: "rain_of_fire"
  },
  arcane_shield: {
    id: "arcane_shield",
    name: "Arcane Shield",
    kind: "ability",
    allowedUsers: { players: ["wizard"], mobs: false },
    target: "self",
    cooldownTicks: 15,
    cost: { mana: 25 },
    castTimeTicks: 1,
    specialization: "enhancement",
    scaling: {
      tempHP: 50,
      castLockoutTicks: 1
    },
    handler: "arcane_shield"
  },
  gather_mana: {
    id: "gather_mana",
    name: "Gather Mana",
    kind: "utility",
    allowedUsers: { players: ["wizard"], mobs: false },
    target: "self",
    cooldownTicks: 12,
    cost: null,
    castTimeTicks: 1,
    specialization: "utility",
    handler: "gather_mana"
  },

  // Ranger
  shot: {
    id: "shot",
    name: "Shot",
    kind: "ability",
    allowedUsers: { players: ["ranger"], mobs: false },
    target: "enemy",
    cooldownTicks: 1,
    cost: { endurance: 1 },
    scaling: {
      minDamage: 2,
      maxDamage: 2,
      scalesTo: 5, // scales to 5 by level 8
      scaleLevel: 8
    },
    handler: "shot"
  },
  flame_lick: {
    id: "flame_lick",
    name: "Flame Lick",
    kind: "spell",
    allowedUsers: { players: ["ranger"], mobs: true },
    target: "enemy",
    cooldownTicks: 6,
    cost: { mana: 12 },
    castTimeTicks: 1,
    specialization: "control",
    scaling: {
      durationTicks: 6,
      acReduction: 3,
      dotBase: 1,
      dotMax: 3,
      dotScaleFromLevel: 3
    },
    handler: "flame_lick"
  },
  salve: {
    id: "salve",
    name: "Salve",
    kind: "ability",
    allowedUsers: { players: ["ranger"], mobs: false },
    target: "ally",
    cooldownTicks: 5,
    cost: { endurance: 8 },
    scaling: { minHeal: 5, maxHeal: 9 },
    handler: "salve"
  },
  woodskin: {
    id: "woodskin",
    name: "Woodskin",
    kind: "ability",
    allowedUsers: { players: ["ranger"], mobs: false },
    target: "ally",
    cooldownTicks: 1,
    cost: { mana: 10 },
    castTimeTicks: 1,
    specialization: "enhancement",
    handler: "woodskin"
  },
  hawk_eye: {
    id: "hawk_eye",
    name: "Hawk Eye",
    kind: "ability",
    allowedUsers: { players: ["ranger"], mobs: false },
    target: "self",
    cooldownTicks: 1,
    cost: { mana: 45 },
    castTimeTicks: 1,
    specialization: "enhancement",
    handler: "hawk_eye"
  },

  // Cleric
  minor_heal: {
    id: "minor_heal",
    name: "Minor Heal",
    kind: "ability",
    allowedUsers: { players: ["cleric"], mobs: false },
    target: "ally",
    cooldownTicks: 4,
    cost: { mana: 10 },
    castTimeTicks: 1,
    specialization: "restoration",
    scaling: { minHeal: 10, maxHeal: 20 },
    handler: "minor_heal"
  },
  courage: {
    id: "courage",
    name: "Courage",
    kind: "ability",
    allowedUsers: { players: ["cleric"], mobs: false },
    target: "ally",
    cooldownTicks: 1,
    cost: { mana: 12 },
    castTimeTicks: 1,
    specialization: "enhancement",
    handler: "courage"
  },
  fear: {
    id: "fear",
    name: "Fear",
    kind: "spell",
    allowedUsers: { players: ["cleric", "enchanter"], mobs: true },
    target: "enemy",
    cooldownTicks: 7,
    cost: { mana: 40 },
    castTimeTicks: 1,
    specialization: "control",
    scaling: {
      levelCap: 52,
      baseDurationTicks: 2,
      bonusDurationAtLevel: 9,
      minDurationTicks: 1,
      fearAggroMultiplier: 1.4
    },
    handler: "fear"
  },
  divine_focus: {
    id: "divine_focus",
    name: "Divine Focus",
    kind: "ability",
    allowedUsers: { players: ["cleric"], mobs: false },
    target: "self",
    cooldownTicks: 12,
    cost: { mana: 25 },
    castTimeTicks: 1,
    specialization: "enhancement",
    scaling: { durationTicks: 4 },
    handler: "divine_focus"
  },
  healing: {
    id: "healing",
    name: "Healing",
    kind: "ability",
    allowedUsers: { players: ["cleric"], mobs: false },
    target: "ally",
    cooldownTicks: 12,
    cost: { mana: 65 },
    castTimeTicks: 2,
    specialization: "restoration",
    scaling: { minHeal: 95, maxHeal: 175 },
    handler: "healing"
  },

  // Enchanter
  feedback: {
    id: "feedback",
    name: "Feedback",
    kind: "ability",
    allowedUsers: { players: ["enchanter"], mobs: false },
    target: "enemy",
    cooldownTicks: 3,
    cost: { mana: 7 },
    castTimeTicks: 1,
    specialization: "utility",
    handler: "feedback"
  },
  mesmerize: {
    id: "mesmerize",
    name: "Mesmerize",
    kind: "spell",
    allowedUsers: { players: ["enchanter"], mobs: true },
    target: "xt_enemy",
    cooldownTicks: 6,
    cost: { mana: 20 },
    castTimeTicks: 1,
    specialization: "control",
    scaling: { durationTicks: 4 },
    handler: "mesmerize"
  },
  suffocate: {
    id: "suffocate",
    name: "Suffocate",
    kind: "ability",
    allowedUsers: { players: ["enchanter"], mobs: false },
    target: "enemy",
    cooldownTicks: 6,
    cost: { mana: 15 },
    castTimeTicks: 1,
    specialization: "control",
    handler: "suffocate"
  },
  lesser_rune: {
    id: "lesser_rune",
    name: "Lesser Rune",
    kind: "ability",
    allowedUsers: { players: ["enchanter"], mobs: false },
    target: "self",
    cooldownTicks: 8,
    cost: { mana: 25 },
    castTimeTicks: 1,
    specialization: "enhancement",
    handler: "lesser_rune"
  },

  // Warrior
  kick: {
    id: "kick",
    name: "Kick",
    kind: "ability",
    allowedUsers: { players: ["warrior"], mobs: false },
    target: "enemy",
    cooldownTicks: 4,
    cost: { endurance: 5 },
    scaling: { minDamage: 2, maxDamage: 7 },
    handler: "melee_basic"
  },
  shield_bash: {
    id: "shield_bash",
    name: "Shield Bash",
    kind: "ability",
    allowedUsers: { players: ["warrior"], mobs: false },
    target: "enemy",
    cooldownTicks: 8,
    cost: { endurance: 12 },
    scaling: { minDamage: 10, maxDamage: 14 },
    handler: "melee_basic"
  },
  taunt: {
    id: "taunt",
    name: "Taunt",
    kind: "ability",
    allowedUsers: { players: ["warrior"], mobs: false },
    target: "enemy",
    cooldownTicks: 10, // keep legacy 10-second intent (~3 ticks) but preserve explicit value here
    cost: { endurance: 1 },
    handler: "taunt"
  },
  fortify: {
    id: "fortify",
    name: "Fortify",
    kind: "ability",
    allowedUsers: { players: ["warrior"], mobs: false },
    target: "self",
    cooldownTicks: 12,
    cost: { endurance: 15 },
    handler: "fortify"
  },
  cleave: {
    id: "cleave",
    name: "Cleave",
    kind: "ability",
    allowedUsers: { players: ["warrior"], mobs: false },
    target: "aoe_enemies",
    cooldownTicks: 5,
    cost: { endurance: 25 },
    scaling: { cleaveTargets: 3, usesBaseDamage: true },
    handler: "cleave"
  }
};

export function getActionDef(id) {
  return ACTIONS[id];
}
