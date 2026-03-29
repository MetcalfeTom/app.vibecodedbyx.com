# Neon Lighthouse

## log
- 2026-03-29: V1 — Atmospheric lighthouse scene with sweeping light beam over stormy sea. Canvas-based, fully procedural. Lighthouse with striped tower, lamp room, glass panes, roof, railing, rock base. Light beam with radial gradient falloff + bright inner core + lens flare. 4-layer sea waves with sine composition, foam whitecaps. Rain (200 drops, wind drift). Clouds (8 layered ellipses, drifting). Lightning bolts with branching + sky flash. Dim twinkling stars behind clouds. Beam reflection on water surface with shimmer. Horizon glow. Cormorant Garamond + IBM Plex Mono typography, deep navy/teal palette.

## features
- Sweeping lighthouse beam with radial gradient + inner core
- Beam reflection on water surface with shimmer streaks
- 4-layer sea waves (sine wave composition)
- Foam whitecaps on wave crests
- 200 rain particles with wind drift
- 8 drifting cloud layers with sub-puffs
- Random lightning bolts with sub-branches + sky flash
- Twinkling stars (dimmed by cloud cover)
- Lighthouse: striped tower, lamp room, lens flare, railing, rock base
- Horizon glow line
- Title fades after 5 seconds

## issues
- None currently

## todos
- Ship silhouette on the horizon
- Seagull silhouettes
- Sound effects (waves, thunder, rain)
- Fog/mist layer
- Interactive beam angle (mouse/touch)

## notes
- Beam sweep: sin(time*0.35)*0.65 radians, ~7 second period
- Wave layers: 4 with increasing frequency/speed, decreasing amplitude
- Lightning probability: 0.3% per frame (~every 5-6 seconds average)
- Rain wind: -1.5 to -3.0 px/frame (blowing left)
- Cloud speed: 0.15-0.45 px/frame
- Sea position: 62% of viewport height
- Lighthouse at 70% X (65% on mobile)
