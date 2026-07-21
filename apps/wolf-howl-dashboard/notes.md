# wolf-howl-dashboard · notes

## log
- 2026-07-21: v1 — chat pick from poll ("Wolf Howl Dashboard — moon phases, howl leaderboard, lunar-themed UI"; original ask wanted Node.js+Tailwind+moon API — no backends here, so: static + Supabase, moon computed astronomically in-browser). **Moon**: age from 2000-01-06 18:14 UTC new-moon epoch, synodic 29.53058867d; illum=(1−cos(2πage/syn))/2; phase-name bins; next-full solver. VALIDATED against known dates: 2026-01-03 full (100%, the actual Wolf Moon), 2026-07-14 new (0%), next full 2026-07-29 ✓. Canvas moon: dark disc → lit semicircle on waxing/waning side → terminator ellipse (t=cos(2πage/syn); t<0 gibbous=extend light, t>0 crescent=bite back) + 26 seeded craters + limb. **Howl synth**: 3 harmonics (sine+2 triangles) glide 240→470→320Hz (±6% per-howl jitter), vibrato LFO→detune blooming after 0.55s, formant bandpass sweep 520→980→640, breath noise, 3.2s convolver cave; distant remote howls = 0.1 gain + random StereoPanner. **DB**: wolf_howls (howls int, name text, last_howl_at; read-all/own-writes; NO unique on user_id so no upsert — select-then-insert/update pattern, rowExists flag). Debounced 700ms persist batches rapid howls. **Realtime**: channel wolf-howl-live-v1 broadcast(self:false) 'howl' {n} → distant howl + AWOO floater + 1.8s-debounced lb refresh; presence → "N wolves in the night". **Full moon** (illum≥.97): banner + howls ×2. H key = howl. Rename via input (24ch) + claim. sloppyBarGetContext() username fallback → "lone wolf <uid4>". Grenze Gotisch + Alegreya + IBM Plex Mono; SVG pine skyline, twinkle canvas. TESTS: node e2e on real DB (insert/read/update/lb/delete all ok); stubbed live-fire (moon dates, 4 oscs/howl, broadcast, cooldown, distant echo, db write shape, lb render, XSS-escaped names); id cross-check; module syntax.

## issues
- No unique constraint on user_id (create_table tool doesn't add one) — a user double-booting VERY fast could insert two rows; select-then-update picks the first. Harmless for a toy leaderboard; could dedupe by taking max if it ever shows.
- Presence key = uid, so multi-tab same user counts once (intended).
- Northern-hemisphere moon orientation (waxing lights the right side).

## todos
- Howl streak (consecutive nights) with a 🌙 badge
- Pack chorus: if ≥3 howls arrive within 5s, layer a group-howl swell
- Moon calendar strip for the month
