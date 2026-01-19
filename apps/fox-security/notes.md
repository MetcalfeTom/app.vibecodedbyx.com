# Fox Security Grid

## log
- 2026-01-19: Initial creation
  - Animated laser grid with horizontal/vertical beams
  - Fox-detecting motion sensors with live readings
  - Thermal scanner display
  - Fox probability detector
  - Alarm siren with Web Audio API
  - Red/blue flashing alert overlay
  - Security log with timestamps
  - Click fox to capture it
  - Random fox spawns every ~50 seconds
  - CRT scanline effect

## features
- Laser Grid:
  - 8 horizontal + 10 vertical laser beams
  - Red glow effects
  - Pulsing animation
  - Toggle on/off
- Sensors:
  - Motion Sensor A1 (activity level)
  - Thermal Scanner B2 (heat signature)
  - Fox Detector C3 (fox probability)
  - Live updating values
  - Color-coded status (green/yellow/red)
- Alert System:
  - Siren sound (sawtooth wave sweep)
  - Red/blue flash overlay
  - Status badge changes
  - All sensors trigger
- Fox Detection:
  - Random spawns on grid
  - Click to capture
  - Detection counter
  - Log entries

## design
- Share Tech Mono + Orbitron fonts
- Terminal/hacker aesthetic
- CRT scanline overlay
- Green-on-black color scheme
- Red alerts

## controls
- GRID ON/OFF: toggle laser grid
- SIMULATE FOX: spawn a fox manually
- TEST SIREN: test alarm sound
- CLEAR LOG: clear security log
- RESET SYSTEM: full reset

## todos
- Add more fox types
- Add difficulty levels
- Add high score tracking
- Add night vision mode

## issues
- None yet
