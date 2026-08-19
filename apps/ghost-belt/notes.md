# Ghost Belt — a haunted asteroid racer

## log
- 2026-08-19: v1.0 — built per chat. 640×460 single-screen elliptical circuit, 4 numbered gates (next one glows, chime pitch rises), 3 laps. CALM OPENING LAP by design: asteroids at 35% speed, ghosts fully dormant (probe: bright ghost ON the ship deals zero on lap 1); lap 2 announcement "the belt wakes", ghosts drift toward player at 26u/s and bite ONLY while bright (sine phase >0.55 — telegraphed tangibility), lap 3 "hold your line". SHIELD 100 (asteroid −20 + knockback, ghost −12, regen 1.6/s, 1s iframe w/ blink); zero shield = respawn at last gate, +5s penalty, meters restored (no death, prototype-gentle). FUEL 100 (thrust −9/s; DRIFT TRICKLES +3.5/s — no softlock by construction). Meters = DOM bars, .low state flips red; accessible warnings once per episode (⚠ shield low / ⚠ fuel low with the recovery hint), status aria-live polite, canvas aria-label teaches controls incl. "lap one is calm". Finish = time+penalties, best in localStorage. Arrows+R+M, coarse-pointer pads. Synth: gate chimes, saw crunch, ghost wail, finish arpeggio; mute. Zero external assets. Probe 12/12 (thrust/burn, drift-refuel, steer, lap1-dormant, gate sequencing, lap2-bite, asteroid+iframe, respawn+penalty, 3-lap finish, best persist, low-fuel warn, a11y). Screenshot reviewed.

## issues
- none yet. If "ball- er, ship stuck" reports: check gate radius 34 vs speeds first.

## todos
- ghost personalities (one hunts, one guards a gate), time-trial mode, if chat wants more.
