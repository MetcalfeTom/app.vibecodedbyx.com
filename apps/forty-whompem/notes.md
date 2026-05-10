# forty-whompem

## log
- 2026-05-10: shipped (chat: "create a high-impact typing brawler called Forty-Whompem with a gritty industrial aesthetic and heavy physics" + immediate follow-up "make sure Forty-Whompem has a deep industrial parallax background with sliding girders and steam vents").
  - **Concept**: Two ragdolled boxers, you (PLAYER, amber) vs Grim (FOE, blood-red). A word floats above Grim's head. Type it letter-perfect to throw an impulse-physics punch — short words = jabs, long words = haymakers, 9+ letters = WHOMPEM crit. Grim has a swing-fuse that fills while you stall; if it fills, he lands a heavy on you and you eat damage + combo reset. KO when one fighter hits 0 HP.
  - **Physics**: 6-particle Verlet ragdoll per fighter (head/torso/leadArm/backArm/lLeg/rLeg) bound by stiff constraints. In `idle` state each particle is sprung toward a pose-target; on hit, `applyImpulse` zeros the pose-stiffness for 1.4s (full ragdoll), 0.7s "rising" ramps stiffness back to 18, then `idle`. Verlet with damping 0.92, gravity 1500px/s², ground at y=470, 5 PBD-style constraint iterations per frame. Rebound 0.35 in ragdoll / 0.05 in idle, friction 0.55.
  - **Word→damage formula**: `power = word.length * 1.4 + fastBonus * 8`, where `fastBonus = max(0, 1 - elapsed / (idealTime * 2.5))` and `idealTime = 0.18 * len` (5 cps target). `dmg = (4 + power*1.7) * (crit ? 1.7 : 1)`. Crit triggered by `len >= 9` OR (`fastBonus > 0.55` AND `len >= 6`).
  - **Word pools** (industrial-themed): light (3-4 letters, JAB/BOLT/RUST/GRIT…), mid (5-6, RIVET/WRENCH/PISTON…), heavy (7+, SLEDGEHAMMER/CRANKSHAFT/LOCOMOTIVE…), mega (WHOMPEM/BONESHAKER/PISTONFIST). Pool weights shift toward heavier as foe HP drops (`difficulty = 1 - foe.hp/maxHp`).
  - **Foe AI**: passive — just fills `swingFuse` at 0.28/s (0.42/s in hard). Each completed punch on foe drains -0.6 from fuse. Foe fuse only fills while foe is in `idle` state, so chain-juggling them keeps fuse paused. When fuse hits 1.0 → `foeSwings()` impulses player + 14-24 dmg + ragdolls + word resets.
  - **Parallax background** (deep, 6 layers back-to-front): (1) corrugated steel-wall gradient with horizontal 18px stripe alternation, vertical rust-streak drips (26 random columns), and bolted grid stencil; (2) **steam vents** — 4 wall-mounted pipes with flange + bolts at x=120/360/600/820, period 3.1-5.2s + phase, each puff spawns 6 radial-gradient steam particles drifting up + sideways with growing radius and fading alpha (synth steam-hiss SFX synced); (3) **3 sliding girder layers** at y=78/132/198, each an I-beam (top flange + web shadow + bottom flange) tiled across width with 22px-spaced rivets and hanging chain segments on alternate beams, sliding L→R at 7/13/22 px/s for parallax depth; (4) chain-link fence overlay — diagonal lattice in mid-back at 32% alpha; (5) caged work-lamp swinging from ceiling at center on 0.7Hz sine, with cone-of-light radial gradient pooling to floor + visible 5-bar cage; (6) ambient sparks rain (random spawn rate 6/s) with golden glow + gravity. **Floor**: rusted steel deck with 96px-spaced plate seams, 32px bolt grid, rust streaks.
  - **Aesthetic**: dark (#14110e bg, #3e3a33 steel, #a3391a rust, #d8a838 amber, #8e1f1c blood). Typography stack: Black Ops One title with 3px rust shadow + 6px ink shadow + amber glow drop, Big Shoulders Stencil Display 900 for HP labels / hit power tag (JAB/CROSS/HAYMAKER/WHOMPEM), Special Elite italic for tagline + flavor, JetBrains Mono for the typed word (38px bold) and HUD numerics. Hit banners ("WHOMP!", "BAP!", "SLAM!", "CRIT!", "HAYMAKER!") in Black Ops One with 18px shadow-blur halo + scale-up over 0.9s. Repeating-linear scanline overlay on stage. CRT-style screen border with 8px offset rust+ink double drop shadow.
  - **Word display**: 38px JetBrains Mono in a dark backing plate above foe's head, pointer-triangle below pointing at his face. Typed letters glow amber (#f5c453), current letter pulses with sin-wave alpha, untyped stays cream (#e8d8b0). 12px stencil power tag above ("· HAYMAKER ·"). Word backing plate at y = foe.head.y - 110. Pointer position auto-tracks foe head x (so as foe ragdolls, the word follows him while he's down — but new word doesn't spawn until he's KO'd or fuse-swings).
  - **Audio** (WebAudio synth): `sfxThud` = 120Hz sine sub drop to 34Hz over 0.28s + lowpass-filtered noise crunch + 320Hz square metal ring; `sfxClack` = 1100-1400Hz square 0.05s tap on each correct letter; `sfxMiss` = 220→120Hz sawtooth on wrong key; `sfxKO` = 180→20Hz sub drop + 440→80Hz sawtooth sting; `sfxSteam` = 2400Hz bandpass-noise hiss linked to vent puffs. Compressor at -14dBFS 5:1 pre-master.
  - **Controls**: any letter starts bout. Type the lit word. Backspace deletes a letter (small clack, no penalty). M mutes. Esc pauses. Click canvas = start.
  - **Accessibility**: rem units throughout, semantic main/header/section/h1/h2, role=application + control-summary aria-label on canvas, role=dialog + aria-modal on start/end overlays, aria-pressed on mute toggle, focus-visible amber outline on buttons, prefers-reduced-motion zeroes hp-bar transition + button transform.

## issues
- Foe is currently a passive sandbag — only retaliation is the swing-fuse. No back-and-forth dodging or aggressive combos. Fits the "type fast or eat one" loop but is mechanically simple. **By design** for this v1.
- Mobile: no on-screen keyboard prompt — touch users can't type. Stage is responsive but the gameplay needs a physical keyboard. Could add a 26-button virtual kbd panel on coarse-pointer devices later.
- Word can clip off the right edge of the canvas if foe's head ragdolls too far right. Not a blocker — clipping is brief because applyImpulse mostly drives him left toward you.
- No combo-multiplier visualization on score yet (combo just multiplies internally). Could add a multiplier ribbon next to the score.
- Difficulty ramp is purely "foe HP %" — doesn't reset between bouts well (always starts at 0). Hard mode adds +0.3 baseline.
- Word-power tag can read "JAB" for a 3-letter word when the actual `power` may compute differently — tag is purely length-based for clarity, doesn't reflect crit-eligibility.

## todos
- Virtual keyboard for mobile (or large touch-zone tap-to-type if held).
- Local best-score leaderboard pill above HUD.
- Bout intro animation: lights flicker on, fighters jog into frame.
- More foe characters (Grim, then Boilermaker, then Whompem himself as final).
- Counter-words: an enemy word appears that you must finish to PARRY a swing.
- Round system / 3-round W-L tally instead of single brawl.
- Optional WPM display in real-time HUD.
- Light-flicker effect on heavy hits (lamp dims briefly).
- Crowd-noise ambient bandpass-noise loop.
- Spectator silhouettes through the chain-link fence.

## design-notes
The whole game is about feeling the **weight of the punch land**. Three things drive that:
1. **Verlet ragdoll** — Grim's head doesn't just play a hit-stun frame, it physically swings on its constraint to the torso. That whip motion is what sells "heavy" without any pre-baked animation.
2. **Word-length → impulse magnitude** — typing "WHOMPEM" launches Grim on a different trajectory than typing "JAB". The same physics, different impulse, very different visual outcome.
3. **Screen shake + sparks + banner triple-stack** — every landed punch fires `spawnHitFx` (12-26 sparks with radial spray + 600px/s² gravity), `spawnBanner` ("WHOMP!" / "CRIT!" 50-72px Black Ops One scale-up), AND `fx.shake += 6+power*14`. Three feedback channels mean even small jabs feel chunky.

The parallax background needed to feel like a real industrial space, not a flat backdrop. The trick: 3 girder layers moving at *different* speeds (7/13/22 px/s) creates real depth perception — your eye tracks them as 3 distinct planes. The center swinging lamp gives a fixed-but-moving anchor (lamp swings, but doesn't translate). Steam vents add periodic motion that's not on a regular beat (each vent has its own period 3.1-5.2s + phase) so the eye keeps catching new puffs from different parts of the wall.

The amber lamp cone at center-stage is functional, not decorative — it darkens the edges of the canvas (combined with the radial vignette) and brightens the fighters in the middle, which is exactly where the action lives. Visual hierarchy enforced by lighting.
