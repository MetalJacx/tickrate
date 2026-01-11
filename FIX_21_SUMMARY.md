# FIX 21 — combatMath.js: Player-vs-Mob Detection

## Problem
The player-vs-mob detection in combat math was too broad:
```javascript
// OLD (INCORRECT)
if (attacker && (attacker.classKey || attacker.equipment)) {
  // Treat as player, apply weapon skill scaling
}
```

**Issues**:
- Mobs can have `classKey` (if new mob types are added)
- Mobs can have equipment-like fields
- This causes mobs to incorrectly use **player weapon skill math**
- Breaks mob combat tuning and balance

**Impact**:
- Mobs with weapon skills would get damage/hit bonuses they shouldn't
- Combat balance breaks for future mob expansions with classKey
- Unpredictable scaling if mobs ever carry equipment

## Solution
Replace broad detection with **explicit player type check**:

### New Helper Function
```javascript
// FIX 21: Explicit player-vs-mob detection to prevent mobs from using player weapon-skill math
// Purpose: Ensure mobs never incorrectly benefit from player weapon skills even if they have classKey/equipment
// Strategy: Check explicit type field instead of broad classKey || equipment check
export function isPlayerActor(a) {
  return a?.type === "player";
}
```

### Updated Functions

**computeHitChance()** — [line 107]
```javascript
export function computeHitChance(attacker, defender) {
  // FIX 21: Only use player melee weapon-skill model for explicit player actors
  // Mobs always use the mob model, even if they have classKey or equipment-like fields
  if (isPlayerActor(attacker)) {
    const wt = getEquippedWeaponType(attacker);
    return getMeleeHitChance(attacker, wt, defender);
  }
  // ... mob model (stat-based) calculation
}
```

**computeRawDamage()** — [line 132]
```javascript
export function computeRawDamage(attacker, isCrit = false) {
  // ... base damage calculation ...
  
  // FIX 21: Only apply weapon skill scalar for explicit player actors
  // Mobs always use base damage model, even if they have classKey or equipment-like fields
  if (isPlayerActor(attacker)) {
    const wt = getEquippedWeaponType(attacker);
    const skillRatio = getWeaponSkillRatio(attacker, wt);
    const skillScalar = 0.85 + 0.15 * skillRatio;
    rawDamage *= skillScalar;
  }
  
  // ... critical damage handling ...
}
```

## Design Decisions

### Why Explicit Type Check?
- **Safer**: Explicit is better than implicit
- **Maintainable**: Clear intent in code
- **Future-proof**: Won't break if mobs get classKey/equipment
- **Canonical**: Matches existing code patterns (already used in backup file)

### Why Not isHero?
- `type === "player"` is already established in codebase
- Clear semantics (mob vs player, not hero vs non-hero)
- Consistent with existing player initialization (`hero.type = "player"`)

### How Mobs Are Initialized
```javascript
// In combat.js, line 2193
if (!hero.type) hero.type = "player";  // Only set for heroes

// Mobs created via createMobFromDef() don't have type='player'
// They use the fallback mob model (stat-based, no weapon skills)
```

### Hero Type Safeguards (Defense in Depth)
To ensure heroes **always** have `type = "player"`, there are three layers of protection:

1. **Creation** ([combat.js line 507](js/combat.js#L507)):
   ```javascript
   export function createHero(classKey, customName, raceKey) {
     const hero = {
       type: "player",  // Set immediately on creation
       // ... rest of hero properties
     };
   }
   ```

2. **Load/Migration** ([state.js line ~354](js/state.js#L354)):
   ```javascript
   // FIX 21: Ensure heroes always have type = "player" after load
   // Critical for isPlayerActor() check in combatMath.js weapon skill routing
   if (!h.type) h.type = "player";
   ```

3. **Runtime Failsafe** ([combat.js line 2193](js/combat.js#L2193)):
   ```javascript
   export function gameTick() {
     for (const hero of state.party) {
       if (!hero.type) hero.type = "player";  // Every tick safety check
     }
   }
   ```

**Why Three Layers?**
- Creation: Handles new heroes
- Load: Handles old saves from before type field existed
- Tick: Ultimate failsafe if somehow type is missing

This ensures `isPlayerActor()` will **always** correctly identify heroes, preventing loss of weapon skill scaling.

### Future: Companions/Pets
When adding companions or pets, explicitly decide:
- `type: "player"` → Uses player weapon skill model
- `type: "pet"` → Uses mob stat-based model (no weapon skills)
- `type: "companion"` → Custom model (extend `isPlayerActor()` as needed)

The explicit type check makes this decision clear and maintainable.

## Test Results

### Test 1: isPlayerActor() Recognition (7/7 pass)
```
✓ Explicit player type → true
✓ Explicit mob type → false
✓ Has classKey/equipment but no type → false
✓ Has classKey only → false
✓ Has equipment only → false
✓ Empty object → false
✓ Null actor → false
```

### Test 2: Routing Verification
```
Player recognized as player: true
Mob NOT recognized as player: true

Player hit chance: 0.723 (uses weapon skill model)
Mob hit chance: 0.397 (uses stat-based model)
Different calculations: ✓

Player damage: 17.055 (includes weapon skill scaling)
Mob damage: 20.000 (base damage model only)
Different calculations: ✓
```

### Test 3: Mob with Weapon Skills
```
Scenario: Mob has classKey, equipment, and weapon skills
Expected: Weapon skills ignored (no bonus)
Result: ✓ Weapon skill scaling NOT applied to mob
```

## Acceptance Criteria
- ✅ Only heroes/players use weapon skill hit/damage scaling
- ✅ Mobs NEVER benefit from player weapon skills even with classKey/equipment
- ✅ All unit/integration tests pass
- ✅ Syntax validation passes
- ✅ Explicit helper function makes intent clear

## Code Changes Summary

| File | Function/Location | Change | Lines |
|------|----------|--------|-------|
| combatMath.js | isPlayerActor() | NEW helper | 48-51 |
| combatMath.js | computeHitChance() | Updated condition | 107-111 |
| combatMath.js | computeRawDamage() | Updated condition | 138-143 |
| combat.js | createHero() | Already sets type="player" | 507 |
| combat.js | gameTick() | Failsafe: ensures type | 2193 |
| state.js | loadGame() | Migration: ensures type | ~354 |

## Backward Compatibility
- ✅ No breaking changes to APIs
- ✅ No changes to mob behavior (mob model unchanged)
- ✅ Player behavior unchanged (same weapon skill math, just gated properly)
- ✅ Existing saves load without issues

## Future-Proofing
If mobs ever get enhanced with:
- `classKey` fields
- Equipment system  
- Weapon skills

The `isPlayerActor()` check ensures they **won't accidentally use player scaling**. They'll stay on the mob stat-based model until explicitly assigned `type = "player"`.

## Related Fixes
- FIX 17: Weapon type normalization (works with this detection)
- FIX 18: Interrupt model (only affects channeling, not affected by this fix)
- FIX 19: Class multipliers (applies to player weapon skills via getMeleeHitChance)
- FIX 20: Save sanitization (independent of combat detection)
