# Thin Ice — notes

Curling × minesweeper (Tatum's idea, 2026-09-26 stream). Top-down frozen lake at night; 7×11 grid of frosted squares; thin-spot density depends on the lake (12% on lake 1, +3% per lake, max 33%). No square is guaranteed safe (the button used to be, which made 65%-power spam trivial).

## rules as built
- Drag down anywhere and let go (slingshot): angle ±15°, power maps linearly to slide distance (pow 1 ≈ 16.5 squares; the house centre needs ≈ 65%). Jitter per throw: ±3% distance, ±0.008 rad angle.
- Where a stone stops, its square uncovers with the minesweeper number (8-neighbour count); zeros flood-fill. +1 point per square.
- Speed is safety: over a thin spot a stone sinks below SINK (0.9 sq/s), and between SINK and CREAK (1.7) the ice creaks and a crack is drawn (the "whisper" hint). Open water (a hole left by a sunk stone) sinks anything under CREAK.
- Hold (pointer/Space/S) to sweep: less friction (1.6 → 1.25, a full-length sweep slides ~28% farther) and half the curl. Curl button ↺/↑/↻ (C key): sideways pull that grows as the stone slows.
- Stones stay on the ice and can be knocked (equal-mass collisions, e=0.86); a knocked stone uncovers or sinks wherever it stops. Stopping before the red hog line = hogged; touching the sides or fully past the back line = out.
- Lakes (v1.5): lake N needs min(N, 6) stones resting in the rings after all 8 are thrown; pass → 'On to lake N+1' (highest reached saved in localStorage 'thinice.lake'), fail → retry. Live counter 'LAKE N · IN THE RINGS n / need' is drawn behind the back line; counting stones get a gold halo.
- Bot baselines (before the 3%/lake ramp): random throws score a median of ~60 at 12% density, ~40 at 20–24% (flood fills are luck, hence the rings goal). A 'house bot' (62–68% power, ±3° aim) passed lake 1 11/12, lake 3 8/12, lake 5 4/12.
- 8 stones per sheet; house scores 5/10/15/25 (rings/button, measured to the stone's edge). Uncovering every safe square: +50.
- End: dashed circles show where the thin ice was; end card docks at the bottom so the sheet stays visible.

## log
- v1.0 (2026-09-26): first version.
- v1.1: sweeping toned down (full sweep was +68% distance, now ~+28%), curl stronger (~0.9 square of drift on a house shot).
- v1.2: creak band narrowed (CREAK 2.1 → 1.7; open water still sinks under 2.1), last throw leaves a dotted trail while you aim the next, and a white tick on the power ring marks the last power.
- v1.3: keyboard flagging — F opens a gold square cursor, arrows move it, F/Enter/Space toggles a flag, Escape goes back to aiming; the status line reads out each square.
- v1.4: end-of-sheet reveal ripples up the lake row by row (with a creak) instead of popping in at once.
- v1.5: lakes with ring goals (see rules), no guaranteed-safe button, more throw variance.

## issues
- The creak hint may give away too much (a long slow approach cracks several squares). Watch chat; could make it probabilistic or narrower.

## todos
- Opponent stones (a rival AI team) for real curling takeouts.

- Stone trails / replay of the last throw.

## testing
- `window.__ti` exposes start/throwStone/aim/cells/sim(sec)/S() for headless probes.
