# Scream Board (Meow Board)

## log
- 2026-03-28: V1 — Built as Scream Board with 16 procedural animal sounds. Immediately converted to Meow Board with 16 cat meow variations. WebAudio procedural synthesis: sawtooth/triangle oscillators with bandpass formant filters for cat-like timbre, LFO vibrato, noise buffer for hiss. Bangers + Fira Code typography, pink/neon palette. 4-col grid (3 on mobile), volume slider, touch support.

## features
- 16 procedural cat sounds: Short Mew, Long Meow, Angry Yowl, Kitten Mew, Purr, Hiss, Chirp, Trill, Demand Meow, Sleepy Mrrp, Chatter, Wail, Double Mew, Deep Meow, Sassy Mrow, Zoomies
- All sounds generated with WebAudio oscillators + bandpass formant filters (no audio files)
- Neon grid with per-button color via CSS custom property --clr
- Flash animation on button press
- Volume slider
- Touch + click support with AudioContext resume on interaction
- Responsive: 3 columns on small screens, 4 on larger

## issues
- None currently

## todos
- Add recording/loop mode to layer multiple meows
- Random meow button
- Cat face animation that reacts to sounds

## notes
- catFilter() helper creates bandpass filter for cat-like formant shaping
- Purr uses low 28Hz sawtooth with 25Hz amplitude modulation
- Hiss uses white noise through highpass filter at 3000Hz
- Chatter uses rapid 8-burst square waves for teeth-chattering effect
- URL is still /scream-board/ even though title is Meow Board
