# The Day Range — type your day into mountains and chords

## log
- 2026-08-20: v1.0 — built per chat: typed daily moments → layered ambient tones + colorful terrain. PURE MAPPING analyze(text), fully deterministic + probed: fnv hash → mulberry → hue, height (40+len*7 clamped 50-210), softness = vowel ratio (round quadratic hills vs sharp lineTo peaks), scale degree from minor pentatonic [0,3,5,7,10] over A2, octave from word count. MOOD WORDS nudge kindly: bright list (sun/coffee/laugh/…) → amber hues + brighter filter, deep list (tired/rain/missed/…) → blue hues 205-240 + darker lowpass — and the status honors them: "rises deep and blue. the range holds that one too." AUDIO: each moment adds a sustained layer (detuned sine/triangle pair by softness, slow 2.2s attack, per-moment LFO shimmer, lowpass by mood) into a compressed master; cap 8 layers with graceful retirement of the oldest; landing arpeggio ping; chips re-ping their tone. TERRAIN: 3 depth ridges (moments round-robin), atmospheric perspective (back lighter), sky gradient from average hue, sun that warms +grows with bright moments, mist bands, selected-peak marker; canvas role=img with a living aria-label naming first and last moments. Controls: mute (aria-pressed) + volume, remove-last ("it happened; it just isn't drawn"), new day ("yesterday's range served its purpose beautifully"). localStorage persistence with analyze re-derivation on load (format-drift safety). Probe 14/14 first run — determinism, mood hue ranges, layer cap retiring the true oldest, round-robin ridge counts, Enter path, kind statuses throughout.

## issues
- none.

## todos
- share a day as a seed string, sunset animation as the day fills, optional gentle rain sound on deep days, if chat asks.
