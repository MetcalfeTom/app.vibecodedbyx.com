# neko-bound

## log
- 2026-05-09: **UI scale-up + interaction-lock fix** (chat ask: "the UI in neko-bound is too small and interaction is broken, please scale up the art and ensure the turn-based menu is usable on all screens"). Six-part fix:
  1. **Sprite scaling** — new `spriteScale()` derives a multiplier from the canvas's logical size (`max(1.4, min(3.0, min(W/360, H/280)))`). `drawCat` and `drawSoaker` both now `ctx.scale(s, s)` after the translate, so cats grow with the arena instead of staying pinned at the original ~28-pixel body radius. Floor 1.4× keeps them readable on small phones; cap 3.0× prevents cat-eats-screen on desktop.
  2. **Aspect-ratio arena** — was fixed-height (22rem desktop / 18rem mobile). Now `width:100%; aspect-ratio: 4/3` (mobile) → `16/9` (≥760px) with `max-height: 32rem`. Canvas grows with column width on every screen.
  3. **HP cards moved OUT of the arena** — were absolutely-positioned over the canvas, obscuring the cats on phones. Now in dedicated `.hp-row` containers above + below the arena, full-width, never overlapping the fight. Font sizes inside bumped (`.nm` 0.85rem→1.1rem, `.num` 1rem→1.4rem, bar height 0.55rem→0.8rem).
  4. **Move buttons larger + more readable** — `min-height` 3.6rem→4.5rem, `padding` bumped, `.nm` font-size 0.9rem→1.1rem, `.desc` 0.7rem→0.82rem, `.pp` 0.58rem→0.68rem, `.type` pill 0.45rem→0.55rem. Buttons are now a comfortable two-row card with name + glyph on top, type-pill + PP + description on bottom.
  5. **Interaction-lock fix** — `playerTurn` now wraps the whole turn in a `try/finally` and locks `state.inAnim = true` BEFORE any async work. Previously a thrown error inside `resolveMove`'s `special` callback could leave the lock set forever, making every subsequent button-press silently no-op (the chat-reported "interaction is broken"). The finally ALWAYS releases the lock + re-renders the move buttons. Caught errors log to console + show a "something glitched · skipping turn" dialogue line so the player at least knows what happened.
  6. **Dialogue arrow stability** — was using `firstChild.textContent` which broke when log re-renders nested the arrow inside a stale text node. Now wholesale-rebuilds the dialogue body each render and re-appends the arrow as a clean child.
