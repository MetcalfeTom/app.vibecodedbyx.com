# Headache Cure

## log
- 2026-04-22: Created. A quiet zen-garden canvas — rake patterns in warm sand, place smooth stones, each interaction emits a soft singing-bowl tone through a long gentle reverb. **Scene**: ~94vw × 84vh rounded frame with double shadow-rule outer border, inner radial top/bottom vignette, sand painted onto an offscreen canvas via vertical gradient (#efe2c3 → #e6d6b2 → #d9c69a) + warm radial highlight + per-pixel `(rand-0.5)*16` grain + scattered darker 0.3–1.5px flecks (density `W*H/1200`). Base is recomputed on resize. **Rake mechanic**: drag on sand builds an `activeStroke` of points (min 2px movement); on pointerup with totalMoved > 6px the stroke commits. Each committed stroke is drawn as 5 parallel tines, spacing 7×DPR, offset perpendicular to motion direction — each tine = darker 2.3px groove `rgba(120,92,52,0.42)` + 1.2px lighter highlight `rgba(255,246,220,0.38)` translated +1px. Groove shape responds naturally to curved drags. **Stones**: tap places a new stone (radius 14–36px, random 1-of-5 greyish-warm palettes with dark/mid/light triplet) drawn as: soft elliptical shadow below + radial-gradient body (light→mid→dark from upper-left) + white-warm specular highlight at ~30% upper-left. Tap existing stone removes it (ellipse hit-test in stone's local frame). All stones rotated by random angle. Ripples: short expanding circles, 1.2s life, ease-out, stroke `rgba(90,70,40,alpha)`. **Audio**: Web Audio `AudioContext` with 0.55 master + convolver reverb (2.6s exp-decay noise impulse, 0.38 wet send). Pentatonic scale (C4 D4 E4 G4 A4 C5 D5 E5 G5), note picked by y-position (higher on canvas = higher note). `gentleTone(freq, dur, vol)` = triangle + sine at 2.001× octave (22% gain) through 2400Hz lowpass, 15ms attack / exp decay to 0.001 over `dur`. Placing a stone plays the note (vol 0.18, 2.2s), removing plays octave-up shorter (vol 0.11, 1.4s), end of rake stroke plays half-freq (bass resonance). Rake-in-progress emits very soft bandpassed noise blips `softClick` (60ms, 1400–2200Hz random bandpass, rate-limited to ~11Hz, vol 0.028–0.08 scaled by move distance) for gentle grain sound. Smooth button plays descending G3+D4 pair and clears rake strokes (stones remain — "the sand gets smoothed"). **Breath guide**: tiny SVG circle in bottom-left pulsing 0.6↔1.0 scale + 0.4↔0.7 opacity on a 16s cubic-bezier cycle (≈4-4-4-4 box breathing), small italic "breathe" label below. **Ambient welcome**: first pointerdown unlocks audio and triggers a 3-note ascending chord (C-E-G) with 260ms delays at very low volume. **UI**: title "静 / headache cure / drag to rake · tap to place a stone" centered top, fades to 0.4 opacity and tagline vanishes 2s after first interaction. Footer "— take a breath —" letterspaced italic at page bottom. Two corner controls in garden: "smooth" button (italic serif, hairline border, backdrop-blur, tonal hover) and "◉ sound"/"○ sound" toggle. Cormorant Garamond italic + Shippori Mincho for the 静 character. Palette: warm sand #efe2c3 → #d9c69a, ink #4a4538, sage accent #7e8c7b, stones in muted warm greys.
- Pollinations OG image.

## features
- Drag to rake realistic multi-tine parallel grooves in sand
- Tap empty sand to place a smooth stone (each with unique palette + rotation)
- Tap existing stone to remove it
- Each action emits a soft pentatonic singing-bowl tone through a 2.6s convolver reverb
- Subtle grain-click sound during raking, scaled by velocity
- "smooth" clears rake strokes (keeps stones) with a gentle descending tone
- Sound toggle
- Breath guide (16s box-breathing circle pulse)
- Softly ambient welcome chord on first interaction
- Mobile-friendly: touch-action none on garden, responsive frame
- Auto-fading hint text

## issues
- Canvas buffer resize rebuilds the sand and loses existing stroke alignment relative to it (strokes stay in canvas coords, so they appear in the same place — OK unless window is drastically resized mid-session).
- Very rapid raking back-and-forth in the same spot builds up many overlapping dark strokes (intentional — looks like heavy raking).
- Stones are only removable by tapping directly, no "undo last" — keep the smooth button focused on sand.
- Noise grain rebuild on resize can flash briefly on very wide windows (~50ms).
- Ripple over stones blends — it's gentle, keeps the meditative feel.

## todos
- Stone drag-to-move (pointer-hold + move)
- Export PNG of current garden
- Ambient drone toggle (long sustained low pentatonic chord)
- Multiple rake widths (narrow / wide toggle)
- Bamboo + moss accents in corners (procedural)
- Time-of-day lighting toggle (dawn/dusk/night)
- Persist garden to localStorage
