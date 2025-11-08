# Cozy Pet

## Log
- Initial creation: Virtual tamagotchi-style pet game
- Features: feeding, playing, cleaning, sleeping, petting, medicine
- Stats: hunger, happiness, energy tracked with progress bars
- Evolution system: 4 stages (baby 🐣 → child 🐥 → teen 🐤 → adult 🐦)
- Leveling system: gain XP through actions, level up every 5 minutes with enough XP
- Age system: ages every minute
- Mood indicator based on average stats
- Dirty mechanic: random chance to get dirty, need to clean
- Sleep mode: regenerates energy over time
- Particle effects for actions
- Auto-save to localStorage
- Time-based stat decay (continues when away)
- Colorful gradient design with device frame aesthetic
- 6 action buttons with icons and labels

## Issues
- None yet

## Todos
- Could add more pet types/species to choose from
- Could add multiple pets
- Could add mini-games
- Could add items/inventory system
- Could add achievements/badges
- Could add social features (visit friends' pets)
- Could add customization (names, colors, accessories)
- Could add hunger/happiness/energy thresholds for evolution
- Could add pet photos/memories
- Could add day/night cycle
- Could save to database for cross-device sync
- Could add more evolution stages
- Could add death/revival mechanics

## Notes
- Color scheme: Gradients with pastels (#ffeaa7, #fab1a0, #ff7675, #a29bfe, #fd79a8, #74b9ff)
- 4 evolution stages tied to level (level 1: baby, 3: child, 6: teen, 10: adult)
- Stats decay: hunger -1/sec, happiness -0.5/sec, energy -0.3/sec
- Sleep mode: energy +2/sec while sleeping
- Time away calculation: reduces stats based on minutes passed
- XP gains: feed (2), play (5), clean (3), pet (1), heal (3)
- Level up requires: age % 5 === 0 AND xp >= level * 10
- Actions: Feed (+20 hunger, +5 happiness), Play (+25 happiness, -15 energy, -10 hunger), Clean (removes dirty), Sleep (toggles sleep mode), Pet (+10 happiness), Heal (+30 all stats)
- Mood levels: Very Sad (<20), Sad (<40), Okay (<60), Good (<80), Happy (80+)
- Random dirty chance: 2% per second
- Particle effects on actions with floating emojis
- Bounce animation for pet sprite
- Shake animation on interaction
- Sleep animation with rotation
- LocalStorage for persistence
- CSP header included for security
- Mobile responsive with 2-column grid on small screens
