# Bass Rattler

Neon pinball with vibrating paddles and toxic sludge pits. Don't sink.

## log
- 2026-03-16: Initial build. 320x520 canvas pinball table. 6 neon bumpers (pink, blue, yellow, orange, purple, green) with inner rings, glow flash on hit, point labels. 2 toxic sludge pits on left and right gutters — animated wave surface with sine wobble, green neon glow, rising bubbles, "TOXIC" label. Ball slows in sludge, drains if velocity drops below 1.5. 2 flippers (Z/left, M/right) with vibration effect on activation — visual shake offset via sine wave. 3 rollover targets at top that light up; all 3 lit = multiplier +1 (max x5), then reset. Launch lane with hold-SPACE power meter (gradient green→yellow). Angled gutter walls, guide rails. 3 physics substeps per frame, line-circle collision for walls/flippers. Ball speed cap 14. 3 balls, score penalty on drain, multiplier resets. Grid background. 7 Web Audio SFX: flip thwack, bumper ping, sludge drone, launch sweep, target chime, drain descending. Screen shake on bumper hits. Particle explosions on bumper/target/drain. Bungee Shade + Chakra Petch typography, toxic green neon on deep dark.

## issues
- None yet

## todos
- Multiball powerup (hit all targets twice)
- Spinner obstacle in center
- Snake ramp (ball travels curved path for bonus)
- High score localStorage

## notes
- No database — pure frontend
- Table: 320x520, walls at x=20/300, launch lane x=280-300
- Bumpers: 6 circular, radius 12-22, kick=6 units, glow decays *0.92
- Sludge pits: 2 at y=420, wave surface via sin(frame*0.05+i*0.15), bubbles 6%/frame
- Sludge effect: vx/vy *= 0.8 per frame, drain when speed < 1.5
- Flippers: 50px length, 8px wide, angle lerps at 0.25 rate, vibe=6 frames on press
- Vibration: sin(vibePhase*8) * vibe * 0.5 pixel y-offset
- Collision: line-circle test for walls/flippers, distance test for bumpers
- Targets: 3 at top, all lit = multiplier+1 (max 5) then reset
- Launch: hold space charges 0-100 at +2/frame, release fires vy = -power*0.15 - 5
- Physics: 3 substeps, gravity 0.18, speed cap 14
