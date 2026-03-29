# Silly Sounds

## log
- 2026-03-29: V1 — Quirky soundboard with 24 synthesized sound effects. All sounds generated with WebAudio API (oscillators, noise buffers, LFO modulation) — no external audio files. Colorful pad grid with emoji icons, press animations with ripple effect. Frequency visualizer bar at bottom. Sounds: fart, boing, laser, bonk, womp, ding, quack, slide, buzz, pop, siren, chomp, warp, splat, giggle, boom, whistle, alien, burp, coin, horn, click, spring, robot. Baloo 2 + Inconsolata typography, dark purple bg with colored gradient pads.

## features
- 24 unique synthesized sound effects
- All sounds via WebAudio API (no audio files)
- Oscillator types: sine, square, sawtooth
- Noise buffer generation for percussion/texture
- LFO modulation for alien sound
- Frequency ramping for slide/warp/laser effects
- Multi-hit sounds (giggle = rapid random tones)
- Colorful button grid with gradient fills and inner highlights
- Ripple animation on tap
- Scale-down press feedback
- Frequency spectrum visualizer (bars with hue gradient)
- Responsive grid (4 cols desktop, 3 cols mobile)
- Pointer events for unified mouse/touch handling

## issues
- None currently

## todos
- Record/playback sequencer
- Adjustable pitch/speed per pad
- Custom sound upload
- Keyboard shortcuts (1-9, a-z)
- Share sound combos

## notes
- AudioContext created on first interaction (browser autoplay policy)
- Master gain at 0.4 to prevent clipping
- Analyser FFT size 256 (128 frequency bins)
- Each sound is a composable function using playTone/playNoise helpers
- Noise: white noise buffer with optional biquad filter (lowpass/highpass/bandpass)
- Visualizer runs continuously via requestAnimationFrame
