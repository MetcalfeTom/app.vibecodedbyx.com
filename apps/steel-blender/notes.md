# Steel Blender

Drag anything into a brutalist steel blender and watch it get obliterated.

## log
- 2026-03-15: Initial build. Canvas 2D industrial blender simulator. Trapezoid glass jar with steel frame, base with screws, measurement lines, top rim. 4 spinning blades with edge highlights and center hub. 24 draggable items (banana, phone, rock, brain, diamond, etc.) — drag from shelf into jar. Items fall with gravity, collide with jar walls, get caught in blade vortex. Blade chops reduce item size, spawn colored chunks and liquid splatter particles. Items fully blend into liquid that fills jar with mixed color. Speed slider 1-10 controls blade RPM, vortex force, chop rate. Wavy liquid surface, smoke at high speed. Screen shake while chopping. Web Audio: motor rumble (filtered noise), chop (sawtooth burst), splat (noise burst). Brutalist aesthetic: IBM Plex Mono + Inter Tight 900 typography, steel grays, grid background, minimal color.

## issues
- None yet

## todos
- Pour button (tip blender, liquid flows out)
- Recipe results (specific combos = named drinks)
- Blend rating / consistency meter
- Custom text input (blend words into anagrams)

## notes
- No database — pure frontend
- Jar: trapezoid path, collision via linear interpolation of wall X at item Y
- 4 blades: rotated quads with edge highlight, center hub
- Chop rate: 0.3/speed seconds per chop, -3px size per chop
- Item blended when size <= 5, adds 0.06 to liquid level (max 0.8)
- Liquid color: RGB average of all blended item colors
- Vortex: perpendicular force from atan2 angle, scales with speed
- Chunks: 3 per chop, colored, rotating, gravity, fade
- Liquid particles: 2 per chop, splash upward
- Smoke: 15% spawn rate at speed > 6
- Drag: custom touch/mouse handling, clone follows cursor
- 24 items with emoji, name, and base color for chunks/liquid
