# Neon Fox Sanctuary

Neon foxes with laser eyes and tickle physics.

## log
- 2026-03-18: Initial build. Neon foxes roam a glowing sanctuary under aurora bands. 6 color palettes with matching laser/glow colors. Tickle physics: hover over a fox to tickle it — wiggle increases, sparkle particles, at high tickle they burst laughing, jump, and randomly shoot laser beams. Foxes have state machine (idle, walk, tickled, laughing, laser). Detailed vector fox rendering (body, head, ears with wiggle, tail with physics, muzzle, glowing neon eyes with glow halos, legs with walk animation). Click/tap to spawn more foxes (max 8). Laser beams shoot from eyes to random target with impact glow. Neon grass, aurora sky, stars. Righteous + Share Tech Mono typography.

- 2026-03-18: Added giant stomping robot fox. Mechanical armored hull with piston legs, angular head, red scanner visor with sweep, reactor core glow, segmented tail with antenna, articulated jaw. Stomps periodically causing screen shake, ground sparks, and scaring nearby foxes into jumping away.
- 2026-03-18: Added pulsing defensive energy shield dome at center. Translucent hex-grid pattern, dual pulsing rings, traveling energy arcs, base glow. Multiple sine-wave breathing for organic pulse.

## issues
- None yet

## todos
- Fox sounds (yips, laughs)
- Fox-to-fox interaction (playing together)
- Collectible items (butterflies to chase)
- Fox customizer

## notes
- No database — pure frontend
- Tickle intensity 0-1, triggers laugh at 0.8
- Laser fires randomly when tickle > 0.5
- Max 8 foxes to keep performance smooth
- Foxes sorted by Y for proper overlap
