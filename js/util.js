import { state } from "./state.js";

export function addLog(msg, type = "normal") {
  // Check if this message type is filtered out
  if (state.logFilters && state.logFilters[type] === false) {
    return;
  }
  
  const time = new Date().toLocaleTimeString();
  state.log.unshift({ text: `[${time}] ${msg}`, type });
  if (state.log.length > 1000) state.log.pop();
}

export function randInt(maxExclusive) {
  return Math.floor(Math.random() * maxExclusive);
}

export function serializeState() {
  return state;
}

export function loadState(json) {
  Object.assign(state, JSON.parse(json));
}

// Effect helpers (centralized)
export function unwrapEffect(entry) {
  return entry && typeof entry === "object" && entry.data != null ? entry.data : entry;
}

export function isExpiredEffect(entry, nowMs) {
  if (!entry || typeof entry !== "object") return false;
  if (entry.expiresAt == null) return false;
  return nowMs > entry.expiresAt;
}
