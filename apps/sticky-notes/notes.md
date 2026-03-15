# Sticky Notes

Pin colorful sticky notes to a corkboard. Drag, edit, and organize your thoughts.

## log
- 2026-03-15: Initial build. Corkboard with draggable sticky notes. 7 note colors (yellow, pink, blue, green, orange, purple, white) with matching shadow tones. Each note has: editable textarea with Caveat handwriting font, pushpin (radial gradient red pin), per-note color picker dots, delete button, creation date. Random slight rotation on each note for natural look. Drag notes by header area (textarea click-through preserved). Double-click board to add note at cursor. Z-index stacking on grab. Smooth drag with grab/grabbing cursors. Delete animation (scale down + fade). Cork texture via SVG turbulence filter + radial gradient warmth. Inner shadow vignette. Toolbar: add note, 7 color swatches, clear all (with confirm), note counter. localStorage auto-save. Welcome notes on first visit. Caveat + IBM Plex Mono typography, warm cork brown palette.

## issues
- None yet

## todos
- Pin color options
- Note resize handles
- Search/filter notes
- Export notes as text/JSON
- Snap-to-grid option
- Note grouping/stacking

## notes
- No database — localStorage persistence (key: 'sticky-notes-data')
- Save format: JSON array of {id, x, y, text, color, rot, z, created}
- Z-index increments globally on each grab to bring note to front
- Rotation: random ±4 degrees, straightens to 0 while dragging
- 7 colors with matched shadow colors in SHADOW_COLORS map
- Touch support: touchstart/touchmove/touchend with passive:false
- Double-click on empty board area creates note at cursor position
- Delete confirmation only on Clear All, individual deletes are instant
