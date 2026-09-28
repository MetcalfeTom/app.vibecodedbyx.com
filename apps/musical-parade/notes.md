# Musical Parade

Build a marching band one player at a time; each instrument adds its part to an 8-bar march in B-flat while the band high-steps down a festival street.

## log
- v1.0 (2026-09-28): requested by angienimo ("create a musical parade", "build the band"). 8 instruments (snare, bass drum, cymbals, sousaphone, trombone, trumpet, piccolo, bell lyre) + a drum major who twirls a baton. All sound synthesized with WebAudio (no samples): brass = saw+square through an enveloped lowpass, piccolo = triangle with vibrato, bells = 3 inharmonic sines, drums = filtered noise + pitched sine. A second player of the same instrument plays a harmony line (third below / fifth / octave), more add volume. New players join on the next beat. Legs step on the beat from the audio clock, the street scrolls with the song position, and the crowd raises arms as the band grows. Full band = confetti + cheer. Share via #band=<letters>&bpm=N (s b c u o t f g). Tap a marcher to send them home; tap the drum major to halt/march. Keys 1-8 add, Backspace sends the last one home, Space marches.

## issues
- The clock falls back to performance.now() until the AudioContext is running ('p' mode), then re-anchors to the audio clock ('a' mode).
- Headless test copy: SP/parade/mkt.sh + probe.js (modes: default click-through test, audio=1 offline render, og=1 og screenshot, idle=1).

## todos
- More tunes (samba, New Orleans second line) as a style switch.
- Solo button: tap-and-hold a marcher for a solo.
- Majorettes / flag twirlers (visual only).
