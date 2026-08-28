# Milk & Magnets — notes

Cookie physics sandbox: fling cookies, place attract/repel magnets, dunk cookies into a milk glass for combo points, grab floating powerups.

## log
- 2026-08-28 v1.0: first build (public request: "polished cookie physics sandbox with magnetic powerups, playful scoring, accessible controls"). Single-file canvas app, no backend.
  - **Physics**: fixed 1/120 substeps (max 8/frame), gravity slider 0–1600, circle-circle impulse collisions (REST .42, mass ∝ r²) + positional correction, O(n²) pairs with AABB early-out (cap 120 cookies so it stays cheap), walls/floor, glass walls as capsule segments, magnets as static discs cookies bounce off. Post-collision containment pass keeps cookies from ending a frame below the counter when the pile is compressed (probe caught this in a 40-cookie/strong-magnet stress run).
  - **Magnets**: max 6, force a = K·power·pol/(d²+1600), K=9e6 (2.6e6 felt too weak: 7px pull in .5s at 220px), capped AMAX 2600, VMAX 1500. Tap flips polarity, drag moves, right-click removes. Field ring radius ∝ √power.
  - **Scoring**: dunk base 10 (mini 5) × combo (dunks within 1.5s) × 5 during Golden Hour; "NOTHING BUT MILK +15" if the cookie never touched the glass walls; combo names DUNK!/DOUBLE DUNK/TRIPLE DIP/QUAD SOAK/SPLASH ZONE ×n; 7 ranks crumb→cookie monarch; powerup pickup +25. Best in localStorage `milk-and-magnets-best-v1`.
  - **Powerups** (spawn every 8–13s, ≤2 alive, 15s life, cookie must touch): mega magnet (×3, 8s), polarity chaos (all flip every .8s for 4s), slow-mo (.35×, 5s), golden hour (8s), cookie rain (12).
  - **Accessibility**: canvas `role=application` + tabindex + key-summary label; keyboard reticle (arrows, Shift = big step), Space uses tool, C/M/F/Delete/1/2/P/R/S/?; `role=status aria-live=polite` with a 650ms announce throttle (latest wins); `aria-pressed` on tool/pause/sound; help `role=dialog aria-modal` with focus move + return; ≥44px targets; rem sizing; reduced-motion drops shake/pulse/spin; "effects" checkbox trims particles.
  - **Test seam**: `window.__X` = {S, step, glass, floorY, addCookie, placeMagnet, flipMagnet, removeMagnet, collect, spawnPowerup, dunk, reset, setTool, W, H, freeze, thaw}. Harness in job tmp (`run.sh` + probe-tail/mobile-tail/shot-tail/og-tail): desktop 48 checks, mobile 7 — all green at ship.
  - OG image is a headless screenshot of the app's own scene (pollinations output was an off-brand glass of something dark).

## issues
- `setPointerCapture` throws on synthetic PointerEvents → wrapped in try/catch (`cap(e)`), otherwise test harnesses see uncaught errors.
- Announce throttle means a probe must wait ~900ms before reading `#status` after a burst of events.
- Headless has no emoji font: toolbar/powerup glyphs are tofu in screenshots only.

## todos
- Chat ideas to consider: more powerups (sticky magnet, cookie splitter), a challenge mode with a timer, milk glass that moves, share-your-score card.
- Sleeping bodies if chat pushes the cookie cap higher (O(n²) is fine ≤120).
