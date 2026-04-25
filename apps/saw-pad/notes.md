# Saw Pad

## log
- 2026-04-17: Created. 8×4 neon grid of sawtooth synth pads with 3-voice detune + sub sine, biquad lowpass filter, and heavy convolution reverb from a procedurally-generated stereo impulse (4.8s, colored noise × exponential decay, phase-inverted right channel). Controls: scale (9 options incl. hirajoshi/pent/modes), root, octave, cutoff, detune, reverb mix, attack, release, volume, HOLD toggle, ARP toggle. Keyboard mapping 1-8/qwerty/asdf/zxcv rows. Analyser-driven dual-color waveform viz at bottom. Orbitron + Share Tech Mono typography, mag/cyan/violet palette with scanline overlay.

## issues
- Polyphony is unbounded — dog-piling voices can clip; a DynamicsCompressor is in the chain to tame it.
- Safari needs the ENGAGE button click to create AudioContext (already handled by veil).
- Convolver impulse is ~4.8s — long tails stack up in hold mode; that's the intended "heavy reverb" vibe.
- In hold mode a second keydown toggles a pad off; acts like a latching matrix.
- ARP is a simple round-robin over held pads at ~180ms; quantized via setTimeout (not audio-clock sample-accurate).

## todos
- Per-pad wave morph (saw → square crossfade)
- Tempo-synced arp
- LFO cutoff mod
- Preset save/load to localStorage
- Record loop to downloadable .wav

## design
- Palette: bg #05020e, mag #ff2fe1, cyan #19f6ff, violet #8a2df7, acid #c8ff00, ink #dff6ff
- Per-row pad color: row 0 mag → row 3 cyan
- Signal: voice → filter → (dry + convolver) → compressor → master → destination + analyser
