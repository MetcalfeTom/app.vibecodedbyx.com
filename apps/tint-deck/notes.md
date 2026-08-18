# Tint Deck — notes

## log
- 2026-08-18 v1.0: stream overlay color controller, fully simulated (no Twitch account/API).
  Controller: 8 preset swatches (aria-pressed), custom hex with validation + error line,
  breathing-glow + webcam-ring toggles, live 16:9 preview (fake gameplay scene + cam box)
  with the overlay frame on top. OBS path: overlay mode `?overlay=1&c=<hex>[&pulse=0][&cam=0]`
  renders ONLY the frame on a transparent body — color travels in the URL because OBS's
  embedded browser shares no storage with the user's browser. Same-browser tabs sync live
  via BroadcastChannel 'tint-deck'. Simulated channel points: Color Blast (6s temp color),
  Rainbow Ride (10s hue cycle via rAF), Chill Dim (6s desaturate) + fake-viewer event log;
  all transitions smooth, no strobe; endSim() reverts temp state. Russo One + Overpass Mono,
  dark control-room palette. Probes: controller 14/14, overlay mode 6/6, both screenshots.

## issues
- Real channel-point wiring deliberately out of scope (needs registered Twitch app +
  EventSub) — the sim panel says so in-app. Same honesty pattern as pixl-pal OAuth notes.
- Overlay color updates for OBS require re-copying the URL (documented in step 5).

## todos
- More frame styles (ticker bar, stinger corners) if chat asks.
- Could read `?demo=1` to auto-run sims for showcase clips.
