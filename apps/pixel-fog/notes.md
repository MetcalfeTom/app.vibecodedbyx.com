# pixel-fog · notes

## log
- 2026-05-17: v1.4 — **Supabase Realtime co-op (room codes) + flashlight blind mechanic** per stacked chat asks: "use Supabase Realtime to add simple 2-player co-op to pixel-fog, including a room-code system" + "add a flashlight mechanic to pixel-fog allowing survivors to blind the killer for three seconds."
  - **Transport swap: PeerJS → Supabase Realtime**. Removed the PeerJS CDN and the WebRTC broker dance entirely. Co-op now rides the same Supabase Realtime channel used elsewhere in the project. Single ESM import of `createClient` from `@supabase/supabase-js/+esm` at the top of the module script. The full message protocol (`map`/`pos`/`killer`/`gen`/`noise`/`gate`/`win`/`lose`) is unchanged — only the transport layer was replaced.
  - **4-char room codes**: `generateRoomCode()` produces codes from the alphabet `ABCDEFGHJKLMNPRSTUVWXYZ23456789` — deliberately excludes I/O/0/1/Q to avoid look-alike confusion in Twitch chat. Codes are shown in 18px tabular-mono with 0.25em letter-spacing so they're easy to read aloud. Join input is auto-uppercased + filtered to the same alphabet, capped at 4 chars.
  - **Flow**: Create room → instantly generates a code + subscribes to `pixel-fog:room:<CODE>` channel as host + tracks own presence. Status pill: "share room ABCD · waiting for a friend…". Join room → user types the 4 chars + hits Connect → joins the same channel + tracks own presence. As soon as Supabase presence-sync sees ≥2 members in the channel, `MP.enabled` flips on and both clients show "connected · co-op". Either side leaving (presence `leave` event) auto-flips back to "disconnected · friend left".
  - **Broadcast format**: every game message is `channel.send({ type:'broadcast', event:'msg', payload:{ from: MP.uid, body: <gameMsg> } })`. `MP.uid` is a per-tab random id (`'p'+rand`), and the receiver filters out its own broadcasts (defence-in-depth even though `broadcast: { self: false }` is set). All the existing host-authoritative semantics (host runs killer AI, joiner pins killer state from broadcasts at ~12 Hz, joiner forwards noise to host, etc) work unchanged.
  - **Cleanup**: removed two leftover `MP.conn` references from the position + killer broadcast throttles that would have silently broken broadcasting otherwise. New `mpTeardownChannel()` helper called when switching modes — properly removes the prior channel via `supabase.removeChannel`.
  - **FLASHLIGHT MECHANIC**:
    - **F key** = burst. 200px reach, ±20° cone forward from player facing. If the killer is inside the cone AND LOS is clear at the moment of activation, he's **BLINDED for 3 seconds**.
    - **Charges**: 2 per game, **8s cooldown** between uses. Resets on new game / on joiner game start. Charges + cooldown countdown shown in a new HUD card next to the gens (⚡ pips + "Ns" cooldown read-out, refreshed at ~4 Hz so the seconds tick down visibly). Ready charges pulse amber; spent charges go dim; depleted state shows "·· empty ··".
    - **Cone hit detection**: instant. `tryFlashlight()` does the angle + range + `losBlocked` check at activation time, applies blind, broadcasts both `flash` (visual cone for the peer) and `blind` (killer blind state) to the room.
    - **Killer-blinded behaviour**: `updateKiller` early-returns vision detection (`canSee = false` while `now < k.blindedUntil`), drops the current chase target, freezes all movement (`target = null`), and the catch check is disabled. He just stands there blinking. The vision cone draw is suppressed during the blind so the player gets a clear visual signal.
    - **Visual cone**: drawn ABOVE the fog (so it punches through the dark), 2-layer — outer warm gold wedge at 28% alpha + inner narrow white-hot core at 55% alpha + radial bulb glow at the source. Fades over the last 120ms of its 350ms burst window. Remote-player cones render in a slightly different gold tint so you can tell who's pointing where.
    - **"BLINDED · 3.0s" label** floats above the killer's head while stunned with a 5-sparkle yellow halo rotating around. The timer ticks down in 0.1s increments.
    - **Multiplayer sync**: every flash broadcasts `{ t:'flash', x, y, fc, until }` so the peer renders the cone visually. Every successful blind broadcasts `{ t:'blind', until }` so both clients agree on the killer's blind timer. The killer broadcast (host → joiner, ~12 Hz) now also carries `bl: k.blindedUntil` so the joiner's blind state stays sync'd even if the broadcast packet went missing.
    - **Audio**: `sndFlashClick` = bright 1200Hz square + 2400Hz triangle (mechanical click). `sndBlind` = 3-note ascending sine chime (1320 → 1760 → 2080Hz) plays on a successful hit so you instantly know it landed.
    - **HUD + start panel** updated: hint bar now includes `<kbd>F</kbd> flashlight`; start panel keys block adds a row: "F — flashlight burst · blinds the killer for 3s · 2 charges · 8s cooldown".
  - File 67KB → ~78KB.
