# emoji-animator · notes

## log
- 2026-07-15 v1.0: chat ×2 (retry completed preset list: rave/shake/spin/bounce/pulse). 512px main canvas + THREE stacked Twitch previews (112/56/28 — real emote sizes) all drawing the same frame: source pre-baked to an offscreen 512 (emoji at font 400px serif or dropped image fit 460), per-frame transform from pure ANIMS fns (t∈[0,1) → {x,y,r,sx,sy,hue}); rave = spin-wobble + hue-rotate cycle + pulse. 9 presets total, commissioned five first. Drag-and-drop onto the stage panel + file picker (FileReader only — nothing uploaded, status line says so). 40-emoji library (🦐 first, obviously), aria-pressed selection. Speed 0.3–3×. EXPORT: canvas.captureStream(30)+MediaRecorder → 2s WebM download; PNG snapshot. Checkerboard transparency backdrops. Baloo 2 + Space Mono, twitch-grape palette.

## issues
- WebM recording unsupported on some iOS Safari — caught, status explains, PNG still works.
- Emoji render varies by platform font (as Twitch emotes do by platform, so arguably a feature).
- hue-rotate ctx.filter is ignored by a few older browsers → rave loses color cycle but keeps motion.

## todos
- GIF export if chat asks (needs an encoder — heavier, still local-able).
- Per-frame onion-skin / frame-by-frame mode.
