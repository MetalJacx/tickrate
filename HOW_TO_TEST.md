# How to Run Tests

## 🎯 Quickest Way: Visual Test Runner

**Windows:**
1. Open File Explorer → `g:\Tickrate\tickrate\`
2. Double-click `test-delay-haste.html`
3. Click the blue button: **"Run All Tests"**
4. Watch results appear (all should be green ✓)

**Mac/Linux:**
1. Navigate to tickrate folder
2. Open `test-delay-haste.html` with your browser
3. Click "Run All Tests"

**Expected**: ~26 tests, all passing in 1 second

---

## 🎮 Test in the Game (Most Important!)

### Before You Start:
- Have the game running and loaded
- Open DevTools: Press **F12** or **Ctrl+Shift+I**
- Open the "Console" tab

### Test 1: Verify Basic Swing Rates
```javascript
// Check that swing tick calculations work
console.log("=== SWING TICK CALCULATIONS ===");
const delays = [
  {name: "Dagger (15)", delay: 15, expectedTicks: 1},
  {name: "Sword (30)", delay: 30, expectedTicks: 1},
  {name: "Mace (40)", delay: 40, expectedTicks: 2},
];

delays.forEach(d => {
  const ticks = Math.max(1, Math.round(d.delay / 30));
  console.log(`${d.name}: ${ticks} tick(s) ${ticks === d.expectedTicks ? "✓" : "❌"}`);
});
```

### Test 2: Check Weapon Delays Are Set
```javascript
// Verify all weapons have delay values
console.log("=== WEAPON DELAYS ===");
const weapons = Object.values(ITEMS).filter(i => i.delayTenths);
weapons.forEach(w => {
  const ticks = Math.max(1, Math.round(w.delayTenths / 30));
  console.log(`${w.name}: delay ${w.delayTenths} → ${ticks} tick(s)`);
});
```

### Test 3: Check Mob Natural Delays Are Set
```javascript
// Verify all mobs have natural delay values
console.log("=== MOB DELAYS ===");
Object.values(MOBS).forEach(m => {
  const delay = m.naturalDelayTenths || 30;
  const ticks = Math.max(1, Math.round(delay / 30));
  console.log(`${m.name}: delay ${delay} → ${ticks} tick(s)`);
});
```

### Test 4: Fight an Enemy and Watch Swing Timers
1. Create a character and enter combat
2. In DevTools console, run:
```javascript
// Watch hero's swing timer in real-time
const hero = state.party[0];
console.log("=== HERO SWING INFO ===");
console.log(`Name: ${hero.name}`);
console.log(`Swing Ticks: ${hero.swingTicks} (attacks every ${hero.swingTicks * 3} seconds)`);
console.log(`Swing CD: ${hero.swingCd} (will attack in ${hero.swingCd * 3} seconds)`);
```

3. Wait a few ticks and re-run it to see `swingCd` count down
4. When `swingCd === 0`, you should see an attack message

### Test 5: Test Haste Buff
1. Create a character with a haste-giving item or spell
2. Enter combat and note attack speed
3. Apply the haste buff
4. In console:
```javascript
const hero = state.party[0];
const haste = getTotalHastePct(hero);
const delay = getBaseDelayTenths(hero);
const newTicks = computeSwingTicks(delay, haste);
console.log(`With ${(haste * 100).toFixed(0)}% haste, attacks every ${newTicks * 3} seconds`);
```
5. Attack speed should visibly increase

### Test 6: Check Double Attack Works
1. Create a Warrior (level 5+)
2. Fight an enemy for 1-2 minutes
3. Watch combat log for:
   ```
   Hero hits Enemy for 5.2!
   Hero strikes again (Double Attack) for 4.8!
   ```
4. Verify "Double Attack" skill increases in the Stats modal

### Test 7: Test Mesmerize Block
1. Create an Enchanter
2. Fight an enemy and cast Mesmerize
3. Watch that enemy doesn't attack while mesmerized
4. Log should show:
   ```
   [Enemy] is mesmerized and cannot act!
   ```

---

## 📊 All Tests at a Glance

| # | What | How to Test | Expected Result |
|---|------|-------------|-----------------|
| 1 | Swing calculations | Run test-delay-haste.html | 26/26 pass ✓ |
| 2 | Weapon delays | Check ITEMS in console | All weapons have delayTenths |
| 3 | Mob delays | Check MOBS in console | All mobs have naturalDelayTenths |
| 4 | Hero swings | Fight enemy, watch `hero.swingCd` | Counts down, attacks on 0 |
| 5 | Enemy swings | Watch enemy attack timing | Consistent rhythm (2-3 ticks) |
| 6 | Haste effect | Apply buff, check swing ticks | Attack speed increases |
| 7 | Double Attack | Warrior fights, watch log | Procs ~25-30% of the time |
| 8 | Mesmerize | Enchanter casts, enemy frozen | Enemy doesn't swing |
| 9 | Combat end | Kill enemy or die | Combat cleanly ends |

---

## 🎬 Step-by-Step Manual Test

### Scenario: Test Sword Attack Rhythm
1. **Create Warrior** → equip Iron Sword (delay 30)
2. **Enter Zone 1** → find Skeleton
3. **Start Combat** → in console:
   ```javascript
   const hero = state.party[0];
   const start = Date.now();
   console.log(`STARTING TEST at ${start}`);
   console.log(`Initial: swingTicks=${hero.swingTicks}, swingCd=${hero.swingCd}`);
   
   // Check every second for 10 seconds
   setInterval(() => {
     const elapsed = Date.now() - start;
     console.log(`[${elapsed}ms] cd=${hero.swingCd}, ticks=${hero.swingTicks}`);
   }, 1000);
   ```
4. **Watch the combat log** → should see attacks every 3 seconds
5. **Expected output in console**:
   ```
   STARTING TEST at 1704552000000
   Initial: swingTicks=1, swingCd=1
   [1000ms] cd=0, ticks=1          ← Ready to swing!
   [2000ms] cd=1, ticks=1
   [3000ms] cd=0, ticks=1          ← Swings again!
   [4000ms] cd=1, ticks=1
   [5000ms] cd=0, ticks=1          ← Swings again!
   ```

### Scenario: Test Mace Attack Rhythm (Slower)
1. **Create Warrior** → equip Iron Mace (delay 40)
2. **Enter Zone 1** → find Skeleton
3. **Start Combat** → in console:
   ```javascript
   const hero = state.party[0];
   console.log(`Mace: swingTicks=${hero.swingTicks}`);
   // Should be 2 ticks = 6 seconds between swings
   ```
4. **Watch combat log** → should see attacks every 6 seconds (slower!)

### Scenario: Test Haste Effect
1. **Create Cleric or Ranger** → equip Iron Mace
2. **Enter combat** → note: attacks every 6 seconds
3. **Cast Fortify or haste buff**
4. **In console**:
   ```javascript
   const hero = state.party[0];
   const haste = getTotalHastePct(hero);
   const delay = getBaseDelayTenths(hero);
   const newTicks = computeSwingTicks(delay, haste);
   console.log(`With haste: ${newTicks} ticks = ${newTicks * 3} seconds`);
   // Should now be 1 tick = 3 seconds!
   ```
5. **Watch combat log** → attacks should be faster!

---

## 📈 Success Metrics

✅ **All automated tests pass** → Math is correct  
✅ **Sword attacks ~every 3 seconds** → Delay conversion works  
✅ **Mace attacks ~every 6 seconds** → Delay conversion works  
✅ **Haste speeds up attacks** → Buff integration works  
✅ **Combat feels smooth** → No lag or stuttering  
✅ **Double Attack procs** → Warrior bonus still works  
✅ **Mesmerize blocks attacks** → Debuff system works  

---

## 🆘 Troubleshooting

**Problem**: Sword attacks every 6 seconds (too slow)  
**Solution**: Check `delayTenths` is 30 in ITEMS, not 60

**Problem**: Mace attacks every 1.5 seconds (too fast)  
**Solution**: Check `delayTenths` is 40, and `computeSwingTicks(40, 0)` returns 2

**Problem**: Haste buff doesn't speed up attacks  
**Solution**: Verify `getTotalHastePct()` is reading the buff correctly

**Problem**: Double Attack doesn't proc  
**Solution**: Make sure Warrior is level 5+, and `doubleAttackProcChance()` is being called

**Problem**: Tests fail with "function not found"  
**Solution**: Make sure new helper functions are exported from [combat.js](js/combat.js)

---

## 📞 Need Help?

1. **Check console for errors** (F12 → Console tab)
2. **Verify no typos** in function names
3. **Reload the page** (Ctrl+F5 = hard refresh)
4. **Test in Firefox or Chrome** (some browsers handle things differently)

You've got this! 🚀
