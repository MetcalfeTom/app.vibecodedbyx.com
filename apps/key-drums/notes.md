# Key Drums

## log
- 2026-07-04: v1 — keyboard-triggered beat maker. 8 pads (A-S-D-F-G-H-J-K) with pure Web Audio synthesis (sine/triangle oscillators + noise). Kick, snare, hi-hat, clap, tom, perc, rim shot, cowbell. Loop recorder with 4-bar timeline, play/record/clear. Canvas timeline visualization with beat grid + playhead. Instrument Serif + Azeret Mono typography. Dark with colored pad accents.

## issues
- None yet

## todos
- Swing/quantize on recorded loops
- Volume per pad
- Multiple loop layers
- Export loop as WAV
- 2026-07-05: **Cathedral reverb** (chat ask). Synthesized 4s stone-room IR (stereo, RT60≈4s via exp(-6.9t/4), one-pole lowpass whose coefficient shrinks over the tail so highs die first, 7 sparse early slap-backs at 13–90ms with L/R polarity flip). ConvolverNode on a parallel wet bus: per-hit gain → masterGain (dry) + reverbSend → convolver → reverbWet(0.4) → masterGain. CATHEDRAL button (active by default) + V key toggle; wet gain ramps via setTargetAtTime(0.08) so live tails don't click. Mute still kills everything (masterGain).
