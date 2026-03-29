# Neon Type

## log
- 2026-03-29: V1 — Neon typing speed test. 4 duration modes (15/30/60/120s). ~180 common English words randomly shuffled into continuous text. Characters highlight cyan for correct, pink for wrong with underline. Blinking cursor. Live WPM and accuracy during test. Results screen with 6 stat cards: net WPM, raw WPM, accuracy, characters, correct, errors. WPM calculation: (keystrokes/5)/minutes. Backspace support. Tab/Esc to restart. Auto-generates more text as you type. Auto-scroll to cursor. Best score per duration in localStorage. Megrim + Fira Code typography, cyan neon on dark aesthetic.

## features
- 4 test durations: 15s, 30s, 60s, 120s
- ~180 common English words pool
- Character-by-character highlighting (cyan correct, pink wrong)
- Blinking cursor on current position
- Backspace to correct errors
- Live WPM and accuracy display during test
- Results: net WPM, raw WPM, accuracy %, total chars, correct, errors
- Tab or Esc to restart instantly
- Infinite text generation (adds more words as you type)
- Auto-scroll to keep cursor visible
- Best WPM per duration in localStorage
- Click anywhere to focus input

## issues
- None currently

## todos
- Word pool expansion (themed word sets)
- WPM graph over time
- Leaderboard
- Sound effects (key clicks, error buzz)
- Custom text / quote mode
- Difficulty modes (punctuation, numbers, code snippets)

## notes
- WPM formula: net = (correct keystrokes / 5) / minutes, raw = (all keystrokes / 5) / minutes
- Text stored as array of chars/objects with _correct flag
- Hidden input trick for mobile keyboard support
- Generates 300 chars initially, adds 100 more when within 50 of end
- Timer starts on first keypress (not on focus)
