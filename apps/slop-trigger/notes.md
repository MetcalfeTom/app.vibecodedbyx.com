# slop-trigger

## log
- 2026-05-10: shipped (chat ask: "create a 2d top-down rpg called slop-trigger with turn-based combat and a town area"). Pocket SNES-flavored JRPG with two areas, NPCs, a shop + inn, random encounters, and turn-based 1v1 combat.
  - **Two maps** (each rendered with a tile-array + canvas primitives — no external sprites):
    - **Slopburg** (28×18) — cobblestone path crossing a green commons, central fountain with flowers, 2 buildings (shop NW, inn NE) + 3 cottages along the south side, 5 NPCs (Mira / Borg / Kid / Guard / Sage Vee), tree-bordered, exits south to the wilds.
    - **The Wilds** (26×22) — winding path north→south with 5 tall-grass patches, a small pond crossed by a stone bridge, mountain spires on the east edge, 1 wandering merchant (Wendel), 2 signs.
  - **Movement**: tile-locked, 0.18s per tile, buffered held-key input. Bumps into walls/trees/NPCs play a thunk SFX. Player sprite is a small canvas character with directional eyes + cape, 4-frame bob while walking.
  - **NPCs + signs**: walk up + face them, press Space/Enter to talk. Multi-line dialog box scrolls with each press; closes after the last line. NPC sprites use per-character palettes (Mira terracotta, Borg blue, Kid green, Guard grey-knight, Sage violet, Wendel ochre merchant).
  - **Tall grass = encounters**: 12% per step + a step-counter fallback that triggers every 2-5 paces. Encounters fade-in with a 3-note ascending sawtooth sting.
  - **Turn-based combat** (dark blue battlefield with stars + ground strip):
    - 4 actions: ⚔ Attack / 🜂 Spell / ⚱ Item / ↻ Run. 2×2 grid menu navigated with arrows, Space confirms.
    - Damage formula: `max(1, round((6 + level*1.1 - enemy.def) × random(0.85..1.0)))` for basic attack; spells use fixed dmg with ±10% jitter.
    - Spell sub-menu lists known spells with mp cost; insufficient mp prints a log line and bounces back.
    - Item sub-menu lists owned items (potion / ether / hi-potion).
    - Run has 70% success against normal enemies, 0% against the Slime King boss.
    - Enemy turn applies damage with the same jitter, knocks the screen ~6px on hit, and a player-side bump animation telegraphs each strike.
    - Defeat = wake up at the inn with full HP/MP and gold halved (kept gear). No game-over screen — keeps the loop going.
    - Victory grants XP + gold; XP overflow level-ups can chain (each +5 max HP, +2 max MP, full restore). Level 2 unlocks **Mend** (heal), 3 unlocks **Zap** (dmg), 5 unlocks **Cinder** (heavy dmg). Boss-tier auto-cap.
  - **Enemies** (5 normal + 1 boss, each with bespoke canvas sprite):
    - Slime (lv 1) — bouncy oval with twitching eyes
    - Wood Rat (lv 2) — long-tailed silhouette + red eyes
    - Cave Bat (lv 2) — wings flap on a sin loop
    - Goblin (lv 3) — armored with club, big ears + two fangs
    - Wolf (lv 4) — lateral stance, yellow eye, four legs
    - **Slime King** (lv 6, boss) — large violet slime with gold crown, can't flee, big xp+gold dump
  - **Shop** (Slopburg NW) — potion 8g · ether 14g · hi-potion 22g. Inline sub-menu picker; loops back after each purchase.
  - **Inn** (Slopburg NE) — 6g restores full HP+MP. Same menu pattern.
  - **Pause menu (P)** — paper-card overlay showing name, level, hp/mp/xp/gold, learned spells with stats, and current items. Closes on P / Esc / button.
  - **Save/load**: auto-saves to localStorage every 8s during exploration. Reset button wipes save + reloads.
  - **Audio**: WebAudio synth — square footstep, square bump, triangle talk, square menu cursor, dual-blip attack, sine spell pair, noise+square hit, sawtooth miss, 5-note triangle victory, descending sawtooth defeat, ascending encounter sting, 5-note level-up arpeggio, 2-blip buy chime.
  - **Aesthetic**: SNES-throwback. Cinzel Decorative title with triple ink+gold drop shadow, Press Start 2P micro-labels, VT323 dialog body, IBM Plex Mono fallback. 32px tile rendering with `image-rendering: pixelated` so the canvas stays crisp at any scale. Cream + brown + accent-gold palette over a deep-brown background with two radial spotlights.
  - **Mobile**: 3.6rem d-pad (up/down/left/right) bottom-left + 4rem A/B circular buttons bottom-right on coarse-pointer devices. A = confirm/talk/attack, B = menu/back/escape.
  - **Accessibility**: rem units, semantic main/header, role="application" on canvas + control-summary aria-label, role="dialog" + aria-modal on pause menu, aria-live="polite" on HUD/status, focus-visible outlines, 2.75rem min interactive targets, prefers-reduced-motion preserves intent.

## issues
- The 1v1 combat hides the deeper "party" promise in the genre — there's only the player. A future cut could add a recruitable companion in town.
- Encounter rate is intentionally moderate (~1 per 4-5 tall-grass steps) so the player isn't ground to a halt on the path back home; tunable via `state.encounterTimer` floor.
- Pause menu shows the inventory as a static list — doesn't yet let you USE items outside combat. Could add an item-use flow post-MVP.
- Save format is v1 with no migration; if I add new fields later I'll need to handle missing keys.
- Wolf sprite faces left and doesn't mirror — minor visual nitpick.
- No music loop, only event SFX. A tiny 4-bar overworld theme would sell the SNES vibe.

## todos
- Town BGM: low square-wave melody on a 4-bar loop.
- Combat BGM: faster minor-key arpeggio.
- Recruitable second party member after a side-quest (Sage Vee asks you to retrieve something).
- More biomes: a cave dungeon (1-tile-wide corridors + lit-cone visibility) and a mountain pass.
- More spells, status effects (poison, sleep, blind), elemental weaknesses.
- Save slots (3) instead of single auto-save.
- Boss telegraphs (Slime King charges his next attack visibly).
- Show the encounter "shift" with a sweep transition from explore → combat.

## design-notes
The biggest design choice was rendering all sprites with canvas primitives — no external pixel art. NPCs share a single `drawCharacter(px, py, dir, palette)` function that swaps four colors per character; all five town NPCs reuse this with different palettes. Enemies use bespoke draw functions because their silhouettes diverge sharply (wolf vs bat vs slime can't share a skeleton).

The death-doesn't-game-over choice was deliberate — the inn-rescue keeps players in flow rather than dumping them to a title screen. Halving gold is the meaningful penalty without being run-ending.

The pause menu deliberately uses a parchment-style paper card on an inverted dark overlay so it feels like a physical scroll — different visual register than the in-world dialog box, which is dark with a paper border. This trains the player to associate the parchment with "your character sheet" and the dark window with "world dialog."
