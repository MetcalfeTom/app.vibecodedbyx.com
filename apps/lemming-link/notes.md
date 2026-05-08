# lemming-link

## log
- 2026-05-08: shipped — Lemmings-inspired class-locked co-op prototype, single level "Mountain Pass" (chat ask: "create a prototype of Lemming-Link with a mountain biome, where players can choose one of the four classes to help a stream of lemmings reach the exit safely"). 1200×540 canvas at 4px tiles (300×135 cell grid). Background: starfield + parallax mountain peaks + moon. Ground = procedurally rendered rock palette with snow caps on top edges + depth-darkening rock body + bedrock bottom rows (indestructible). Single obstacle: a 60px-wide × 48px-tall rock wall at column 145–160. Spawn at left, exit at right.
  - **4 classes** picked from a class-select overlay (chat ask: choose one of four). Each class **owns a subset of the 8 classic skills**, so in real multiplayer no single player has the full kit. Off-class skill chips render greyed with `◌ off-class` strapline + `aria-pressed="false"` and refuse to apply (showing "X is a teammate skill"). Tokens per class:
    - **Scout** (cyan): Climber ×8 + Floater ×8 — vertical access (Climber lemmings scale walls; Floater = parachute survives any fall).
    - **Architect** (gold): Builder ×4 + Blocker ×2 — terrain creation (Builder makes a 12-step staircase climbing 12 cells; Blocker becomes a stationary pillar that turns approaching lemmings around).
    - **Sapper** (moss): Basher ×3 + Miner ×2 + Digger ×2 — terrain destruction (Basher tunnels horizontally, Miner diagonally down-forward, Digger straight down). Bedrock blocks all of them.
    - **Detonator** (crimson): Bomber ×5 — lemming gets a 5s fuse, then detonates into a 7-cell-radius circle removing destructible terrain. Sacrifices the lemming.
  - **Lemming state machine**: `walk | fall | float | climb | build | block | bash | mine | dig | bomb | splat | saved | spawning`. Walking handles 1- and 2-cell step-up automatically (gentle slopes). Hitting a wall: turn around (or climb if Climber-buffed). Fall distance > 18 cells → splat (unless Floater). Mining/Digging/Bashing all stop when they hit indestructible bedrock or run out of material. Builder advances 1 cell horizontally + 1 cell up per brick, 12 bricks total, then resumes walking.
  - **Indestructible mask**: separate `Uint8Array` parallel to terrain marks bedrock cells (top 2 rows + side columns + rows 101+). Skill destruction code respects it.
  - **Rendering**: terrain painted to an offscreen canvas via `putImageData` (one big pixel-buffer write). Marked dirty only on terrain edits — main loop just blits the cached canvas. Lemmings drawn on top each frame in class-themed colors with state-specific glyphs (climber claw, floater umbrella, builder brick, blocker pillars, basher fist, bomber countdown digit). Parallax stars twinkle with sin phase; moon at top-right.
  - **Win condition**: save ≥ 60% of 20 lemmings (= 12). Spawn cadence 1.4s. End overlay shows save count, save %, lost count, tokens used, with retry / try-another-class actions. Level is solvable by every class:
    - Scout: assign Climber + Floater to each lemming individually (paired; 8 of each = save up to 8 — risky given goal of 12, so this kit is tightest and demands precision).
    - Architect: 1 Builder placed at the wall base ramps a permanent staircase ALL subsequent lemmings walk over. Solo-solve.
    - Sapper: 1 Basher tunnels horizontally through the wall — all subsequent lemmings walk through. Solo-solve.
    - Detonator: 1 Bomber sacrifices a lemming to blow a hole through the wall — all subsequent walk through. Solo-solve at 1-lemming cost.
  - **HUD**: class card + skill toolbar (8 chips, owned highlighted, off-class greyed, empty greyed crimson) + meta card with save %/timer. Below: restart / change-class / pause buttons + 60% target reminder. `aria-pressed` on skill chips and pause button. `aria-live="polite"` ticker shows assignment toasts.
  - **Audio**: pure WebAudio synth (no assets) — click/assign/saved/splat/boom/deny/win/lose tones. AudioContext lazy-created on first user gesture so the page loads silently.
  - **Controls**: pointerdown on a lemming applies the selected skill; number keys 1–8 toggle skill chips for the corresponding skill (climber..bomber, but only owned ones); P pause, R restart.
  - **Accessibility-first** (per project rule): rem units everywhere, html font-size:100%, semantic `<main>`/`<header>`/`<section>`/`<button type=button>`, `aria-pressed` on toggles, `aria-live="polite"` ticker, `role="application"` + descriptive `aria-label` on canvas, `:focus-visible` outlines, 2.75rem (44px) min-height interactive targets, `prefers-reduced-motion` kills skill-chip transition + bump.
  - **Aesthetic**: deep night-sky `#07101e` → `#050813` radial w/ stars + moon + parallax peaks. Bungee for title + class names; Press Start 2P for token counts and ticker; JetBrains Mono for body. Class color cohort: cyan (Scout), gold (Architect), moss (Sapper), crimson (Detonator).

## issues
- Climber + Floater require **separate** tokens per lemming, so Scout's solo-solve is the tightest kit (need 12 of each for an 8-each budget). In multiplayer this is fine because Architect/Sapper/Detonator can solve the wall en masse and Scout focuses on supporting individual lemmings — but as a single-player demo it makes Scout feel underpowered. Consider an "Athlete" composite skill that grants both for a single token, or boost token counts.
- Lemmings sometimes appear to "phase" through the wall when a Basher tunnels — this is because the bash code clears one extra cell ahead-of-ahead so the tunnel walks smoothly, but if a lemming is mid-step it can briefly overlap the cleared area. Cosmetic, no functional bug.
- No multiplayer netcode yet — that's the whole point of "Lemming-Link" but a prototype scoped to single-player class-locked demo. Next pass: BroadcastChannel local-tab lobby (like neon-volleyball) with each tab forced into a different class, shared lemming/terrain state via leader-tab simulation.

## todos
- Add a 2nd, 3rd, 4th level forming the **Mountain biome** progression (chat: "level progression"): "Frozen Crevasse" with a deadly gap (forces Architect Builder OR Scout Floater + lower-platform routing OR Sapper alt path), "Avalanche Slope" with a falling-snow time pressure mechanic, "Summit Gate" with two simultaneous obstacles requiring two classes' kits (this is where multiplayer matters).
- BroadcastChannel-based local-tab multiplayer (one tab per class, leader-tab runs sim, others send skill-assign messages).
- Ping system: "BUILD HERE" / "STOP THEM" markers visible to all players, so non-voice coordination works.
- Class XP unlocks (cosmetic skin variants + advanced skill variants like Frost-Bomber that freezes terrain instead of removing it).
- Per-class panic-charge: 1 shared use per level to invoke a missing class's skill if a teammate is AFK.
- Mobile-friendly tap-and-hold radial menu around a lemming for skill assignment (currently desktop-friendly because skill chip click → lemming click).
- Daily co-op puzzle generator that requires all 4 classes to clear (the social retention hook).

## design-notes
The 4-class split was chosen so each owns a thematically coherent kit: vertical/aerial (Scout), construction/control (Architect), demolition/shaping (Sapper), nuclear option (Detonator). The 60% save threshold (vs Lemmings' often 100%) leaves room for Detonator's sacrifice tradeoff. Skill counts were picked so each class has exactly enough to solo a level cleanly — multiplayer becomes about *parallelism* (multiple obstacles solved at once) rather than dependency-chains where one player blocks another.
