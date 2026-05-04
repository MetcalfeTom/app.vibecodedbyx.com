# steam-swipe

## log
- 2026-05-04: shipped — Tinder-style game discovery with 8-bit retro covers + persistent favorites.
  - **Card deck mechanics**: 3-card stack visible (top + 2 staggered behind), drag the top card with pointer events to swipe. Right (>90px Δx) = FAVORITE, left = PASS, up (<-100px Δy) = SHORTLIST. Card translates + rotates with drag delta, snaps back on release if under threshold.
  - **Verdict overlays**: live FAV / PASS / SHORTLIST stamps fade in proportional to drag intensity. Card flies off-screen on commit (320ms ease-in), then the next card scales up.
  - **Action buttons**: ↶ undo · ✕ pass · ⭐ shortlist · ♥ favorite. Each press fires a `punch` keyframe (scale 1 → 0.86 → 1.10 → 1) for tactile feedback and a snappy NES-style square click.
  - **Keyboard**: ←/→/↑ swipe, Z = undo, F = toggle favorites drawer, Esc closes drawer.
  - **Catalogue (chat ask)**: 38 famous-game riffs (Portal Capsule, Stardew Hollow, Hades & Hers, Among Sus, Hollow Sprite, Disco Elerium, Hades, Vampire Survlords, Slay the Sleeve, Outer Wilds Brew, Celeste Variations, Risk of Frame, It Takes Three, Factorio Fantasia, Tunic Proof, Balatro Variant, Inscryption Booster, Citizen Beep, Baba You, Cult of the Lamp, Animal Well-er, Lethal Comp, Helldungeon 2, Karlson 2D, Chained Together, etc.). Each card has tags, year, price, Steam-style rating ("Overwhelmingly Positive", "Mostly Negative", etc.), and a one-liner blurb.
  - **8-bit pixel covers (chat ask)**: 15 hand-drawn 16×16 sprites (portal cube · wheelbarrow · sword · ghost · card · crown · rocket · gear · coin · skull · mushroom · helmet · D-pad · headphones · generic). `pickSprite(g)` auto-assigns by tag mix. Each sprite is rendered to a 16×16 canvas with a 4-color palette derived from the game's accent (transparent / shadow at 30% / body at accent / highlight at 145%), then CSS-scaled crisp via `image-rendering: pixelated` to a 9rem chunky icon centered over the SVG cover art.
  - **Procedural SVG cover art**: ~20 background motifs (rings, leaves, spiral, grid, wave, orbit, cards, planets, mountain, arrows, gears, bones, stars, fox, desert, walls, puzzle) under the pixel sprite. Each motif gets a per-game accent + dark gradient overlay so the title remains readable.
  - **Snappy SFX (chat ask)**: pure NES square-wave envelopes, all 25-110ms with 25-35ms intervals between notes. FAV = 3-note rising arpeggio (523→784→1047 Hz), SHORTLIST adds two more (1568, 2093). PASS = 3-note descending (330→220→165). UNDO = 2-note up (880→660). Click on every action button fires a 25ms 1760Hz blip.
  - **Persistent favorites list**: stored in `localStorage['steamswipe-favs-v1']` as full game records + `shortlist:bool` + `addedAt` timestamp. Drawer slides in from the right, lists each fav with mini-thumb (gradient from bg→accent), title, tags, price, ★ shortlist badge. Per-row ✕ remove + footer 📋 COPY (writes a markdown-ish list to clipboard) + ⌫ CLEAR (with confirm).
  - **Undo**: tracks the last swipe; pressing ↶ rolls deckPos back, removes the just-added favorite if applicable, and re-builds the stack. Disabled when nothing to undo.
  - **NEW DECK** pill in the HUD reshuffles the 38-game catalogue and resets deckPos (favorites untouched).
  - **Empty state**: when the deck runs out, shows "you've swiped through every game", with a `↻ NEW DECK` button to restart.
  - **Aesthetic**: deep Steam-blue palette (#0e1a26 bg / #1b2838 panel / #66c0f4 accent), Bowlby One SC chunky title with cyan accent, Cormorant italic tagline, IBM Plex Sans body, IBM Plex Mono for HUD/meta. Tiny radial-glow background on body. Cards have rounded corners + dark shadow + 2px panel borders.
  - **Loop / state**: synchronous (no rAF needed). Stack rebuilt on every swipe; only the top card has drag listeners.
  - **Accessibility**: rem units, 44px+ targets, aria-pressed/aria-live status, role="application" on deck wrap with control summary, `inert` toggles on the favorites drawer, focus-visible outlines, `prefers-reduced-motion` kills card transitions + drawer slide + punch animation, skip link to the deck.

## issues
- 38 games is a tight catalogue — the deck runs out in maybe a minute of fast swiping. Easy fix: add more entries to `GAMES`.
- Pixel sprites are accent-tinted but the dark/highlight derivations are simple multiplications; very pale accents (white-ish) compress to a grey. Could special-case low-saturation accents.
- Cover art shapes were chosen by name/tag, not by actual game theme — the assignments are evocative, not editorial.
- Drag detection uses pointer events; on very old Safari versions it may need a touch-events fallback.

## todos
- Persist seen game IDs separately so a NEW DECK reshuffles only the unseen pool (until exhausted, then full reshuffle).
- Group favorites by tag in the drawer.
- Per-game share button → drops a tiny SVG card with the cover.
- More sprites + per-game sprite override field on each catalogue entry.
- Optional Steam API integration (would require a CORS proxy).
