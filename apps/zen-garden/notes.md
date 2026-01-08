# Zen Garden

## log
- 2026-01-06: Initial creation - minimalist retro zen garden with drifting shapes

## features
- Slow drifting geometric shapes
- 5 shape types: circle, square, triangle, diamond, concentric circles
- Muted retro color palette (sand, stone, sage, mauve, slate, terracotta, moss, clay)
- Gentle oscillation movement
- Breathing scale effect
- Fade-in animation
- Click to add shapes
- Maximum 25 shapes (oldest removed)
- Soft boundary wrapping

## design philosophy
- Minimalist and meditative
- No harsh colors or sudden movements
- Warm paper-like background (#f5f2eb)
- Stroke-only shapes (no fills)
- Low opacity (15-40%)
- Controls fade in on hover
- Cormorant Garamond serif font

## motion
- Drift: 0.3 px/frame max
- Rotation: 0.002 rad/frame max
- Oscillation: sine/cosine wave, 10-30px amplitude
- Breathing: 5% scale variation

## color palette
- #c9b99a sand
- #a39382 stone
- #8b9a8b sage
- #9a8b8b mauve
- #8b8b9a slate
- #b8a088 terracotta
- #7d8878 moss
- #988b7d clay

## technical
- Canvas 2D rendering
- No physics/collisions (intentionally calm)
- Soft wrap at boundaries
- Touch support for mobile

## todos
- Add ambient sound option
- Add sand ripple effect on click
- Add time-of-day color shifting
