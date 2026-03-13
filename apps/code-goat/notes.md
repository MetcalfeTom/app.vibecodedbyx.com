# Code Goat

Digital pet goat that eats code snippets and grows based on syntax complexity.

## log
- 2026-03-13: Initial build. Canvas-drawn goat with body, legs, tail wag, ears, eyes (blink + mood colors), beard (grows with level), horns (appear at level 3+). Code analysis scores: nesting depth, paren depth, keyword count, line count, char count, modern syntax, regex, language bonuses (Rust = favorite, HTML/CSS = indigestion). 10 levels with size names (Tiny to Absolute Unit). Goat grows physically with level via scale. Chewing animation, gas clouds for bad code, heart particles for gourmet code, speech bubbles. Meal history log. Gaegu + Fira Code typography, warm paper/brown palette.

## issues
- None yet

## todos
- Save goat state to localStorage
- More visual evolution (color changes, accessories at high levels)
- Code snippet gallery of best meals
- Multiplayer goat comparison

## notes
- No database — pure frontend pet sim
- Code scoring: nesting depth (up to +20), keywords (up to +18), modern syntax (+5), regex (+7), Rust bonus (+8), HTML penalty (-2), CSS penalty (-3)
- Verdicts: gourmet (40+), tasty (20+), decent (10+), bland (5+), terrible (<5)
- 10 levels, XP required scales: 50, 80, 120, 180, 260, 360, 500, 700, 1000, 1500
- Goat scale: 1.0 + (level-1) * 0.15
- Horns appear at level 3, beard grows from level 2
- Language detection: python, rust, go, javascript, typescript, java, html, css, sql
