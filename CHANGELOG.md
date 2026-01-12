# Changelog - feat/skills Branch

## Overview
Major skill system overhaul including weapon skills, magic skills, combat mechanics, resist system, and UI improvements for 3-second tickrate gameplay.

---

## Core Systems

### Resist System
**Implementation**: Full 4-bucket resist system with binary/partial mechanics
- **4 Resist Types**: magic, elemental, contagion, physical
- **Binary Resists** (CC/debuffs): 0% or 100% effective (mesmerize, fear)
- **Partial Resists** (damage/DoTs): 10%-100% effectiveness scaling
- **Level Difference Modifier**: Piecewise function (-20 to +30) based on caster vs target level
- **Grace Tick for CC**: CC that lands successfully cannot break on the first tick (guaranteed 1 tick duration)
- **Per-Tick Break Checks**: CC checks for resist break each tick after grace period
- **DoT Resist**: Rolls once at application; multiplier stored and applied every tick
- **Raw Melee Bypass**: Auto-attacks never call resist checks
- **Tunable Constants**: All resist formulas parameterized in `js/defs.js` for balance
- **Files**: `js/resist.js`, `js/actions.js` (resist blocks), `js/combat.js` (integration)
- **Tests**: `test-resist.js` (449 tests, 100% pass rate)

**Resist Formula**:
- `resistScore = (targetResist - spellPen) + difficulty + levelMod`
- `chance = clamp((resistScore + 50) / 200, 5%, 95%)`
- Partial: `mult = clamp(1 - 0.75 * chance, 10%, 100%)`

**Grace Tick Mechanism**:
- CC buffs store `ccGraceTicksRemaining: 1` on application
- First tick: decrement grace counter, skip resist check
- Second tick onwards: perform per-tick resist roll, break if resisted
- Prevents "instant break" while preserving challenge

### Delay/Haste System
**Implementation**: Complete swing timer system with overflow mechanics
- Base weapon delay in tenths of seconds (14 = 1.4s)
- Haste as percentage reduction (100% haste = half delay)
- Swing ticks calculated: `Math.max(1, Math.round((baseDelay / 10 * 1000 / GAME_TICK_MS) / (1 + hastePct / 100)))`
- Overflow tracking for sub-tick precision and extra swing chances
- **Reference**: `DELAY_HASTE_SYSTEM.md`

### Weapon Skills
**Files**: `js/weaponSkills.js`, `js/combat.js`
- Per-weapon-type skill tracking (1H Piercing, Hand to Hand, etc.)
- Dynamic skill caps: 5 per level × class multiplier, hard cap 300
- Skill-up on swing attempt (hit or miss) with diminishing chance curve
- Trivial target gating prevents farming low-level enemies
- UI throttling: stats modal refreshes once per tick via `state.needsSkillsUiRefresh` flag

### Magic Skills (Model B Specializations)
**Files**: `js/magicSkills.js`, `js/actions.js`
- Six specializations: Destruction, Restoration, Control, Enhancement, Summoning, Utility
- Three skill types per specialization:
  - **School Mastery**: Cast reliability, resist reduction (skill-up on every successful cast)
  - **Specialization**: Mana efficiency (50% chance per cast)
  - **Channeling**: Cast resilience during damage (only if hit during cast)
- Fractional mana bank: accumulates partial savings per specialization, converts to whole mana
- Cast time system: 1+ tick cast times, interruptible on damage
- Skill-up rate normalized for 3s tickrate: `SKILL_UP_RATE_MULT = 0.5`

### Double Attack (Warrior)
**File**: `js/combat.js`
- Skill-based proc chance and skill-up on main-hand hit
- Separate weapon skill-up roll on double attack swing
- Skill cap: level-based progression
- UI refresh flag set on skill-up

### Meditate (Casters)
**File**: `js/combat.js`
- Out-of-combat mana regeneration bonus scaling with skill
- Skill-up on successful mana regen tick (OOC only)
- Skill cap: 5 per level starting at level 5, hard cap 252
- UI refresh flag set on skill-up

---

## Key Fixes & Improvements

### FIX 11: Magic Skills Display Scalability
- Changed hardcoded class check to dynamic `hero.maxMana > 0` check
- Automatic display scaling for any mana-using class

### FIX 12: Defense-in-Depth Verification
- Verified automatic self-repair in `ensureMagicSkills()`
- Sanitizes corrupted values (NaN, Infinity, negative) on load

### FIX 13: Centralized Target Level Logic
- New helper: `getTargetLevelForSkillUps(hero, spellDef, resolvedTargets)`
- Consistent gating across weapon skills, hostile spells, and friendly spells
- Hostile spells use enemy level; non-hostile use caster level

### FIX 14: Stats Modal Throttling
- Modal refresh throttled to once per tick via `state.needsSkillsUiRefresh` flag
- Set by all skill-up sources: weapon, magic, Double Attack, Meditate
- Prevents repeated DOM rebuilds during burst skill-ups
- `renderAll()` flushes refresh once per tick when modal open

