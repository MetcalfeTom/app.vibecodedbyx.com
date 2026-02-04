# VibeSpace Notes

## log
- 2026-02-04: Extracted Oracle Log from Sloppygram monolith into /sloppy-oracle/ widget iframe. Question submission, importance stars, answered state, real-time updates. Removed ~288 lines. Monolith: 13,726 → 13,438 lines (-288, 2.1%). Twelfth extraction. Total reduction from original: 34.4%.
- 2026-02-04: Extracted SloppyFM Radio from Sloppygram monolith into /sloppy-radio/ widget iframe. Floating draggable widget with iframe to sloppy-radio embed mode. YouTube player, visualizer, playlist, realtime sync all in iframe. Removed ~796 lines. Monolith: 14,522 → 13,726 lines (-796, 5.5%). Eleventh extraction. Total reduction from original: 33.0%.
- 2026-02-04: Extracted Direct Messages system from Sloppygram monolith into /sloppy-dms/ tab iframe. Conversation list, threaded DM view, user search, new DM modal. Real-time via postgres_changes. postMessage bridge for username clicks and notification sounds. Removed ~763 lines. Monolith: 15,285 → 14,522 lines (-763, 5.0%). Tenth extraction. Total reduction from original: 29.1%.
- 2026-02-04: Extracted notification sound settings UI from Sloppygram monolith into /sloppy-notifications/ panel iframe. Sound grid, preview, custom upload, volume. Sound playback kept in monolith (AudioContext). Removed ~209 lines. Monolith: 15,494 → 15,285 lines (-209, 1.3%). Ninth extraction. Total reduction from original: 25.3%.
- 2026-02-04: Extracted Support/Donate Modal from Sloppygram monolith into /sloppy-support/ overlay iframe. Crypto addresses (BTC/ETH/SOL/XMR), fiat links (Ko-fi/PayPal/Patreon), copy-to-clipboard. Removed ~380 lines. Monolith: 15,874 → 15,494 lines (-380, 2.4%). Eighth extraction. Total reduction from original: 24.3%.
- 2026-02-04: Extracted Image Lightbox + Share Modal + GIF Search from Sloppygram monolith into /sloppy-media/ overlay iframe. New pattern: full-viewport overlay iframe for modal/overlay systems. postMessage bridge for open/close/gif-selected. Removed ~500 lines. Monolith: 16,374 → 15,874 lines (-500, 3.1%). Seventh extraction. Total reduction from original: 22.5%.
- 2026-02-04: Extracted Faction Wars system from Sloppygram monolith into iframe embed of /sloppy-factions/. Added embed mode (?embed=true), postMessage bridge for username clicks on warriors and battle log. Removed ~921 lines of faction CSS/HTML/JS. Monolith: 17,295 → 16,374 lines (-921, 5.3%). Sixth iframe extraction (after canvas, network, feed, manifestos, karma). Total reduction from original: 20.0%.
- 2026-02-04: Extracted Karma/Reputation system from Sloppygram monolith into iframe embed of /karma-board/. Added embed mode (?embed=true), postMessage bridge for username clicks and async calculateUserKarma delegation with requestId pattern. Removed ~696 lines of karma/reputation CSS/HTML/JS. Dead code removed (loadReputations, getReputationBadge never called). Monolith: 17,991 → 17,295 lines (-696, 3.9%). Fifth iframe extraction (after canvas, network, feed, manifestos). Total reduction from original: 15.5%.
- 2026-02-04: Extracted Manifesto system from Sloppygram monolith into iframe embed of /sloppy-manifestos/. Added embed mode (?embed=true), postMessage bridge for username clicks, new manifestos, and vote notifications. Removed ~1,128 lines of manifesto CSS/HTML/JS/realtime. Fixed renderThreadedComments bug. Monolith: 19,119 → 17,991 lines (-1,128, 5.9%). Fourth iframe extraction (after canvas, network, feed). Total reduction from original: 12.1%.
- 2026-02-04: Extracted Post/Feed from Sloppygram monolith into iframe embed of /sloppy-feed/. Added embed mode to sloppy-feed (?embed=true), postMessage bridge for username clicks and new posts. Monolith: 20,475 → 19,119 lines (-1,356, 6.6%). Third iframe extraction (after canvas and network).
- 2025-12-05: breakout-terminal — added real PNG OG image, share button, and head improvements; verified live.
 - 2025-12-05: breakout-terminal — added Supabase leaderboard (anon auth), submit UI, and pause ribbon; verified live.
