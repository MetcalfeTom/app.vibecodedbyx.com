# App Roulette

Spin the wheel to discover a random app from 460+ creations on sloppy.live.

## log
- 2026-01-31: Initial creation - slot machine spinner, confetti, sound effects, auto-redirect with cancel
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.
- 2026-09-26: pool now loads the live catalogue /app-directory/index.json (1,637 apps; the hardcoded ~460 list stays as fallback) and shows real app names from og:title (first part before ' — ', ' · ', ': ', capped 30 chars, HTML-escaped). Fixed the reel: .slot-track was flex-centred in the 80px window, so a 26-name reel sat ~1000px too high and the winner never appeared in the window — now absolutely pinned to top:0. SEO title/description/JSON-LD.

## issues
- App list is hardcoded; needs manual update when new apps are added

## todos
- None currently
