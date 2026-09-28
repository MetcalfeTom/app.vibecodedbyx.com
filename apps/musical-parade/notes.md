# Musical Parade

Build a marching band one player at a time; each instrument adds its part to an 8-bar march in B-flat while the band high-steps down a festival street.

## log
- v1.0 (2026-09-28): requested by angienimo ("create a musical parade", "build the band"). 8 instruments (snare, bass drum, cymbals, sousaphone, trombone, trumpet, piccolo, bell lyre) + a drum major who twirls a baton. All sound synthesized with WebAudio (no samples): brass = saw+square through an enveloped lowpass, piccolo = triangle with vibrato, bells = 3 inharmonic sines, drums = filtered noise + pitched sine. A second player of the same instrument plays a harmony line (third below / fifth / octave), more add volume. New players join on the next beat. Legs step on the beat from the audio clock, the street scrolls with the song position, and the crowd raises arms as the band grows. Full band = confetti + cheer. Share via #band=<letters>&bpm=N (s b c u o t f g). Tap a marcher to send them home; tap the drum major to halt/march. Keys 1-8 add, Backspace sends the last one home, Space marches.

- v1.1 (2026-09-28): angienimo asked for other parade bands ("Jazzy", "Carnival", "Synthwave"). A band switch above the street picks one of three: Brass march (the original), Jazz second line (When the Saints Go Marching In, 16 bars, swung 8ths, walking tuba, tailgate trombone smears, clarinet-style runs; white shirts, captain caps and ties, a grand marshal with a bowler and a Mardi Gras umbrella; dusk sky, iron balconies, purple/green/gold bunting) and Carnival samba (original 8-bar tune, surdo on 2 and 4, caixa 16ths, shaker cymbals, a whistle call from the flag bearer in bar 8; feather headdresses, sequins, white trousers, a waving flag; tropical street). Each band has its own dance (high step / sway / double-time bounce) and tempo; the share link carries &style=jazz|carnival. Switching mid-parade restarts the song from the next beat (st.s0).
- v1.2 (2026-09-28): Synthwave band (angienimo's third pick): original 8-bar vi-IV-I-V tune, synth voices (PLAYN: detuned saw lead, pumping 8th-note bass, pad chords, square arpeggios, gated snare, 909-style kick, closed hats); neon night street with a striped retro sun, stars, low skyline, glowing signs, laser-grid road; marchers in dark jackets with neon trim, 80s hair and visor shades; the leader plays a keytar. Volume slider (Tatum's idea, Angie agreed) for every band.

## issues
- The clock falls back to performance.now() until the AudioContext is running ('p' mode), then re-anchors to the audio clock ('a' mode).
- Headless test copy: SP/parade/mkt.sh + probe.js (modes: default click-through test, audio=1 offline render (+style=, from=), og=1 og screenshot, idle=1, shot=<letters> screenshot, sw=1 switch bands mid-parade).
- Per-band synth voices: pl(k) picks PLAYN for neon, else PLAY. Neon buildings are 0.62x tall and the sun rises with VH so it shows on phones.
- Songs live in EV, rebuilt by buildSong(style); LOOP is 128 (march, carnival) or 256 (jazz). sched() counts steps from st.s0 and adds swing offsets (SWG) for jazz.

## todos
- Solo button: tap-and-hold a marcher for a solo.
- Majorettes / flag twirlers (visual only).
