# Neon Weather Terminal

## log
- 2026-01-17: Initial creation
  - Cyberpunk neon aesthetic with glitchy animations
  - CRT scanlines and VHS noise overlay
  - Glitch text effects with clip-path animations
  - Flickering neon glow effects
  - Open-Meteo API (free, no key required)
  - Geolocation support with fallback to New York
  - City search functionality
  - Current weather with icon, temp, feels like
  - Stats: wind, humidity, pressure, UV index
  - 24-hour hourly forecast scroll
  - Auto-refresh every 5 minutes
  - Random glitch bars animation
  - Mobile responsive

## features
- Real-time weather data from Open-Meteo
- Geolocation for current position
- City search with geocoding
- Weather code to emoji icon mapping
- Wind direction compass (N/NE/E/etc)
- 24-hour scrollable forecast
- Multiple glitch/CRT effects layered

## design
- Share Tech Mono + Orbitron fonts
- Neon cyan, magenta, green, yellow palette
- Dark background with panel cards
- Scanline overlay animation
- Border scan animation on cards
- Floating weather icon animation
- VHS noise texture

## api
- Open-Meteo Forecast API (no key)
- Open-Meteo Geocoding API (no key)
- Endpoints:
  - /v1/forecast for weather
  - /v1/search for city lookup

## todos
- Add 7-day forecast
- Add weather alerts if available
- Add animated rain/snow effects on screen
- Add sound effects (optional)
- Save last searched city to localStorage

## issues
- None yet
