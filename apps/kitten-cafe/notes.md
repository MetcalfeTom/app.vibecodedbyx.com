# Kitten Cafe

A cozy cafe with kittens, lo-fi music, and purring. Come relax.

## log
- 2026-03-16: Initial build. Warm cafe scene with interactive kittens. 8 kitten color palettes (Ginger, Smokey, Cream, Shadow, Peach, Silver, Biscuit, Cinder) with body/ear/stripe/nose colors. 16 cute names (Mochi, Latte, Bean, etc.). Canvas-drawn kittens with: ellipse body, round head, triangular ears with inner pink, tracking pupils (follow mouse), whiskers, nose triangle, tail with sine wag, paw bob walk cycle, stripe overlay. 3 states: idle (wander), follow (chase mouse), sleep (curled up with Zzz). Click kitten to pet — heart particles burst, ear wiggle, happiness boost, purr text. Treats button drops food that kittens walk to and eat. Depth-sorted rendering. Lo-fi music generator: warm sine pad chords (4 chord loop), soft sine kick drum, highpass noise hi-hats. Purr audio: sawtooth 26Hz with sine LFO modulation, lowpass filtered. Mew sound on add/eat. Cafe scene: warm gradient background, sunlight beam, window with cross panes, coffee mug with steam particles, floating dust motes. Up to 12 kittens. Caveat + Nunito typography, warm cafe palette.

## issues
- None yet

## todos
- Yarn ball toy that kittens bat around
- Cat bed furniture (kittens prefer sleeping there)
- Cafe menu decorative element
- Rain on window mode (cozy rain sounds)

## notes
- No database — pure frontend
- 8 palettes, 16 names, randomly assigned
- Kitten states: idle (wander 120-300f), follow (track mouse 120-240f), sleep (curled 300-600f)
- Follow trigger: 40% chance when mouse within 200px during idle state change
- Movement: acceleration toward target * 0.08, damping 0.92, speed 1.2 follow / 0.4 idle
- Eyes: white ellipse + dark pupil + white shine, pupil offset = (mouse-pos)*0.01
- Tail: sine(tailPhase) * 15 degrees wag, quadratic bezier curve
- Lo-fi: 4 sine chord changes (C/Dm/Bm/C#) at 4s intervals, sine kick 500-750ms, noise hat 250-500ms
- Purr: sawtooth 26Hz + sine LFO 26Hz → lowpass 200Hz, gain 0.04
- Hearts: 3 per pet, rise with slight drift, fade over 50-80 frames
- Steam: 8% spawn rate, rise from mug position, expand + fade
- Dust: 3% spawn, slow drift with sine wobble, 200-400 frame life
- Happiness: +15 per pet, +20 per treat, -0.005/frame decay
