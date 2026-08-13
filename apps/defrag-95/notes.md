# defrag-95 (Disk Defragmenter — a Windows 95 séance)

## log
- 2026-08-13: v1 per chat ("Windows 95 defragmenter emulator with authentic pixel styling, animated block movement, fake progress freezes, dramatic completion screen"). Single file, system Tahoma/MS-Sans stack (no webfont — authenticity), teal desktop.
  - **Authentic chrome**: beveled .win borders (2px lgrey/black + inset shadows), navy→blue gradient titlebar with working drag (pointer capture), bevel-press tbtn/b95 buttons (:active border flip), non-functional menubar with hover highlight, segmented-block progress fill (repeating-linear-gradient), twin statusbar cells, wait-cursor during freezes. Close button refuses: "This is a defragmentation appliance now."
  - **The grid**: 60×22 canvas cells — fragmented red / optimized blue / free white / bad black (red slash, "do not ask") / green read + yellow write heads. Engine: random-scan read → write-head consolidation (top-left fill), heals fragments, drive-chatter square-wave clicks (gesture-gated toggle).
  - **Fake freezes**: scripted at journey-percent thresholds {23,47,69,91,99} with durations 4–12s — progress + moves hard-freeze while the drive "thinks" (read flickers, seek clicks), status shows era-correct lies ("Reading drive information...", "Reticulating splines..."); the 99% freeze adds "(Not Responding)" to the title for 12 seconds, exactly as remembered.
  - **DESIGN FIX (probe-caught)**: the drive seeds ~38% pre-optimized, so absolute thresholds fired the 23% freeze on tick one. Thresholds now map into the REMAINING range at Start (base+(100−base)·at%) — freezes are percentages of the journey, not the odometer.
  - **Dramatic completion**: fanfare arpeggio, three firework bursts in legend colors, dialog with stats (clusters moved / fragments healed / freezes survived / "time you will never get back"), the honest "Estimated performance improvement: 0.4%. You watched the whole thing. That part was for you." OK / Defragment again (reseeds a fresh mess).
  - **Controls**: Start/Pause(actually pauses)/Stop with a guilt-trip confirm dialog ("Your drive will remain a mess. It will remember this.").
  - **BLUESCRN.EXE**: 💀 desktop shortcut per the repo's retro-desktop convention (new tab noopener + same-tab fallback), probe-spied.
  - Verified 19/19: grid seed (1320 cells, 300+ fragments), red+blue pixels, movement + climbing progress post-fix, freeze hits/stalls-progress-and-moves/status-swap/releases, pause, stop-confirm + keep-going, (Not Responding) observed at 99, completion + drama dialog stats, zero fragments at end, again-reseeds, bluescrn spy, unclosable close. Mid-run screenshot reviewed (caught mid-"Reticulating splines").

## issues
- Total runtime at real speed ≈2–3 min by design (freezes included) — chat may ask for a turbo toggle; resist lightly, the waiting IS the app.
- prefers-reduced-motion kills CSS anims but canvas blocks still move — acceptable (content, not decoration); fireworks could be gated if asked.

## todos
- Turbo ×8 easter egg (hold Shift?) for the impatient.
- SCANDISK.EXE companion (surface scan with the snake of doom).
- "Schedule nightly defrag" checkbox that does absolutely nothing, persistently.
