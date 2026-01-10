# MALLOC MADNESS

## log
- 2026-01-10: Initial creation
  - Memory block allocation game
  - Click to free() blocks
  - Heap usage meter
  - Locked/fragmented block types
  - Level progression
  - Particle explosions on free
  - Terminal-style log messages

## features
- Memory blocks allocated automatically
- Click/tap green blocks to free them
- Red locked blocks must wait to unlock
- Yellow fragmented blocks worth double points
- Heap usage bar shows memory pressure
- Critical state when >90% full
- Level up every 10 blocks freed
- Allocation speed increases per level
- Particle effects on free
- Terminal log messages
- Explosion on heap overflow

## block types
- GREEN (allocated): Can be freed immediately
- RED (locked): Must wait for unlock timer
- YELLOW (fragmented): Worth 2x points

## scoring
- Base points = block size in bytes
- Fragmented blocks = 2x multiplier
- Quick free (<1 second) = 1.5x multiplier
- Block sizes: 16, 32, 64, 128, 256 bytes

## mechanics
- HEAP_MAX: 1024 bytes total
- Blocks spawn with random positions
- Non-overlapping placement attempted
- Allocation interval decreases with level
- Game over when allocation would exceed heap

## design
- Green terminal/hacker aesthetic
- Fira Code monospace font
- Neon glow effects
- Memory addresses in hex
- Terminal-style log messages
- Screen shake on locked block click
- Explosion emoji on game over

## controls
- Click/Tap: Free the clicked block
- Locked blocks shake when clicked

## level progression
- Level 1: 2000ms allocation interval
- Each level: -150ms interval
- Minimum interval: 500ms
- Level up every 10 blocks freed

## todos
- Add defragmentation power-up
- Add garbage collector sweep mode
- Add memory leak "boss" blocks
- Add combo system for quick frees
- Add online leaderboard
- Add different malloc strategies
- Add sound effects
