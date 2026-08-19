# Floppy Chores — retro disk label generator

## log
- 2026-08-19: v1.0 — built per chat. Chores rendered onto pixel-art 3.5" floppies, downloadable as PNG. ZERO EXTERNAL ASSETS loaded by the page (probe-enforced: no script src, no font/css links, data-URI SVG favicon; og:image is scraper-only meta content). The typeface is a hand-drawn 5×7 bitmap font (~48 glyphs A-Z 0-9 punctuation) living in the source, rendered cell-by-cell on a 96×96 disk grid: shell (6 colorways w/ lite/dark shading + clipped corner via destination-out carve), metal shutter + read window, write-protect notch, HD mark, white label w/ amber stripe, ruled lines the text sits ON like handwriting. Title wraps 2×11 chars; download renders offscreen at cell=8 (768px) → toDataURL → <a download>. Shelf: saved chores as mini-disks (cell=1), click-to-load, eject, 24 cap, localStorage 'floppy-chores-v1'. UI on system monospace stack (no-external-assets extends to fonts). WCAG basics first commit. Probe 10/10 (font coverage, wrap, 3-scale draw, PIXEL SAMPLING — label light/shell dark actually land, shelf flow, persistence, aria-follows-title). Screenshot reviewed; HD/1.44MB nudged 1 cell in-bounds after review.

## issues
- drawDisk has two vestigial no-op loops around the corner carve (transparent fill + zero-height rects) — harmless, tidy on next touch.

## todos
- print-sheet mode (3×3 labels on one page) if chat asks.
