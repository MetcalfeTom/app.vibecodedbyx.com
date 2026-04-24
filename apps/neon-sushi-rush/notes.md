# Neon Sushi Rush

## log
- 2026-04-24: Created. Neon conveyor-belt match game. **8 sushi types** (tuna/salmon/ebi/tamago/avocado/kappa/spicy-tuna/unagi) each with custom canvas-drawn art: nigiri style (oval rice base + gradient fish topping + marbling streak + shimmer), shrimp variant (tail-fan + segment stripes), tamago (yellow block + black nori band), roll style (nori outer ring + rice ring with 14-grain speckles + radial-gradient filling center). Spicy tuna gets white pepper flakes; avocado gets dark pit dot; cucumber gets concentric ring rings. Each piece drawn with neon halo glow (shadowBlur=20 in piece color) + outer neon outline. **Gameplay**: belt scrolls pieces R→L at 150→330 u/s (speed ramps `+3.2·elapsed` capped at +180). Spawn every 1.3→0.55s (`-0.012·elapsed`). 35% of spawns are biased to match current order so game stays feasible. **Order card**: shows target sushi (rendered via mini-canvas with same drawPiece function for cohesive look), name, and draining timer (6.5→3.8s, shrinks by `0.03·elapsed`). **Queue**: 3 upcoming orders shown as dashed-border mini canvases. **Scoring**: correct tap = `100×combo`, combo caps at 12, chimes at combo multiples of 3 with arpeggio. Wrong tap = -1 heart + combo reset. Timeout = -1 heart + auto-next order. 3 hearts total, `♥`/`♡` ASCII HUD. **Belt render**: radial gradient belt body (cyan→magenta→cyan), moving 60px floor stripes, cyan top rail + magenta bottom rail (both with 14px neon shadowBlur), dashed centerline with moving lineDashOffset, 3 phased arrow chevrons on right indicating motion. **Audio** (Web Audio): `good` = triangle 520+combo*15 → 860+combo*40 Hz exp sweep 0.22s (pitch rises with combo). `combo` = 4-note arpeggio 660/880/1100/1320 Hz triangle at 50ms spacing. `bad` = sawtooth 180→80Hz exp + bandpass-filtered noise burst. `spawn` = square 380Hz 50ms click. `miss` = sawtooth 280→120Hz 0.3s descend. `over` = 4-note sawtooth descent 440/330/220/165Hz. ♪ toggle. **Aesthetic**: deep purple/indigo bg with cyan + magenta radial glows, repeating-horizontal scanlines (1px alt 3px) at 3% white overlay blend. Title "NEON SUSHI RUSH" in Rubik Mono One with cyan/magenta/yellow tri-word coloring + per-word neon glow. Kanji `寿 司 便` subtitle in Zen Kurenaido. HUD stat pills in JetBrains Mono with pulse animation on score change. Order card has cyan border + inset cyan glow. Font stack: Rubik Mono One + Bowlby One SC + JetBrains Mono + Space Mono + Zen Kurenaido. **Floating text** on correct/wrong/combo spawned via div with `floatup` keyframe (translateY(-80) + scale 1.25 + fade over 0.9s). **Game over**: `閉店` (closed) kanji + score/best stats, or `満腹` (full belly) + `ITADAKIMASU` title for scores ≥ 2000. Best score persists via `localStorage['neon-sushi-best']`. **Hurt shake**: stage element gets `hurt` keyframe (4-step ±6px jitter 0.22s) on heart loss. **Controls**: pointerdown hit-test (36px radius from piece center at belt cy), works with mouse + touch via `pointerdown`. `touch-action:none` prevents scroll. Mobile @640px: compact title, narrower stat pills, smaller order card, 30px queue tiles. Pollinations OG.

## features
- 8 hand-drawn sushi types with distinct silhouettes (nigiri/shrimp/egg/roll)
- Custom canvas art identical between belt pieces and order card (visual cohesion)
- Rising difficulty: faster belt, faster spawns, shorter order timer
- 3-slot upcoming queue preview
- Combo multiplier up to ×12 with escalating pitch
- Timeout + wrong-tap both penalize
- Neon belt with moving stripes + dashed centerline + chevron motion indicators
- Floating +score / WRONG / TIME UP / COMBO text
- Screen shake on heart loss
- Pitch-rising correct chime (pitch scales with combo)
- localStorage best score
- ♪ mute toggle

## issues
- Bias toward spawning the current order (35%) is a soft balance knob — too low and runs die fast, too high and it feels trivial. Tune if players report either extreme.
- Order timer at 3.8s minimum may feel brutal at high elapsed time; could floor at 4.5s if too punishing.
- `poof` removal is handled in loop filter (`p.poof > 0 && p.poof <= 0.01`) — works but the condition is inverted; pieces disappear cleanly but the logic is a bit fragile, could be cleaned up.
- Hit test is circular (36px) but nigiri pieces are wider than tall — some edge taps on the far ends may miss. Intentional trade-off for "aim for the center" feel but could switch to bbox.
- Canvas pieces don't have drop shadows under them on the belt surface — they look like they're floating slightly. Could add elliptical shadow.
- On very small phones (<360px wide) the order card + queue may wrap awkwardly; queue might want to hide under 420px.

## todos
- Combo meter visual bar
- Power-ups (wasabi = slow belt 3s, chopsticks = grab 2 orders in a row)
- Daily seeded mode
- Supabase high-score leaderboard (use existing pattern)
- Screen-wide chef rage effect at ×10+ combo
- Special "golden" sushi that's worth 3×
- More sushi types: ikura, uni, maki, inari
- Order-chain bonuses (matching 3 orders in a row without timeout = bonus)
