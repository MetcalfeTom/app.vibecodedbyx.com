# sloppy-silence (Sloppy Silence)

## log
- 2026-06-28: shipped (chat ask: "stopwatch that resets every time I speak — audio amplitude detection or Twitch pubsub"). Used MIC AMPLITUDE (Twitch PubSub exposes bits/points/predictions, NOT voice activity, so it can't detect talking — noted in the footer).
  - **Voice-activity detection**: `getUserMedia({audio:{echoCancellation,noiseSuppression,autoGainControl:false}})` → `AnalyserNode` (fftSize 1024) → per-frame **RMS** of the time-domain data, EMA-smoothed (`levelSmooth`). `speaking = levelSmooth > thrRms()`; threshold from a sensitivity slider (`0.008 + sens/100·0.16`). Calibrate button sets the threshold to ~2.2× the rolling ambient level.
  - **Auto-reset stopwatch**: every frame, if speaking → `silenceStart = now` (timer snaps to 0); otherwise the big counter ticks up (`(now-silenceStart)/1000`, tenths, `M:SS.s` past a minute). Fully automatic — the ONLY tap is the mic-permission "Start listening" (browsers require a user gesture for getUserMedia; everything after is hands-free).
  - **Visible for all**: huge tabular-numeric counter centered in a breathing circle that grows calmer/greener the longer you're silent (milestones: "shh…", "zen achieved.", "are you still there?") and flares red + shakes + flips the page tint when you speak. Stats: **Longest silence** (persisted to localStorage) + **Times you spoke** (onset-counted). Live volume meter with a threshold marker for tuning.
  - **Privacy**: audio never leaves the browser (no recording/upload) — said in the footer.
  - **Aesthetic**: calm zen — deep teal/indigo, Fraunces italic title + JetBrains Mono counter. WCAG: role=img + aria-label on canvas, labelled slider, role=status aria-live for milestones (not the ticking, to avoid SR spam), focus-visible, prefers-reduced-motion kills breath/shake/tint transition. Mic-error state if blocked/denied.
  - Verified: syntax OK; getUserMedia + analyser + RMS + reset + localStorage wired.

## issues
- A single Start tap is required (browser mic-permission gesture) — cannot be fully buttonless; it's as close as the platform allows.
- Threshold needs tuning per room/mic; the sensitivity slider + Calibrate handle it. Loud keyboard/background can false-trigger if set too sensitive.
- Mobile Safari getUserMedia works but needs HTTPS (sloppy.live is fine).

## todos
- Optional Twitch-chat shoutout when a new longest-silence record is set.
- A "silence leaderboard" via Supabase (per-user best).
- Frequency-band VAD (focus on voice 85–255 Hz) to ignore non-speech noise.
- Countdown/challenge mode ("stay quiet for 60s").
