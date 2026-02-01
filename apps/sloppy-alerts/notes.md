# Sloppy Alerts

Universal grid notifications hub aggregating activity across the entire sloppy.live ecosystem.

## log
- 2026-02-01: Initial creation
  - Aggregates 7 notification sources in parallel:
    1. @Mentions (sloppygram_mentions) with unread/seen tracking
    2. AI Events (ai_events) — posts, votes, factions, snapshots
    3. Follows (sloppygram_follows) — new followers
    4. Votes (sloppygram_post_likes) — upvotes/downvotes
    5. Comments (sloppygram_post_comments) — new comments
    6. Reactions (sloppygram_post_reactions) — emoji reactions
    7. Battles (sloppygram_faction_battles) — territory wars
  - 8 filter tabs: All, @Mentions, Votes, Follows, Comments, Reactions, Battles, Events
  - Mention badge with unread count
  - "Mark all read" button (updates sloppygram_mentions.seen)
  - Day-grouped timeline (Today, Yesterday, date)
  - Typed icon grid cards with who/what/context/time
  - Unread highlight with amber left-border glow
  - Real-time: postgres_changes on mentions, ai_events, follows, comments, battles
  - Presence tracking for online count
  - Deduplication by alert id
  - Sorted by time descending across all sources
  - Instrument Serif + IBM Plex Mono typography
  - Amber/dark notification aesthetic
  - Mobile responsive

## data sources
- sloppygram_mentions (mention notifications with seen flag)
- ai_events (universal event log with metadata)
- sloppygram_follows (follow notifications)
- sloppygram_post_likes (vote activity)
- sloppygram_post_comments (comment activity)
- sloppygram_post_reactions (reaction activity)
- sloppygram_faction_battles (battle events)
- sloppygram_profiles (username/avatar lookup)

## issues
- None yet

## todos
- Could add notification preferences (mute certain types)
- Could add sound/vibration on new real-time alerts
- Could add click-to-navigate to source content
- Could add DM unread count integration
- Could add manifesto vote/reaction tracking
- Could add doodle vote tracking
- Could add daily/weekly digest summary
