# Dalí's Ghost (for marcipopsis / Marci)

Marci's idea (2026-10-07): a sequel to The Mystery of Dalí's Apocalypse (apps/empty-plinth): Dalí's ghost stole the cover himself. A phone game playable without instructions; "a thing to solve about Dalí's life and work in each field". Then the bigger vision: walk through a 3D museum (light 3D is ok), at least 6 rooms, each room a part of his life, each with its own surreal vibe based on an artwork, find all the pieces. Losing ending: you get cooked with a recipe from the cookbook (after 10 wrong answers or rooms not finished in time) - write our own surreal recipe, don't copy the book.

Marci's rooms so far: Madrid fine-arts education (expelled from the academy, 1926); Impressionism + Renaissance masters -> Cubism and the avant-garde; The Persistence of Memory (finished August 1931); the dead older brother, also named Salvador ("two drops of water, different reflections"); Alexandre Dumas (Marci: second room, and he's in the cookbook - VERIFY before stating as fact); the cookbook dinner.

## art direction (v2, 3D)
- Look: low-poly clay/flat-shaded, a Dalí homage (motifs only, never a replica). Palette: sand ochre, Cap de Creus gold cliffs, sea teal #4f8486, sky cream #f2cf96 to teal, soft-watch cream + gold rims, detective red coat, ghost white with an upturned black moustache.
- Mood and light: late afternoon, Port Lligat, August 1931. Warm sun #ffd6a0 from the left (dir -1,.42,.55), long shadows, hemi #cfe3e0/#8a5a34, fog #e8cf9e 40-170, PMREM env from the sky. The setting sun is the room timer (G.DAY 240 s): dusk() lerps to night and the watches melt more.
- Camera: third-person follow, fov 62 portrait / 48 landscape, D 10.5 H 7.4 portrait, 8.6/5.4 landscape, looks 2.2 m ahead; drag to turn.
- Hero: the detective (red coat, black hat, lantern); the ghost is a white sheet with a curled moustache, rises out of hiding and flies.
- World: foreground velvet ropes + the door back to the hall; midground the 8 searchable things (olive tree with a watch, block, ants watch, the sleeper with the saddle watch, crutch-propped soft shape, café table with Camembert, an empty gold frame, the Port Lligat boat); background the sea, gold cliffs, headlands, a mesa.
- Budget: ~67-73 draw calls, ~43-44k triangles (phone fine). Shadows 1024 phone / 2048 desktop.

Hard rules: homage, never a replica of real artworks (motifs and moods only: soft watches, crutches, drawers, ants, eggs, long shadows); facts must be accurate (only ones I'm sure of or verified); no external links; no database.

## log
- v1 (2026-10-07 ~18:04 UTC) 2D phone version: 7 rounds; the ghost hides behind one of 9 things on a 3x3 dream desert (12 things: egg/Figueres, soft watch/1931, Chupa Chups lollipop 1969, diving helmet London 1936, film reel Buñuel/Hitchcock, cookbook Les Dîners de Gala 1973, ocelot Babou, moustache/Velázquez, drawers/Venus de Milo 1936, crutch, Port Lligat boat, ants). Tap = hot/cold by grid distance (hot <=1, warm <=1.5, cold <=2, freezing), the tapped thing shows its fact; 4 tries; caught = his 3-choice question about that thing, right answer wins the piece (flies to the cover bar). End card: stars, best (localStorage dalis-ghost:best), share. Lesson: .card{display:flex} beat [hidden]; add .card[hidden]{display:none}.

## structure
- v1 (2D) is in git history (commit bb4e67447).
- One file, three.js r170 by full URL (no import map). THREE.Timer does not exist in r170: manual dt from the setAnimationLoop ms. An inline head script collects load errors into window.__E for probes.
- ROOMS[id] = { sky stops, fog, hemi, sun, envI, build(R) }; enterRoom(id) builds sky + PMREM env + lights + the room. R.things: { id, pos, r, cy, top }, CLUES[room][id] = { q: riddle, f: fact }.
- G.run token: every async step (search, ghostOut, caught, hideAgain, cooked) checks it, so Play again mid-animation never fires a stale end card.
- Test hook window.__DG = { THREE, scene, camera, renderer, R(), CAM, G, ME, GH, enterRoom, WATCHES, drapeWatch, newGame, search, thing, tapAt, pick, caught, dusk }. Probes: scratchpad hm/dg3 (q2.js full path, qc.js cooked, qog.js the og shot; CAM.mode = 'x' frees the camera). A probe that calls newGame() directly leaves the title card up (only #go hides it).

- v2.0 (2026-10-07 ~18:35 UTC) 3D (Marci: v1 was flat, "too little going on", "just random questions"): room 1, the Persistence of Memory desert at Port Lligat. Walk the detective (tap to walk, tap a thing to search it); the ghost left 3 riddles (a random chain of 3 of the 8 things); a right search = the next riddle + a true fact, a wrong one = a fork + hot/cold from the ghost; find all 3 and he rises and flies, tap him to catch him (13 s, else he hides again for one more riddle). Caught = his piece flies into the cover. 10 forks or nightfall = cooked: "Soufflé of Startled Detective, Port Lligat style" (our own recipe). Stars by forks and daylight, best in localStorage dalis-ghost:3d-best. New og.png from a 3D shot (no PIL in the sandbox: cp the probe png).

## todos
- The hall (Marci's design): the first room is the empty glass case where the Apocalypse cover was; the museum asks you to relive Dalí's life; 3 directions = 3 picture-frame doors you step through, each a chapter of his life; solve a not-too-hard puzzle there, then choose the next room. Finished rooms stay lit. Clues lead to who stole it (the ghost himself).
- More rooms: the brother mirror room (two drops of water, different reflections), the Madrid academy (expelled 1926), Impressionism/Renaissance to Cubism, the Les Dîners de Gala cookbook dinner, Dumas (verify first). Each room its own losing recipe.
- The door at the back of the desert leads to the hall once it exists.
