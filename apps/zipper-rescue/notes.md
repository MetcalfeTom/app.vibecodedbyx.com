# Zipper Rescue — gentle stuck-zipper puzzle

## log
- 2026-08-18: v1.0 per chat ("tiny zipper-rescue puzzle, gentle mechanics, accessible controls"). Single file, Gaegu + Space Mono, denim/brass/stitch palette.
  - **The real-life mechanic**: force never wins. Zipping into a snag bounces gently (position holds, zero damage, teaching message + forced-push counter — "zero is zen"); the winning move is always ease down → give the snag its slack (2–3 rows below) → tap it free → zip on. 6 levels (loose thread → leaf → shy 3-slack thread → adjacent pair → low+awkward → the big coat, 12 snags total), auto-advance, progress persisted, zero fail states by copy AND by code.
  - **Accessibility-first structure**: DOM zipper (no canvas hit-targets) — CSS-art brass teeth (offset repeating gradients), snags are real 44px buttons whose aria-labels narrate the slack math live ("Needs the slider at least 2 rows below. Currently 1 below."), ⬆/⬇ buttons + arrow keys, aria-live status, focus-visible stitching outlines, reduced-motion kill.
  - Gentle audio: sine-only ticks/frees/win arpeggio, peak 0.05, mute = zero nodes (stub-audited).
  - Suite zr-probe 15/15 incl. an auto-solver that completes ALL 6 levels by legal gentle play.
  - Probe lessons (2): the no-fail copy check matched "failure" inside the game's own "no timers, no failure" promise — negation-strip before auditing (again); a11y label read after the solver left everything freed — reset state before reading.
  - Write-corruption caught pre-probe: a stray '�putation' inside an emoji literal.

## issues
- Emoji tofu in headless shots only.

## todos
- A "buttery smooth" bonus star for zero-forced clears across all levels
- Tiny jacket color variants per level
