# File Guesser

## log
- 2026-04-08: Initial build. Sibling concept to code-quiz but with user-uploaded files instead of our apps pool. Drop zone / click-to-browse accepts multiple files, filters to text-like (ext whitelist + MIME prefix), 2MB per file, 40 file cap, 2 file minimum. Reads in browser via `file.text()`, binary sniff rejects files with NUL bytes in first 2000 chars. Stores `files[]` as `{name, content, lines}` in memory — nothing uploaded anywhere. `pickSnippet()` splits into blank-line-separated blocks, prefers 4-14 line chunks, scrubs filename base parts with asterisks. 10-round quiz with up to 4 options per round, basic JS + Python syntax highlighter, progress bars, explanation box, score screen with tiered copy. Emerald/pink accent palette.

## features
- Drag/drop + click-to-browse upload with multi-file support
- Text-file filter (ext whitelist + MIME prefix + binary NUL sniff)
- Fully local — no network upload of file contents
- Heuristic snippet picker (blank-line block segmentation, prefers 4-14 lines)
- Filename scrubbing so names don't leak into the snippet
- Basic JS + Python syntax highlighting (keywords, strings, numbers, comments)
- 10-round quiz with progress, live score, skip button
- Score screen with tiered messages + play again

## issues
- Minified single-line files produce poor snippets (fallback is a 6-line sliding window)
- Very small files (<3 lines) get skipped when picking snippets

## todos
- Support folder drop (webkitdirectory) to grab a whole project at once
- Remember last uploaded set via IndexedDB so quizzes can resume
- Weight snippet pick toward longer/more-distinctive blocks per file
