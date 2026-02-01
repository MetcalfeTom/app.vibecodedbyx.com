# Sloppy Network

Live force-directed social graph visualization of the sloppy.live community.

## log
- 2026-02-01: Initial creation
  - Canvas-based force-directed graph with repulsion + attraction physics
  - Nodes from sloppygram_follows edges + top karma users
  - Node size scaled by karma (sqrt scale, 4-24px radius)
  - Node color from faction membership or profile color
  - Green border ring on verified users (from sloppyid_verifications)
  - Emoji avatars rendered on larger nodes
  - Labels on large/hovered/highlighted nodes
  - Edge rendering with highlight on selected user's connections
  - Hover info card: karma, followers/following, rank, faction, verifications
  - Search with auto-highlight and camera pan
  - Drag to pan, scroll to zoom, pinch zoom on mobile
  - Click nodes to pin position, double-click to unpin all
  - Faction legend from sloppygram_factions
  - Stats bar: node count, edge count, faction count
  - Loading overlay with progress bar
  - Newsreader + Fira Code typography
  - Deep navy/blue palette
  - Mobile touch support

## data sources
- sloppygram_follows (edges: follower_username → followed_username)
- sloppygram_karma (node size + info)
- sloppygram_profiles (avatar emoji + color)
- sloppygram_factions (faction names/colors for legend)
- sloppygram_faction_members (username → faction mapping)
- sloppyid_verifications (verified badges)

## issues
- None yet

## todos
- Could add edge direction arrows
- Could add cluster detection / community grouping
- Could add timeline slider to show network growth over time
- Could add mutual follow highlighting (bidirectional edges)
