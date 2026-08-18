# Waterfall Radio — notes

## log
- 2026-08-18 v1.0: spectrogram melody-puzzle sandbox + (same-session chat request)
  magnifying-glass frequency cursor. SAFETY IS STRUCTURAL: no getUserMedia, no
  MediaRecorder anywhere in source (probe greps both), zero <a> tags, all signals
  synthesized. 6 bands: training(3 slow, audio) → 5-note → SPEAKER BROKEN (sight-only)
  → ghost station (fainter decoy on its own schedule, main peak >0.9 asserted) →
  static storm (seeded noise floor) → finale (7 notes+static+ghost); then endless
  SANDBOX (length/noise dials, ghost toggle, streak + localStorage best). Engine fully
  deterministic: seeded melodies (bounded pentatonic walk), currentSpectrum(t) pure
  (probe asserts the peak bin matches the scheduled note), waterfall = ImageData
  copyWithin scroll + heat colormap at 45 rows/s via accumulator. Transcription UI:
  DO/RE/MI/SOL/LA keys, per-position hit/strike-through feedback with match count.
  Audio is OUTPUT-only sine following the schedule (gesture-gated speaker toggle,
  disabled on eyes-only bands). LENS CURSOR: pointer sets it, plain wheel fine-tunes
  ±1 bin, shift+wheel zooms ×2–6 (clamped), lens = imageSmoothing-off drawImage self-
  sample with crosshair + Hz label; freqAt() piecewise-linear between note anchors
  (probe: anchors exact, monotone); aria-live readout line. Iceland + Chivo Mono
  phosphor aesthetic. 22/22 probe first run + band-5 screenshot with lens.

## issues
- Wheel handler needs { passive:false } for preventDefault — page scroll would fight
  the fine-tune otherwise.

## todos
- Chord bands (two simultaneous notes) if chat wants harder reading.
