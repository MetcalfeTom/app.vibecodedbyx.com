# Snore Synth

## log
- 2026-04-21: Created. Ambient-pad typing synth. Each keystroke plays a dreamy FM-ish pad (triangle carrier + sine modulator at 1.5×freq, 0.18freq index), through 300→1400Hz swept LP filter, +soft sub sine at freq/2, amp envelope 0.25s attack → 2.6s exp-release. Keys A..Z map to scale-degree + octave via `idx = |code - 97|` → `sd = idx % scaleLen`, `oct = floor(idx / scaleLen)`, midi = `48 + root + scale[sd] + oct*12`. Shift raises +12. Root/scale chosen from dropdowns (C/D/E/F/G/A/Bb × pent maj/pent min/dorian/lydian/phrygian/whole). **Space** triggers a low sine drone hit (midi 36 + root, 4s decay). **Enter** fires a 3-note arpeggio chime (scale degrees 0/2/4 one octave up, 110ms apart). **Backspace** plays a bandpassed noise wash (2.2kHz Q=0.5, 0.55s decay) and removes last char from on-screen text. **Wet bus**: 0.42s delay with 0.45 feedback → 2.8kHz LP filter → convolver with 3.2s noisy impulse (exp-decay × 0.3 sine modulation). Wet sends from pads (0.6), drone hits (0.8), chimes (0.7), noise (0.8). **Drone layer**: 4-voice chord (55/82.4/110/164.8 Hz, sine + triangle through 580Hz LP Q=1, per-voice slow detune LFO 0.04–0.11Hz), fade-in over 2.5s when first audio inits, toggle-able. Compressor at -16/5:1 before destination. **Visuals**: full-page canvas with fade-trail (0.13 alpha dark overlay per frame). Orbs spawn at y-mapped-by-pitch (midi 48–68 → bottom-to-top), radial gradient bloom (grows then shrinks via `sin(k·π)`), drift with light gravity + damping, color cycled from 6-color neon palette indexed by midi%12. Each keystroke also: ripple (expand at 260px/s, 1.6s life), falling DotGothic16 character (3.5–5s life, rotation + gravity). Background: 120 slow-drifting stars with twinkle. HUD: Unica One title with floating "zZz" keyframe animation, DotGothic16 typed-text board (last 120 chars + blinking caret), WPM/key counters (6s window × 60/5 conversion), scale/root pills, drone/mute toggles. Palette: dark indigo bg (#02010d→#0a0626→#180a3a) with pink #ffb3f0 / cyan #b3ffe7 / violet #c9a7ff / amber #ffd59a accents. Unica One + DotGothic16 + Syne Mono typography.
- Pollinations OG image.

## features
- Playable ambient synth via any keyboard
- Scale + root selector (7 roots × 6 scales)
- Always-on drone bed with per-voice detune LFOs (toggle)
- Delay + long reverb bus for every hit
- Pitch-mapped orbs (lower notes sit lower on screen)
- Floating typed characters + ripples
- WPM/keystroke counters
- Shift = octave up, Enter = chime, Space = drone hit, Backspace = noise wash

## issues
- Fast typers generate dense voice stacks — compressor handles most, but sustained mash can still get loud; mute button clears it.
- Caps Lock state not detected — only live Shift modifier.
- Punctuation/space mapping is deterministic by charCode difference — `;` and `'` fall above the standard range but still produce audible notes.
- Audio requires a keypress to initialize (user-gesture policy).

## todos
- MIDI-in support
- Record last 8s and loop toggle
- Per-key velocity from hold duration (keyup detection)
- Preset save (root+scale+drone state) to localStorage
- Share export: 10s WAV render of last session
- Visualizer mode: switch orbs for lissajous or particles-as-physics
