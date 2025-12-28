# Breath Visualizer

A microphone-reactive visual experience that pulses with your voice.

## Log
- 2025-12-28: Initial creation with Web Audio API microphone input
- Features: breathing orb, particle effects, frequency rings, volume indicator

## Features
- Web Audio API with AnalyserNode for real-time frequency analysis
- Central breathing orb that expands with voice volume
- Particle system that spawns with speech
- Frequency rings showing audio spectrum
- Smooth volume indicator
- Hue shifts based on audio intensity
- Cormorant Garamond typography for elegant feel

## Technical Notes
- Uses getUserMedia with echoCancellation/noiseSuppression disabled for raw input
- FFT size 256 for responsive frequency data
- Smoothed volume prevents jitter
- Canvas renders at device pixel ratio for sharp display
- Particles capped at 300 for performance

## Issues
- None yet

## Todos
- Could add different visualization modes
- Could add color theme options
- Could save/record sessions
