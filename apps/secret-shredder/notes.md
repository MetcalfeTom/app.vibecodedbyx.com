# Secret Shredder

## log
- 2026-01-17: Added leak detection with git cleanup commands
  - Detects 20+ sensitive patterns:
    - private_key, .env, api_key, api_secret
    - access_token, auth_token, bearer tokens
    - password, passwd, database_url
    - AWS keys, RSA/SSH private keys
    - GitHub tokens (ghp_), OpenAI keys (sk-)
    - Slack tokens, MongoDB/PostgreSQL/MySQL URLs
  - Shows neon warning panel when leaks detected
  - Provides git commands to clean repo history:
    - git filter-branch to remove files from history
    - git push --force to update remote
    - git reflog/gc to purge local traces
  - Copy buttons for each command
  - Proceed or Cancel buttons
  - Escape key to dismiss warning
- 2026-01-17: Initial creation
  - Neon cyberpunk aesthetic with red/orange theme
  - Paste text and watch it get vaporized
  - Two-phase destruction:
    1. Glitch phase: characters scramble randomly
    2. Vaporize phase: characters burn and dissolve
  - Flying particle effects with physics
  - Static noise overlay during shredding
  - Glitch screen bars effect
  - Progress bar with flowing gradient
  - Sound effects (toggleable):
    - Glitch static noise
    - Vaporize swoosh sound
  - CRT scanlines overlay
  - Ctrl+Enter keyboard shortcut
  - Mobile responsive

## features
- Text input area with neon styling
- Character-by-character destruction
- Particle system for vaporized chars
- Static TV noise canvas effect
- Web Audio API for sound effects
- Glitch text animation
- Screen glitch overlay bars
- Progress indicator
- Disclaimer (visual effect only)

## design
- VT323 + Orbitron fonts
- Red/orange neon fire palette
- Dark background with red accents
- Glowing text and button effects
- Scanlines for CRT feel
- Particle physics with gravity

## technical
- Canvas for static noise
- Canvas for particle system
- Web Audio API for procedural sounds
- CSS animations for glitch effects
- Async/await for sequenced animation

## todos
- Add different shred modes (burn, dissolve, encrypt)
- Add "shred history" counter
- Add share button (share that you shredded something)
- Add more dramatic sound effects
- Add screen shake option

## issues
- None yet
