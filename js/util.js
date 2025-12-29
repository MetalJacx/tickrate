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
