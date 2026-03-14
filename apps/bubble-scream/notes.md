# Bubble Scream Sort

Watch numbers scream in terror every time they get swapped. Sorting has never been this traumatic.

## log
- 2026-03-14: Initial build. Bubble sort visualizer with expressive faces on each bar. 4 face states: neutral, worried (pre-sort), scream (during swap with jittering, open mouth, sweat drops, teeth), happy (sorted in place). Bars shake and bounce on swap. Web Audio screams — dual oscillator (sawtooth+square) with pitch tied to bar value. 30 unique scream texts float above bars on swap. Scream log in top-right corner. Chaos mode adds screen shake, particles, and static noise. 4 array sizes (15/30/50/80). Speed slider. Bars animate smoothly to new positions. Sorted bars turn green with celebration text. Victory jingle on completion. Creepster + Silkscreen typography, hot pink/orange/yellow gradient palette on dark background.

## issues
- None yet

## todos
- Other sorting algorithms (quicksort, merge sort, selection sort)
- Sound volume control
- Scream intensity based on how far the number moves
- Reverse sort (numbers scream with joy going home)

## notes
- No database — pure frontend
- Generator-based sort stepping for controllable animation speed
- Bars find their previous visual state by value during syncBars
- Scream audio: sawtooth + square oscillators, base freq 200 + val*15
- Shake decay: 0.88 per frame, shakeY decay: 0.85
- Speed control: delay = max(1, 101-speed) frames between steps
- Chaos mode: screen shake, explosion particles, bg static noise
