# Delay & Haste System Documentation

## Overview
The delay & haste system converts EQ-style weapon delays into a tick-based auto-attack system. Game ticks are 3 seconds. One tick = minimum swing rate.

## Key Formulas

### Swing Ticks Calculation
```javascript
effectiveDelayTenths = baseDelayTenths / (1 + totalHastePct)
swingTicks = max(1, ceil(effectiveDelayTenths / 30))
```

### Overflow Bonuses (when swingTicks == 1)
```javascript
overflowPct = max(0, (30 - effectiveDelayTenths) / 30)
extraSwingChance = clamp(overflowPct, 0, 0.50)
overflow2 = max(0, overflowPct - 0.50)
autoDmgMult = 1 + min(overflow2 * 0.20, 0.10)  // cap at +10%
procMult = 1 + min(overflow2 * 0.40, 0.20)     // cap at +20%
```

### Haste Clamping
```javascript
totalHastePct = clamp(totalHastePct, -0.75, +3.00)
```
- Minimum slow: -75% (4x slower swing)
- Maximum haste: +300% (4x faster swing)

## Weapon Delay Values

### Weapons in items.js
- **Fast (delay 15)**: Rusty Dagger → 1 tick
- **Medium (delay 28-30)**: Enchanted Branch, swords, sticks → 1 tick
- **Slower (delay 40)**: Maces → 2 ticks

### Mob Natural Delays (mobs.js)
- **Small beasts**: 26-28
- **Humanoids/Undead**: 28-30
- **Medium creatures**: 32-35
- **Large creatures**: 40-50
- **Bosses/Bruisers**: 50-60

## Combat Flow

### Hero Auto-Attacks
1. Each tick, decrement `hero.swingCd` by 1
2. When `swingCd === 0`:
   - Call `performAutoAttack(hero, mainEnemy)`
   - Recompute `swingTicks` (in case weapon swapped)
   - Reset `swingCd = swingTicks`
   - Roll for extra swing chance (overflow)
3. Overflow swing triggers if `Math.random() < extraSwingChance`

### Enemy Auto-Attacks
1. Each tick, decrement `enemy.swingCd` by 1
2. When `swingCd === 0`:
   - Check for mesmerize/fear (skip if active)
   - Call `performEnemyAutoAttack(enemy, livingMembers)`
   - Reset `swingCd = enemy.swingTicks`

## Examples

### Example 1: Fast Dagger (delay 15) with +30% Haste
```
baseDelayTenths = 15
hastePct = +0.30
effectiveDelayTenths = 15 / 1.30 ≈ 11.54
swingTicks = ceil(11.54 / 30) = ceil(0.38) = max(1, 1) = 1

overflowPct = (30 - 11.54) / 30 ≈ 0.615
extraSwingChance = clamp(0.615, 0, 0.50) = 0.50
overflow2 = 0.615 - 0.50 = 0.115
autoDmgMult = 1 + min(0.115 * 0.20, 0.10) = 1 + 0.0115 = 1.0115 (+1.15% damage)
procMult = 1 + min(0.115 * 0.40, 0.20) = 1 + 0.046 = 1.046 (+4.6% proc chance)

Result: Attack every tick (1 tick), 50% chance for extra swing
```

### Example 2: Mace (delay 40) with +50% Haste
```
baseDelayTenths = 40
hastePct = +0.50
effectiveDelayTenths = 40 / 1.50 ≈ 26.67
swingTicks = ceil(26.67 / 30) = ceil(0.889) = max(1, 1) = 1

overflowPct = (30 - 26.67) / 30 ≈ 0.111
extraSwingChance = 0.111 (no overflow2)
autoDmgMult = 1.0
procMult = 1.0

Result: Attack every tick (vs 2 ticks without haste), 11% chance for extra swing
```

### Example 3: Mace (delay 40) without Haste
```
baseDelayTenths = 40
hastePct = 0
effectiveDelayTenths = 40
swingTicks = ceil(40 / 30) = ceil(1.33) = max(1, 2) = 2

Result: Attack every 2 ticks (6 seconds between swings)
```

### Example 4: Mace (delay 40) with -50% Slow (debuff)
```
baseDelayTenths = 40
hastePct = -0.50 (clamped to -0.50)
effectiveDelayTenths = 40 / (1 - 0.50) = 40 / 0.50 = 80
swingTicks = ceil(80 / 30) = ceil(2.67) = max(1, 3) = 3

Result: Attack every 3 ticks (9 seconds between swings)
```

## Implementation Details

### Initialization
- Heroes: `initializeSwingTimer(hero)` called in `createHero()`
- Enemies: `initializeSwingTimer(enemy)` called in `spawnEnemy()` and `spawnEnemyToList()`
- `swingCd` starts at random(0 to swingTicks) to stagger attacks

### Equipment Changes
When a hero swaps weapons mid-combat:
1. Recompute `baseDelayTenths` from new weapon
2. Recompute `swingTicks`
3. Carry progress proportionally: `progress = 1 - (swingCdOld / swingTicksOld)`
4. `swingCdNew = round((1 - progress) * swingTicksNew)`

### Buff/Debuff Changes
- `getTotalHastePct()` checks hero's equipment, active buffs, and debuffs
- When haste changes, swing timing updates on next auto-attack
- No retroactive reset (fairness to players)

## Balance Notes

- **Slow weapons benefit most**: Mace at 2 ticks can reach 1 tick with moderate haste
- **Fast weapons gain overflow**: Dagger always at 1 tick, overflow gives 11-50% extra swings
- **Haste scaling**: Each +100% haste roughly cuts swing time in half (until floor)
- **No infinite stacking**: Hard capped at +300% and -75%
- **Overflow is fair**: Extra swings only available while at 1-tick floor, capped at 50% chance

## Testing Checklist

- [ ] Heroes auto-attack with correct swing rate
- [ ] Enemies auto-attack with correct swing rate
- [ ] Weapon swaps update swing timing correctly
- [ ] Haste buffs reduce swing time
- [ ] Slow debuffs increase swing time
- [ ] Overflow extra swings trigger at ~50% on fast weapons
- [ ] Double Attack proc works with new timer system
- [ ] Mesmerize/Fear block attacks correctly
- [ ] Combat ends when enemies killed or party wiped
