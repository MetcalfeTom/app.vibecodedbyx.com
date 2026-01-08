# Synth Player

## Log
- Initial creation: Interactive colorful synthesizer with keyboard and sample pads
- Added loop recording and track management system
- Features Web Audio API for real-time sound synthesis
- 8 playable keyboard notes (C-C') with different colors
- 8 sample pads with synthesized drum sounds (Kick, Snare, Hi-Hat, Clap, Tom, Cymbal, Bass, Zap)
- Controls: Waveform selection (sine, square, sawtooth, triangle), Volume, Attack, Release
- Real-time frequency visualizer
- Keyboard shortcuts for all notes and samples
- Touch-friendly for mobile devices
- Loop recorder: Record 4-beat loops, adjustable BPM (60-200)
- Multi-track system: Record multiple loops, play them together
- Track controls: Mute, Solo, Delete individual tracks
- Metronome indicator shows beat timing
- All keyboard/pad inputs are recorded when recording is active

## Issues
- None yet

## Todos
- Could add more effects (reverb, delay, filter)
- Could add preset sounds/patterns
- Could add ability to save/load projects
- Could add ability to export to audio file
- Could add MIDI keyboard support
- Could add quantization/snap-to-grid
- Could add visual waveform display for tracks

## Notes
- Uses Web Audio API for all sound generation
- Keyboard notes: A, S, D, F, G, H, J, K
- Sample pads: Q, W, E, R, T, Y, U, I
- Drum sounds are synthesized (not samples) for zero-latency
- Visualizer shows real-time frequency analysis
- Mobile responsive with touch support
- Color scheme: vibrant colors for each note/pad
