# shrimp-posture (Shrimp Posture Clinic)

## log
- 2026-08-07: **deshrimp-to-frog mutation + croak** (chat ask, confirmed by follow-up). New lowest tier `frog` — COMPLETE AMPHIBIAN — for those who deshrimp so hard they overshoot the animal kingdom: triggers when stretch ≥60 AND |pelvis| ≥55 (checked before 'stretched', so extreme overcorrectors with lying pelvises fall in the pond). Mannequin mutation past stretch 55 + pelvis 50: pond-green tint, inflating throat sac, periscope pond eye, webbed fingers on the desk; live sass whispers "wait. are you… croaking?" on approach. **The croak**: two-burst WebAudio ribbit (sawtooth 96→66Hz, 24Hz square AM rattle on the gain, 520Hz bandpass Q3.4) replaces the stamp thunk for frog verdicts only. Frog roast pool ("Your spine has achieved pond clearance."). Verified: 34/34 boundary checks (including the exact 60/55 threshold and a 59-stretch near-miss that correctly stays Overcorrector — a test-side rounding assumption the suite itself caught) + real-Chromium probe: slid to curl −70 / pelvis 75, judged tier=frog, AMPHIBIAN verdict + FROG stamp, 0 errors. Scratch-copy → atomic deploy per iron rule.
- 2026-08-07: v1 per chat ("shrimp posture grader with a three-axis shame meter, curved/stretched/compensating tiers, and maximum sass"). Single-file, no deps.
  - **The Mirror**: canvas side-view mannequin at a desk (chair, laptop, staring eye), posed with three sliders = the three axes: NECK (head jut, −60..100), SPINE (the curl, −80..100), PELVIS (the cope, −100..100). Spine drawn as chained quadratics from hip→mid→shoulder→neck→head whose control points move with the sliders. **Shrimpification**: past curl 55 the figure tints coral and grows antennae, four segment arcs along the back, and a tail fan; past stretch 45 it goes teal with a dashed "invisible ruler" behind the spine. Live sass line updates while sliding ("ah, the classic 4pm silhouette").
  - **Grading** (pure block, node-tested): neckShame (backward tuck only 35% as shameful), curlShame, stretch (overextension ×1.2), copeShame = |pelvis|·0.85 + an 18-point **compensator bonus** when the spine reads fine (<35) but pelvis/neck are lying (>40). Total weighted 35/45/20 + stretch·0.4. **Tiers**: aligned (all <25) / stretched (≥40) / crustacean (curl ≥70) / semi (curl ≥45) / compensating (else). Grades S→F−−.
  - **Three-axis shame meter**: triangular radar (NECK top, CURL bottom-left, COPE bottom-right), rings at 33/66/100, coral shame polygon with per-vertex numbers, values ease toward the verdict at 8%/frame (instant under reduced-motion).
  - **Maximum sass**: tier verdicts (SUSPICIOUSLY ALIGNED / THE OVERCORRECTOR / SEMI-SHRIMP / CERTIFIED CRUSTACEAN / THE COMPENSATOR) + per-axis roast pools + begrudging compliments when clean. Rubber-stamp animation (rotate-scale thunk, mix-blend multiply) + WebAudio stamp thud (sine drop + filtered noise, toggleable). "Copy my shame" clipboard share line.
  - **Aesthetic**: retro clinical chart — cream paper w/ ledger-line grain, Young Serif + Chivo Mono (both first use in repo), coral/teal/stamp-red, hard offset card shadows.
  - **A11y**: labeled sliders w/ live value readouts, canvases role=img with descriptions, verdict region aria-live, focus-visible teal, ≥2.75rem targets, reduced-motion kills stamp anim + radar easing.
  - Verified: 66 pure-logic boundary checks (tier thresholds at 45/69/70, stretch scaling, cope bonus on/off, full input-grid range/NaN sweep), id cross-check, and a real-Chromium probe that slid the sliders to curl 88 / neck 70 and pressed JUDGE ME → 0 errors, tier=crustacean, verdict rendered.

## issues
- A Certified Crustacean can still grade a D if the pelvis was honest — tier carries the shame, the grade is the weighted composite. Ruled a feature (posture nuance, and it's funnier).
- Mannequin proportions are vibes-based, not biomechanical. The clinic stands by them.

## todos
- Webcam mode with a pose model (heavier; needs a model CDN decision) — "the clinic SEES you."
- Daily posture check-in streak with localStorage + increasingly disappointed copy.
- A shrimp hall of shame leaderboard (Supabase) of worst submitted postures.
