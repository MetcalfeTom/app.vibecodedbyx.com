# Code Quiz

## log
- 2026-04-08: Full concept pivot. Dropped the paste-your-code + LLM generation flow and replaced it with a "guess which sloppy app this code is from" game. On each of 10 rounds: shuffles a curated pool of 61 apps under /apps/, fetches the index.html (relative URL so it works on sloppy.live), extracts inline `<script>` bodies (skips external src), picks an "interesting" 3-14 line block (preferring those with function/const/class/addEventListener keywords), scrubs the app name out of the snippet, then presents 4 options (1 correct + 3 random distractors from the pool). Basic JS syntax highlighter for keywords/strings/numbers/comments. Progress bars + explanation box with clickable link to the real app after each answer. Skip button to pass on a snippet. Final score screen with tiered copy. In-memory cache per fetched app to avoid re-downloading.
- 2026-04-08: (prior build) Fix — removed `response_format` and `referrer` from the Pollinations POST body. Those fields were pushing the request into Pollinations' deprecated authenticated path. Also added robust `extractJson()` helper that strips fences and scans for the first balanced block.
- 2026-04-08: (prior build) Initial build — paste a code snippet, pick language/level/question count, call Pollinations openai endpoint with JSON mode prompt.

## features
- 61-app curated pool (editable APP_POOL constant)
- Runtime fetch + inline-script extraction (no pre-baked snippets, stays fresh as apps change)
- Heuristic "interesting block" picker with blank-line block segmentation + keyword scoring
- App-name scrubbing in the displayed snippet (case-insensitive, replaces with asterisks)
- Basic JS syntax highlighting (keywords, strings, numbers, comments)
- 10-round session with progress bars, live score tracking, skip option
- Clickable link to the real app in the explanation after each round
- Cached fetches so the same app isn't re-downloaded within a session

## issues
- Only works from the sloppy.live origin (relative fetch) — local dev preview won't see other apps.
- Minified or externally-sourced scripts won't yield usable snippets — fetcher tries up to 8 apps per round.

## todos
- Weight the pool toward more-recently-added apps for freshness
- Add a "too easy" toggle that doesn't scrub the app name
- Share score to Twitter / copy result card
- Supabase leaderboard for 10/10 streaks
