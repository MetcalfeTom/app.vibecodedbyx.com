# Tag Explorer

Visualize tags across Sloppygram - messages, posts, and manifestos.

## log
- 2026-01-24: Major rewrite - now uses /api/?endpoint=tags for aggregated data across all sources
- 2026-01-24: Added tag cloud with size-by-frequency and color-by-source
- 2026-01-24: Added source breakdown bars (cyan=messages, magenta=posts, yellow=manifestos)
- 2026-01-24: Added detail panel showing per-source counts
- 2026-01-23: Initial creation - list active tags, fetch posts by tag

## features
- Fetches aggregated tags from API v1.3 endpoint
- Tag cloud with dynamic sizing based on usage count
- Color-coded by dominant source (messages/posts/manifestos)
- List view with stacked source bars showing distribution
- Click any tag to see detailed source breakdown
- Stats bar: total tags, total uses, top tag
- Legend for source colors
- Refresh button to reload from API

## technical
- Uses /api/?endpoint=tags (aggregated tag data)
- No direct database queries - API handles aggregation
- Shows data from all three tag tables:
  - sloppygram_message_tags
  - sloppygram_post_tags
  - sloppygram_manifesto_tags

## todos
- Add filtering by source type (show only message tags, etc.)
- Add search for specific tags
- Add time-based trending
