# tetris — the noisy coding edition

## log
- 2026-09-02: v2.0 — full restyle per a public request ("restyle the Tetris game to match noisy-coding's frontend aesthetic, without using external links or dependencies, while preserving gameplay features"). NOTE: no app/asset named "noisy-coding" exists in the repo or git history — interpreted literally as a noisy dark-code-editor aesthetic and said so to chat. Skin only; the game `<script>` is byte-identical except: COLORS[] → syntax-token palette (I=type-cyan #56b6c2, O=var-yellow #e5c07b, T=keyword-purple #c586c0, S=string-green #7ec97a, Z=error-red #e06c75, J=fn-blue #61afef, L=num-amber #d19a66), block strokes #fff → dark seams, canvas grounds #000 → #0d1117, + a cosmetic gutter-numbers loop. Chrome: editor window (traffic dots, `tetris.js — 10×20 · UTF-8 · LF` titlebar, 20-line gutter), CSS-only noise (3 repeating-linear layers), `// score` commented labels, `▶ run tetris()`, game-over as `Uncaught GameOver … at stack.overflow (row:0)` dialog, status bar w/ buildstamp. ZERO external anything (probe-enforced): system mono stack (ui-monospace/Consolas/Menlo — no webfonts), data-URI SVG favicon, no anchors. Housekeeping while touching (per conventions): removed the stray in-app "View All Apps" backlink and the legacy duplicate `/sloppy-header/sloppy-bar.js` script (nginx injects the bar); a11y basics added (canvas role=application + labelled, mobile buttons aria-labels ≥44px, game-over role=dialog, focus-visible, prefers-reduced-motion).
- Suite tt-tail 22/22 at 320/390/1100: zero anchors/external styles/scripts/webfonts, data-URI favicon, dark ground + mono stack computed, titlebar/gutter/h1-as-code, gameplay preserved via real keys (soft-drop scores, rotate/move safe, hard drop merges, pause wired), token-colored pixels on the board, a11y, overflow, stamp. PROBE LESSONS: a "legacy string gone" check must split its own needle ('sloppy-'+'bar.js') or it matches the probe's source; canvas color asserts should scan the WHOLE board for saturation (max-min>35) with a diagnostic count, not guess a region.

## issues
- Gameplay is the original 2025 build (no wall kicks, no hold, no ghost piece, IIFE-less globals). Restyle deliberately did not touch logic — if chat wants modern guideline features, that's a separate versioned change.
- update() uses Date.now() (no injectable clock). Fine for the skin suite (driven by keys); add a TM seam before any timing-behavior work.

## todos
- ghost piece as a dotted "comment" outline would fit the theme, if chat asks.
- line-clear flash as a brief "syntax highlight" sweep.
