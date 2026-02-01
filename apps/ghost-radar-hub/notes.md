# Ghost Radar Hub

Standalone presence radar extracted from Sloppygram. Shows real-time users across the sloppy network.

## log
- 2026-02-01: Initial extraction from Sloppygram
  - Extracted Ghost Radar component (originally ~65 lines in monolith)
  - Expanded into full-page radar experience with canvas rendering
  - Animated sweep line with conic gradient trail
  - Blips positioned deterministically from username hash
  - Blips brighten as sweep passes over them
  - Ping button sends expanding ring animation
  - Side panel: ghost list with avatars, activity feed
  - Connects to sloppygram_presence channel (sees same users)
  - VT323 + IBM Plex Mono typography, green-on-black terminal aesthetic
  - Scanline overlay for CRT effect
  - Mobile responsive (stacked layout)
  - First Phase 1 modularization extraction from Sloppygram

## issues
- None yet

## todos
- Could add sound effects (Web Audio beeps on join/leave)
- Could add ghost "heat map" mode showing activity density
- Could show user profile cards on blip click

## notes
- Uses same `sloppygram_presence` Supabase channel as Sloppygram
- Tracks itself as "Ghost Observer" in the presence channel
- Users on Sloppygram will see this app's observer as a presence user
- Blip positions are stable (seeded from username hash) so they don't jump around
