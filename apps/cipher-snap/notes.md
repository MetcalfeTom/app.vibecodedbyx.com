# Cipher Snap

Bomb defusal mini-game. Match the glyph sequence on a 4x4 keypad whose symbols shuffle under a ticking clock.

## log
- 2026-04-10: Boss bombs every 5th wave — multi-sequence challenge (2+ sequences, scales with wave). Boss visual: pulsing red briefcase border, progress pips, alarm SFX, extra score/time on defuse. Added 6 new wire colors (coral/gold/ice/blood/neon/violet, total 20). Expanded glyph pool to ~100 symbols across 10 families (added Greek lowercase, more math ops, alchemical/esoteric). Added unlockable lore snippets: classified file fragments shown between even waves, 20 snippets cycling.
- 2026-04-10: Sequence is now (glyph, color) pairs — every step must match both the symbol and the wire color. Refactored state.keypadGlyphs → state.keypadSlots (array of {glyph, color}). buildKeypadSlots() seeds the keypad with required sequence pairs, ~55% chance per required slot of adding a same-glyph-different-color TRAP decoy, fills rest with unique random glyph+color pairs, then shuffles positions. Shift rebuilds using only the remaining sequence pairs so prior distractors re-roll. Sequence display colors each glyph by its wire. Overlay reframed as "decode the hidden code".
- 2026-04-10: Neon-wire keypad variants (red / blue / green / amber).
- 2026-04-10: Initial build. 4x4 keypad rendered from a 45-glyph pool of Greek/math/occult symbols. Each wave: grow sequence length (3 + floor(wave/2), capped at 7), shuffle a fresh keypad that always contains the sequence glyphs. Shift interval tightens per wave: max(1600, 4200 - wave*200) + random jitter 400-1200ms. Wrong tap: -4s, red shake, immediate re-shift as punishment. Correct tap: score += 10 + wave*2, next glyph highlighted. Full sequence = defuse → +6s (capped at 90), +50+wave*10 bonus, wave advances. Timer starts at 90s, pulse-warns under 10s with per-second tick beeps. WebAudio SFX for tick/correct/wrong/defuse/explode/shift. Keyboard shortcuts 1-4, Q-R, A-F, Z-V for grid slots. Overlay start/end screen with defused/score/waves stats. Major Mono Display + VT323 + Share Tech Mono typography, deep amber/blood-red CRT briefcase aesthetic with vignette + scanlines.

## features
- 4x4 keypad that shuffles on a timer AND after every mistake
- Growing sequence length per wave
- Shift interval tightens per wave
- Time bonus on defuse (capped) + time penalty on mistap
- Full keyboard fallback (1-4/QWER/ASDF/ZXCV)
- WebAudio tick/defuse/explode SFX
- CRT briefcase aesthetic with scanlines + vignette + glow

## issues
- No leaderboard yet
- Keyboard shortcut mapping only works for fixed 16-slot grid (fine for now)
- Sequence length caps at 7 — could go higher for hardcore waves

## todos
- Supabase leaderboard (score + waves + defused)
- Special wires module (cut the right color based on a clue) as alt challenge type
- OG preview PNG
