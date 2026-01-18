# Märklin Train Scheduler

## log
- 2026-01-18: Initial creation
  - Real-time priority scheduler simulation
  - Märklin DCC protocol visualization
  - Track layout with switches and sensors
  - Multi-train support with collision detection

## features
- Priority-based task scheduling (Rate Monotonic inspired)
- Real-time constraints simulation
- Märklin Digital (DCC-like) protocol display

### Task Types:
- EMERGENCY (P0) - E-stop handling
- COLLISION (P1) - Collision detection
- SWITCH_CTRL (P2) - Track switch control
- SPEED_CTRL (P3) - Acceleration/deceleration
- SENSOR_POLL (P4) - Track sensor polling
- TRAIN_MOVE (P7) - Position updates

### Track Features:
- Main line with passing siding
- 6 controllable switches (Weichen)
- 5 track sensors
- Loop section

### Embedded C Concepts:
- Task Control Block (TCB)
- WCET (Worst-Case Execution Time)
- Periodic task scheduling
- Priority inversion handling
- DCC packet format

## design
- JetBrains Mono + IBM Plex Sans fonts
- GitHub-dark color scheme
- Canvas-based track visualization
- Real-time task queue display

## controls
- Start/Pause simulation
- Emergency stop
- Add trains (max 4)
- Toggle switches
- Adjust train speeds
- Simulation speed slider

## todos
- Add route locking
- Add signal system
- Add more complex track layouts
- Add task deadline monitoring
- Add priority inversion demo

## issues
- None yet
