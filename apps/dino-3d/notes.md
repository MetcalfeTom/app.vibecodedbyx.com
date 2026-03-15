# Dino Run 3D

The classic dino runner in 3D. Jump over cacti and duck under pterodactyls on an endless desert highway.

## log
- 2026-03-15: Initial build. 3D Chrome dino game with Three.js. Box-geometry T-Rex with animated legs, eye, tail. 3 cactus variants (small, tall with arms, double cluster) and pterodactyls (low/high altitude, flapping wings). Jump with Space/Up/tap, duck with Down/double-tap. Fast-fall when ducking in air. Speed ramps continuously. Collision detection with per-obstacle hitboxes, ducking shrinks player hitbox. Score counter with 100-point milestone flash + sound. High score in localStorage. Clouds drifting in background, dashed ground lines. Shadows enabled. Web Audio: jump boop, score ping, death sweep. Press Start 2P + Share Tech Mono typography, monochrome palette matching original Chrome dino aesthetic. Mobile: tap to jump, double-tap to duck.
- 2026-03-15: Updated dino to colorful green scheme — distinct materials for body (green), head (lighter green), jaw (dark green), tail (mid green), legs (forest green) for a lively look.

## issues
- importmap + ES module gives expected "new Function" validation errors (works in browser)

## todos
- Night mode that toggles periodically
- Particle effects on landing/death
- More obstacle variety (rocks, logs)
- Power-ups (magnet, slow-mo, double jump)
- Leaderboard via Supabase

## notes
- No database — localStorage for high score
- Three.js 0.163.0 via CDN importmap
- Speed: 0.15 + frame * 0.00003 (endless ramp)
- Jump: vy = 0.28, gravity = 0.012/frame
- Duck: scale.y = 0.5, reduces hitbox from 2.8 to 1.2 height
- Fast fall: extra -0.025 vy when ducking in air
- Spawn timer: 40 + random*30 - min(speed*30, 15)
- Pterodactyl appears after speed > 0.25, at height 1.5 or 3.5
- Collision: AABB with per-type hitW/hitH
- Milestone flash: background toggles dark for 100ms every 100 points
