# shadowfen-survival

## log
- 2026-05-10: shipped initial cut (chat ask: "build a fantasy zombie survival game with resource crafting and base building" — credit: **devrayn24** + chat asks for **scrapwood bow as starting weapon** with **physics-based arc**). Top-down 2400×1500 world, camera-follow on 16:10 viewport, day/night cycle with escalating undead waves.
  - **Loop**: gather wood / stone / herbs by day → forge weapons + brew potions at the side panel → enter build mode (B) and place walls / stone walls / spike traps near the player → survive the night → next day. Day length shrinks (`max(60, 100 - day*5)s`); night length grows (`min(120, 50 + day*8)s`).
  - **Resources**: Wood (trees, 4/chop), Stone (rocks, 3/mine), Herb (plants, 1/pluck). Walking onto a node chips it; the player drains nodes via collision rather than discrete clicks.
  - **Forge** (4 recipes):
    - **Iron Sword** — 8 wood / 5 stone · melee tier-2 (dmg 18, range 36, rate 0.45s)
    - **Oak Bow** — 14 wood / 3 herb · ranged 380u flat-flight arrow (dmg 16)
    - **Ember Staff** — 10 wood / 6 stone / 6 herb · 28 dmg fireball with 40u splash, 8 mp/cast
    - **Healing Potion** — 4 herb · +45 hp on Q
  - **Starting weapon: SCRAPWOOD BOW** (chat ask) — present in inventory on day 1 + auto-equipped. Stats: dmg 9, range 320, rate 0.65s. **Physics-based arc** (chat ask): arrows are launched with `vy = sin(facing)*speed - 110` (initial upward kick) and accumulate `vy += 280 px/s² · dt` per tick → a clean parabola the player has to lead targets with. The arrow's visual rotation follows the live `atan2(vy, vx)` so the nose dips as the arc descends. Cosmetically it's a knotty bark-on shaft with ragged grey fletching and a chipped flint tip. The crafted Oak Bow keeps its flat-flight 460u arrow as a stat upgrade reward — straighter line + more dmg.
  - **Fortify** (3 buildables, all snap to the 40px tile grid, must be within 130u of the player):
    - **Wood Wall** — 5 wood · 80 hp · blocks movement
    - **Stone Wall** — 6 stone · 200 hp · blocks movement
    - **Spike Trap** — 3 wood / 1 stone · 40 hp · doesn't block, deals 12 dps to anything standing on it (degrades)
  - **Player**: 100 hp + 50 mp (regens 1.6/s). WASD to move, mouse to aim, click to attack. 1=scrap bow, 2=sword, 3=oak bow, 4=staff, 5=hands. Q drinks a potion. B toggles build mode.
  - **Undead** (4 types, day-gated):
    - **Skeleton** (always) — 32 hp · 6 dmg · 92 spd · melee
    - **Ghoul** (day 3+) — 70 hp · 12 dmg · 70 spd · melee tank
    - **Wraith** (day 2+) — 28 hp · 9 dmg · 84 spd · ranged 240u violet bolt, strafes at 70% range
    - **Lich King** (every 5th night) — 380 hp · 22 dmg · 64 spd · 320u dark fireball, casts every 1.6s, drops a kill arpeggio fanfare
    - All scale `+12% hp per day`. Boss spawn announces in toast + log.
  - **AI pathing**: melee zombies pathfind toward the player but if a wall blocks the next-step tile they pivot to attacking the wall (0.7 dmg/atk every 0.7s). Stepping on a spike trap drains hp continuously while degrading the trap.
  - **Day/night transitions**: dawn refunds 22 hp + 18 mp + plays a triangle arpeggio. Dusk plays a descending sine. Night puts a radial fog vignette over the screen + a small painted moon top-right; day shows a sun.
  - **Undead "loot"**: 18% chance per kill to drop a herb (auto-collected, logged in chronicle).
  - **Aesthetic**: parchment-cookbook UI with cream paper + 13°/103° fiber grain, Cinzel Decorative title in blood-red ink shadow, IM Fell English italic tagline, IBM Plex Mono HUD pills with cream backing on a near-black night-tile floor. Hud-pill sat for hp / mp / phase / weapon / kills overlays the canvas. Chronicle log streams every event in mono on parchment.
  - **Audio**: WebAudio synth — square swing, noise+square hit, triangle bow shoot, sine spell pair, sawtooth chop, low square mine, pluck pluck, 3-note craft chime, 5-note kill chime, 6-note boss-kill fanfare, descending dusk sine, ascending dawn triangle, sawtooth lose descent.
  - **Accessibility**: rem units throughout, semantic main/header/aside/section, role="application" on canvas + control-summary aria-label, aria-live="polite" on log + toast, focus-visible outlines, 2.75rem min interactive targets, prefers-reduced-motion kills the toast slide.

## issues
- Resource nodes don't respawn — once cleared, the world is barren. Needs a slow regrow or per-night reseed.
- Wraith projectiles can clip through walls (only the player and explicitly-routed projectile checks against walls right now). A more robust pass would tile-step the projectile.
- The lich's 'darkfire' isn't currently a splash spell, just a heavy bolt — feels fine but could differentiate further.
- Build distance is 130u — slightly too short to easily wall in a perimeter. Could raise to 180u.
- No save/restore yet; closing the tab loses the run.
- Mobile is missing — no touch joystick. WASD only for now.

## todos
- Resource respawn: wisp-ghost spawns a new tree/rock/herb every 12s up to original count.
- Workbench placeable that doubles craft yields when adjacent.
- More weapons: throwing axe (multi-target), war hammer (knockback + stun), enchanted bow (auto-track).
- More zombies: Bog Witch (slows player on hit), Reanimated Knight (heavy armor, slow).
- Mobile virtual joystick + auto-aim toward nearest threat.
- Save run state to localStorage on each phase transition.
- Multiple biomes (frozen north, blighted swamp, scorched dune) with palette + enemy swap.
- Co-op via Supabase Realtime presence — second player visible, shares walls.

## design-notes
The crowd asked for "fantasy zombie survival" but the same ask appeared twice with subtle nudges (scrapwood bow + arcing arrows). The arc physics is the kind of detail that flips the bow from "flat-line direct-fire" to "you-have-to-lead" — it's slower (320u range, 9 dmg) than the crafted Oak Bow specifically so the player has incentive to upgrade past it. Until then they're scavenging with a stick that throws sticks.

The grid-snap building uses a 40px tile so the world is roughly 60×37 tiles — large enough to build interesting castle layouts but small enough that wall-pathing AI stays cheap. The 130u placement-range (just over 3 tiles from the player) means you have to physically walk to where you want defenses, not gas-fortify from across the map. That makes building during day a real activity rather than a menu task.
