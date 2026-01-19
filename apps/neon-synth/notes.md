# Neon Synth

## log
- 2026-01-19: Added tickle mode with synthesized speech saying ticklish phrases
- 2026-01-19: Added comedy mode with 12 funny sounds (honks, laughs, boings, farts, quacks, etc.)
- 2026-01-03: Initial creation - neon synthesizer with pulsing keys

## features
- 12 playable keys (C major scale + octave)
- Neon glow effects when pressed
- Color-coded keys (magenta, cyan, yellow, lime, etc.)
- Pulsing animation on active keys
- Three modes: Synth, Comedy, and Tickle
- Synth mode:
  - Web Audio oscillator synthesis
  - 4 waveforms: sine, square, sawtooth, triangle
  - 4 octave ranges: low, mid, high, ultra
  - Attack and release envelope controls
- Comedy mode (12 sounds):
  - Honk, Laugh (ha ha ha), Boing, Duck quack
  - Fart (whoopee cushion), Slide whistle, Bonk
  - Giggle, Bicycle horn, Splat, Sad trombone (wah wah)
  - Party horn
- Tickle mode (12 phrases via Web Speech API):
  - "Gah!", "Ehehehehe!!", "Yee Yow!", "I am so ticklish!"
  - "Stop it! Hahaha!", "Nohoho not there!", "Eeek!"
  - "That tickles so much!", "Ahaha I can't!", "Mercy! Mercy!"
  - "Heeheehee!", "I'm gonna pee!"
  - Wiggly title animation, pink theme
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
