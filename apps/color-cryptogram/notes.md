# Color Cryptogram

Decode hidden words and phrases where each letter is represented by a unique color block.

## log
- 2026-04-11: Initial build. Each unique letter gets a distinct HSL color via golden angle distribution. 3 modes: Words (single words like "symphony", "labyrinth"), Phrases (idioms like "break the ice"), Quotes (famous sayings). Guess a letter correctly and ALL instances fill in automatically. Color key panel tracks decoded vs unknown letters. 3 hints per puzzle. Arrow key/tab navigation between inputs. Wrong guesses flash red and shake. Syne Mono + DM Sans typography, deep void/pink accent aesthetic.

## features
- Unique color per letter (golden angle HSL for max distinction)
- 3 puzzle modes: Words, Phrases, Quotes
- ~80 words, ~40 phrases, ~20 quotes
- Auto-fill all instances when one letter decoded
- Color key reference panel with revealed/unknown states
- 3 hints per puzzle (reveals random unknown letter)
- Arrow key + tab navigation
- Wrong guess shake animation
- Streak tracking + stats persistence

## issues
- Some similar hues possible with many unique letters (26 max)
- No difficulty settings

## todos
- Timed mode
- Custom puzzle input
- Supabase leaderboard (fastest solve time)
- OG preview PNG
- Category hints (e.g. "this is a noun")
