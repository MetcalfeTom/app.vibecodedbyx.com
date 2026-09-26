# Focus Buddy — notes

Pomodoro-style focus sprints with a premium settings panel (supabase `isUserPremium`) and the FocusFM ambient button.

## log
- 2025-09-19: built (pomodoro companion).
- 2026-09-26: **FocusFM always plays something**: the button streams a hosted Pixabay track (`#ambient-audio`); if `play()` rejects (offline, hotlink blocked, file gone) it now falls back to `buildSynthAmbient()` in script.js — a brown-noise bed (lowpass 520 Hz) plus a slow A-major sine pad with per-voice LFOs, faded in/out on the master gain. The AudioContext is created synchronously in the click so it keeps the user gesture. Before, a failed play only logged a console warning and the button did nothing. og:image made absolute.

## issues
- The hosted track is an external hotlink; it can't be checked from the sandbox (no internet). The fallback covers it either way.

## todos
- If the hosted track proves dead, drop the `<source>` and use the generated ambience only.
