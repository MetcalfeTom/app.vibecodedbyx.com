# Synth Collab

## log
- 2026-01-04: Added CHAOS MODE - slider accelerates to 1024 Hz, decays to silence
- 2026-01-04: Extended sequencer to 1024 steps and 256 BPM max
- 2026-01-04: Added drum sequencer with kick, snare, hi-hat
- 2026-01-03: Initial creation - collaborative neon synthesizer

## features
- 16 playable pads (4x4 grid)
- Real-time waveform visualizer
- Real-time frequency spectrum
- 4 waveform types: sine, square, sawtooth, triangle
- Attack and release envelope controls
- Low-pass filter control
- Reverb effect
- Real-time multiplayer via Supabase
- See other players' pad presses
- Player presence tracking
- Activity log
- Keyboard and touch input
- 1024-step drum sequencer (browser-melting mode!)
- Kick, snare, hi-hat drum synthesis
- Adjustable BPM (60-256)
- Auto-scrolling playhead with step counter
- Shared pattern changes in real-time
- Default four-on-the-floor beat
- CHAOS MODE: accelerates rhythm to 1024 Hz (becomes pitched tone!)
- Pitch decay on slider release (rhythm → pitch → silence)

## pads
- Row 1 (Cyan): C4-F4, keys 1-4
- Row 2 (Magenta): G4-C5, keys Q-R
- Row 3 (Yellow): D5-G5, keys A-F
- Row 4 (Green): A5-D6, keys Z-V

## multiplayer
- Uses Supabase Realtime channels
- Presence tracking for player count
- Broadcast pad events (start/stop)
- Visual indicator when others play
- Player avatars with random colors

## design
- Dark background
- Neon colored pads (cyan, magenta, yellow, green)
- Glowing active states
- Real-time canvas visualizers
- Orbitron font

## technical
- Web Audio API oscillators
- AnalyserNode for visualizers
- BiquadFilter for lowpass
- Delay for simple reverb
- Supabase Realtime for multiplayer
- Canvas 2D rendering

## controls
- Click/tap pads to play
- Keyboard: 1234, QWER, ASDF, ZXCV
- Waveform selector
- Attack/release sliders
- Filter/reverb sliders

## issues
- None yet

## todos
- Add recording/playback
- Add preset patterns
- Add BPM sync
- Add more effects (delay, distortion)
- Add MIDI input support
