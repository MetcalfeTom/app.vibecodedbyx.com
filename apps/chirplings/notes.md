# Chirplings — notes

## log
- 2026-08-18 v1.0: mic-animated sound-creature toy, zero recording BY CONSTRUCTION
  (no MediaRecorder anywhere in the source — probe greps for it). Five creatures each
  tuned to a center frequency (110/220/440/700/1050 Hz); excitement = volume ×
  log-frequency gaussian around their note → bounce/eye-widen/mouth-open/glow/♪
  particles; silence → doze with drifting z's. Pitch via pure detectPitch(): normalized
  autocorrelation + FIRST-strong-peak (≥93% of global) + shoulder-ride to local max —
  see issues for the three-stage debugging story. Mic mode: privacy card ("sound →
  two numbers → wiggles; no recorder in this toy at all"), explicit ⏹ release (tracks
  stopped + AudioContext closed); denied/no-gum → graceful auto-switch to CONDUCT mode:
  hold the meadow (height = pitch 70–1150Hz, holding builds loudness), keys 1–5 boop
  creatures. Reduced-motion damps bounce/z's. Baloo 2 + Comic Neue pastel. 16/16 probe
  (source grep, ACF pure tests at 110/440 + silence, band selectivity both ends, sleep,
  notes, poke, privacy gate, stop-releases, denied-fallback, hand mapping, a11y)
  + screenshot of Chirpa soloing at 440 while the family sleeps.

## issues
- **ACF pitch detection took three passes, each measured**: raw ACF biased short lags
  (110Hz → 1225: near-minLag lag sums more terms); normalizing by (n−lag) tied every
  sub-octave (440 → 62.8); threshold-only then read ~5% sharp (shoulder before peak).
  Final: normalize → global best → first lag ≥93% → ride to local max. Spectrum check
  nails 110/150/220/440/700 within 1%. Measure, don't theorize.
- Mic path is real-clock; probes drive the engine via S._sigOverride and stub gum.

## todos
- A sixth hidden creature above 1200Hz for whistlers, if chat asks.
