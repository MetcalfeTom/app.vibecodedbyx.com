# Neon Aquarium

Glowing fish ecosystem with predator-prey dynamics, lightning strikes, and placeable decor.

## log
- 2026-09-26: **Data fish** — first piece of folding the other tanks into this one (Fela: join the tanks, one main tank). New 9th species `Data` (appended last, so saved spIdx values stay valid; chat-hash species mapping shifts, harmless) with `data:true`: every 6 update steps it drops a glyph from `GLYPHS` (binary-heavy + hex/brackets) behind its tail into `f.trail` (max 22); glyphs rise 0.12 px/step and fade over ~2 s; drawn in Fira Code 300 at max(12, size×1.05) px under the fish. Plan: Zen's jellyfish bloom and Retro's schooling next, then ask Fela before pointing cyber/retro/zen-aquarium here.
- 2026-09-26: **Food you can see** (Fela: improve the aquariums). A lightning tap on open water now drops 6–9 glowing golden flakes (`food[]`, `dropFood()`, cap 80) instead of silently growing a random fish. Flakes burst out, sink with a sway (max 0.45 px/frame), rest on the sand (`floorAt`) and fade after 7 s. Non-jelly fish within 220 px steer to the nearest flake and swim up to 2× their normal max speed while chasing (`chasing`); a gulp grows that fish +0.12 and puffs a few particles. Drawn under the fish. Chat messages still use growRandomFish. Headless: 23 flakes all eaten within ~300 update steps, growth +2.76. Headless rAF runs at ~1.4 fps here, so probes must step update() directly (the code is inside an IIFE — expose a hook in the test copy).
- 2026-09-26: Backdrop overhaul. Canvas is DPR-crisp now (bitmap × devicePixelRatio≤2, `X.setTransform(DPR…)`, all drawing still in CSS px via W/H). `buildBackdrop()` pre-renders on resize: teal-to-ink water, surface glow, two far reef ridges with coral fans/sponges, sand dunes (`floorAt(x)`), pebbles. Per frame: shimmering surface line, stronger light rays, caustic light spots on the sand, bubble streams from 3 vents (`VENTS`, `bubbles`, cap 90). Seaweed became tapered leafy kelp rooted on the dunes with a glowing tip; count scales with width. og.png replaces the emojicdn image.
- 2026-05-13: V11 — **Twitch chat → fish**. New sidebar section with channel input + Connect button. Anonymous IRC WSS (`wss://irc-ws.chat.twitch.tv:443`, `PASS SCHMOOPIIE` + random `justinfan`), PRIVMSG parser, PING/PONG handling, auto-reconnect on drop (3.5s). Each chat message spawns one fish whose species, hue shift, size (9–14), spawn position, and initial velocity are deterministically derived from an FNV-1a hash of the lowercase username — so the same chatter always gets the same color/species across sessions. First-time chatter triggers a 5-particle violet welcome sparkle near the surface. Live floating chat feed bottom-left (max 6 lines, 4.7s fade, message clipped at 80 chars). **Rare deep-sea kraken**: 1/120 base chance per chat message OR guaranteed when the message contains "kraken"/"summon"/"deepsea"/"release". Bypasses the biomass gate via direct `spawnKraken()` call. Magenta banner flashes "⌬ THE KRAKEN STIRS · summoned by USER ⌬" centered for 3.3s with scale-pop keyframe. Connection state pill in sidebar (idle / connecting / live · #channel / reconnecting / error). Last channel persisted to localStorage. Roster cap (30) handled gracefully — when full, chat messages feed a random existing fish instead of being dropped. Each chat message also counts toward totalChats/leaderboard.
- 2026-03-26: V10 — Global leaderboard tracking most fish fed. Supabase UMD client, anon auth, upsert on user_id. Top 10 feeders panel (bottom-right toggle). Name persistence in localStorage. Auto-syncs every 15s. Table: aquarium_leaderboard (user_id uuid PK, name text, fish_fed integer, created_at timestamptz).
- 2026-03-26: V9 — Multi-color sand dropper. 8 sand colors: Sand, Ruby, Coral, Gold, Emerald, Cyan, Violet, Snow. Color picker swatches appear under Sand Drop toggle when active. Per-grain hue+saturation variation for natural look. Paint the sea floor in any color combo.
- 2026-03-26: V8 — Bioluminescent jellyfish school. 12 small cyan-teal jellyfish that drift as a school. Glow pulses based on interaction activity (clicks, fish adds, sand drops) — 8 clicks in 10s = max glow. Individual pulse offsets, schooling formation with jitter, activity sparks in bell when high activity. Ambient group glow radiates from school center.
- 2026-03-25: V7 — Sand simulation + Lava Lamp mode. Physics sand grains (800 max) with gravity, water drag, piling height map, neighbor spreading. Click/drag to pour. Lava lamp: rising glowing blobs with wobble, merge when close, split when large + near top, auto-spawn. Blobs have radial glow + highlight. Both toggled from Modes sub-menu in sidebar. Clear tank resets sand + blobs.
- 2026-03-24: V6 — Added 5 new decor types: Pebbles (stone cluster), Driftwood (gnarled branch), Kelp (tall swaying stalk with blades), Seagrass (thin grass cluster), Lily Pad (floating surface pad). Decor section now has toggleable sub-menu with Stones/Plants categories. Kelp/seagrass snap to floor, lily pads snap to surface, driftwood/pebbles near floor.
- 2026-03-24: V5 — Added Kraken boss. Appears when biomass > 400. 6-10 tentacles (scales with level) that grab and drag fish down. Giant eye tracks nearest fish. Strike the eye with lightning to deal damage. HP bar, level indicator. Defeated kraken retreats and returns stronger (more tentacles, more HP, faster grabs). Releases grabbed fish when hit or defeated.
- 2026-03-23: V3 — Removed chat bar, added species selector sidebar with all 7 fish types. Added 4 placeable decor types (Coral, Rock, Anemone, Crystal) with neon glow rendering. localStorage persistence for fish, decor, and feed count. Auto-saves every 10 seconds. Clear Tank button. Toggle sidebar with +Fish button.
- 2026-03-23: V2 — Added predator-prey system (fish size 16+ hunt smaller ones), neon lightning strikes on click (branching bolts scare predators away, shrink them). Predators have red-tinted aura and red pupils.
- 2026-03-23: Initial build. 7 species, canvas aquarium, chat-based feeding, Supabase realtime.
- 2026-09-26: SEO — descriptive title/meta description, schema.org JSON-LD, hidden h1.

## issues
- None currently

## todos
- Leaderboard table creation: needs `aquarium_leaderboard` table via MCP (columns: user_id uuid PK, name text, fish_fed integer, created_at timestamptz default now()). RLS: public select, authenticated upsert where auth.uid()=user_id.
- Show username label that follows the chat-spawned fish for a few seconds after spawn
- Subscriber/cheer/raid events from Twitch tags (currently anonymous IRC only sees raw PRIVMSG, no tag parsing) — different visual effects per event type
- Fish breeding (two large fish produce a baby)
- Day/night cycle
- Sound effects (bubbles, ambient)
- Double-click decor to remove it

## notes
- 9 species: Tetra, Angel, Guppy, Betta, Neon, Molly, Danio, Jelly, Data (glyph trail)
- 10 decor types in 2 categories:
  - Stones: Rock (ellipse), Crystal (faceted), Volcano (erupting), Pebbles (cluster), Driftwood (branch)
  - Plants: Coral (branching), Anemone (tentacles), Kelp (tall swaying), Seagrass (grass cluster), Lily Pad (surface)
- Kraken: spawns at biomass > 400, HP = 5 + level*2, 6+level tentacles (max 10)
- Kraken grabs fish (not jellyfish), drags them down, lightning to eye deals 1 damage
- Defeated kraken retreats for 20-35s then returns at level+1 (more HP, tentacles, rage)
- Kraken eye pupil tracks nearest fish, slit pupil design
- Bio-school: 12 small jellyfish (size 3-7), hue 170-210, school around drifting center point
- Bio-school glow: base 0.15, +0.6 from activity (clicks in last 10s / 8), +0.15 individual pulse
- Activity tracking: logActivity() called on click, fish add, sand drop — timestamps in activityLog[]
- Predator threshold: size >= 16 (red aura, red pupils, chases smaller fish)
- Big predators (35+) sluggish, lightning shrinks them by 1.5
- Lightning: branching bolt from surface to click, flickers for 0.6s, pushes fish away
- localStorage key: neon_aquarium (fish positions/sizes/species + decor + totalChats)
- Auto-save every 10s, save on add fish / place decor / clear
- Population floor: 6 fish minimum (auto-replenish if overhunted)
- Max fish: 30
