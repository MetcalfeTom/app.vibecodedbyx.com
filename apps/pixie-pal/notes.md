# Pixie Pal

Retro virtual pet — hatch a fairy creature and raise it through 5 evolutions.

## log
- 2026-04-10: Initial build. 5 species (Fae/Wisp/Sprout/Ember/Frost), 6 evolution stages (Egg→Hatchling→Sprite→Pixie→Fairy→Monarch), 4 actions (Feed/Play/Sleep/Heal), stat decay over time, sickness mechanic. Canvas-based rendering with species-colored creatures, wing flap animation, crown for Monarch, antenna for Fairy+. Pixelify Sans + Press Start 2P typography, dark purple/lavender device aesthetic with starfield background.

## features
- 5 fairy species with unique hue/color
- 6 evolution stages (XP thresholds: 0/30/100/250/500/1000)
- Feed cycles through 4 food types (Berry/Nectar/Cake/Stardust)
- Play costs energy, boosts happiness
- Sleep toggle recovers energy
- Sickness from neglect, heal with sparkle
- Particle effects on evolution/feeding/playing/healing
- localStorage persistence
- Animated wings, blinking, bouncing, sleeping Zs

## issues
- No Supabase integration (local only)
- No pet death mechanic
- No naming your pet

## todos
- Supabase persistence for cross-device
- Pet naming
- Mini-games for play action
- More food variety
- OG preview PNG
