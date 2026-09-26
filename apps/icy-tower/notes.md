log:
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.
- v3.1 (2026-09-26): combo shouts like the original — a combo of 3+ multi-floor jumps that ends (1-floor step, fall, or 3 s timeout) pops GOOD!/SWEET!/…/NO WAY! (one step per 6 combo floors) with "N FLOOR COMBO" on the canvas. `endCombo()` is the single place a combo ends.
- v3 (2026-09-26): real Icy Tower rules. Platforms carry a number `n` (ground 0, `game.topN` counts new ones); your floor = highest n you landed on, so re-landing on the same platform no longer farms floors (old code did floor++ on every landing high on screen). Combo = consecutive jumps that skip 2+ floors (3 s timer; a 1-floor step or falling ends it). Run-up: past 62% of maxSpeed (9) you gain only 0.12/frame (0.036 in air) → full speed ≈ 25 frames; jump = jumpForce × (1 + 0.4 × clamp((|vx|−4)/5)) → ~180 px standing, ~316 px at full run. Walls replace screen-wrap: airborne bounce keeps 92% speed, on the ground you just stop. The tower sinks once you reach floor 5 (0.55 px/frame, +0.45 every 30 s, cap 3.6; Time Slow halves it) with a canvas HURRY UP!. Every 10th platform shows its number. Snow bumps no longer re-randomise every frame; red/green platforms fixed (hue was a float, so `% 2 === 0` never hit → all green). Headless-verified with a stubbed backend (16 checks).
- v2: Added power-ups (Double Jump, Time Slow, Super Jump) with on-canvas pickups and timers, plus Achievements (floors, combos, first power-up, saved score, new PB) with toasts and local persistence.
- v1: initial playable Icy Tower clone with canvas physics, mobile controls, leaderboard via Supabase (table icy_tower_scores), OG metadata, favicon, and livestream backlink.

issues:
- Old board (icy_tower_scores) was polluted: fake 999999999-style rows inserted straight through the API on 2026-08-18, an insulting name, plus pre-v3 farmed floors. Left untouched; the app no longer reads it.
- Season 2 = table **icy_tower_season_two** (score = floor, best_combo, secs, user_id auto). Display filter: 0 < score ≤ 5000, score ≤ secs×5+10 (a real climb tops out around 3.5 floors/s), one row per user_id (best). Direct API inserts are still possible — the filter only stops the lazy ones.
- Supabase root config can throw errors if elements missing; this app uses a scoped copy with null-safe premium toggles.
- Physics tuned for responsiveness; browser differences in high-DPI scaling can affect jump feel slightly.
- Sound uses WebAudio oscillator beeps; some mobile browsers require user interaction before audio.
 - Power-up spawn chance currently 8%; tune difficulty based on feedback.

todos:
- Add ghost replay of best run.
- Add premium visual themes and particle effects.
- Add daily challenge seed and daily leaderboard.
 - Persist achievements per user in DB if requested; add unique power-up art.

notes:
- Table: icy_tower_scores (score int, display_name text, user_id auto via RLS tool, timestamps auto).
- Always pass user_id when inserting. Reads are public per default policy.
