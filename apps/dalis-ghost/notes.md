# Dalí's Ghost (for marcipopsis / Marci)

Marci's idea (2026-10-07): a sequel to The Mystery of Dalí's Apocalypse (apps/empty-plinth): Dalí's ghost stole the cover himself. A phone game playable without instructions; "a thing to solve about Dalí's life and work in each field". Then the bigger vision: walk through a 3D museum (light 3D is ok), at least 6 rooms, each room a part of his life, each with its own surreal vibe based on an artwork, find all the pieces. Losing ending: you get cooked with a recipe from the cookbook (after 10 wrong answers or rooms not finished in time) - write our own surreal recipe, don't copy the book.

Marci's rooms so far: Madrid fine-arts education (expelled from the academy, 1926); Impressionism + Renaissance masters -> Cubism and the avant-garde; The Persistence of Memory (finished August 1931); the dead older brother, also named Salvador ("two drops of water, different reflections"); Alexandre Dumas (Marci: second room, and he's in the cookbook - VERIFY before stating as fact); the cookbook dinner.

Hard rules: homage, never a replica of real artworks (motifs and moods only: soft watches, crutches, drawers, ants, eggs, long shadows); facts must be accurate (only ones I'm sure of or verified); no external links; no database.

## log
- v1 (2026-10-07 ~18:04 UTC) 2D phone version: 7 rounds; the ghost hides behind one of 9 things on a 3x3 dream desert (12 things: egg/Figueres, soft watch/1931, Chupa Chups lollipop 1969, diving helmet London 1936, film reel Buñuel/Hitchcock, cookbook Les Dîners de Gala 1973, ocelot Babou, moustache/Velázquez, drawers/Venus de Milo 1936, crutch, Port Lligat boat, ants). Tap = hot/cold by grid distance (hot <=1, warm <=1.5, cold <=2, freezing), the tapped thing shows its fact; 4 tries; caught = his 3-choice question about that thing, right answer wins the piece (flies to the cover bar). End card: stars, best (localStorage dalis-ghost:best), share. Lesson: .card{display:flex} beat [hidden]; add .card[hidden]{display:none}.

## structure
- One file, no three.js yet. Test hook window.__DG (G, THINGS, SPOTS, heatOf, tapField, newGame, fields()).

## todos
- v2: the 3D museum (three.js r170 full URL, no import map): room by room, each room perfect before the next (Marci). First room: The Persistence of Memory desert.
- Losing ending: cooked by the ghost with our own surreal recipe.
