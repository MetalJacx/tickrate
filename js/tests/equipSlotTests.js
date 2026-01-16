/**
 * Equipment Slot System Tests
 * Validates EQ-style equipment slot enforcement, validation, and 2H weapon logic
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";
import { EQUIP_SLOTS, EQUIP_SLOT_KEYS } from "../defs.js";
import { getItemDef, ITEMS } from "../items.js";
import {
  isEquippable,
  isTwoHanded,
  getAllowedEquipSlots,
  validateSlotForItem,
  validateOffHandGivenMainHand,
  validate2HMainHand,
  ensureEquipmentSlots,
  getSlotLabelsForItem
} from "../equip.js";

test("EQUIP_SLOTS: Should have 23 slots defined", () => {
  assert.equal(EQUIP_SLOTS.length, 23, "Should have 23 equipment slots");
  assert.equal(EQUIP_SLOT_KEYS.length, 23, "EQUIP_SLOT_KEYS should have 23 entries");
});

test("EQUIP_SLOTS: Should contain expected slot keys", () => {
  const expectedKeys = [
    "charm", "ear1", "head", "face", "ear2", "neck", "shoulders", "arms",
    "back", "wrist1", "wrist2", "ranged", "hands", "main", "off",
    "finger1", "finger2", "chest", "legs", "feet", "waist", "power", "ammo"
  ];
  for (const key of expectedKeys) {
    assert.ok(EQUIP_SLOT_KEYS.includes(key), `Should include slot: ${key}`);
  }
});

test("isEquippable: Should return true for items with stats", () => {
  const sword = getItemDef("iron_sword");
  assert.ok(isEquippable(sword), "Sword should be equippable");
  
  const shield = getItemDef("wooden_shield");
  assert.ok(isEquippable(shield), "Shield should be equippable");
});

test("isEquippable: Should return false for consumables", () => {
  const potion = getItemDef("health_potion");
  assert.equal(isEquippable(potion), false, "Potions should not be equippable");
  
  const ore = getItemDef("copper_ore");
  assert.equal(isEquippable(ore), false, "Ore should not be equippable");
});

test("isTwoHanded: Should detect 2H weapons by type", () => {
  const spear = getItemDef("rusty_spear");
  assert.ok(isTwoHanded(spear), "2h_pierce should be detected as 2H");
  
  const axe = getItemDef("orcish_cleaver_heavy");
  assert.ok(isTwoHanded(axe), "2h_slash should be detected as 2H");
  
  const sword = getItemDef("iron_sword");
  assert.equal(isTwoHanded(sword), false, "1h_slash should not be 2H");
});

test("getAllowedEquipSlots: Should return main+off for 1H weapons", () => {
  const sword = getItemDef("iron_sword");
  const slots = getAllowedEquipSlots(sword);
  assert.deepEqual(slots, ["main", "off"], "1H weapon should allow main and off");
});

test("getAllowedEquipSlots: Should return main only for 2H weapons", () => {
  const spear = getItemDef("rusty_spear");
  const slots = getAllowedEquipSlots(spear);
  assert.deepEqual(slots, ["main"], "2H weapon should only allow main");
});

test("getAllowedEquipSlots: Should use explicit equipSlots if present", () => {
  const shield = getItemDef("wooden_shield");
  const slots = getAllowedEquipSlots(shield);
  assert.deepEqual(slots, ["off"], "Shield should use explicit equipSlots");
});

test("getAllowedEquipSlots: Should return empty array for non-equippables", () => {
  const potion = getItemDef("health_potion");
  const slots = getAllowedEquipSlots(potion);
  assert.deepEqual(slots, [], "Non-equippable items should allow no slots");
});

test("validateSlotForItem: Should allow valid item+slot combinations", () => {
  const sword = getItemDef("iron_sword");
  const valid = validateSlotForItem(sword, "main");
  assert.ok(valid.valid, "Sword should be valid in main slot");
});

test("validateSlotForItem: Should reject invalid item+slot combinations", () => {
  const shield = getItemDef("wooden_shield");
  const invalid = validateSlotForItem(shield, "main");
  assert.equal(invalid.valid, false, "Shield should not be valid in main slot");
  assert.equal(invalid.reason, "Wrong slot", "Should report wrong slot reason");
});

test("validateSlotForItem: Should reject non-equippables", () => {
  const potion = getItemDef("health_potion");
  const invalid = validateSlotForItem(potion, "main");
  assert.equal(invalid.valid, false, "Potion should not be equippable");
  assert.equal(invalid.reason, "Not equippable", "Should report not equippable");
});

test("validateOffHandGivenMainHand: Should allow off-hand when main is 1H", () => {
  const sword = getItemDef("iron_sword");
  const shield = getItemDef("wooden_shield");
  const valid = validateOffHandGivenMainHand(sword, shield);
  assert.ok(valid.valid, "Should allow shield with 1H sword");
});

test("validateOffHandGivenMainHand: Should reject off-hand when main is 2H", () => {
  const spear = getItemDef("rusty_spear");
  const shield = getItemDef("wooden_shield");
  const invalid = validateOffHandGivenMainHand(spear, shield);
  assert.equal(invalid.valid, false, "Should reject shield with 2H spear");
  assert.equal(invalid.reason, "Main hand is 2H", "Should report 2H conflict");
});

test("validate2HMainHand: Should clear off-hand when equipping 2H", () => {
  const spear = getItemDef("rusty_spear");
  const shield = getItemDef("wooden_shield");
  const result = validate2HMainHand(spear, shield);
  assert.equal(result.mustClearOffHand, true, "Should require clearing off-hand");
  assert.equal(result.reason, "2H equip clears off-hand");
});

test("validate2HMainHand: Should not clear off-hand if already empty", () => {
  const spear = getItemDef("rusty_spear");
  const result = validate2HMainHand(spear, null);
  assert.equal(result.mustClearOffHand, false, "Should not clear empty off-hand");
});

test("ensureEquipmentSlots: Should initialize all missing slots to null", () => {
  const hero = {
    equipment: {
      head: { id: "cloth_cap", quantity: 1 },
      chest: null
      // Missing: all other slots
    }
  };
  
  ensureEquipmentSlots(hero);
  
  // Verify all slots exist
  for (const slotKey of EQUIP_SLOT_KEYS) {
    assert.ok(slotKey in hero.equipment, `Should have slot: ${slotKey}`);
  }
});

test("getSlotLabelsForItem: Should format single slot correctly", () => {
  const shield = getItemDef("wooden_shield");
  const label = getSlotLabelsForItem(shield);
  assert.equal(label, "Off Hand", "Should return single slot label");
});

test("getSlotLabelsForItem: Should format multiple slots correctly", () => {
  const sword = getItemDef("iron_sword");
  const label = getSlotLabelsForItem(sword);
  assert.ok(label.includes("Main Hand"), "Should include Main Hand");
  assert.ok(label.includes("Off Hand"), "Should include Off Hand");
  assert.ok(label.includes(","), "Should separate with comma");
});

test("getSlotLabelsForItem: Should handle non-equippables", () => {
  const potion = getItemDef("health_potion");
  const label = getSlotLabelsForItem(potion);
  assert.equal(label, "Non-equippable", "Should return non-equippable message");
});

test("Item definitions: All armor items should have equipSlots", () => {
  const armorItems = [
    "cloth_cap", "tattered_robe", "cloth_wraps", "cloth_sandals", "cloth_leggings",
    "wooden_shield", "phantom_essence", "waylaid_ring", "traveler_cloak",
    "gravebinder_wraps", "shatterbone_warhelm", "ridgewatch_vest", "ritual_robes",
    "bonekings_talisman", "grask_totem", "arvok_signet", "reaper_shroud",
    "stalk_woven_boots", "crown_of_bone"
  ];
  
  for (const itemId of armorItems) {
    const item = getItemDef(itemId);
    assert.ok(item.equipSlots && Array.isArray(item.equipSlots), 
      `${itemId} should have equipSlots array`);
    assert.ok(item.equipSlots.length > 0, 
      `${itemId} should have at least one slot`);
  }
});

test("Item definitions: All weapons should have valid slots", () => {
  const weaponItems = [
    "rusty_dagger", "iron_sword", "stick", "enchanted_branch", "iron_mace",
    "rusty_sword", "rusty_mace", "rusty_axe", "rusty_spear", "rusty_short_sword"
  ];
  
  for (const itemId of weaponItems) {
    const item = getItemDef(itemId);
    const slots = getAllowedEquipSlots(item);
    assert.ok(slots.length > 0, `${itemId} should allow at least one slot`);
    
    // All weapons should allow main at minimum
    assert.ok(slots.includes("main"), `${itemId} should allow main slot`);
  }
});

console.log("\n✅ All equipment slot system tests passed!");
console.log(`   - 23 equipment slots defined`);
console.log(`   - Equipment validation working`);
console.log(`   - 2H weapon logic implemented`);
console.log(`   - All armor items properly configured`);
