# Sloppy Tags

Standalone tag universe explorer extracted from Sloppygram's tag cloud, tag explorer, and trending tags systems.

## log
- 2026-02-04: Added embed mode for Sloppygram sidebar iframe
  - Embed mode (?embed=true): hides header/search/backlink, compact padding
  - postMessage: tag-filter → parent calls filterByTag for global tag filtering
  - postMessage: username-click → parent calls showProfileCard for profile cards
  - window.supabase exposed for error catcher
  - Thirteenth iframe extraction from Sloppygram monolith
- 2026-02-01: Initial creation
  - Loads all tags from 3 sources in parallel: message_tags, post_tags, manifesto_tags (limit 1000 each)
  - Tag cloud: top 30 tags with 5 size levels, 6 neon colors, staggered pulse animation
  - Tag hierarchy: parent/child groups with counts, click parent or child to explore
  - Full frequency list: top 50 with rank styling (hot/warm), source breakdown (msg/post/man)
  - Search: live filter across all tags, updates cloud and list simultaneously
  - Tag explorer detail view: click any tag to see stats + tabbed content (Messages, Posts, Manifestos)
  - Explorer fetches actual content by joining tag IDs back to source tables (up to 10 per tab)
  - Stats header: total tag uses, unique tags, parent categories
  - Real-time: postgres_changes INSERT on all 3 tag tables triggers full reload
  - Bricolage Grotesque + JetBrains Mono typography
  - Neon/dark cyberpunk aesthetic (cyan, magenta, green, yellow, orange, pink)
  - Mobile responsive

## data sources
- sloppygram_message_tags (message tagging)
- sloppygram_post_tags (post tagging)
- sloppygram_manifesto_tags (manifesto tagging)
- sloppygram_messages (content lookup for explorer)
- sloppygram_posts (content lookup for explorer)
- sloppygram_manifestos (content lookup for explorer)

## issues
- None yet

## todos
- Could add tag co-occurrence graph (which tags appear together)
- Could add tag timeline (when tags were most used)
- Could add tag creation from this app (currently read-only)
- Could add related tags suggestion
- Could add tag-based content recommendations
- Could add user-level tag analytics (your most-used tags)
