import { state } from "./state.js";

export function addLog(msg, type = "normal") {
  const time = new Date().toLocaleTimeString();
  state.log.unshift({ text: `[${time}] ${msg}`, type });
  if (state.log.length > 50) state.log.pop();
}

export function randInt(maxExclusive) {
  return Math.floor(Math.random() * maxExclusive);
}
