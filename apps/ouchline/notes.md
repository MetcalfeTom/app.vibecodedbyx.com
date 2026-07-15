# ouchline · notes

## log
- 2026-07-15 v1.0: chat "one-tap daily health check-in — 1-5 pain slider + trigger dropdown, stores locally, one-page PDF timeline for doctor appointments". HEALTH DATA = LOCAL ONLY: no network APIs, localStorage ouchline-v1, erase-all button w/ confirm, banner states it. Check-in: 1–5 slider w/ live face/word feedback, 12-trigger dropdown, 80-char optional note, one entry per day (upsert overwrites today's). Timeline: 30-day SVG bar spark (pain-colored, gap ticks for unlogged days) + last-14 list w/ per-entry delete. PDF: hidden #report node + @media print (visibility trick) → native print-to-PDF, zero libraries — one A4 page: stats strip (days/avg/worst/top trigger), 30-day chart, entries table, "not a diagnostic document" footer. Fraunces + Atkinson Hyperlegible (accessibility-first face for a health app).

## issues
- One entry/day by design; intraday flares need the note field.
- Print view relies on visibility:hidden trick — if the injected top bar ever forces visible styles under print, re-test.

## todos
- Optional second metric (sleep quality) if chat asks.
- JSON export/import for device moves (still local).
