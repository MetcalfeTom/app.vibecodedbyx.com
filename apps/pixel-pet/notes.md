# Pixel Pet

Hatch a pixel creature. Feed it, play with it, watch it grow and change colors.

## log
- 2026-03-22: Initial build. Tamagotchi-style pixel pet on low-res canvas (35x35 grid). Random name from 15 options, random starting hue. 3 actions: Feed (+food), Play (+happy, -food), Sleep (regen happy). Click pet to nudge hue and gain small happiness. Stats: food/happy (0-10) decay over time (every 60s). XP system — level up shifts hue +35deg. Pet grows larger with level (body scales 3-7px). Visual features unlock: antennae at L3, extended at L5, crown at L8. Blinking, bobbing idle animation. Mood text from ecstatic to miserable. Floating heart/star particles. Offline time processing. Silkscreen + DotGothic16 typography, purple device frame / dark LCD aesthetic.

## issues
- None yet

## todos
- Mini-games for play action
- Pet evolution (different body shapes at milestones)
- Multiple pets
- Accessories/hats

## notes
- No database — pure frontend, localStorage only
- Key: pixel-pet-v2
- 8px pixel scale, 35x35 virtual canvas
- Hue shifts +3 on click, +35 on level up — creates color journey
- Food decays 0.2/min, happy decays 0.15/min
- Sleeping: happy regens +0.4/min, food still decays slowly
- Offline: processes elapsed minutes on load for decay
- Level needs: level * 10 XP (feed=2xp, play=3xp)
