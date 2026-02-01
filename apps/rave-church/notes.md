# Rave Church

Psychedelic techno visualizer with pulsing neon bible verses.

## log
- 2026-02-01: Initial creation
  - 20 bible verses cycling every 8 seconds with neon color transitions
  - 8 neon color schemes (magenta, cyan, yellow, red, green, purple, blue, orange)
  - Verse text: 3D perspective pulse animation with multi-layer text-shadow glow
  - Click anywhere to advance verse manually
  - 4 procedural visual layers:
    - Stained glass: rotating segmented rings with hue-shifted fills
    - Laser grid: perspective lines converging on mouse position
    - Tunnel: nested polygons (3-8 sides based on mouse X) with depth rotation
    - Particle field: 60 drifting particles with beat-synced size pulse
  - Beat-synced visuals: kick detection triggers flash + cross glow + particle expansion
  - BPM control: scroll wheel adjusts 60-200 BPM
  - Mouse/touch interaction: controls vanishing point and polygon count
  - Scanline overlay for CRT atmosphere
  - Radial vignette darkening edges
  - Motion trail (rgba clear at 0.15 alpha)
  - Floating cross with glow matching current color scheme
  - Click-to-enter start screen
  - No external dependencies (pure canvas + CSS)
  - Mobile responsive (touch events for interaction)

## visual layers
1. Stained Glass — rotating pie segments, 4 rings, hue cycling, breathing scale
2. Laser Grid — horizontal wave lines + radial converging lines from mouse position
3. Tunnel — 20 nested polygons (3-8 sides), rotating, beat-reactive size
4. Particle Field — 60 pseudo-random particles, hue cycling, beat-kick size boost
5. Scanlines — subtle CRT-style horizontal lines
6. Vignette — radial gradient darkening

## interactions
- Mouse/touch position: controls tunnel center, laser vanishing point, polygon count
- Scroll wheel: BPM adjust (60-200)
- Click: advance to next verse
- All visuals react to beat phase (128 BPM default)

## issues
- None yet

## todos
- Could add WebAudio procedural techno generation (kick, hihat, bass)
- Could add congregation mode (shared verse sync via broadcast channel)
- Could add user-submitted verses
- Could add stained glass window presets
- Could add fullscreen toggle
