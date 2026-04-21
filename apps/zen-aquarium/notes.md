# Zen Aquarium

## log
- 2026-04-21: Created. Ambient fullscreen aquarium of procedurally generated neon jellyfish. Each jelly: random size (34–104), bell width/height ratios, 4–8 long tentacles, 3–5 oral arms, 6–13 underside frills, 7-hue palette (cyan/magenta/violet/aqua/rose/cobalt/jade), random chime frequency, slow pulse rate 0.24–0.38 Hz. **Pulse animation**: on each pulse tick, bell contracts (width×1.18, height×0.78) and gains +10+size×0.16 upward velocity — then drifts back down under 3.4 gravity. Between pulses body smoothly rebounds via squash/contract curves. Bell drawn with radial gradient (light center → darker edge → transparent), soft underglow, inner ribbon organs (additive blending), frill wave along underside, highlight arc. Tentacles use additive blending too — sway via `sin(phase + k*3.4)` * amplitude scaling with k, with per-tentacle hue offset and glow. **Environment**: deep navy/cobalt gradient bg, moving radial caustic highlights, drifting plankton particles (~0.25/(min W,H)), translucent `rgba(2,4,20,0.22)` overlay each frame for motion smear, vignette, corner title in Cormorant Garamond (letter-spacing 0.28em). **Interactions**: click to summon a jelly (max 18, oldest culls) with chime + bubbles + ripple, cursor repels jellies gently within 140px, Space = global ripple + kicks all jellies to pulse, R = reseed. Wrap horizontally; loop vertically. Jellies drift toward random targetX, re-pick on proximity. **Audio**: 4-voice drone chord (55/82.4/110/164.8Hz, sine+triangle through lowpass 420Hz, each with slow detune LFO 0.05–0.14Hz) at 0.35 master; sparse bell chimes (1s fade-in, exp-decay, pentatonic-ish freqs) triggered by pulse at 6% probability. Ambience toggled via button; mute by default.
- Pollinations OG image.

## features
- Procedural jelly generator (size/bell ratios/tentacle count/hue/chime)
- Slow bell pulse with thrust + gravity physics
- Additive-blended tentacles with per-strand hue offsets
- Ambient 4-voice drone with detune LFOs + sparse bell chimes
- Cursor-repel for gentle interaction
- Click-to-summon with bubble burst + ripple
- Space = mass pulse / R = reseed
- Motion smear + caustics + plankton + vignette

## issues
- Very high jelly counts can slow mobile GPUs due to additive blending + shadow blur. 18-jelly cap helps.
- Audio drone kept off by default (autoplay policy + intrusiveness). Button must be tapped.
- Chime notes are not strictly harmonically aligned to the drone — may want a snap-to-scale pass.

## todos
- Depth layers (foreground/background parallax)
- More creatures: slow anemone, bioluminescent plankton clouds, shrimp silhouettes
- Breathing-guide overlay (4-7-8 pattern sync to a designated jelly)
- Save a snapshot as PNG
- Color theme switcher (arctic/hot spring/abyss)
