# Glyph Ruins

3D first-person exploration game where players wander ancient ruins finding hidden glowing letters to complete word puzzles.

## log
- 2026-04-11: Initial build. Three.js first-person 3D exploration. Ancient ruins arena (80x80) with walls, pillars, arches, stone floor tiles. 15 word pool, 5 rounds per game. Glowing letter cubes with canvas-rendered text, floating/spinning animation, point lights per letter. WASD + mouse look (pointer lock), space to jump. Collision detection against all structures and arena bounds. Auto-place mechanic: collected letters fill word slots in order. HUD with word display (blank slots → filled), inventory, round counter. Touch controls: joystick for movement, right-half touch zone for look. Cinzel + Fira Code typography, ancient gold-on-dark aesthetic with torch point lights and fog.

## features
- Three.js 3D first-person view
- Pointer lock mouse look + WASD movement + jump
- Collision detection against all structures
- 15 words: TEMPLE, CIPHER, RUNES, GLYPH, ORACLE, etc.
- Letters spawn at random valid positions (not inside walls, not too close)
- Letters glow (emissive material + point light), float, spin
- Word display with blank slots, auto-fill as letters collected
- 5 rounds per game
- Atmospheric lighting: moonlight + 3 colored torches with flicker
- Fog for depth/atmosphere
- Touch controls: joystick + look zone
- Ancient ruins: walls, pillars with capitals, arches with lintels

## issues
- Letters may occasionally spawn in hard-to-reach corners
- No minimap/compass yet — could help with navigation

## todos
- Minimap or compass pointing to nearest letter
- Ambient sounds (wind, footsteps)
- More varied structures per round
- Timer/score system
- Supabase leaderboard
- OG preview PNG
- Particle effects on letter collect
