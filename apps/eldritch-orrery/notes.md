# eldritch-orrery (The Eldritch Orrery)

## log
- 2026-08-07: v1 per chat ("4D orbital simulation with a tesseract projection, per-planet variable clock speeds, webgl, dark cosmic horror aesthetic"). Single-file, three.js r128 (cdnjs, repo precedent).
  - **True 4D orbits**: each of 7 worlds is a circle in one of the six rotation planes of R⁴ (`plane:[a,b]` picks the axes; per-world constant offsets on the other two axes give variety). A global frame rotation (xw angle A + yz angle B, drift-speed slider) is applied via `rot4` BEFORE perspective projection from the w axis (`s=D/(D−w)`, D=6.2, w clamped below the pole). Because orbits are static 4D circles but the frame turns, their projected paths visibly WRITHE — orbit polylines (128 segments each) are re-projected every frame into dynamic BufferGeometry.
  - **Tesseract sun**: 16 vertices (±0.9)⁴, 32 edges (hamming-distance-1 pairs), rotating in its own xw+yz planes faster than the frame, projected identically — LineSegments + additive glow Points + dark core sphere + pulsing sprite halo.
  - **Per-planet clocks** (the headline mechanic): the Ledger of Worlds panel has an individual 0–6× slider per world plus global "all clocks" and "rotation of the frame" sliders and a pause ("still the wheel"). Each world advances `θ += base·user·global·dt` and shows its own drifting `cycle N.N` epoch readout. The Slow King (base .07) vs Ninth Whisper (.55) drift apart satisfyingly.
  - **Horror dressing**: void palette (#050208, spectral green #8fe6c2, violet, bone), Cormorant Unicase + Xanh Mono, CSS vignette, FogExp2, 900-star shell, canvas-sprite name labels that brighten as a world approaches, whisper line at the bottom (14 ambient lines on an 11–24s timer) and a red **near-pass event**: when a world's projection scale exceeds 2.4 (it swings close to the w-pole and balloons), "IT PASSES NEAR — NAME" with per-world 14s cooldown. Optional 4-voice detuned drone (36/54.2/72.7/109Hz through LFO-swept lowpass, slow-attack gain, aria-pressed toggle, off by default).
  - **Camera**: custom orbit rig (drag rotate, wheel zoom 5–45, two-finger pinch), slow auto-drift until first interaction, hint text fades on first touch.
  - **A11y**: canvas role=application with control summary, all sliders aria-labeled, sr-only live region announces per-planet speed changes, focus-visible, ≥2.75rem buttons, reduced-motion softens whisper transitions, WebGL-unavailable fallback pane.
  - Verified: script syntax, id cross-check (static + dynamic cyc/sp patterns), full head/OG, and real headless Chromium with CDN three.js: 0 errors, `__ORRERY` hook reports 7 worlds + 32 edges. (Headless rAF only ticks once under virtual time — known artifact seen on verified-good apps too, not a liveness bug.)

## issues
- Orbit path re-projection is 7×128 rot4+project per frame plus 16 tesseract verts — trivial for GPUs, fine on phones; if a slow device appears, halve SEGS or update paths every other frame.
- Whisper text is aria-hidden (decorative horror) — the sr-only region only reports slider changes; intentional to keep screen readers un-spammed.
- The near-pass threshold (projected scale >2.4) tuned by eye; only w-involving planes trigger it often (Drowned Eye, Ninth Whisper, Vessel of Moths, Untide) — the xy/xz/yz-plane worlds never balloon, which reads as "some worlds keep their distance" and is kept as flavor.

## todos
- Click a world → camera follows it (horror: the label whispers back).
- A "sanity" meter that climbs while all clocks run >4× and triggers a screen-wide event at max.
- Comets on 4D great-circle paths that pierce the tesseract.
- Per-world lore cards in the ledger (tie into SloppyScape's Cartographer letters?).
