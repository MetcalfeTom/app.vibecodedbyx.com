# neon-pong-blitz

## log
- 2026-05-01: Created. **High-speed neon Pong with glowing comet trails and particle explosions on every hit.** Single-file vanilla JS canvas. **Modes**: vs AI (default — left paddle is you, right paddle is reactive AI with 480+rallySize*16 px/s tracking speed + small sin-wobble for character) and 2-PLAYER (W/S vs ↑/↓). **First to 11**. **Speed ramp**: ball starts at 480 px/s; each rally bumps the cap by `rallyTotal * 22` capped at 1100 px/s. Paddle hits multiply current speed by 1.06 too, so a long volley genuinely accelerates into the danger zone. **High-speed safety**: each frame's ball motion is split into sub-steps `ceil(speed * dt / 8)` so the ball can't tunnel through paddles even at 1000+ px/s. **Reflections**: paddle hit angle = `offset_from_center * 0.8 rad` (skill — hit near the paddle edge to send the ball sharply). Wall bounces flip vy and emit cone-shaped sparks aimed inward. **Comet trail**: every frame pushes `{x, y, age, life, hue}` onto a 40-position trail buffer; rendered with `globalCompositeOperation = 'lighter'` so overlapping samples bloom. Hue cycles via `280 + sin(ball.age * 4) * 60` so the trail shifts violet→pink→cyan as it travels — gives a real "energy-ball" feel without per-pixel shaders. **Particle explosions**: every paddle hit spawns 30 particles in a directional cone (Math.cos(cone) + Math.random spread), every wall bounce 14 particles in an inward cone, every score 60 particles in a full ring with 1.6× power. Particles are additively blended, age-faded, and decay velocity at 0.97/frame. **Screen flash** (`hsla(scoreColorHue, 100%, 65%, level)` overlay) on paddle hits + bigger flash on score. **Screen shake** 14px on score, 0 elsewhere, decays 0.85/frame. **Center divider**: animated rainbow chase using `(y/H + now*0.0005) % 1` as a hue phase, dashed in 14px segments with 8px shadowBlur — feels like a synthwave runway. **HUD**: massive score numbers in absolute-positioned overlay (Press Start 2P, 48px, cyan glow left / pink glow right). Title, pause, and game-over overlays via a single `.tip` div positioned center-screen. **Audio**: WebAudio synth — paddle bleep (square 720Hz left / 980Hz right), wall thump (triangle 220Hz), 3-note score chime (ascending for left, descending for right), 5-note win arpeggio. **Mouse/touch**: pointer x < W/2 controls left paddle, x ≥ W/2 controls right paddle (in 2P mode), tap-anywhere also serves. Sub-pixel paddle clamp prevents off-stage drift. **Bug fix on first commit**: stuck-ball was parked at the receiver instead of the server paddle — corrected so `serveTo === +1` (ball flies right) parks at left paddle, server visually wields the ball before launching. Pollinations OG.

## issues
- AI in vs-AI mode is fairly easy to beat at low scores but ramps with `(left.score + right.score) * 16` so by 7-8 points it's basically perfect. Could add a difficulty selector.
- The center divider's rainbow chase animates even during PAUSED state (it's tied to `performance.now()` directly). Cosmetic, kind of nice actually.
- No spin / curve mechanic on the ball — straight reflections only. A "curved Pong" mode where holding W/S while the ball is nearby imparts spin would be a fun next step.
- AI tracking is reactive (only when `ball.vx > 0` toward right paddle). When the ball is going LEFT, AI drifts back to center — feels lifelike but means a cheeky chip-shot can occasionally tag the corner.
- Mobile `touch-action: none` on body means horizontal swipe gestures don't pan the page. Acceptable since the game is full-viewport.
- WebAudio first-init lag: first paddle hit may feel briefly silent on some browsers due to the autoplay-resume gate. Subsequent hits are fine.
- The score check `x < -ball.r` / `x > W + ball.r` only triggers after a full sub-step — so on extremely high speed the ball could appear to vanish for a single frame between paddle whiff and goal. Hard to notice; the burst+flash+shake make it land regardless.

## todos
- Difficulty selector (rookie / pro / impossible) for vs-AI mode.
- Spin mechanic: holding W/S during paddle contact imparts angular momentum on the ball; trail visualizes the curve.
- Power-up pickups in the center: shrink-paddle, multi-ball, magnet shield.
- Best-of-N selectable (3 / 7 / 11 / 21).
- Tournament mode: 4 AI personalities playing each other.
- High-score persistence + win streak via localStorage.
- Color theme picker (synthwave / cyberpunk / lofi / mono).
- Online multiplayer via Supabase realtime broadcast (ball + paddle state at 30 Hz).
