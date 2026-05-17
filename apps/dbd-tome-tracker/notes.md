# dbd-tome-tracker · notes

## log
- 2026-05-17: v1 — **Dead by Daylight tome tracker dashboard for @deadbydaddyttv** per chat ask: "can we create a web-based Dead by Daylight tome tracker dashboard for +deadbydaddyttv." Shipped at `/dbd-tome-tracker`. Generic enough that any DBD player can use it (challenges are user-editable), with a small streamer-shoutout in the header.
  - **Aesthetic**: dark gothic dashboard with subtle scanline texture, Cinzel serif headers for the medieval-tome feel + Cormorant Garamond italics for the tome name, IBM Plex Mono for tabular numerics and labels. Palette: black `#0a0708` / cream `#e8d8b0` / blood-red `#a72727` / amber `#d99030`. Each stat card has a 3px left border in the relevant accent colour.
  - **Header**: "DBD **Tome** Tracker" with clickable tome-name subheader (defaults to "⚯ Tome XX · The Watchful Hour", rename via prompt). Lede: "Made for **@deadbydaddyttv**" with the handle in glowing red.
  - **Stats strip** (5 cards): Challenges done / 40 with % delta, Rift fragments (3 per completion, red), Bloodpoints earned (30k per completion, cool blue), Rift tier / 70 with "X fragments to tier N+1" delta, Levels finished / 4. All numbers tabular-numeric.
  - **Rift progress bar**: gradient red→amber bar with 10 inset tick marks (one per fragment), tier label + fragment count above, % of next tier + "N fragments to tier N+1" below. Glowing when filling.
  - **4 level tabs** across the top: each shows the level name + a `N/10` count pill that turns green when the level is fully complete. Active tab gets a red underline + slight red bg wash. The active level's challenges render below.
  - **10 challenge cards per level** in a 2-col grid (1-col on mobile):
    - **Type icon** (⚡ general / 🩸 survivor / 🔪 killer) — clickable, cycles through types
    - **Name** — fully editable inline (focus the input, type, blur to save; 80-char cap)
    - **Progress bar** with `progress/max` numeric (clickable to set a new max via prompt)
    - **+ / − buttons** to tick progress one at a time; reaching `max` auto-marks the challenge done
    - **Done button** toggles completion (with full progress) regardless of current count
    - **✕ delete button** removes the slot (with confirm)
    - Reward line at the bottom: "Reward: 30,000 BP · 3 rift fragments" → switches to "✓ collected · 30,000 BP · 3 rift fragments" when done
    - Done challenges turn green with strike-through name, completion count pip + amber +/+3 burst at the cursor on completion, and a toast slides in from the bottom: "+30,000 BP · +3 fragments · <challenge name>"
  - **Inline level controls**: rename level, reset level progress (clears ticks + done flags but keeps names).
  - **Bottom actions**: New tome (full reset with confirm), Export JSON download (`dbd-tome-YYYY-MM-DD.json`), Import JSON file picker (validates the import has 4 levels before accepting).
  - **Persistence**: `localStorage['dbd-tome-v1']` JSON snapshot on every change. Defensive parse falls back to a fresh template if corrupted.
  - **Default seed**: 4 levels named "Foreboding / Tension / Dread / Final Reckoning", each with 10 placeholder challenges that cycle the 3 types. Player renames as they go.
  - **OG image**: Pollinations flux seed 27270.

## issues
- We can't ship the real current-tome challenge names (they're copyrighted and change every ~3 months) — so the slots are user-editable placeholders. The streamer pastes / types in their current tome's challenges manually.
- Rift tier is computed purely from challenge completions (3 fragments × done). In-game you also earn fragments from XP / matches; that's not modelled. If you finish all 40 challenges you'd be at tier 12 by this counter alone — the full rift is 70 tiers.
- Type cycling is by click (no keyboard shortcut). Quick for streamers but no dropdown for accessibility.
- Bloodpoint reward per challenge is hard-coded at 30,000 — real challenges vary (some give 25k, some 50k). Could be made per-challenge editable.
- No drag-to-reorder challenges within a level.

## todos
- Per-challenge "notes" field (for "remember to bring Build A").
- Drag to reorder.
- Variable BP rewards per challenge (some tomes have 25k / 50k / 75k mixed).
- Templates: pre-fill placeholder names for survivor-heavy / killer-heavy / balanced grinds.
- Auto-prompt to back up to JSON every Sunday.
- Visual timeline of when each completion happened.
- @deadbydaddyttv has a profile pic he could drop into the header — could add a small "stream avatar" field.
- Daily / weekly challenge tracker as a separate panel (DBD also has those alongside tomes).
- A "rate this tome" 1-5 stars field at the top for the streamer's vibe-check.
