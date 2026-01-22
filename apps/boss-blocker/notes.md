# Boss Blocker

High-stakes bunker survival game - type corporate buzzwords to power the hydraulic lever and keep the angry orange-haired boss OUT!

## log
- 2026-01-22: Initial creation with typing mechanics, lever physics, boss AI

## features
- Type corporate buzzwords to power the hydraulic lever
- Lever constantly drops - type fast to keep it up
- Door opens as lever drops, boss gets closer
- 60+ corporate buzzwords to type
- Boss yells random corporate phrases
- Warning flashes when lever gets low
- Score tracking (buzzwords typed)
- Time survived counter
- WPM calculation
- Retro sound effects (Web Audio API)
- Mobile friendly
- Increasing difficulty over time

## buzzwords included
- SYNERGY, LEVERAGE, PIVOT, DISRUPT, BANDWIDTH
- SCALABLE, AGILE, OPTIMIZE, STAKEHOLDER, DELIVERABLE
- PARADIGM, ECOSYSTEM, EMPOWER, INNOVATE, STREAMLINE
- CIRCLE BACK, LOW HANGING FRUIT, MOVE THE NEEDLE
- THOUGHT LEADER, DEEP DIVE, BLEEDING EDGE
- And 40+ more corporate classics

## boss phrases
- "LET ME IN!"
- "WE NEED TO TALK!"
- "WHERE'S THAT REPORT?"
- "PER MY LAST EMAIL"
- "ANNUAL REVIEW TIME!"
- "PIZZA PARTY INSTEAD OF RAISE!"
- etc.

## mechanics
- Lever drops at 0.5 + (score × 0.02) per tick (50ms)
- Completing buzzword raises lever 15-25 points
- Lever at 0 = game over
- Boss gets more agitated as lever drops

## sounds
- type: quick chirp on correct keypress
- complete: ascending victory tones
- wrong: low buzz on wrong key
- warning: alert beep when low
- lever: mechanical thunk
- gameover: descending sad tones

## todos
- Add leaderboard
- Add power-ups (coffee = slow lever drop)
- Add boss phases with different behaviors
- Add more buzzword categories
