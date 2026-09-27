# Springfield Road Rush (simpsons-road-rage) — notes

## log
- 2026-09-26 — polish pass (one of the most-voted apps):
  - **visual bugs fixed**: `material.clone()` shares its map, so the shared `repeat` squashed the north-south road's lane dashes into stripes and gave every building the last building's window size → `texMat(base, rx, ry, rot)` clones the texture per surface (vertical road = rotation π/2). Sidewalks were 400-long strips running *across* the other road → split into 4 segments per road that stop at the crossing. Shadow acne (no bias) hatched the ground; three r167 uses physical light units, so the old 0.9 intensities left the town grey → hemi 2.1, sun 2.6, bias -0.0004 / normalBias 0.04. Skid marks disposed the *shared* skid texture every time one faded — removed.
  - **UI**: the two big always-on panels (instructions + leaderboard) are gone. HUD = three cartoon chips (shift / donuts / speed; timer pulses red under 10 s), messages are a fading toast. Start card (Luckiest Guy + Fredoka) holds the controls + leaderboard; the **clock no longer runs before you press Start shift**. Shift-over card: result, save form (once per shift, name remembered in localStorage), **Drive again** (used to need a reload). Camera auto-orbits the car behind the card.
  - **donuts**: were a flat disc texture on a torus (looked like burnt pucks) → dough torus + pink sprinkle frosting on both faces, upright, spinning and bobbing. Collected donuts are removed properly (`group.remove`) instead of reassigning `children`.
  - leaderboard: only scores 1..30 (there are 30 donuts), best per user_id, top 8. Real table was clean (max 27) at the time.
  - new og-image.png (start card over the town), title/description no longer talk about Three.js.

  - **sound** (WebAudio, no files): engine = saw + sub-octave square through a lowpass that follow speed (turbo opens the filter), donut chomp that climbs in pitch with your combo, bus honk + thud (1.2 s cooldown — the overlap check fires every frame), descending jingle at shift end. 🔊 chip / M key mutes, remembered.
- 2026-09-27 — glow-up (bug fixes, controls feel):
  - **phone drifting was broken**: the steering pad read `event.touches[0]`, so if brake/turbo was pressed first (brake + turn = drift) it tracked that thumb and steering went dead → uses `changedTouches` on start / `targetTouches` on move, plus `touchcancel`. Brake button now sets `KeyS` instead of `ArrowDown`, so letting go of the pad no longer releases a held brake.
  - **touch feel**: pad knob follows your thumb (±32 px, `--kx/--ky`, springs back), pad + pressed buttons turn yellow and sink (`.on` / `.held`).
  - **Space (turbo) pressed focused buttons**: after clicking 🔊 every turbo press toggled mute; holding/mashing turbo as the clock hit 0 could click the focused "Drive again" (key-repeat) and skip the results. keydown now preventDefaults Space/Enter while driving, for 0.8 s after the shift ends, and on any key-repeat (also stops held Space filling the name box). Space on Start/Drive again still works for keyboard users.
  - tested headless: synthetic two-finger TouchEvents (brake first, then pad drag) + keydown `defaultPrevented` checks with a 0.4 s shift in the test copy only.

## issues
- `populateDonuts()` runs at top level before later `const`s exist → the donut kit is a lazily built `var`. Keep new top-level consts above their first use.
- No building collisions — you can drive through everything (and donuts spawn inside buildings).
- The car turns on the spot at speed 0 (turn isn't scaled by speed). Arcade-y, left as is.
- `animate()` clamps delta to 0.033, so below 30 fps the shift clock and the car run in slow motion.
- Headless probe: scratch `gaunt/mkrr.sh` swaps the supabase import for a local stub (`sbstub.js`) so tests never write to the real table.

## todos
- building collisions or keep donuts on/near roads
- more Springfield landmarks (Kwik-E-Mart, the plant with glowing rods)
