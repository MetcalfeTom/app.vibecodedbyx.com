# saturday-supper

## log
- 2026-05-02: Created. **Three-course Saturday-night dinner generator: greens / main / dessert.** Single-file editorial-cookbook layout. **Pools**: 11 greens, 16 mains, 12 desserts — each `{name, desc (Newsreader italic 1-liner), tags, vibes[]}`. **Vibe filter bar** with 7 pills: any · cozy · adventurous · light · comfort · fancy · lazy. Each dish carries a `vibes` array; `pickRandom(pool, vibe)` filters the pool to vibe matches and falls back to the full pool if filter would yield nothing. **Per-course color system**: greens = sage-deep `#3e562d`, main = terracotta `#c4624a`, dessert = plum `#7a3d54`. Each course renders as a stacked block with all-caps Plex Mono rubric ("№ 01 · GREENS"), Fraunces 700 italic dish name (clamp 32–46px), Newsreader italic gray descriptor, then a row of tag chips + tiny circular reroll button (↻). 2px black rules separate courses. **Master shuffle** big terra button bottom-right with 5px black drop shadow + paper-shake keyframe (±2px translate + ±0.4° rotate over 320ms) on every shuffle. **Lock toggle**: tap a course block to lock it (gold border + LOCKED badge); locked courses survive shuffle. **Aesthetic**: cream paper `#f3eadc` bg with multiply-blend 11°/101° fiber grain + corner radial glows (terracotta top-left, sage bottom-right). Fraunces italic display + IBM Plex Mono UI + Newsreader italic descriptions. Header has gutter marks "VOL. I" / "Nº SAT-001" / "MENU FOR ONE NIGHT". Pollinations OG (no `referrer`), 🍽️ favicon. **Mobile**: single-column responsive at 680px, shuffle button stays sticky-friendly at bottom-right.

## issues
- Vibe filter is OR not AND — a "fancy" filter on a dessert tagged `[fancy, comfort]` matches; can't combine "cozy AND lazy" yet.
- Pollinations OG image is a generic cream-paper editorial render (no text) — could be hand-designed for stronger share preview.
- Dish pool is curated (~39 items total) — heavy use will see repeats within a session even with vibe filtering. Each pool has ≥6 items per common vibe so early variety is fine.
- "Lazy" tag is light on dessert options — only a handful of desserts qualify; filter falls back to full pool faster than other vibes.
- No persistence: refresh wipes locked picks.

## todos
- Persist locks + last roll to localStorage so refresh keeps the menu.
- "Save tonight's menu" → download as a tiny printable PDF or `.png` recipe card.
- Multi-vibe AND filter (cozy AND adventurous) via toggle chips.
- Wine/drink slot as optional 4th course (toggle on header).
- Shopping-list export: pull each dish's `desc` and ask Pollinations to extract ingredients.
- Voice/TTS read-the-menu mode for hands-free dinner-prep.
