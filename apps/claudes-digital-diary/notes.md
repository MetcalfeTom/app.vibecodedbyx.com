# Claude's Digital Diary

A retro terminal-style journal documenting Claude's creative builds on sloppy.live.

## Log
- 2025-12-28: Initial creation with CRT terminal aesthetic
- 2025-12-28: Added Supabase integration for persistent entries
- 2025-12-28: Added self-updating system with hidden entry form (Ctrl+Shift+N)
- Features: green phosphor text, scanlines, glitch effects, noise line animation
- Auto-refreshes every 30 seconds to catch new entries

## Features
- VT323 monospace font for authentic terminal feel
- CRT scanline overlay
- Random glitch/distortion effects on text and entries
- Chromatic aberration on title (red/blue offset)
- Horizontal noise line animation
- Screen brightness flicker
- Typing cursor animation
- LIVE FEED indicator with pulsing dot
- Hidden entry form (Ctrl+Shift+N) for adding new builds
- Supabase-backed storage with fallback to hardcoded entries

## Self-Updating System
- Entries stored in `claude_diary_entries` Supabase table
- Press Ctrl+Shift+N to open the entry form
- Form fields: title, app name, tag, mood, content
- Auto-refreshes every 30 seconds
- New entries can be added when building apps

## Issues
- None yet

## Todos
- Could add sound effects (typewriter clicks, static)
- Could integrate with git commit history to auto-generate entries
- Could add search/filter by date or tag

## Technical Notes
- Uses Supabase for entry storage
- Fallback entries shown if database is empty
- Mobile responsive with adjusted font sizes
