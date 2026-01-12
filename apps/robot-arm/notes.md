# Robot Arm Sandbox

## log
- 2026-01-12: Created physics sandbox with 3-segment robot arm
- 2026-01-12: Added feather item that tickles dinosaurs
- 2026-01-12: Added coconut that causes death animation on dino head hit
- 2026-01-12: Added mouse/touch controls with inverse kinematics

## features
- 3-segment articulated robot arm with inverse kinematics
- Mouse/touch controls: move to aim, click to grab, release to throw
- Keyboard controls also available (Q/A/W/S/E/D/R/F/SPACE)
- Physics simulation with gravity, friction, bounce
- Neon crates in random colors (cyan, magenta, yellow, green)
- Neon T-Rex dinosaur with:
  - Tickle animation (laughing, shaking, "HA HA" text)
  - Death animation (X eyes, ghost rising, limp limbs)
- Feather item:
  - Floats gently with swaying motion
  - Triggers tickle when touching dino
- Coconut item:
  - Falls with normal gravity
  - Causes death when hitting dino head at speed
  - Bounces off after impact
- Throw velocity based on arm movement
- Objects collide with ground and walls
- Spawn buttons for all item types
- Reset scene button
- Neon cyberpunk aesthetic
- Trail effect for motion blur

## issues
- None yet

## todos
- Could add more object types (balls, triangles)
- Could add object-to-object collision
- Could add score for throwing distance
- Could add target zones
- Could add sound effects
