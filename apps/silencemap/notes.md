# silencemap (SilenceMap — where the quiet seats are)

## log
- 2026-08-13: v1.1 — **watchability + decorations** (two chat requests, one pass). (1) Calm motion layer: "listening for reports" live pill (5s breathing dot, blips on every fetch, says "new quiet intelligence just arrived" for 5s when a fetch brings genuinely new rows — first load excluded); new-report venue cards get a soft settle glow (2 gentle pulses); on the map new reports emit two slow expanding rings in the venue's noise color; freshness dots breathe (4.2s); map dots breathe with per-venue phase (8fps repaint only while the map tab is visible); freshness TIER changes flip the badge once (rotateX). ALL of it dies under prefers-reduced-motion (CSS kill + JS gate on the canvas breathing). (2) Decorations: faint wifi/bluetooth/coffee inline SVGs beside the live pill (sway/steam, aria-hidden), plug + speaker glyphs inside the outlets/noise form labels (text labels unchanged), coffee in the empty state — and deliberately NOTHING added to the map (probe asserts zero SVGs in the map view). Verified 14/14 incl. live-db regression (list, map pixels, freshness tiers). PROBE LESSONS: `animation:none` serializes as expanded longhands in cssText — assert rule presence, not shorthand strings; and a `[^;]+;` regex sub eats function bodies containing semicolons — anchor replacements on full lines.
- 2026-08-13: v1 MVP per chat ("venue reports for open seats, outlets, noise level, timestamps, freshness, map/list browsing"). Single file, Spectral + Overpass Mono, hushed paper/teal palette.
  - **Backend**: new table `silencemap_reports` (venue/area/lat/lng/seats/outlets/noise + auto user_id/created_at; RLS read-all + insert-own). Anonymous auth lazily on first report (persistSession). Reports are append-only; a VENUE is the group of reports sharing a name (case-insensitive) — latest report wins the chips, count shown ("2 reports").
  - **Report flow**: toggle-reveal form — venue, optional area, segmented seats(none/few/plenty), outlets(none/some/plenty), noise(silent/murmur/lively/loud), OPTIONAL location via consent-gated geolocation (refusal → honest "list-only" spot). Insert failures reported plainly.
  - **Freshness (the trust signal)**: green fresh <2h ("just now"/"N min ago"), amber aging <8h, grey stale after (h/d granularity); stale venues also fade to 45% alpha on the map. List auto-refetches every 90s so badges age honestly.
  - **Browsing**: LIST (freshest venue first; chips colored by noise; distance km when user shares location) + MAP (canvas, relative lat/lng projection with soft grid — dots colored by latest noise teal→rust, labels, "you" crosshair, tap dot → jumps to its list card). Map note states plainly: sparse crowd map, NOT street navigation, no tiles.
  - Verified 12/12 LIVE against the real database (anon auth, form-path insert, list render + chips + fresh badge + list-only note, located insert via seam, map dot pixels, map honesty note, freshness tier math, tab switching, venue grouping w/ counts). First-run grouping miss was read-after-write timing on the very first insert — self-resolved, logic proven on rerun (2 venues × 2 reports). Two tasteful example venues left as seed content, labeled "seeded by the caretaker". 430px screenshot reviewed.

## issues
- Headless has no geolocation → located-report path tested via the __SM.setLoc seam; first real located report from a phone is the field E2E.
- Venue identity = exact name match (lowercased). Typos create twins ("north library" vs "north libary"). MVP-acceptable; fuzzy merge is a v2 decision.
- Map is relative projection of whatever's reported — two venues in different cities will look adjacent. The map note says so; if chat wants city clustering, group by coordinate proximity.

## todos
- "Update this spot" quick-action on a venue card (prefills the form).
- Coordinate-proximity clustering for multi-city sanity.
- Report history sparkline per venue (noise over the day).
- Optional Twitch shout when somewhere goes silent+plenty.
