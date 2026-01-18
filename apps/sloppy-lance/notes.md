# Sloppy-Lance

## log
- 2026-01-18: Initial creation
  - A* pathfinding algorithm for intrusion tracing
  - Dynamic network topology generation
  - Real-time visualization of algorithm execution
  - Security event logging

## features
- A* algorithm implementation for attack path finding
- Visual network topology with multiple node types
- Real-time pathfinding visualization
- Open/Closed set display during A*

### Node Types:
- Firewall (weight: 5) - Highest security
- Database (weight: 4) - High value target
- Server (weight: 3) - Medium security
- Router (weight: 2) - Network infrastructure
- Workstation (weight: 1) - User endpoints
- IoT Device (weight: 1) - Vulnerable entry points

### A* Implementation:
- Heuristic: Euclidean distance between nodes
- Cost function: Based on node security weight
- f(n) = g(n) + h(n)
- Visual step-through of algorithm execution

### Security Features:
- Attack source detection
- Target identification
- Node isolation capability
- Threat clearing
- Attack simulation

## design
- Rajdhani + Share Tech Mono fonts
- Dark cybersecurity aesthetic
- Red/cyan/purple color scheme
- Animated threat indicators
- Canvas-based network visualization

## controls
- Trace Path: Run A* algorithm
- Isolate Node: Quarantine compromised nodes
- New Network: Generate fresh topology
- Clear Threats: Reset all compromises
- Simulate Attack: Add new threat
- Trace Speed slider

## todos
- Add network packet animation
- Add firewall rule visualization
- Add multiple simultaneous traces
- Add export trace report
- Add node vulnerability scores

## issues
- None yet
