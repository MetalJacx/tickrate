# Resist System Implementation Progress

## Phase 1: Complete ✅

### 1. Core Resist Module (`js/resist.js`)
- ✅ Created with all core functions:
  - `levelDiffMod()` - piecewise level difference modifier
  - `calculateResistChance()` - convert resist score to chance
  - `resolveActionResist()` - single resist roll with binary/partial handling
  - `getResistLogMessage()` - format resist logs
  - `ensureActorResists()` - initialize actor resists/spellPen

### 2. Action Definitions (`js/actions.js`)
- ✅ Added resist blocks to key spells:
  - **Damage spells (elemental, partial=true)**:
    - fireblast
    - iceblast
    - rain_of_fire
  - **DoT (contagion, partial=true)**:
    - flame_lick
  - **CC (magic, partial=false, difficulty=5)**:
    - mesmerize
    - fear

### 3. Combat Integration Prep (`js/combat.js`)
- ✅ Added resist.js imports
- ✅ Initialize resist stats on hero creation
- ✅ Initialize resist stats on enemy spawn

## Phase 2: Remaining (Critical)

### Integrate Resist Checks into Action Resolution
**File**: `js/combat.js` - function `performAction()` and spell handlers

Need to:
1. Call `resolveActionResist()` before applying effect
2. Log resist outcome
3. Apply effect * mult for partial actions
4. Skip effect entirely for binary resisted actions

### DoT Resist Application (roll once on apply)
**File**: `js/combat.js` - `applyBuff()` and DoT handlers

When applying a DoT effect:
1. Call `resolveActionResist()` at application time
2. If binary resisted: don't apply; log resist
3. If partial: store `buff.data.effectMult = mult`
4. Each tick: `damage = baseTickDamage * (buff.data.effectMult ?? 1)`

### CC Per-Tick Resist Checks
**File**: `js/combat.js` - buff processing in `gameTick()`

For mez/root/charm/fear CC effects:
1. Each tick: roll resist check (binary)
2. If resisted: remove buff, log break message
3. Else: CC continues for that tick

### Raw Melee Bypass
**File**: `js/combat.js` - `performAutoAttack()`

Verify swing attacks do NOT call resist checks (they should bypass entirely).

## Phase 3: Testing

1. **Basic resist test**: Fireblast vs equal-level mob, no resists
   - Should land most times, occasionally partial
2. **High resist test**: Mesmerize vs high-magic-resist mob
   - Should resist/break frequently
3. **DoT test**: Flame Lick on mob, verify mult stored and used
4. **Bypass test**: Auto-attack never calls resist

## Integration Points Detail

### A. performAction() integration
```javascript
// After effect resolution:
if (!isRawMeleeSwing) {
  const resistResult = resolveActionResist({
    caster: actor,
    target: primaryTarget,
    action: actionDef
  });
  
  if (resistResult.resisted) {
    // Binary CC/debuff: don't apply
    addLog(getResistLogMessage(actionDef.name, resistResult.type, false, 0));
    return;
  }
  
  // Apply effect multiplied by resist result
  applyEffect(primaryTarget, actionDef, resistResult.mult);
  
  if (resistResult.mult < 1) {
    addLog(getResistLogMessage(
      actionDef.name,
      resistResult.type,
      true,
      resistResult.partialPct
    ));
  }
}
```

### B. DoT application
```javascript
// In applyBuff() for DoT effects:
if (actionDef.isDot) {
  const resistResult = resolveActionResist({
    caster: source,
    target: targetActor,
    action: actionDef
  });
  
  if (resistResult.resisted) {
    addLog(getResistLogMessage(actionDef.name, resistResult.type, false, 0));
    return;
  }
  
  // Store mult on DoT data
  buff.data.effectMult = resistResult.mult;
  
  // Log partial resist
  if (resistResult.mult < 1) {
    addLog(getResistLogMessage(
      actionDef.name,
      resistResult.type,
      true,
      resistResult.partialPct
    ));
  }
}
```

### C. CC per-tick processing
```javascript
// In gameTick(), buff processing:
for (const buffKey of Object.keys(enemy.activeBuffs)) {
  const buff = enemy.activeBuffs[buffKey];
  
  // CC effects (mez, root, charm, fear) need per-tick resist check
  if (["mesmerize", "root", "charm", "fear"].includes(buffKey)) {
    const actionDef = ACTIONS[buffKey];
    const resistResult = resolveActionResist({
      caster: buff.sourceHero,
      target: enemy,
      action: actionDef
    });
    
    if (resistResult.resisted) {
      removeBuff(enemy, buffKey);
      addLog(`${enemy.name}'s ${actionDef.name} was resisted!`);
      continue;
    }
  }
  
  // ... rest of buff processing
}
```

## Sanity Checks for Phase 2

Before finalizing:
1. Verify resist doesn't break existing action resolution
2. Test that raw melee never resists (no performAction call)
3. Confirm DoT resist is one-time, not per-tick
4. Verify CC resist is per-tick (opposite of DoT)
5. Check logging is clean (not spammy, shows type + %)

## Future Enhancements

- Add item/buff sources for spell penetration
- Class-specific resist scaling
- Resist diminishing returns at high values
- Elemental chain breaking (different elements resist differently)
- Immunities (resist = 999 = always resists)
