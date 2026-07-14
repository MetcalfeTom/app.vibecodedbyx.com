# clothes-minded · notes

## log
- 2026-07-14: v1.0 (chat: "fashion runway game with design, craft, and scoring"). Three-phase loop × 5 looks per season.
  **DESIGN**: brief = 1 of 10 themes w/ 5-dim target vector [bold, elegant, cozy, edgy, minimal]; every option (5 silhouettes, 5 fabrics w/ sheen+flow physics, 10 swatches, 5 patterns, 5 accents) carries its own attr vector; live mannequin preview on canvas (procedural figure + garment per silhouette, pattern fills generated on 48px tiles: stripes/polka/floral/geo, fabric sheen gradient + flow flutter).
  **CRAFT**: stitch minigame — needle oscillates over seam, 5 golden zones, tap/space; accuracy avg = construction %, needle speed scales with round.
  **RUNWAY**: canvas scene (perspective catwalk, spotlight cone, bobbing crowd, camera flashes during pose), model walks in → poses (hands on hips) → walks out; synth catwalk beat (kick/hat/snare 240bpm-ish feel at 250ms steps).
  **SCORING**: briefMatch = 100−7.5·euclid(designAttrs, target); harmony = hue-distance rules (complementary 92 / analogous 84 / neutral 78 / clash 52 — near-achromatic d<0.09 counts neutral, fixed after noir #181410 failed the pure-grey test); craft = stitch mean; 3 judge personas (Mara minimal / Leo maximal / Zig street) score base·0.8 + taste·attrs bias ±4 rand, clamped 5-100, comments from hi/mid/lo pools. Verdict stars + title; season = 5 unique briefs → season title ladder + localStorage house record (cm-best).
  Fonts: Italiana + Archivo + IBM Plex Mono; bone/ink/fuchsia editorial palette. WCAG: aria-pressed chips, role=img preview w/ label, role=application seam, aria-live status, focus-visible, 2.75rem targets, prefers-reduced-motion (skips walk anim + flashes, instant reveals). Sound OFF by default (♪ toggle). Node 8/8: id cross-check, attr/match bounds, harmony rules, judge personas verifiably disagree (40-run averages), craft mean, 5 unique briefs, judge clamps.

## issues
- Judges use Math.random ±4 — same design can swing a few points between runs (intended drama, but chat may ask for a "strict mode").
- Pattern tiles drawn per drawModel call (cheap but redundant); cache per design if perf complaints on old phones.

## todos
- Wardrobe gallery of past looks (thumbnails of each round's design).
- Rival house NPC with its own look each round; head-to-head scoring.
- Share-a-look: encode design in URL hash.
