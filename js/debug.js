/**
 * Global debug logging system
 * Uses state.settings.debugLogs and window.DEBUG for control
 * 
 * Usage:
 *   debugLog(state, "message", obj)
 *   debugWarn(state, "warning")
 *   debugDebug(state, "debug info")
 */

/**
 * Check if debug logging is enabled
 * Sources (in order):
 * 1. window.DEBUG (runtime-only, not persisted)
 * 2. state.settings?.debugLogs (persisted in save)
 * 3. false (default)
 */
export function isDebugEnabled(state) {
  if (typeof window !== 'undefined' && window.DEBUG) {
    return true;
  }
  return state?.settings?.debugLogs === true;
}

/**
 * Conditional console.log
 */
export function debugLog(state, ...args) {
  if (isDebugEnabled(state)) {
    console.log(...args);
  }
}

/**
 * Conditional console.warn
 */
export function debugWarn(state, ...args) {
  if (isDebugEnabled(state)) {
    console.warn(...args);
  }
}

/**
 * Conditional console.debug
 */
export function debugDebug(state, ...args) {
  if (isDebugEnabled(state)) {
    console.debug(...args);
  }
}
