# Neon Pixelator

## log
- 2026-04-07: Initial build. Single-file pixel art maker with 16-color neon palette, paint/erase/fill/clear/undo tools, brush sizes 1-3, grid sizes 16/24/32/48, PNG export at 16px-per-pixel resolution. Silkscreen + Space Mono typography. Pink/cyan neon glow on dark background with subtle grid backdrop.

## features
- 16 vibrant neon colors (pinks, oranges, yellows, greens, cyans, blues, purples, white, gray)
- Tools: paint, erase, fill bucket (flood fill), clear all
- Brush size 1-3 (square radius)
- Undo history (last 20 actions)
- Grid sizes: 16, 24, 32, 48
- Touch + mouse support, touch-action none on canvas
- PNG export via canvas.toDataURL — exports at gridSize * 16px (e.g. 32 grid -> 512x512 PNG)
- DPR-aware rendering for crisp lines on high-DPI screens
- Status bar shows current tool, grid size, brush

## issues
- None known yet. Watch for: large grid (48) brush 3 might be slow on weak mobile devices.
- Canvas auto-resizes on window resize but preserves pixel data.

## todos
- Optional: color picker for custom colors beyond palette
- Optional: save/load to localStorage
- Optional: animated GIF export across frames
- Optional: symmetry mode (mirror x/y)
- Generate proper og-image.png placeholder
