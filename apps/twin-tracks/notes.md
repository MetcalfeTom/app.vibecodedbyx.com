# Twin Tracks

Duplicate song finder, asked for by pushedbutton on 2026-09-27 ("dedupe my MP3 files... letting the user verify them by showing matching waveforms"). The flip test is his idea too ("inversion trick: two songs played at the same time sum to silence").

## log
- 2026-09-27 v1.0: pick a folder (webkitdirectory), pick files, or drop a folder (webkitGetAsEntry walk, `_rel` path expando). Everything local; nothing uploaded.
  - Exact copies: same size → SHA-256 → same bytes. Exact families share one decode.
  - Same audio: decode at 8 kHz mono via OfflineAudioContext (decodeAudioData resamples to the context rate = light on memory), 4 one-pole bands (<150, 150–500, 500–1500, >1500 Hz), log energy per 10 ms, floored at max−50 dB, lead-in silence skipped, triangular smoothing then 20 fps, first difference quantised to Int8. Similarity = mean Pearson over the 4 bands, best of ±16 lags (±0.8 s). Only tracks within 6 s duration and a 48-step coarse-shape corr ≥ 0.5 get compared. SAME ≥ 0.80 (union-find), MAYBE 0.62–0.80 (pair cards).
  - Cards: tier badge, every copy's waveform on one shared clock (offsets from the lag), ★ suggested keeper (bitrate, then no "(1)/copy" in the name, then shorter path), Keep/Remove toggles, "Keep ★, mark the rest", "Mark the extra exact copies". Play any copy; switching copies keeps the same moment (A/B).
  - Flip test (non-exact rows vs ★): decode both at 22.05 kHz, align to the sample (8x-decimated search then exact ±12), least-squares gain/polarity, residual energy in dB → silence / whisper (≤−30) / mostly (≤−12) / doesn't cancel. "Hear what's left" plays the first 60 s of the residual.
  - Removal list: Copy list / Save list (.txt, relative paths). Browsers can't delete files; the page says so.
- Fixture results (scratchpad tt/mkfx.py: synthetic songs, exact copy, retagged LIST chunk, 11 kHz lofi quieter +0.337 s lead-in + hiss, and an "evil twin" = different song at the same tempo and length): lofi 0.874 (grouped, offset 0.35 s), evil twin 0.389 (not grouped), retagged flip = silence, lofi flip −14 dB. Scan of 9 files 0.2 s.

## issues
- Fingerprints only cover the first 4 minutes (MAX_FRAMES); a radio edit vs album version with the same start can land in "same audio" if the durations are within 6 s. The flip test and ears are the safety net.
- Decoding big libraries is the slow part (2 files at a time). Stop button shows what was found so far.
- The harmony-mixer lesson applies: a coarse "same track?" fingerprint false-positives as a deletion test. Keep the evil-twin fixture in any change to the matcher.

## todos
- Real-world calibration with actual MP3/AAC re-encodes (128 vs 320 kbps should flip to about −25..−35 dB).
- Remember marks between visits (keyed by path + size)?
- Overlay view (all copies drawn on one strip with multiply blending).
