# Meditation Garden

## log
- 2026-03-29: V1 — Neon meditation garden. Night sky with twinkling stars, moon with radial glow. Water surface of animated sine wave lines. 8 colored stone types (moonstone, amethyst, jade, sandstone, rose quartz, turquoise, amber, lapis) with pulsing neon glow, gradient body, highlight, edge glow, and water reflection. Tap to place stones with ripple physics (expanding concentric circles). 20 fireflies with fade-in/out glow. Ambient drone (4 layered sine oscillators with LFO shimmer). Singing bowl sound on stone placement. Breath guide cycle (breathe in/hold/breathe out/rest). Cormorant Garamond typography, dark blue-black night aesthetic.

## features
- Night sky with 60 twinkling stars, moon with glow
- Water surface: animated sine wave lines
- 8 stone colors with pulsing neon glow + body gradient + highlight
- Tap to place stones (max 12) with ripple physics
- Expanding concentric ripple circles on touch
- 20 fireflies with phase-based glow
- Ambient drone: 4 layered oscillators with LFO shimmer
- Singing bowl WebAudio on stone placement (fundamental + harmonic)
- Ripple water sound on touch
- Breath guide: 4-phase cycle shown as fading text
- Water reflections under stones

## issues
- None currently

## todos
- Drag to reposition stones
- Koi fish swimming in water
- Rain mode with water droplet sounds
- Day/night cycle

## notes
- Drone: 110Hz, 165Hz, 220Hz, 330Hz sine layers with 0.1-0.25Hz LFO
- Singing bowl: fundamental + 2.01x harmonic (slight detuning for shimmer)
- Breath cycle: 240 frames in, 60 hold, 300 out, 60 rest (~4s/1s/5s/1s at 60fps)
- Ripples: expand at 1.2px/frame, fade at 0.012/frame
- Fireflies: sinusoidal fade, wrap at screen edges
