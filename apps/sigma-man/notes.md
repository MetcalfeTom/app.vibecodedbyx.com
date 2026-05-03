# sigma-man

## log
- 2026-05-03: shipped — top-down maze grindset, pacman-shaped.
  - **Maze**: 19×21 hand-laid layout (RAW_MAZE) with walls, pellets, 4 power dumbbells, ghost house in the middle, two side tunnels that wrap horizontally, ghost door above the house.
  - **Player**: yellow circle with mouth animation tied to motion phase, two muscle bumps (light bicep + darker shadow circle) on the perpendicular axis, a horizontal sunglasses bar across the face. Speed 3.4 + 0.18×(level-1) tiles/sec.
  - **Pellets**: small horizontal dumbbells (2 plates + bar, gold). Each = 10pt.
  - **Power dumbbells**: 4 large pulsing orange dumbbells, one per corner. Triggers BEAST MODE for 7.5s — player turns hot pink (with a flash flicker as the timer expires), all in-play ghosts switch to FRIGHTENED state and reverse direction. Eat them in this state for 200×(1+remaining whole seconds) points.
  - **Ghosts** (4): IRS ($), AUDIT (?), DEBT (!), CPA (#). Each colored differently and labeled. Standard pacman-style chase/scatter cycling: 5s scatter → 18s chase → repeat. Per-kind chase target offsets: IRS heads straight at the player, AUDIT 4 tiles ahead, DEBT 3 tiles behind, CPA orbits its corner.
  - **Pathfinding**: at every grid intersection ghosts pick the direction (no instant reverse) whose adjacent tile has the smallest squared distance to their target. Frightened ghosts pick a random target each intersection. Eaten ghosts head back to the ghost house at 1.6× speed and re-enter chase on arrival.
  - **Lives**: 3 hearts (rendered as 💪 bicep glyphs in the HUD). Player-ghost contact when not frightened → -1 life + respawn after 1.1s. 0 lives → game over.
  - **Scoring**: pellet 10, power 50, frightened ghost 200×(seconds left), level clear advances to next level + faster ghosts (+0.12 t/s).
  - **Aesthetic**: deep navy bg with cyan-neon walls drawn as inset rounded rects with shadowBlur glow. Bowlby One title with yellow accent (SIGMA + neon-yellow MAN). Cormorant italic tagline. IBM Plex Mono HUD pills, VT323 numerals. The 'tax collector' motif is just the suit-lapel V drawn on each ghost's body and a tax-type letter glyph on top.
  - **Audio**: low triangle drone room tone, square pellet bleep (throttled 70ms), 6-step square arpeggio on power, triangle chomp on frightened-ghost eat, descending sawtooth + bandpass noise on hit, 5-step rising arp on level up.
  - **Mobile**: 4-button d-pad bottom-left on coarse-pointer / mobile screens.
  - **Persistence**: best score in localStorage as `sigma-man-best`.
  - **Loop**: fixed-step 1/120s w/ accumulator + spiral-of-death guard.
  - **Accessibility**: rem units, role=application canvas with key summary, semantic dialogs with inert toggling, focus-visible outlines, prefers-reduced-motion kills pop animations, skip-link.

## issues
- Ghost AI is "good enough" but not pixel-accurate to the original pacman targeting. Movement at intersections sometimes looks twitchy when two ghosts collide on the same tile.
- The maze tunnels wrap horizontally only; vertical wraparound isn't supported (and the maze doesn't need it).
- Fire-and-forget power dumbbells: once eaten in a level, they're gone for the rest of that level. Could regenerate them if chat wants longer levels.
- Eaten ghosts pass through walls visually (they teleport-style head home). Could path them on the maze grid for fairness — currently they cheat back.

## todos
- Real SRS/pacman-style targeting with reverse-on-mode-change.
- Eaten-ghost pathfinding (use BFS to walk back, instead of teleport).
- Bonus fruit / "bonus ledger" item that spawns mid-level.
- Per-level maze variants.
- Online leaderboard via Supabase.
