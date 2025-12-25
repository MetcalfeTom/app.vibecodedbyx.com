# Ornament Toss

Festive Christmas tree decoration game where players throw snowballs at a wobbly tree.

## log
- 2025-12-25: Added rare golden star that triggers massive screen shake + rainbow particle explosion
- 2025-12-25: Initial creation with wobbly tree physics, snowball throwing, ornament placement
- Features: spring physics for tree wobble, drag-to-throw aiming, collision detection, particle effects

## issues
- None yet

## todos
- Maybe add sound effects (snowball splat, ornament jingle)
- Could add combo bonuses for rapid hits
- Consider adding different ornament types

## notes
- Tree uses spring physics for realistic wobble (springK, damping)
- Collision detection checks against triangle layers of tree
- Ornaments stored with local coordinates relative to tree center
- Mobile-friendly with touch support
