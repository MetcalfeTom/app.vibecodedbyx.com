# Wortschatz

## log
- 2026-07-30: v1 — simple daily German flashcards per chat request ("simple German flashcard app with streak counter, one word at a time, click-to-reveal, daily vocabulary list, clean layout"). Bauhaus aesthetic (cream paper, red/blue/yellow geometry, Jost = Futura-homage font + Martian Mono). ~125 A1/A2 words with articles; article color-coding der=blue die=red das=yellow (matches Bauhaus palette, doubles as gender mnemonic). One card at a time, click/Space flips (CSS 3D, reduced-motion safe), then ✓ Wusste ich (1) / ✗ Nochmal (2). "Nochmal" requeues the word at the end of today's session. Two streaks: run streak (consecutive knew-its, best persisted) + day streak (🔥, increments on first answered card of a day, continues only if you practiced the previous calendar day). Daily list tab: today's 10 words (date-seeded FNV-1a→mulberry32 pick, deterministic per day), blur-toggle for self-quizzing, tap a row to peek. Done panel after 10/10 with bonus round (endless random cards, doesn't affect today-count). localStorage `wortschatz-v1`. WCAG basics: rem, semantic, aria-pressed tabs, aria-live streaks + sr-only reveal status, focus-visible, ≥44px targets, prefers-reduced-motion. Tested 10/10 stub checks (boot, flip, streak math, day rollover, gap reset, done-state reboot, deterministic daily pick) + syntax + id cross-check.

## issues
- Day streak rule: continues only if `lastDone` == yesterday (any practice counts, not full 10/10). Completing 10 sets `doneToday` which locks the day into the done panel on reload (bonus still available).
- Deutsch Dash (apps/deutsch-dash) is the bigger German app (quiz/CEFR/elite mode) — keep Wortschatz deliberately minimal; send feature-hungry users there.

## todos
- Could add Web Audio pronunciation via SpeechSynthesis (de-DE voice) on reveal.
- Could grow word pool / CEFR levels if chat asks (keep the daily-10 ritual).
- Streak calendar view (month grid of practiced days).
