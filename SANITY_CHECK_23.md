# SANITY CHECK 23: Fractional Mana Bank Implementation

## Problem Statement

**Previous Implementation (FIX 16 Workaround)**:
- Used `Math.round()` to convert fractional mana costs to integers
- **Issue**: Low-cost spells lost effectiveness due to rounding
  - Example: 5 mana spell × 10% reduction = 0.5 mana saved → `Math.round(0.5) = 0` → no savings
  - Players felt specialization training was ineffective early-game
  - FIX 16 force-saved 1 mana as workaround (imprecise for large spells)

**Root Cause**:
- Rounding happens per-cast, losing fractional parts
- No way to "save up" tiny reductions into whole mana

## Solution: Fractional Mana Bank

Implement persistent per-specialization accumulator that:
1. Tracks fractional mana savings between casts
2. Converts accumulated fractions to whole mana when bank ≥ 1
3. Preserves exact long-run reduction matching `SPEC_MANA_REDUCTION_AT_CAP * ratio`

## Implementation Details

### 1. Data Initialization (ensureMagicSkills)

```javascript
// SANITY CHECK 23: Initialize fractional mana bank for each specialization
if (!hero.specManaBank) {
  hero.specManaBank = {};
}
// Ensure each specialization has a bank entry; sanitize old saves
for (const specKey of SPECIALIZATIONS) {
  if (hero.specManaBank[specKey] === undefined) {
    hero.specManaBank[specKey] = 0;
  } else if (!Number.isFinite(hero.specManaBank[specKey]) || hero.specManaBank[specKey] < 0) {
    hero.specManaBank[specKey] = 0; // Sanitize corrupted values
  }
}
```

**Behavior**:
- Initialize `hero.specManaBank = {}` if missing (new saves)
- Sanitize NaN, Infinity, negative values from old saves
- Ensures all 6 specializations have valid bank entries

### 2. Stable Specialization Key Helper (getSpecKeyForSpell)

```javascript
function getSpecKeyForSpell(spellDef) {
  const specKey = spellDef.specialization;
  if (specKey && SPECIALIZATIONS.includes(specKey)) {
    return specKey;
  }
  return undefined;
}
```

**Purpose**:
- Validates `spellDef.specialization` against allowed list
- Prevents invalid keys from corrupting the bank
- Returns `undefined` if spec is missing or invalid

### 3. Bank-Based Mana Cost Calculation (getFinalManaCost)

```javascript
export function getFinalManaCost(hero, spellDef) {
  const specKey = getSpecKeyForSpell(spellDef);
  const base = (spellDef.manaCost ?? spellDef.cost?.mana ?? 0);
  if (!specKey) return base;

  ensureMagicSkills(hero); // Ensure bank exists

  const ratio = getSpecRatio(hero, specKey);
  const reduction = SPEC_MANA_REDUCTION_AT_CAP * ratio; // up to 10%
  const fractionalSaving = base * reduction;

  // Accumulate fractional savings into bank
  hero.specManaBank[specKey] += fractionalSaving;

  // Extract whole mana units from bank
  const wholeSaved = Math.floor(hero.specManaBank[specKey]);
  hero.specManaBank[specKey] -= wholeSaved;

  // Final cost = base - whole units saved, clamped to [0, base]
  const finalCost = Math.max(0, base - wholeSaved);

  return finalCost;
}
```

**Flow**:
1. Extract base mana cost (fallback: manaCost → cost.mana → 0)
2. Get specialization ratio [0, 1] where 0 = untrained, 1 = at cap
3. Calculate fractional saving: `base * (SPEC_MANA_REDUCTION_AT_CAP * ratio)`
4. **Accumulate**: Add fractional amount to `hero.specManaBank[specKey]`
5. **Extract**: Use `Math.floor()` to convert accumulated amount to whole units
6. **Update**: Remove extracted whole units from bank, leaving fractional remainder
7. **Return**: `base - wholeSaved` clamped to [0, base]

**Example Flow** (5 mana spell, at cap = 10% reduction):
- Cast 1: bank = 0 + 0.5 = 0.5; extract floor(0.5) = 0; cost = 5 - 0 = 5
- Cast 2: bank = 0.5 + 0.5 = 1.0; extract floor(1.0) = 1; cost = 5 - 1 = 4
- Cast 3: bank = 0 + 0.5 = 0.5; extract floor(0.5) = 0; cost = 5 - 0 = 5
- Cycle repeats: every 2 casts saves 1 mana on average

