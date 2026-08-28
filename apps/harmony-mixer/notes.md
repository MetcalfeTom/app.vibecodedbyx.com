# Harmony Mixer — notes

## log
- 2026-08-28 v1.0 — first build per a public request: "Harmony's minimal two-deck mixer with Camelot colors, chord names, BPM displays, tempo lock, local audio, and crossfader".
  - Two Web Audio decks (AudioBufferSource → Analyser → level gain → crossfader gain → master). Pause = stop + remembered offset; `pos()` = posAtStart + (ctx.currentTime − tStart) × rate, snapshotted on every rate change so pitch moves never jump the playhead.
  - Analysis runs in a Blob worker built from `<script id="dsp">` (also evaluable in node — see harness). BPM = spectral-flux onset strength (STFT 1024/128 at ~11 kHz) → autocorrelation, score = Σ ac(k·lag)/k for k=1..4 × log-normal prior around 120, refined with parabolic peaks at lag multiples (±0.1 BPM on synthetic material). Key = peak-picked chromagram (8192 FFT, 180 s from 8 % in) → Krumhansl profiles → Camelot via `camelotOf`. Live chord = analyser spectrum → chroma (EMA .72) → best major/minor triad (cosine ≥ .62, 3 consecutive votes).
  - Camelot colours: hue = 170 − (n−1)·30, A pastel / B saturated; each deck's `--dk` var tints its letter, badge, waveform, play button and the crossfader track ends. Centre wheel = 24 SVG arcs; lit segments are the loaded keys; compat text (same / relative / neighbours / diagonal / two steps / clash).
  - Tempo lock: follower rate = master effective BPM / follower BPM, re-applied on the master's pitch input; follower fader disabled; A→B / B→A swap chip. Crossfader is equal-power (cos/sin), sticky at the bottom, ← → keys nudge it; Space / Enter play A / B.
  - Probes: node DSP suite (5 synthetic tracks 87.5–174 BPM all within 0.1 BPM, 24/24 Camelot table, triad matcher) + 42/42 headless-Chromium suite at 1200 and 390 (worker analysis through the real audio path, lock/swap/unlock, crossfader gains, playback position, live chord "Am", seek/cue/keys, no x-overflow).

## issues
- Pitch is plain resampling (playbackRate), so ±8 % shifts the key ≈ ±1.3 semitones — deliberate vinyl feel; the key badge shows the analysed (0 %) key.
- Key confidence < .25 shows a "?" after the key name. Sparse / drone-y material and DnB half-time will occasionally read an octave/relative off.
- Analysis takes ~1.6 s per 30 s of audio in the worker (≈ 15 s for a 5-minute track); the wave shows "reading bpm + key…" meanwhile and the deck already plays.
- Headless testing: an `await` on a worker with no pending timers makes `--virtual-time-budget` jump to its deadline before the worker replies — use the real-time hold/release harness (pending `<img src=/_t/hold>` blocks `load`; the tail fetches `/_t/release` when done) in the job tmp.

## todos
- Beat grid / phase nudge (currently tempo-only sync; no beat alignment).
- Per-deck 3-band EQ + cue/PFL are out of scope for "minimal" but were the obvious next asks.
- Show the pitched key (shifted by 12·log2(rate)) next to the badge when the fader is off zero.
