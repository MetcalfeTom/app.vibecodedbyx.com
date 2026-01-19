# Snark Terminal

## log
- 2026-01-19: Initial creation - terminal that mocks every command

## features
- Fake terminal aesthetic with macOS-style header
- Every command returns a snarky rejection
- Specific responses for common commands:
  - help, ls, cd, sudo, exit, hello
  - hack, please, rm, cat, pwd
  - clear, whoami, man, ping, make
- Generic rejection pool for unknown commands
- Empty command detection with unique responses
- ASCII art header
- Command history display
- Auto-scroll to latest output

## design
- Dark terminal aesthetic
- VT323 + Space Mono fonts
- Red/green color scheme (errors and input)
- macOS-style window buttons
- CRT-inspired glow effects
- Smooth fade-in animations for output

## response categories
- 20 generic rejections
- 4 responses per known command
- 5 empty input responses
- Randomized selection for variety

## commands with specific responses
- help: unhelpful help messages
- ls: lists fake failure files
- cd: can't escape problems
- sudo: extra sassy power rejection
- exit: hotel california vibes
- clear: clears screen grudgingly
- whoami: existential roasts

## todos
- Add command history (up arrow)
- Add tab completion (that doesn't work)
- Add loading spinners that lead nowhere
- Add fake crash messages
- Add easter egg commands

## issues
- None yet
