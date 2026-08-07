# stackomancer (Stackomancer)

## log
- 2026-08-07: v1 per chat ("RPN game — wizard theme, stack-based spells, snappy"). Single-file, no deps, all-original.
  - **Concept**: your spellbook IS an RPN stack. Beasts drift toward your ward circle bearing numeric sigils; you push number runes, fuse them with operators (true RPN: `7 2 −` = 5, a=second-from-top), and CAST hurls the TOP of stack — exact sigil match banishes, anything else glances off and resets your combo (the rune is consumed either way).
  - **Pure block** (`rpnOp`/`rpnPush`/`waveConfig`/`genSigil`) — 418 node checks: operand order, clean-division-only (`7 2 ÷` fizzles, ÷0 fizzles), dup/swap/drop, underflow guards, failed-op-leaves-stack-intact, 8-rune stack cap, overflow guard, wave escalation monotonicity, sigil ranges across 8 waves.
  - **Calculator-authentic input** (the snappy core): digits forge a pending rune (dashed teal stone), ⏎ pushes, pressing an operator AUTO-PUSHES the pending rune first (as the old HP calculators did), Backspace edits, Space/C casts, D/S/X = dup/swap/drop. Full rune button grid for touch with kbd hints and wave-gate locks ("wave 3" labels under sleeping runes).
  - **Waves**: ranges/speed/spawn-gap escalate; DUP unlocks w3, ÷ w4, SWAP w5; multiple beasts queue (cast auto-targets the front one). 3 wards; a beast reaching the circle shatters one and resets combo. Score 10×(combo+1) per banish +5 "clean cast" elegance bonus when ≤1 rune remains; best persisted.
  - **Juice**: arced bolt carrying its number, 16-particle banish bursts, screen shake, fizzle red-wash + 0.5s lock on invalid ops with in-world error copy ("unclean division fizzles", "the stack groans — eight runes at most"), beast tiers (blob/horned/red by sigil size) with wobble + blink, wizard with a staff orb that displays the armed value, dashed ward circle that dims per ward lost. Full synth SFX (push/op/cast/banish-arpeggio-scaling-with-combo/miss/fizzle/ward-crack/wave-horn/game-over) + mute.
  - **A11y**: canvas role=application, sr-only live region narrates banishes/fizzles/wards/waves, aria-labels on all runes, focus-visible, ≥2.75rem targets, reduced-motion.
  - **Aesthetic**: midnight arcana — #0b0a14, violet/teal/gold, Uncial Antiqua (first use) + Azeret Mono (first use), glowing stack stones with an ARMED marker.
  - Verified: 418 pure checks + real-Chromium gameplay probe (forge 17 via 3 4 × 5 +, dup gate holds at w1, banish confirmed with score+combo, miss resets, ward shatters) — 0 errors.

## issues
- Sigil generation doesn't guarantee "elegant" solutions exist beyond addition (they always exist trivially by summing digits — by design; multiplication is the optimization game, not a requirement).
- Casting consumes the top rune even on a miss — intentional risk economics; chat may debate it.

## todos
- Supabase leaderboard (score + deepest wave).
- "Prime beasts" that resist even sigils; "hex beasts" requiring negative numbers.
- A meditation mode: no beasts, just a target and par-push-count golf scoring.
- Daily sigil seed shared by all players.
