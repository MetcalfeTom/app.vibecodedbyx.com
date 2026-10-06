# The Empty Plinth (for marcipopsis / Marci)

Marci's ask (2026-10-06): Dalí's ~150 kg bronze cover for *L'Apocalypse de Saint Jean* was stolen from Issoire on the night of 4–5 Oct 2026; make an interactive version so people can still "see" it. Then: gamify it, as a detective case.

Hard rules: never replicate the real cover or use/link any image of it; no external links, no backlink, no database. Facts are only from the news items in the brief (credited "news reports, 6 Oct 2026"). Witnesses are invented and labelled as such.

## log
- v1.0 (2026-10-06): first playable. three.js r170 (full URL, no import map, no addons). A dim museum room (oxblood walls, parquet, glass hood knocked over, cut police tape, drag marks to a SORTIE door, brass plaque), the book on a tilted stand on the plinth. Tools: gold leaf, gold stud, gemstone (5 colours), scallop, conch, cowrie, melting clock, stilt elephant, eye, crutch. Tap to place, drag to move, rotate/resize/duplicate/remove, undo, clear (tap twice). Weight meter (slab 120 kg, line at 150). Case mode: 7 witness statements, the curator checks the clues (1–3 stars), with chalk marks for the zones; stars and best scores saved in localStorage. Studio mode with Reveal + share link (#c=code).

## structure
- One file. Script 1 = engine (window.EPC): TYPES (index order is the share-code format, only append), GEMS, ZONES, check(), ROUNDS, judge(), encode/decode. Script 2 = module (three.js scene, UI). Test hook: window.__EP.
- Source of truth while developing: the session scratchpad ep/ (head.html, body.html, engine.js, app.js, eng_test.js = node test with a 3-star solution per round). If that is gone, edit index.html directly and re-extract.
- Share code: 'A' + 6 base64url chars per item (t5 v3 x8 y8 r6 s6).

## issues
- Headless SwiftShader is slow; thumbnails are rendered with the main renderer (scissor) at boot.

## todos (queued from Marci, in order)
- Forks (and knife, spoon) in the palette; "four forks in a cross in the centre with a jewel" as an early clue; a contradiction round (3 vs 4 prongs: either is OK if all four forks match).
- Marci's full witness description as the item set: brass frame + lumpy earthy panel, small crucifix, spiral disc with white centre, rosette, drip strip with beads (top edge), mirror shard (right), blue-gold sword (lower centre), scratched inscription decal.
- Torn parchment pages scattered around the room (by the case, under a bench, by the door); click one to read that round's clue in hand lettering (game fiction: the real pages were not stolen).
- Museum facts (Karoutzos centre, toured 1961–72, 2 million francs, gendarmerie research section Clermont-Ferrand, fear of being broken up).
- Case archive wall: 10 famous art heists, the Rolstoelrovers (Den Bosch 1981) highlighted, pinned 2026 Issoire card.
