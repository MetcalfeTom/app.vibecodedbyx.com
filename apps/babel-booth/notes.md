# babel-booth · notes

## log
- 2026-07-14 v1.0: chat "local mic translator — mic audio → whisper WebAssembly in browser → English, offline, no server, no API keys". Stack: @xenova/transformers 2.17.2 from cdn.jsdelivr.net (precedented CDN — supabase ssr already loads from it), pipeline('automatic-speech-recognition','Xenova/whisper-tiny') with task:'translate' — whisper translates ANY language directly to English in one pass, no separate MT step. Model (~40MB) downloads once from the HF hub via the lib, then browser-cached → genuinely offline afterward. Explicit "load the interpreter" button (no surprise 40MB), multi-file progress averaged into a bar. Recording: getUserMedia + MediaRecorder → decodeAudioData → OfflineAudioContext resample to 16kHz mono Float32 → asr(). 30s auto-stop, live VU meter (AnalyserNode peak), ON AIR lamp, elapsed timer. 1960s interpreter-booth aesthetic: walnut panels, bakelite cream buttons w/ hard shadows, red ON AIR pulse, Big Shoulders Display + Newsreader italic + Space Mono. Capability gates: no WASM / no mediaDevices → honest disabled states. Feed cards newest-first with duration + interpret time.

## issues
- whisper-tiny quality is "gist" tier — proper nouns and heavy accents wobble. tiny.en would be better English-only but can't translate.
- First interpretation after load is slower (WASM warmup). Phones take several × realtime.
- iOS Safari MediaRecorder emits audio/mp4 — decodeAudioData handles it, but untested here (sandbox has no mic).

## todos
- Model picker (tiny/base) for stronger devices.
- Also-show-original toggle (second pass with task:'transcribe').
- Download transcript as .txt.
