# cozy-box (Cozy Box — a puzzle that shuffles itself)

## log
- 2026-08-14: v1 per chat ("cozy self-rearranging puzzle box: warm lamplight, tactile clickable tiles, gentle animations, reset and solve feedback, no external assets"). Single file, Grandstander + Andika, dark room + one warm lamp cone.
  - **The scene**: a cottage-at-dusk painting drawn ONCE on an offscreen canvas (gradient sky, stars, cratered moon w/ halo, two hill layers, cottage + chimney smoke curl, THE LIT WINDOW with a cat on the sill, door with brass knob, grass ticks) and split into 8 sliding tiles + gap (3×3).
  - **Self-rearranging**: on arrival (and on "shuffle again") the box performs ~24 VISIBLE valid moves itself, 130ms apart, narrated ("it does this. let it.") — always solvable by construction, no-backtrack picks.
  - **Tactile tiles**: real <button>s with per-tile canvas crops; adjacent click glides (cubic-bezier settle) with a soft synthesized tick; non-adjacent click wiggles apologetically; keyboard arrows slide tiles into the gap; aria-labels carry row/col + "press to slide".
  - **Solve feedback**: only counts if YOU did it (post-shuffle flag): lamp flares (solved-glow), tiles glow, drifting dust motes, four-note chord, "the cat pretends not to care". Reset = instant solved with a no-judgement line and no celebration (honesty).
  - **Lamp chain**: pull to dim/brighten the whole room (aria-pressed).
  - **No external assets**: asserted — zero img/audio/fetch; all art canvas, all sound synthesized.
  - Verified 17/17 (self-shuffle on arrival + narration + scrambled + your-turn, 8 button-tiles w/ painted warm-window pixels, wiggle vs slide + move counter, keyboard, reset restores w/o celebration, player-solve celebrates w/ motes, lamp dims, reshuffle, labels/live-region/reduced-motion) + geometry probe + screenshot.
  - **SCREENSHOT-CAUGHT BUG (the recurring lesson, now in its strongest form)**: the 17/17 functional suite passed while tiles rendered scattered OUTSIDE the box — `position:absolute` without explicit `left/top` leaves each button at its inline STATIC position, and transforms stack on top of it. Numeric containment probe confirmed 154px overflow at rest; `left:0; top:0` fixed it; containment now worst=0. RULE: any transform-positioned absolute element gets an explicit anchor, and layout claims get a bounding-rect probe, because functional probes are blind to geometry.

## issues
- 3×3 with a fixed scene; a 4×4 "harder evening" mode is the obvious ask.
- Slide tick creates an AudioContext on first move without a toggle — it is very quiet by design; add a hush toggle if anyone minds.

## todos
- 4×4 mode ("longer evening").
- Seasonal scenes (snowfall in december — the cat gets a scarf).
- Peek button: hold to ghost the solved picture at 20% (cozy hint, not cheat).