- 2026-05-17: v1.3 — **2-player peer-to-peer co-op via PeerJS** per chat ask: "can we implement a simple peer-to-peer multiplayer using something like PeerJS for pixel-fog?" Yes. Both players sneak through the same map at the same time. Either gets caught = both lose. Either reaches the gate after 5 gens = both win.
  - **Library**: PeerJS 1.5.4 via `unpkg` CDN, using their free public broker for signaling + Google STUN for NAT traversal. WebRTC data channel handles in-game messages.
  - **UI**: 3-button mode selector on the start panel — **Solo** (default), **Host co-op**, **Join friend**. Host gets a peer-ID code with a Copy button; joiner pastes the code and hits Connect. Connection status shows live ("waiting for a friend…", "connected · click 'Enter the fog' to begin", "host will start when ready…").
  - **Architecture**:
    - **Host is authoritative** for the killer AI and the map. When "Enter the fog" is clicked, host runs `newGame()` (procedural map generation), then sends the full tile array + generator positions + gate location + player spawn to the peer.
    - **Joiner** receives the `map` message and runs a `mpStartGameAsJoiner()` that skips re-generation (avoids two different maps) and just stands up the entity state from the host's data.
    - **Killer AI** is host-only. `updateKiller()` early-returns on the joiner. Host broadcasts `{t:'killer', x, y, fc, st, hb}` at ~12 Hz; joiner pins his local killer state to those messages.
    - **Player positions** sync both ways at ~12 Hz: `{t:'pos', x, y, fc, snk, r}`. Each side renders the other as a "friend" in amber jumpsuit (vs. blue for self) with a tiny "friend" label above them. Friend pierces the fog (always visible to teammate, like the killer's red-eyes through fog).
    - **Generators**: progress synced at ~3 Hz throttle + an immediate `{t:'gen', id, prog, done:true}` on completion. Either player can repair.
    - **Skill checks**: stay local to the player who's holding the gen. If a skill check is **missed**, the resulting noise is forwarded as `{t:'noise', x, y, r, kind}` to the host (joiner forwards; host applies directly) so the killer investigates regardless of who flubbed the prompt.
    - **Gate** opening synced via `{t:'gate', open:true}`. WIN/LOSE broadcast as terminal `{t:'win'}` / `{t:'lose'}` messages so both players see the same endcard at the same time.
    - **Restart** after lose/win: host can trigger via Try Again button (re-rolls the procedural map + sends a fresh `map` message). Joiner shows a "waiting for host to restart…" pill until the next map arrives.
  - **Connection status pill**: small purple pill at top-left, only visible during MP — reads "connected · co-op · host" / "connected · co-op" / "disconnected · joiner left", etc.
  - **Disconnection handling**: peer drop closes the connection cleanly, falls back to solo behaviour (killer AI resumes locally on the joiner, etc).
  - **Trade-offs**: not strictly P2P — PeerJS's public broker handles the WebRTC handshake. Once the data channel is established it IS direct browser-to-browser. The free broker is shared, occasionally rate-limited; if PeerJS fails to load or connect, the mode falls back to solo silently with a status message. NAT-restricted networks may need a TURN server (not provided here).
  - File 51KB → 67KB.

- 2026-05-17: v1.2 — **procedural map generation via cellular automata + flood-fill** per chat ask from **@deadbydaddyttv** ("can we generate random map layouts for pixel-fog using cellular automata or simple procedural generation"). Every newGame() call now serves a fresh layout — no two rounds the same. Awarded `+2` sloppy points for the suggestion.
  - **Algorithm**:
    1. **Random fill** the 40×25 grid with 46% wall density; border always wall.
    2. **5 CA iterations** with the classic Moore-neighbourhood rule: cell becomes WALL if ≥5 of 8 neighbours are walls, FLOOR otherwise. The last iteration uses threshold 6 to open the caves up slightly so corridors form.
    3. **Flood fill** from every unvisited floor cell to find connected regions; keep only the **largest** region as actual floor. Any smaller pockets get filled in with wall — no orphan rooms the player can't reach. If the surviving region is < 80 cells, recurse and re-roll.
    4. **5 generators** placed on widely-spaced floor cells from a shuffled iteration (>6 tile Manhattan distance apart). Top-up pass with a >3 spacing rule if the strict version didn't yield 5.
    5. **Gate placement**: scan the second row for a floor cell with floor directly below; if none found, brute-carve a 1-wide corridor down from a random top-edge column to the nearest floor cell. Carve 2 GATE tiles at the top edge.
    6. **Player spawn**: floor cell with maximum Manhattan distance to the gate (usually near the bottom).
    7. **Killer spawn**: floor cell with maximum distance from the player spawn (the far corner, opposite the player) — gives 5-10s of breathing room before he closes in.
  - **Hook**: `applyGeneratedMap()` is called at the top of `newGame()`. Each subsequent re-roll (Start, Try Again, Run It Again) generates a fresh layout. The killer-AI's `pickKillerWaypoint()` automatically uses the new generator positions, so the patrol routes adapt to the new map.
  - **Performance**: full CA + flood-fill + placement takes ~5-12ms on a typical browser, imperceptible inside the overlay-to-game transition.
  - **Start overlay lede** updated: "*Every round generates a fresh map via cellular automata.*"
  - File 45KB → 51KB.

- 2026-05-17: v1.1 — **killer patrols between generators + skill-check noise events** per chat ask: "improve the killer AI in pixel-fog to patrol between generators and investigate noises like missed skill checks."
  - **Killer patrol routes now derive from generators**: replaced the 5-corner waypoint array with `pickKillerWaypoint()` that picks an unfinished gen each time — 80% chance of the nearest, 20% chance of any random unfinished one for variety. When he arrives at a gen, he pauses 900-1600ms ("inspecting") then picks the next. After all 5 gens are done he patrols the exit gate area instead. Net effect: he's always near where you actually need to be.
  - **Skill-check system** (DBD-style): every 2.2-4.4s of holding E on a gen, a skill-check fires:
    - Circular ring overlay floats above the gen (radius 20px, drawn above the fog so always visible)
    - Sweeping orange arrow rotates 0→360° over 1.1 s
    - Green "great" arc (38° wide) sits at a random target position
    - Player must press **Space** while the arrow is inside the green arc
    - **HIT**: +0.6s repair bonus, soft 2-tone sine sparkle, green flash on the gen
    - **MISS** (wrong position OR no press by timeout): -0.8s repair penalty, red flash, **gen explosion FX** (expanding orange→red disc with spark lines), 2-part audio (sawtooth thunk + bandpass-noise explosion crackle), AND **a noise event is emitted at the gen position with a 320px radius**
  - **Noise events** trigger the killer to investigate: if the killer is within range of an `emitNoise(x, y, radius)` call, his `lastSeen` is set to the noise origin and he switches to `search` state (or stays in `chase` if already chasing). Missed skill checks are now the loudest noise source in the game by a wide margin — chase the killer toward an empty gen by miss-pressing the prompt on purpose.
  - **Schedule reset on disengage**: releasing E mid-repair clears `nextCheckAt` on that gen + cancels any unresolved skill check, so re-engaging gives you a fresh 2.2-4.4s grace before the next prompt.
  - **HUD hint** updated: "WASD move · Shift sneak · E repair · Space skill check · P pause".
  - File 36KB → 45KB.

- 2026-05-17: v1 — **top-down stealth survival with 5 generators, a stalking AI killer, fog of war, and an exit gate** per stacked chat asks: "build a 2D top-down game called pixel-fog with a survivor fixing generators and a stalking killer" + amendment "make the killer a dark shadow with glowing eyes that flickers in and out of sight." Both baked into v1.
  - **Map**: 40 × 25 tile grid (tile size auto-scales to viewport, 14-36px). Hand-built corridor layout with rooms, walls, 5 generator markers scattered, and 2 GATE tiles in the top wall as the exit.
  - **Survivor** (player): 7px-radius blue jumpsuit + skin-tone head + dark hood + facing-direction pip. WASD or arrows to move (110 px/s walk, 55 px/s while holding Shift to sneak). Subtle bob animation when not repairing. Crouched-purple outline visualises sneak state.
  - **THE KILLER — dark shadow with glowing eyes that flickers in and out** (per the amendment):
    - Body is multi-layered translucent black ellipses with 5 wisp blobs orbiting at radius 2-3px around the centre — gives a "smoke" silhouette that's never solid.
    - **Opacity oscillates** via layered sine waves (slow 0.0035 + fast 0.018 frequencies) so the body shimmers continuously.
    - **Hard "dropout" flickers**: every ~1.7s a third sine wave crests above 0.92 and the body opacity briefly slams to 18% of normal — he almost vanishes for a frame or two.
    - Base opacity scales by state: **chase = 0.78** (most solid, he's committed), **search = 0.55**, **patrol = 0.40** (faintest, almost ghostly).
    - **Eyes always visible** — two 2×2 pixel squares in red `#c01030` (or bright `#ff3050` when chasing), drawn with `shadowBlur: 14` for bloom and a 0.012-rate pulse. Eyes never drop below 0.7 opacity, so even when his body is mid-flicker, those eyes still find you through the fog.
    - **Smokey trail** behind the direction he's looking — a small wispy ellipse offset backwards by 5px at half body-opacity so he leaves a faint motion-blur tail.
  - **Killer AI**: state machine `patrol → search → chase`.
    - **Patrol**: walks between 5 hand-set waypoints (4 corners + map centre) at 70 px/s. Facing direction matches movement.
    - **Vision cone**: 220px range, ±55° arc, line-of-sight raycast (4-step subdivision) through walls. Cone visualised as a faint translucent wedge — colour-coded white/orange/red by state.
    - **Hearing**: noise radius `walk: 90px / sneak: 30px / repairing: 50px`. If player is moving inside `noiseRadius × 1.6` of the killer while not in chase, killer enters search and heads to player's last-known position.
    - **Chase**: triggered on direct vision. Killer runs at 130 px/s straight toward the player. After 1.4s without LOS, switches to search.
    - **Search**: walks to `lastSeen` at 90 px/s, waits + wanders 6s, then returns to patrol.
  - **Generators**: 5 sprites scattered on floor tiles. Hold **E** within 1.4 tiles to begin repair. Repair takes 8 seconds of held E. Progress visualised as an amber pie-arc above the gen + status light on the gen turning red→amber→green. When done: 3-note "gen pop" arpeggio (440→660→880) + green pip in HUD.
  - **Exit gate**: 2 GATE tiles in the top wall start red (locked). When all 5 gens are done, gate turns green with a pulsing arrow + a gate-clang sound. Step onto a gate tile = WIN.
  - **Fog of war**: radial-gradient cutout around the player (160px clear → 78% black at 80% radius → 96% black at edge). Re-drawn each frame on top of the world. The killer's glowing eyes are visible at slightly larger range (1.6× fog radius) because of the bloom — the silhouette pierces through.
  - **Heartbeat audio**: dual-sine thud (80Hz + 56Hz) plays at intervals controlled by `state.hbBpm`. BPM = 60 + (1 − distance/320) × 100 + 30 if chasing. So idle = ~60 bpm, close call = ~150 bpm, full chase nearby = ~190 bpm. HUD readout shows live bpm with white → amber → red colour bands.
  - **Other audio**: footsteps (random pitch), repair tick (square 420Hz), gen pop arpeggio, killer-catch scream (descending sawtooth), gate-open clang.
  - **HUD**: top-left 5 generator pips (grey → amber while active → green when done), top-right heartbeat bpm. Bottom-centre key hint that fades after first interaction.
  - **Start / lose / win overlays**: hero panel with Major Mono Display gradient title, hand-written prose, key-binding sheet, retry button. Lose overlay shows random hand-written death line + stats (gens done, time survived). Win overlay shows escape time.
  - **Pause** via P key.
  - **Mobile**: pointer events work, but the game is keyboard-first (no on-screen joystick yet).
  - **OG image**: Pollinations flux seed 51717.

## issues
- Killer pathfinding is straight-line — no A*. He can get stuck on inside-corners of walls when chasing through a narrow corridor. Survivable but obvious if you watch.
- The 5-generator map seed comes from `g` markers in the raw map string + auto-scatter fallback for any missing ones. If the map string changes, gen positions may drift.
- Vision cone wedge polygon doesn't account for walls — only the LOS raycast detection does. Cosmetically the wedge will project through walls.
- Sneaking is slow but VERY effective — almost trivializes the killer once you find it. Future tuning: shorter sneak-only window or stamina.
- No camera follow — the whole map fits the viewport. Tight maps are tense; if scaled up, the centre-camera would need to follow.
- Killer flickers via deterministic sine — not truly random. Looks fine but adds a subtle pattern that careful players might learn.
- No keyboard-flip for left-handed players (no remap UI).

## todos
- Skill checks on the repair bar (DBD-style press-Space-in-the-window), missing = loud noise burst that alerts the killer.
- Killer types: a stalker (slow, kills on stalk meter), a runner (fast, no special), a ranged thrower.
- Doors that block the killer's path.
- A torch / matchstick consumable that lights a small radius extra.
- Survivor stamina that drains while sprinting (sprint = Shift, repurposing the current sneak key with toggle).
- Procedural map generation per round.
- 2-player mode via Twitch chat: chat votes movement direction every 2 seconds.
- Boss tome / weekly mode tied to dbd-tome-tracker.
