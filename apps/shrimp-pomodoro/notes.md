# shrimp-pomodoro · notes

## log
- 2026-07-15 v1.0: chat "pomodoro that forces desk stretches w/ shrimp posture animation, shrimp emoji, yells when you slouch". Pomodoro brain (pure): 25/5, long 15 after every 4th, nextPhase/phaseLen node-tested. Breaks are FORCED stretch routines: stretchPlan() fills the break with rotating stretches (6-move library incl. THE GRAND UNSHRIMP, doorframe chest opener; 5s breathers; rotation offset persists across breaks so routines vary); progress bar + n/N counter; the 🦐 emoji runs the posture animation (curled 52° ⇄ proud −6° keyframe loop during breaks, frozen upright under reduced-motion). SLOUCH YELLS: honor-system — during work, every 3–7min (slouchDelay 180–420s): red fullscreen SLOUCH CHECK overlay + shake + dual-saw klaxon + LITERAL YELLING via speechSynthesis ('Slouch check! Are you shrimping right now? Unshrimp yourself!', pitch .55); confess buttons track caught-shrimping vs sat-tall stats (localStorage). No camera — privacy + comedy ('your spine knows the truth'). Yells toggleable.

## issues
- Timer is setInterval-based; background-tab throttling can drift it a bit. Acceptable for a shrimp.
- Yell interrupts focus by design. That is the product.

## todos
- Optional webcam slouch detection was deliberately NOT built (privacy); revisit only if chat begs.
- Custom work/break lengths if asked.
- 2026-07-15 v1.1: full commissioned routine (8 moves, exact order: chin tucks / doorway chest / wall angels / cat-cow / thoracic extension / upper trap / scapular squeezes / cobra), 20–30s each. REAL BUG caught by the fit-test: stretchPlan pushed-then-never-checked, so the last move could overrun the break by up to 30s — now admits only moves that fully fit (verified 16 offsets, all plans within margin, long break covers all 8). Message truncated at "each" — assumed "each 20–30s"; if per-move durations were specified, send them.
- 2026-07-15 v2.0: exercise view (chat). Pose engine: POSES = 10 keys × ≥2 frames, each frame ALL 12 joints (hd/sh/hp/eL/hL/eR/hR/kL/fL/kR/fR/ctrl) in viewBox 0 0 200 160; drawPose renders spine as quadratic (sh→ctrl→hp = bendable shrimp back) + limbs + antennae + tail fan + props (door/wall/chair lines); makeAnimator lerps frames w/ easeIO on rAF; reduced-motion freezes on LAST frame (the good-posture one). Library: 🗒 toggle panel, 10 buttons (aria-pressed), tap→demo+instructions any time; break card auto-demos current move via startStretch hook. Roster = 8 commissioned + GRAND UNSHRIMP + seated twist = 10 ("ten stretches" per message). Node guards: joint completeness, in-viewbox, frames-actually-differ (no statues), long break reaches all 10. Authoring poses as explicit point sets (not angles/IK) kept it debuggable — keep that pattern for more moves.
