# Kurzfilm

## log
- 2026-07-31 v1: built as the answer to chat's feasibility question "can we build a browser-based short video maker with captions and audio using Canvas/MediaRecorder?" — yes, and this is the proof. 720×1280 (9:16) canvas → captureStream(30) + WebAudio master routed into a MediaStreamAudioDestinationNode whose audio track is added to the canvas stream → MediaRecorder (mime negotiated: mp4;avc1 → mp4 → webm;vp9,opus → vp8,opus → webm) → Blob → in-page <video> preview + download link. Captions: textarea one-per-line (cap 20), equal time split across chosen 4–20s, pop-in ease + word-wrap + progress dots. 4 animated looks (dusk gradients / noir grain+beam / neon horizon grid / bauhaus paper — paper flips caption ink dark). 3 synth soundtracks (lo-fi beat w/ lookahead scheduler, arp bounce, warm drone) + silent; audio plays to speakers AND the recording. Viewfinder OSD: VT323 timecode mm:ss:ff + blinking REC. Built-in "Can your browser do this?" panel — feature-detects captureStream/MediaRecorder/createMediaStreamDestination + negotiated mime and prints a per-device verdict, so every visitor answers the compat question for their own browser. Bricolage Grotesque + VT323, film-lab dark amber. 8/8 stub checks green (boot, verdict, render loop, record start, audio-track mux, mime negotiation, auto-stop at duration, output panel) + syntax + id cross-check + head/OG checks.

## issues
- Real-device verification pending: sandbox has no browser; emoji-animator proves canvas→WebM works on this site, the new claim (audio mux) needs a chat user to confirm sound in the downloaded file. The check panel + status line will surface any failure clearly.
- iOS Safari: MediaRecorder needs 14.1+; older ones get the red verdict and a clear "preview but not export" message. Safari records mp4, Chrome/Firefox webm — extension follows negotiated mime.
- Recording captures the canvas directly; keep the tab foregrounded during record (rAF throttling in background tabs would freeze frames).
- Audio starts on button press (user gesture) so autoplay policy is satisfied.

## todos
- User-uploaded image as background layer (FileReader, local only).
- Per-line caption timing syntax ("text | seconds") if chat wants control.
- Mic track option (getUserMedia) for voiceover — permission prompt, keep opt-in.
