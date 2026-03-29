# Synth Lab

## log
- 2026-03-29: V1 — Colorful slider-based synthesizer with 3 visualizer modes. 7 neon-colored sliders: Volume (green), Detune (magenta), Attack (yellow), Release (orange), Filter/lowpass (blue), Delay (red), Vibrato/LFO (cyan). 4 waveforms (sine/square/saw/tri). 15 piano keys (C4-D5) with keyboard mapping (A-L white, W-U black). 3 visualizer modes: waveform oscilloscope, rainbow frequency bars, polar/circular waveform. Polyphonic. Delay feedback loop. LFO vibrato connected to oscillator frequency. Tap visualizer to cycle modes. Oxanium + IBM Plex Mono typography.

## features
- 7 colorful sliders with neon gradient tracks and glowing thumbs
- Volume, Detune, Attack, Release, Filter, Delay, Vibrato controls
- 4 waveform types: sine, square, sawtooth, triangle
- 15-key piano keyboard (C4 to D5)
- Polyphonic (multiple simultaneous notes)
- Lowpass filter with adjustable cutoff
- Delay effect with feedback routing
- LFO vibrato (modulates oscillator frequency)
- 3 visualizer modes (tap to cycle):
  - Waveform oscilloscope (cyan glow)
  - Rainbow frequency bars
  - Polar/circular waveform
- Keyboard input: A-L for white keys, W-U for black keys
- Touch/pointer support for mobile
- ADSR envelope (attack + release)
- Real-time parameter changes on active notes

## issues
- None currently

## todos
- Reverb convolver effect
- Preset system (save/load slider positions)
- Recording and playback
- More octave range (shift keys)
- MIDI input

## notes
- Distinct from neon-synth: focused on slider-based sound design, more effects (delay, vibrato, filter), 3 viz modes including polar, no comedy/tickle modes
- Audio routing: oscillators -> gain -> masterGain -> filter -> analyser -> destination, filter -> delay -> delayGain -> filter (feedback)
- LFO: 5Hz sine oscillator -> lfoGain -> connected to each oscillator's frequency
- Delay feedback capped at 0.5 gain to prevent runaway
- Filter Q: 1.5 for mild resonance
