# Tickle Machine

## log
- 2026-03-29: V1 — Digital tickle machine with fuzzy purple blob mascot. Canvas-rendered character with 80 procedural fuzzy hairs (bezier curves with wave animation), wobbly body, expressive eyes (squint when tickled, pupils track pointer), dynamic mouth (opens wider with tickle level, shows teeth and tongue), wiggling arms, blush cheeks. Tickle level meter 0-100%. WebAudio giggle sounds (ascending sine bursts) and big laugh (ha-ha pattern). Laugh particles (emoji sparkles). Squish deformation toward poke point. Jiggle physics with decay. Fredoka + Nunito typography, purple/pink soft aesthetic.

## features
- Fuzzy blob mascot with 80 procedural hair strands
- Pointer drag to tickle (continuous while held)
- Squish deformation toward touch point
- Eye tracking (pupils follow pointer)
- Expression system: eye squint, mouth open, blush all scale with tickle level
- Wiggling arms when tickled
- Tickle meter with gradient fill
- WebAudio giggle sounds (random pitch, burst count)
- Big laugh at high tickle levels
- Emoji laugh particles (sparkles, laughing faces)
- Random laugh text ("hehe", "HAHAHA", "stop!!", etc.)
- Tickle counter

## issues
- None currently

## todos
- Add tickle zones (feet more sensitive than belly)
- Costume/hat customization
- Multiple mascot colors
- Tickle combo multiplier

## notes
- 80 fuzzy hairs with individual phase/speed/hue for organic feel
- Body is wobbly circle (sin deformation at 5 frequency)
- Squish decays at 0.85/frame, wobble at 0.92/frame
- Tickle level decays at 0.992/frame (slow cooldown)
- Big laugh triggers randomly above 85% tickle level
