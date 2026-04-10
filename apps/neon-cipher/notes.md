# Neon Cipher

Crack shifting codes before time runs out.

## log
- 2026-04-10: Added Scytale transposition cipher (now 9 total). Text wrapped around a cylinder of size 2-5, read across bands. Unlocks at wave 10. Re-rolls cylinder size on shift timer.
- 2026-04-10: Added Rail Fence and Columnar transposition ciphers (now 8 total). Rail Fence zigzags letters across 2-4 rails, reads row by row. Columnar writes into rows of 2-5 columns, reads column by column. Both scale rail/column count with wave. Re-encrypt on shift timer re-rolls rail/column count. Rail Fence unlocks at wave 7, Columnar at wave 10.
- 2026-04-10: Initial build. 6 cipher types progressively unlocked: Caesar (shifting offset), Reverse, Atbash (alphabet mirror), Skip (positional rearrange), Vigenere (key-based shift), Pair Swap (adjacent letter swap). 155 words across 5 length tiers (3-7 letters), scaling with wave. Cipher shift timer — encrypted text re-encrypts with new parameters when bar depletes, getting faster each wave. Wrong letter = -2s penalty. Hint system reveals letters at -5s cost. Score = base 50 + wave×10 + streak×15 + time/3. Solve = +5s + wave/3 bonus time (capped 90). Keyboard with used-letter coloring (correct=cyan, wrong=dim). 10 Vigenere keys. Streak tracking. Chakra Petch + Azeret Mono typography, dark neon cyan/pink/gold aesthetic.

## features
- 9 cipher types (Caesar, Reverse, Atbash, Skip, Vigenere, Pair Swap, Rail Fence, Columnar, Scytale)
- Progressive cipher unlocking (new types every few waves)
- Cipher shift timer — code re-encrypts periodically
- 155 words across 5 length tiers
- Word length scales with wave (3→7 letters)
- Shift interval tightens per wave (18s → 6s)
- Wrong letter penalty (-2s)
- Hint system (reveals letters, costs 5s)
- Streak bonus scoring
- Keyboard with letter usage tracking
- Physical keyboard support
- WebAudio SFX
- Mobile-friendly on-screen keyboard

## issues
- No leaderboard
- Skip cipher can produce confusing rearrangements
- Vigenere key shown in hint might be too easy

## todos
- Supabase leaderboard
- More cipher types (ROT13, Morse, Playfair)
- Daily challenge mode
- Visual cipher wheel animation
- OG preview PNG
