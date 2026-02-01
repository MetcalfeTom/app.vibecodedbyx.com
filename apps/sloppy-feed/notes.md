# Sloppy Feed

Standalone global timeline extracted from Sloppygram's post/feed system.

## log
- 2026-02-01: Initial creation
  - Full post creation with caption (1000 chars), image URL, tags
  - Hierarchical tags (parent/child via slash syntax)
  - Directional voting (up/down) per post and per comment
  - 8 emoji reactions with toggle
  - Threaded comments (reply to comments with parent tracking)
  - 3 sort modes: Newest, Top Voted, Most Discussed
  - Tag filtering with clear bar
  - Pagination: 20 posts per page with manual load more
  - Text-to-speech for post captions
  - Delete own posts (RLS-safe)
  - Real-time: new posts, comments, threads via postgres_changes
  - Presence tracking for online count
  - Rate limiting: posts (5/min), comments (15/min), votes (30/min), reactions (20/min)
  - Content sanitization and XSS prevention
  - DM Serif Text + Geist Mono typography
  - Purple/dark editorial aesthetic
  - Mobile responsive
  - Same database tables as Sloppygram (full data sync)

## data sources
- sloppygram_posts (content)
- sloppygram_post_likes (voting)
- sloppygram_post_reactions (emoji reactions)
- sloppygram_post_comments (discussion)
- sloppygram_post_tags (hierarchical tags)
- sloppygram_comment_threads (nested replies)
- sloppygram_comment_votes (comment voting)
- sloppygram_profiles (username/avatar lookup)

## issues
- None yet

## todos
- Could add image upload (file → storage → URL)
- Could add post forking with lineage
- Could add user profile cards on username click
- Could add infinite scroll option
- Could add search by caption/tag
- Could add post bookmarks/saves
