# quiet-room (The Quiet Room)

## log
- 2026-08-11: v1 — mummarolf's zero-viewer stream discovery, built per chat after the feasibility audit. Single file. Hushed aesthetic: Cormorant Garamond italic + IBM Plex Mono, candle-amber on deep night blue, 4s breathing dot.
  - **Auth**: implicit grant with the pixl-pal Client ID, EMPTY scope (public Helix reads need a token but no permissions), CSRF state, hash-scrub incl. top-window (bar-wrapper aware), sessionStorage-only token, validate → login name. GATED ON OPERATOR STEP: `https://sloppy.live/quiet-room/` must be added as a redirect URL on the Client ID at dev.twitch.tv — until then Twitch shows a redirect error at login (the auth panel says exactly this).
  - **Mummarolf's method**: Get Top Games cursor-walked up to 8 pages (~800 categories) → `pickCategory` tail-weighted (pow(r,0.45) biases deep/niche where silence lives) → Get Streams per category (100) → `splitZeros`: viewer_count===0 split into fresh (≤1h since started_at, per spec) vs stale. Up to 12 categories per sweep, visited-set dedup, live sweep narration line per category. Fresh hits end the sweep; stale finds render under a "quiet for longer than an hour" divider (top 8). Error path re-enables the sweep button (probe caught the stuck-disabled bug pre-ship... actually caught in self-review).
  - **Cards**: Twitch's public live thumbnails (static-cdn previews-ttv, minute cache-bust), streamer, italic title, category + live-minutes + language, "0 viewers · could be you" badge. Click → theatre overlay: embedded player (unmuted — click is a user gesture), "you are NAME's first viewer.", Esc/leave-quietly closes and unloads the iframe.
  - **A11y**: role=dialog theatre with focus move, aria-live sr line, cards are real buttons with rich labels, ≥2.75rem targets, reduced-motion stills the breathing dot.
  - Verified: syntax + id cross-check; 15-check probe — pure (auth URL shape/empty scope, fragment parse incl. denied, tail-bias distribution >50% deep picks, fresh/stale split at the hour boundary, thumb URL, ago-minutes) + offline E2E with stubbed fetch (categories→loud-category skip→zero-viewer category hit, Whisper1 fresh card, OldSoul stale card under divider, loud stream excluded, badge, button re-enabled, theatre open with correct player URL + close unload). 0 errors.

## issues
- DORMANT until the redirect URI is registered (see auth note). Everything else is live-ready; helix calls verified only against stubs — first real login is the true E2E.
- Twitch thumbnails for just-started streams can lag a few minutes (Twitch generates them on a cycle) — cards may show the placeholder briefly.

## todos
- "Sweep deeper" button: continue past the first fresh hits for a fuller list.
- Language filter chip.
- A gentle counter: how many first-viewers the room has delivered (supabase, opt-in).
