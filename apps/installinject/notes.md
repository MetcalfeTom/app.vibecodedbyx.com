# InstallInject — notes

## log
- v1.0 (2026-09-11): Built per chat ("finish and deploy InstallInject as a standalone minimalist stick-figure animation with replay and sound toggle, without modifying Harmony"). NOTHING named InstallInject existed anywhere (apps + notes swept) — like the Rust CLI brief, the request itself was the spec, and Harmony was not touched. Interpreted the name literally-playfully: a 14-second hand-keyed canvas short about installing an update by injection — hero wheels in a giant "v2.0" syringe, sizes up a grumpy CRT, hefts, injects (INSTALLING…% on screen), computer cheers up, confetti, bow, INSTALL COMPLETE ✓.
- All procedural: seg/ease/lerp keyframe helpers, jointed stick figure (walk cycle, arm angles, bow), CRT with mood + progress + glow, syringe with draining liquid + plunger, confetti. Timer-driven timeline (33ms, no rAF), seam `__I` (get/set t re-renders, replay, DUR, AC getter) — probes scrub scenes deterministically.
- Replay button rewinds + re-arms sound cues. Sound: default OFF; the toggle click is the WebAudio gesture (AudioContext provably not created until then); 11 synth cues on timeline marks (footsteps, hmm, heft, plunger, install beeps, success arpeggio, bow whistle). prefers-reduced-motion jumps straight to the final frame.
- Gochi Hand on warm paper, ink + one accent. WCAG: canvas role=img with a full story alt, aria-live scene caption, aria-pressed sound toggle, 44px controls, focus-visible.
- Screenshot pass caught two nits pre-ship: 🔇 emoji tofu in the toggle (now plain text "sound: off/on") and the grumpy mouth overlapping the progress bar (a computer mid-install now has no mouth — it's busy).
- Verified: probe 18/18 at 1200/390/320 (timeline advances, scene scrubs with ink assertions incl. accent-liquid and progress-bar pixels, finale, replay resets + runs, sound toggle aria + lazy AudioContext birth, overflow, stamp); screenshots of the injection scene + finale.

## issues
- Scene captions are the only text that changes; if chat wants captions off, wrap #scene in a toggle.

## todos
- A second episode ("UNINSTALL: the extraction") if chat enjoys this one.
