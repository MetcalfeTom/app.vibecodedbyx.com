# Karma Feed

Algorithmic content feed aggregating posts, manifestos, doodles, and messages from across sloppy.live, ranked by engagement. Read-only — does not modify any Sloppygram data.

## log
- 2026-02-01: Initial creation — unified content feed with hot/top/new/controversial sort, content type tabs, engagement badges per card, HN-style hot ranking algorithm

## architecture
- Pulls latest 100 posts, 100 manifestos, 50 doodles, 50 messages
- Batch-loads all engagement data (votes, reactions, comments, tags) via Promise.all
- Hot score: engagement / (age_hours + 2)^1.3 (HN/Reddit-inspired decay)
- Controversial: min(up,down)/max(up,down) × total_votes
- Content cards show: avatar, username, type badge, image, text, vote counts, age, tags

## issues
- None yet

## todos
- Add infinite scroll for loading more content
- Add "For You" tab using followed users from sloppygram_follows
- Add tag cloud sidebar for discovery
