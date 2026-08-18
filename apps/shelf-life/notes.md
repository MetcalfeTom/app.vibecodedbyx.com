# Shelf Life — 3D pantry & fridge inventory prototype

## log
- 2026-08-18: v1 per chat request. Mobile-first single file, zero network at runtime (fonts/OG only).
  - **3D units**: CSS perspective box (back wall + rotateY side + frame), fridge = steel/mint w/ interior glow, pantry = wood; 3 shelves each (rotateX'd surface + lip), items as emoji tiles popped translateZ(1.6rem) with expiry dot, qty badge, name plate.
  - **Drag between shelf zones**: pointer events + fixed-position ghost; unit tabs are drop targets for cross-unit moves (elementFromPoint); shelf resolution is BAND-BASED (pointer Y over the box divided in 3) because projected 3D shelves overlap in screen space — elementFromPoint at a shelf's rect center genuinely hit the wrong plane in testing. Tap-without-move opens the detail sheet.
  - **Cataloguing**: 30-item CATALOG (name/emoji/default home/typical shelf-life days); quick-pick fills name+emoji+unit+auto expiry (today+typical, editable); free-text items fine. Detail sheet: qty stepper, expiry edit, eaten/toss (tracked), move-unit.
  - **Expiry nudges**: state fresh/soon(≤3d)/dead; aria-live nudge strip prioritizes expired (names) then eat-soon (with day counts); dots on tiles; detail sheet notes ("expires today — tonight is its night").
  - **Meal brain (local)**: 14 RECIPES w/ needs+plus keys; suggest() pure fn — full matches "ready now (with your X & Y)", missing-one "just missing X", and expiring-item boost ("uses your milk before it turns") ranked to the top. No network, fully testable.
  - Suite sl-probe 23/23 incl. REAL pointer-event drag through the 3D transform, probe-vs-projection lesson, computed-visibility guard.
  - Design-review catches: (1) empty-state overlay showed over stocked shelves — author display:flex beat UA [hidden]; fixed with [hidden]{display:none !important} + a computed-style suite check (repeat offender — lesson bank). (2) probe qty check assumed qty 1 — fixed to assert delta (count-from-data lesson, again).

## issues
- Drag drop resolution is band-based by design (projected 3D shelves overlap; exact plane hits mislead) — if shelf count changes, bands auto-follow SHELVES.
- Emoji render as tofu in headless probes only.

## todos
- Shopping-list generation from missing recipe ingredients
- Waste stats page (eaten vs tossed over time)
- Barcode-ish quick re-add of recently removed items
- 2026-08-18 (2): BOLD PAIRING CHALLENGE per chat (two requests merged; second added "delayed explanations").
  - Opt-in card under the meal panel: off by default with an invite; S.bold={enabled,allergies,skipped,done} migrated onto old saves, everything localStorage-only.
  - 14 curated PAIRINGS (honey+cheese, garlic+honey, banana+cheese/cartola, eggs+soy, oats+tomato, lemon+pasta…) each with an honest food-logic why. Only pairings whose BOTH ingredients sit on your actual shelves are offered (reuses fuzzy have()).
  - **Delayed explanation**: the why is hidden behind "why would this work? →" per pairing; re-hides when the card changes (dataset.revealed keyed by pairing id, not persisted).
  - **Allergy warnings**: ALLERGENS map (dairy/egg/gluten/fish/soy) → chips on every card ("contains: dairy" / "none of the big five"); device-local allergy checkboxes FILTER matching pairings out entirely with a hidden-count note.
  - **Skip controls**: skip → persists + advances; "bring skipped back" reset; "dared it ⚡" tallies a score ("coward's shelves" until first dare). Exhausted/empty states distinct.
  - First-impression fix from screenshot review: default seed had ZERO valid pairings — added honey + lemon to seeds (unlocks 4 dares + enriches meal matches).
  - Suites: bp-probe 15/15, core regression 23/23.
- 2026-08-18 (3): LOCAL PHOTO CAPTURE per chat — optional, honest, editable-before-suggest.
  - Entry: dashed "📷 or snap your groceries" strip atop the stock sheet → dedicated bottom sheet. `<input type=file accept=image/* capture=environment>` → objectURL → 96×96 canvas → revoked immediately. **The photo never leaves the device** and the sheet says so in bold.
  - **Guesser is honestly local**: guessIngredients(pixels,w,h) — pure HSL hue-bucket voting (red/orange/yellow/green/brown/white families → catalog candidates, 4% pixel threshold, max 6). Labeled as "color guesswork, not cloud vision". Dark/unreadable photos yield zero guesses + a hand-add prompt, never fake confidence.
  - **Editable before suggestions** (the actual req): guesses render as keep/discard chips (aria-pressed, strikethrough when discarded), a "missed:" input with catalog datalist adds more; commit button live-counts kept items. NOTHING touches shelves, storage, or the recipe panel until commit — probe asserts suggestions are byte-identical pre-commit. On commit: catalog defaults (emoji/home/typical expiry) applied, sheets close, meal brain updates.
  - Zero-network guarantee probed with a fetch+XHR sentry across the entire flow (0 calls).
  - Suites: ph-probe 15/15 (incl. synthetic-pixel guesser cases: red→tomato, green→lettuce, dark→none, mixed→both), core 23/23, bold pairing 15/15.
- 2026-08-18 (4): header camera button per chat — prominent orange "📷 snap" beside the fridge/pantry tabs (#unitsrow flex wrapper), opening the exact same local editable photo flow; sheet-strip entry kept. New cam-probe 5/5 + all three prior suites re-green.
  - **BUG FOUND & FIXED while here (was live!)**: earlier patches replaced the marker comment `/* ── unit tabs ── */` — which exists in BOTH the CSS and the JS — via python str.replace, which replaces ALL occurrences. Result: ~5.9KB of bold-pairing + photo-flow JS was duplicated as garbage inside `<style>`, breaking CSS parsing at that boundary (first symptom: the new #unitsrow flex rule computing display:block). Excised with index surgery + an assert that `<style>` contains no addEventListener. LESSON: patch scripts must use s.replace(old,new,1) AND assert s.count(old)==1 — comment markers repeat across CSS/JS sections.
- 2026-08-18 (5): gallery upload beside camera per chat — second hidden input WITHOUT capture (camera input keeps capture=environment), two side-by-side buttons in the photo sheet, both feeding the shared handlePhotoFile() → same local preview → editable chips → explicit commit. gal-probe 7/7 fed a REAL canvas-made PNG blob through the gallery path (red → tomato guess → discard → add rice → commit shelves only the edited set). All four prior suites re-green (15/23/15/5).
- 2026-08-18 (6): build stamp per chat — "build v1.4 · 2026-08-18 · 687d39ccf" (gallery commit) in the footer, Space Mono. Layout intact (overflow probe PASS). Core suite 23/23. Same versioning convention as loose-leaf/parla.
- 2026-08-18 (7): v1.5 — clearer shelf boundaries + conservative guesses per chat.
  - **Drop bands**: dragging any item reveals a labeled 3-band overlay (top/middle/bottom shelf) sized over the 3D box, active band highlighting live with the pointer — the band-based drop logic is now VISIBLE instead of implicit. Hidden again on drop/cancel.
  - **Conservative guesser**: white bucket REMOVED (counters/packaging false-positive machine — solid white now guesses nothing and says so in the sheet copy), pixel floor 4%→9%, one item per family unless the family exceeds 25% dominance, hard cap 4 guesses. Copy updated: "deliberately conservative — fix and fill the rest below."
  - Probe lesson: my first "conservative" assert contradicted the spec — at 50/50 BOTH families are dominant and rightly open up; the honest test is the 20/80 split (minor red → tomato only; dominant yellow → full family).
  - Suites: bands 6/6, photo 17/17 (updated for the new behavior), core 23/23, bold 15/15, gallery 7/7, header-cam 5/5.
