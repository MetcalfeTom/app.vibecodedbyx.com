# voz-de-lata · notes

## log
- 2026-07-15 v1.0: chat "angienimo dropped a full phonetic spec for a female LatAm voice — build it with Web Audio formant filters?" — the spec itself never arrived (only its reputation), so shipped a Klatt-style formant synthesizer on textbook female LatAm targets with every dial exposed for recalibration when Angie's numbers land. ARCHITECTURE: glottal sawtooth (f0 210Hz default, declination + stress bumps + final fall + micro-drift) → 4 parallel bandpass biquads (per-phoneme F1–F4 targets, setTargetAtTime GLIDES between phonemes = the intelligibility trick) + looped noise buffer through its own swept bandpass for fricatives (s 6k / f 4.2k / x 1.8k) and stop bursts (p/t/k: silence→pop). G2P: LatAm Spanish nearly 1:1 — seseo (z, ce/ci→s), yeísmo (ll→ʝ), qu→k, gue/gui, ge/gi→x, h muda, v→b, initial r→trill; trill = 4 amplitude flutter dips; stress from accent chars else penultimate-vowel heuristic; phoneme line rendered with ˈ marks. Sliders: f0 140–300, rate, formant shift (♀ tract 1.15×), breath. Oscilloscope on analyser. Presets incl. rr trabalenguas. 1970s phonetics-lab aesthetic (Instrument Serif + Sono, oscilloscope green on panel grey).

## issues
- It sounds like a charming 1980s robot, NOT a natural voice — that's physics, not a bug; framed honestly on-page.
- Stress heuristic is penult-only (no syllabification); accent chars are authoritative.
- Sandbox can't hear: audio graph is schedule-verified + G2P node-tested, but ears in chat are the real QA.

## todos
- Recalibrate to Angie's actual spec when the numbers arrive (per-vowel F1/F2/F3, bandwidths, f0 contour).
- Nasal antiformant approximation (notch filter) for better m/n.
- Diphthong glide targets (ai, ei, ue).
- If chat loves her: wire as an OPTIONAL Parla voice ("Lata" in the dropdown).
