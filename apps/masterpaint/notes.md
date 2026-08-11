# masterpaint (Masterpaint — paint by numbers)

## log
- 2026-08-11: v1 shipped after a credit-wall pause mid-build (folder began life as the-masterpiece, renamed per chat's converging spec: "masterpaint, sidebar palettes, huge canvas, magnifying panel"). Single file, gallery aesthetic (Italiana + Crimson Pro, plaster wall, gilded easel frame).
  - **Three artworks, procedurally authored** (compositions in coarse coordinates supersampled ×2 for organic region edges; flood-fill turns contiguous same-pigment cells into numbered regions): van Gogh 56×40 / 62 regions night-sky study (swirl bands via layered sines, moon + crescent, 6 haloed stars, cypress, village with lit windows) · Vermeer 40×52 / 25 regions girl-in-turban portrait (face with eyes/brows/lips/ear-shadow, twin turban highlights + hanging tail, pearl, fold-striped garment — detail pass added after probe showed only 10 regions) · Rembrandt 60×44 / 49 regions NIGHT WATCH group scene, rebuilt per chat's "make Rembrandt unique from Vermeer" (was a portrait; now landscape: captain in bone black with VERMILION sash, ochre lieutenant, glowing girl, 5 background militia with hats, crossed pikes, banner, drum).
  - **Pigments historically accurate per artist** (Prussian/cobalt/chrome yellow · natural ultramarine/lead-tin yellow · earths/bone black/vermilion), sidebar style lines per chat: bold bright impasto / soft pearl light / dark earthy chiaroscuro.
  - **Sidebar**: all three palettes always visible; clicking another artist's swatch switches artwork AND selects that pigment; per-pigment regions-left counts, ✓ when exhausted, auto-advance to next unfinished pigment.
  - **Magnifier**: 200px panel, 3.5× nearest-neighbor zoom around hovered/tapped cell with crosshair — the promised handle for small region numbers on the huge canvas.
  - **Play**: click region with matching pigment → fills with the real color; wrong pigment → canvas shake + the correct swatch flashes + wrong-dab counter; progress bar; completion card with a true art-history fact per painting; per-artwork localStorage persistence + reset.
  - **A11y**: role=application canvas with instructions, aria-labels on swatches incl. remaining counts, sr-only live region, ≥2.75rem targets, focus-visible, reduced-motion kills shake/flash.
  - Verified: syntax + id cross-check; 15-check behavior probe (sidebar counts, three distinct dims/orientations, vermilion + Night Watch line, paint/wrong/cross-switch/completion/fact/lens-content/persistence); region-count re-probe after Vermeer detail pass (62/25/49, all pigments used per artwork); full-page screenshots of all three painted canvases visually reviewed (crop artifact in first attempt was my probe hiding the sidebar, not an app bug). 0 errors.

## issues
- Region numbers on 1-2 cell regions render at 8px — readable via the magnifier by design, but if chat wants bigger, CELL could go 14→16.

## todos
- Completion varnish: subtle gloss sweep animation over a finished canvas.
- A fourth palette (chat may vote: Hokusai? Monet?).
- Share button rendering the painted canvas to PNG.
