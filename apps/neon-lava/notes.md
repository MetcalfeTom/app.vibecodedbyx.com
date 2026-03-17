# Neon Lava

Full-page neon lava lamp with keyboard-reactive blobs.

## log
- 2026-03-17: Initial build. Metaball-based lava lamp. 12 blobs with per-pixel field calculation on 1/3-res offscreen buffer, composited with 'lighter' blend mode. 8 color palettes that cycle on keypress. Each key press: shifts palette, boosts pulse energy, kicks blob velocities, triggers screen flash. Lava physics: buoyancy zones (sink at top, rise at bottom), wobble via sinusoidal forces, speed cap, soft damping. Lamp shape: bezier glass outline with cap/base ellipses, glass reflection gradient. Ambient glow: radial gradient per blob on main canvas. Pulse energy affects blob radius oscillation amplitude, decays at 0.97/frame. Touch support for mobile. No external fonts — minimal aesthetic. Dark void background, neon blob colors.

## issues
- None yet

## todos
- Audio reactive mode (microphone input drives blob behavior)
- Mouse/touch position attracts nearest blob
- Configurable blob count
- Full-screen mode button

## notes
- No database — pure frontend
- Performance: metaball pixel shader at bufScale=3 (1/3 resolution)
- Threshold: 0.8 field strength for blob visibility
- 8 palettes, 5 colors each, smooth lerp transition
- Lamp shape constrains blobs with squeeze factor for hourglass shape
