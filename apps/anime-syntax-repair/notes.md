# anime-syntax-repair

## log
- 2026-05-08: shipped — code-repair puzzle game using `cat-milk/Anime-Girls-Holding-Programming-Books` images as round backdrops (chat asks bundled: "build a code-repair game using the Anime-Girls-Holding-Prog[ramming-Books]" + clarification "create a syntax-fixing game called Anime Syntax Repair using the cat-milk repository for backdrops"). 5 rounds per match, each round picks a random language + a random image from that language's folder + a random bug template, and asks the player to pick the correctly-fixed snippet from 4 options.
  - **Image source**: `cdn.jsdelivr.net/gh/cat-milk/Anime-Girls-Holding-Programming-Books@master/<Language>/<File>` — verified the gh-raw mirror serves the images directly with proper CORS. The repo is a public CC-BY meme archive of anime characters holding real programming books, organised one folder per language. We bake in 3-4 verified filenames per language (pulled via the GitHub contents API at design time) so there's no runtime API token / rate-limit risk; backdrop URL uses `encodeURIComponent` on the filename so any spaces in titles serve correctly. Filenames preloaded via `new Image()` so the backdrop fades in (`opacity 0 → 1 over 0.45s`) once the bytes arrive — no flash-of-broken-image on slow connections; on `onerror` the backdrop just stays dark and gameplay continues.
  - **6 languages × 3-5 puzzles each** (~24 hand-authored puzzles total): Python (5: missing-colon, =vs==, lambda arrow, for-colon, print-as-function), Javascript (4: unbalanced parens, missing closing brace, ===-as-assignment, missing block braces), C (4: missing semicolon, =vs==, header brackets, declaration semi), Rust (4: missing semi, return arrow, String semi, vec! semi), Ruby (3: missing end, block pipes, unmatched quote), Go (3: missing import, := vs =, function brace placement). Each puzzle has a `buggy` snippet, the canonical `fixed` version, **3 plausible-but-wrong distractors** (subtly off in different ways so the player can't blind-guess), and a one-line `hint` revealed after commit explaining the actual rule.
  - **Round flow**: 4 options shown as full corrected snippets (so you read all 4 and pick the actually-valid one); on click everything disables, the chosen tile gets correct/wrong styling, the actual correct one gets a green border regardless of pick, the buggy code panel rewrites itself to the green-bordered "FIXED" state, and the hint fades in below in lime/rose. Score: +200 per correct + 50/streak bonus capped at 6, -75 per wrong, streak resets on miss.
  - **Aesthetic**: deep ink-black bg with pink + cyan radial glows, Fraunces italic "anime · syntax · repair" masthead with pink accent, Press Start 2P language-strip overlay ("PYTHON · BOOK NO. 3") in retro arcade gold, JetBrains Mono everywhere else. Each round's image is the full-card backdrop (saturate 0.9, brightness 0.55) with a top-down dark gradient + screen-blend pink/cyan tint to keep the foreground code panel readable on top.
  - **Local leaderboard**: top 5 scores in `localStorage['anime-syntax-repair-leaderboard-v1']`, surfaced on the end-of-match overlay. Title varies by performance: PERFECT = "★ FLAWLESS COMMIT ★" (lime), 3/5+ = "CLEAN BUILD" (lime), <3 = "BROKEN BRANCH" (rose).
  - **Audio**: 3 Web Audio synths (correct = 3-note triangle arpeggio, wrong = 2-tone sawtooth, win = 5-note ascending fanfare). Lazy-init.
  - **Accessibility**: rem units, semantic `<header role=banner>`, `<section>` for the puzzle stage, `aria-live="polite"` on every HUD pill, `aria-label` on each option button, focus-visible outlines, ≥2.6rem touch targets, skip link.
  - **Credit + permalink**: each round shows the source filename underneath the language strip, linkified to the actual jsdelivr URL so the player can open the original image in a new tab. Footer links to the cat-milk repo so the meme archive gets a proper credit.

## issues
- Image filenames are baked in at design time, so if the upstream repo renames or removes a file the round will fall back to a dark backdrop. Could runtime-fetch the GitHub contents API at first launch + cache, but that risks hitting the unauthenticated rate limit (60/hr/IP).
- Only 6 languages currently. Easy to add more — each new language is one entry in `LANGUAGES` with images + bugs.
- Distractors are hand-authored; some might be too obviously wrong to advanced devs. Could add a "hard" difficulty later that uses subtler distractors (e.g. valid-syntax-but-different-semantics).
- No internationalization — bug hints are English only.
- Some images on the upstream repo have spaces in filenames; we URL-encode them but a few unusual characters could still 404. Errors are logged via the Image() fallback handler and the round just continues with a dark backdrop.

## todos
- More languages: TypeScript, Kotlin, Swift, Lua, Lisp, PHP, Java (all have content in the upstream repo and verified images via the API).
- Difficulty levels: easy = obvious bugs, hard = semantic bugs (off-by-one, wrong type, etc.).
- Daily challenge: fixed seed per UTC day so everyone gets the same 5 puzzles.
- Hint button (-50 score) that highlights the diff token in the buggy snippet.
- Code-themed font on the snippets (already JetBrains Mono — could swap to Fira Code for ligatures).
- Pollinations-generated explanations on lock — show a 1-paragraph "why" beyond the static hint.
