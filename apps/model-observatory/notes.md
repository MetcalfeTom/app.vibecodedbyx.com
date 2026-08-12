# model-observatory (The Model Observatory)

## log
- 2026-08-12: v1 per chat ("safe browser-based local-model observatory prototype with text and optional voice, moodboard, electrochemical-style readout, streaming visualization, and no interruption controls") + follow-up ("clearly labeled simulated model-audio track + explain the real audio-model limitation in the interface"). Single file, Eczar + Fragment Mono, observatory dome palette (void navy / copper / verdigris / phosphor / amber).
  - **The local model — safe by construction**: an interpolated word-level n-gram chain (trigram 0.62 / bigram 0.28 / unigram 0.10) trained at page load on ~430 tokens of ORIGINAL embedded field-note prose (written for this app; no external corpus, no downloads, no network beyond fonts/OG). Genuinely local: distFor() returns a true probability map (sums to 1), sampling yields per-token probability → surprisal −log2(p), plus full distribution entropy.
  - **Streaming visualization**: token-by-token stream (150–280ms cadence, 46–76 tokens ending on sentence punctuation), each token heat-colored by surprisal (mint calm → ember startled), blinking phosphor cursor, seed echoed in italics.
  - **Electrochemical readout**: scrolling strip-chart canvas, verdigris grid, two glow traces — surprisal (phosphor, "mV") + entropy (amber, "µA") — with an idle drift line between runs, DPR-aware resize.
  - **Next-token chamber**: live top-7 candidate bars each step; the sampled pick highlighted copper/amber.
  - **Moodboard**: valence/arousal EMA fed by a ~35-word lexicon (word → valence, arousal, hue) + entropy nudging arousal; named inner weather from a 7-tier table (placid drift → electrical storm), 5 recent-hue swatches, twin meters, numeric note.
  - **No interruption controls (spec highlight)**: once observe starts — button disabled + "observing…", seed locked, status pill "observing — do not interrupt", zero stop/pause/abort buttons anywhere (probe asserts none exist). Runs complete themselves.
  - **Voice, both optional + feature-detected**: 🎙 seed dictation via SpeechRecognition (button hidden if unsupported), 🔊 browser-TTS reading completed sentences (queued, never cancelled — even audio respects no-interruption). Defaults off.
  - **Simulated model-audio track (chat follow-up)**: 〜 "model audio (sim)" toggle — Web Audio sonification per token (triangle osc, pitch = 170+surprisal·66 Hz, lowpass brightness = 380+entropy·640 Hz, 160ms envelope, quiet). Toggling reveals #audio-note stating plainly: SIMULATED, not the model speaking; real audio-generation models need hundreds of MB of weights + a neural vocoder and this page downloads nothing; the voice button is the browser engine, also not the model.
  - Verified: syntax; 16-id cross-check; 17/17 probe (dist sums to 1, entropy>0, topK sorted, sim-note shows/hides with SIMULATED+not wording, voice toggles, no-interrupt lockdown, no stop/pause/abort button exists, tokens stream, 7 bars live, mood leaves "unobserved", ECG pixels lit, run completes ≥46 tokens, controls released, status reports token count); mid-run screenshot reviewed.

## issues
- Corpus is deliberately tiny → the chain parrots corpus phrases often at low entropy; that's the point (observable internals) but chat may ask for "smarter" output. Options: bigger embedded corpus, temperature slider, or let users paste their own corpus (retrain in-page — still safe).
- Headless probes: blackhole fonts/OG hosts; virtual-time handles the setTimeout stream fine (no rAF dependency).

## todos
- "Feed the corpus" panel: paste text, retrain live (keeps everything local).
- Paper-roll export: download the run + trace as a PNG strip.
- Comparative runs: two seeds side by side, twin traces.
