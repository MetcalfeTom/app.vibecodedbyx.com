# Cube Drift

Floating colorful cubes screensaver with soft gravity physics.

## log
- 2026-03-18: Initial build. 18 3D cubes with perspective projection, face sorting (painter's algorithm), per-face shading. Soft orbiting gravity center pulls cubes inward, cube-cube repulsion prevents overlap, heavy damping for relaxing drift. Mouse repels cubes. Fading trail effect via transparent background clear. Subtle connection lines between nearby cubes. Per-cube glow pulse. Click/tap to randomize color palette (3 palettes). No cursor shown. No fonts loaded — pure visual screensaver.

## issues
- None yet

## todos
- More palettes
- Ambient music option
- Cube size breathing
- Fullscreen button

## notes
- No database — pure frontend
- 3D projection with manual rotation matrices (X/Y/Z)
- Gravity center orbits slowly for organic movement
- Damping factor 0.3^dt keeps speed relaxing
- Speed capped at 40px/s
