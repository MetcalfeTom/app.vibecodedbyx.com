# Neon Synth Garden

Generative music toy — click anywhere to plant glowing notes that pulse, harmonize, and repeat in the chosen scale. Grow a living soundscape.

## log
- 2026-04-11: Initial build. WebAudio synthesis with detuned oscillator pairs (sine/triangle/sawtooth based on X position), convolution reverb (procedural impulse response), dynamics compressor. 7 scales (major, minor, pentatonic, dorian, mixolydian, blues, japanese). Y position maps to scale degree, X maps to octave (3-6). Notes auto-retrigger on their interval (faster for higher Y). Expanding ring pulses on each retrigger. Harmonic connection lines between notes related by perfect fifth, octave, major third, perfect fourth — curved and gently animated. Radial glow + pulsing core per note. Notes fade after 30s, cap at 60. Background dust particles. Note name labels. Poiret One + Martian Mono typography, deep purple neon aesthetic. Start overlay to unlock AudioContext.

## features
- Click to plant notes that auto-retrigger at unique intervals
- 7 musical scales: major, minor, pentatonic, dorian, mixolydian, blues, japanese
- Y position → scale degree, X position → octave + waveform
- Detuned oscillator pairs for warm sound
- Convolution reverb with procedural impulse
- Pulsing glow and expanding ring animations
- Harmonic connection lines (5ths, octaves, 3rds, 4ths)
- Note name labels (C4, E5, etc.)
- Notes auto-fade after 30s
- 60 note cap
- Background dust particles

## issues
- None known

## todos
- Supabase save/load gardens (share your soundscape)
- Drag to move existing notes
- Volume/reverb sliders
- Record and export audio
- Different root key selector
- OG preview PNG
