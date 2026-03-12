# Pixel Nebula

Interactive pixel-art starscape. Click/drag to paint nebulae, birth stars, launch comets, or open voids.

## log
- 2026-02-14: Created. Renamed from elaine-test. Canvas rendered at 1/4 resolution for crisp pixel-art look. 4 interaction modes (Nebula, Starburst, Comet, Void). 6 nebula color palettes. Background twinkling stars. Persistence trail effect. Silkscreen font. Touch support.
- 2026-02-14: Added global leaderboard (pixel_nebula_scores) and persistent cosmic dust (pixel_nebula_dust). Tracks total creations, nebulae, starbursts, comets per user. Dust from all users renders as faint glowing remnants (nebula clouds, star crosses, comet streaks). Batched DB writes to avoid flooding. Scores panel overlay.

## issues
- None yet

## todos
- Could add save/share as PNG
- Sound on interactions would be nice
- Real-time dust updates (postgres_changes subscription)

## notes
- Canvas renders at window/4 resolution, CSS scales up with image-rendering: pixelated
- Slow fade-to-black creates natural persistence/trail effects
- Nebula clouds are pixel-circles with drift and decay
- Void mode darkens and consumes nearby particles
- pixel_nebula_scores: username, total_creations, nebulae, starbursts, comets_launched
- pixel_nebula_dust: x_pct/y_pct (0-1000 permille coords), color, dust_type, size
- Dust saved in batches (max 5 per 2s flush) to avoid DB flood
- Stats saved with 3s debounce
- Persistent dust renders as faint pulsing remnants behind active particles
