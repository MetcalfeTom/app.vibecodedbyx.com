# Koi Pond

## log
- 2026-04-07: Initial build — zen koi pond with click-to-ripple and fish that swim toward disturbances. 9 koi color palettes (orange/white, gold, silver, pink, blue, etc.) with 4 spot patterns. Animated fins, tails with wiggle, ellipse bodies. Ripples spawn in waves of 3 with sparkle particles. Floating leaves drift. Caustic light patches shift slowly. Shippori Mincho typography, deep teal/dark green pond palette.

## features
- 9 koi color palettes with 4 different spot patterns each
- Procedural fish drawing: tail with wiggle, body, fins, eye with highlight
- Click/tap creates 3 staggered ripple waves + sparkle particles
- Nearby fish (within 400px) swim toward click point with speed boost
- New fish swim in from edges occasionally on click (up to 25 max)
- Floating lily-pad-style leaves drift across the pond
- Slow-moving caustic light patches for water depth
- Smooth angle interpolation for natural fish turning
- Soft edge bouncing
- Touch support
- Counter showing total koi
- Haiku at bottom for atmosphere

## issues
- No actual water shader or wave displacement (purely particle/ripple effects)
- Fish don't have z-depth or shadowing
- No sound (could add gentle water lapping)

## todos
- WebAudio: gentle water sounds, wind chimes
- Day/night cycle with moonlight
- Stone/lantern decorations
- Feed-the-koi mode where pellets attract fish
- Cherry blossoms drifting in
- OG image
