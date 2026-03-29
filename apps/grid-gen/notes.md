# CSS Grid Generator

## log
- 2026-03-29: V1 — Dry, technical CSS grid generator. Inputs for columns (1-12), rows (1-12), column gap, row gap, justify-items, align-items. Per-track size inputs (default 1fr, editable to px/% /minmax/auto/etc). Live preview grid with numbered cells. Generated CSS code box with copy button. No neon, no glow — IBM Plex Mono on cream/white, minimal borders.

## features
- Column and row count inputs (1-12)
- Per-track size inputs (C1, C2... R1, R2...) with arbitrary CSS values
- Column gap and row gap inputs (any CSS value)
- Justify-items and align-items dropdowns
- Live preview grid that updates in real-time
- Generated CSS code output
- Copy to clipboard button
- Smart gap output (single `gap` when col/row gaps match)
- Only outputs non-default properties (no justify-items: stretch)

## issues
- None currently

## todos
- Grid area naming and visualization
- Drag to resize tracks in preview
- Export as HTML + CSS
- Add grid-auto-flow control
- Span cells across multiple tracks

## notes
- Track inputs dynamically rebuild when col/row count changes
- Preview uses actual CSS grid on the DOM element
- Cream/white design intentionally "dry" per request — no neon
- IBM Plex Mono only, no display font
