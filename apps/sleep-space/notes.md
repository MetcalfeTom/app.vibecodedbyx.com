# Sleep Space

Drift off with a starfield screensaver and lo-fi ambient sounds.

## log
- 2026-01-22: Added procedural piano melodies with pentatonic scale and delay reverb
- 2026-01-22: Initial creation with starfield, 4 ambient sounds, auto-hide UI

## features
- Animated starfield with twinkling stars
- Occasional shooting stars
- 5 procedural lo-fi ambient sounds:
  - Rain (brown noise + lowpass filter)
  - Wind (pink noise + LFO modulation)
  - Static (filtered white noise)
  - Drone (layered sine oscillators)
  - Piano (pentatonic melodies with delay reverb)
- Volume control
- Star speed control
- Auto-hiding UI (tap to show/hide)
- Wake lock support for mobile
- No external audio files (all Web Audio API)

## audio tech
- Brown noise: random walk filtered for rain-like texture
- Pink noise: weighted sum for natural wind sound
- White noise: bandpass filtered for lo-fi static
- Drone: 3 oscillators (A1, E2, A2) with slow LFO detune
- Piano: triangle/sine oscillators in A minor pentatonic with delay-based reverb

## todos
- Add sleep timer
- Add breathing exercise mode
- Add more soundscapes (ocean, fire, etc.)