## Test Results

All 13 test cases pass (13/13):

| Test | Description | Result |
|------|-------------|--------|
| A | Bank initializes with all specializations | ✓ |
| B | Old save with missing bank is sanitized | ✓ |
| C | Old save with corrupted bank values is reset | ✓ |
| D | Spell with no specialization costs base mana | ✓ |
| E | Invalid specialization key is ignored | ✓ |
| F | High specialization level applies correct reduction | ✓ |
| G | Low-cost spell accumulates fractional savings | ✓ |
| H | Long-run average mana matches expected reduction | ✓ |
| I | Multiple specializations have independent banks | ✓ |
| J | Spell with cost.mana field works | ✓ |
| K | Partial specialization gives proportional reduction | ✓ |
| L | Bank persists across multiple spell casts | ✓ |
| M | Locked specialization gives 0% reduction | ✓ |

## Acceptance Criteria

✓ **Low-cost spells feel effective**: 5 mana spell saves on every 2nd cast (not lost to rounding)  
✓ **Long-run accuracy**: Sum of 1000 casts matches expected average exactly  
✓ **Save/load safe**: Bank values sanitized on load, persisted across sessions  
✓ **Independent per-spec**: Each specialization has separate accumulator  
✓ **Backward compatible**: Old saves without bank field are created automatically  
✓ **Multiple cost formats**: Supports both `manaCost` and `cost.mana` fields  

## Comparison: Old vs New

### Before (Math.round)
```
5 mana spell × 10% reduction:
  Cost calculation: 5 * 0.9 = 4.5
  After rounding: Math.round(4.5) = 4
  Mana saved per cast: 1

But across variations:
  7 mana spell × 10%: 7 * 0.9 = 6.3 → Math.round(6.3) = 6 → saves 1
  3 mana spell × 10%: 3 * 0.9 = 2.7 → Math.round(2.7) = 3 → saves 0 ✗ (lost!)
  9 mana spell × 10%: 9 * 0.9 = 8.1 → Math.round(8.1) = 8 → saves 1
  
  Average: (1 + 1 + 0 + 1) / 4 = 0.75 mana/cast (should be 1.0)
```

### After (Fractional Bank)
```
5 mana spell × 10% reduction:
  Cast 1: bank += 0.5, floor(0.5) = 0, cost = 5, bank = 0.5
  Cast 2: bank += 0.5, floor(1.0) = 1, cost = 4, bank = 0.0
  
All variations eventually hit the bank correctly:
  3 mana: saves 0.3 per cast, every 3+ casts saves
  7 mana: saves 0.7 per cast, every 2 casts saves 1
  9 mana: saves 0.9 per cast, every 2 casts saves 1
  
  Long-run average: Exactly 10% reduction for all costs
```

## Files Modified

- **js/magicSkills.js**:
  - `ensureMagicSkills()`: Added bank initialization and sanitization (lines 275-285)
  - `getSpecKeyForSpell()`: New helper to validate spell specialization (lines 335-341)
  - `getFinalManaCost()`: Replaced rounding with fractional bank logic (lines 343-378)

## Backward Compatibility

- **Old saves without bank**: Created on first `ensureMagicSkills()` call (automatic)
- **Corrupted bank values** (NaN, Infinity, negative): Reset to 0 during load
- **All existing spells**: Continue to work; no changes needed to spell definitions
- **Save file format**: Bank added as new field; no existing fields removed or renamed

## Optional: Debug Logging

Uncomment to trace mana bank behavior:
```javascript
const DEBUG_MANA = true;  // Line 372 in getFinalManaCost
```

Logs format:
```
[Mana] Fireball (destruction): base=20 → saving=2.00 (bank=0.30) → cost=18
```

## Future Enhancements

1. **UI Display**: Show current bank value per specialization in skill panel
2. **Persistence Logging**: Track cumulative savings per specialization
3. **Dynamic Reduction**: Allow scaling SPEC_MANA_REDUCTION_AT_CAP by difficulty
4. **Spell Efficiency Metric**: "Cost Efficiency" stat showing avg mana saved
