// Centralized spell definitions used by both players and mobs.
// NOTE: Learn levels live in class definitions. This file only describes mechanics and allowed casters.

export const SPELLS = {
  fear: {
    id: "fear",
    name: "Fear",
    allowedCasters: { players: ["cleric", "enchanter"], mobs: true },
    target: "enemy", // primary enemy
    cooldownTicks: 7,
    cost: { mana: 40 },
    scaling: {
      levelCap: 52,
      baseDurationTicks: 2,
      bonusDurationAtLevel: 9, // +1 tick starting at level 9
      minDurationTicks: 1,
      fearAggroMultiplier: 1.4
    },
    effects: [{ type: "debuff", key: "fear" }]
  },
  fireblast: {
    id: "fireblast",
    name: "Fireblast",
    allowedCasters: { players: ["wizard"], mobs: true },
    target: "enemy",
    cooldownTicks: 3,
    cost: { mana: 10 },
    scaling: {
      minDamage: 12,
      maxDamageBase: 20,
      maxDamageBonusIntervalLevels: 2,
      maxDamageBonusCap: 5, // caps at level 10
      damageType: "fire"
    },
    effects: [{ type: "damage" }]
  },
  iceblast: {
    id: "iceblast",
    name: "Iceblast",
    allowedCasters: { players: ["wizard"], mobs: true },
    target: "enemy",
    cooldownTicks: 4,
    cost: { mana: 18 },
    scaling: {
      minDamage: 18,
      maxDamageBase: 30,
      maxDamageBonusIntervalLevels: 2,
      maxDamageBonusCap: 9, // caps at level 18
      damageType: "frost"
    },
    effects: [{ type: "damage" }]
  },
  mesmerize: {
    id: "mesmerize",
    name: "Mesmerize",
    allowedCasters: { players: ["enchanter"], mobs: true },
    target: "xt_enemy", // second enemy slot
    cooldownTicks: 6,
    cost: { mana: 20 },
    scaling: {
      durationTicks: 4
    },
    effects: [{ type: "debuff", key: "mesmerize" }]
  },
  flame_lick: {
    id: "flame_lick",
    name: "Flame Lick",
    allowedCasters: { players: ["ranger"], mobs: true },
    target: "enemy",
    cooldownTicks: 6,
    cost: { mana: 12 },
    scaling: {
      dotBase: 1,
      dotMax: 3,
      dotScaleFromLevel: 3, // uses 1 + floor((level-3)*2/3), capped at dotMax
      durationTicks: 6,
      acReduction: 3,
      damageType: "fire"
    },
    effects: [{ type: "dot", key: "flame_lick" }]
  }
};

export function getSpellDef(id) {
  return SPELLS[id];
}
