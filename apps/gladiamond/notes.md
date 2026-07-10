# gladiamond · notes

## log
- 2026-07-10: v1 (chat ask: isometric canvas arena, one playable hero, WASD, single melee attack, diamond tile projection from the start). **Projection**: classic diamond iso — `isoX=(x−y)·32`, `isoY=(x+y)·16`, TILE 64×32, 13×13 grid, walls extruded 26px. **WASD is screen-relative**: input vector rotated into world axes via `wx=(sx+sy)/√2, wy=(sy−sx)/√2` so W always moves up-screen (verified in sim: both world coords decrease). **Depth**: painter's algorithm — back walls (x=0,y=0 rows) → floor → entities sorted by (x+y) (pillars/slimes/hero/particles/slash) → front walls (x=N−1,y=N−1) drawn last so they correctly overlap entities. **Melee**: 0.3s swing lockout, range 1.35 world-units, ~105° frontal arc (`dot ≥ 0.25` vs facing), 2-hit slime kills, 2.6u knockback, teal slash arc ellipse + hit-flash + gold screen-shake. **Loop**: slime waves (2+wave spawns, speed scales +0.05/wave), 5 hearts, 1s i-frames w/ sprite flicker, contact knockback, game over overlay w/ localStorage best. 4 corner pillars w/ radial push collision; bounds clamp MIN/MAX 1.55. **Everything is drawn code** (no sprites): hero = bobbing tunic/helm/animated legs/sword that sweeps −1.3→+1.3 rad through the swing; slimes squash-bob w/ eyes + mini HP bar; particles have fake z w/ gravity+bounce. WebAudio synth (swing noise burst/hit/kill arp/hurt/wave chime/death) behind start-button gesture, M mute. Touch: joystick (identifier-tracked) + ⚔ button on coarse pointers; desktop can also click-to-strike. Jacquard 12 + Space Mono, indigo pit w/ teal rim + gold hero. Pollinations OG (flux seed 7741). **Tested headless** (node + Proxy ctx stub, house pattern): boot, screen-relative movement, strike-spam kill vs approaching slime, contact damage exactly −1 w/ i-frames, park-until-game-over, restart. Hook `__arena {state, start, step(n,dt), key(k,down), strike, spawn(x,y), iso}`.

## issues
- Sim test gotcha: a single scripted strike→walk→strike sequence misses because knockback moves the slime — test by spamming strike while the slime chases (arena_test2 pattern).
- `isoAngle(v)` maps a world dir to screen angle for sword/slash drawing — if art looks wrong after changes, suspect this first.

## todos
- Hero attack combo (2nd swing on quick re-press) if chat wants more depth.
- Slime variants (fast red / tanky blue) per wave.
- Gamepad support.
