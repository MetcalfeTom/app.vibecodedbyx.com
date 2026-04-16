# 8-Bit Soundboard

Neon arcade soundboard with 16 crunchy WebAudio synthesized 8-bit sounds.

## log
- 2026-04-16: Initial build. 4x4 grid of neon buttons, each triggering a unique WebAudio synthesized 8-bit sound (laser, jump, coin, explode, powerup, hurt, blip, warp, chomp, siren, drum, beep, sweep, crash, zap, bass). Keyboard shortcuts (1-0, Q-Y). Frequency analyser waveform visualizer. Volume slider. Ripple effects on press, glow pulses. Scanline overlay. Silkscreen + Press Start 2P typography, neon-on-black arcade aesthetic.

## features
- 16 unique WebAudio synthesized sounds (no samples)
- Oscillator types: square, sawtooth, triangle, sine + noise buffers
- Frequency sweeps, bitcrushing, multi-voice layering
- 4x4 neon button grid with distinct colors
- Keyboard shortcuts: 1-9, 0, Q, W, E, R, T, Y
- Frequency bar visualizer via AnalyserNode
- Volume slider with master gain
- Press animation + ripple effect + glow pulse
- Scanline CRT overlay
- Mobile touch support
- Pointer events for unified input

## issues
- None yet

## todos
- Record & playback sequences
- Tempo-synced loop mode
- More sound banks (drums, bass, melody)
- Share recorded sequences
- MIDI input support
