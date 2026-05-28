# Sensible Soccer

A retro top-down football game inspired by the classic Sensible Soccer.

## Log
- Initial build: 6v6 top-down soccer with AI opponent
- Retro pixel aesthetic with Press Start 2P font
- Mobile touch controls with d-pad and action buttons
- 90-second matches with goal animations
- 2026-05-28: Added 4 of the original todos in one pass — sound effects, difficulty levels, team selection, aftertouch on kicks. **Audio engine**: pure Web Audio synth, lazy-constructed on first user gesture (the KICK OFF! click). `playKick(power)` = 180→40 Hz exp-sweep sine thump + highpassed noise tick for the thwack, volume scales with power. `playWhistle('kickoff'|'goal'|'full')` = two short pips for kickoff, one medium pip for goal, one long 550ms pip for full-time, all sine at 2500→2350 Hz with the right envelope. `playGoalOrgan()` = ascending C5-E5-G5-C6 organ-style arpeggio (triangle + 2× sine stack per note). `startCrowd()` = persistent ambient bandpass-filtered noise loop at gain 0.045 (650Hz centre, Q 0.7) — sounds like a stadium murmur. `crowdSwell(amount, dur)` lifts the gain temporarily on goal + full-time for the cheer. **6 selectable teams** (TEAMS array, each with name, flag emoji, kit colour, secondary colour): IBERIA 🇪🇸, AZUL 🇫🇷, VERDE 🇮🇪, GIALLI 🇮🇹, KURO 🇯🇵, ROXO 🇧🇷. Two radio groups in the start screen (YOUR TEAM + OPPONENT). If the same team is picked on both sides the picker auto-swaps to keep kits distinct. Selected colours drive the canvas player render via teams.home.color / teams.away.color (replaced the hardcoded `'#e63946'` / `'#457b9d'`) and the scoreboard label colour + text are synced live. **Difficulty** (Easy/Normal/Hard) maps to AI speed multiplier (0.6/0.85/1.05) applied to the chase speed in updateAI(). **Aftertouch** — Sensible-Soccer signature: after any kick (player or AI) an `aftertouchUntil` timestamp is set 0.9s in the future. While that window is open, holding any movement key adds a small acceleration to the ball, scaled by current ball speed so the curve fades naturally as it slows. Hooked into updateBall() before the position integration. Full-time alert now shows team names instead of "Red"/"Blue".

## Features
- 6 selectable teams (IBERIA/AZUL/VERDE/GIALLI/KURO/ROXO) with flag emoji + per-team kit colours that drive both the scoreboard labels and the canvas player render
- 3 difficulty levels (Easy/Normal/Hard) scaling AI chase speed
- Full crowd-and-whistle atmosphere via Web Audio synth: ambient murmur loop, kickoff/goal/full-time whistles, low-frequency kick thumps, organ-arpeggio goal jingle, crowd swell on every goal
- Aftertouch on kicks — hold a direction during the 0.9s after kicking to curve the ball mid-flight
- Auto player switching when ball is nearby
- Goalkeepers with basic positioning AI
- Mobile and desktop support

## Issues
- Mobile touch d-pad still doesn't visually highlight on press (cosmetic)
- AI goalkeeper sometimes drifts past goal-line on hard difficulty due to the AI speed multiplier applied to its already-fast lerp coefficient — only noticeable on screamers, not a real bug

## Todos
- Two-player local hot-seat mode (split keyboard: WASD+space vs arrows+enter)
- Penalty shootout when match ends in a draw
- Player jersey numbers + names overlay
- Replay highlights buffer (last 10s of motion replays on goal)
- Skill rating for each team (affects shot accuracy + sprint speed)
- Crowd boos when away team scores

## Technical Notes
- Canvas-based rendering at 300x200 game units
- Scaled to responsive canvas size
- Touch controls hidden on desktop
- Press Start 2P for authentic retro feel
