# Duck Pinball — neon rubber-duck table

## log
- 2026-08-19: v1.0 — built per chat. 420×640 canvas table, real segment physics: 17 wall segments (outer shell w/ angled top, launch lane + deflector, bottom funnels, 2 slingshot triangles), closest-point-on-segment collision w/ push-out + restitution, 3-substep integration, speed cap 1100. Three duck bumpers (procedural glowing ducks: body/head/beak/eye + ring, flash decay on hit) — +100, 260-impulse repel, pitch-stepped square-wave quack. Flippers: pivot+len capsule segments, angle chases target at ω=22rad/s, SURFACE VELOCITY added at contact (ω×r) so an active flip genuinely launches the ball. 3 balls, drain → next ball / game over overlay, R/button reset, best score in localStorage. Keyboard ←/→/Space/R/M + coarse-pointer touch pads (FLIP/LAUNCH/FLIP). ZERO external assets (probe-greps: no external src/href; data-URI favicon; system mono stack; synth audio). Probes 12/12: 10 physics/flow checks + REAL-LAUNCH trajectory sweep (12/12 launches escape the lane, 12/12 reach the upper playfield — the moth-pinball lesson: never trust teleported balls). Screenshot reviewed.

## issues
- none yet. If "ball gets stuck" reports come in: check the slingshot triangle inner corners first (acute angles are classic trap spots) — trace with real trajectories, not teleports.

## todos
- multiball at 2000 pts? lane rollover bonus? if chat asks.
