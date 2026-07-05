# Laugh Keys

## log
- 2026-07-05: v1 — keyboard instrument where each key plays a synthesized ticklish giggle, pitch-shifted across 2 octaves (C4-B5). Laugh sample built at runtime using Web Audio: 6 rapid "ha" bursts with glottal pulse oscillators (sawtooth-ish, 420-500Hz sweep), dual formant amplitude modulation (ha/he/hi vowel shapes), breathy noise mix, and a trailing wheeze. Each key pitch-shifts the laugh buffer via playbackRate relative to A4=440Hz. 24 keys: whites mapped to Z X C V B N M , . / Q W E R, sharps to S D G H J L ; 2 3 4. Floating emoji on each press, giggle-o-meter counting total plays, frequency spectrum visualizer (pink-to-gold). Controls: sustain (overlap voices), reverb (convolver impulse), chaos mode (random ±10% detune per press). Inspired by MissMeowD. Fredoka + Azeret Mono + Instrument Serif. Pink/gold on dark plum aesthetic.

## issues
- Synthesized laugh is approximation — real vocal quality would need recorded samples
- playbackRate pitch-shifting also changes duration (faster = shorter at high pitch)

## todos
- Record actual laugh samples for better quality
- Looping mode (hold key = repeating giggles)
- Octave shift buttons
- MIDI input support
