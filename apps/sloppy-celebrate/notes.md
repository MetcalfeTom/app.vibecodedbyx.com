# Sloppy Celebrate

Canvas-based particle effects library and achievement unlock spectacle hub.

## log
- 2026-02-01: Initial creation
  - Full canvas particle engine: Particle class with physics (gravity, friction, decay)
  - 5 particle shapes: circle, square, star, ring, spark
  - Trail rendering for firework/spark effects
  - 7 color palettes: gold, fire, ice, rose, cosmic, emerald, rainbow
  - 8 distinct effects: confetti burst, firework (rise+explode), ring explosion, star shower, spark fountain, pixel rain, supernova, screen shake
  - Screen shake: transform-based with intensity decay over duration
  - Achievement badge grid: 10 badges with earned/locked states (same thresholds as sloppy-wallet)
  - Auto-detection of newly earned badges → persists to sloppygram_badges + auto-celebrates
  - Click earned badge to replay celebration (fireworks + confetti + star shower + screen shake + banner)
  - Click locked badge for palette preview burst
  - Unlock banner: centered modal with emoji bounce animation, badge name, description
  - Effect showcase: 10 demo buttons to trigger any effect on demand
  - Syne + Azeret Mono typography
  - Gold/purple/dark celebration aesthetic
  - Mobile responsive
  - Addresses Phase 2 Goal #4: Achievement unlock animations

## particle engine
- Physics: per-particle gravity, friction, velocity, rotation
- Rendering: shape-based (circle fill, rect fill, star path, ring stroke, spark cross)
- Trail mode: line from previous to current position
- Lifecycle: life 0→1, decays per frame, removed at life≤0
- requestAnimationFrame loop, auto-stops when no particles remain

## effects reference
| Effect | Function | Particle Count | Duration |
|--------|----------|---------------|----------|
| Confetti Burst | confettiBurst(x,y,palette,count) | 80 | ~3s |
| Firework | firework(x,y,palette) | 60-100 | ~4s |
| Ring Explosion | ringExplosion(x,y,palette) | 90-120 | ~3s |
| Star Shower | starShower(palette,count) | 50 | ~4s |
| Spark Fountain | sparkFountain(x,y,palette,duration) | continuous | 1.5s |
| Pixel Rain | pixelRain(palette,count) | 80 | ~5s |
| Supernova | supernova(palette) | 180+ | ~4s |
| Screen Shake | screenShake(amount,duration) | 0 | custom |

## data sources
- sloppygram_karma (badge threshold checks)
- sloppygram_badges (earned badge persistence)

## issues
- None yet

## todos
- Could export effects as a reusable JS module for other apps to import
- Could add sound effects for celebrations
- Could add combo multiplier (multiple badges = bigger explosion)
- Could add seasonal themed effects (snow, fireworks, hearts)
- Could add custom particle emitters (user-designed effects)
- Could add achievement progress bars showing how close to unlock
