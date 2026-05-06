# neon-frog-climb

## log
- 2026-05-06: shipped — anime-flavoured frog stacking game in a rainy synthwave city.
  - **Core loop**: a swinging frog dangles from a crane at the top of the screen, swaying back and forth at increasing frequency + amplitude as the tower grows. Tap / click / Space drops the frog straight down. It falls under gravity (1700 px/s²), lands on the stack, squashes briefly, and the next frog spawns on the rope.
  - **Balance / wobble system**: every drop's lateral offset from the previous frog (`fallingFrog.x − prevTopFrog.x`) is accumulated × 0.6 into `wobble.totalOffset`. A spring-damper drives `wobble.angle` toward `totalOffset × 0.0015` (visual tilt of the whole tower) with `vAngle *= 0.92^(60dt)` damping. The whole stack is rendered inside a single rotated context so the tilt visualises continuously. Once `|totalOffset| > 90 px` the tower **collapses** — the angle gets a free-fall acceleration and gravity takes the frogs to the pavement, gameOver banner slides in 1.4s later.
  - **Perfect tolerance**: drops within 16 px of dead-center earn a *PERFECT* combo flash (3-note rising synth chime), increment `game.perfects`, and don't add wobble. Consecutive perfects build a `× N` combo flash that scales + fades over 0.65s in Bungee Inline cyan/pink double-shadow.
  - **Frogs (procedural canvas vector)**: round body with radial gradient (palette body → palette spot), shadow ellipse, lighter belly patch, 2 back spots, two big eye-stalks with white sclera + cyan anime sparkle + black pupils with white-shine + cheek blushes. Mouth is an arc smile (default) or a small open `o` (mid-fall / on perfect landing). Random blink every ~6s. Five palettes: green/cyan, pink/yellow, sky-blue, gold, magenta-on-white.
  - **Rainy synthwave city background**:
    - 3-layer parallax skyline — back layer dark `#1c0840`, mid `#2a0c5a`, front `#3a1370` — with per-building random heights, lit-window grids using a deterministic `(r*31 + c*13) % 7 < 3` pattern + occasional flicker. Mid-layer buildings get a 45% chance of a colored sign (`東京`, `NEON`, `夜`, `霓虹`, `GLOW`, `街`, `雨`, `蛙`, `電`, `光`) in Press Start 2P with shadow-blur glow.
    - Pink/cyan moon halo upper-right + 40 twinkling stars (sin-modulated alpha).
    - Wet pavement at the bottom with neon vertical reflection streaks (alternating pink/cyan/lime, 18% alpha).
    - **Crane** with blinking red/cyan tip light at the top — visual anchor for the swinging rope.
    - **Rain**: 80 drops with cyan or violet trails, 700–1100 px/s vy, 0.12-coefficient horizontal wind shear, line strokes with shadow-blur halo. Wraps top-bottom.
  - **HUD**: top-left "Stack" counter in lime Audiowide, top-right "Best" in cyan, top-center **balance meter** — 20rem horizontal bar with a tick that slides left/right based on `totalOffset / COLLAPSE_OFFSET`. Bar tints amber over 50% offset, pink over 80%, label flips from `balance` → `unsteady` → `TIPPING`.
  - **Audio (Web Audio synth)**: gentle rain ambient (looped 2s noise buffer through highpass 1200Hz + lowpass 4500Hz at 2.5% gain) starts on first interaction. Plop on each landing (sine 400→200Hz + brief highpass-noise splash). Perfect chime is a 3-note rising A5/C#6/E6 triangle stagger. Crash on collapse: 120→40Hz sine boom + 0.5s bandpass-noise rumble.
  - **Particles**: each landing spawns a splash burst (12 normal / 22 perfect) of cyan-or-white drops with gravity. Perfect lands also pulse a green ellipse outline around the frog briefly.
  - **Game flow**: title overlay with Audiowide neon header, Cormorant italic tag, Press Start 2P key hints, gradient-pink START button (cyan border, magenta drop shadow). Game-over overlay shows Stack / Best / Perfects pills + a context-aware tag line ("the frogs hit the wet pavement" / "a tall, brave amphibian column.") + AGAIN button. R restarts mid-game.
  - **Difficulty curve**: `swingFreq = 1.4 + min(1.8, height × 0.055)`, `swingAmp = min(260, 180 + height × 4)`. Swing gets faster + wider as you climb.
  - **Aesthetic**: deep purple-magenta sky, hot pink + cyan + lime + violet + gold neon palette. Audiowide for title + numerals, Bungee Inline for combo flash, Press Start 2P for button labels + pixel signs, Cormorant Garamond italic for taglines, IBM Plex Mono for HUD labels.
  - **Persistence**: best score in `localStorage['neon-frog-climb-best']`.
  - **Accessibility**: rem units, semantic `<canvas role="application">` with full keymap aria-label, role="status" + aria-live on score pills, focus-visible 3px cyan outline on buttons, 2.6rem+ touch targets via the giant START button, `prefers-reduced-motion` no-ops the combo-flash keyframe + balance-tick transition, skip link.

## issues
- The collapse animation is a single rotated context with linearly-accelerating angle, not per-frog ragdoll physics. Looks fine for a quick game-over but you'll notice the stack tilts as a unit rather than scattering. Adding per-frog rigid-body fall with collisions would be a bigger refactor.
- Drop timing is exact-frame from input; with a 60Hz tick that's still ~16ms latency on top of input lag. Power users might notice on perfect-tolerance drops.
- Building windows use a deterministic lit pattern that doesn't repaint per resize — the same buildings that re-seed on resize get fresh "lit" patterns, so windows can pop.
- No haptic feedback on mobile; could add `navigator.vibrate(15)` on perfect lands.

## todos
- Per-frog ragdoll on collapse — each frog tumbles with rotation + bounces off the pavement.
- Power-up frogs that grant +1 wobble forgiveness or briefly slow the swing.
- Seasonal palettes (cherry-blossom pink with falling sakura particles, snowy white-blue with snowflakes).
- Tornado-mode where wind shifts the swing-center mid-cycle.
- Online leaderboard via Supabase (height + perfects).
- Cosmetic frog hats unlocked at height milestones.