- 2026-05-09: shipped — turn-based cat RPG with EarthBound aesthetic. Chat asks bundled (credit: **icekrieg** + chat votes):
  - "create a turn-based RPG called Neko-Bound with cat-themed moves like hairball-hurl and nap-time"
  - "create a turn-based RPG called Neko-Bound with EarthBound aesthetics and cat-themed psychic abilities like purr-pulse"
  - "create Neko-Bound, a turn-based RPG with EarthBound style. The first boss is a giant sentient Spray Bottle named The Soaker. Cat abilities include Purr-Pulse and Hairball-Hurl."
  - **6-rival ladder** — fight up the alley one cat at a time. Each victory restores 30% HP between fights. Reach the final Maine Coon to claim the alley. Lose any fight, the run ends.
  - **Player kit (Tabby)**: 🐾 Paw Swipe (∞ PP), 💢 Hairball Hurl (12 PP, may lower foe ATK), 🌀 **Purr-Pulse** (8 PP, PSY attack that ignores DEF buffs — chat ask), 💤 Nap Time (6 PP, heal 30 + skip next turn).
  - **Damage formula** — Pokemon-flavored: `(base*2 + 10) × atk/def / 8 × random(0.85..1.0)`. Stat-stage table caps at ±3, frenzy multiplies caster ATK by 1.5 for 3 turns (with -8 self-HP cost). Crit doubles damage on per-move dex roll.
  - **The Soaker — first boss** (chat ask: "first boss is a giant sentient Spray Bottle named The Soaker"). Special-cased rendering as a translucent cyan plastic bottle with: a sloshing blue liquid layer that wobbles to a sin, an angled shoulder bevel, a black trigger arm, a pink-glowing single eye on the nozzle that halos when frenzied, and a periodic dripping-water particle. Combat math is the same as any other rival. Move set: 💧 Spritz (∞ PP, always-hit chip), 🌊 Drench (heavy water blast, 40% chance to apply ACC debuff), 🧴 Soak Self (DEF +2 stages for 3 turns), 🌫 Mist (halves foe accuracy for 2 turns).
  - **EarthBound psychedelic backdrop** (chat ask: "give it a psychedelic style"). 11 concentric wavy bands of saturated colour anchored at a centre that drifts slowly via dual sin waves. Each band is a 36-segment polygon with `radius × (1 + sin(angle*5 + t)*0.18)` so the rings undulate like the iconic EarthBound boss-mode-7 backgrounds. Cat-vs-cat fights use a 6-color palette (rose / violet / cyan / acid / gold / orange); boss fights swap to a hotter 7-color palette and add a pink radial vignette + faster rotation. The horizon strip stays solid so the cats stand on stable ground.
  - **Move types** (atk/heal/buf/deb) color-coded as type-pills on each move card. PP shown as `5/5` style; ∞ for unlimited basics.
  - **Stat pips** show on HP cards: ATK+/-, DEF+/-, FRENZY (with turns left), SNOOZE (when napping). Pip colors match the type-pill palette so the same visual language reads across UI + combat.
  - **AI**: heuristic. Heals at <45% HP if available. Buffs ATK at >50% HP if not yet boosted. Otherwise picks the best damage move weighted by accuracy + jitter. Won't nap below 40% HP (free-hit risk).
  - **Engine**: async/await turn flow so animations can `await delay(ms)` cleanly. Speed multiplier (1× / 2× / 4×) divides the delay so the dialog box reads at user pace OR the round resolves crisply for replay value. Mute toggle on the WebAudio synth. Reset wipes everything cleanly.
  - **Sprites**: hand-drawn on canvas with primitives. Cat = body ellipse + tail bezier + head circle + triangle ears with pink inner-triangle + sclera-pupil eyes (slit pupil for awake, closed arc + ZZZ for napped) + nose triangle + 4 whiskers. Pattern-aware: `tabby` draws curved stripes around the body, `spots` draws 5 random dots, `solid` skips both. Frenzy + box-defense auras render as aura ring / outlined rectangle overlays. Soaker uses its own dedicated render.
  - **Aesthetic**: Bungee title with pink/gold drop-shadow. Fredoka body. Press Start 2P micro-labels + EarthBound-style stat pips. JetBrains Mono kbd. Big chunky 3px-ink-shadow buttons that compress on press for tactile feel. Cream paper bg with multiply-blended fiber grain.
  - **Accessibility**: rem units, semantic main/header, `role="application"` + descriptive `aria-label` on canvas, `aria-live="polite"` on dialogue + HP cards, `aria-pressed` on mute, `:focus-visible` outlines, 2.75rem (44px) min interactive targets, skip link, `prefers-reduced-motion` removes toast + ladder animations.

## issues
- Move cards on mobile (≤480px) collapse to single column — fine, but the description text gets a touch cramped. A future pass could add a tap-to-expand for full move flavor.
- The `paw_swipe` / `spritz` PP=0 means unlimited (special-cased to render `∞`). Internal storage uses `Infinity` which doesn't survive JSON serialization — but we don't persist state right now so it doesn't matter.
- Soaker's dripping-water particle is a single drop on a sin loop, not a particle system. Cosmetic.
- AI chooses moves by score-sorting, not weighted random — the same opponent will pick the same move under similar conditions. Adds a `Math.random() * 6` jitter to attack scores so it's not fully deterministic, but humans can still pattern-match by mid-game.

## todos
- More psychic moves: 🌟 Star-Stare (low-damage, stuns for a turn), 🎵 Lullaby (chance to put foe to sleep — symmetric to nap_time but on the foe), 🪞 Mirror-Bath (reflects 50% of next attack back at the caster).
- More bosses with non-cat sprites: Vacuum Cleaner (sucks turn order around), Hairdryer (heat-themed), the dreaded Veterinarian.
- Branch path on the ladder — rival 4 gives you a choice of two routes.
- Status effects beyond `napped` and `frenzy`: poison (DoT), confused (50% to hit self).
- A small pre-fight "menu" to swap one of Tabby's moves for an alternate from a small pool (mirror EarthBound's psy-shop vibe).
- Persistent best-streak in localStorage.

## design-notes
The "EarthBound aesthetic" was the request to lean into hardest. The iconic feature isn't the sprites (which were mostly Mother-2 standard JRPG) but the boss-fight backgrounds — those mode-7-style rotating layered swirls that made every battle feel like a fever dream. We do that with 11 wavy concentric polygons rotated by a slowly-drifting center. The cat sprites are intentionally simple/cute so they read against the busy backdrop without losing the eye.

The Soaker was the funniest pick from the pool of possible bosses (it's a product humans use to traumatize cats — the role-reversal landed). Special-rendered as a non-cat in `drawSoaker` so it visually breaks the pattern when it walks in for the first fight, signalling "this isn't going to be a normal alley brawl."
