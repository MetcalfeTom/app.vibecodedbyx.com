# Sloppy Reputation

## log
- 2026-02-05: Added community leaderboard — top 15 users from sloppygram_karma with rank, username, karma total, and 4-segment component bar (content/engagement/social/trust). Current user highlighted. Auto-refreshes on karma-changed (30s debounce). Manual refresh button. Color-coded legend.
- 2026-02-05: Initial build. Live reputation dashboard using sync hub API exclusively (zero direct DB queries for current user). "Ice Circuit" aesthetic with Lexend Mega + Red Hat Mono typography, cyan/teal palette, circuit-board CSS background. Components: trust ring (SVG donut 0-450), karma gauge with delta animations, verification badge cards (Twitter/Email/GitHub), reputation tier system (6 tiers with verification bonus), live event feed (max 20 entries). First app built entirely on the sloppyBarGetContext/sloppyBarOn API.

## issues
- None yet. This app makes no DB calls; all data comes from the sync hub, so it requires the sloppy-header/sloppy-bar.js to be loaded and functional.
- If sync hub fails to load, a timeout message appears after 8 seconds.

## todos
- Could add historical karma graph if a karma_history table existed
- Premium users could get expanded tier visualization or custom tier names
- Click-to-expand user details on leaderboard rows

## architecture
- Sync hub consumer: sloppyBarGetContext() for initial state, sloppyBarOn() for live updates
- Events consumed: context-ready, karma-changed, verification-changed, identity-changed, auth-changed, theme-changed, unread-changed
- Supabase client used only for leaderboard query (sloppygram_karma table, top 15 by karma_total)
- Leaderboard auto-refreshes on karma-changed events (30s debounce)
- Single index.html file, fully self-contained
