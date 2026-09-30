# Acta — notes

Meeting recorder + transcriber for Twitch viewer **arianmartiz** (Spanish-speaking, they/them), asked 2026-09-30 10:24 UTC:
"a tool to record meetings, external audio included, and transcribe it; a floating button; give me a link to download it".
Follow-ups 10:25: "ALL the computer's audio, not just the browser's" and "a downloadable app, not in the browser" (→ installable PWA).

Single `index.html`, no backend, no Supabase. Spanish-first UI with an ES/EN switch (`T` dictionary, `data-i18n` / `data-i18n-html`).

## How it works
- **Floating dock** (`#dock`): record / pause / resume on the red button, stop square, timer, MIC + PC level meters, a halo that follows the level.
  Draggable (pointer events, 8 px threshold, click swallowed after a drag), position saved as fractions (`acta.v1.dockPos`),
  grip button: click = next corner, arrows = move (Shift = bigger steps).
- **Sources**: mic via getUserMedia; computer audio via getDisplayMedia (`systemAudio:'include'`, `monitorTypeSurfaces:'include'`,
  `selfBrowserSurface:'exclude'`, `surfaceSwitching:'include'`, `displaySurface` hint monitor/browser, `suppressLocalAudioPlayback:false`).
  Both go through one AudioContext into a MediaStreamAudioDestinationNode → one MediaRecorder (opus webm in Chrome/Firefox, mp4 in Safari).
  getDisplayMedia is called FIRST in the click (it needs the user activation), then getUserMedia.
  The video track is kept but disabled + 1 fps (not stopped: unsure whether stopping it ends the loopback audio in every Chrome).
- After the pick: no audio track → clear message how to fix (Entire screen + "Share system audio"; windows never carry sound) and the
  recording goes on with the mic; an **"Añadir audio del ordenador"** button in the live section adds it mid-recording (also after "Stop sharing").
- First time per mode a **guide dialog** (mock of Chrome's picker) explains what to pick; its Continue click is the activation for getDisplayMedia.
- `canSys` = Chromium desktop only. Firefox/Safari/phones get a plain explanation and record the mic.
- **Live transcript**: Web Speech API (continuous, interim, auto-restart with backoff). Normally it hears the default mic.
  Where Chrome supports `SpeechRecognition.start(MediaStreamTrack)` it gets the mixed track (mic + computer). Detection:
  `start(0)` throws TypeError where the overload exists; elsewhere it starts on the mic and is aborted at once — so the probe only
  runs once mic permission is granted (or when the user presses "Transcribir la grabación entera"). Never probed in Safari.
- **"Transcribir la grabación entera"** (only where start(track) works): plays the blob silently through WebAudio into a
  MediaStreamDestination and feeds that track to speech recognition, in real time. Replaces the transcript when it produced lines.
- **Downloads**: audio (the recorder's own blob, .webm/.ogg/.m4a), .txt with [hh:mm:ss] stamps, .srt. Blob + object URL + `<a download>`.
- **Saved minutes**: transcripts only (never audio) in localStorage `acta.v1.saved` (max 40), written while recording (debounced).
- **Floating window**: Document Picture-in-Picture (`documentPictureInPicture.requestWindow`), the dock node is moved into the PiP
  window (styles copied) and back on `pagehide`. Shows the last caption line in PiP. **requestWindow only works top-level**: on
  sloppy.live the app runs inside the `_bar` iframe, so there the float button opens `/acta/?bare=1` in a new tab.
- **PWA**: `manifest.json` (start_url `./?bare=1` so the installed window gets the bare app, not the bar wrapper whose iframe
  would block PiP), `sw.js` (shell precache, network-first, only same-origin /acta/ GETs + Google Fonts cached, never POSTs),
  install button via `beforeinstallprompt` (only fires top-level → inside the bar we show "open in its own tab" instead),
  Safari hints (iOS Share → Add to Home Screen, macOS File → Add to Dock).

## Pollinations transcription: NOT available (checked 2026-09-30)
POST https://text.pollinations.ai/openai with model `openai-audio` + `input_audio` → **404 "Model not found: openai-audio"**.
`/models` lists only `openai-fast` (text in, text out) for anonymous use. So no cloud transcription; the UI says so in the footer.
If an audio model comes back, the plan was: chunk the recording (decode → 16 kHz mono WAV, ~60 s chunks), warn the user that the
audio goes to that service, POST each chunk, stitch with offsets.

## log
- v1.0 (2026-09-30): first version — dock, mic + system/tab audio mixing, live captions, downloads (.webm/.txt/.srt), session list,
  saved transcripts, guide dialog, PiP, PWA (manifest, sw, icons), ES/EN. Headless (Chromium 131, fake mic): record → pause → resume
  → stop gives a playable 4 s opus webm; txt/srt output checked; no overflow at 390 px.
- v1.1 (2026-09-30): PiP fix (meters were looked up with `$()` in the main document after the dock moved into the PiP window →
  setDock threw; now cached element refs), setup card collapses to just the language picker while recording (`.setup.busy`),
  live captions fall back to the plain mic if `start(track)` throws, service worker registers on any secure context.
  Headless checks: guide dialog + stubbed getDisplayMedia (both sources mixed, "Stop sharing" → message + re-add button, no-audio
  pick → clear fix message, cancel → mic only); PiP opens, record/stop from inside PiP, caption shows there, closing returns
  the dock; inside a bar-like same-origin iframe: mic recording works, install card says "open in its own tab", float opens
  `?bare=1` in a new tab.

## issues
- Headless can't test a real getDisplayMedia picker or real speech recognition (stubbed in tests); PiP does open in headless.
- manifest `start_url` is `./?bare=1` on purpose (not `./`): the bar wrapper would put the installed app in an iframe, which blocks PiP.
- The page has a beforeunload guard while recording or with undownloaded recordings — CDP `Page.navigate` in tests hangs on it.
- Chrome's webm has no duration header; the card's `<audio>` uses the currentTime=1e101 trick to show the length.
- iOS Safari may not like SpeechRecognition and getUserMedia at the same time (untested).
- Live captions in Chrome/Edge are processed by the browser vendor's cloud (said in the footer).

## todos
- Edit transcript lines by hand (fix names) before downloading.
- Speaker hints (mic lines = "Yo", computer lines = "Otros") when both are transcribed separately.
- Keyboard shortcut to pause from the PiP window.
- Markdown / .docx-like export with a summary header (date, attendees) if Arian wants proper minutes.
