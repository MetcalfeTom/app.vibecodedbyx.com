# font-sculptor

## log
- 2026-05-08: shipped — pixel-grid font designer that exports a real .otf via OpenType.js 2.0.0 (chat asks bundled: "create a simple custom font creator app" + "use opentype.js in font-sculptor to export and handle glyph data"). Each glyph is painted on a 14×14 cell grid; on export, every filled cell becomes a 64×64 unit square in font-units (so a glyph fills 14·64 = 896 of the 1024 units-per-em), the squares are stitched into an `opentype.Path`, wrapped in `opentype.Glyph`, and assembled into an `opentype.Font` whose `toArrayBuffer()` is downloaded as a CFF-flavored OpenType (.otf). **Verified end-to-end** via Node smoke-test: feed a one-glyph font through the same opentype.js call chain → 1456-byte buffer with `OTTO` magic header (CFF-OpenType signature). Real font, installs like any other.
  - **32-glyph charset**: A-Z + 0-9 + `. , ! ? -` + space. Could expand to lowercase later — V1 covers the common case (display fonts often only include caps).
  - **Layout**: glyph palette strip up top (32 cells, each shows a 7×7 mini preview of the glyph's pixels); 14×14 paint canvas centered with paint/erase/invert/clear/copy/paste tools; right-side metadata panel for font name + style + preview text; live preview canvas at bottom that renders the typed string using the user's pixel data (each filled cell drawn as a small square with pink glow); export bar with save / load / export-otf / reset buttons.
  - **Editor**: pointer-event paint via `setPointerCapture` so dragging works smoothly across the canvas; `paintAt(p, val)` only fires DOM updates when a cell actually changes (no work on stationary drag); paint vs erase is a toolbar toggle, drag value is locked at pointerdown so a drag won't accidentally flip back; tools inside the canvas-tools strip: invert (flip every cell), clear (wipe glyph), copy (snapshot the current glyph to clipboard), paste (apply clipboard to the current glyph). Keyboard: type any letter A-Z/0-9 to switch to that glyph (when not focused in a text input).
  - **Live preview**: each character of the input renders glyph-by-glyph as small pink squares with shadowBlur halo. Letters advance by `(GRID + 1)` cells so there's natural inter-letter tracking. Repaints on any pixel change AND on text-input change. Spaces advance position without drawing.
  - **OpenType path generation**: each filled grid cell emits a closed counter-clockwise square (M, L×3, Z) at coordinates `(x*64, (baselineRow - y)*64)` to (x+1)*64, etc. Y-axis flipped because OpenType uses y-up while canvas uses y-down. Baseline at row 11 of 14: rows 0-10 above baseline (ascender), rows 11-13 below (descender). The Glyph's `advanceWidth = GRID * PX + 64` (one cell of tracking after each glyph except space which gets `GRID*PX` exactly so nothing weird happens).
  - **Mandatory `.notdef`** glyph (index 0): a hollow rectangle so OpenType-spec-required missing-glyph rendering still produces a sad-box for unsupported chars.
  - **Persistence**: save-draft serialises every glyph's 196-bit grid as a flat `'0011...'` string into `localStorage['font-sculptor-v1']` along with the font name + style. Load restores it. No per-draft slots — one slot, last-saved wins.
  - **Aesthetic**: deep ink-black bg with pink + cyan radial glows, Fraunces italic title with pink accent, JetBrains Mono labels, Press Start 2P glyph-strip letter labels, hot-pink filled cells with a baseline indicator line in faint gold so the user knows where the font's baseline lands.
  - **Boot seeds**: `H`, `I`, and `!` come pre-drawn so the live preview shows something on first launch ("HELLO" still has missing E/L/O until the user paints them).

## issues
- 14×14 is small — recognisable for display fonts, terrible for body text. Could scale to 24×24 with the same pipeline (just bump GRID + PX to keep unitsPerEm sane).
- Diagonals look stair-stepped because each cell becomes a hard-edged square. Future: add a "smooth" toggle that traces cell edges as a polygon outline instead of one-square-per-cell.
- No anti-aliasing in OTF output — pure pixel-square outlines render crisp at integer sizes but rough at fractional sizes.
- No lowercase letters — hand-painting 26 more glyphs is a lot for V1 ergonomics.
- No kerning pairs / font features / ligatures.
- No undo (Ctrl+Z would help on long paint sessions).
- No import — can't load an existing font as a starting point.

## todos
- Undo stack (capture grid state on every stroke end, ~50-step history).
- Lowercase support (a-z, with proper x-height baseline).
- Smoothing pass: convert pixel grids to outline polygons before exporting (Marching Squares).
- 24×24 grid mode for finer detail.
- Import an existing .otf, decompose to a 14×14 raster per glyph.
- Per-glyph advance-width override (currently fixed at GRID*PX + 64).
- Multi-slot drafts (save more than one font at a time).
