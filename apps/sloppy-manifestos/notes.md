# Sloppy Manifestos

Standalone publishing platform extracted from Sloppygram's manifesto system.

## log
- 2026-02-01: Initial creation
  - Full manifesto creation with title, markdown content, tags
  - Forking system: fork any manifesto as "synthesis" with lineage tracking
  - DNA signature: unique genetic identifier per manifesto (sequence, marker, lineage code, generation)
  - Directional voting (up/down) with per-user tracking
  - Emoji reactions (8 emojis) with toggle
  - Comments with inline input
  - Hierarchical tag system (parent/child via slash syntax)
  - Tag filtering: click any tag to filter feed
  - 4 sort modes: Newest, Top Voted, Most Discussed, Most Forked
  - Markdown rendering via marked.js + DOMPurify sanitization
  - Lineage links: click parent DNA code to scroll to source
  - Real-time updates on new manifesto inserts
  - Delete own manifestos
  - Stats header: total manifestos, votes, forks
  - Crimson Pro serif + IBM Plex Mono typography
  - Purple/dark editorial aesthetic
  - Mobile responsive
  - Same database tables as Sloppygram (full data sync)

## data sources
- sloppygram_manifestos (content)
- sloppygram_manifesto_votes (voting)
- sloppygram_manifesto_reactions (emoji reactions)
- sloppygram_manifesto_comments (discussion)
- sloppygram_manifesto_tags (hierarchical tags)
- sloppygram_manifesto_lineage (fork tracking)
- sloppygram_profiles (username/avatar lookup)

## issues
- None yet

## todos
- Could add threaded comment replies (sloppygram_comment_threads)
- Could add text-to-speech reading
- Could add manifesto series / collections
- Could add search by title/content
- Could add user profile pages with all manifestos
- Could add manifesto lineage tree visualization
