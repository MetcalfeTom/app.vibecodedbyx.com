# Wedgewick

hamburglar06's idea (Twitch, 2026-10-13, first visit): "Minecraft but with triangles instead of squares". Named Wedgewick on stream.
Never use Minecraft names, textures or assets: inspiration only. The name must not contain "craft".

## Art direction
- Look: low-poly flat-shaded island at golden hour, vertex colours with a small per-cell lightness jitter.
- Palette: grass #7cb550, dirt #8f6440, stone #a3a2ad, sand #ecd59a, wood #c08a52, leaves #3f9a57, plaster #f3ead8, roof tile #d0703c, brick #b5523b, glass #aee3f0, snow #f6f8fb; accent gold #ffcf4a. UI ink #2b2236 on paper #fff7ea.
- Mood: warm sun from the top left (#ffe7c4), hemisphere sky/ground, gradient sky blue to peach, fog in the horizon peach.
- Camera: orbit diorama (own code, no OrbitControls: r170 addons import bare 'three'), FOV 50 (62 in portrait).
- Fonts: Unbounded 900/300 + Spline Sans Mono.
- Budget: one merged mesh (1 draw call) + sea floor + water + ghost.

## How the world works
- Triangular lattice of vertical prisms. Lattice point (i,j) at x = i + j/2, z = j*√3/2. Cell (q,r,s): s=0 up (q,r)(q+1,r)(q,r+1), s=1 down (q+1,r)(q+1,r+1)(q,r+1). Edge k joins corner k and k+1; NB table gives the neighbour across each edge.
- Layer height LH = .75 (triangle side 1). World q -24..51, r 0..51, y 0..27, sea level 4. Cells stored in M (material) and S (shape) Uint8Arrays.
- Shapes: 0 full, 1-3 peak (one high corner), 4-6 ramp (one low corner). wedge(…, hi) picks the shape from which corners are high: one = peak, two = ramp, three = full.
- Terrain: seeded fbm + island falloff + one mountain bump; then every top next to a higher neighbour gets a wedge (that is what makes the hills smooth and pointy).
- Starter cottage: flattest spot near the middle levelled (radius 4), plaster walls radius 2 with a brick footing, a door toward +z, glass windows on the sides, a 3-layer hex roof of roof-tile wedges (roof()), a gold block on the floor.
- Trees: trunk on an up cell, leaves as the 6 cells round a lattice point, capped with 6 peaks (peakCap) = a pointy tree. Tall ones get a radius-2 leaf ring.
- Mesh: rebuilt whole on every edit (~200k cell loop). FC/FD map each triangle to its cell and face (0 top, 1 bottom, 2-4 side k, 5 sloped top) for picking.
- Placing: top/sloped top → the cell above, bottom → below, side k → neighbour across edge k. Peak points at the corner nearest the tap; ramp's low corner is the one farthest from the tap.
- Saves to localStorage 'wedgewick-v1' {seed, e: [[cell, m<<4|shape]...]}; sound pref 'wedgewick-v1-snd'.
- Controls: drag turns, right-drag/shift-drag pans, two fingers pinch + pan, wheel zooms; tap/click builds, right click digs, long press (touch) digs, ⛏ Dig tool. Keys: arrows turn, WASD pan, +/- zoom, 1-0 blocks, B/P/R shapes, X dig, Ctrl+Z undo.
- Test hook `/*TESTHOOK*/window.__WG` lives only in the scratch copy; the live copy has that line stripped.

## log
- v1.0 2026-10-13: first playable. Island, cottage, trees, 12 blocks, block/peak/ramp shapes, dig, undo, new island, reset, sound.

## issues

## todos
- Hamburglar's wishes first when they come back.
- A walking little character (first person or a small hero) to explore what you built.
- Day/night, clouds made of wedges, water you can place.
- Stamp tools: a cottage, a tree, a hex tower.
- Save several islands; share an island as a code.
