log:
- v2: Added power-ups (Double Jump, Time Slow, Super Jump) with on-canvas pickups and timers, plus Achievements (floors, combos, first power-up, saved score, new PB) with toasts and local persistence.
- v1: initial playable Icy Tower clone with canvas physics, mobile controls, leaderboard via Supabase (table icy_tower_scores), OG metadata, favicon, and livestream backlink.

issues:
- Supabase root config can throw errors if elements missing; this app uses a scoped copy with null-safe premium toggles.
- Physics tuned for responsiveness; browser differences in high-DPI scaling can affect jump feel slightly.
- Sound uses WebAudio oscillator beeps; some mobile browsers require user interaction before audio.
 - Power-up spawn chance currently 8%; tune difficulty based on feedback.

todos:
- Add wall slides and combos for faster climbs.
- Add ghost replay of best run.
- Add premium visual themes and particle effects.
- Add daily challenge seed and daily leaderboard.
 - Persist achievements per user in DB if requested; add unique power-up art.

notes:
- Table: icy_tower_scores (score int, display_name text, user_id auto via RLS tool, timestamps auto).
- Always pass user_id when inserting. Reads are public per default policy.
