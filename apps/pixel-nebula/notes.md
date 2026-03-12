# Pixel Nebula

Interactive pixel-art starscape. Click/drag to paint nebulae, birth stars, launch comets, or open voids.

## log
- 2026-02-14: Created. Renamed from elaine-test. Canvas rendered at 1/4 resolution for crisp pixel-art look. 4 interaction modes (Nebula, Starburst, Comet, Void). 6 nebula color palettes. Background twinkling stars. Persistence trail effect. Silkscreen font. Touch support.

## issues
- None yet

## todos
- Could add save/share as PNG
- Sound on interactions would be nice

## notes
- Canvas renders at window/4 resolution, CSS scales up with image-rendering: pixelated
- Slow fade-to-black creates natural persistence/trail effects
- Nebula clouds are pixel-circles with drift and decay
- Void mode darkens and consumes nearby particles
- No database needed — pure visual toy
