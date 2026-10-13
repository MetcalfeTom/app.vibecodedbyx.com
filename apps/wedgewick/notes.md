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
- Walk physics: cellAt(x,z) gives the cell + corner weights; probeAt → highest surface ≤ feet+STEP(.36) and whether a cell fills the body band [feet+STEP, feet+PH 1.2]; body() samples 5 points (radius .2). Gravity 22, jump 7.2.
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
- v1.1 2026-10-13: Walk mode: Wick, a villager in a pointy three-sided hat (🚶 Walk button / F). WASD or touch stick to walk, Space / jump button to jump (1.2 high, a block is .75), walks up ramps and peaks smoothly (surface height = barycentric blend of the cell's corner heights), Q/E turn, swims, falls back to the cottage door from the sea floor. Camera follows and pulls in before roofs/hills; squeezed under 1.5 it goes first-person. A block placed on Wick lifts him on top. Tiered pine trees (two hex wedge skirts) next to the round 'mushroom' trees.

- v1.2 2026-10-13: Stamps (🏠 Stamp shape / H, then 1-5): Cottage, Tower (stone, slit windows, wide pointed hat), Pagoda (three tiers with flared stone skirts, gold tip), Pine, Tree. Drops on the lattice point nearest the tap, on the level tapped; door faces the camera (snapped to one of the six flat sides); clears room and fills a stone plinth with a grass top under the footprint so nothing floats, raised to above sea level (stamps in the sea make a little island). Hex prism outline shows where it goes (red when too high). Undo now works in groups: one undo takes back a whole stamp. hutBuild = cottage(…, [0,1]) + gold, generated islands unchanged (hash-checked in node).

- v1.3 2026-10-13: Villagers. Every stamped cottage, tower or pagoda is a home (saved as h: [i, j, g, kind, ux, uz, name]) and gets a villager (max 12): Wick-style body with baked vertex colours (one merged mesh + 2 feet), pointy hat (cottage), tall indigo wizard hat (tower), wide straw hat (pagoda). They wander up to ~5 from their door, sometimes go inside, jump once when blocked, swim. Tap one in build mode (or walk up as Wick) for a speech bubble: an intro, then lines about triangles. Pip lives in the starter cottage (not saved, comes from HUT). Undoing a stamp moves its villager out. New og.png: a little wedge village with Trix talking.

- v1.4 2026-10-13: Day and night. A day takes ~6 min (DN.len 380 s; day 52%, dusk, night 20%, dawn); sky gradient, fog, sun and hemisphere lights blend between 4 keyframes; glass windows glow (a per-vertex `glow` attribute added to the emissive via onBeforeCompile; gold glows a little); stars and a low moon follow the camera. Villagers head home after dark and wait in their doorways. Menu: 🌗 Day and night on/off (saved), 🌙 Jump to night / ☀ Jump to morning. Fix (Tatum): right-drag and two-finger pan had up/down reversed, and W/S panned backwards; pan now follows the hand on both axes.
- v1.5 2026-10-13: Lanterns. New Lantern block (14, in the palette, no number key) glows amber after dark (glow 1.7 → its own orange emissive in the shader) with a soft additive halo (one Points object, rebuilt from M in build()). Lamp post stamp (6th stamp: two wood, a lantern, a tiled peak cap; ghost is a small hex round the cell). The starter cottage gets lamp posts either side of its path (hutLamps: flat cells 3-4 out; 1 on seed 20261013, 2 on others). Lanterns hugging the cottage walls looked like glowing earmuffs, so cottages themselves don't get any. Wick's spot and the camera are remembered (localStorage 'wedgewick-v1-spot', per seed, saved every 1.5 s and on pagehide); a refresh drops you back where you were, walking if you were (Tatum asked). Smaller moon.
- v1.6 2026-10-13: Islands (Tatum's idea). The ⛵ chip under the title opens "Sail to": Meadow, Snowpeak, Dunes, Ember Isle, Blossom. Each island is its own save slot (localStorage 'wedgewick-v1' for the Meadow, 'wedgewick-v1-isle<n>' for the others, spot '<slot>-spot', last island 'wedgewick-v1-isle'), its own default seed (55/55/55/51, picked in node for a hut and plenty of trees), its own ground and trees, and one or two blocks of its own added to the palette (Ice; Sandstone + Cactus; Basalt + Lava; Blossom). Snowpeak: snow ground, stone shores, snow-capped pines (pine(…, true)), ice floes on the shallows. Dunes: sand, a flat-topped mesa with sandstone strata, cacti with an arm, palms by the water. Ember Isle: a wide cone with a crater bowl and a lava lake (lava glows day and night, Wick hops off it), black basalt beaches and slopes, a green ring of lowland, smoke puffs (7 icosahedrons) from the crater. Blossom: meadow terrain with pink cherry trees. Villager names come from languages that fit the climate (Tatum): Lumi/Nordic+Finnish, Amira/Arabic+Berber, Keahi/Hawaiian, Momo/Japanese; the Meadow keeps Pip and the triangle puns. The Meadow stays the calm starter (Tatum: "an island paradise"); the others may get busier. Meadow generation is hash-identical to v1.5 (generate() only branches when BIOME != 0).

- v1.7 2026-10-13: Villages on the new islands (Tatum: the Meadow stays a calm island paradise, the others "more expansive and bustling"). village() runs in generate() after hutBuild when BIOME != 0: lattice points 6-15 from the starter cottage, scored by footprint flatness (radius-3 heights round the median) + distance + a seeded jitter, spaced 6 apart; homes built with stampBuild, doors snapped to face the starter cottage. Snowpeak 3 cottages + a tower, Dunes 3 cottages + a tower in sandstone, Ember Isle 2 cottages + a tower, Blossom 2 pagodas + 2 cottages. Snowpeak roofs turn to snow, Dunes plaster/tile/stone/brick to sandstone (SWAP). Trodden paths (stone/sandstone/dirt) from each door to the starter cottage's door (PATHM). Generated homes are GENHOMES (not saved, like Pip; regenerate from the seed) and each gets a villager with the island's next name. Stamp plinths now top out in the island's own ground (snow on Snowpeak, sand on the Dunes). Meadow hash-identical.
- v1.8 2026-10-13: Ponds and water (Tatum's oasis / hot spring). New Water block (21, last in every palette): wadeable, walk physics skips it (probeAt), so Wick and the villagers stand on the bottom with the water at their knees. pond(B) after village(): the flattest radius-3 spot 5-15 from the starter cottage and 5+ from the village homes, surface level = 4th-lowest height of the footprint (so it sinks into the ground instead of sitting in a raised box), radius-2 water one layer below a radius-3 rim, holes under it filled. Dunes: a palm oasis (grass rim, 3 palms on the radius-4 ring), Snowpeak: a hot spring in a stone ring with steam puffs (the crater smoke reused: small, white, faster, POND[3] === 1), Blossom: a still pond with a stone rim. Trees keep 5 away from the pond. Meadow hash-identical, no pond.

## issues
- Headless runs at ~5 fps with dt capped at .05, so the villager sim crawls there: test with __WG.stepVillagers(1/30, t) in a loop.
- The speech bubble shows even when a tree hides the villager.

## todos
- Hamburglar's wishes first when they come back.
- Tatum's busier islands, next: a market stall or well in each village square, villagers visiting each other, reeds/lily pads round the ponds, villagers soaking in the hot spring.
- Clouds made of wedges, water you can place, a stargazing tower stamp.
- More stamps: a bridge, a well, a windmill with turning sails, a lighthouse; a spiral stair inside the tower (blocks one layer apart, Wick jumps 1.2).
- The 'blocks placed' chip counts every cell a stamp changed (896 after six stamps); maybe count stamps separately.
- Save several islands; share an island as a code.
