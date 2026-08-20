# Pocket Storm PS-1 — a weather synthesizer

## log
- 2026-08-20: v1.0 — built per chat: interactive knobs, sequencer, waveform visuals, mute. A pocket-operator-style handheld device (plastic case CSS with inset highlights, silkscreen brand, green LCD). FOUR WEATHER VOICES all synthesized: rain (highpass noise ticks), wind (Q=2.2 lowpass-swept noise whoosh), thunder (60→28Hz sine drop + lowpass rumble), drip (pitched sine ping, pitch varies deterministically by step (step*97)%7). FOUR KNOBS — real rotary controls: vertical pointer-drag + full keyboard (arrows step, Home/End rails), role=slider with aria-valuemin/max/now/valuetext, CSS --rot indicator over 270°: TEMPO (60-180 BPM), STORM (gain 0.3-1.5×), SKY (brightness 400-4000Hz feeding every voice's filters), ECHO (0.28s delay wet 0-0.6, live setTargetAtTime). Pure knob→param maps (pBpm/pStorm/pSkyHz/pEchoWet) probe-verified at the rails. SEQUENCER: 4×16 grid of aria-pressed toggle buttons ("rain step 5"), 25ms-interval lookahead scheduler (0.12s horizon) against ctx.currentTime, playhead column highlight via scheduled timeouts, LCD shows BPM/step/state, default pattern preloaded, space=play/stop, clear button, pattern+knobs persisted (pocket-storm-v1). SCOPE: AnalyserNode oscilloscope on the LCD with phosphor grid. MUTE: aria-pressed master-gain zero ("the storm continues, politely, in silence"), M key. Testability: SCHED counters + advance(n) manual-clock seam → probe asserts 32 advanced steps schedule exactly 2× the pattern's per-voice counts (count-from-data, no audio-clock races). Probe 12/12 first run.

## issues
- none.

## todos
- pattern share codes, a lightning flash on thunder steps, swing knob, if chat asks.
