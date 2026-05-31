# treasure-map · notes

## log
- 2026-05-19: v1 — **procedurally-generated pirate treasure map with hidden loot, sea monsters, and aged parchment aesthetic**, per chat ask "create a pirate treasure map generator with hidden loot and sea monsters". Single-file ~33KB, deterministic mulberry32 seeded generation, URL-hash shareable seeds, zero deps.
  - **Seeded generator** · `mulberry32(fnv1a(uppercased seed))` PRNG. Default seed `BLACKBEARD`. "⚓ New Chart" button uses the input; "⚂ Random" generates a pronounceable CVCV alternation (4-8 chars). Seed syncs to `location.hash` so URLs are shareable.
  - **Procedural map** · `generateMap(seedStr)` produces deterministic content:
    - **4-7 islands** placed with min-spacing constraint (rejection sample up to 60 tries). Each has organic outline of 24-32 polar-perturbed points (`r = baseR × (0.7 + 0.55·rng)`), rendered via Catmull-Rom-smoothed closed Bezier.
    - **Per-island detail**: 1-3 mountains (small triangles + shade line), 1-4 palm trees (curved trunk + 4 frond arcs), shore-halo dashed outline, ground shadow ellipse, brown shade splotch.
    - **6-9 treasures**, 70% placed inside an island disc, 30% in open water (with min-distance from islands). Each gets a treasure TYPE (10 options: doubloons, bloodgem, cursed ring, burial urn, ancient amphora, coded map, officer's cutlass, royal seal, trident pendant, ivory carving) with a value range and a flavor line.
    - **2-4 sea monsters**: kraken (5 tentacles + suction dots emerging from a wave splash), sea serpent (S-curve body + spines + head with eye/fangs + tail fin), white shark (dorsal triangle + water disturbance arcs), mermaid (curving tail + scale arcs + splash), whirlpool (parametric spiral via polar plot + 2 outer rings). Each rotated by a random angle, with a small italic "monster name" label.
    - **Route line** in wax-red dashed (`stroke-dasharray: 4 3`), connecting the first 3-4 islands via mid-perpendicular curved Bezier (so it bends slightly, looks hand-drawn).
    - **Compass rose** in the top-right corner: outer ring + inner ring + 8 cardinal/diagonal ticks (major/minor thickness) + N/E/S/W labels (N in wax-red, others ink), 4-pointed primary star + smaller perpendicular star + center pin.
    - **Your ship** anchored at the first island: dark wooden hull + mast + double sails + tiny wax-red pennant + italic "— your sloop, anchored —" caption.
    - **Sea labels** 1-2 sprinkled italic in sepia ink at far gaps from islands ("Sea of Sighs", "Drowners Bight", "The Cursed Channel", etc).
  - **X marks the spot** · all ISLAND treasures show a visible red X on the map. UNDERWATER treasures have NO X — you have to guess. Once found, the X is removed and replaced with a tiny gold X on a gold-tinted disc.
  - **Dig mechanic** · click anywhere on the parchment to dig. Priority:
    1. **Sea monster within 44u** → triggers an encounter (lose something, gain or lose doubloons, screen shake)
    2. **Visible-X treasure within 28u** OR **hidden treasure within 14u** → found, added to inventory, X replaced with gold mark
    3. **Otherwise** → red herring (8 jokes: old boot, dead crab, salted herring, "KING'S NOSE STILL OFF 1671" newsprint, half-remembered shanty, lifetime salt pork, single wet sock, just rocks)
    - Double-click within 12u of an existing dig is ignored (no double-credit).
    - Each dig leaves a small dig mark (X + dashed circle) so you can see where you've already searched.
  - **Reveal toasts** float at the dig location for 2.6s with the icon + name + flavor line. 3 styles: normal (wax-red headline), bad (dark-blue red-herring), monster (wax-red with shake).
  - **Stage shake** on big events (treasure found, monster encounter).
  - **Loot panel** top-right, sticky, with: title in UnifrakturCook, item list with icon + name + value-in-doubloons, total worth at the bottom. Animates new items in with a 0.5s slide-right. Auto-collapses on mobile (<720px) with a "📜 your haul" toggle button that pops the full panel back open.
  - **Stats bar** in the top header: hauls (found/total), beasts encountered, digs taken.
  - **Aesthetic** · cream/tan parchment radial-gradient background with 7°/97° fiber grain + burnt-edge corner vignettes via inset radial-gradients. SVG elements: islands in deep parchment fill with brown shade ellipse, all line work in dark sepia ink (`#1d1108`), wax-red `#9a1a1e` for X marks/route/title, sepia italic labels in IM Fell English SC. Top bar styled as a parchment plate with UnifrakturCook title ("Pirate Treasure Map · chart no. 042"). Wax-red "New Chart" button with `box-shadow: 0 2px 0 #5a0c10` tactile press.
  - **Typography** · UnifrakturCook (blackletter title/panel headers) + IM Fell English SC (small-caps technical labels) + IM Fell English (italic + roman body) + Cormorant Garamond italic (hints) + JetBrains Mono (technical seed input + value badges).
  - **Responsive** · stage aspect-ratio drops from 3:2 to 1:1 below 820px, loot panel shrinks + auto-collapses below 720px.
  - **WCAG basics** · semantic header/main/aside, `aria-label` on the map, focus-visible wax-red outline, ≥36px button targets, prefers-reduced-motion kills the shake + reveal-toast bounce. Color contrast on the dark sepia ink vs cream parchment exceeds 7:1.
  - **OG image** · Pollinations flux seed 1715, "Aged parchment pirate treasure map with hand-drawn islands, kraken tentacles, sea serpent, compass rose, red X marks, sepia ink, editorial". No `referrer` param per project notes.

## issues
- The catmull-rom island smoothing can produce self-intersecting loops if any two outline points are too close — currently relies on the per-point min angle/spacing of the polar generator. Hasn't visibly broken on any seed I tested but worth watching.
- The "click to dig" hit detection uses raw SVG viewBox coordinates; the conversion from pixel → SVG accounts for the `preserveAspectRatio="xMidYMid meet"` aspect-fitting but not for any future zoom transform.
- Underwater treasures have a tiny 14u hit radius — they're INTENTIONALLY hard to find. If chat thinks it's too brutal, bump to 18-20.
- Sea monsters are decorative — clicking them just gives a small flat-rate gold reward/loss. Could be expanded into a mini-battle (D&D-style HP bar).
- All red-herring jokes are English-only.
- Compass position is hard-coded top-right; if an island generates very close to (1090, 110) the compass overlaps. Could be made island-aware but rarely an issue.

## todos
- "Save chart as PNG" button that exports the SVG with all current dig marks/found treasures.
- Multi-page maps with "turn page" mechanic (chart 1 of 3, etc).
- Day-night cycle: a "sail at night" toggle that dims the parchment and reveals constellations.
- Cursed treasure: 10% chance any haul has a hidden curse that periodically drains 1 doubloon for 60s.
- Twitch chat → "send a search party": chatters type "!dig X Y" to suggest dig spots.
- Higher-difficulty seeds: "WIDOWMAKER" tier with more monsters + smaller treasure radii.
- A small captain's-log panel that records each dig as a journal entry.
- Sound: gull cries, distant waves, "ARRR" on treasure find (with mute toggle).

## design notes
- The smoothClosedPath() catmull-rom-to-bezier algorithm produces much nicer organic islands than straight-line polygons; cost is one Bezier per point instead of one line.
- Choosing IM Fell English for body type (instead of more obvious "Pirate" fonts like Pirata One) gives a more authentic 17th-century engraver feel.
- Per-event shake is throttled by removing+re-adding the class with a forced reflow (`void s.offsetWidth`) so multiple shakes within the animation duration still register.
- Used pure SVG over Canvas — at viewBox 1200×800 there are maybe 600-800 SVG elements per map, well within performance, and we get free scaling + sharp lines.
- No `transform-box: fill-box` on any SVG group (per the lesson from windows-11-recall-nightmare's animation debugging). All rotations are done via the SVG `transform` attribute on `<g>` wrappers, which is reliable across browsers regardless of display state.
