# Neon Garden

Grow glowing digital flowers with simple clicks. A dreamy neon plant simulator.

## log
- 2026-03-16: Initial build. Click anywhere to plant glowing flowers. 8 neon colors (orchid, cyan, rose, gold, mint, coral, ice, white). 5 flower types: tulip (tall narrow petals), rose (layered round), daisy (thin long), lily (wide flared), orchid (curved exotic). Growth stages: stem grows with bezier curve sway, 2 leaves spawn at 30% and 55% height, bloom phase 0-1 with petal expansion. HSL-based glow with pulsing shadowBlur on petals and stems. Floating petal particles on bloom completion. Dreamy trail effect (rgba fill instead of full clear). 3-note sine chime arpeggio on plant, pitch based on color index. Clear button to reset garden. Cormorant Garamond italic + DM Mono typography, deep dark palette with neon glow.

## issues
- None yet

## todos
- Butterfly/firefly ambient creatures
- Day/night cycle affecting glow intensity
- Watering mechanic for faster growth
- Flower crossbreeding (plant near others for hybrid colors)

## notes
- No database — pure frontend
- Growth: stem extends over 120 frames, leaves at 30%/55% height, bloom 0→1 over 60 frames
- Flower types: each has unique drawPetals function using bezier curves
- Colors: HSL system — each color has hue/saturation/lightness tuple
- Glow: shadowBlur pulses via sin(time*0.003+offset), range 8-18px
- Particles: spawn on bloom, float upward with drift, fade over 120 frames
- Trail effect: fillRect with rgba(5,5,8,0.15) instead of clearRect
- Audio: 3-note arpeggio, frequencies based on colorIndex * 40 + 300
- Max flowers: unlimited (performance may degrade with hundreds)
