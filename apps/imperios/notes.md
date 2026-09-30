# Imperios (arianmartiz)

Civilization simulator, Spanish-first (ES/EN toggle, `?lang=es|en`). From a Homo sapiens clan around a
campfire (50,000 BC) to the Modern Era (2050). One self-contained index.html, vanilla canvas, no backend.

## Style (chosen)
Hand-painted parchment atlas: ink and watercolour on parchment, IM Fell English + Alegreya Sans.
Prehistory is a moonlit night lit only by campfires; dawn breaks between -12000 and -5000.
Settlements are drawn glyphs that grow each era and differ per path (camp > huts/tents/stilts > ziggurats,
towers, domes > factories > towers).
Alternatives offered to Arian: B) warm 16-bit pixel art, C) low-poly 3D diorama.

## How it works
- 120x120 tile grid, P=5 px per tile, per-pixel warped for a hand-drawn coast. Terrain painted once offscreen.
- 7 civs (Tolteca, Nordico, Qadir, Jade, Velmora, Kuruma, Inti), rebels spawn from secessions.
- Names: "Clan X" (era 0), "Tribu X" (era 1), full empire name after.
- Fire is the first breakthrough (player gets an event card, AI lights at a random sci threshold).
  No era advance without fire.
- Neolithic path choice: farm (river empire), herd (horse nomads), sea (trade). Player picks via card.
- Endings: science (Modern Era), domination (60% of land), score at 2050, fall (can keep watching).
- Year step shrinks over time (yearStep). ERA_SCI tuned so eras land roughly on history.

## Test seams
- `?probe=N&seed=X&trace=1` runs N headless games, JSON in title. Node harness: scratchpad nodeprobe.js.
- `?shot=N&seed=X[&zoom=k][&ev=id][&info][&lang=es]` renders tick N paused; title "READY ..." / "FAIL ...".
- `window.__imp` = {G,tick,boot,renderOwn,fitView,setLang,draw}.

## log
- v1.0 2026-09-30: first playable. Campfire opening, fire event, 3 paths, 8 eras, wars/alliances/rebels/
  hordes/plagues/trade routes/golden ages/wonders, chronicle, results screen, ES/EN.
  Balance (3 seeds): wars 4-10/game, 0-3 civs fall, ends by science ~1975 or score at 2050.
  Fixed: negative arc radius from fx age (rAF timestamp < fx t0) -> clamp age >= 0.

## issues
- Headless screenshots use fallback fonts (fonts host mapped away), real look uses IM Fell.
- rAF `now` can be earlier than performance.now() at fx creation; any time-based radius must clamp.

## todos
- Better og.png without UI chrome.
- Wonders drawn on the map, more event variety per path.
- Sea path is picked less often than farm/herd; watch it.
