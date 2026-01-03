# Neon Synth

## log
- 2026-01-03: Initial creation - neon synthesizer with pulsing keys

## features
- 12 playable keys (C major scale + octave)
- Neon glow effects when pressed
- Color-coded keys (magenta, cyan, yellow, lime, etc.)
- Pulsing animation on active keys
- Web Audio oscillator synthesis
- 4 waveforms: sine, square, sawtooth, triangle
- 4 octave ranges: low, mid, high, ultra
- Attack and release envelope controls
- Real-time frequency visualizer
- Keyboard input (A-L, ;, ')
- Z/X for octave shift
- Touch support for mobile

## design
- Dark background with gradient text
- Orbitron font for techy feel
- Glowing borders and shadows
- Rainbow frequency visualizer
- Piano-style vertical keys

## technical
- Web Audio API oscillators
- Canvas-based visualizer
- AnalyserNode for frequency data
- ADSR envelope (attack/release)
- Polyphonic (multiple notes at once)

## controls
- A S D F G H J K L ; ' \: Play notes C through G+
- Z: Octave down
- X: Octave up
- Click/touch keys directly

## issues
- None yet

## todos
- Add reverb/delay effects
- Add chord presets
- Add recording/playback
- Add MIDI input support
- Add more scales (minor, pentatonic)
