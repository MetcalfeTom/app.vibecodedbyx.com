# Heartbeat Sim

A glowing anatomical heart that beats. Feel the rhythm.

## log
- 2026-03-16: Initial build. Fullscreen canvas anatomical heart drawn with bezier curves — left/right ventricles, atria, aorta arch, pulmonary artery, vena cava stubs, coronary arteries, ventricle divide. Radial gradient fill (highlight to dark), specular highlight, pulsing glow. Double-pump beat animation (lub-dub): 12% scale at 0-8% phase, 7% scale at 12-20% phase. Lub-dub audio: sine oscillators at 55→30Hz (S1) + 70→40Hz (S2) with sub-bass layer, lowpass filtered. 4 preset states: Rest (72bpm), Exercise (140bpm), Panic (180bpm), Deep Calm (55bpm). Manual BPM slider 40-200. ECG waveform with PQRST morphology, scanning display with grid. Blood burst particles on each beat (12 per beat, decelerate). Vein pulse rings that expand outward. Ambient background glow pulses with beat. Click heart for manual beat. BPM display with state label. Playfair Display + IBM Plex Mono typography, deep red/dark palette.

## issues
- None yet

## todos
- Heart rate variability (subtle random BPM fluctuation)
- Arrhythmia mode (irregular beats, abnormal ECG)
- Breath sync (inhale/exhale affects BPM)
- Blood pressure readout

## notes
- No database — pure frontend
- Heart shape: 10+ bezier control points for anatomical accuracy
- Beat timing: performance.now() / beatInterval for phase, double-bump envelope
- Audio: S1 = sine 55→30Hz + sub 35Hz, S2 = sine 70→40Hz, 120ms delay between
- ECG PQRST: P(0-10%), flat(10-15%), QRS(15-25%), ST(25-35%), T(35-50%), baseline(50-100%)
- ECG scan: circular buffer of 300 samples, scan line erases ahead
- Blood particles: 12 per beat, radial burst, decelerate 0.96x/frame
- Vein pulse: ring expands from heart center to 70% screen, fades over 40 frames
- BPM lerp: 0.02 per frame toward target for smooth transitions
- Heart glow: shadowBlur scales with beat scale, 30-60px range
