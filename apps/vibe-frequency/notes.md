# Vibe Frequency

XY pad synthesizer — mix low-frequency drones and crystalline leads by dragging across the pad.

## log
- 2026-03-12: Initial build. Web Audio API synth with XY pad. X = frequency (drone 30-120Hz, lead 220-2000Hz), Y = mix (bottom=drone, top=lead). Two detuned oscillators per voice, biquad filter on lead, LFO tremolo on drone, convolver reverb with generated impulse response. Canvas visualizer with color trail, pulsing cursor, frequency rings, edge waveform bars. 4 presets. Volume/reverb/detune sliders. Newsreader + DM Mono typography, orange(drone)/indigo(lead) on black.

## issues
- None yet

## todos
- Could add waveform type selector (saw/sine/square/triangle)
- Record and export audio clips
- MIDI input support

## notes
- No database — pure frontend audio sandbox
- Requires user gesture to start (WebAudio policy)
- Drone: sawtooth + triangle, detuned pair, 30-120 Hz range
- Lead: sine + square through lowpass filter, 220-2000 Hz range
- LFO modulates drone gain, speed follows X position
- Reverb via ConvolverNode with procedurally generated impulse response
- Trail fades over 2s, color interpolates orange→purple based on Y position
