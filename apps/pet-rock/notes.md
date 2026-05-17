# Pet Rock

A digital pet rock that sends passive-aggressive messages and refuses to move.

## log
- 2026-05-17: v2 — **persistent rock name + digital-gravel feeding mechanic** per chat ask: "build a pet-rock simulator where users can name their rock and feed it digital gravel." Project already had this app so I iterated on it (depth-over-breadth convention) instead of building a parallel one.
  - **Persistent name**: new `nameplate` button above the rock. Click to rename via `prompt('What is your rock called?', 'Rocky')`, 24-char cap, persists to `localStorage['pet-rock-v2']`. The Rename action button also opens the prompt 800ms after the rock's snarky "naming rocks" line types out. Initial boot greeting now reads "Oh. **Rocky** here. (You named me. I remember.) Great." if a name exists.
  - **personaliseWithName(msg)**: 40% chance per message to splice the rock's name into responses. Replaces leading "I'm/I am/I" with "Rocky's/Rocky is/Rocky", or appends a "— Rocky" signoff to shorter lines. Naming actions skip the splice so the rock can still complain about being named.
  - **🪨 Feed Gravel** — new 9th action button (Feed and Gravel are distinct; the original generic Feed remains for "you can't feed a rock" snark, Gravel is the act of literally piling pebbles on it):
    - Each press spawns 6-9 little ellipse pebbles via DOM elements with a `gravelFall` cubic-bezier keyframe (0.7s: translate from -120px above the rock down to a settled position around the base, with start/end rotation jitter ±360°). Pebbles use 3 colour variants — warm-grey / pale-tan / deep-charcoal radial-gradient ellipses with subtle inner-shadow + 1px drop shadow.
    - Settle position: random angle on an arc (`-π × (0.05 + rand × 0.90)`) around the rock base with radius 38-70px, slight y-jitter. Forms a believable scattered pile around the rock's foot.
    - 60-piece visible cap (oldest evicted via `removeChild(firstChild)`). Running `gravelCount` total is unbounded + persisted.
    - 12 hand-written `MESSAGES.gravel` responses spliced into the existing typewriter system: "Oh. You actually went and got the gravel. I was joking. Mostly." / "Gravel. My people. I will not eat them but I welcome the gesture." / "I now have N pebbles of mineral content. Statistically I am 0.01% richer." / "Geologically speaking, this is what we call 'a heap'. Thank you for the heap." (etc — full pool of 12). The "N pebbles" placeholder substitutes the live count.
  - **Mineral content** stat: 0-100%, climbs +0.05% per gravel pebble (so reaching 100% takes 2,000 pebbles ≈ 250 feeds — a long-term goal). Shown in red on a new substats line under the existing stats: `gravel pile: 47 pebbles · mineral content: 2.35% · rocks per rock: 1`.
  - **Persistence schema** (`pet-rock-v2`): `{rockName, interactionCount, moveAttempts, gravelCount, mineralContent}`. Saved on every action via `persist()`. On reload, `restorePileFromCount()` re-renders the visible pile (up to 60 pebbles, no fall animation — they're already there) so the rock looks like the pile you left it with.
  - **HTML/CSS additions**: `.nameplate` button (paper-coloured chip with offset shadow, hover red), `.gravel-layer` absolute-positioned div inside the rock container, `.gravel` + `.gravel.v2` + `.gravel.v3` colour variants, `.substats` line below the original `.stats`. No layout shifts.
  - **Rename action** semantics: clicking the "Rename" action button (was "Name" — kept the position but updated the label) triggers the standard MESSAGES.name snark first, then opens the rename prompt — natural two-step flow that preserves the personality joke of "you want to name ME?" while still doing the actual naming.
- 2026-02-14: Initial build. CSS rock with eyes, speech bubble with typewriter effect, 8 interaction buttons with ~80 unique messages. Move escalation system (12 unique refusals then counter). Drag/swipe on rock triggers move refusal with shake animation. Idle messages after 12-20s. Courier Prime typography, warm paper/stone palette.

## issues
- None yet

## todos
- Could add seasonal mood changes
- Rock aging system (cracks over time)
- Share your rock's best quotes

## notes
- No database — pure frontend personality simulator
- 8 actions: Pet, Move, Feed, Talk, Play, Name, Compliment, Ignore
- Each action has 6-13 unique passive-aggressive responses
- Move has an escalation system — unique responses for first 12 attempts, then a counter
- Rock eyes react: squint on hover, narrow when annoyed, wide when shocked
- Drag/swipe on rock = move attempt (shake animation + refusal)
- Idle timer sends unprompted snarky messages every 12-20s
- Stats track interactions, move attempts, and "moved: never"
