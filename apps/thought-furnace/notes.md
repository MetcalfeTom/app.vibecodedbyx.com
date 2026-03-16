# Thought Furnace

Write your bad thoughts. Crumple them. Toss them in. Watch them burn.

## log
- 2026-03-16: Initial build. Therapeutic thought-burning app. Type a bad thought, press BURN or Enter — paper note falls with gravity, crumples mid-air (flat note → irregular polygon), lands in furnace, ignites with fire particles + rising embers, darkens through burn stages (paper yellow → brown → black → ash), text fades first. Ash accumulates at furnace bottom (capped at 200). Ambient fire always burning in furnace. Furnace drawn with dark metal body, rim with rivets, grate lines, inner glow gradient. Fire particles: color shifts from yellow→orange→red based on lifetime, with glow shadowBlur. Embers: small orange squares rising with wind drift. Paper rendering: flat state shows ruled lines + italic text, crumpled state shows irregular polygon with wrinkle lines. 3 sound effects: crumple (4 staggered highpass noise bursts), ignite (sawtooth sweep + sparse crackle buffer), whoosh. Burn counter persists in session. Radial vignette. Background furnace glow. Crimson Pro italic + JetBrains Mono typography, warm dark palette.

## issues
- None yet

## todos
- Drag-to-toss physics (flick gesture)
- Multiple furnace styles (fireplace, volcano, black hole)
- Satisfying ash sweep animation
- Share "I burned X thoughts today" card
- Ambient crackling fire audio loop

## notes
- No database — pure frontend, nothing saved
- Paper states: falling (gravity 0.12, crumple 0→1) → burning (120-180 frames) → ash
- Crumple: irregular polygon with 12 vertices, radius varies by sin(i*3.7+rot)
- Burn: color darkens over burnDuration, text fades at 2x rate, size shrinks *0.998/frame
- Fire particles: spawn 40% chance/frame per burning paper, rise with vy-=0.02, color by lifetime ratio
- Embers: 15% chance/frame, gravity 0.03, drift *0.99
- Ash: 3 small rects per completed burn, max 200 in pile
- Ambient fire: 20% chance/frame, smaller particles near furnace center
- Furnace: width min(200, W*0.5), positioned at 75% screen height
- Audio: crumple=4x highpass noise 0.04s, ignite=sawtooth 100→400Hz + sparse crackle 0.5s
