# Color Piano

Twelve colorful keys. Play melodies. Record and replay your jams.

## log
- 2026-04-13: B key color changed from gray to pink-red blend (#d83078) of A# and C colors. Fixed black key transform bug (translateX override on press/hover). Moved translateX(-50%) to CSS class.
- 2026-04-13: Standard piano layout — 7 white keys (C,D,E,F,G,A,B) full-height/wider, 5 black keys (C#,D#,F#,G#,A#) shorter/narrower/overlapping, positioned absolutely between white keys. All 12 keys keep rainbow colors. Keys selected by data-idx attribute.
- 2026-04-13: Initial build. 12 chromatic keys (C to B) each with unique color (red→orange→yellow→green→teal→blue→indigo→violet→pink→white). WebAudio synthesis with triangle+sine oscillators, lowpass filter for warmth. Keyboard mapping (A-\), octave control (2-7), sustain toggle. Recording system: record note on/off events with timing, save multiple takes, replay with scheduling, delete. Visualizer bar graph reacting to active notes. Touch support.

## features
- Standard piano layout (white keys wide/tall, black keys narrow/short/overlapping)
- 12 colorful chromatic keys with rainbow gradient styling
- WebAudio dual-oscillator synthesis (triangle + sine harmonic)
- Lowpass filter for warm tone
- Keyboard mapping: A S D F G H J K L ; ' \
- Octave control (2-7)
- Sustain pedal toggle
- Record/stop with timestamped events
- Multiple saved recordings with note count and duration
- Playback with accurate timing
- Delete individual recordings
- Animated frequency visualizer bars
- Key press animations with glow
- Touch support

## issues
- None known

## todos
- OG preview PNG
- Instrument selection (piano, organ, synth, strings)
- Volume/effects controls (reverb, delay)
- Export recordings as shareable data
- Leaderboard for longest/most complex recordings
- Metronome
- Chord helper overlay
