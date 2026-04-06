# Shimmer Touch

## log
- 2026-04-06: Initial build — relaxing glitter wall with sparkling mouse trails and WebAudio chime sounds. 4-point star glitter particles with twinkle, soft glow trails, click chord bursts with ripples. 6 color palettes, pentatonic chime scale based on Y position. Newsreader typography, minimal dark aesthetic.

## features
- Glitter particles with 4-point star shape, twinkle animation, glow halo, gravity drift
- Mouse/touch trails spawn glitter proportional to movement speed
- Click/tap creates burst of 25 glitters + expanding ripple + 3-note chord
- WebAudio chimes: pentatonic scale, pitch mapped to vertical position (high=top, low=bottom)
- Sine oscillator + harmonic overtone for bell-like tone
- 6 color palettes: Aurora, Rose Gold, Ocean, Lavender, Firefly, Prism
- Soft trail fade rendering for dreamy atmosphere
- Ambient glow follows cursor
- Custom cursor (circle + dot)
- Start overlay with audio context initialization (user gesture required)
- Touch support with full trail + chime

## issues
- Many radialGradient calls can lag on low-end devices
- Audio rate-limiting may miss some fast movements
- No way to clear canvas

## todos
- Add screenshot/save button
- Background ambient drone option
- Particle shape options (circles, diamonds, hearts)
- Gravity/wind controls
- OG image
