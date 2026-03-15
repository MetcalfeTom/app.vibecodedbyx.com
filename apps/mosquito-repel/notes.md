# Mosquito Repellent

Press the big red button. Unleash ultrasonic fury. Mosquitoes hate this one weird trick.

## log
- 2026-03-15: Initial build. Giant red button activates high-frequency oscillating tones via Web Audio API. Main oscillator (8-22 kHz, default 17 kHz) modulated by LFO for frequency sweeping. 3 sliders: frequency, oscillation rate, volume. 4 modes: Sweep (sine, wide LFO), Pulse (square, tight LFO), Chaos (sawtooth, wild LFO + random frequency jumps), Stealth (sine, minimal modulation). Animated background: mosquitoes spawn and wander with wing flapping, flee from center when active, occasionally die near center (fall with X eyes + rotation). Expanding pulse rings from button, frequency visualizer bars at bottom from AnalyserNode. Rotating status messages with kill count. Disclaimer about scientific validity. Orbitron + Rajdhani typography, dark red/black military aesthetic.

## issues
- None yet

## todos
- Timer mode (auto shutoff)
- Mosquito kill counter persistence
- Sound presets for different insects
- Share kill stats

## notes
- No database — pure frontend
- Frequency range: 8000-22000 Hz (default 17000)
- Oscillation: LFO modulating main osc frequency, depth varies by mode
- Modes: sweep (0.5x rate, 15% depth), pulse (0.3x, 5%), chaos (1x, 30% + random), stealth (0.1x, 2%)
- Volume: 0-50% of max gain (capped for safety)
- Mosquitoes: max 15 idle / 5 active, flee within 300px of center, 2% death chance within 150px
- Dead mosquitoes: gravity fall with rotation, fade out
- Wave rings: 8% spawn rate when active, expand + fade
- Analyser: 256 FFT, bottom bar visualization
