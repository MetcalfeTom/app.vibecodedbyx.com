# Base 7½

Decompose numbers using base 7.5 — a fractional positional number system with extended digit glyphs.

## log
- 2026-04-11: Changed glyphs for digits 10-14 from Greek letters to upside-down numerals: flipped 2=10, flipped 3=11, flipped 4=12, flipped 5=13, flipped 6=14. Uses CSS `transform:rotate(180deg)` on inline spans. Picker buttons show flipped glyph + "=N" label. Position boxes use flipped spans. Text-only contexts (breakdown, skip) use combining overline as hint. Updated how-to-play with inline flipped demos.
- 2026-04-11: Extended digits to 0-14 with custom Greek glyphs (now replaced by flipped numerals). Extended digits shown in purple (--half color), picker shows glyph + numeric value for 10+.
- 2026-04-11: Initial build. Fractional base (7.5) decomposition puzzle. Positions are powers of 7.5 (1, 7.5, 56.25, 421.875...). Targets are generated to be exactly representable. Greedy conversion algorithm. 4 difficulties: Easy (2-55, 2 positions), Medium (15-400, 3 positions), Hard (60-3000, 4 positions), Expert (500-25000, 5 positions). Click-to-place interface with real-time breakdown. Newsreader + JetBrains Mono typography, deep purple/blue aesthetic with radial gradients.

## features
- Fractional base 7.5 number system
- 15 digits (0-14) with upside-down numeral glyphs for 10-14 (flipped 2-6)
- Greedy decimal→base-7.5 conversion
- Guaranteed solvable targets
- Real-time breakdown with glyph notation
- 4 difficulty levels
- Keyboard input (0-9 directly)
- Streak tracking with localStorage

## issues
- Keyboard can only select digits 0-9 (no shortcut for 10-14 yet)
- Floating point rounding handled but edge cases possible

## todos
- Keyboard shortcuts for extended digits (e.g. shift+0..4 for 10-14)
- Timer mode
- Supabase leaderboard
- Sound effects
- OG preview PNG
- Tutorial animation for first-time players
