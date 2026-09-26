# emoji-animator · notes

## log
- 2026-07-15 v1.0: chat ×2 (retry completed preset list: rave/shake/spin/bounce/pulse). 512px main canvas + THREE stacked Twitch previews (112/56/28 — real emote sizes) all drawing the same frame: source pre-baked to an offscreen 512 (emoji at font 400px serif or dropped image fit 460), per-frame transform from pure ANIMS fns (t∈[0,1) → {x,y,r,sx,sy,hue}); rave = spin-wobble + hue-rotate cycle + pulse. 9 presets total, commissioned five first. Drag-and-drop onto the stage panel + file picker (FileReader only — nothing uploaded, status line says so). 40-emoji library (🦐 first, obviously), aria-pressed selection. Speed 0.3–3×. EXPORT: canvas.captureStream(30)+MediaRecorder → 2s WebM download; PNG snapshot. Checkerboard transparency backdrops. Baloo 2 + Space Mono, twitch-grape palette.
- 2026-09-26 v1.1: 🎞️ save GIF — a tiny GIF encoder lives in the page (median-cut palette shared by all frames, LZW, NETSCAPE loop, alpha<128 → see-through index 255). Bakes ONE seamless loop at the current anim + speed: frames = round(25/speed) capped at 60 (Twitch's animated-emote cap), delay = loop/frames. Sizes 112 (Twitch, default: says whether it fits the 1 MB limit) / 256 / 512. Shows the result (looping img + info + a download-again link). Probe: 112 bounce 25 fr 12 KB ~0.1 s; 512 rave 0.3× 60 fr 145 KB ~1.2 s; every frame LZW-decodes back exactly.
- 2026-09-26: og.png (1200×630: onion-skinned bouncing 🦐 + the three Twitch sizes + 'save it as a GIF' chip) replaces the pollinations og:image.
- 2026-09-26: three new presets — JAM (two head-bobs per loop, tilting left then right), PEEK (rises from the bottom edge, glances around, ducks back out of frame; smoothstep in/out, hidden ~6% of the loop), FLIP (coin-flip turn with a small hop; sx clamped away from 0). All seamless over t∈[0,1), node-swept for NaNs.
- 2026-09-26: GIF 'edges for' choice — dark chat (default, blends alpha 24–254 onto Twitch dark #18181b), light chat (onto #fff, file gets -light), anywhere (sharp 1-bit cut at 128). The result preview sits on that chat colour.

- 2026-09-26 v1.2: EFFECT row — hearts (three rising, alternating sides), sparkles (four twinkling corners), sweat (💦 slides down), anger (💢 throbs), zzz (two rising 💤), speed (white streaks behind the emote). Pure `FX[name](t)` → sprites in unit coords, seamless at t=0/1, drawn in screen space (they do not spin with the emote; speed lines draw behind). Baked into the GIF too; filename gets the effect (emote-bounce-sparkles-112.gif).
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD.
## issues
- WebM recording unsupported on some iOS Safari — caught, status explains, PNG still works.
- Emoji render varies by platform font (as Twitch emotes do by platform, so arguably a feature).
- hue-rotate ctx.filter is ignored by a few older browsers → rave loses color cycle but keeps motion.
- GIF has 1-bit transparency: the edges choice blends soft rims onto the chat colour (a dark-chat GIF shows a faint dark rim on light chat — that's why light is offered). Headless chromium has no colour emoji font — probe builds @font-face the twemoji ttf from sloppy-desktop.

## todos
- Per-frame onion-skin / frame-by-frame mode.
