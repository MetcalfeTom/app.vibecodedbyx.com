# dial-drift · notes

## log
- 2026-07-30: v1 — chat ×2 ("internet radio, retro interface, 4 procedural lo-fi loops via Web Audio, station switching"). 4 stations as data ({bpm, swing, root, chords[4 stacks], bass pattern/walk flag, drum 16-steps, cutoff, crackle level, rain/arp flags}): DUSTY KEYS 72bpm swing .62 / TAPE RAIN 60bpm + highpassed pink-noise rain bed / MIDNIGHT BUS 84bpm walking 8th-note bass / STATIC GARDEN 66bpm random arp sprinkles. ENGINE: 60ms setInterval scheduler w/ 0.25s lookahead against AC.currentTime; swung 16ths (odd steps offset by (swing-.5)·2·s16); chords rolled 12ms/note every 2 bars w/ tape-flutter LFO on each key osc + octave shimmer; kick=sine drop 120→42, snare=bandpassed noise, hat=highpassed 50ms noise (8% humanized dropouts); sub-octave sine bass; global warm lowpass per-station cutoff; eternal looping crackle buffer (pops+hiss) + tuning static burst on switch. All envelopes de-clicked. Power knob red→green, needle glides on the band, VU pulses on kick/snare, station persists (localStorage). SUITE 9/9 incl. composer bar-advance + station-switch reset. NOTE __dd.forceAC test hook stubs crackle/rain gains — harness only.

## issues
- Scheduler is setInterval-based; heavy tab throttling in background may stutter (browsers throttle to 1s) — acceptable, radios crackle.

## todos
- Sleep timer; per-station volume; a 5th station if chat names it.
