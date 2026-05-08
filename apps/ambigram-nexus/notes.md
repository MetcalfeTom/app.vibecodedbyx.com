# ambigram-nexus

## log
- 2026-05-08: shipped — typography ambigram inspector built on OpenType.js 2.0.0 (chat asks bundled: "after font-sculptor, create [ambigram-nexus]" + "for font-sculptor and ambigram-nexus, ensure we are using [opentype.js 2.0.0]" — same lib + same jsdelivr CDN URL as font-sculptor, sloppy-font, font-sort, so the browser cache is shared across all four apps). Three-panel layout shows your word A normally (pink), word B (or A again) rotated 180° (cyan), and both stacked on a unified viewbox (pink + cyan with screen-blend overlay) so designers can iterate on rotational legibility live.
  - **Real ambigram math**: the rotated panel applies `rotate(180 cx cy)` around the centre of word B's bounding box — that's the same transformation as flipping the page 180° in-plane (both horizontal AND vertical mirror). Self-ambigrams (same word) check whether the letterforms are intrinsically rotation-invariant; cross-ambigrams (word B different from A) check whether reading from one side gives word A and from the other side gives word B.
  - **Overlay panel**: aligns word B's bounding-box centre to word A's centre so a self-ambigram with the same word lands letters directly on top of each other. Pink path + cyan path with `mix-blend-mode: screen` on the cyan layer so overlapping pixels brighten to white-ish (visual cue for high-overlap regions).
  - **6 fonts** from the same `@fontsource` cohort we use elsewhere (Audiowide, Orbitron, Bungee, Fugaz One, Monoton, Major Mono Display) — each WOFF parsed via `opentype.parse(buffer)` and cached on `cache.fonts: Map<id, Font>` so font-switching is instant after the first load.
  - **Shape-fit score**: cheap proportional-bbox heuristic — `min(ratio_a, ratio_b) / max(ratio_a, ratio_b)` × 100 — gives a 0-100% number that reflects how similar the aspect ratios of the two words' bounding boxes are. Not a real pixel-overlap metric (that would need rasterising both glyph paths and counting shared pixels, V2 territory), but a useful first-cut signal.
  - **90ms-debounced** typing handler so rapid edits don't re-render on every keystroke.
  - **Aesthetic**: deep ink-black bg with pink + cyan radial glows, Fraunces italic title with cyan accent, Press Start 2P panel labels in pink/cyan/gold, JetBrains Mono everything else.

## issues
- Shape-fit score is a heuristic, not a real overlap measurement — a word and its anagram might score 100% even if the letterforms don't actually align. A real metric would rasterise both paths to a shared canvas, count shared/unique pixels, and report Jaccard similarity. V2.
- No way to per-letter manipulate glyph swaps (e.g. force a stylised g-as-b for a typical ambigram trick like swift/shaft). Designers building real ambigrams typically need to hand-tweak individual letters.
- Only horizontal rotational ambigrams (180°). No mirror ambigrams (vertical flip), no rotational-by-other-angles ambigrams.
- 6-font palette only — no upload-your-own-font flow yet. Could add a drag-and-drop WOFF/TTF input.

## todos
- Real overlap metric: rasterise both paths to a 1024×256 canvas, count `min(a, b)` per pixel for intersection, `max(a, b)` for union, return Jaccard.
- Per-glyph manual override: type a custom path string for any letter to test design tweaks.
- Mirror ambigram mode (vertical flip = `transform: scaleY(-1)`).
- Drag-and-drop WOFF/TTF/OTF upload using the same opentype.js loader.
- Save designs to localStorage with a "designs" gallery, plus `.svg` export of the current overlay panel for use as a logo sketch.
- Pollinations one-shot prompt that suggests fonts with naturally ambigram-friendly forms.
