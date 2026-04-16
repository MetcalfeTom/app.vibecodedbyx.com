# Loop Station

Multi-instrument loop recorder with layered tracks and live playback.

## log
- 2026-04-16: Initial build. 6 instruments (Synth, Piano, Organ, Lead, Bass, Bell) with ADSR envelopes. 2-octave piano keyboard (C4-F#5) with keyboard shortcuts (A-L row + black keys). Record/play/stop transport controls. Adjustable BPM (40-240). 2-bar loop with beat-synced recording. Track visualization with note dots on canvas, playhead, mute/delete per track. Metronome beat flash. DM Sans + JetBrains Mono typography, dark purple/minimal aesthetic.

## features
- 6 WebAudio instruments with distinct waveforms and ADSR
- 2-octave piano keyboard with pointer + keyboard input
- Keyboard mapping: A-L row for white keys, W/E/T/Y/U/O/P for black
- Record button captures notes into loop-synced tracks
- Adjustable BPM with beat/bar counter
- Each track shows note visualization on canvas
- Per-track mute and delete
- Metronome flash on beat
- Clear all button
- Mobile touch support on piano keys

## issues
- Loop playback scheduling uses requestAnimationFrame which can drift slightly vs WebAudio clock
- No quantization — notes recorded at exact timing

## todos
- Quantize option (snap to 8th/16th notes)
- Export loop as audio
- Drum/percussion instrument
- More octaves or octave shift buttons
- Volume per track
- Save/load loops to localStorage
