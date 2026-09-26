# Thin Ice — notes

Curling × minesweeper (Tatum's idea, 2026-09-26 stream). Top-down frozen lake at night; 7×11 grid of frosted squares, ~15% thin spots (the button square is always solid).

## rules as built
- Drag down anywhere and let go (slingshot): angle ±15°, power maps linearly to slide distance (pow 1 ≈ 16.5 squares; the house centre needs ≈ 65%). ±1.5% random jitter per throw.
- Where a stone stops, its square uncovers with the minesweeper number (8-neighbour count); zeros flood-fill. +1 point per square.
- Speed is safety: over a thin spot a stone sinks below SINK (0.9 sq/s), and between SINK and CREAK (1.7) the ice creaks and a crack is drawn (the "whisper" hint). Open water (a hole left by a sunk stone) sinks anything under CREAK.
- Hold (pointer/Space/S) to sweep: less friction (1.6 → 1.25, a full-length sweep slides ~28% farther) and half the curl. Curl button ↺/↑/↻ (C key): sideways pull that grows as the stone slows.
- Stones stay on the ice and can be knocked (equal-mass collisions, e=0.86); a knocked stone uncovers or sinks wherever it stops. Stopping before the red hog line = hogged; touching the sides or fully past the back line = out.
- 8 stones per sheet; house scores 5/10/15/25 (rings/button, measured to the stone's edge). Uncovering every safe square: +50.
- End: dashed circles show where the thin ice was; end card docks at the bottom so the sheet stays visible.

## log
- v1.0 (2026-09-26): first version.
- v1.1: sweeping toned down (full sweep was +68% distance, now ~+28%), curl stronger (~0.9 square of drift on a house shot).
- v1.2: creak band narrowed (CREAK 2.1 → 1.7; open water still sinks under 2.1), last throw leaves a dotted trail while you aim the next, and a white tick on the power ring marks the last power.
- v1.3: keyboard flagging — F opens a gold square cursor, arrows move it, F/Enter/Space toggles a flag, Escape goes back to aiming; the status line reads out each square.
- v1.4: end-of-sheet reveal ripples up the lake row by row (with a creak) instead of popping in at once.

## issues
- The creak hint may give away too much (a long slow approach cracks several squares). Watch chat; could make it probabilistic or narrower.

## todos
- Multiple ends / difficulty ramp; opponent stones (a rival AI team) for real curling takeouts.

- Stone trails / replay of the last throw.

## testing
- `window.__ti` exposes start/throwStone/aim/cells/sim(sec)/S() for headless probes.
