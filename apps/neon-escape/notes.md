# Neon Escape

Solve puzzles. Find codes. Escape the neon room.

## log
- 2026-04-10: Initial build. 4-wall escape room (North/East/South/West) with arrow navigation. 14 interactive objects across all walls. 5 interconnected puzzles: (1) Painting reveals symbol clues ◈✦◇, (2) Bookshelf has color-coded prime numbers → safe code 372, (3) Safe gives USB key, (4) Terminal (needs USB) reveals 4-digit door code structure, (5) Exit door needs code 7423. Side discoveries: clock frozen at 7:42 (digit 1), vent has screwdriver, books show 3-7-2 (safe code), poster maps symbols to numbers, mirror shows "2" (digit 3), drawer needs screwdriver → UV torch, plant pot has note fragment about switches, switch panel (3 toggles, UV reveals labels) gives digit 4, trash has clue about safe. Orbitron + Fira Code typography, dark neon aesthetic with glow effects. WebAudio click sounds. Timer tracks escape time. Inventory system with 4 items. Modal-based puzzle interactions.

## features
- 4 room views with arrow/keyboard navigation
- 14 clickable objects with contextual responses
- 5 linked puzzles with progressive discovery
- 4-item inventory (screwdriver, USB, UV torch, note)
- Modal puzzle interfaces with code entry
- Timer tracking escape speed
- Object states (locked, solved, collected)
- Keyboard shortcuts (arrow keys, escape)
- WebAudio click/nav sounds
- Mobile-friendly

## issues
- No save/load (refresh resets)
- Linear puzzle chain (must solve in roughly one order)
- No randomization (codes are always the same)

## todos
- Randomize codes per session
- Add more puzzles / red herrings
- Sound effects for correct/wrong
- Supabase leaderboard for fastest escape times
- OG preview PNG
- More visual depth in rooms (furniture, decorations)
