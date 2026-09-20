# Neon Drums

## log
- v1.1 (2026-09-20): FINISHED AS THE BEGINNER-FRIENDLY SEQUENCER per chat ("120 BPM default, visible playhead, tap-to-toggle pads, play-stop, clear, and a simple undo button"). No separate "beginner drum sequencer" was in progress anywhere — this app already had 120 BPM, the lit playhead column, tap/drag pads, PLAY/STOP and CLEAR, so it was finished here rather than duplicated. Added: UNDO (one snapshot per stroke — a tap or a whole drag — and per clear, 50 deep, button + Ctrl/⌘+Z, disabled when empty, live-region text), pads as real `<button aria-pressed>` at 44×44 px with spoken names (grid scrolls inside its wrap on phones, the page never scrolls sideways), PLAY with aria-pressed + Space, labelled sliders, a one-line beginner hint that fades after the first tap or play, a build stamp, a description + png OG image. FIXED two v1 bugs on the way: a stray `a` token in the stylesheet, and the step-number row had TWO leading spacers (markup + script) so "16" wrapped under the labels and every number sat one column to the right. probe 30/30 ×3 widths (seam `window.__ND`), screenshots 1200 + 390 reviewed.
- 2026-03-28: V1 — 16-step drum sequencer with 8 voices. All procedural WebAudio synthesis (kick, snare, hi-hat, open HH, clap, tom hi, tom lo, rimshot). Pointer drag to paint/erase steps. BPM slider (60-200), swing control, volume slider. Beat column highlighting with glow on active steps. Pattern saved to localStorage. Click/tap row labels to preview sounds. Oxanium + Share Tech Mono typography, green-on-black terminal aesthetic.

## features
- 8 drum voices: Kick, Snare, Hi-Hat, Open HH, Clap, Tom Hi, Tom Lo, Rimshot
- 16-step sequencer grid with click/drag to toggle steps
- BPM slider 60-200
- Swing control 0-80%
- Volume slider
- Beat position highlighting with neon glow
- Step numbers with current-step indicator
- Click row labels to preview individual sounds
- Pattern persistence in localStorage
- Clear button to reset pattern
- Touch + pointer support with drag painting

## issues
- Drag painting runs on `pointermove` + `elementFromPoint` over the grid; synthetic pointer tests must dispatch the moves on `#grid` with real client coordinates.

## todos
- Pattern presets (rock, disco, hip-hop, etc.)
- Copy/paste pattern sections
- Per-track volume/mute
- Tempo tap button
- Export pattern as WAV
- Share patterns via URL encoding

## notes
- All drums are procedural WebAudio: oscillators + noise buffers + filters
- Kick: sine sweep 160->40Hz + noise click transient
- Snare: triangle 200->100Hz + highpass noise at 2000Hz
- Hi-hat: noise through highpass 7000Hz, short 60ms
- Open HH: noise through bandpass 8000Hz, longer 250ms
- Clap: 3 staggered noise bursts through bandpass 1200Hz + noise tail
- Swing: even steps delayed, odd steps advanced by swing*0.33 of beat length
- Sequencer uses setTimeout chain (not setInterval) for swing-aware timing
