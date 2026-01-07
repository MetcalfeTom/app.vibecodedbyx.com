# Pirate Coin Pusher

## log
- 2026-01-07: Initial creation - physics-based coin pusher with pirate doubloons

## features
- Physics-based coin simulation (gravity, friction, bounce)
- Coin-to-coin collision detection and resolution
- Oscillating wooden pusher bar
- Gold and silver doubloons with skull designs
- Treasure items (gems, chests, rings) for bonus points
- Treasure slot collection zone
- Player coin inventory system
- Score tracking with local storage best score
- Sparkle effects on coins

## gameplay
- Start with 10 doubloons
- Click/tap drop zone to release coins
- Pusher moves back and forth pushing coins
- Coins that fall into treasure slot = points + coins back
- Collect treasure items for bonus points
- Try to push as many coins off the edge as possible

## design
- Pirata One and IM Fell English SC fonts
- Gold/brown pirate color scheme
- Wood texture on pusher
- Skull decorations on coins and pusher
- Radial gradients for 3D coin effect

## technical
- Canvas 2D rendering
- Custom physics: gravity, friction, collision response
- Coin-coin elastic collisions with impulse resolution
- RequestAnimationFrame game loop
- Touch and mouse input support

## todos
- Add sound effects (coin clinks, treasure collect)
- Add combo multiplier for multiple coins
- Add special power-ups
- Add more treasure variety
- Add coin drop cooldown
