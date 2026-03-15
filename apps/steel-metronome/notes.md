# Steel Metronome

A brutalist metronome forged from steel and concrete. Keep time like an industrial machine.

## log
- 2026-03-15: Initial build. Canvas-drawn steel pendulum with metallic gradient needle, counterweight, and sliding weight position. Scale markings at BPM intervals. Pivot hub with concentric circles. BPM slider (40-240) with tempo marks (Grave through Presto). Metal BPM number display via background-clip gradient. 5 time signatures (4/4, 3/4, 6/8, 5/4, 7/8) with beat dot indicators. Tap tempo averaging last 6 taps. Accent toggle for first beat emphasis. Beat flash effect (radial gradient pulse). Web Audio: triangle wave tick (600Hz normal, 800Hz+2400Hz accent) + noise click. SVG feTurbulence concrete textures, 4 corner rivets. "STEEL TEMPO INDUSTRIES MODEL ST-1200" branding. Inter Tight 900 + IBM Plex Mono typography. Space bar toggle, full keyboard support.

## issues
- None yet

## todos
- Subdivision options (eighth notes, triplets)
- Visual beat counter / measure counter
- Polyrhythm mode
- Swing/shuffle feel
- Preset tempos for common pieces

## notes
- No database — pure frontend
- Canvas pendulum: metallic gradient (#999→#ddd→#fff→#ddd→#888), counterweight at top
- Weight position: lerp from 0.35 (fast) to 0.75 (slow) based on BPM
- Tick audio: triangle 600Hz 0.08s (normal), triangle 800Hz+2400Hz 0.1s (accent)
- Noise click: 0.03s filtered noise burst on every beat
- Tap tempo: stores last 6 tap intervals, averages them, clamps 40-240
- Pendulum: sin(phase) swing, phase increments by BPM-derived rate per frame
- Beat flash: radial gradient from gold/amber, fades over 0.3s
