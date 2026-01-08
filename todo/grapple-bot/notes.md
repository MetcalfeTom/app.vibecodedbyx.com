# Grapple Bot

## log
- 2025-01-02: Initial creation - grappling hook platformer with Matter.js physics

## features
- Tiny robot character with glow effect
- Grappling hook with rope physics (Matter.js constraints)
- Click/tap to grapple to yellow anchor points
- Release to detach and maintain momentum
- 5 levels of increasing difficulty
- Dark neon factory aesthetic
- Win condition (reach green exit)
- Death on falling into void or hitting hazards
- Mobile controls (D-pad + jump button)
- Keyboard controls (WASD/Arrows + Space)

## levels
1. Tutorial - basic platforming and grapple intro
2. Pit crossing - swing across gaps
3. Vertical climb - ascend using grapple points
4. Swing challenge - momentum-based traversal
5. Factory escape - final climb to freedom

## technical
- Matter.js for physics engine
- Constraints for rope/grapple simulation
- Custom canvas rendering over Matter.js
- Body labels for collision detection
- Sensor bodies for exit zone
- Mobile touch events with preventDefault

## controls
- A/D or ←/→: Move left/right
- W/Space/↑: Jump (when grounded)
- Click/Tap: Shoot grapple to nearest anchor
- Release click: Detach grapple

## issues
- None yet

## todos
- Add swinging enemies
- Add collectibles/coins
- Add timer/speedrun mode
- Add more levels
- Add particle effects on grapple
- Add sound effects
- Add level select screen
