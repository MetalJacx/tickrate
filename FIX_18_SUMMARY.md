# FIX 18 — Channeling Interrupt: Single Roll Per Hit

## Problem
The channeling interrupt system had a risk of inconsistent interrupt handling:
- Multiple hits during a cast could potentially trigger multiple separate rolls
- This could either "double-dip" (multiple interrupt chances per tick) or miss the scaling effect
- No clear guarantees about exact interrupt timing relative to hit events

## Solution: FIX 18
Changed from **one interrupt roll per tick** to **one interrupt roll per hit event**.

### Design Changes

#### 1. Interrupt Roll Timing
**Before**: Roll happens in `tickCasting()` if `wasHitDuringCast` flag is set (once per tick max)  
**After**: Roll happens immediately in `onHeroDamaged()` when hero takes damage (once per hit)

**Benefit**: Eliminates tick-boundary timing issues and guarantees one roll per hit event

#### 2. Interrupt Chance Formula
**Before**: 
```javascript
base = 0.15 + 0.10 * hitsTakenDuringCast
```

**After**:
```javascript
finalChance = clamp(0.15 + 0.10 * hitsSoFar - channelingReduction, min, max)
```

Where `hitsSoFar` is the number of hits taken so far during this cast (parameter to `getInterruptChance()`).

#### 3. Casting State Tracking
**Removed**: `wasHitDuringCast` flag (no longer needed - roll happens immediately)  
**Added**: `wasInterruptedByDamage` flag (tracks if current hit interrupted the cast)

### Code Changes

#### File: js/magicSkills.js

**Change 1: startCast() initialization**
```javascript
hero.casting = {
  spellId: spellDef.id,
  specialization: spellDef.specialization,
  manaCost,
  targetId,
  startedAtMs: nowMs,
  endsAtMs,
  lastTickMs: nowMs,
  hitsTakenDuringCast: 0,
  interrupted: false,
  wasInterruptedByDamage: false,  // FIX 18: NEW
  reserveMana: !!opts.reserveMana
};
```

**Change 2: getInterruptChance() signature and formula**
```javascript
// FIX 18: One interrupt roll per hit event
export function getInterruptChance(hero, castingState, hitsSoFar = 1) {
  const BASE_INTERRUPT = 0.15;
  const PER_HIT_PENALTY = 0.10;
  
  let chance = BASE_INTERRUPT + PER_HIT_PENALTY * hitsSoFar;
  chance = Math.min(chance, INTERRUPT_MAX);

  const chanRatio = getMagicSkillRatio(hero, MAGIC_SKILLS.channeling);
  const reduction = 0.10 * chanRatio;  // up to -10% at cap

  const finalChance = Math.max(INTERRUPT_MIN, Math.min(INTERRUPT_MAX, chance - reduction));
  return finalChance;
}
```

**Change 3: onHeroDamaged() - interrupt roll happens here**
```javascript
export function onHeroDamaged(hero, damageAmount) {
  if (!hero?.casting) return;
  if (damageAmount <= 0) return;

  const c = hero.casting;
  
  // Track this hit for future calculations
  c.hitsTakenDuringCast += 1;
  const hitsSoFar = c.hitsTakenDuringCast;

  // FIX 18: Single interrupt roll per hit
  const interruptChance = getInterruptChance(hero, c, hitsSoFar);
  
  if (Math.random() < interruptChance) {
    // Interrupted immediately
    c.interrupted = true;
    
    // Spend interrupt mana
    const frac = INTERRUPT_MANA_FRACTION;
    if (c.reserveMana) {
      const spend = Math.round((c.manaCost ?? 0) * frac);
      hero.mana = Math.max(0, (hero.mana ?? 0) - spend);
    }
    
    c.wasInterruptedByDamage = true;
  }
}
```

**Change 4: tickCasting() - removed per-tick interrupt roll**
```javascript
// FIX 18: Interrupt roll already happened in onHeroDamaged()
// Just check if marked as interrupted and clean up
if (c.wasInterruptedByDamage) {
  const interruptedState = hero.casting;
  hero.casting = null;

  if (opts.onInterrupt) opts.onInterrupt(hero, interruptedState);

  return { interrupted: true, reason: "channel_failed" };
}
```

## Interrupt Chance Examples

### Single Hit
- Hit #1: 15% base + 0% per-hit = **15%** (before channeling reduction)

### Multiple Hits
- Hit #1: 15% base + 10% × 1 = **25%**
- Hit #2: 15% base + 10% × 2 = **35%**
- Hit #3: 15% base + 10% × 3 = **45%**
- Hit #4: 15% base + 10% × 4 = **55%**
- Hit #5: 15% base + 10% × 5 = **65%** (clamped to INTERRUPT_MAX 60%)

### With Channeling at Cap
- Base wizard hit #1: 25% interrupt
- High channeling wizard hit #1: 25% - 10% reduction = **15%**
- Reduction is -10 percentage points (10% of base chance)

## Acceptance Criteria Met

✅ **One hit: reasonable interrupt chance**
- Single hit during cast: 15-25% chance (depending on channeling skill)
- Caster has significant defense with high channeling

✅ **Multiple hits during same cast: noticeably higher interrupt chance**
- Hit #1: 25%
- Hit #2: 35% (+10 pp)
- Hit #3: 45% (+10 pp)
- Each subsequent hit makes it significantly more likely to interrupt

✅ **Channeling reduces but does not eliminate interrupts**
- At cap: reduces chance by 10 percentage points
- Base 25% → 15% (with max channeling)
- Multiple hits still escalate: 35% → 25%, 45% → 35%, etc.
- Minimum always stays at INTERRUPT_MIN (3%)

## Key Design Properties

1. **No double-dipping**: Exactly one roll per hit event
2. **Hit-aware escalation**: Each additional hit increases the chance
3. **Channeling value**: High channeling is rewarding but not overpowering
4. **Clamped bounds**: Never below 3% or above 60%
5. **Immediate feedback**: Interrupt happens right away when it occurs

## Testing Results

### Test 1: Interrupt Scaling
```
After hit 1: 25% chance
After hit 2: 35% chance
After hit 3: 45% chance
After hit 4: 55% chance
After hit 5: 60% chance (clamped to max)
```
✓ Scaling works correctly: +10% per hit

### Test 2: Channeling Effect
```
Low Channeling at hit #3: 45%
High Channeling at hit #3: 35%
Reduction: 10 percentage points
```
✓ Channeling provides consistent protection

### Test 3: Per-Hit Rolls
```
Hit 1: Attempted at 25%, hit tracked
Hit 2: Attempted at 35%, hit tracked
Hit 3: Attempted at 45%, hit tracked
```
✓ Each hit rolls independently

## Files Modified
- [js/magicSkills.js](js/magicSkills.js): 4 function changes, ~50 lines

## Syntax Validation
```
✓ js/magicSkills.js syntax OK
✓ js/combat.js syntax OK
```

---

**FIX Number**: 18  
**Category**: Interrupt System / Per-Hit Roll Model  
**Complexity**: Medium (state tracking + timing model change)  
**Risk Level**: Low (defensive refactor, cleaner interrupt semantics)
