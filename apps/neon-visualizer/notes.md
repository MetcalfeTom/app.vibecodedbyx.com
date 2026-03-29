# Neon Visualizer

## log
- 2026-03-29: V1 — WebAudio API visualizer with 5 modes. Mic input or drag-and-drop audio files. Bars (classic frequency bars with peak dots), Circle (radial spikes from center with bass ring), Wave (3-layer waveform oscilloscope), Mirror (symmetric bars from center), Ring (5 concentric rotating rings deformed by frequency). 5-stop neon gradient (green/cyan/purple/pink/orange). Smoothed frequency data with peak tracking. Idle animation when no input. Drag-and-drop zone. File name display. Keyboard M to cycle modes. Megrim + Fira Code typography, dark space aesthetic.

## features
- 5 visualization modes: Bars, Circle, Wave, Mirror, Ring
- Microphone input via getUserMedia
- Audio file input via file picker or drag-and-drop
- Looping playback for loaded files
- Smoothed frequency data (0.25 lerp)
- Peak tracking with slow decay (0.8/frame)
- 5-stop neon color gradient across frequency range
- Glow/shadow effects scaled by amplitude
- Circle mode: radial spikes + bass-reactive inner ring
- Ring mode: 5 concentric rings rotating in alternating directions
- Wave mode: 3 layered waveform lines
- Mirror mode: symmetric bars from center
- Idle animation when no audio source
- Drop zone overlay for drag-and-drop
- Track name display
- M key or button to cycle modes

## issues
- None currently

## todos
- Volume control
- Play/pause for loaded files
- Spectrum coloring options (themes)
- BPM detection
- Fullscreen mode
- Save screenshot

## notes
- FFT size: 2048 (1024 frequency bins)
- Smoothing time constant: 0.82
- Frequency smoothing: lerp 0.25 per frame
- Peak decay: 0.8 per frame
- Color gradient: 5 stops interpolated linearly
- Ring rotation: time*0.3, alternating CW/CCW per ring
- Audio files decoded and looped via createBufferSource
- Mic uses createMediaStreamSource (no destination connection to avoid feedback)
