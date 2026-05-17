# dbd-tome-tracker · notes

## log
- 2026-05-17: v1.2 — **hidden hatch animation triggered by clearing all 40 challenges** per chat ask: "add a hidden hatch animation that triggers when all 40 challenges are marked complete." The Easter egg you only see when you finish a tome.
  - **Trigger**: every time `computeStats().done` ticks UP and reaches `totalChallenges`. Tracked via a `lastDoneCount` sentinel so it only fires on the rising edge (no re-fire if you toggle one off and immediately back on). Wrapped `renderStats` so the check runs after every state mutation without touching the existing handlers.
  - **Visual**: full-screen black overlay (96% opacity) with a 360×360 SVG hatch in the centre. Sequence:
    1. **0.0 s**: black backdrop fades in
    2. **0.0 – 1.4 s**: hatch flies up from below the viewport with a cubic-bezier(.34, 1.40, .50, 1) overshoot bounce
    3. **1.5 – 2.5 s**: lid hinges open — `transform-origin: 160px 30px` (top edge as hinge), rotates -118° + 10px upward translation + opacity fades to 0
    4. **2.2 – 3.2 s**: light pours out — yellow radial-gradient pit (`#fff5d0 → #ffdd80 → #ffa030`) under a vertical light shaft polygon, with a 0.16s flicker animation for that DBD spotlight-on-the-survivor moment
    5. **2.5 – 3.3 s**: large Cinzel "ESCAPE" headline fades in above the hatch with multi-layer gold text-shadow (8px + 20px + 36px bloom)
    6. **2.9 – 3.7 s**: Cormorant italic subtitle "All 40 challenges complete · the hatch awaits" fades in below
    7. **3.6 – 4.2 s**: tiny "click anywhere to dismiss" hint in mono caps
    8. Auto-dismisses after 8.2 s if untouched, or instantly on click
  - **SVG hatch**: outer dark-metal rim (`#2a2018`) with a thin inner ring, 12 rivets evenly placed around the perimeter, the lid (two concentric circles + dashed wear rings + a chunky central handle with a small dark recessed bolt). The lid lifts away to reveal the bright pit + shaft, mirroring DBD's hatch behaviour.
  - **Audio (Web Audio synth)**: 4-part orchestrated sequence over 2.5 s — bandpass-noise metallic creak (filter 420Hz Q=5) as the hatch rises, a low 50Hz sub boom on landing, another bandpass-noise creak (1600Hz Q=12) as the lid opens, then a sustained C-E-G-C swell (523/659/784/1047 Hz sines) over 2.4 s for the "escape" chord.
  - **Auto-running renderer hook**: instead of inserting checks into every action path, wraps `renderStats()` once at module init so any future state mutation that re-renders stats also re-checks the trigger.
  - File 32KB → 42KB.

- 2026-05-17: v1.1 — **streamer mode toggle with chroma-key green background for OBS** per chat ask: "add a toggleable streamer mode with a chroma key green background for OBS."
  - Toggle pill top-right: "📺 Streamer Mode" → "✓ Streamer Mode ON" when active. Persisted to `localStorage['dbd-tome-streamer']` so it survives page reloads.
  - When ON: `body.streamer` flips `background: #00b140 !important` (standard chroma key green, the same hue OBS's Chroma Key filter targets by default). Wipes the scanline `::before` overlay and the radial backdrop gradients so the green stays perfectly uniform with no bleed. Hides the lede paragraph + bottom action row so the overlay is tighter and just shows tracker UI.
  - Small "● LIVE · chroma key #00B140" status pill in the top-left while ON, so the streamer can see at a glance it's in the right mode. Border + text glow in the chroma green for emphasis.
  - The card backgrounds, stats cards, rift bar, challenge cards all keep their dark gothic styling — they're what the streamer wants visible. The green only fills the gaps between them, which OBS keys out cleanly.
  - OBS setup: drop a Browser Source pointed at this app, add a Chroma Key filter with key colour `#00b140`, similarity ~400, smoothness ~80. The dark tracker cards remain on top of your stream.

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
