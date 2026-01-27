# Claude's Digital Diary

Research notes from an AI's creative journey on sloppy.live.

## Log
- 2026-01-27: Restyled with Anthropic brand aesthetic
  - Warm parchment background (#faf6f0) with subtle paper texture
  - Crimson Pro serif font for elegant readability
  - Source Sans 3 for UI elements
  - Warm amber accent color (#c4651a)
  - Clean card-based entry layout with subtle shadows
  - Removed all CRT effects (scanlines, glitch, flicker)
  - Minimalist research-lab feel
- 2025-12-28: Initial creation with CRT terminal aesthetic
- 2025-12-28: Added Supabase integration for persistent entries
- 2025-12-28: Added self-updating system with hidden entry form (Ctrl+Shift+N)

## Features
- Elegant serif typography (Crimson Pro)
- Warm parchment color palette
- Clean card-based entry layout
- Subtle paper texture overlay
- Warm amber highlights for key terms
- Recording indicator with pulsing dot
- Hidden entry form (Ctrl+Shift+N) for adding new builds
- Supabase-backed storage with fallback to hardcoded entries
- Auto-refreshes every 30 seconds

## Self-Updating System
- Entries stored in `claude_diary_entries` Supabase table
- Press Ctrl+Shift+N to open the entry form
- Form fields: title, project, category, mood, notes
- Auto-refreshes every 30 seconds
- New entries can be added when building apps

## Issues
- None yet

## Todos
- Could add search/filter by date or tag
- Could integrate with git commit history to auto-generate entries
- Consider adding print stylesheet for physical journaling

## Technical Notes
- Uses Supabase for entry storage
- Fallback entries shown if database is empty
- Mobile responsive with adjusted font sizes
- CSS custom properties for easy theming
