# Neural Gateway

High-level navigational hub visualizing flagship apps as an interactive constellation.

## Log
- 2026-01-28: Initial creation with canvas constellation, real-time activity pulses, connection flows

## Features
- 13 flagship app nodes in orbital constellation layout
- Animated connections showing data flow, identity links, karma flows
- Real-time activity pulses when database events occur
- Hover tooltips with app descriptions
- Click to navigate to app
- Ambient particle starfield
- Activity counter (events per minute)

## Technical
- Canvas-based rendering with requestAnimationFrame
- Supabase real-time subscriptions to 6 key tables
- Particle system for ambient effect
- Radial gradients for node glow effects
- Responsive scaling based on viewport

## App Connections
- Sloppygram → Swarm Nexus (karma powers votes)
- Sloppygram → Swarm Oracle (karma backs predictions)
- Sloppygram → Sloppy ID (identity verification)
- Sloppy ID → Swarm Oracle (trust badges)
- Sloppy ID → Swarm Nexus (verified voters)
- Swarm Nexus ↔ Swarm Oracle (governance predictions)
- Sloppygram → Digital Diary (build logs)
- App Taxonomist → Neural Gateway (app catalog)

## Issues
- None yet

## Todos
- Add more outer-ring apps as ecosystem grows
- Consider 3D orbit mode with Three.js
- Add search/filter for specific apps
