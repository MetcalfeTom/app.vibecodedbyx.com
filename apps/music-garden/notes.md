# Music Garden

## log
- 2026-04-22: Created. Generative music garden — ambient synth plays continuously, plants grow + bloom + shift hue in response to frequency data via WebAudio `AnalyserNode`. **Audio engine**: 4-voice drone chord (A1 55 / E2 82.4 / A2 110 / C#3 138.6 Hz, alternating sine + triangle), each voice with its own slow detune LFO (0.04–0.18 Hz, 2–6 cent range). Drone bus → biquad lowpass (900 Hz base, Q=0.6) modulated by a 0.08 Hz LFO with ±450 Hz range for slow-breathing timbre shift. Parallel signal flow: `dry` gain (0.72) + `wet` through 3.4s noise-impulse ConvolverNode reverb (0.58 gain) → DynamicsCompressor (−14 dBFS, 4:1, 12ms attack, 0.3s release) → AnalyserNode (fftSize 1024, smoothing 0.78) → master (0.42) → destination. **Chime scheduler**: setTimeout loop at 0.9–4.5s jitter, picks random scale degree × random octave offset (1/2/3 × 12) above A3 root, plays 3 oscillators (triangle fundamental + sine 2×+5 cent + sine 3×+2 cent with 0.22 harmonic gain), 12ms attack + 1.9s exponential decay at 0.2 peak. 4 selectable scales: pentatonic/dorian/lydian/mixolydian. **Plants**: `{x, baseY, height, maxHeight:170–430, stemBend, swayPhase, swaySpeed:0.45–1.3, hueBase:80–150 (greens), hueFlower, freqBand:0-3, leavesDrawn[], maxLeaves:2-5, petalCount:5-12, petalShape:round|teardrop, flowerSize, flowerMaxSize:14-38, bloomed, bloomPulse, bloomNudge, energy, energyAvg, visualHueShift}`. Each plant assigned one of 4 frequency bands (low/low-mid/mid/high) that slice the `freqData` array: `[[0,0.12],[0.12,0.3],[0.3,0.55],[0.55,0.9]]`. Every frame: compute average amplitude in plant's band (0–1), then `growSpeed = 12 + energy*110 + bloomNudge*14` drives stem growth. Leaves sprout as `Math.floor(height/maxHeight * maxLeaves)` progresses, each leaf grows over ~1.5–2.5s to its `maxSize`. Once stem reaches max, flower grows at top with same energy-driven rate. On full bloom: 22-particle pollen burst (radial explosion), +1 blooms counter, triggered chime playing a random scale degree in the plant's band octave (`ROOT_MIDI + deg + [0,12,24,36][band]`). Bloomed plants emit pollen every 0.4–1.8s while energy > 0.18 and pulse-scale (`1 + sin(age*3.2) * (0.05 + energy*0.32)`) with beat. **Frequency-hue coupling**: `visualHueShift` eases toward `energy * 40` at 3×dt rate — stems, leaves, flowers, halo all add this shift to base hue so the garden visually "breathes" with music energy. Band palettes: low=amber/coral (18/30/10), low-mid=jade (140/160/120), mid=violet/magenta (285/310/260), high=cyan/pink (190/200/170/330). Each plant picks a flower hue from its band palette ±24°. **Render**: stars (130 twinkling at hues 200–340), frequency spectrum bars (72, cyan-through-magenta gradient at bottom), ground gradient strip with swaying grass tufts, plants drawn back-to-front (sorted by baseY), pollen particles with glow. Soft trail via `fillRect(rgba(6,2,15,0.22))` each frame. Stem drawn as cubic bezier with `sway = sin(t*swaySpeed+phase)*7` at top control point. Flower: outer radial-gradient halo (scales with energy), N petals as radial-gradient ellipses/teardrops, center dot + highlight, up to 6 stamens once bloomed. **UI**: "music garden" Cormorant italic title with pink `<em>music</em>`, "plants listen · bloom · glow" Syne Mono subtitle. Stats top-right: plants/blooms/last tone (tone in cyan italic). Bottom pill control: ▶ begin / ◼ pause primary button, 4 scale pills, ＋ seed button. Glassy backdrop-blur. Hint: "click anywhere to plant a seed · turn sound on" fades after first interaction. Auto-plant timer 5–14s once audio running, max 14 plants, cap 18. Pre-seeded 3 plants on load. **Palette**: deep indigo/violet bg with radial glows top-corners. Cormorant Garamond italic + Syne Mono + IBM Plex Mono. Pollinations OG.

## features
- Continuous ambient synth pad (4-voice drone chord, LFO-modulated LPF) + sparse chimes every 0.9–4.5s
- Plants assigned to one of 4 frequency bands; growth rate = f(amplitude in that band)
- Flowers change color with current frequency energy (hue shifts with visualHueShift)
- Flower bloom triggers pollen burst + chime in plant's band octave
- Bloomed flowers pulse with beat + emit pollen while energy > threshold
- 4 scales (pentatonic / dorian / lydian / mixolydian)
- Click anywhere to plant a seed at that x
- Auto-plant every 5–14s once audio runs
- Frequency spectrum visualizer at bottom
- Procedural leaves + 2 petal shapes (round / teardrop) + stamens + halo
- Touch-friendly, responsive layout (700px breakpoint)

## issues
- Audio requires user gesture (▶ begin button) — unavoidable browser policy
- `fftSize 1024` gives 512 freq bins; the top ~30% is usually quiet with this synth palette, so band 3 (high freq) plants grow slower than band 0 — feels right but can feel "unfair" if all plants drop into band 3
- Trail fade via translucent fillRect costs a bit at high DPR; capped DPR to 2
- Pollen doesn't collide with stems/leaves — passes through. Fine for ambient feel.
- Chime setTimeout loop can drift if tab throttled; acceptable for ambient
- Very tall plants near screen bottom can have their flower overlap the bottom control bar — flowers float above it visually but not behind

## todos
- Volume slider (master gain)
- Chime rate slider
- More scale presets (Phrygian, whole tone, Japanese hirajoshi)
- Wind mode — sway intensity slider
- Seasons: hue palettes shift on a slow timer
- Record the audio + export wav
- Drag plants to move them
- Plant varieties (trees, vines, mushrooms)
- Let clicked seed inherit audio of current loudest band
- Daylight/night cycle with sun rising + setting
