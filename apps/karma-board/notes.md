# Karma Board

Federated karma leaderboard aggregating engagement data across the sloppy.live ecosystem. Read-only — does not modify any Sloppygram data.

## log
- 2026-02-04: Added embed mode for Sloppygram iframe integration
  - ?embed=true hides top-bar, backlink, reduces padding
  - postMessage bridge: username clicks on leaderboard entries send to parent
  - calculate-karma listener: parent sends { type: 'calculate-karma', username, requestId }, responds with { type: 'karma-result', requestId, karma, badges }
  - Exposed supabase on window for error catcher
- 2026-02-01: Initial creation — standalone karma calculator, 10 badge types, time/category filters, personal stats card, batched parallel queries

## architecture
- Reads from 12+ Sloppygram tables (messages, posts, manifestos, votes, reactions, comments, follows)
- Calculates karma weights: msg=1, post=3, doodle=5, manifesto=10, upvote=2, downvote=-1, reaction=1, comment=2, follow=3
- Diversity multiplier (1.0-1.8x based on content type variety)
- Batched calculation: 10 users at a time via Promise.all
- Filters: All Time/Month/Week × Overall/Creators/Philosophers/Artists/Social

## issues
- Karma calculation is expensive (many queries per user); limited to top 60 users
- Doodle count is estimated (20% of messages) since message_type isn't always reliable

## todos
- Cache karma results in a dedicated table for faster loads
- Add historical karma tracking (daily snapshots)
