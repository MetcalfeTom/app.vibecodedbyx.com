# Sloppy Reputation

## log
- 2026-02-05: Added premium Neon Energy mode — when ctx.premium is true, activates: animated rainbow gradient border on profile strip, neon avatar ring, shimmering name text, pulsing card borders, glowing trust ring, neon karma text, flowing gradient tier bar, premium tier names (Initiate/Conduit/Architect/Neon Oracle/Voidwalker/Singularity), upgraded verification pulses, floating particle canvas (35 multi-color particles with glow), premium user detection in leaderboard (gold gradient name + star prefix). 10 CSS keyframe animations, canvas particle system with DPR scaling.
- 2026-02-05: Added karma history graph — canvas-based line chart with gradient fill + neon glow. Created karma_history DB table. Snapshots recorded on page load and karma-changed events (5-min debounce). Time range filters (24H/7D/30D/All). Hover tooltips with exact karma + timestamp. Auto-resizes on window resize. Y-axis labels, x-axis dates, grid lines. Points rendered as dots when <=50 data points.
- 2026-02-05: Added community leaderboard — top 15 users from sloppygram_karma with rank, username, karma total, and 4-segment component bar (content/engagement/social/trust). Current user highlighted. Auto-refreshes on karma-changed (30s debounce). Manual refresh button. Color-coded legend.
- 2026-02-05: Initial build. Live reputation dashboard using sync hub API exclusively (zero direct DB queries for current user). "Ice Circuit" aesthetic with Lexend Mega + Red Hat Mono typography, cyan/teal palette, circuit-board CSS background. Components: trust ring (SVG donut 0-450), karma gauge with delta animations, verification badge cards (Twitter/Email/GitHub), reputation tier system (6 tiers with verification bonus), live event feed (max 20 entries). First app built entirely on the sloppyBarGetContext/sloppyBarOn API.

## issues
- None yet. This app makes no DB calls; all data comes from the sync hub, so it requires the sloppy-header/sloppy-bar.js to be loaded and functional.
- If sync hub fails to load, a timeout message appears after 8 seconds.

## todos
- Click-to-expand user details on leaderboard rows
- Component breakdown lines on the graph (content/engagement/social/trust as separate colored lines)
- Premium: custom profile border color picker
- Premium: animated entrance effects when page loads

## architecture
- Sync hub consumer: sloppyBarGetContext() for initial state, sloppyBarOn() for live updates
- Events consumed: context-ready, karma-changed, verification-changed, identity-changed, auth-changed, theme-changed, unread-changed
- Supabase client used for: leaderboard query (sloppygram_karma top 15), karma history read/write (karma_history table)
- Leaderboard auto-refreshes on karma-changed events (30s debounce)
- Karma snapshots recorded on load + karma-changed (5-min debounce between writes)
- Canvas graph with devicePixelRatio scaling, gradient fill, glow effect, hover tooltips
- Single index.html file, fully self-contained
