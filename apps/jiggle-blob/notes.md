# jiggle-blob · notes

## log
- 2026-07-15 v1.0: chat "tiny physics toy — falling blob, jiggle physics, mouse interaction, no canvas, one HTML file, just a div that stretches". Honored literally: the blob is ONE div (radial-gradient body, ::before shine, two eye children) deformed by transform scale. Physics: gravity 2400, restitution .58, wall/floor bounces inject velocity into a squash SPRING (k=170 c=8.5) + slow gooey wobble spring (k=120 c=4.5); volume-ish preserving sy=1+s, sx=1-.9s with transform-origin at the base so squash plants on the floor; tilt follows vx. Drag = pointer capture with velocity tracking, release = fling (clamped 2600); grab startles it (+squash.v). Pupils chase the cursor; shadow div scales/fades with height; idle micro-breathing (killed under reduced-motion). Chewy font, pastel room with a floor line at 62 percent viewport height.
- TOOLING GOTCHA: wrote this file with bash printf first — the "%" signs in the CSS values were parsed as format specifiers and silently truncated the file mid-sentence. Use the Write tool (or a cat heredoc) for notes, never printf with prose.

## issues
- transformOrigin at base means airborne squash also anchors at the bottom edge — reads fine in practice.

## todos
- Only if chat asks: a second blob that collides; blob face reacts on hard impacts (o-mouth).
- 2026-07-15 v1.1–v1.6: sloppy_ai skin (visor scan-eye, headphones, persisted); GRV/SPD/AGR faders → v1.4 vertical DJ mixer (rotated ranges, LED readouts, BNC restitution 0–1 default .5 per spec, max-speed kept as 4th channel vs "three sliders" spec — additive compromise); v1.4.1 glow; v1.5 LUX darkness overlay (max 88pct) + impact flashes above the dark; v1.5.1 collision console log (BEFORE reduced-motion return) + max-int32 z; v1.6 point flash → directional bridge glow (per-surface gradients + per-axis scale keyframes, skin-colored via --glow-hot/--glow-mid vars). Blob is now a tunable nightclub instrument.
