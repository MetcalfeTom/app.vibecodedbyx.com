# whos-that-shadow

## log
- 2026-06-27: shipped (chat ask: "Who's That Shadow game with real Pokémon silhouettes, a countdown timer, and a local leaderboard — start with gen 1, use pokemon svg shapes from a free source"). Named "Who's That Shadow?" (generic branding; no Pokémon logo/wordmark used).
  - **Sprites from PokeAPI** (free, no key, no registration): `raw.githubusercontent.com/PokeAPI/sprites/.../other/dream-world/{id}.svg` (vector — "svg shapes from a free source") with onerror fallback to `.../official-artwork/{id}.png`. Rendered as a pure-black **silhouette** via CSS `filter:brightness(0)`; on answer the filter is removed for the colored reveal + white flash + "It's NAME!". Images are fetched at RUNTIME from the third-party source — none are bundled into the repo. Footer credits PokeAPI + Nintendo/Game Freak/TPC.
  - **Gen 1**: 151 names hardcoded in `DEX` (id = index+1); image URLs built by id. No JSON API call needed (more robust). Verified count = 151.
  - **Round flow**: random mon → 4 shuffled choices (1 correct + 3 random distractors). Spinner while the sprite loads; the **countdown only starts once the image is loaded** (so the clock isn't eaten by loading). Per-round timer drains from 8.0s, shrinking ~180ms each round to a 4.2s floor for ramping pressure; bar goes red <35%.
  - **Scoring**: correct = `50 + round(remainingFrac*100) + streak*15` (speed + streak bonus). Wrong answer OR timeout ends the run (one-life arcade format). Score/Streak/Best HUD chips.
  - **Local leaderboard** (`localStorage['wts-leaderboard-v1']`, top 10 by score, stores name/score/streak): game-over prompts for a name only if the score qualifies; remembers last name (`wts-name`); highlights the just-placed row. "Play again" auto-saves a pending qualifying score if the player skipped the name entry.
  - **Controls**: click options or press **1–4**; Enter submits the name. **WCAG**: real `<button>` options, role=group on choices, role=status aria-live announces correct/wrong/time + the reveal, img alt stays "Mystery silhouette" (doesn't leak the answer), focus-visible yellow rings, ≥2.9rem targets, rem units, prefers-reduced-motion kills anim. Single-column options under 380px.
  - **Aesthetic**: retro TV broadcast eyecatch — deep-blue radial bluescreen + scanlines, silhouette in a spotlight vignette, chunky Lilita One title with navy stroke + yellow drop (homage, NOT the official logo), Space Mono HUD. Yellow/blue palette.
  - Verified: inline script syntax OK; DEX=151; no stray invalid colors.

## issues
- Depends on raw.githubusercontent.com/PokeAPI being reachable at runtime. If a sprite 404s, the svg→png fallback covers it; if BOTH fail the round still shows a broken img (rare). Could add a skip-on-double-fail later.
- dream-world SVGs don't exist for every Gen-1 id; those silently fall back to official-artwork PNG (still a clean black silhouette via the filter).
- Distractor names are fully random within Gen 1 — no "same type/evo" smart distractors yet (would make it harder/fairer).
- IP: this is a fan guessing game; sprites are hot-linked from the third-party PokeAPI sprite repo, not reproduced into this repo. Names are factual data. Footer credits source + rights holders.

## todos
- Gen 2+ toggle (extend DEX + ids; PokeAPI covers all gens by id).
- Smarter distractors (same type or evolution family) + a difficulty selector.
- Online leaderboard via Supabase (optional) alongside the local one.
- "Endless vs Timed 60s" modes; a daily silhouette.
- Preload the next round's sprite during the current round to kill the spinner.
