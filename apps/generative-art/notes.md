# Generative Art Studio

## log
- (pre-2026-09) eight canvas algorithms in separate modules (flowField, particles, waves, spirograph, circlePacking, fractalTree, lissajous, constellation), control panel with per-art sliders.
- 2026-09-26: removed `<script src="../../supabase-config.js">` — the shared config is an ES module, so as a classic script it threw a SyntaxError on every visit; the only use was a console.log of the session. Real og.png (flow field, UI hidden, Major Mono title overlay) — og:image used to point at a missing og-image.png.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.

## issues
- none reported yet.

## todos
- export/save the canvas as PNG; a random "surprise me" preset button.
