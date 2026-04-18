# Chaos Soundboard

## log
- 2026-04-18: Created. 15 big colorful pads with synthesized meme sounds — all Web Audio, zero external assets, no login required. Sounds: air horn, vine boom, bruh, fart, sad trombone, ta-da, bonk, crickets, rick roll 7-note intro, metal pipe clang, scream, dial-up, cha-ching, discord ping, Wilhelm. Chaos Random button triggers a random pad + screen-wide particle burst. Panic/Stop All kills all active voices. Per-pad: scale pulse + flash + colored confetti particles at click position. Keyboard shortcuts 1-9/0/Q/W/E/R/T, Space = chaos, X = stop. Volume slider. Shrikhand + Bowlby One + IBM Plex Mono typography. Dark neon palette with scanline overlay.

## issues
- Web Audio needs a user gesture on iOS/Safari to unlock. Handled via `pointerdown` once-listener that resumes the context.
- `ensureCtx` is wrapped twice (reassigned at the bottom) — works but slightly hacky; keeps volume slider state before first audio unlock.
- Metal pipe clang is impressive but CPU-heavy with 5 sine partials + tail — multiple rapid presses could stack voices.
- Sounds are stylized approximations, not the actual copyrighted memes (Vine Boom is a synthesized low thump; Rick Roll is the 7-note intro in square waves). Good for streamability.

## todos
- Add more sounds: distorted yeah, "WOW" (Owen Wilson), airhorn remix stack, Mario jump/coin, Windows XP error ding, MLG hit marker, Roblox death *oof*, dun-dun-duuuun.
- Custom pad recording: let users upload a short audio file or record via mic, assign to a pad.
- Loop toggle per pad (tap to loop crickets for sustained comedy).
- Sound chain / combo mode: press multiple pads in rapid succession → play stacked chord.
- Streaming-friendly export: record 10-second jam to WAV for sharing.

## design
- Palette: bg1 #0d0518, bg2 #1a0930, hot #ff2e88, lime #d4ff3a, cyan #3afff0, orange #ff8c00, violet #8a4bff, yellow #ffd23a, red #ff3a3a, teal #00c9a7, pink #ff6fae, blue #3a8cff, mustard #d4a017, spring #3aff7a
- Fonts: Shrikhand (display, gradient text), Bowlby One (pad labels), IBM Plex Mono (UI)
- Pads: aspect-ratio 1/1, 20px radius, skeuomorphic 3D shadow with inner highlight/shadow, scale-down on press with spring easing
- Grid: auto-fit min 180px (responsive), 2-col on narrow mobile
- Canvas particles: mix of rect + circle shards with rotation + gravity, spawned at button click position
