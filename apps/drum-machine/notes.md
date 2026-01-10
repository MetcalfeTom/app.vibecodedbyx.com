# SYNTH STATION

## log
- 2026-01-10: Added detuned saw lead synth with piano roll
  - Piano roll sequencer (2 octaves C3-B4)
  - 5 detuned sawtooth oscillators for thick sound
  - Sub oscillator one octave down
  - Portamento/glide control between notes
  - Detune amount slider
  - Filter cutoff with envelope
  - Routes through reverb/chorus FX
- 2026-01-10: Added massive reverb and thick chorus FX
  - Global reverb with 3.5s tail, convolver-based
  - 4-voice stereo chorus with LFO modulation
  - FX sliders for wet/dry control
  - All sounds route through FX chain
- 2026-01-10: Initial creation for slowflood
  - 16-step sequencer with 8 tracks
  - Heavy synthesized drums via Web Audio API
  - 808-style kick, snare, hi-hat, clap, tom, crash, bass, perc
  - BPM control (60-200)
  - Swing control for groove
  - 5 preset patterns (Basic, House, Trap, D&B, Techno)
  - Clear and randomize functions
  - Visualizer bars
  - Neon magenta/cyan theme

## features
- 16-step sequencer grid
- 8 synthesized drum tracks
- Piano roll lead synth (2 octaves)
- 5 detuned saw oscillators + sub osc
- Glide/portamento between notes
- Play/pause with step highlighting
- BPM adjustment
- Swing timing
- Massive convolver reverb (3.5s tail)
- Thick 4-voice chorus with LFO
- FX wet/dry sliders
- Lead synth controls (glide, detune, filter)
- Preset patterns
- Clear all / Randomize
- Click to preview individual sounds
- Beat markers every 4 steps
- Visualizer animation

## sounds (all Web Audio synthesized)
- KICK: Heavy 808-style with sine + triangle layers
- SNARE: Noise burst with highpass + body tone
- HI-HAT: Metallic filtered noise
- CLAP: Layered noise bursts with bandpass
- TOM: Pitched sine sweep
- CRASH: Long filtered noise
- BASS: Sub bass sine + square
- PERC: Metallic square/saw hit

## presets
- BASIC: Simple 4-on-floor
- HOUSE: Offbeat hats, claps
- TRAP: Rolling hats, syncopated kick
- D&B: Breakbeat pattern
- TECHNO: Driving 4/4 with percs

## design
- Orbitron font
- Magenta/cyan gradient title
- Color-coded tracks
- Glowing active steps
- Step highlight on playback
- Responsive for mobile

## todos
- Add save/load patterns to localStorage
- Add track mute/solo
- Add pattern length options (8/16/32)
- Add individual track volume sliders
- Add export to WAV
- Add more presets
