# Marble Melodies

## log
- 2026-04-21: Created. Canvas-based generative music toy — click to drop a neon marble, drag to draw a glowing musical platform. Each bounce triggers a note (triangle + 2 sine harmonics, plucky 1.4s exponential decay, stereo-panned by x, dry+convolver wet bus with 2.6s impulse-response reverb). Continuous-collision-ish: project marble onto segment line, check `dist < radius`, reflect velocity with 0.74/0.78 damping, only trigger note when approach velocity (`dot < 0`) and 45ms debounce per platform. Marbles respawn above screen when falling off (infinite generative loop), capped at 14. Particle burst on each bounce scales with impact velocity. Trail = 16-point marble history with fading alpha + shrinking radius.
- **Pitch mapping**: platforms higher on screen → higher octaves (yRatio → octaveBase 3–5.2). Scale degree picked randomly; 8 scales (pentMaj, pentMin, dorian, lydian, phrygian, blues, wholetone, hirajoshi); 12 roots. Platform hue = (degIdx / scaleLen) * 300 + (midi%12)*5.
- **Controls**: Scale/Root/Gravity/Auto/Preset/Clear ○/Reset. Right-click on a platform (within 22px) removes it. Keyboard: Space = drop marble, C = clear marbles, P = preset, A = toggle auto-drop.
- **Preset**: 5 horizontal bands of sloped platforms across the canvas, 2–3 per band, plus 3 seed marbles.
- Audiowide (title) + Space Mono (controls) + JetBrains Mono (body), deep-violet background with pink/cyan radial gradients.
- Pollinations OG image.

## features
- Interactive physics with ball-segment collision + reflection
- 8 musical scales × 12 roots
- Real-time bounce → note synth with reverb
- Auto-drop mode for hands-off generative
- Particle bursts per bounce, glow pulse on platform for 650ms
- Marble trail; infinite respawn

## issues
- Two very-close platforms can cause rapid re-bounces; 45ms debounce throttles sound but visuals still show the jitter.
- Particle count scales with strength — long cascading bounces can briefly spike particles (still bounded by life decay).
- No swipe-to-delete on mobile (right-click only removes). Long-press could be added if users ask.

## todos
- Long-press to remove platforms (mobile)
- Per-platform scale lock + pitch quantize
- Save/load compositions to localStorage
- Record + export WebM
- Platform shape variants: curved / elastic / teleport
