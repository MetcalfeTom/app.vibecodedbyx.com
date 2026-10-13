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
- 2026-10-13 14:14 UTC — **v2.1 driving feel** (fela asked chat-side for improvements; helper session):
  - **houses are solid**: `solids` = boxes {x0,x1,z0,z1} (every building, plus 4 edge walls at ±197) and circles {cx,cz,r} (cooling towers). The car is two circles (r 1.45, ±1.1 along the heading). `collideCar` pushes out up to 3 passes, removes the into-wall velocity (bounce ×1.25 above 6 u/s) and takes the same amount off `car.speed` along the nose, so head-on stops and glancing hits slide. Moves are sliced to ≤0.45 units (no nose past corners into narrow gaps); if the car is still >0.15 inside something after a step (turning in a gap shorter than the car), the step is undone (`carOverlap`). Thud + small camera shake + dust above 7 u/s, "Bonk!" toast above 30.
  - **steering needs rolling wheels**: turn rate × min(1, |speed|/9); reversing steers the other way. **S / ⭕ brakes, then backs up** (max 16) — needed now that walls exist. Brake is softer (18 vs 48 u/s²) while turning so drifts still slide.
  - **speed model is per-second** (old one effectively multiplied by dt twice and never slowed down when coasting): gas 26 u/s² easing to 60, turbo 38 to 74 (eases back after), coast drag 4 + 5 % of speed.
  - **frame-rate independent**: `frame(dt)` with dt = real time clamped to 1/8 s; physics sub-steps of ≤ 1/60 s. Shift clock is real time down to 8 fps (old clamp 0.033 = slow motion below 30 fps). Camera follow uses exp damping.
  - **donuts** spawn on the two roads (70 %) or the open lots |x| 17–44, ≥3.5 from any solid, ≥9 apart (`pickDonutSpot` / `freeSpot`); pickup measured on the ground (3 units).
  - card text: no show character names or catchphrases ("Homer…", "D'oh!" replaced). Small build stamp on the card (`#buildstamp`).
  - tested headless (scratch probe srrp1 via the stubbed test copy): no spin at 0, same drive at 10/20/60/144 fps, clock 3.000 s at 10/20/60 fps, head-on stop + reverse, glancing slide, 6 min random driving at random fps never deeper than 0.15 in a wall, donuts never in/against buildings, eat, end, save once; 0 JS errors at 1280×720 and 390×844.

## issues
- `populateDonuts()` runs at top level before later `const`s exist → the donut kit is a lazily built `var`. Keep new top-level consts above their first use.
- Building positions/sizes use Math.random (new town every load), so narrow car-width gaps between houses differ per load. Probes must not assume a layout.
- Buses still drive along z at x = ±30/±90/±150, i.e. through houses (planned for v2.2).
- Headless probe: scratch `gaunt/mkrr.sh` swaps the supabase import for a local stub (`sbstub.js`) so tests never write to the real table.

## todos
- v2.2: landmarks with generic names (Quick-Stop store, power plant with glowing green rods, school, donut shop), buses on the road lanes
- v2.3: phone pass at 390×844 (portrait camera/FOV, controls, HUD)
- never use show character names, likenesses, catchphrases or music
