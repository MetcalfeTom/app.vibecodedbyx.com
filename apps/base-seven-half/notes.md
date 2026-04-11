# Base 7½

Decompose numbers using base 7.5 — a fractional positional number system with extended digit glyphs.

## log
- 2026-04-11: Extended Argam SVG glyphs to ALL 15 digits (0-14). Complete alien numeral system: nil(0)=ellipse, un(1)=flagged stroke, bi(2)=wave, tri(3)=double bump, tet(4)=angle+vertical, pent(5)=hooked bowl, hex(6)=downward spiral, sept(7)=angled bar, oct(8)=figure-eight, non(9)=upward spiral, plus existing dek/el/doh/gro/quin. All rendered as SVG path elements via argamSVG(). Picker shows glyph + decimal value for every digit. Position boxes use SVGs uniformly.
- 2026-04-11: Added SVG Argam glyphs for digits 10-14. 5 hand-crafted paths: dek(10)=reversed-2, el(11)=reversed-3, doh(12)=cross, gro(13)=diamond, quin(14)=zigzag. (Now expanded to all 15 digits.)
- 2026-04-11: Initial build. Fractional base (7.5) decomposition puzzle. Positions are powers of 7.5 (1, 7.5, 56.25, 421.875...). Targets are generated to be exactly representable. Greedy conversion algorithm. 4 difficulties: Easy (2-55, 2 positions), Medium (15-400, 3 positions), Hard (60-3000, 4 positions), Expert (500-25000, 5 positions). Click-to-place interface with real-time breakdown. Newsreader + JetBrains Mono typography, deep purple/blue aesthetic with radial gradients.

## features
- Fractional base 7.5 number system
- Complete 15-digit Argam glyph system (0-14), all custom SVG stroke art
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
