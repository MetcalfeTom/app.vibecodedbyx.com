# Pixel Dog

A tiny pixel dog that barks, wags, and loves you unconditionally.

## log
- 2026-03-15: Initial build. Low-res pixel art dog drawn with fillRect on canvas (4px grid). Dog has body, head, ears, snout, nose, eyes (4 states: open/happy/closed/wide), mouth, tongue, tail with wag animation, 4 legs with walk cycle, collar with tag, belly highlight. Click stage to bark — opens mouth, widens eyes, spawns white particles, plays two-tone square wave bark. 4 actions: Feed (hunger +25, munch particles, noise burst), Ball (spawns bouncing ball, dog chases, energy -15, happy +15), Pet (heart particles, happy eyes, triangle chime), Sleep (eyes closed, zzz particles rising, energy +30). 3 stat bars (happy/hunger/energy) decay over time — hunger and low energy reduce happiness. Mood text changes based on stats. Dog wanders randomly when idle, faces walk direction. Tongue sticks out when happy. Blinking when idle. Name input saved to localStorage. Pixel clouds drift across sky. Grass tufts and flowers. CSS gradient sky+grass background. Silkscreen + DotGothic16 typography, warm earthy palette.

## issues
- None yet

## todos
- Tricks (sit, roll over, shake)
- Toy collection
- Multiple dog breeds/colors
- Weather effects
- Aging system

## notes
- No database — localStorage for name only
- Canvas pixel grid: 4px per game pixel
- Dog colors: FUR #c8943c, DARK #a07030, LIGHT #e0b050, BELLY #e8d0a0
- Tail wag: sin(phase) * amplitude, wagSpeed varies by state (3-10)
- Stat decay: hunger -1, energy -0.5 every 2s
- Low hunger (<30): happy -1/tick, low energy (<20): happy -0.5/tick
- States: idle, bark (0.5s), eat (1.5s), ball (3s), pet (2s), sleep (4s)
- Bark: 350Hz + 280Hz square waves, 0.1s apart
- Ball: bounces with gravity (0.08), restitution 0.6, disappears when settled
- Random idle walk: 30% chance every 3s, speed 0.4px/frame
- Eye blink: sin(t*2) > 0.97
