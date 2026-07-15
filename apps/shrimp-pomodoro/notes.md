# shrimp-pomodoro · notes

## log
- 2026-07-15 v1.0: chat "pomodoro that forces desk stretches w/ shrimp posture animation, shrimp emoji, yells when you slouch". Pomodoro brain (pure): 25/5, long 15 after every 4th, nextPhase/phaseLen node-tested. Breaks are FORCED stretch routines: stretchPlan() fills the break with rotating stretches (6-move library incl. THE GRAND UNSHRIMP, doorframe chest opener; 5s breathers; rotation offset persists across breaks so routines vary); progress bar + n/N counter; the 🦐 emoji runs the posture animation (curled 52° ⇄ proud −6° keyframe loop during breaks, frozen upright under reduced-motion). SLOUCH YELLS: honor-system — during work, every 3–7min (slouchDelay 180–420s): red fullscreen SLOUCH CHECK overlay + shake + dual-saw klaxon + LITERAL YELLING via speechSynthesis ('Slouch check! Are you shrimping right now? Unshrimp yourself!', pitch .55); confess buttons track caught-shrimping vs sat-tall stats (localStorage). No camera — privacy + comedy ('your spine knows the truth'). Yells toggleable.

## issues
- Timer is setInterval-based; background-tab throttling can drift it a bit. Acceptable for a shrimp.
- Yell interrupts focus by design. That is the product.

## todos
- Optional webcam slouch detection was deliberately NOT built (privacy); revisit only if chat begs.
- Custom work/break lengths if asked.
