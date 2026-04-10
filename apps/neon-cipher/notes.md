# Neon Cipher

Crack shifting codes before time runs out.

## log
- 2026-04-10: Initial build. 6 cipher types progressively unlocked: Caesar (shifting offset), Reverse, Atbash (alphabet mirror), Skip (positional rearrange), Vigenere (key-based shift), Pair Swap (adjacent letter swap). 155 words across 5 length tiers (3-7 letters), scaling with wave. Cipher shift timer — encrypted text re-encrypts with new parameters when bar depletes, getting faster each wave. Wrong letter = -2s penalty. Hint system reveals letters at -5s cost. Score = base 50 + wave×10 + streak×15 + time/3. Solve = +5s + wave/3 bonus time (capped 90). Keyboard with used-letter coloring (correct=cyan, wrong=dim). 10 Vigenere keys. Streak tracking. Chakra Petch + Azeret Mono typography, dark neon cyan/pink/gold aesthetic.

## features
- 6 cipher types (Caesar, Reverse, Atbash, Skip, Vigenere, Pair Swap)
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
- More cipher types (Rail Fence, ROT13, Morse)
- Daily challenge mode
- Visual cipher wheel animation
- OG preview PNG
