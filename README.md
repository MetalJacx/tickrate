# tickrate

## Action Definitions (Canonical)
- All spells and abilities are defined in [js/actions.js](js/actions.js).
- The legacy [js/spells.js](js/spells.js) has been removed to avoid duplication.
- Spell metadata includes:
	- cast timing: `castTimeTicks` (1 tick = 3 seconds)
	- specialization: one of `destruction`, `restoration`, `control`, `enhancement`, `summoning`, `utility`
	- resource cost: `cost: { mana: number }` or `cost: { endurance: number }`
- Mana efficiency uses specialization via the magic skills system; final cost is computed by `getFinalManaCost(hero, spellDef)`.

## Casting & Magic Skills
- Casting flow is handled in [js/magicSkills.js](js/magicSkills.js) and integrated in [js/combat.js](js/combat.js).
- School mastery affects reliability (full/partial/resisted) of spell outcomes.
- Channeling mitigates interrupts when taking damage during cast time.

## Targeting
- Target selection for actions is managed by combat with `target` fields such as `enemy`, `xt_enemy`, `aoe_enemies`, `ally`, and `self`.

## Notes
- If adding new actions, prefer extending [js/actions.js](js/actions.js) with `castTimeTicks`, `specialization`, and `cost` for consistency.