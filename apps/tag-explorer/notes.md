# Tag Explorer

Browse and filter Sloppygram posts by tags.

## log
- 2026-01-23: Initial creation - list active tags, fetch posts by tag

## features
- Lists all active tags from Sloppygram with post counts
- Tags sorted by popularity (most used first)
- Click tag to fetch all posts with that tag
- Shows post caption, image, tags, and vote count
- Click post tags to filter by that tag
- "All Posts" button to show recent posts
- Supports nested tags (parent/child format)

## technical
- Reads from sloppygram_post_tags table
- Reads from sloppygram_posts table
- Reads from sloppygram_post_likes for vote counts
- No authentication required (read-only)

## todos
- Add search/filter for tags
- Add export functionality
- Add date range filter
