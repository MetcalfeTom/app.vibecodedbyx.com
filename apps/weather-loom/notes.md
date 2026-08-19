# Weather Loom — cozy soundscapes, real and imaginary

## log
- 2026-08-19: v1.0 — built per chat. Six synth threads, each with slider→gain (squared curve × per-layer headroom scale, setTargetAtTime .08s smoothing): RAIN white-noise bandpass 1.5k + poisson droplet plinks; WIND pink noise through an LFO-wandering bandpass (0.07Hz ±260); THUNDER scheduled 9–25s rumbles (pink-noise burst LP140 + 52→30Hz sub); GLITTER pentatonic sine+triangle pings into a 0.38s feedback delay (fb .42, LP3.4k); AURORA three detuned slow-LFO voices; EMBER sparse highpassed noise pops. Master (≤.8 headroom) → compressor. 8 presets: 4 real (Soft Rain/Storm Front/Winter Wind/Fireside Drizzle) + 4 invented (Glitter Hail/Aurora Hum/Static Fog/Ember Rain), dashed borders mark the invented. Stop() tears down ALL timers/nodes/ac (probed). Sky window canvas: gradient tinted by aurora/ember/thunder, rain streaks skewed by wind, glitter twinkle, rising embers — density follows the live mix; static under reduced-motion. Mix persists (localStorage). ZERO external assets (grep-probed; data-URI favicon; Georgia system serif).
- PROBE LESSON (new, important): headless has no audio output device → AudioContext.currentTime barely advances → setTargetAtTime values never converge for probes to read. DON'T race the audio clock: monkey-patch gain.setTargetAtTime to CAPTURE THE SCHEDULED TARGET and assert on that. Probe 10/10.

## issues
- none yet.

## todos
- record-the-mix (MediaRecorder on a MediaStreamDestination) if chat asks — note it reintroduces recorder code, keep it opt-in.
