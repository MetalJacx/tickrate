# Manual Testing Guide for Delay & Haste System

## Quick Start

### Automated Tests (Recommended First)
```bash
# Run from terminal in the tickrate folder:
node js/tests/delayHasteTests.js
```

Or in browser console (DevTools F12):
```javascript
// Import the test module and run
fetch('js/tests/delayHasteTests.js')
  .then(r => r.text())
  .then(eval);

// Then run tests:
runTests();
```

**Expected output**: All 40+ tests should pass with green checkmarks.

---

## Manual In-Game Testing

### Test 1: Hero Auto-Attack Swing Rate (Sword)

**Setup**:
1. Create a Warrior
2. Equip Iron Sword (delay 30 → 1 tick)
3. Find an enemy and enter combat

**Expected Behavior**:
- Hero attacks **every 3 seconds** (1 tick = 3 seconds)
- Click through several combat rounds
- Enemy should show damage messages ~once per 3-second tick
- Movement should feel responsive; attacks are predictable

**What to Check**:
- ✓ First attack happens quickly (within 1 tick)
- ✓ Subsequent attacks happen every ~3 seconds
- ✓ Combat log shows consistent rhythm

---

### Test 2: Enemy Auto-Attack Swing Rate (Slow Mob)

**Setup**:
1. Go to Zone 3 and find a large mob (e.g., Orc Centurion)
2. Orc Centurion has naturalDelay 50 → 2 ticks
3. Enter combat

**Expected Behavior**:
- Enemy attacks **every 6 seconds** (2 ticks = 6 seconds)
- Player takes damage every ~6 seconds
- This should feel slower than player attacks (if player has sword)

**What to Check**:
- ✓ Enemy doesn't attack every tick
- ✓ Consistent 6-second timing between swings
- ✓ Player has time to cast spells/abilities between enemy attacks

---

### Test 3: Fast Weapon Overflow Swings

**Setup**:
1. Create a Ranger or other class
2. Equip Rusty Dagger (delay 15 → 1 tick)
3. Enter combat and fight for 20+ seconds

**Expected Behavior**:
- Hero attacks every tick (every 3 seconds)
- Occasionally (roughly 50% of the time), hero gets an **extra swing** within the same tick
- Combat log should show messages like:
  ```
  Hero hits Enemy for 5.0 damage!
  Hero hits Enemy for 4.8 damage!  ← Extra overflow swing
  ```

**What to Check**:
- ✓ Extra swings occur
- ✓ They happen roughly 50% of the time (not every tick, not never)
- ✓ Damage adds up correctly over time

---

### Test 4: Weapon Swap Updates Swing Timer

**Setup**:
1. Create a Warrior with Iron Sword (delay 30 → 1 tick)
2. Enter combat
3. After a few ticks, switch to Iron Mace (delay 40 → 2 ticks normally)
4. Continue fighting

**Expected Behavior**:
- After swap, hero's swing rate updates
- Progress carries over proportionally (no free swings)
- If you swapped mid-swing, you don't immediately get a new swing
- Swing rate should feel consistent post-swap

**What to Check**:
- ✓ Game doesn't crash on weapon swap
- ✓ Hero continues attacking in the new rhythm
- ✓ No immediate double-swings after swap

---

### Test 5: Haste Buff Reduces Swing Time

**Setup**:
1. Create a Cleric or Ranger
2. Equip Iron Mace (delay 40 → 2 ticks)
3. Enter combat, note the attack rhythm (every 6 seconds)
4. Cast **Fortify** (or create a haste buff if available)
5. Continue fighting

**Expected Behavior**:
- Before buff: Swings every 6 seconds (2 ticks)
- After buff with +25% haste: Swings every ~5.5 seconds
- With more haste, attacks get faster but cap at 1 tick (3 seconds)

**What to Check**:
- ✓ Haste buff visible in UI/buffs list
- ✓ Attack speed noticeably increases
- ✓ Damage increases (from overflow bonuses if hitting floor)

---

### Test 6: Double Attack Still Works

**Setup**:
1. Create a Warrior (level 5+)
2. Equip any sword
3. Enter combat and fight for 1-2 minutes

**Expected Behavior**:
- Hero occasionally performs "Double Attack" (procced from auto-attacks)
- Combat log shows:
  ```
  Hero hits Enemy for 5.2!
  Hero strikes again (Double Attack) for 4.8!
  ```
- Double Attack skill increases over time

**What to Check**:
- ✓ Double Attack procs during normal swings
- ✓ It's not tied to ability cooldowns
- ✓ Skill level increases with each proc
- ✓ Damage scales with level

---

### Test 7: Mesmerize Blocks Attacks

**Setup**:
1. Create an Enchanter
2. Enter combat with multiple enemies (or single enemy)
3. Cast **Mesmerize** on the main enemy
4. Continue combat

**Expected Behavior**:
- Mesmerized enemy doesn't attack
- Combat log shows: `${enemy.name} is mesmerized and cannot act!`
- When enemy wakes up (buff expires), attacks resume

