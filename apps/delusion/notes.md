# Delusion

## log
- 2026-07-31 v1: chat asked for "*Delusion*, a game where the host lies and the screen cracks with every missed truth". A gaslighting parlor game: an elegant unreliable HOST (breathing gold eye, typewriter voice, EB Garamond italic) reads 20 statements from a 44-entry bank (22 true / 22 false, all real verifiable trivia — honey never spoils, Napoleon wasn't short, Oxford predates the Aztec Empire…). You call TRUTH or LIE (buttons or T/L keys). **Every wrong call cracks the glass**: a full-viewport fixed canvas accumulates procedural crack shapes (6–10 jagged radial polylines + impact rings, double-stroked white/grey with glow) at a random point over the stage, with a glass-crunch + ping sound stack and a body shake. Cracks never repair. Seven cracks = total shatter (10 extra cracks across the whole screen, debris audio) → ending "the delusion holds". Survive 20 rounds → "you saw through it"; perfect 20/20 → hidden ending "clear glass" ("…get out."). Host script has escalation tiers: smug when you're right, soothing gaslight when you're wrong ("The glass was always like that. Don't look at it."), menacing near the limit. Marcellus + EB Garamond + IBM Plex Mono, void-black/bone/sick-gold. WCAG: aria-live host + verdicts + announcer, focus to restart button on endings, reduced-motion kills shake/eye-breathe (cracks stay, static). 14 checks green: bank balance/dupes, verdict paths, crack accumulation, shatter ending, perfect-run ending, restart reset, keyboard.

## issues
- Statements are hand-curated general-knowledge; if chat disputes one, verify carefully before editing the bank (each `t` is load-bearing).
- Crack canvas is position:fixed over everything including the injected top bar — pointer-events:none so voting still works; if the bar looks odd under cracks, that's cosmetic and intended (the whole screen is the glass).

## todos
- Host "meta-lie" rounds ("the next one is a lie" — which may itself be the lie) if chat wants more mind games.
- Daily seeded deck (date → shuffle) for shared runs.
- Streak-based host dialogue memory across sessions.
