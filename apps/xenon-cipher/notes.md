# Xenon Cipher

Decode alien symbol transmissions into numbers against the clock.

## log
- 2026-04-10: Initial build. 10 unique glyph sets (geometric, planetary, runic, Vai, Tifinagh, etc.), each randomly mapped to digits 0-9. Cipher puzzles grow from 4→12 symbols. Codex panel tracks decoded mappings. Timer countdown with -3s penalty on wrong guess. Streak bonus multiplier (up to 3x). Time bonus on level complete. New glyph alphabet every 2 levels. Free reveal hint on early levels. Keyboard (0-9, arrows) + tap controls. Best score localStorage. Orbitron + Share Tech Mono typography, deep space cyan/green terminal aesthetic with CRT scanlines.

## features
- 10 alien glyph alphabets (geometric, planetary, runic, Vai, Tifinagh, Old Italic, etc.)
- Cipher puzzles that grow with level (4→12 symbols)
- Codex panel showing decoded symbol→digit mappings
- Timer with escalating pressure (45s→20s)
- -3 second penalty on wrong guess
- Streak multiplier (1x/2x/3x) on consecutive correct
- Time bonus for fast solves
- Free hint reveals on early levels
- New alphabet every 2 levels
- Keyboard + touch numpad controls
- CRT scanline overlay
- Best score in localStorage

## issues
- Some glyph sets may not render on all devices/OS
- No difficulty selector

## todos
- Supabase leaderboard
- Difficulty modes (more/fewer starting reveals)
- Multi-digit answers for harder levels
- Glyph animation effects on decode
- OG preview PNG
