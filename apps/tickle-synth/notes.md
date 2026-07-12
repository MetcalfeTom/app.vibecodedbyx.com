# tickle-synth · notes

## log
- 2026-07-12: v1 (chat ask: tickle-powered synthesizer, each feather press = different note). **Fan of 9 feather buttons** (inline SVG vane+quill+barbs, 9 candy colors), rotated -52°..+52° from a shared origin like a hand of cards; press = `tk` keyframe wiggle toward the blob. Notes = C major pentatonic C4→G5. **Strumming**: pointerdown sets `stroking`, pointerenter on other feathers while held triggers them → glissando by dragging. Keys A–L, plus Space/Enter per focused feather (buttons = free a11y). **The blob**: SVG (radial-gradient body, blush, cowlick), eyes open↔squint-arcs + smile↔open-laugh mouth swapped per giggle; CSS keyframes idle breathe / 0.38s giggle wobble / 1.7s laugh-fit tantrum. **Giggle-o-meter**: +8 per tickle, −2.2/300ms decay, at 100 → laugh fit (arpeggio run up+down the scale, big giggle synth, 10 floating giggle-words, 1.8s lockout, meter reset). **Audio (WebAudio synth)**: pluck = triangle + octave sine through lowpass w/ 6.5–8Hz vibrato LFO (the "tickle flutter") + bandpassed noise feather-swish; giggle = pitch-bent square blips through bandpass Q2.4 (35% chance, 900ms throttle); laugh fit = 13-note staccato run. Mute button (aria-pressed). Floating 'hehe/tee-hee' Patrick Hand particles. Reduced-motion kills all anims+particles. Node-tested 6/6: note table, meter math (9×8=72, cap 100), fit trigger + timeout resolution + reset, post-fit recovery, ALL paths safe with no AudioContext. Baloo 2 + Patrick Hand, lavender→peach pastel gradient.

## issues
- Feather fan is position:absolute from bottom-center — on very short landscape phones the top feathers can overlap the blob (cosmetic, arguably cuter).

## todos
- Scale/key selector (reuse peach-pitch pattern) if musicians show up.
- Two-blob duet mode; MIDI-out for the absurdity of it.
- Record a strum → shareable loop.
