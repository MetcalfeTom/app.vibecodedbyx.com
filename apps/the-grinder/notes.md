# The Grinder

## log
- 2026-04-07: Initial build. Industrial 16-step drum machine, 8 tracks (kick, snare, closed/open hat, anvil, clang, grind, steam) all synthesized via WebAudio (no samples). Bungee Inline + Share Tech Mono typography, rust/steel/black riveted aesthetic. Lookahead scheduler (25ms timer + 100ms scheduleAhead) for tight timing. Swing slider biases odd 16ths. Default groove preloaded.

## features
- 16 steps x 8 tracks
- Click/tap cells to toggle; previews sample on toggle
- Play/Stop, BPM (60-200), Master volume, Swing (0-50%)
- Clear, Randomize (per-track density biased for industrial groove)
- Step indicator highlights current column + header
- Synthesis: kick (sine sweep + triangle click), snare (filtered noise + tonal body), hats (HP noise), anvil (FM-style 4 detuned partials with non-harmonic ratios), clang (5 inharmonic squares + bandpass), grind (beating saws + WaveShaper distortion + LP sweep), steam (BP noise sweep)
- DynamicsCompressor on master for glue
- Mobile: horizontal scroll on grid, touch handlers with preventDefault

## issues
- WebAudio requires user gesture; ensureAudio() called on first cell click and on Play
- iOS Safari may need an explicit resume() — handled in start()

## todos
- Per-track mute/solo
- Pattern save/load (localStorage)
- Multiple patterns / chain mode
- Per-track volume
- Export to WAV
