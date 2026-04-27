# tumble-pixels

## log
- 2026-04-27: Created. **Neon gravity sandbox** with tumbling colorful pixels. Fullscreen `<canvas>`, MAX 700 particles, recycle-oldest on overflow. Each particle = `{x, y, vx, vy, angle, angV, size 5–14, color, glow}` from an 8-color neon palette (magenta/cyan/yellow/lime/pink/violet/orange/mint). Render: `ctx.translate→rotate→shadowBlur=14 + shadowColor=glow + fillRect(-s/2,-s/2,s,s)` with a bright top-left highlight + dark bottom-right shadow corner inside each square so you can see them visibly tumble. Trail effect via per-frame `rgba(6,3,15,0.22)` rect (preserves glow tail). **Physics**: gravity 600u/s² down by default, `vx,vy *= 0.992^(dt*60)` damping, `angV *= 0.985^(dt*60)`. Wall/floor bounce with 0.55 restitution + `*0.86` perpendicular friction + impact-proportional angular kick `(rand-0.5)*min(12,impact*0.04)`. Floor with snap-to-rest below |vy|<30 so pixels actually pile up. **Particle-particle**: 24px spatial-hash, soft AABB-ish separation (split overlap 50/50) + velocity exchange `rvDotN*0.4` impulse + tumble kick from `|rvDotN|*0.012`. **Modes** (1/2/3 or pill toolbar): SPRAY = drag emits 1 pixel per 12ms inheriting pointer velocity ×8 (throw feel); PULL = cursor radial attractor 240u radius, `1800/d * (1-d/R)` falloff; PUSH = same but inverse. Cursor field renders as radial gradient + pulsing ring colored cyan (pull) or magenta (push). **Gravity controls**: arrow keys rotate gravity (↑↓←→), Space toggles zero-g (mid-air freeze + chaos). Each gravity change paints a 1.0→0 cyan flash overlay. **Aesthetic**: deep void `#06030f` with cyan + magenta radial glows, Audiowide brand "tumble·pixels" with multi-layer cyan→magenta neon text-shadow, Major Mono Display secondary, Space Mono body. Glassmorphic toolbar pill at bottom (backdrop-filter blur). Grav-arrow indicator above toolbar. Right-side keyboard hint fades 2.5s after first interaction. Mobile @680px: hides hint + sub-tagline + key chips, smaller toolbar pills. Pollinations OG.

## issues
- **DPR clamped at 2** to avoid jank on high-DPI mobile when running 700 particles + shadowBlur (shadowBlur cost scales with rendered pixel count).
- **shadowBlur is the most expensive op per frame**. If perf craters on slower devices the easy fix is dropping shadowBlur to 0 and pre-baking a glow into each particle as a radial-gradient sprite cached per-color.
- **Spatial hash skips diagonal-up cells** (`dx===0 && dy===-1` skip + `dx<=1` outer loop) — this is the standard half-pass to avoid double-counting pairs. Pairs in same cell start `j=i+1`.
- **Pointer capture** via `setPointerCapture` so dragging off-canvas while holding still emits, but `pointerup` listener is on `window` to handle release outside the canvas.

## todos
- Add a "wall draw" mode (right-click drag or 4-key) to sketch persistent line obstacles that pixels collide with.
- Per-color physics: hot colors float, cold colors fall heavier — already have palette structure to support it.
- Save/load arrangement to localStorage so you can come back to your pile.
- Sound: subtle Web Audio noise burst on hard impacts (gain proportional to `|rvDotN|`).
- Could add a "FREEZE" key that snapshots all positions and lets you orbit the camera (not super useful in 2D but novel).
