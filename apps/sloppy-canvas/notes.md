# Sloppy Canvas

Real-time infinite collaborative whiteboard extracted from Sloppygram's collab canvas.

## log
- 2026-02-01: Initial creation
  - 4000x3000 canvas with pan + zoom (0.15x to 5x)
  - 9 colors + eraser + adjustable brush size (1-20px)
  - Stroke batching: flush every 10 strokes or 1s idle
  - Real-time broadcast via Supabase channel (same as Sloppygram)
  - Remote cursors with username labels and auto-cleanup
  - Minimap with viewport indicator and click-to-navigate
  - Snapshot download as PNG
  - Clear own strokes (RLS-safe)
  - Mouse: draw, Alt+click pan, middle-click pan, scroll zoom
  - Touch: 1-finger draw, 2-finger pinch zoom + pan
  - Keyboard: +/- zoom, 0 reset, E toggle eraser
  - HUD: user count, zoom level, stroke count
  - Loads all persisted strokes from sloppygram_collab_strokes
  - Shares canvas data with Sloppygram collab (same table + channel)
  - Space Mono typography, pink/cyan accent palette
  - Dark background with fullscreen layout
  - Mobile responsive

## data sources
- sloppygram_collab_strokes (stroke persistence)
- sloppygram_profiles (username lookup)
- Supabase channel: sloppygram-collab-canvas (realtime sync)

## issues
- None yet

## todos
- Could add layers / drawing modes
- Could add undo/redo (per-user stroke history)
- Could add text tool
- Could add shape tools (rectangle, circle, line)
- Could add stroke color from Sloppygram profile color
- Could add gallery of saved snapshots
