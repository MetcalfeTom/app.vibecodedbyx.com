# Worn Wax — two-deck DJ mixer

## log
- 2026-08-28 v1.0 — first build, per a public request for "the DJ mixer v1 with worn-vinyl styling, two local-file decks, BPM displays, harmonic key labels, and Camelot-compatible color bands".
  - Two decks: load via file picker or drag-drop onto the deck; decoded with `decodeAudioData`, played through `AudioBufferSourceNode → lowshelf 220 Hz → peaking 1 kHz → highshelf 4.2 kHz → channel fader → crossfader gain → master → destination`. Per-deck analyser + master L/R analysers drive the VU strips.
  - Position model: `pos = offset + (now − startAt) × rate` while playing; every rate change re-anchors `offset/startAt`. `stop()` bumps a token so the old source's `onended` can't clobber state. Play at the end of a track restarts from the cue point.
  - Analysis runs in a Blob-URL **Worker** built from the `<script id="dsp" type="text/plain">` block (pure functions, also `require`-able in node for tests): 720-column peak waveform; **BPM** = spectral flux over 24 log-spaced bands (40 Hz–10 kHz, 1024-pt FFT hop 256 at 22.05 kHz, low bands ×1.6) → local-mean removal → autocorrelation with a comb over 2×/3× lags (±1-frame window) → mild log-normal prior around 125 BPM → parabolic refinement; analysed over a 150 s window from the middle of the track. **Key** = chromagram from spectral PEAKS only (4096-pt FFT hop 2048, 60 Hz–4.5 kHz, first 240 s) → Pearson correlation against Krumhansl-Schmuckler major/minor profiles → Camelot code.
  - Camelot tables: `MAJOR_CODE`/`MINOR_CODE` indexed by pitch class (C=0). Colours `WHEEL[n-1]` for numbers 1–12 (teal → green → yellow → orange → red → pink → purple → blue → cyan). Each deck shows a 4-swatch band: this key + (n−1, relative, n+1). The mixer shows the verdict (perfect / relative / neighbour / +2 energy boost / diagonal / clash) and a 24-segment SVG wheel that dims everything not compatible with the loaded decks.
  - Sync = tempo only (sets the pitch fader; refuses if beyond ±8%). No phase alignment.
  - Keyboard: Q / P toggle the decks; ← → on a focused waveform nudge 5 s; double-click the pitch fader resets it.
  - Verified: node DSP test (5 synthetic tracks: 128 Am, 100 C w/ 8th-note hats, 140 Bm, 174 F, 90 Ebm — all BPM within ±0.6 and correct key), headless desktop probe 96/96 (synthetic AudioBuffers through the real worker path, transport on a fake clock, sync, cue, crossfader equal-power, EQ, waveform paint colour, bad-file error, a11y basics), mobile probe 15/15 at 390 px.

## issues
- Key detection is a whole-track Krumhansl estimate — modulating tracks and tonally ambiguous progressions (F–Bb–C vs A minor) come out low-confidence; the status line says "(low confidence)" when the margin is thin. Tempo detection can still octave-flip on half-time / double-time material; the 125 BPM prior nudges it toward the club range.
- `<input type=range>` faders are vertical via `writing-mode:vertical-lr; direction:rtl` (Chrome 124+, Firefox 120+, Safari 17.4+); older browsers get horizontal sliders that still work.
- Headless probing: the Worker computes in real time, so `--virtual-time-budget` expires before analysis returns. The harness delays the load event with a `/_t/hold?ms=` image instead and runs `--dump-dom` without a budget (job 272743fc/tmp: run.sh, probe-tail.html, mobile-tail.html, shot-tail.html, og.sh, dsptest.js).
- `applyXf()` must run after BOTH deck chains exist (it touches A.xf and B.xf) — calling it from inside `buildChain` threw on first context creation.
- Pollinations returned its blurry fallback for the OG prompt; the OG is a 1200×630 screenshot of the loaded mixer (`og-image.png`).

## todos
- Beat-phase sync (nudge to align downbeats) and a beat grid on the waveform.
- Looping (4/8/16 beats), hot cues, a headphone cue split (needs an output-device picker).
- Zoomable waveform / overview + detail.
- Recording the mix to a WAV download (MediaStreamDestination + MediaRecorder).
- Optional key lock (playbackRate changes pitch; a phase-vocoder or `preservesPitch` on `<audio>` would keep key at ±8%).
- Persist EQ/pitch/cue per track name in localStorage.
