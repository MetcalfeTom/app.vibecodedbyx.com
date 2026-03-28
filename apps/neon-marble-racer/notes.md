# Neon Marble Racer

## log
- 2026-03-28: V1 — Initial build. Canvas marble physics with gravity, bouncing, friction. 7 track pieces (Ramp R/L, Platform, Funnel, Trampoline, Tube R/L) + 5 obstacles (Bumper, Spinner, Pin Row, Gravity Well, Portal). Piece placement via sidebar selection + canvas click. Marble trails with fade, neon glow rendering, bounce particles. Gravity slider (adjustable physics). Portal pairs with auto-pairing. localStorage track persistence. Touch support for mobile.

## features
- 7 track pieces: Ramp Right/Left (angled slides), Platform (flat), Funnel (converging walls), Trampoline (super bounce), Tube Right/Left (enclosed slides)
- 5 obstacles: Bumper (circle bounce), Spinner (rotating bar), Pin Row (pachinko), Gravity Well (attractor), Portal (teleport pair)
- Marble physics: gravity, air drag, wall bounce, piece collisions with proper normals
- Neon rendering: radial glow, gradient marbles, fading trails, bounce particles
- Gravity slider: adjustable from gentle to extreme
- Portal system: place pairs, auto-labeled A/B/C etc
- Track saved to localStorage
- Drop marbles from top or click anywhere

## issues
- None currently

## todos
- Leaderboard (fastest marble through course?)
- Piece rotation
- Piece deletion (right-click or long-press)
- Undo last piece
- Pre-built track templates
- Sound effects (WebAudio bounces)
- Multi-marble race mode with timer

## notes
- Physics: line-circle collision for ramps/tubes/funnels, circle-circle for bumpers/pins
- Spinner rotates at constant speed, pushes marbles perpendicular to bar
- Gravity well: force scales inversely with distance, capped at well radius
- Portals: pairs share _portalId, cooldown prevents infinite loops
- Trampoline: 1.4x velocity reflection + random horizontal kick
