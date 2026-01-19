# Kaneidog Music Vault

## log
- 2026-01-19: Initial creation - retro music player with visualizer (requested by radiokanelive)

## features
- Load local audio files (drag or click to load)
- Multi-file playlist support
- 4 visualizer modes:
  - BARS: Classic frequency bars with neon glow
  - WAVE: Dual waveform display
  - CIRCULAR: Radial frequency visualization
  - SPECTRUM: Filled spectrum analyzer
- Play/pause, prev/next controls
- Progress bar with seek functionality
- Volume slider
- Track name display
- Time display (current / duration)
- Auto-play next track
- Keyboard control (Space to play/pause)

## design
- Retro synthwave aesthetic
- Neon pink, cyan, yellow color scheme
- CRT scanline overlay effect
- VT323 + Orbitron fonts
- Dark background with animated scan lines
- Glowing UI elements
- Pulsing idle animation when no audio

## technical
- Web Audio API for visualization
- AnalyserNode for frequency data
- Canvas-based visualizer
- MediaElementSource for audio routing
- Supports any audio format the browser supports

## controls
- Space: Play/Pause
- Click progress bar: Seek
- Volume slider: Adjust volume
- Viz mode buttons: Switch visualizer style

## todos
- Add drag-and-drop file loading
- Add EQ presets
- Add visualizer color themes
- Add fullscreen mode
- Add playlist management UI

## issues
- None yet
