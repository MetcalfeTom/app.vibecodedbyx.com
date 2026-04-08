# Code Quiz

## log
- 2026-04-08: Initial build — paste a code snippet, pick language/level/question count, click Generate. POSTs to `https://text.pollinations.ai/openai` with `response_format: json_object` and a strict schema prompt. Parses returned JSON (fence-stripped) into `{questions:[{q,options,correct,explain}]}`, filters to 4-option well-formed entries. One question at a time with progress bars, letter-labeled options (A/B/C/D), correct/wrong marking, explanation box, score screen with copy based on %. JetBrains Mono + Bricolage Grotesque, dark panel/editor aesthetic with red/yellow/green window dots header. Auto file extension based on selected language. Sample Fibonacci placeholder in the textarea.

## features
- Paste any code, 16 languages + auto-detect
- 3 difficulty levels (beginner / intermediate / advanced)
- 3 question counts (3 / 5 / 8)
- Pollinations JSON-mode API for structured quiz output
- Progress bars update as you answer (green = right, red = wrong, yellow = current)
- Explanation shown after answering each question
- Score screen with percentage and level-based encouragement
- Mobile-friendly responsive grid (stacks on narrow viewports)

## issues
- None yet

## todos
- Share score button (copy result link)
- Save favorite snippets to localStorage
- Supabase leaderboard for highest scores across sessions
- Syntax highlighting in the code textarea (currently plain mono)
