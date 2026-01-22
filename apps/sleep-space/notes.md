# Sleep Space

Drift off with a starfield screensaver and lo-fi ambient sounds.

## log
- 2026-01-22: Initial creation with starfield, 4 ambient sounds, auto-hide UI

## features
- Animated starfield with twinkling stars
- Occasional shooting stars
- 4 procedural lo-fi ambient sounds:
  - Rain (brown noise + lowpass filter)
  - Wind (pink noise + LFO modulation)
  - Static (filtered white noise)
  - Drone (layered sine oscillators)
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

## todos
- Add sleep timer
- Add breathing exercise mode
- Add more soundscapes (ocean, fire, etc.)
