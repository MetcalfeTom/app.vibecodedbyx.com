# The Empty Plinth (for marcipopsis / Marci)

Marci's ask (2026-10-06): Dalí's ~150 kg bronze cover for *L'Apocalypse de Saint Jean* was stolen from Issoire on the night of 4–5 Oct 2026; make an interactive version so people can still "see" it. Then: gamify it, as a detective case.

Hard rules: never replicate the real cover or use/link any image of it; no external links, no backlink, no database. Facts are only from the news items in the brief (credited "news reports, 6 Oct 2026"). Witnesses are invented and labelled as such.

## log
- v1.0 (2026-10-06): first playable. three.js r170 (full URL, no import map, no addons). A dim museum room (oxblood walls, parquet, glass hood knocked over, cut police tape, drag marks to a SORTIE door, brass plaque), the book on a tilted stand on the plinth. Tools: gold leaf, gold stud, gemstone (5 colours), scallop, conch, cowrie, melting clock, stilt elephant, eye, crutch. Tap to place, drag to move, rotate/resize/duplicate/remove, undo, clear (tap twice). Weight meter (slab 120 kg, line at 150). Case mode: 7 witness statements, the curator checks the clues (1–3 stars), with chalk marks for the zones; stars and best scores saved in localStorage. Studio mode with Reveal + share link (#c=code).

- v1.1 (2026-10-06): the cover as Marci described it: thick brass frame (beaded moulding, corner bosses) around a lumpy earthy panel (noise-displaced, bronze-yellow patina). New pieces (appended types 10-20): fork (4 or 3 prongs), knife, spoon, bead (5 colours), crucifix, spiral disc with white centre, rosette, wax drips, mirror shard, blue-gold sword, scratched inscription. Palette in families (Cutlery, Jewels, Relics, Shells, Dalí). The case is now 8 layered steps (torn pages 1-7 + Witness M.'s full statement); work carries over to the next step. Page 6 = prongs contradiction (Tatum: 3 or 4, all forks must match). Page 7 = patina contradiction (weathered brown is right; bonus: a wheelchair wheel glimpsed in the mirror shard). Curator: "the dinner table became an altar" when the fork cross is right. Storage key v2 (v1 studio carried over). Share code 'B'+patina prefix.

## structure
- One file. Script 1 = engine (window.EPC): TYPES (index order is the share-code format, only append), GEMS, ZONES, check(), ROUNDS, judge(), encode/decode. Script 2 = module (three.js scene, UI). Test hook: window.__EP.
- Source of truth while developing: the session scratchpad ep/ (head.html, body.html, engine.js, app.js, eng_test.js = node test with a 3-star solution per round). If that is gone, edit index.html directly and re-extract.
- Share code: 'A' + 6 base64url chars per item (t5 v3 x8 y8 r6 s6).

## issues
- Headless SwiftShader is slow; thumbnails are rendered with the main renderer (scissor) at boot.

## todos (queued from Marci, in order)
- Surreal room: melting wall clock ticking backwards, slowly sagging/dripping walls (KEEP THE FLOOR AS IS: Tatum loves it), curator = floating eye with a monocle giving the verdicts.
- Dalí's ghost: translucent cartoon ghost with an upturned moustache, riddle hints on click, moustache points at the next torn page. No real quotes.
- Dalí's cookbook easter egg: closed book "Les Dîners de Gala" (1973) on a side table, one line of our own. No recipes/images/ISBN/links.
- Possible rename (coordinator will send the name; change title/og/heading only, no folder move).
- Torn parchment pages scattered around the room (by the case, under a bench, by the door); click one to read that round's clue in hand lettering (game fiction: the real pages were not stolen).
- Museum facts (Karoutzos centre, toured 1961–72, 2 million francs, gendarmerie research section Clermont-Ferrand, fear of being broken up).
- Case archive wall: 10 famous art heists, the Rolstoelrovers (Den Bosch 1981) highlighted, pinned 2026 Issoire card.
