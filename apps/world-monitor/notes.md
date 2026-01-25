# World Monitor

Global operations dashboard with simulated camera feeds, news tickers, and flight data.

## log
- 2026-01-25: Initial creation
  - 6-panel dashboard layout with header
  - Simulated camera feeds with noise/static effect
  - World map with animated flight paths
  - Live departures/arrivals tables
  - System alerts panel
  - Scrolling news ticker
  - Real-time UTC clock

## features
- 4 simulated surveillance camera feeds with static/noise
- Camera labels (NYC, London, Tokyo, Sydney)
- Local timezone timestamps on each camera
- Scan lines and occasional glitch effects
- World map with city markers
- Animated flight dots traveling between cities
- Curved flight paths with smooth animation
- Departures table with flight/dest/time/gate/status
- Arrivals table with similar data
- Status badges (on-time, delayed, boarding, departed)
- Global statistics cards (flights, passengers, delays, on-time rate)
- System alerts with severity levels (danger, warning, info)
- Scrolling news ticker with aviation headlines
- Live UTC clock in header
- Status indicators for systems/feeds

## design
- Dark command center aesthetic
- Share Tech Mono + Orbitron fonts
- Green/cyan accent colors
- Pulsing status indicators
- Grid overlay on world map
- Responsive 3-column layout

## data simulation
- Camera feeds: canvas-based noise generation
- Flights: random spawn between city pairs
- Tables: randomized airline codes, times, gates
- Stats: periodic random fluctuations
- Alerts: rotating set of realistic scenarios

## todos
- Add real-time flight API integration
- Add weather radar overlay
- Add clickable camera feed expansion
- Add sound alerts for critical events

## issues
- None yet
