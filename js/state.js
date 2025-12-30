import { SAVE_KEY } from "./defs.js";

let heroIdCounter = 1;

export const state = {
  accountName: "",
  characterName: "",
  playerClassKey: "",
  gold: 0,
  totalXP: 0,
  accountLevel: 1,
  accountLevelXP: 0,
  accountLevelUpCost: 100,
  zone: 1,
  killsThisZone: 0,
  killsForNextZone: 10,
  partySlotsUnlocked: 1,
  party: [],
  partyMaxHP: 0,
  partyHP: 0,
  currentEnemy: null,
  log: [],
  autoRestartHealthPercent: 100,
  waitingToRespawn: false,
  highestUnlockedZone: 1,
  logFilters: {
    healing: true,
    damage_dealt: true,
    damage_taken: true,
    normal: true,
    gold: true
  }
};

export function nextHeroId() {
  return heroIdCounter++;
}

export function bumpHeroIdCounterToAtLeast(n) {
  heroIdCounter = Math.max(heroIdCounter, n);
}

export function serializeState() {
  return {
    accountName: state.accountName,
    characterName: state.characterName,
    playerClassKey: state.playerClassKey,
    gold: state.gold,
    totalXP: state.totalXP,
    accountLevel: state.accountLevel,
    accountLevelXP: state.accountLevelXP,
    accountLevelUpCost: state.accountLevelUpCost,
    zone: state.zone,
    killsThisZone: state.killsThisZone,
    killsForNextZone: state.killsForNextZone,
    partySlotsUnlocked: state.partySlotsUnlocked,
    partyHP: state.partyHP,
    partyMaxHP: state.partyMaxHP,
    party: state.party.map(h => ({ ...h })),
    autoRestartHealthPercent: state.autoRestartHealthPercent,
    highestUnlockedZone: state.highestUnlockedZone,
    logFilters: state.logFilters || {
      healing: true,
      damage_dealt: true,
      damage_taken: true,
      normal: true,
      gold: true
    },
    lastSavedAt: Date.now()
  };
}

export function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState()));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

export function loadGame() {
  try {
    let raw = localStorage.getItem(SAVE_KEY);
    
    // Migration: check old key if new key doesn't exist
    if (!raw) {
      const oldKey = "tickrate-save";
      raw = localStorage.getItem(oldKey);
      if (raw) {
        console.log("Migrating from old save key:", oldKey);
        // Re-save to new key immediately
        localStorage.setItem(SAVE_KEY, raw);
        localStorage.removeItem(oldKey);
      }
    }
    
    if (!raw) return { loaded: false, lastSavedAt: null };

    const data = JSON.parse(raw);

    state.accountName = data.accountName ?? "";
    state.characterName = data.characterName ?? "";
    state.playerClassKey = data.playerClassKey ?? "";
    state.gold = data.gold ?? 0;
    state.totalXP = data.totalXP ?? 0;
    state.accountLevel = data.accountLevel ?? 1;
    state.accountLevelXP = data.accountLevelXP ?? 0;
    state.accountLevelUpCost = data.accountLevelUpCost ?? 100;
    state.zone = data.zone ?? 1;
    state.killsThisZone = data.killsThisZone ?? 0;
    state.killsForNextZone = data.killsForNextZone ?? 10;
    state.partySlotsUnlocked = data.partySlotsUnlocked ?? 1;
    state.party = Array.isArray(data.party) ? data.party.map(h => {
      // Initialize health for old saves that don't have it
      if (h.health === undefined) {
        h.health = h.maxHP || 0;
      }
      if (h.isDead === undefined) {
        h.isDead = false;
      }
      if (h.deathTime === undefined) {
        h.deathTime = null;
      }
      // Initialize resources for old saves or new heroes
      if (h.maxMana === undefined) {
        h.maxMana = 0;
        h.mana = 0;
        h.manaRegenPerTick = 0;
      }
      if (h.maxEndurance === undefined) {
        h.maxEndurance = 0;
        h.endurance = 0;
        h.enduranceRegenPerTick = 0;
      }
      return h;
    }) : [];
    state.partyMaxHP = data.partyMaxHP ?? 0;
    state.partyHP = data.partyHP ?? 0;
    state.autoRestartHealthPercent = data.autoRestartHealthPercent ?? 100;
    state.highestUnlockedZone = data.highestUnlockedZone ?? 1;

    const maxId = state.party.reduce((m, h) => Math.max(m, h.id || 0), 0);
    bumpHeroIdCounterToAtLeast(maxId + 1);

    // enemy will be respawned after load
    state.currentEnemy = null;

    return { loaded: true, lastSavedAt: data.lastSavedAt ?? null };
  } catch (e) {
    console.error("Load failed:", e);
    return { loaded: false, lastSavedAt: null };
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
