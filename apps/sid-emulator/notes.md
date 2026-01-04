# SID Emulator

## log
- 2026-01-04: Reverted UI to English (Russian translation removed)
- 2026-01-04: Disabled all smoothing on visualizer - raw jagged pixels
- 2026-01-04: Added 8-bit crusher for authentic lo-fi jaggedness
- 2026-01-04: Initial creation - custom SID chip emulator from scratch

## features
- 3 voice oscillators (like real 6581)
- 4 waveforms per voice: Triangle, Sawtooth, Pulse, Noise
- Pulse Width Modulation (0-100%)
- Per-voice detune control
- ADSR envelope per voice (4-bit each, SID timing tables)
- Resonant filter with LP/BP/HP modes
- Adjustable cutoff (20Hz - 20kHz)
- High resonance (Q up to 30)
- Per-voice filter routing
- 8-BIT CRUSHER: strict bit depth reduction (1-16 bits)
- Sample rate reduction for extra crunch
- Real-time waveform visualizer
- Keyboard input (A-K keys)
- CRT scanline effect

## technical
- Custom pulse wave via waveshaping (sawtooth + threshold)
- LFSR-style noise generation
- BiquadFilter for resonant filter
- SID-accurate ADSR timing tables
- All 3 voices play simultaneously for thick sound

## keyboard mapping
- A = C4
- W = C#4
- S = D4
- E = D#4
- D = E4
- F = F4
- T = F#4
- G = G4
- Y = G#4
- H = A4
- U = A#4
- J = B4
- K = C5

## design
- VT323 + Share Tech Mono fonts
- Green phosphor CRT aesthetic
- Orange accent for filter section
- Scanline overlay

## math audit (NO SINE INTERPOLATION)

### Oscillator Audit
- `Math.sin`: 0 matches - NO SINE WAVES
- `Math.cos`: 0 matches
- Pulse wave: sawtooth + waveshaper threshold (hard edges)
- Noise: LFSR bitwise operations only (>>, ^, <<, &)

### Bit Crusher Audit
- Quantization: `Math.round(sample / step) * step` - HARD ROUND
- Clamping: `Math.max(-1, Math.min(1, lastSample))` - HARD CLAMP
- Sample hold: direct assignment, zero interpolation

### Visualizer Audit
- `imageSmoothingEnabled = false`
- `image-rendering: pixelated`
- `fillRect()` per pixel, no `lineTo()` interpolation
- Sample stepping for extra jaggedness

### Math Functions Used
| Function | Count | Usage |
|----------|-------|-------|
| Math.round | 1 | Hard quantization |
| Math.floor | 6 | Integer truncation |
| Math.pow | 2 | Bit levels, detune |
| Math.max/min | 2 | Hard clamping |

VERDICT: **CLEAN** - No sine interpolation anywhere

## issues
- None yet

## todos
- Add ring modulation
- Add hard sync between voices
- Add filter envelope
- Add LFO for PWM modulation
- Add preset sounds
