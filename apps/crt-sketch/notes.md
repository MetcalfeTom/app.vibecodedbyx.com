# crt-sketch · notes

## log
- 2026-07-15 v1.0: chat "retro pixel art canvas, CRT scanlines, serializes to URL hash, keep it minimal". 16x16 canvas (image-rendering pixelated) in a CRT bezel (scanline+vignette ::after overlay, no animation = nothing for reduced-motion to kill), 16-color palette (index 0 = bg/eraser), drag painting w/ pointer capture. Codec: 256 hex nibbles in location.hash, debounced replaceState (no history spam), empty canvas clears hash; hashchange listener restores (back/forward navigates drawings). COPY LINK + WIPE, that is the whole UI.

## issues
- 256-char hashes are long but well under URL limits; RLE was considered and rejected for minimalism.

## todos
- Only if asked: 32x32 mode (1024 nibbles still fine), PNG export.
