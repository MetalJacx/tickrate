# Testing the Delay & Haste System

## 🚀 Quick Start

### Option 1: Visual Test Runner (Recommended)
1. Open [test-delay-haste.html](test-delay-haste.html) in your browser
2. Click "Run All Tests"
3. Watch the results (all should be green ✓)

**Expected**: All 26 tests pass in ~1 second

---

### Option 2: In-Game Testing
1. Start the game
2. Create a character and enter combat
3. Follow the [Manual Testing Guide](MANUAL_TESTING_GUIDE.md)

**Expected**: Combat feels smooth with consistent attack rhythm

---

### Option 3: Browser Console Testing
Open DevTools (F12) and paste:
```javascript
// Copy the test functions from test-delay-haste.html or delayHasteTests.js
// Then run:
runTests();
```

---

## 📋 Test Files Created

| File | Purpose | How to Use |
|------|---------|-----------|
| [test-delay-haste.html](test-delay-haste.html) | Visual test runner | Open in browser, click button |
| [MANUAL_TESTING_GUIDE.md](MANUAL_TESTING_GUIDE.md) | In-game testing steps | Follow 9 test scenarios |
| [DELAY_HASTE_SYSTEM.md](DELAY_HASTE_SYSTEM.md) | System documentation | Reference for formulas & examples |
| [js/tests/delayHasteTests.js](js/tests/delayHasteTests.js) | Node.js test suite | `node js/tests/delayHasteTests.js` |

---

## 🧪 Test Coverage

### Automated Tests (26 total)
- ✓ 5 basic swing tick calculations (dagger, sword, mace, slow weapons)
- ✓ 5 haste calculations (various delay + haste combinations)
- ✓ 4 slow/debuff calculations (negative haste with clamping)
- ✓ 6 overflow bonus calculations (at 1-tick floor with caps)
- ✓ 2 haste clamping tests ([-0.75, +3.00] bounds)
- ✓ 5 swing cooldown progression tests (tick counting)

### Manual Tests (9 scenarios)
1. Hero auto-attack swing rate
2. Enemy auto-attack swing rate
3. Fast weapon overflow swings
4. Weapon swap updates timing
5. Haste buff reduces swing time
6. Double Attack still works
7. Mesmerize blocks attacks
8. Fear blocks attacks
9. Party wipe & combat end

---

## ✅ What to Look For

### Automated Tests Should Show:
- All results in green (✓ PASS)
- Summary: `FINAL RESULTS: 26/26 tests passed`
- No red failures (❌ FAIL)

### In-Game Combat Should Feel:
- **Rhythmic**: Attacks happen on a predictable schedule
- **Fair**: Both players and enemies follow the same rules
- **Rewarding**: Haste gear speeds up attacks noticeably
- **Stable**: No crashes on weapon swaps, buffs, or debuffs

---

## 🔍 Key Metrics to Verify

| Scenario | Expected Result |
|----------|-----------------|
| Sword (delay 30) | 1 attack per 3 seconds |
| Mace (delay 40) | 1 attack per 6 seconds |
| Dagger (delay 15) with +30% haste | 1 attack per 3 seconds, ~50% extra swings |
| Mace with +50% haste | 1 attack per 3 seconds (instead of 6) |
| Mace with -50% slow | 1 attack per 9 seconds (instead of 6) |
| Double Attack (Warrior) | Procs ~25-30% of the time at level 10+ |
| Mesmerize buff | Enemy doesn't swing while active |
| Fear buff | Enemy doesn't swing while active |

---

## 💡 Tips

**To verify weapon delays:**
```javascript
// In browser console:
const sword = ITEMS.iron_sword;
const swingTicks = Math.max(1, Math.round(sword.delayTenths / 30));
console.log(`Iron Sword: ${sword.delayTenths} tenths → ${swingTicks} tick(s)`);
```

**To watch swing events in real-time:**
Add this debug log to [combat.js](js/combat.js) line ~1920:
```javascript
console.log(`[SWING] ${hero.name}: cd=${hero.swingCd}, ticks=${hero.swingTicks}`);
```

**To verify haste is being applied:**
```javascript
// In console during combat:
const hero = state.party[0];
console.log(`Haste: getTotalHastePct(hero) = ${getTotalHastePct(hero)}`);
console.log(`Swing: ${hero.swingTicks} ticks, cd=${hero.swingCd}`);
```

---

## 🎯 Success Criteria

✅ **Pass all automated tests** → System math is correct  
✅ **Combat feels smooth** → Tick-based timing is working  
✅ **Haste changes attack speed** → Buff system integrates correctly  
✅ **No crashes** → Code is stable  
✅ **Overflow swings visible** → Fast weapons are rewarding  

If all of the above are true, **the system is production-ready!**

---

## 📞 Debugging Help

**Tests failing?**
1. Check [combat.js](js/combat.js) has all the new helper functions
2. Verify no typos in function names
3. Check that `computeSwingTicks()` returns integers

**Combat feels weird?**
1. Open console (F12) during combat
2. Check `hero.swingTicks` and `swingCd` values
3. Verify they decrement correctly each tick
4. Confirm `swingCd === 0` before attacks

**Weapon swaps crash?**
1. Check `performAutoAttack()` handles `mainEnemy === null`
2. Verify `performEnemyAutoAttack()` checks target validity
3. Make sure swing timers are recomputed after swap

---

Enjoy testing! 🎮
