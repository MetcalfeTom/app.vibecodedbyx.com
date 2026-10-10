# Terruño

An editable, never-ending top-down pixel world for arianmartiz (2026-10-10 18:17: "Quiero un mundo abierto editable tipo pixel art"). Spanish first (ES/EN via navigator.language or the menu, saved as 'terruno-lang'). One index.html, plain canvas 2D, no libraries, no backend.

## Art direction
- Look: 16x16 tiles, 16-bit cozy palette (mossy greens, dusty paths), everything drawn in code (mk() + blob() pixel shapes, typed rows for the hero). The things you build pop, the ground stays muted.
- Render: low-res buffer LO (1 px = one art pixel, VW x VH) drawn crisp at an integer scale SC (2-5, from the screen's short side) onto the full-screen canvas with image-rendering: pixelated.
- Camera: top-down 3/4 view, follows the hero. Walls are 16x24 sprites (16 top + 8 front face), drawn row by row so the hero goes behind things.
- Day: 10 minute cycle (DAY=600 s of `clock`), night = dark overlay DK with holes cut by torches (radius ~46) and a small glow round the hero, warm 'lighter' pools at torches.
- UI: Pixelify Sans + Silkscreen, plum panels (#2a2033) with gold accent (#f2b94b).

## log
- 2026-10-10 18:35 UTC v1.1 roofs: any area closed by walls and doors (WALLISH) is a room (roomOf: 4-way flood fill, open if it reaches 320 tiles; cached in roomC, cleared on every setT), and gets a roof drawn in the row pass right after that row's objects and the hero (so trees in front still cover it): clay tiles over mostly wood walls, slate over stone (ROOF.w/.s, upper slope lit, one ridge row, lower slope in shade, shorter eave on the bottom wall row so doors show). Rooms of 6+ tiles get a chimney with smoke on the top right. The roof of the room you're in (or whose door you stand in, roofAt) is hidden, and the place toast says "En casa".
- 2026-10-10 v1: endless world from seeded value-noise fBm (gen(x,y) -> [ground, object]): deep sea, water, beach, meadow, forest, desert with cacti, rocky hills, snowy peaks, thin rivers; the spawn area is pulled toward meadow height and spawn() looks for a 5x5 patch of grass. Chunks of 32x32 cached in `chunks` (cleared over 600); edits in `edits` Map 'x,y' -> [g,o] are the save. 21 tools in the bar: Pala (dig: removes trees/rocks, else a DITCH; ditches next to water fill one tile at a time via `flow`), Quitar (removes the object, else gives back gen()'s ground), 8 grounds (grass, path, wood floor, sand, water, bridge, snow, dirt), 11 objects (wood wall, stone wall, door, fence, torch, tree, pine, flowers, bush, wheat (tills the ground), rock). Painting a built ground clears wild objects (WILD), keeps walls/fences/torches. Solid objects can't go on water or on the hero (red cursor). Walls get dark outlines where they end (WALLISH neighbours). Controls: WASD/arrows, click/drag paints (Bresenham line between tiles), right button clears, wheel/1-0/Q/E switch, Space/Enter builds the tile you face; phones: joystick (pointer:coarse) + tap/drag paints. Saves to localStorage 'terruno-v1' (seed, hero, tool, clock, edits) 0.7 s after an edit, every 8 s and on pagehide. Menu: back to start, language, new world (press twice). Place toast (biome name, or "Tu pueblo" once 8+ edits are near). Tiny WebAudio blips. A setInterval fallback runs frames when rAF stalls (headless).

## issues
- Headless Chromium doesn't fire requestAnimationFrame here: probes call frame(performance.now()) themselves (hm/ter/p2.js builds a test cabin).
- Every new world is a random seed; the og image used SEED 4242.

## todos (ideas)
- chickens / animals; villagers who walk your paths (Arian asked for inhabitants with their own decisions in Imperios); worn paths where you walk often; seasons; share a world (seed + edits) by link; undo; brush size; minimap.
