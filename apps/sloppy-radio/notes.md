# Sloppy Radio

Synchronized community radio extracted from Sloppygram's SloppyFM system.

## log
- 2026-02-01: Initial creation
  - YouTube IFrame API player (hidden 1x1)
  - Synchronized playback: all listeners hear same track at same time via started_at timestamp
  - Playlist from sloppygram_radio table (same as Sloppygram)
  - 4 default fallback tracks: lofi, chillhop, synthwave, jazz
  - Playback controls: play/pause, stop, next, prev, shuffle, re-sync
  - Add tracks via YouTube URL or video ID (oEmbed title fetch)
  - Duplicate detection in queue
  - Volume slider (0-100)
  - Simulated frequency visualizer (32 bars, bass boost, peak tracking, RGB coloring)
  - Real-time sync via Supabase broadcast channel (sloppyfm-radio)
  - Anti-loop sync lock (5s timeout)
  - Presence tracking for listener count
  - Now-playing display with track info and elapsed time
  - Playlist with active track highlight and playing icon
  - CRT scanline overlay aesthetic
  - Anybody + JetBrains Mono typography
  - Green terminal/retro radio palette
  - Mobile responsive
  - Shares same channel + DB as Sloppygram (full sync)

## data sources
- sloppygram_radio (playlist + sync state)
- sloppygram_profiles (username lookup)
- Supabase channel: sloppyfm-radio (realtime track changes)

## sync method
- Single source of truth: `started_at` timestamp in database
- When a track is selected, `started_at` is set to current time
- All clients calculate their seek position: `elapsed = now - started_at`
- No peer-to-peer position sync (caused loops in Sloppygram)
- Re-sync button re-queries the playing track and seeks to correct position

## issues
- None yet

## todos
- Could add track voting / favorites
- Could add genre/mood categorization
- Could add track removal by owner
- Could add real WebAudio visualizer (requires CORS-compatible audio source)
- Could add queue reordering
- Could add search YouTube API for track discovery
