# sloppyscape (SloppyScape)

## log
- 2026-07-03: **Tutorial Tim + yew grove + total contextmenu capture** (chat asks). (1) **Yew grove**: densest tree cluster (max neighbors within ±4 tiles) converted to `kind:'yew'` — darker/flat-topped render, own examine lines ("worth 175 xp somewhere else"). (2) **Tutorial Tim**: goblin NPC on his own procedural LPC-layout sheet (`gobSheet`, short body via +12px offset, big ears, teeth, and the load-bearing tiny red hat w/ gold pom on ALL facings). Patrols within ±5 tiles of the grove anchor: idle 1.2–4.4s → random walkable target → BFS path at 55px/s, path cap 26. Cyan name tag. **Talk-to**: left-click Tim or right-click → 'Talk-to Tutorial Tim'; if >1.6 tiles away, pathfinds to nearest adjacent tile and delivers on arrival (`pendingTalk`, cleared if you click elsewhere). 7 rotating tutorial-parody lines (green .tim chat color) + face-the-player on talk; Examine: "A goblin. The hat is doing a lot of work." Ambient mutters every ~9–17s at 55% when player ≤5 tiles. (3) **contextmenu never escapes** (follow-up ask): preventDefault document-wide + explicitly on the #ctx container (with stopPropagation) — chatbox/HUD/menu right-clicks all swallowed. Verified: syntax + stub-DOM boot.
- 2026-07-03 (inisso feedback): **world/player scale + right-click menu**. (1) Player now drawn at 1:1 sheet scale (32×48, was ×1.5) with smaller shadow + retuned name-tag offset; trees roughly doubled (32px trunk, 23px canopy + underlayer — ~2× player height) and rocks widened to ~30px, bigger shadows. World reads big, player reads small, RS-correct. (2) **RS-style right-click context menu**: canvas contextmenu → preventDefault + beige/brown 'Choose Option' menu at cursor (viewport-clamped) with Examine <b>Tree/Rock</b> / Walk here / Cancel (Walk here only on plain tiles). Input refactored into shared walkTo()/examineProp()/tileAt(); left-click path unchanged; menu closes on outside press, Esc, blur; role=menu/menuitem. Verified: syntax + stub-DOM boot.
- 2026-07-03: shipped v1 (chat ask: "2D top-down RuneScape-like, blank green island the player spawns on, using Universal LPC Spritesheet Generator for character sprites"). **LPC caveat**: external asset downloads aren't possible from this sandbox (and apps must be self-contained), so the character sheet is **procedurally generated at boot in the LPC walkcycle LAYOUT** — 4 rows (up/left/down/right, LPC row order) × 4 frames, 32×48 per frame, drawn to an offscreen canvas (skin/hair/green tunic/pants/boots, leg+arm swing per frame, per-facing hair/eyes). Swapping in a real LPC PNG later = replace `sheet` and the row/frame constants — the renderer already speaks that format.
  - **Island**: 72×72 tiles (32px), deterministic (seeded mulberry32 + value noise + radial falloff): water/sand/grass/dark-grass. ~180 props (trees ×3 variants, rocks ×2) scattered on grass, blocking.
  - **RuneScape essentials**: click-to-walk with **yellow X marker** (red X when unreachable), BFS pathfinding over the walkable grid, path-following at 110px/s with 4-dir facing + 4-frame walk anim, camera lerp-follow, y-sorted rendering (walk behind trees), gold name tag ("Adventurer"), **examine**: clicking a tree/rock walks adjacent + prints RS-flavored examine text ("It's a rock. Geology's greatest hit.") into an RS-style parchment **chatbox** (All·Game bar, scrolling log, 40-line cap). Water shimmer + grass speckle. "You can't walk on water. Yet."
  - Mobile: tap = walk (pointerdown), no extra controls needed. Pixelify Sans UI, pixelated rendering.
  - WCAG: canvas role=application with control summary, chatbox role=log aria-live=polite.
  - Verified: JS syntax OK + boots without throwing in a stubbed-DOM vm run.

## issues
- BFS is plain queue (uniform cost) — fine at 72×72; upgrade to A* if the map grows.
- Character sheet is LPC-format but not LPC-sourced (sandbox can't download the generator's assets). If a real spritesheet ever lands in the repo, drop-in swap.
- No persistence yet — position resets on reload.

## todos (v2 candidates — ask chat)
- Woodcutting/mining skill ticks (chop tree → logs + xp drop popup).
- Inventory panel (RS 28-slot grid).
- Name your adventurer (localStorage).
- Multiplayer presence via Supabase Realtime (see other players walk).
- Music: soft harp loop (Web Audio).
- A single quest with a yellow ! NPC.
