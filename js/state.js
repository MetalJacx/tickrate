import { SAVE_KEY } from "./defs.js";

let heroIdCounter = 1;

export const state = {
  accountName: "",
  characterName: "",
  playerClassKey: "",
  gold: 0,
  totalXP: 0,
  zone: 1,
  killsThisZone: 0,
  killsForNextZone: 10,
  partySlotsUnlocked: 1,
  party: [],
  partyMaxHP: 0,
  partyHP: 0,
  currentEnemy: null,
  log: []
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
    zone: state.zone,
    killsThisZone: state.killsThisZone,
    killsForNextZone: state.killsForNextZone,
    partySlotsUnlocked: state.partySlotsUnlocked,
    partyHP: state.partyHP,
    partyMaxHP: state.partyMaxHP,
    party: state.party.map(h => ({ ...h })),
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
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { loaded: false, lastSavedAt: null };

    const data = JSON.parse(raw);

    state.accountName = data.accountName ?? "";
    state.characterName = data.characterName ?? "";
    state.playerClassKey = data.playerClassKey ?? "";
    state.gold = data.gold ?? 0;
    state.totalXP = data.totalXP ?? 0;
    state.zone = data.zone ?? 1;
    state.killsThisZone = data.killsThisZone ?? 0;
    state.killsForNextZone = data.killsForNextZone ?? 10;
    state.partySlotsUnlocked = data.partySlotsUnlocked ?? 1;
    state.party = Array.isArray(data.party) ? data.party.map(h => ({ ...h })) : [];
    state.partyMaxHP = data.partyMaxHP ?? 0;
    state.partyHP = data.partyHP ?? 0;

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
