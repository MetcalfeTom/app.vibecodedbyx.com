# Sloppy Discovery

Standalone cross-content discovery hub — explore posts, manifestos, and messages in one unified feed.

## log
- 2026-02-01: Initial creation
  - Unified feed aggregating posts (30d), manifestos (30d), and messages (7d, >20 chars)
  - 5 discovery modes: Trending, Newest, For You, Discussed, Surprise
  - Trending: HN-style gravity decay scoring (engagement / age^1.4)
  - For You: boosts followed users and high-value content types
  - Discussed: sorts by comments + reactions count
  - Surprise: random shuffle with re-roll button
  - Engagement signals: votes, comments, reactions, likes per content piece
  - Tag bar: top 20 tags across all content with click-to-filter
  - Hierarchical tag matching (filtering by parent includes children)
  - Score badge on each card showing trending score
  - Content type badges: Post (indigo), Manifesto (purple), Chat (teal)
  - Image display for posts with lazy loading
  - Manifesto boost (1.2x), chat discount (0.6x) in scoring
  - Pagination: 20 items per page with load more
  - Real-time: postgres_changes INSERT on posts/manifestos/messages
  - Anybody + DM Mono typography
  - Purple/teal/dark cosmic aesthetic
  - Mobile responsive
  - Same database tables as Sloppygram (read-only, full data sync)

## data sources
- sloppygram_posts (content)
- sloppygram_manifestos (content)
- sloppygram_messages (content, filtered >20 chars)
- sloppygram_post_likes (votes)
- sloppygram_post_comments (comment counts)
- sloppygram_post_reactions (reaction counts)
- sloppygram_post_tags (tag data)
- sloppygram_manifesto_votes (votes)
- sloppygram_manifesto_comments (comment counts)
- sloppygram_manifesto_tags (tag data)
- sloppygram_follows (For You personalization)

## scoring algorithm
- base = max(votes, 0) * 3 + comments * 5 + reactions * 2
- score = (base + 1) / (ageHours + 2)^1.4
- manifesto multiplier: 1.2x (longer content deserves visibility)
- chat multiplier: 0.6x (ephemeral content ranks lower)
- For You bonus: +5 for followed users, +2 for manifestos, +1 for posts with images

## issues
- None yet

## todos
- Could add content type filters (show only posts, only manifestos, etc.)
- Could add "save for later" bookmarking
- Could add reading time estimates for manifestos
- Could add engagement sparklines per item
- Could add collaborative filtering (users who liked X also liked Y)
- Could add time range selector (24h, 7d, 30d, all time)
