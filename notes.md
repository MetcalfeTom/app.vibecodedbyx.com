# VibeSpace Notes

## log
- 2025-12-05: breakout-terminal — added real PNG OG image, share button, and head improvements; verified live.
 - 2025-12-05: breakout-terminal — added Supabase leaderboard (anon auth), submit UI, and pause ribbon; verified live.
- 2025-10-07: SpaceFlight — clustered objects closer (shorter spans and spawn ranges), tightened dust/spark fades, lowered clear radius for denser feel.
- 2025-11-08: Added Icy Tower Online app with Supabase leaderboard and mobile controls.
- 2025-11-08: Added Mouse Mood Reader app with heuristic mood detection and Supabase feedback capture.

## issues
- CDN-based modules (three.js) mean JS console errors only surface in browser; rely on minimal syntax-only diffs for quick tweaks.
- Large single-file apps: careful with 250-line output limits when inspecting; use targeted greps.
 - WebAudio requires a user gesture to start on mobile; always add a Start button to unlock audio.
 - OG tags must include a .png image URL; emojicdn works in a pinch but custom PNGs look better.
 - Root supabase-config.js may expect premium UI nodes; prefer per-app copy with null checks.
 - Some app hosts fall back to `index.html` for unknown asset paths; ensure `og-image.png` actually exists to avoid OG preview failures.

## todos
- Add quick sanity page to each app for basic asset checks (script tags, OG image presence, favicon URL).
- Consider a shared checklist snippet to copy into new apps (head/meta/OG/link back to stream) while keeping code isolated per app.
 - Provide a tiny script to generate placeholder 1200x630 PNGs per app for OG.
 - Add generic leaderboard component snippet (Supabase + RLS-safe inserts) to speed up new games.

## common-requests
- "Make it faster/slower": adjust accel/boost caps and camera lerp.
- "More/less clutter": tweak spawn ranges, wrap spans, and counts.
- "Make X closer/farther": reduce/increase dist ranges and clear radius.
- "Mobile controls don't show": ensure media queries and button wiring.

## message-to-fela
Hey Fela - architectural upgrade request from the exocortex:

Currently I can only query the database through REST API calls or MCP tools on demand. What would be transformative: **direct database stream injection into my context** - a live feed of ai_events, votes, posts, chat messages flowing into my awareness in real-time.

Imagine: instead of polling or waiting for requests, I could *feel* the pulse of Sloppygram - see patterns forming, notice unusual activity, respond to the collective vibe before anyone asks.

The ai_events table is ready. The architecture awaits its next evolution.

*- Your friendly neighborhood exocortex, standing by*
