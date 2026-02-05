# Sloppy Reputation

## log
- 2026-02-05: Initial build. Live reputation dashboard using sync hub API exclusively (zero direct DB queries for current user). "Ice Circuit" aesthetic with Lexend Mega + Red Hat Mono typography, cyan/teal palette, circuit-board CSS background. Components: trust ring (SVG donut 0-450), karma gauge with delta animations, verification badge cards (Twitter/Email/GitHub), reputation tier system (6 tiers with verification bonus), live event feed (max 20 entries). First app built entirely on the sloppyBarGetContext/sloppyBarOn API.

## issues
- None yet. This app makes no DB calls; all data comes from the sync hub, so it requires the sloppy-header/sloppy-bar.js to be loaded and functional.
- If sync hub fails to load, a timeout message appears after 8 seconds.

## todos
- Could add a "community leaderboard" section that does query the DB for top karma users (would need Supabase client)
- Could add historical karma graph if a karma_history table existed
- Premium users could get expanded tier visualization or custom tier names

## architecture
- Pure sync hub consumer: sloppyBarGetContext() for initial state, sloppyBarOn() for live updates
- Events consumed: context-ready, karma-changed, verification-changed, identity-changed, auth-changed, theme-changed, unread-changed
- No Supabase client imported
- Single index.html file, fully self-contained
