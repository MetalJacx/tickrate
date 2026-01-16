/**
 * Equipment System: Slot validation, equippability rules, 2H weapon logic
 * Single source of truth for all equipment slot constraints
 */

import { EQUIP_SLOTS, EQUIP_SLOT_KEYS } from "./defs.js";

/**
 * Check if an item is equippable (has stats or explicit equipSlots)
 * Consumables, misc items, etc → false
 * @param {Object} itemDef - Item definition
 * @returns {boolean}
 */
export function isEquippable(itemDef) {
  if (!itemDef) {
    return false;
  }
  // Has stats (armor, weapons) OR explicitly marked as equippable
  if (itemDef.stats && Object.keys(itemDef.stats).length > 0) {
    return true;
  }
  if (itemDef.equipSlots && Array.isArray(itemDef.equipSlots) && itemDef.equipSlots.length > 0) {
    return true;
  }
  return false;
}

/**
 * Check if a weapon is two-handed
 * @param {Object} itemDef - Item definition
 * @returns {boolean}
 */
export function isTwoHanded(itemDef) {
  if (!itemDef) return false;
  // Check weaponType (e.g., "2h_slash", "2h_pierce", "2h_blunt")
  if (itemDef.weaponType && itemDef.weaponType.startsWith("2h_")) return true;
  // Or explicit flag
  if (itemDef.twoHanded === true) return true;
  return false;
}

/**
 * Get all allowed equipment slots for an item
 * Rules:
 * - If itemDef.equipSlots exists → return it
 * - If item is a weapon:
 *   - 2H weapon → ["main"]
 *   - 1H weapon → ["main", "off"]
 * - Otherwise → []
 * @param {Object} itemDef - Item definition
 * @returns {string[]} Array of allowed slot keys
 */
export function getAllowedEquipSlots(itemDef) {
  if (!itemDef) return [];
  
  // Explicit equip slots take precedence
  if (itemDef.equipSlots && Array.isArray(itemDef.equipSlots)) {
    return itemDef.equipSlots;
  }
  
  // Weapon type logic
  if (itemDef.weaponType) {
    if (isTwoHanded(itemDef)) {
      return ["main"];
    } else if (itemDef.weaponType.startsWith("1h_")) {
      return ["main", "off"];
    }
  }
  
  // No explicit slots and not a weapon
  return [];
}

/**
 * Validate if an item can be equipped in a specific slot
 * @param {Object} itemDef - Item definition
 * @param {string} slotKey - Equipment slot key
 * @returns {Object} { valid: boolean, reason?: string }
 */
export function validateSlotForItem(itemDef, slotKey) {
  if (!itemDef) {
    return { valid: false, reason: "Item not found" };
  }
  
  if (!isEquippable(itemDef)) {
    return { valid: false, reason: "Not equippable" };
  }
  
  const allowedSlots = getAllowedEquipSlots(itemDef);
  if (!allowedSlots.includes(slotKey)) {
    return { valid: false, reason: "Wrong slot" };
  }
  
  return { valid: true };
}

/**
 * Check if an item in the off-hand slot is valid given the main-hand item
 * Rules:
 * - Cannot equip an off-hand item while main is 2H
 * @param {Object} mainHandItem - Main hand item def (or null)
 * @param {Object} offHandItem - Off hand item def (or null)
 * @returns {Object} { valid: boolean, reason?: string }
 */
export function validateOffHandGivenMainHand(mainHandItem, offHandItem) {
  if (!offHandItem) {
    return { valid: true }; // Unequipping off-hand is always OK
  }
  
  if (mainHandItem && isTwoHanded(mainHandItem)) {
    return { valid: false, reason: "Main hand is 2H" };
  }
  
  return { valid: true };
}

/**
 * When equipping a 2H weapon to main, check if off-hand would be invalid
 * If the new main-hand is 2H and off-hand has an item, off-hand must be cleared
 * @param {Object} newMainItem - New main hand item def
 * @param {Object} currentOffItem - Current off hand item def
 * @returns {Object} { valid: boolean, mustClearOffHand: boolean, reason?: string }
 */
export function validate2HMainHand(newMainItem, currentOffItem) {
  if (!newMainItem || !isTwoHanded(newMainItem)) {
    return { valid: true, mustClearOffHand: false };
  }
  
  if (currentOffItem) {
    return { valid: true, mustClearOffHand: true, reason: "2H equip clears off-hand" };
  }
  
  return { valid: true, mustClearOffHand: false };
}

/**
 * Ensure hero equipment object has all defined slots initialized to null
 * Used for saves that may not have all slots yet
 * @param {Object} hero - Hero object
 */
export function ensureEquipmentSlots(hero) {
  if (!hero.equipment) {
    hero.equipment = {};
  }
  
  for (const slotKey of EQUIP_SLOT_KEYS) {
    if (!(slotKey in hero.equipment)) {
      hero.equipment[slotKey] = null;
    }
  }
}

/**
 * Get human-readable slot names for an item's allowed slots
 * Used for tooltips and UI feedback
 * @param {Object} itemDef - Item definition
 * @returns {string} Human-readable slot list ("Head", "Main Hand, Off Hand", etc)
 */
export function getSlotLabelsForItem(itemDef) {
  const allowedSlots = getAllowedEquipSlots(itemDef);
  if (allowedSlots.length === 0) return "Non-equippable";
  
  return allowedSlots
    .map(key => {
      const slotDef = EQUIP_SLOTS.find(s => s.key === key);
      return slotDef ? slotDef.label : key;
    })
    .join(", ");
}

/**
 * Error messages for invalid equip attempts
 * These are used to provide clear user feedback
 */
export const EQUIP_ERROR_MESSAGES = {
  "Wrong slot": "This item doesn't belong in that slot",
  "Not equippable": "This item cannot be equipped",
  "Main hand is 2H": "Cannot equip off-hand while using a 2H weapon",
  "Cannot equip 2H here": "2H weapons can only go in main hand",
  "Item not found": "Item definition not found"
};
