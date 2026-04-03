# Glitch Pinball

## log
- 2026-04-02: Complete rebuild from scratch — clean wall geometry (half-ellipse dome 18 segments, straight left/right walls, angled deflector, center drain gutters), substep physics (up to 8 substeps for tunneling prevention), robust ball-line and ball-circle collision with proper normal calculation and restitution, exponential flipper kick (pow 1.6). All features preserved: 8 bumpers, space-time bumper with vortex/ripple/warped grid, 3 drop targets, 2 slingshots, spinner, 7 glitch types, score popups, ball trail, launcher. Launcher channel 65px wide (510-575), ball starts at x=542. Previous version had accumulated wall/physics bugs from iterations.
- 2026-04-02: Initial build — neon pinball machine with physics-based glitch mechanics. Canvas-based, single-file, Fira Code typography, cyan/magenta/yellow neon aesthetic on dark circuit-board background.

## features
- Full pinball table: two flippers, ball launcher, 8 bumpers, 3 drop targets, 2 slingshots, spinner gate, 2 ramp lanes
- 7 glitch types: Gravity Flip, Multi-Ball, Slow-Mo, Teleport, Mega Ball, Zero Friction, Invert Controls
- Glitches activate every 10-15 seconds, last 3-5 seconds with visual effects (scanlines, pixel blocks, RGB split, screen shake)
- Scoring: bumpers 100, slingshots 50, drop targets 200 (1000 clear bonus), spinner 25/rotation, ramps 500, glitch survival 300
- 3 balls per game, start/game-over screens with glitchy text animation
- Keyboard (arrows/A/D for flippers, space for launch) and touch controls (left/right halves, right edge for launcher)
- Score popups float from hit locations
- Ball trail effect, bumper flash/expand on hit

## issues
- Physics is simplified (no angular momentum on ball, basic line/circle collision)
- Ramp lanes are simplified guide walls rather than true curved ramps
- No persistent leaderboard yet (could add Supabase integration)
- Touch input zones may need tuning on very wide screens

## todos
- Add Supabase leaderboard for high scores
- Add OG image (og-image.png) for social sharing
- Consider sound effects (WebAudio beeps/boops on hits)
- Add combo system (rapid bumper hits = multiplier)
- Could add more glitch types (Mirror Mode, Invisible Ball, etc.)
