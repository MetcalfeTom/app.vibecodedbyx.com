# Neon Lava Lamp

## log
- 2026-05-02: **Continuous mouse repulsion + per-blob time-shifting hues.** Per chat: replace the click-only one-shot heat pulse with continuous repulsion that pushes any blob within MOUSE_R=220 outward each frame at MOUSE_FORCE=6 with linear falloff. Mousemove/touchmove updates a shared `mouse{x,y,in}` snapshot; the actual force runs inside `Blob.update()` so push intensity stays dt-stable regardless of trackpad event rate. mouseleave/touchend wipes the snapshot. The original click-pulse is preserved for satisfying instant interaction (bumped impulse 4 vy + 6 directional vx). **Time-shifting hues** added on top of the palette system: each blob now stores `baseColor` (anchor from active palette) + `huePhase` (random) + `hueSpeed` (~0.0014–0.0038 / frame). Per-frame `update()` advances phase and writes `this.color = shiftHue(baseColor, sin(phase) × 60)`, rotating ±60° around the palette anchor so composition stays chromatically coherent while still visibly breathing. New `shiftHue(hex, deg)` helper does hex→rgb→hsl→rotate→rgb→hex (returns hex so the existing `color + '40'` alpha-suffix concatenation in draw() keeps working unchanged). Palette switcher updates BOTH `baseColor` and `color` so the rotation re-anchors immediately on swap.
- 2025-01-01: Initial creation - physics-based lava lamp with glowing blobs

## features
- Realistic blob physics (buoyancy, gravity, drag)
- Temperature simulation (heat rises, cool sinks)
- Soft collision detection between blobs
- Organic wobbling shapes
- 4 color palettes: Neon, Sunset, Ocean, Toxic
- Glow effects and highlights
- Click/tap to add heat and push blobs
- Responsive design

## technical
- Canvas-based rendering
- Custom physics engine with temperature model
- Quadratic bezier curves for organic blob shapes
- Radial gradients for glow effects
- RequestAnimationFrame loop

## issues
- None yet

## todos
- Add sound toggle (ambient bubble sounds)
- Add lamp brightness control
- Add blob count slider
- Add shake/tilt interaction on mobile
