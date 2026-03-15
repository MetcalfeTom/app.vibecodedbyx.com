# Neon Duel Tracker

Track life points for card duels. Neon. Metallic. It's time to duel.

## log
- 2026-03-15: Initial build. Two-player life point tracker (8000 LP each). Split-screen layout with P2 rotated 180deg for face-to-face play. Quick buttons (-100/-500/-1K/+100/+500/+1K), custom LP input with +/- apply, halve LP button. Animated LP counter (cubic eased 400ms). Damage/heal animations on LP display. Pulse ring effect on damage. Divider bar with Reset, Coin Flip, Dice Roll, and Log toggle. Slide-out duel log panel with timestamped entries. Victory overlay when LP hits 0. 8 Web Audio sound effects: duel disk activation (sawtooth sweep + metallic ring), damage (noise burst + low thud), big damage (distorted noise + bass drop + metallic scrape), heal (rising A-C#-E chime), coin (metallic clink), dice (rattling noise bursts), victory (C-E-G-C fanfare), reset (power-up sweep). Hexagonal background pattern. Metallic gradient buttons with beveled borders. Corner rivets. Orbitron + Rajdhani typography. Cyan vs red neon player colors with glow text-shadows.

## issues
- None yet

## todos
- Turn counter
- Timer per turn
- LP history graph
- Custom starting LP (4000/8000/16000)
- Player name customization
- Chain link counter

## notes
- No database — pure frontend
- P2 zone rotated 180deg via CSS transform for face-to-face tablet play
- LP animation: cubic ease-out over 400ms via requestAnimationFrame
- Damage threshold: >=1000 triggers bigdamage sound, <1000 triggers damage sound
- Pulse ring: div with border, scale(0.5→3) + opacity(0.6→0) over 0.6s
- Coin: 50/50 Math.random, result shown as fixed overlay for 1.5s
- Dice: 1-6, displayed with emoji
- Log: reverse-chronological, player-colored values, slide-in panel
- Keyboard: R=reset, C=coin, D=dice, L=log
- First interaction triggers duel disk activation sound
- Double-tap zoom prevention for mobile
