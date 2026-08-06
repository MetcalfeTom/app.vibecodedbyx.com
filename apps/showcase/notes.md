# showcase (The Hall)

## log
- 2026-08-06: v1 — **hall-of-fame page with curated list + live vote counts** (chat ask, following a full-gallery vote scout: 1,485 apps, 310 with votes, ranked via the `get_app_votes` RPC with auth votes ×3).
  - **Curation** (baked into the page as of today's scout): Podium = windows-11-recall-nightmare (#1, score 22), windows-95, prompt-optimizer. Gallery = emoji-animator (perfect 12/0 record), simpsons-road-rage, icy-tower, sand-sandbox. Special Wings = sloppygram (MOST DEBATED — 32 votes split ~even), sloppyscape (BUILT BY CHAT — months of collaborative dev, low votes because everyone was building not voting), neon-aquarium (STREAM-NATIVE — Twitch chat becomes fish).
  - **Live votes**: client-side `POST /rest/v1/rpc/get_app_votes` with the 10 slugs (inline anon key — public by design); score = 3(auth⁺−auth⁻)+(anon⁺−anon⁻) shown on a gold plaque per card with raw ▲/▼ counts. Graceful fallback if the RPC fails ("the plaques stand on reputation"). Verified in real headless Chromium: fetch succeeded even from the sandbox, 10 cards, 0 errors.
  - **Aesthetic**: museum hall — deep emerald velvet with gold gilt frames, Gloock display serif + IBM Plex Mono, podium layout (center card scaled, #1 in the middle), rank medallions, wing tags color-coded, screenshot "paintings" from /screenshots/<slug>.jpg with onerror hide. Footer nudges the ×3 logged-in voting.
  - **A11y**: semantic main/sections with labels, aria-live status line, focus-visible gold outlines, reduced-motion kills hover lift, rem sizing.
  - Cards link internally to /<slug>/ (internal navigation, not external links).

## issues
- Curation is a hardcoded snapshot — the vote data is live but the LIST is editorial (as requested). If the leaderboard shifts a lot, re-run the scout (script pattern: chunked RPC over all slugs from `ls apps/`) and refresh the arrays.
- Homepage pinning is impossible from here (server-generated grid, root-owned) — this app IS the pinned showcase workaround. Flagged for operators if they ever want to link it from the bar.

## todos
- Auto-curation mode: fetch votes for ALL apps client-side (chunked) and render a live top-20 below the editorial picks.
- "Rising this week" section once vote timestamps are queryable.
- Per-card "why chat loves it" quotes collected from stream chat.
