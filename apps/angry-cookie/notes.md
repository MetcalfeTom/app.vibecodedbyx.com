# Angry Cookie Clicker

## Log
- Initial creation: Cookie that gets progressively angrier with each click
- Added database integration for global stats and high scores
- Updated to go through Five Stages of Grief: Denial → Anger → Bargaining → Depression → Acceptance
- Cookie now reaches enlightenment after 121+ clicks
- 2026-09-26: CSP now allows Google Fonts (Rubik was silently blocked); removed old 'View All Apps' backlink
- 2026-09-26: Makeover
  - Hand-drawn SVG cookie (bumpy edge, chips) with a face per stage: side-eye + sweat drop (denial), angry brows + steam (anger), red tint + teeth + more steam (rage), big sparkly eyes + offered chip "take it?" (bargaining), droopy lids + tears (depression), greyed out (sadness), closed eyes + halo (acceptance)
  - Damage: cracks at 45/70/90 clicks, bites at 101 and 121 (SVG mask)
  - Crumbs fly on every click, squish (shake in anger/rage), speech bubble per click
  - Gingham tablecloth + plate look, Bowlby One + Grandstander
  - Grief track with 8 segments replaces the old mood bar; duplicate "Anger Level" stat removed
  - "Bake a fresh cookie" reset at acceptance
  - Scores fixed: old code only ever *updated* global_stats rows that never existed, so nothing was saved. Now per-player rows in user_stats (app 'angry-cookie', keys 'clicks' and 'best'): update own row, insert if none. Everyone = sum of clicks, record = max best. Saves batched 1.5 s after the last click + on pagehide.
  - Local og.png (rage frame)
  - Crunch sound per click (filtered noise: sharper when angry, soft and low when sad), mute button bottom right (`ac_muted`)

## Issues
- The old global_stats rows for this app never existed (anon reads empty) → old totals are lost, starting fresh

## Todos
- Maybe: leaderboard of top grievers, or sound (crunch + little voice)

## Notes
- Stages: Happy (0-10), Denial (11-20), Anger (21-40), Rage (41-60), Bargaining (61-80), Depression (81-100), Sadness (101-120), Acceptance (121+)
- faces[] and insults{} data kept from the original; FACE{} in the script draws each stage
- `window.__ck` = { clicks (get/set), paint, drawFace } for headless tests
