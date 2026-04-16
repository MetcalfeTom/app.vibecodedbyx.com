# Sun Nap

Track sunbeams across a room to find the perfect napping spot.

## log
- 2026-04-16: Initial build. Top-down room with 3 windows (2 top, 1 right), 6 furniture pieces. Sunbeam raycasting from sun position through windows based on time of day. Sun follows parabolic altitude arc (6am–8pm), azimuth east-to-west. Heatmap precomputed over 48 time samples showing cumulative sun exposure. Click to place up to 5 nap spots with sun exposure scoring (minutes of sunlight, 6-tier rating system). Time slider 0–24h with auto-play at 5x speed. Day/night rendering with darkened palette at night. Playfair Display + Red Hat Mono typography, warm golden palette.

## features
- Canvas room with furniture, windows, floor boards
- Sunbeam raycasting through windows with gradient fills
- Sun altitude/azimuth simulation (simplified)
- Heatmap overlay showing cumulative sun exposure
- Up to 5 nap spots with sun-minute scoring
- 6 rating tiers: Solar Overload, Sun Bath, Perfect Nap, Cozy Spot, Dappled Shade, Shadow Dweller
- Time slider with auto-play
- Day/night cycle with visual transitions
- Touch support
- Right-click or tap existing spot to remove

## issues
- Beam geometry is simplified (trapezoid projection, not true raycast with occlusion per furniture piece)

## todos
- Furniture shadow occlusion on beams
- Draggable furniture
- Room editor
- Save/share room layouts
- Seasonal sun angle variation
