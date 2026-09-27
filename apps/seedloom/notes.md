# Seedloom

Generative art playground. Every generator is hand-written canvas code (no libraries, no AI images). Layers of generators are composited with blend modes; the UI is sliders, palettes, aspect chips, reseed dice, remix, save PNG, share link.

## log
- v1.3b (2026-09-27): textile looms from a helper (gens-textile.js: Tartan, Stitchwork, Kilim) on the wall and in remixes; its temp canvases fall back to OffscreenCanvas so the wall workers can paint it. Sliders now sketch small while moving and paint full size 200 ms after they rest. ROLES/TILES skip looms that failed to load.
- v1.3 (2026-09-27): streamlined editor (Fela: "improve the editing UX, streamline it a lot"). Drag on the art morphs the open layer (two params per loom, PAD table in app.js, marked ↔ ↕ beside their sliders; Rays' sun follows your finger) and redraws small while dragging (draft canvas + its own cache), then full size on release; tap the art rerolls the open layer. Palettes are little paint cards (6 across). Canvas shapes sit under the art next to the title. Layers: thumbnail per layer (scaled from the render cache), one open at a time, the rest of the sliders and layer tools folded under "more". On phones the art stays pinned on top while the tools scroll under it.
- v1.2 (2026-09-27): the landing is now an endless wall. The ten looms come first, then hand-tuned presets shuffled in with fresh remixes forever as you scroll. Tiles paint in a pool of background workers (wall-worker.js, OffscreenCanvas) with a one-per-frame fallback; far-off tiles free their pixels and repaint from their recipe. Tap any tile to edit it; back returns to the same scroll spot. Undo/redo (buttons + Ctrl/Cmd+Z, Shift+Z / Ctrl+Y), R remix, Esc back. Harmonograph no longer appears in remixes (it only works solo, per Fela). Scripts are versioned (?v=) after a black-screen report that looked like a stale cache.
- 2026-09-27 v1.0: built for xyzfela's request ("stunning generative art playground, you generating all the code, combined with UI tools").
  - 10 generators in gens.js: flow, circles, truchet, ridges, glass (voronoi by half-plane clipping), topo (marching squares, bands via per-cell above-threshold polygons with full-cell run merging), harmono, subdiv, rays, grain.
  - Landing = the "wall of looms" (Fela loved the stream screenshot of all ten side by side and asked for exactly that as the start page, no borders, clean and artistic). Tiles use [gen, palette, seed, noise seed] so clicking a tile opens the same picture in the editor (layer.ns = noise seed; dropped on reseed).
  - Remix: base layer (covers canvas) + overlay layer + 55% grain; 30% of the time a hand-tuned preset instead. "Surprise me" on the wall loads a preset.
  - Share: state JSON (v, pal, aspect, layers [gen, seed, blend, opacity, on, params, ns?]) base64url in #w=. Every value is validated against the generator's param ranges on load (cleanParams).

- v1.1: Fela's art direction: the wall is full-bleed (rows of tiles that fill the whole screen, row count picked so cells are closest to square, canvases object-fit: cover), no gaps, no visible text (sr-only h1), names only on hover as tiny spaced caps in Syne. Editor restyled: hairline sliders, stripe palettes, option words instead of selects, hairline layer list, text buttons + one orange remix pill, museum label under the art (title from seeds, e.g. "Burnt Quarry", plus medium line). Saved PNG is named after the title.

## architecture
- gens.js: window.SL = { TAU, rng, makeNoise, pick, hexA, mix, GENS }. Generator = { name, blurb, params:[{k,label,min,max,step,def}|{k,label,options,def}], draw(ctx,w,h,p,R,pal,N,u) } where pal={bg,c:[5]}, u=min(w,h)/1000 (all sizes in u so a piece looks the same at every resolution), R = seeded rng for layout, N = seeded noise {n2, fbm}.
- A generator draws on a transparent layer canvas; app.js fills pal.bg underneath and composites layers with globalCompositeOperation + globalAlpha.
- Adding a generator: register GENS.<id> in a script loaded before app.js. The add-layer menu and the wall pick it up (TILES lists the first ten explicitly).
- Preview long side 1400 (1100 under 860px wide); Save renders at 2800 long side from scratch.
- Per-layer canvas cache keyed on gen/seed/ns/params/palette/size.

## issues
- None reported yet.

## todos
- More generators (Fela: "add more of them").
- Undo/redo; drag to reorder layers.

## wall notes
- The worker imports every `gens*.js` script listed in index.html (regex in app.js), so new loom files just need a script tag. A loom that touches `document` fails in the worker and that tile falls back to the main thread.
- rollPiece(R) returns a {pal, aspect, layers} recipe without touching S; remix() applies one. parseState() validates a recipe; loadState() applies it.
