# Neon Sand

Draw with falling neon sand. Watch glowing grains pile up, stack, and cascade in a pixel physics sim.

## log
- 2026-03-15: Initial build. Pixel-based falling sand physics simulator with neon colors. Grid-based simulation at 3px per cell. Sand falls down, slides diagonally when blocked (random left/right priority, alternating scan direction per row for natural spread). 8 neon colors: cyan, magenta, red, green, yellow, pink, violet, white. Each grain has slight color variation (±30 per channel). Wall mode: place static blocks that sand stacks on. Erase mode: remove grains. Rain mode: continuous grain spawning from top edge. Adjustable brush size (1-8 radius). Click/drag to place grains. Uint32Array grid with bit-packed color (RGB in low 24 bits) and wall flag (bit 31). ImageData direct pixel rendering for performance. FPS and grain counter. Touch support. Silkscreen + DotGothic16 typography, dark background with neon grains.

## issues
- None yet

## todos
- Water element (flows laterally, fills containers)
- Fire element (rises, consumes sand)
- Explosive element (chain reaction)
- Save/load patterns
- Gravity direction toggle
- Performance: WebGL or OffscreenCanvas for larger grids

## notes
- No database — pure frontend
- Grid: Uint32Array, 3px per cell, resizes with window
- Cell encoding: bits 0-23 = RGB, bit 31 = wall flag, 0 = empty
- Physics: bottom-up scan, alternating L-R direction per row
- Fall priority: down > diagonal-random > diagonal-other > stay
- Spawn rate: 60% probability per brush pixel (avoids solid blocks)
- Rain: GW/12 grains per frame from top row
- Color variation: ±30 per RGB channel on spawn
- Render: direct ImageData pixel manipulation, putImageData per frame
- Walls render at 40% brightness of their color
