# Night Porch — an ambient weather soundboard

## log
- 2026-08-19: v1.0 — built per chat. Four pads with letter keys (R rain / W wind / T thunder / S starlight; H = hush all; input-focused keys shielded, probed). Loops: rain (looping bandpassed noise + poisson sine plinks), wind (pink noise, LFO-wandering bandpass), starlight (sparse pentatonic sines into a feedback delay); thunder = one-shot rumble (pink burst LP150 + 55→32Hz sub, momentary aria-pressed flash). CAPTIONS strip (the a11y centerpiece): every audio event also WRITTEN as it happens — "[rain patters steadily on the porch roof]", "[thunder rolls, long and low, somewhere past the hills]", off-captions too ("[clouds tuck the stars back in]"), aria-live, 4-line cap, bracket format probed. Volume: squared curve ×0.8 headroom → compressor; probe captures the SCHEDULED setTargetAtTime target (weather-loom's headless audio-clock lesson pre-applied — no clock race). Hush = full teardown (nodes stopped+disconnected, timers cleared, probed). vol persists local-only. Pads aria-pressed with kbd chips; pulse animation reduced-motion-stilled. Zero external assets. Probe 10/10 first run.

## issues
- none.

## todos
- crickets pad, "storm night" one-press preset, if the porch gets visitors.
