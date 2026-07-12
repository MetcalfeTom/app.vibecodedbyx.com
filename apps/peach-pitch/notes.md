# peach-pitch · notes

## log
- 2026-07-12: v1 (chat ask: browser voice changer — demon-alien double pitch, monotone, autotune, peach slider angel→peach-demon). **DSP core is pure JS, node-tested 22/22** (design goal: everything testable without a browser). `makeShifter(sr)`: classic dual-tap doppler granular shifter — 85ms grain window, two taps 180° apart with triangular gain windows, linear-interp reads, `run(inp,out,ratio,gain)` where **ratio IS the pitch multiplier** (⚠ caught pre-ship: engine originally passed 1/ratio — demon went UP; sine-through-shifter tests measure 220→116/220/432 for ratios 0.5/1/2). `detectPitch`: autocorrelation (1024 window, 70–400Hz) with **subharmonic guard** — earliest local-peak lag tying ≥0.9×global best wins the octave (v1 bug: pure tones detected 1–2 octaves low; first fix attempt over-corrected +6% sharp because the correlation peak's flat top crossed a bare threshold early — local-max requirement fixed it; tests: 82/165/220/330Hz all within 3%). `snapToScale`: A-minor-pentatonic snap for autotune. `morphParams(t)`: semis = 6−15t (neutral at t=0.4, slider default), angel side (<0.35) adds octave-up halo voice, demon side (>0.6) adds 42Hz ring-mod growl. **Modes**: morph slider / demon-alien (0.58× + 1.5×+LFO wobble + 12% dry) / monotone (track f0 → ratio 140/f0, 0.25 smoothing) / autotune (snap ratio, 0.6 hard-snap smoothing + 1.007 detune doubler). **Wiring**: getUserMedia (echoCancellation+noiseSuppression) → ScriptProcessor 2048 → outGain → analyser → monitorGain (default OFF = no feedback squeal) → destination, plus MediaStreamDestination → MediaRecorder 6s → auto-playback + .webm download. **Demo voice** for mic-less users: sawtooth 155Hz + 5.2Hz vibrato + 2.3Hz syllable AM + bandpass formant → engine. Live pitch readout (Hz + note). Peach waveform viz (time-domain, RMS-scaled glow) on dark cocoa canvas. Peach gradient heaven→hell page, Shrikhand + IBM Plex Mono. Hook `__pp {makeShifter,detectPitch,snapToScale,morphParams,createEngine,params}`.

## issues
- ScriptProcessorNode is deprecated (still universal); AudioWorklet port is the proper future fix if chat hears glitches on busy machines.
- Mic + monitor ON without headphones = feedback (monitor defaults off, warning shown). Recording avoids the issue entirely.
- Demo-voice stop rebinds its own onclick crudely (bindDemo stub) — works, inelegant.
- Cannot test mic path in sandbox — engine + graph wiring dry-run only; if chat reports silence, check getUserMedia permissions and AC.resume on gesture.

## todos
- AudioWorklet migration; wet/dry knob; more scales for autotune (major, chromatic).
- Upload-a-clip mode (process a file offline via OfflineAudioContext).