**What to Check**:
- ✓ Mesmerized enemies don't swing
- ✓ Once buff expires, attacks resume at normal rhythm
- ✓ Party members still get damaged by other enemies (if any)

---

### Test 8: Fear Blocks Attacks

**Setup**:
1. Create a Ranger or Wizard
2. Enter combat
3. Cast **Fear** on enemy (if available)
4. Continue fighting

**Expected Behavior**:
- Feared enemy doesn't attack
- Combat log shows: `${enemy.name} is running for its life and cannot attack!`
- When fear expires, enemy attacks resume

**What to Check**:
- ✓ Feared enemies don't swing
- ✓ Once debuff expires, attacks resume at normal rhythm

---

### Test 9: Party Wipe & Combat End

**Setup**:
1. Let your party get killed
2. Observe combat ending
3. Fight another enemy to death
4. Observe loot dropping

**Expected Behavior**:
- When all party members die: `onPartyWipe()` is called, combat ends
- When last enemy dies: `onEnemyKilled()` is called, respawn timer starts
- No infinite combat loops

**What to Check**:
- ✓ Combat cleanly ends when party is wiped
- ✓ Combat cleanly ends when all enemies are killed
- ✓ Loot system still works (no crashes)

---

## Advanced Testing: Weapon Delay Verification

You can verify weapon delays are set correctly by checking the browser console:

```javascript
// Check a weapon's delay
const itemDef = getItemDef("iron_sword");
console.log(`Iron Sword delay: ${itemDef.delayTenths} tenths`);

// Check all weapons
Object.values(ITEMS).forEach(item => {
  if (item.delayTenths) {
    const swingTicks = Math.max(1, Math.round(item.delayTenths / 30));
    console.log(`${item.name}: delay ${item.delayTenths} → ${swingTicks} tick(s)`);
  }
});

// Check mob delays
Object.values(MOBS).forEach(mob => {
  const delay = mob.naturalDelayTenths || 30;
  const swingTicks = Math.max(1, Math.round(delay / 30));
  console.log(`${mob.name}: delay ${delay} → ${swingTicks} tick(s)`);
});
```

---

## Debug Logging

Add this to [combat.js](../js/combat.js) temporarily to log swing timers:

```javascript
// In performAutoAttack():
console.log(`[SWING] ${hero.name}: swingTicks=${hero.swingTicks}, swingCd=${hero.swingCd}, attacks!`);

// In performEnemyAutoAttack():
console.log(`[SWING] ${enemy.name}: swingTicks=${enemy.swingTicks}, swingCd=${enemy.swingCd}, attacks!`);
```

Then in combat, open DevTools console (F12) and watch the swing events:
```
[SWING] Metal: swingTicks=1, swingCd=1, attacks!
[SWING] Skeleton: swingTicks=1, swingCd=1, attacks!
[SWING] Metal: swingTicks=1, swingCd=1, attacks!
[SWING] Skeleton: swingTicks=1, swingCd=1, attacks!
```

---

## Checklist Summary

| Test | Manual | Automated | How to Run |
|------|--------|-----------|-----------|
| Basic swing ticks | Optional | ✓ Automated | `runTests()` |
| Haste calculations | Optional | ✓ Automated | `runTests()` |
| Slow calculations | Optional | ✓ Automated | `runTests()` |
| Overflow bonuses | Optional | ✓ Automated | `runTests()` |
| Hero swings in-game | ✓ Required | - | Fight enemy, watch attacks |
| Enemy swings in-game | ✓ Required | - | Fight enemy, watch damage |
| Weapon swaps | ✓ Required | - | Swap weapon mid-combat |
| Haste buffs | ✓ Recommended | - | Cast buff & fight |
| Double Attack | ✓ Recommended | - | Warrior level 5+ |
| Mesmerize block | ✓ Recommended | - | Enchanter vs enemy |
| Fear block | ✓ Recommended | - | Ranger vs enemy |
| Combat end | ✓ Required | - | Die or kill enemy |

---

## Troubleshooting

**Problem**: Tests fail  
**Solution**: Make sure you're using the latest [combat.js](../js/combat.js) with the new helper functions

**Problem**: Hero doesn't swing  
**Solution**: Check console for errors. Hero might have swingTicks=0 (shouldn't happen)

**Problem**: Weapon swap crashes the game  
**Solution**: Check that `performAutoAttack()` and `performEnemyAutoAttack()` handle null enemies correctly

**Problem**: Overflow swings seem too rare  
**Solution**: This is expected for weapons with low delay like Sword (30). Only Dagger (15) gets 50% chance

---

## What Success Looks Like

✅ **Tests pass**: All 40+ automated tests should pass  
✅ **Rhythm is consistent**: Combat feels like EQ — predictable attack timing  
✅ **Haste matters**: Equipping haste gear visibly speeds up attacks  
✅ **Overflow swings feel good**: Extra swings are rewarding, not overpowered  
✅ **No crashes**: Weapon swaps, buffs, and debuffs don't crash the game  
✅ **Combat feels fair**: Both player and enemies follow the same rules
