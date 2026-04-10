# Neon Defuser

Two-player bomb defusing game — one sees the bomb, the other reads the manual.

## log
- 2026-04-10: Initial build. Room-code based seeded bomb generation so both players get matching config. 4 modules: Wire Cutters (4-6 colored wires, rule-based), Button Panel (4 colored labeled buttons), Switch Array (3 labeled switches, pattern from serial), Symbol Keypad (press 4 of 9 symbols in order). 3-minute timer, 3 strikes max. Defuser has toggleable manual button for solo play. Expert view shows full manual with rules. Seeded PRNG from room code ensures both views match. Orbitron + Share Tech Mono typography, dark red/cyan bomb-squad aesthetic.

## features
- Room code system (seeded RNG ensures matching bomb on both devices)
- 2 roles: Defuser (sees bomb) and Expert (reads manual)
- 4 modules: Wires, Buttons, Switches, Keypad
- Toggleable manual overlay for solo play
- 3-minute countdown timer with flash warning
- 3-strike system
- Serial number affects wire/switch rules
- WebAudio tick/cut/press/strike/boom SFX
- Module completion tracking with visual feedback

## issues
- No real networking — relies on shared room code
- Some wire rules may have edge cases in rare color combos
- Timer keeps running while reading manual in solo mode

## todos
- Supabase room sync for real multiplayer
- More module types (morse code, maze, memory)
- Difficulty levels (fewer/more modules, shorter timer)
- Score tracking (time remaining * modules)
- OG preview PNG
