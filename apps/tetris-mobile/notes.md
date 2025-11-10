# Tetris Mobile

Mobile-optimized classic Tetris with touch controls and swipe gestures.

## Log
- 2025-11-09: Initial creation with mobile-first design
  - Implemented all 7 classic tetromino pieces (I, O, T, S, Z, J, L)
  - Touch controls: swipe left/right to move, swipe down for hard drop, swipe up to hold, tap to rotate
  - On-screen button controls as backup
  - Ghost piece preview showing landing position
  - Next piece preview
  - Hold piece functionality
  - Progressive difficulty system
  - Line clearing with score multipliers
  - Level progression every 10 lines
  - Modern gradient UI with glassmorphism effects
  - Responsive layout optimized for mobile screens
  - Pause functionality
  - Game over screen with final stats
  - Swipe hint on first game
  - Keyboard controls for desktop testing

## Features
- **Controls:**
  - Touch: Swipe ←→ to move, ↓ for drop, ↑ for hold, tap to rotate
  - Buttons: All actions available as buttons
  - Keyboard: Arrow keys, Space/Up to rotate, C to hold, P to pause

- **Gameplay:**
  - Ghost piece shows where piece will land
  - Hold piece system (can hold one piece at a time)
  - Progressive speed increase with levels
  - Classic scoring: 100/300/500/800 for 1/2/3/4 lines

## Issues
- None reported yet

## Todos
- Could add sound effects
- Could add particle effects for line clears
- Could integrate with leaderboard system
- Could add combo multipliers
- Could add T-spin detection and bonus points
- Could add touch vibration feedback
- Could add custom color themes

## Technical Details
- Pure vanilla JavaScript
- Canvas-based rendering
- Touch event handling with gesture detection
- Responsive CSS Grid layout
- Glassmorphism UI design
- 60fps game loop
- Progressive drop speed: 1000ms base, reduces by 50ms per level
