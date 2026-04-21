# Glitch Canvas

## log
- 2026-04-21: Created. 2D drawing app where every brush is a corrupted texture. 9 brushes: **DATAMOSH** (6–20 horizontal color-channel strips with random offsets, RGBA channel cycling + core block), **SCANLINE** (alternating rows with random skip/jitter, white speckle accents at 30%), **PX SORT** (vertical strips with sorted dark→bright or inverse gradients per strip, per-step mixed color), **STATIC** (circular masked ImageData with pure-noise or color pixels, 35% chance per filled pixel uses the brush color), **RGB SHIFT** (three translucent rects offset by size×0.08×(0.5+chaos) in magenta/cyan/lime channels + speckles in chosen color), **JPEG** (8×8 block grid with posterized colors + random white edge lines at chaos×0.4), **CRT** (3px phosphor triad columns in red/green/blue + occasional color overlay), **SMEAR** (samples 8×size region of current canvas, redraws 5–21 offset copies at 0.28 alpha + stretches horizontally), **VOID** (eraser — `destination-out` jagged rectangles). Each brush `.stamp(x,y,size,chaos,color)` draws directly to the main ctx. **Controls**: 260px left toolbar with 2-col brush grid (custom CSS-canvas icon per brush), 12-color palette swatches, size slider (16–200), chaos slider (0–1), spacing slider (1–40 for drag-stamp interval), canvas bg (black/white/noise). **Input**: pointer-captured drawing, `drawLine(x0,y0,x1,y1)` accumulates distance and stamps every `spacing` pixels along the segment. Top bar: Undo / Save PNG / Wipe (and Ctrl+Z / Ctrl+S / [ ] shortcuts for size). Undo keeps last 6 ImageData snapshots. **Canvas**: fits into stage with 4:3 aspect, max 1200×900 buffer, `image-rendering: pixelated`, CRT scan-overlay (3px repeat) mix-blend overlay on top. Magenta 1×1 pixel cursor ring mix-blend-difference. Status bar shows brush/color/size/chaos. Palette: #ff2ea6 / #00f0ff / #a7ff3f / #ffcb36 accents on black. Major Mono Display (title with RGB-split shadow + blinking `_`) + Silkscreen (labels) + JetBrains Mono (body).
- Pollinations OG image.

## features
- 9 glitch brushes w/ size, chaos, spacing
- 12-color palette (black/white + 10 neon)
- Canvas bg: black / white / grayscale noise
- Undo stack (6 snapshots), Save PNG, Wipe
- Keyboard: Ctrl+Z undo, Ctrl+S save, [/] adjust size
- Pixel-style cursor ring w/ blend-mode
- CRT scan-overlay on top of canvas
- Responsive: panel collapses above canvas on narrow

## issues
- Smear brush reads back from canvas — can be slow at huge sizes on low-end devices; capped via 8×size window.
- Undo snapshots are raw ImageData — 6-slot cap keeps memory bounded.
- Very high chaos + large size can fill the canvas quickly.
- Background change pushes an undo snapshot; repeated bg toggles eat undo slots.

## todos
- Pressure sensitivity (pointerType=pen → width)
- Symmetry / mirror drawing mode
- Post effects: datamosh pass, scanline pass, pixelsort pass across whole canvas
- Custom color picker (HSL wheel)
- Load image → datamosh over it
- Brush blending modes (add / multiply / difference)
