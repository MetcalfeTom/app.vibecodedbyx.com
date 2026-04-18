# Wildcrest

## log
- 2026-04-18: Created. Top-down creature battle game in the vein of Pokemon. Self-contained canvas game (768×528, scales responsively via aspect-ratio 16/11). 5 original creatures with 5-type rock-paper-scissors-ish chart (spark beats tide, tide beats flame, flame beats leaf, leaf beats tide+stone partial, stone beats spark+flame partial). 24×16 hand-drawn ASCII map with grass/tall-grass/path/water/tree/flower tiles rendered procedurally (no sprite assets). Player is a small pixel walker with directional eye indicator + leg-swap bob. ~14% encounter rate per step on tall grass. Turn-based battle UI: Fight/Flee main menu → moves menu (2 moves per creature) → animated log panel. Damage calc uses atk×pow/12 with variance 0.85–1.15, 8% crit chance (1.5×), type effectiveness 0.6–1.6. Win heals a chunk of HP + 35% chance to level up (+3 maxHP, +1 atk). Loss resets position to spawn tile and fully heals party. Audio: Web Audio synth beeps (step, select, hit sweep, miss, encounter sweep, victory arpeggio, loss descending sweep). Mobile D-pad appears on touch devices. Start overlay dismissed by ▶ Begin button (also unlocks AudioContext). Jersey 10 (display) + DotGothic16 (body) + Share Tech Mono (stats) typography, cozy dusk palette (lavender+sage+coral).

## issues
- Encounter rate may feel too high/low — 14% is a guess. Tune based on feedback.
- Wild creatures heal 100% between encounters; no persistent overworld state.
- Only one player creature (starter Sparkrat). No party management / swap / catch yet.
- Flee is a flat 60% — could be nerfed to prevent trivial escape from bad matchups.
- Emoji sprites render at different sizes across OSes — the rendered body is an emoji inside a colored disc so it's reasonably consistent.
- Battle text log only shows last 3 lines; longer sequences scroll.

## todos
- Catch mechanic (throw a "net" at low-HP wild, chance based on remaining HP).
- Party of up to 3 creatures with swap menu.
- More maps / route connections (cave entrance, small town NPCs).
- Bag/items: potions, status heals.
- Status effects (burn, paralysis) — start with one.
- Procedural map generator or at least a second hand-crafted route.
- Persist party/position to localStorage.
- Background music loop (currently only SFX).

## design
- Palette: dusk #2a1f3d, dusk-2 #3d2f5a, sage #5e8b7e, tall-grass dark #4d8860 / light #7fb588, tree #1b3127, path #e6c7a1, water #7fcfd9 / deep #4aa3b0, cream #faf3e3, coral #f27878, lavender #b79cd9, lemon #ffd46b
- Fonts: Jersey 10 (display/battle UI), DotGothic16 (narrative), Share Tech Mono (stats + type labels)
- Title rotated -1.5° with triple-layered shadow (coral, ink, coral glow)
- Game frame has a pulsing coral "power LED" in top-right corner
- Creature sprites rendered as colored disc + large centered body emoji + small type emoji in top-right
- Battle backdrop = vertical gradient dusk→lavender→sage + two oval platform pads
