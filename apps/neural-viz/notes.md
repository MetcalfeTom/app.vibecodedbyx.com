# Neural Network Visualizer

## log
- 2026-01-05: Initial creation - canvas neural network with signals

## features
- Multi-layer neural network visualization
- Glowing nodes with activation states
- Pulsing connection lines
- Signal propagation through layers
- Fire single signal or burst all inputs
- Auto-fire mode for continuous activity
- Click near input nodes to fire manually
- Reshape network with random connections
- Node/signal counters in HUD
- Layer labels (Input, Hidden, Output)

## design
- Cyan/magenta color scheme
- Dark background with fade trails
- Radial gradients for glows
- IBM Plex Mono + Exo 2 fonts
- Signal trails with bright cores
- Activated nodes turn green

## technical
- Pure vanilla JavaScript + Canvas 2D
- No external libraries
- requestAnimationFrame loop
- Layered network structure (4-6-8-6-3)
- Random connection weights
- Signal strength decay on propagation
- Node activation decay over time

## issues
- None yet

## todos
- Add weight visualization mode
- Add different network architectures
- Add training simulation
- Add input pattern drawing