### FIX 15: Skill-Up Rate Normalization
- Single multiplier `SKILL_UP_RATE_MULT = 0.5` in `js/defs.js`
- Applied exactly once per RNG roll in weapon and magic skill-up functions
- Normalizes progression pacing for 3-second tickrate

### FIX 17-21: Combat & Balance
- Variable initialization fixes (totalDamageThisTick TDZ error)
- Skill value sanitization on load (NaN/Infinity protection)
- Various combat mechanic refinements

### SANITY CHECK 22: Delay/Haste Audit
- Verified consistent delay/haste calculations across all weapon types
- Confirmed overflow mechanics working correctly

### SANITY CHECK 23: Fractional Mana Bank
- Per-specialization mana bank accumulates fractional savings
- `Math.floor()` conversion to whole mana prevents rounding loss
- Backward compatible with old saves

### SANITY CHECK 24: Skill-Up Rate Verification
- Confirmed `SKILL_UP_RATE_MULT` applied exactly once per skill-up attempt
- No double-application or missed applications
- Consistent across weapon skills, magic skills, Double Attack, Meditate

### SANITY CHECK 25: UI Refresh Audit
- Stats modal refresh throttled to once per tick across all skill-up paths
- Log granularity preserved (no batching) for balance/simulation work

---

## UI Improvements

### Stats Modal
- Dynamic skill column generation based on hero capabilities
- Weapon skills section with progress bars
- Magic skills section (Meditate, School Mastery, Specialization)
- Mana Savings display per specialization (0% at skill 1 → 25% at cap)
- Throttled refresh: once per tick when open, triggered by skill-up flag

### Progress Bars
- Visual skill progress with percentage display
- Color coding: cyan (weapon), yellow (Meditate), magenta (schools), green (specs), orange (utility)
- Skill value / cap display with percentage

---

## Testing & Documentation

### Test Files (Removed Pre-Merge)
- `test-sanity24.js` - skill-up rate verification
- `test-delay-haste.html` - swing timer harness
- `js/combat_head_backup.js` - backup file

### Test Files (Active)
- `test-resist.js` - resist system validation (449 tests, Node.js)

### Documentation Structure
- `README.md` - main project documentation
- `CHANGELOG.md` - this file, consolidated changes
- `DELAY_HASTE_SYSTEM.md` - technical reference for swing mechanics
- `RESIST_IMPLEMENTATION.md` - resist system specification and implementation notes

---

## Technical Notes

### Resist System Constants (js/defs.js)
- `RESIST_BASE = 50` - Base value for resist score calculation
- `RESIST_SCALE = 200` - Scale factor for chance conversion
- `RESIST_MIN_CHANCE = 0.05` - Minimum 5% resist chance
- `RESIST_MAX_CHANCE = 0.95` - Maximum 95% resist chance
- `RESIST_PARTIAL_STRENGTH = 0.75` - Multiplier for partial resist reduction
- `RESIST_PARTIAL_FLOOR = 0.10` - Minimum 10% effectiveness for partial resists

### Tickrate Configuration
- `GAME_TICK_MS = 3000` (3 seconds per tick)
- Render loop batches ticks then calls `renderAll()` once
- All timings (cooldowns, cast times, swing timers) are tick-based

### Class Multipliers
**Weapon Skills**:
- Pure melee (Warrior, Rogue, Monk): 1.0
- Hybrids (Ranger, Paladin, SK): 0.85
- Casters: 0.70

**Magic Skills**:
- Pure casters (Wizard, Enchanter, Magician, Necro): 1.10
- Priests (Cleric, Druid, Shaman): 1.05
- Hybrids: 0.80–0.90
- Pure melee: 0.70

### Hard Caps
- Weapon skills: 300
- Magic skills: 300
- Double Attack: level-dependent
- Meditate: 252

---

## Migration Notes

### Save Compatibility
All changes are backward compatible:
- Missing `magicSkills` entries auto-initialized
- Corrupted skill values sanitized on load
- Missing `specManaBank` entries created automatically
- Old weapon skill data migrated to new format

### Performance
- UI throttling reduces DOM operations during burst skill-ups
- Fractional bank eliminates repeated rounding calculations
- Single skill-up rate multiplier simplifies balance tuning

---

## Future Considerations

### Potential Enhancements
- Log batching for burst skill-up events (deferred until post-balance)
- Additional specializations or class-specific skills
- Dynamic trivial target gating curves per skill type
- Skill-based bonuses beyond mana efficiency

### Known Limitations
- Trivial target gating may feel punishing at low levels (currently level-3 gap for levels ≤10)
- Magic skill progression requires non-trivial enemies for hostile spells
- No skill decay or "rust" mechanics

---

## Contributors
MetalJacx + GitHub Copilot

**Branch**: feat/skills  
**Target**: main
