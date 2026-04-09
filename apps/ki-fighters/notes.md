# Ki Fighters

## log
- 2026-04-09: Mobile + blast overhaul. Rewrote layout — body is now a flex column with `#stage` flex child holding the canvas, so mobile controls reserve space instead of overlapping. Canvas resizes to fit available stage area (orientation-change listener too). Rebuilt on-screen controls as CSS-grid d-pad (3×3) + action cluster (2×2) with color-coded buttons (KI/DASH/PUNCH/BLAST). Switched from per-button touch events to pointer events with setPointerCapture so multi-touch (hold dpad + mash blast) works reliably. Buttons shrink automatically on short screens via `max-height: 520px` media query. Ki blasts: cost raised 25→30, cooldown 35→40, projectile size 6→12, power 18→30, speed 5.5→6.5. New rendering: pulsing halo + radial gradient orb + hot core + comet-tail streak. On impact: 40-particle explosion + 20-particle shockwave ring + 10-frame screen shake. Firing also adds a small shake. Shake applies to the canvas transform in the main draw loop.
- 2026-04-09: Initial build. Pixel-style 1v1 fighter inspired by classic anime energy battles. Player vs AI rival on a sunset mountain stage. Core moves: fly (arrow keys / WASD, free 2D movement), punch (Z, short-range melee), ki blast (X, projectile that costs 25 ki), charge (C, regens ki + aura particles), dash (Shift, i-frame burst that costs 10 ki). Hit-stop flashing on damage, knockback physics, projectile trails with additive-glow radial gradients. Pixel-art hand-drawn fighters with spiky hair sprites that mirror by direction, state-based arm poses (idle/punch/blast). AI opponent approaches when far, backs off when close, randomly blasts at mid-range, charges when low ki. Round restart on Z after KO. Mobile on-screen controls (d-pad + action buttons). Press Start 2P + VT323 typography, purple/orange sunset palette with layered parallax mountains.

## features
- Full 2D flight physics (no ground requirement, light gravity pull)
- 3 offensive moves with cooldowns + ki economy
- Dash with i-frame window and cooldown
- AI with distance-aware behavior tree
- Health + ki bars for both fighters
- Pixel-art sprites with state-based frames
- Aura rendering during charge
- Projectile particle trails + impact explosions
- Mobile touch controls with 54px buttons
- Round restart flow

## issues
- No second AI difficulty; single mid-level opponent
- Collision boxes are fixed rectangles — punches can clip awkwardly at edges
- No sound yet (could add WebAudio blips for punch/blast/KO)

## todos
- Sound: punch whiff, blast charge/fire, KO bell
- Power-up transformation: above 90 ki, player hair glows gold and deals +50% damage
- Second enemy type with teleport
- Super move: hold X for charged beam that penetrates
- Two-player local versus mode
- Stage variants (space, desert, water)
