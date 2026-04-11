# Base 7½

Decompose numbers using base 7.5 — a fractional positional number system with extended digit glyphs.

## log
- 2026-04-11: Replaced all previous glyph systems (Greek letters, flipped numerals, Unicode shapes) with custom SVG Argam glyphs. 5 hand-crafted SVG paths in 20×28 viewBox: dek(10)=reversed-2 curve, el(11)=reversed-3 bumps, doh(12)=cross with hooks, gro(13)=diamond with stroke, quin(14)=zigzag lightning. Rendered via argamSVG() function creating SVG DOM elements with stroke-based paths. Used in both picker buttons and position boxes. Text fallbacks use names (dek, el, doh, gro, quin).
- 2026-04-11: Initial build. Fractional base (7.5) decomposition puzzle. Positions are powers of 7.5 (1, 7.5, 56.25, 421.875...). Targets are generated to be exactly representable. Greedy conversion algorithm. 4 difficulties: Easy (2-55, 2 positions), Medium (15-400, 3 positions), Hard (60-3000, 4 positions), Expert (500-25000, 5 positions). Click-to-place interface with real-time breakdown. Newsreader + JetBrains Mono typography, deep purple/blue aesthetic with radial gradients.

## features
- Fractional base 7.5 number system
- 15 digits (0-14) with custom SVG Argam glyphs for 10-14
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
