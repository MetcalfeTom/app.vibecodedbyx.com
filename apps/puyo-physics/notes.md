# Puyo Physics

## log
- 2026-04-23: **Fixed freeze after two blobs.** After releasing a pair, the top blob sitting on the bottom one never met `isSettled()` because gravity (+16.37 px/s per frame at 60fps) plus the soft collision impulse (`relVel × 0.5`) reached equilibrium around vy≈16 — above the 12 px/s settle threshold. Phase stuck in `settle` forever → no next pair spawned. Two fixes: (1) resting-contact damping inside blob-blob collision — when `|ny|>0.7 && |relVel|<40` (near-vertical low-energy contact), zero the downward vy of the upper blob; (2) raised `isSettled()` thresholds from 12→22 on both axes as belt-and-suspenders. Stacks now settle cleanly → match detect → next pair.
- 2026-04-23: Created. Puyo Puyo-style match-4 puzzle with **gelatinous ragdoll physics** on every blob. 360×660 canvas arena. **Blob** = circle body (r=24px) with 5 colors (red/yellow/green/blue/purple), each blob a real physics entity: position, velocity, angle, angular velocity, squash factor + direction. **Soft-body wobble rendering**: each blob carries **14 perimeter points** with their own position/velocity, each bound to an ideal-circle rest offset via spring `k=28` + neighbor cohesion `0.2` pull + damping `0.86^dt*60`. On collision impact, perimeter points get seeded outward velocity proportional to squash amount — blobs wobble & jiggle like jello ragdolls before recovering. Shape drawn as closed Bézier through smoothed midpoints of wobble points, filled with radial gradient (upper-left hi → body → lower-right shadow) + dark outline + glossy upper-left specular + eyes that look toward velocity direction + tiny smile. Eye blinks every 3–7s. Shadow ellipse under each blob. **Physics**: `vy += 980·dt`, damping `0.82^dt*6` on vx, floor/wall bounces with squash-on-impact (vertical squash when landing, horizontal when hitting walls). Blob-blob collision = circle-circle separation + soft velocity-transfer impulse (relVel × 0.5) + squash direction based on collision normal. Strong hits (>40 relVel) inject squash amount `min(0.3, imp*0.0005)`. Angular velocity slight jitter on contact. **Pair control**: player drops a 2-blob pair (pivot + satellite) from the top. Orientation 0–3 (up/right/down/left) rotatable with wall-kick + floor-kick (if rotated-sat goes out of bounds, pivot shifts). Move 44px/tap L/R; ↑ rotate; ↓ soft-drop (380u/s vs normal 90u/s); Space hard-drop (1600u/s). Pair collision check: blocks if either blob would hit floor or overlap existing blob; once blocked for >0.22s, pair releases as two independent physics blobs. **Match detection**: after settle (all velocities < 12 AND timer > 0.35s), flood-fill clusters of same-color blobs where any two centers are within `(2R + 4)`. Any cluster ≥4 → match. **Chain scoring**: `points = popped_count × 10 × 2^(chain-1)`. Pop animation: matched blobs scale 1→1.5 + fade 1→0 over 0.32s, then burst 12 particles per blob with gravity 0.5×. Chain label "CHAIN × N!" floats upward for 1.2s. After pops resolve, physics re-settles, checks for new matches (cascade chains). No matches → next pair + chain reset. **Game over**: any settled blob with `y - R < 0.12·H + 8` (above danger line). **Next preview**: shows upcoming pair as mini-blob stack. **UI**: Rubik Bubbles title "Puyo / Physics" with cyan→pink→yellow gradient + drop shadow, Fredoka italic tagline, Space Mono eyebrow "▿ SQUISH · WOBBLE · POP ▿". Score card with huge yellow Rubik Bubbles number + chain display pink. Info card with kbd-styled key hints. Tank has border + glass inset shadow + pink drop shadow + danger line (dashed red). **Audio** (Web Audio): squish on landing (120Hz sine + lowpass-filtered noise burst, amplitude scaled by impact), click on move/rotate (680Hz square 0.05s), pop (triangle arp 440Hz × 1.2^chain + harmonic + octave), game over (saw descent 330→260→180Hz). ♪ mute toggle. **Touch controls**: 4 circular buttons bottom (◀ ▶ ↻ ▼) visible only on coarse-pointer devices via media query. `touch-action:none` prevents scroll. Mobile: panels stack via 820px breakpoint, title above tank. Pollinations OG.

## features
- Every blob wobbles, squishes, and recovers like soft jelly
- Real circle-circle physics with velocity transfer
- 14-point per-blob perimeter wobble rig
- 2-blob falling pairs with 4 orientations + wall/floor kicks
- Flood-fill match detection by spatial proximity (not grid cells)
- Chain cascades with 2^(chain-1) score multiplier
- Eyes that track velocity + random blinking
- Pop animations with particle bursts (12 per blob)
- Floating chain labels
- Soft/hard drop + touch controls + pause
- Next-pair preview
- Responsive mobile layout

## issues
- Physics is continuous (not grid-snapped) so stacks can look lopsided — intended for the "gelatinous ragdoll" feel but some players may want Puyo-like column discipline.
- Matching uses proximity not adjacency, so a tightly-pressed 4-cluster may match even if geometrically offset. This is intentional — gelatinous blobs squish into each other.
- Tall stacks occasionally sway a lot before settling; settle timer is 0.35s which feels right but could be tuned.
- Pair rotation wall-kick doesn't check for blob overlap after the kick in every case — there's a fallback revert if post-kick overlap exists, but visual pop-back is slightly janky.
- Hard drop uses high velocity rather than teleport — blobs actually physics-fall through, so on very tall stacks it feels a beat slower than true Tetris-style hard drop. This is intentional.
- Wobble points can occasionally flip inside-out on extreme squash; neighbor cohesion spring pulls them back within a frame, but a very brief visual glitch may show on massive impacts.
- Chain detection skips to next phase fast — players may want more fanfare per chain step. Could add per-chain sound escalation + color flash.

## todos
- All-clear bonus (clearing every blob in tank) with big score multiplier
- Difficulty ramp: gravity increases every N pairs, pair-spawn speed quickens
- "Nuisance" garbage blobs (grey, must be adjacent to a popping cluster to disappear) for simulated-opponent mode
- 2-player side-by-side with shared physics styling
- More blob faces / animations (surprise eyes when partner pops, sad eyes before game over)
- Ghost outline showing pair landing position
- Screen shake on large chains
- Supabase high-score leaderboard
- Blobs merging (2 same-color touching = fuse visually) as an alt-mode
