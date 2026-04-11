# Lexi-Void

High-stakes word game — tiles crumble if you don't use them fast enough. 10 rounds.

## log
- 2026-04-11: Initial build. 9-tile rack with 18s decay timers, click-to-place word building, ~2500 word dictionary, Scrabble-style letter values + length bonuses. 10 rounds — round ends when all tiles decay. Keyboard support (type letters, Enter=submit, Backspace=undo, Space=shuffle). Decay bars go green→gold→red. Wrong guess penalty (-2s per tile). Word history panel. Instrument Serif + DM Mono typography, dark void/gold aesthetic.

## features
- 9-tile rack with visible decay timers
- Click or type to build words
- ~2500 valid English words
- Scrabble letter values + length bonus
- 10 rounds with auto-advance
- Shuffle rack button
- Clear/undo controls
- Decay bar (green→gold→red→dead)
- Wrong guess accelerates decay
- Word history panel
- Keyboard: type letters, Enter, Backspace, Space

## issues
- Dictionary is limited (~2500 words)
- No difficulty settings

## todos
- Larger word list
- Supabase leaderboard
- Power-ups (freeze tile, extra time)
- OG preview PNG
