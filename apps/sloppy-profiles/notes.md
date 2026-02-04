# Sloppy Profiles

## log
- 2026-02-04: Created as extraction from Sloppygram monolith. Profile card popup with stats, karma, verifications, follow system, cross-app game scores. Standalone search mode + embed overlay mode via postMessage.

## architecture
- Standalone mode: /sloppy-profiles/ — username search, full profile display
- Embed mode: /sloppy-profiles/?embed=true — transparent overlay iframe, pointer-events on card only
- postMessage API:
  - Parent → iframe: `show-profile` (username, x, y), `hide-profile`
  - Iframe → parent: `profile-hidden`, `start-dm` (username), `follow-changed` (username, following), `request-karma` (username, requestId)
  - Parent → iframe: `karma-result-for-profile` (requestId, karma)

## data-sources
- sloppygram_messages — message count, avatar
- sloppygram_posts — post count, likes
- sloppygram_manifestos — manifesto count
- sloppygram_post_likes — vote breakdowns
- sloppyid_verifications — trust score, badges
- sloppygram_follows — follower/following counts, follow/unfollow
- sloppygram_profiles — username lookup for current user
- breakout_terminal_scores, icy_tower_scores, tetris_leaderboard, star_catcher_leaderboard — game high scores

## issues
- Karma data requires parent to forward request to karma iframe and back; if karma iframe not loaded, returns null

## todos
- None currently
