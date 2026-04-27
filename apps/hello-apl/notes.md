# hello-apl

## log
- 2026-04-27: Created. **Minimalist APL hello-world** — APL's hello-world is just the literal `'Hello, World'` (the system evaluates and prints the expression). Hero panel centers the glyph-set string in indigo blue with corner `·` flourishes, italic Cormorant subtitle "a string. APL evaluates it. APL prints it." **REPL panel** shows `␣` placeholder; **⎕ evaluate** button shows the source rose-pink for 380ms then settles to `Hello, World` in ink; **try the array way** button shows `⎕UCS 72 101 108 108 111` (the Unicode-codepoint construction) before resolving to `Hello`. **Glyph glossary** card with 8 common APL glyphs (⍳ iota, ⍴ rho, ⌽ reverse, ∘ jot, ⍺ left arg, ⍵ right arg, ⎕ quad, ← assign) each with one-line description. **Aesthetic**: deep navy-indigo `#0c1422` bg with indigo+gold radial glows, Cormorant Garamond italic brand "hello, *apl*" + APL386 glyph swash `⍺⍵⍳`, IBM Plex Mono body, gold accents. Footer creed (italic Cormorant): "one line of APL is worth a thousand of C — but only if you can read it." Pollinations OG.

## issues
- **APL386 font**: Google Fonts hosts APL386 specifically for APL glyph rendering. Falls back to IBM Plex Mono if the font fails to load — most APL glyphs still render via Unicode but with less typographic personality.
