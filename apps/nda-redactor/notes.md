# NDA REDACTOR

## log
- 2026-01-10: Initial creation
  - Code blocks fall from top of screen
  - Proprietary vs Public code types
  - Click to redact sensitive code
  - Leak zone at bottom
  - Combo system for consecutive redactions
  - Level progression
  - 3 leaks = game over

## features
- Falling code block gameplay
- Two code types: PROPRIETARY (red) and PUBLIC (green)
- Click proprietary blocks to redact them
- Don't click public blocks (false positive penalty)
- 3 leaks allowed before game over
- Combo multiplier for correct redactions
- Level up every 1000 points
- Speed increases with level
- Syntax-highlighted code snippets

## proprietary code examples
- API keys and secrets
- Database passwords
- Customer data access
- Trading algorithms
- Employee salaries
- AWS/Stripe keys
- Source code leaks

## public code examples
- Basic functions
- Console logs
- Import statements
- Open source comments
- Math constants
- Standard patterns

## scoring
- Correct redaction: 100 × combo
- False positive: -50 points
- Leak: combo reset to 1
- Level up: every 1000 points

## mechanics
- Blocks spawn every 2 seconds (faster at higher levels)
- Block speed: 1 + level * 0.3 + random
- Leak zone at bottom 60px
- Proprietary blocks that reach leak zone = leak
- Public blocks pass through safely

## design
- Dark terminal aesthetic
- JetBrains Mono font
- Red = danger/proprietary
- Green = safe/public
- Cyan = score/UI
- Syntax highlighting in code
- Redacted blocks turn black with [REDACTED]
- Combo popup animations

## controls
- Click/Tap: Redact the code block

## level progression
- Level 1: 2000ms spawn interval
- Each level: -150ms interval
- Minimum interval: 800ms
- More proprietary blocks at higher levels

## todos
- Add sound effects
- Add boss levels with massive code dumps
- Add power-ups (freeze time, auto-redact)
- Add different document types (emails, contracts)
- Add leaderboard
- Add difficulty modes
