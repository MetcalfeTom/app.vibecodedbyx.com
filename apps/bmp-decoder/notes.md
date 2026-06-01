# bmp-decoder

## log
- 2026-06-01: initial build. **Pure-JavaScript BMP file decoder** — drop a `.bmp`, get the parsed headers, a rendered preview, and the raw 2D pixel array (`pixels[y][x] = {r,g,b,a}`). Zero external libraries. Single self-contained ~22KB HTML.
  - **Decoder** (`parseBMP(arrayBuffer)`):
    - Validates 'BM' magic at offset 0
    - Reads `BITMAPFILEHEADER` (14 B): file size, pixel-data offset
    - Reads `BITMAPINFOHEADER` (40+ B): width, height (signed → negative = top-down), planes, bpp, compression, image size, DPI, palette size
    - Loads color table (palette) for bpp ≤8 as BGR0 entries
    - Computes row stride per BMP spec: `((width*bpp + 31) >> 5) << 2` (4-byte alignment)
    - Decodes pixel data per-row, flipping bottom-up scanlines into top-down `pixels[y][x]` so consumers always get index 0 = top row
    - **Supported formats**: 24bpp BGR · 32bpp BGRA · 8bpp indexed · 4bpp indexed (2 pixels/byte, high nibble first) · 1bpp monochrome
    - **NOT supported** (throws clear error): RLE-compressed (modes 1/2), BITFIELDS (mode 3), 16bpp 5-5-5 / 5-6-5, V4/V5 alpha masks
    - 32bpp post-pass: if every alpha byte is 0 (common when Windows tools zero out the reserved alpha), promote all to 255 so the image renders visibly instead of fully transparent
    - All multi-byte reads via custom u16/u32/s32 helpers (little-endian, masked >>> 0 for unsigned, two's-complement for signed) — no DataView dependency
  - **UI**: drag-drop or click-pick `.bmp` file → file stays in browser, nothing uploaded. Renders 3 panels:
    1. Preview canvas (`image-rendering: pixelated`, scaled to max 480px) with checker bg for transparency clarity, ⬇ PNG export, ✕ clear
    2. Headers panel — definition-list of every parsed field + first 64 bytes hex-dumped with file-header bytes (0-13) tinted phosphor green, DIB bytes (14-53) tinted amber, ASCII gutter
    3. 2D array sample — 8×8 table showing top-left swatches + RGB(A) values, then JSON snippet showing first 4 rows × first 16 cols, with three export buttons: copy full JSON / download `.pixels.json` / copy flat Uint32 hex (`0xAARRGGBB` format)
  - **Aesthetic**: GitHub-dark-style "lab" theme — `#0d1117` bg with phosphor green (`#5eff8a`) + cyan (`#5effff`) + amber (`#ff9d4d`) accents, JetBrains Mono everywhere except IBM Plex Sans for the marquee title, subtle 28px dot-grid background overlay, dashed dropzone with hover/drag-over highlight.
  - **A11y per directive**: rem-everywhere, semantic markup (`<main>`/`<header>`/`<section>`/`<h1-2>` + `<button type=button>`), dropzone has `role="button" tabindex="0"` + Enter/Space keyboard handlers, role=status aria-live on toast + sr-only announcer, focus-visible accent outline, file picker hidden but triggered programmatically, prefers-reduced-motion respected (no motion to disable here — all interaction is event-driven).
  - **Mobile** @540px: header stacks vertically.

## issues
- 16bpp (5-5-5 and 5-6-5) not supported — would need separate compression-mode branches
- RLE-compressed BMPs (modes 1, 2) not supported — relatively rare, would need state-machine decoder for run-length pairs
- V4 / V5 BITMAPINFOHEADER variants with custom color masks not supported — would need bit-field mask parsing
- Very large BMPs (>50 MB) may strain the 2D array allocation; should chunk into typed arrays for production use
- Palette validation is minimal — out-of-range indices throw rather than degrade

## todos
- Add 16bpp BITFIELDS decoding (mask-based RGB extraction)
- Add RLE8 / RLE4 decompression
- Switch to Uint32Array storage internally + lazy `{r,g,b,a}` object materialization for performance on huge images
- Show file size warning + chunk progress for >10MB inputs
- Add a "round-trip" mode: re-encode the decoded pixels back to a fresh BMP for comparison
- Optional histogram panel showing R/G/B channel distributions
