# Sloppy Doodles

## log
- 2026-02-04: Created as extraction from Sloppygram monolith. Doodle leaderboard with voting, threaded comments, rank badges, realtime updates. Standalone mode + embed mode for Sloppygram iframe.

## architecture
- Standalone mode: /sloppy-doodles/ — full leaderboard view
- Embed mode: /sloppy-doodles/?embed=true — tab iframe inside Sloppygram
- postMessage API:
  - Iframe → parent: `username-click` (username) — for profile card popup

## data-sources
- sloppygram_messages (WHERE drawing_data NOT NULL) — doodle images
- sloppygram_doodle_votes — upvote/downvote tracking
- sloppygram_doodle_comments — threaded comments on doodles
- sloppygram_profiles — username lookup for current user

## what-stays-in-monolith
- Drawing canvas modal and tool (chat input feature)
- Chat inline doodle display with vote buttons
- voteDoodle(), loadDoodleVotes(), updateDoodleVoteUI() — for chat inline
- forkDoodle() — copies DNA to drawing canvas
- sendDrawing() — uploads doodle from canvas

## issues
- Both monolith and iframe have independent voteDoodle implementations writing to same table; no conflict since both are RLS-safe, but vote state may briefly differ between chat and leaderboard views

## todos
- None currently