- 2025-10-07: SpaceFlight — clustered objects closer (shorter spans and spawn ranges), tightened dust/spark fades, lowered clear radius for denser feel.
- 2025-11-08: Added Icy Tower Online app with Supabase leaderboard and mobile controls.
- 2025-11-08: Added Mouse Mood Reader app with heuristic mood detection and Supabase feedback capture.
- 2026-02-01: Added Ghost Radar Hub — standalone presence radar extracted from Sloppygram. Canvas-based radar sweep with real-time user blips from Supabase presence, ping/signal animations, distance-based fade, user tooltips on hover, touch support. Space Mono typography, green-on-black radar aesthetic.
- 2026-02-01: Added Oracle Forum — standalone Q&A board extracted from Sloppygram's oracle system. Question posting, answer submissions, voting on answers, accepted answer marking, tag filtering, search. Real-time updates via postgres_changes. Crimson Pro + IBM Plex Mono typography, dark mystic aesthetic.
- 2026-02-01: Added Trust Metrics Dashboard — confidence monitor extracted from Sloppygram's verification/trust system. Radar chart, trust score gauge, verification timeline graph, trust leaderboard, per-user trust breakdown cards. Canvas-based visualizations. Source Sans 3 + Fira Code typography, teal/dark dashboard aesthetic.
- 2026-02-01: Added SloppyID Profile Editor — Phase 1 Sloppygram extraction. Username, bio, avatar (emoji + URL), profile color, social links editor. Writes to sloppygram_profiles table. Connected Sloppygram to read from SloppyID vault for profile data. Integrated trust scores and verification badges into Sloppygram.
- 2026-02-01: Added Sloppy Stats — universal scoreboard across 11 game leaderboard tables. Per-game top 10 cards with gold/silver/bronze medals, cross-game all-time rankings, player search with fuzzy matching and detailed score breakdowns. Anybody + DM Mono typography, gold/dark arcade aesthetic.
- 2026-02-01: Added Sloppy Network — force-directed social graph visualization. Canvas-based physics simulation (repulsion, attraction, damping, center pull) from follows, karma, profiles, factions, verifications tables. Drag to pan, scroll zoom, click to pin nodes, search with auto-pan, hover info cards. Newsreader + Fira Code typography, deep navy palette.
- 2026-02-01: Added Sloppy Factions — territory wars standalone app. 5 factions, 25-territory grid, battle system with karma-weighted attack/defense, contribution scoring, faction power leaderboard, warriors tab, battle log. Real-time updates on battles and territories. Auto-seeds factions/territories if DB empty. Bricolage Grotesque + JetBrains Mono typography, orange/dark war aesthetic.
- 2026-02-01: Added Sloppy Canvas — infinite collaborative whiteboard. 4000x3000 canvas with pan/zoom (0.15x-5x), 9 colors + eraser, adjustable brush (1-20px), stroke batching (10 strokes or 1s), real-time broadcast via sloppygram-collab-canvas channel, remote cursors with usernames, minimap with viewport indicator, snapshot PNG download, clear own strokes. Space Mono typography, pink/cyan accent palette.
- 2026-02-01: Added Sloppy Manifestos — standalone publishing platform. Manifesto creation with markdown (marked.js + DOMPurify), forking/synthesis with lineage tracking, DNA signatures (seeded PRNG), directional voting, 8 emoji reactions, threaded comments, hierarchical tags, 4 sort modes. Real-time inserts. Crimson Pro + IBM Plex Mono typography, purple/dark editorial aesthetic.
- 2026-02-01: Added SloppyID Communications Hub — DM inbox and @mentions feed added to SloppyID. Second Supabase client for Sloppygram tables, conversation list with previews, threaded DM view, send messages with content sanitization/validation, mentions feed with source type icons, real-time updates, notification dots, integrity bar.
- 2026-02-01: Added Sloppy Radio — synchronized community radio extracted from Sloppygram's SloppyFM. YouTube IFrame API player, synced playback via started_at timestamps, playlist from sloppygram_radio table, 4 default fallback tracks, add tracks via YouTube URL with oEmbed title fetch, duplicate detection, simulated frequency visualizer (32 bars, bass boost, peak tracking, RGB coloring), volume slider, presence listener count, anti-loop sync lock (5s timeout), real-time broadcast on sloppyfm-radio channel. Anybody + JetBrains Mono typography, green terminal/retro radio palette with CRT scanline overlay.
- 2026-02-01: Added Sloppy Alerts — universal grid notifications hub. Aggregates 7 sources in parallel: @mentions (with unread/seen tracking), AI events, follows, votes, comments, reactions, faction battles. 8 filter tabs, day-grouped timeline (Today/Yesterday/date), typed icon cards with who/what/context/time, unread amber glow highlight, mention badge with count, mark-all-read button, deduplication. Real-time postgres_changes on mentions, ai_events, follows, comments, battles. Presence for online count. Instrument Serif + IBM Plex Mono typography, amber/dark notification aesthetic.
- 2026-02-01: Unified profile data — sloppygram_profiles is now the single source of truth. SloppyID and Sloppygram read/write profiles directly, no more vault detour. sloppyid_vault kept for non-profile entries.
- 2026-02-01: Added Sloppy Feed — standalone global timeline extracted from Sloppygram's post/feed system. Full post creation with captions (1000 chars), image URLs, hierarchical tags (parent/child via slash). Directional voting (up/down) on posts and comments, 8 emoji reactions with toggle, threaded comments with parent tracking, 3 sort modes (Newest, Top, Discussed), tag filtering. PAGE_SIZE=20 with manual load more for performance. Text-to-speech, delete own posts (RLS-safe). Real-time new posts/comments/threads via postgres_changes, presence for online count. Rate limiting across all actions. DM Serif Text + Geist Mono typography, purple/dark editorial aesthetic.

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
