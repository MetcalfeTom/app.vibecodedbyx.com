# The Mantel Clock — an antique clockwork repair puzzle

## log
- 2026-08-19: v1.0 — built per chat. 3 clocks (parlor 3-peg / stair 4-peg / mantel 5-peg BRANCHING train), gear tray with decoys. THE MECHANIC: two gears mesh iff r1+r2 == peg distance ±2 ("no forcing, this is antique brass") — mesh lines draw live, seating narrates which pegs "teeth kiss teeth". Train = BFS connectivity mainspring→escapement over meshing pairs. WIND: refused on broken trains ("teaches the spring bad habits"), +10%/press, lifting any gear resets spring (safety); RELEASE at 100% → gears spin (SVG animation, reduced-motion still), 6 tick-tock beats, next clock. All 3 → "gentle disagreement" finale. Levels PROVEN solvable by construction (build-time chain arithmetic) AND solved live in the probe. Local-only progress. A11y: gear/peg buttons with rich labels (size, in-hand, mainspring/escapement roles, lift-vs-seat), board aria-label tracks train state, status aria-live. Zero external assets. Probe 16/16 (mesh math, decoy rejection, wind-gate, spring-reset-on-lift, full 3-clock playthrough).

## issues
- none.

## todos
- a 4th clock with a ratio requirement (escapement must spin faster: teeth ratios), if the bench draws a crowd.
