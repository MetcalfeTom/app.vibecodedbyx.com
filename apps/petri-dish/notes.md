# petri-dish · notes

## log
- 2026-05-20: v1 — **digital petri dish where 8 colorful bacteria strains compete, growing on chat activity**, per chat ask "build a digital petri dish where colorful bacteria strains compete, growing based on chat activity". Single-file ~28KB, Canvas2D 160×160 cell grid scaled up via `image-rendering: pixelated`, anonymous Twitch IRC over WebSocket, localStorage channel memory, zero deps.
  - **Simulation** · 160×160 cell grid (25.6k cells) inside a circular mask (`dx² + dy² ≤ r²`, r=79). Each cell holds: strain id (0=empty, 1-8 = a strain), nutrient (0-100 float), and heat (visual freshness, 0-255 decaying). One sim tick every 120ms.
    - **Spread**: per-tick we sample ~N/2 random cells; if a cell holds a strain with nutrient ≥ 8, we pick one random 4-neighbour. Empty neighbour gets colonized with `P = spread × (0.35 + nutrient/100 × 1.2)`; spreading consumes 18 × hunger nutrient from the target cell.
    - **Competition**: if the neighbour holds a different strain, the invader can overtake it with `P = max(0, comp_self - comp_other) × 0.18 + lethal × 0.08`. Overtaken cell flips strain id (with mass bookkeeping), drains 6 nutrient.
    - **Nutrient flux**: every 8 ticks, ~N/16 random cells regenerate +0.4 nutrient (slow background regeneration so the dish doesn't run dry).
    - **Heat decay**: every 2 ticks, all heat values decay by 12 (creates the "fresh bloom" glow on newly-colonized cells).
    - **Extinction tracking**: strains hit 0 mass → flagged dead (sidebar marks them with †, posts a lab-log entry "X colony has gone extinct"). Feeding a dead strain reseeds 1-2 cells at a random empty location and resurrects it ("X has returned from the void").
  - **8 strains** with distinct stats balancing aggression vs survival:
    - **verdis** (green, spread 0.32, comp 0.55, hunger 0.95) — aggressive spreader, low maintenance
    - **cyanthia** (blue, spread 0.30, comp 0.50) — balanced
    - **magentor** (pink, spread 0.24, comp 0.72, hunger 1.25) — slow but dominant
    - **saffrina** (yellow, spread 0.40, comp 0.40) — fastest spread, weakest in fights
    - **violetta** (violet) — balanced middle
    - **sanguinex** (red, spread 0.22, comp 0.78, hunger 1.40, lethal 0.12) — slow but lethal; eats neighbours easily
    - **aquaflux** (aqua, hunger 0.90) — efficient grower
    - **crysanthrum** (orange) — assertive middle
  - **Chat → strain assignment** · `strainFor(handle) = (fnv1a(handle.lower()) % 8) + 1`. Deterministic: the same chatter always feeds the same strain across sessions. First-time chatters get fresh strain assignments.
  - **Feed rule** · each chat message adds nutrient to its strain via `feedStrain(sid, amount, source)`:
    - If strain is alive: drops a 3×3 nutrient bloom around a random cell of that strain (`amount × radial falloff`, clamped 0-100) + heat pulse +60 for visual freshness
    - If strain is dead: reseeds 1-2 fresh cells at random empty positions and flips alive flag back
    - Amount: `28 + min(40, len(msg) × 0.5)` — longer messages = more food
  - **Auto-feed** · runs in the background at the tick rate (120ms). 60% chance per tick to drop 18 nutrient on a random alive strain so the dish stays interesting even with zero chat. Toggleable via the "auto-feed" pill in the controls panel. If ALL strains die simultaneously, auto-feed reseeds everyone.
  - **Twitch IRC** · anonymous `wss://irc-ws.chat.twitch.tv:443` connection via `PASS SCHMOOPIIE` + `NICK justinfan{random}` + `JOIN #channel`. Same pattern as neon-aquarium/sloppyland. PRIVMSG regex parses `:<nick>!<...> PRIVMSG #<ch> :<msg>` and routes to `postChat(who, txt)`. PING/PONG keepalive. Auto-reconnect 4s on close (if user hadn't manually disconnected). Last channel persists to localStorage.
  - **Manual feed input** · for testing/streaming without a real channel: handle (or auto-generated `guest-NNNN`) + message text + Enter posts a fake chat into the queue. Same routing as a real chat message.
  - **Direct click feed** · clicking anywhere on the dish drops a 50-nutrient pulse on the strain at that cell (or nearest, if empty). Floating "+ strain_name" toast appears at click location in the strain's color.
  - **Sidebar** · 3 panels:
    1. **Strains** — live leaderboard, sorted by mass descending. Each row: color dot with glow, strain name in Major Mono, last-chatter `@name · 3s` line, percent of total mass, mini bar in the strain's color with width=pct%. Leader gets a subtle highlight strip. Dead strains are 0.4 opacity with † suffix.
    2. **Lab Log** — last 14 chat messages (color-coded by strain), plus sim stats: tick / occupied cells / occupied % / spawn count.
    3. **Controls** — Feed Random / Feed All / Reset Dish buttons + auto-feed toggle pill + manual handle+message inputs.
  - **Petri dish aesthetic** · cream agar gradient with paper-fibre repeating-linear grain (13°/103°), glass dome highlight (radial gradient top-left), 6px white outer ring + thin black inset to simulate a glass rim, drop-shadow + dark-bench lab housing with subtle dot-grid texture. "plate 042 · nutrient agar · incubated at 37°C · day N of observation" italic caption underneath.
  - **Day counter** · day = `floor(tick / 600) + 1` — bumps every ~72 seconds of real time.
  - **Render pipeline** · per-frame: write to an `ImageData` (160×160) where cells are colored by strain hex + heat-brightened (`+ heat/255 × 60` per channel), empty cells outside the dish are alpha=0, empty cells inside the dish are alpha=0 (cream gradient shows through). `putImageData` then CSS scales the canvas to 720×720+ via `image-rendering: pixelated`.
  - **WCAG basics** · `<canvas aria-label>`, `<header>`/`<main>`/`<aside>` semantics, role="status" + aria-live on toast, focus-visible green outlines, prefers-reduced-motion kills the bar-fill transitions, ≥36px button targets.
  - **Mobile** · sidebar collapses below dish at 980px. Dish remains a 1:1 square.
  - **OG image** · Pollinations flux seed 3838, "Pixelated petri dish with eight colored bacterial colonies competing, glowing neon on cream agar, laboratory notebook aesthetic, microbial warfare". No `referrer` param per project notes.

## issues
- The dish doesn't reach perfect 100% occupancy because cells near the dish-mask edge are sparsely sampled (rounding to integer x/y leaves a 1px gap). Visually fine.
- Competition uses a single random-neighbour pass per cell sample; in a single tick a cell might "fight" 0 times or 1 time, never multiple. This keeps competition slow-burn (which is the right pace for a passive sim).
- Nutrient flux is random sampling; very dense areas of one strain can deplete faster than they regenerate. That's intentional — over-dominant strains gradually starve.
- The chat → strain hash bins users to one of 8 strains modulo their username. Two friends might end up on the same strain; that's by design (they fight together).
- Reseeding extinct strains is intentional — without it, a single dominant strain would win and the sim would die. If chat asks for "rounds until one survives" mode, add a toggle that disables resurrection.
- No backpressure on chat: a busy channel with 100+ msg/min will rapidly feed strains. The 28-68 nutrient per message is small enough that a single chatter can't single-handedly take the dish, but a hyperactive room can. Fine for the spectacle.

## todos
- "Antibiotic" — drop a circular kill zone with a click+modifier (clears all cells in radius).
- "UV pulse" — flash that kills 50% of all cells of the weakest strain (helps shake up dominance).
- "Mutation" — tiny chance for a cell to flip to a random new strain id, simulating horizontal gene transfer.
- Heatmap toggle that visualizes the nutrient field directly (overlay).
- Per-strain mass-over-time chart in the leaderboard panel (sparkline).
- Twitch chat commands: `!attack X` boosts your strain's lethal stat for 30s; `!flush` clears a small radius (limited cooldown).
- Faction allegiances — chatters can "join" another chatter's strain via `!join @user`.
- "Plate gallery" — every N ticks, snapshot the dish as a 160×160 thumbnail and show last 8 in a strip.
- Sound: gentle agar bubble loop, chime on chat message (per-strain pitch), "extinction" tolling bell.

## design notes
- Per the windows-11-recall-nightmare debugging session, NO `transform-box: fill-box` anywhere. All animation here is canvas-driven (per-frame redraw + ImageData blit), and CSS-only bars + dish housing use straightforward transforms.
- The cell grid is `Uint8Array` for grid + `Float32Array` for nutrient + `Uint8Array` for heat. Tested at 160×160 = ~26k cells; sim tick takes ~3-5ms per beat on a 4-year-old laptop.
- Strain hex colors are deliberately spread across the hue wheel + biased toward higher saturation so adjacent strains read as distinct even at 1px cell size.
- The "reseed dead strain" mechanic was added late after testing — without it, the dish always converged on one or two dominant strains and chat lost interest. Resurrection keeps every chatter relevant.
- 4-connected spread (vs 8-connected) was chosen because it gives a more recognizable "bacterial spread" pattern (organic blobs vs square grids). 8-connected makes colonies look pixelated rather than alive.
