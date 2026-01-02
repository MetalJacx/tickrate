// Centralized combat math and tuning knobs
// Constants and helper functions to keep combat tuning in one place.
export const COMBAT_CONSTANTS = {
  BASE_HIT: 0.75,
  LEVEL_HIT_SLOPE: 0.03,
  BASE_HIT_MIN: 0.35,
  BASE_HIT_MAX: 0.90,
  HIT_MIN: 0.20,
  HIT_MAX: 0.95,
  ACC_CAP: 100,
  ACC_SOFT: 80,
  EVA_CAP: 100,
  EVA_SOFT: 80,
  STAT_ADJ_K: 50,
  CRIT_BASE: 0.05,
  CRIT_BONUS_MAX: 0.20,
  CRIT_CAP: 0.35,
  CRIT_MULT: 1.5,
  STR_DAMAGE_PER_POINT: 0.02,
  AC_MITIGATION_M: 100,
  CON_HP_PER_POINT: 0.03,
  MANA_PER_PRIMARY: 10,
  MANA_REGEN_BASE: 1,
  MANA_REGEN_CAP: 6,
  MANA_REGEN_SOFT: 100,
  CHA_CAP: 100,
  CHA_SOFT: 120,
  BUY_MAX: 0.10,
  SELL_MAX: 0.10
};

export function clamp(x, min, max) {
  return Math.min(max, Math.max(min, x));
}

export function softCap(stat, cap, soft) {
  return cap * (stat / (stat + soft));
}

export function rand01() {
  return Math.random();
}

function getStats(entity) {
  const stats = entity?.stats || {};
  const acBonus = entity?.tempACBuffAmount || 0;
  if (!acBonus) return stats;
  return { ...stats, ac: (stats.ac || 0) + acBonus };
}

export function effectiveAccuracy(entity) {
  const dex = getStats(entity).dex || 0;
  return softCap(dex, COMBAT_CONSTANTS.ACC_CAP, COMBAT_CONSTANTS.ACC_SOFT);
}

export function effectiveAvoidance(entity) {
  const agi = getStats(entity).agi || 0;
  return softCap(agi, COMBAT_CONSTANTS.EVA_CAP, COMBAT_CONSTANTS.EVA_SOFT);
}

export function computeHitChance(attacker, defender) {
  const atkLevel = attacker?.level ?? 1;
  const defLevel = defender?.level ?? 1;
  const effAcc = effectiveAccuracy(attacker);
  const effEva = effectiveAvoidance(defender);

  let baseHit = COMBAT_CONSTANTS.BASE_HIT + (atkLevel - defLevel) * COMBAT_CONSTANTS.LEVEL_HIT_SLOPE;
  baseHit = clamp(baseHit, COMBAT_CONSTANTS.BASE_HIT_MIN, COMBAT_CONSTANTS.BASE_HIT_MAX);

  const statAdj = (effAcc - effEva) / (effAcc + effEva + COMBAT_CONSTANTS.STAT_ADJ_K);
  const hitChance = clamp(baseHit + statAdj, COMBAT_CONSTANTS.HIT_MIN, COMBAT_CONSTANTS.HIT_MAX);
  return hitChance;
}

export function computeCritChance(attacker) {
  const effAcc = effectiveAccuracy(attacker);
  const raw = COMBAT_CONSTANTS.CRIT_BASE + (effAcc / 100) * COMBAT_CONSTANTS.CRIT_BONUS_MAX;
  return clamp(raw, COMBAT_CONSTANTS.CRIT_BASE, COMBAT_CONSTANTS.CRIT_CAP);
}

export function computeRawDamage(attacker, isCrit = false) {
  const stats = getStats(attacker);
  const baseDamage = attacker?.baseDamage ?? attacker?.dps ?? 1;
  const str = stats.str || 0;
  const meleePower = 1 + str * COMBAT_CONSTANTS.STR_DAMAGE_PER_POINT;
  let rawDamage = baseDamage * meleePower;
  if (isCrit) {
    rawDamage *= COMBAT_CONSTANTS.CRIT_MULT;
  }
  return rawDamage;
}

export function applyACMitigation(rawDamage, defender) {
  const stats = getStats(defender);
  const ac = stats.ac || 0;
  const mitigation = ac / (ac + COMBAT_CONSTANTS.AC_MITIGATION_M);
  const reduced = rawDamage * (1 - mitigation);
  const floored = Math.floor(reduced);
  return Math.max(1, floored);
}

export function computeMaxHP(baseHP, con) {
  return Math.floor(baseHP * (1 + con * COMBAT_CONSTANTS.CON_HP_PER_POINT));
}

export function computeMaxMana(baseMana, primaryStat) {
  return baseMana + primaryStat * COMBAT_CONSTANTS.MANA_PER_PRIMARY;
}

export function computeManaRegenPerSecond(primaryStat) {
  const scale = primaryStat / (primaryStat + COMBAT_CONSTANTS.MANA_REGEN_SOFT);
  return COMBAT_CONSTANTS.MANA_REGEN_BASE + scale * COMBAT_CONSTANTS.MANA_REGEN_CAP;
}

export function effectiveCharisma(cha) {
  return softCap(cha, COMBAT_CONSTANTS.CHA_CAP, COMBAT_CONSTANTS.CHA_SOFT);
}

export function computeBuyPrice(basePrice, cha) {
  const eff = effectiveCharisma(cha);
  const discount = COMBAT_CONSTANTS.BUY_MAX * (eff / 100);
  return basePrice * (1 - discount);
}

export function computeSellValue(baseValue, cha) {
  const eff = effectiveCharisma(cha);
  const bonus = COMBAT_CONSTANTS.SELL_MAX * (eff / 100);
  return baseValue * (1 + bonus);
}
