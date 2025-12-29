import { state } from "./state.js";

export function addLog(msg) {
  const time = new Date().toLocaleTimeString();
  state.log.unshift(`[${time}] ${msg}`);
  if (state.log.length > 50) state.log.pop();
}

export function randInt(maxExclusive) {
  return Math.floor(Math.random() * maxExclusive);
}
