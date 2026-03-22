# Neon Fit

Neon fitness dashboard with step counter, heart rate monitor, and ECG waveform.

## log
- 2026-03-22: Initial build. Gradient progress ring (steps toward 10K goal). Simulated heart rate (resting ~72bpm, walking ~120bpm) with beating heart icon. Live ECG waveform canvas with PQRST wave simulation synced to BPM. Stats: distance (km), calories, active minutes. Start/Stop walk button simulates steps (~8-14 per 600ms). Activity log with timestamps. Orbitron + Share Tech Mono typography, cyan/pink neon aesthetic.

## issues
- None yet

## todos
- Real accelerometer step counting (DeviceMotion API)
- Daily history chart
- Goal customization
- localStorage persistence across sessions

## notes
- No database — pure frontend
- Steps simulated: ~8-14 per 600ms tick while walking
- BPM simulated: resting 62-78, walking 105-140, smoothed
- ECG waveform: synthetic PQRST phases based on current BPM period
- Distance: steps * 0.762m average stride
- Calories: steps * 0.04 kcal rough estimate
- Progress ring: gradient from cyan to pink, glowing endpoint
- Heart icon pulses at simulated BPM rate
