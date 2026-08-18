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
