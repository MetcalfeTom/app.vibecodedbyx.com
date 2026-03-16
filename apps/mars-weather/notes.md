# Mars Weather Station

Live weather from the red planet. Dust storms, thin air, and frozen sunsets.

## log
- 2026-03-16: Initial build. Simulated Mars weather station with red neon interface. Data seeded from current date so all users see same "day" of weather. Real Mars-like ranges: temp -95 to -20C, pressure 600-720 Pa, wind 3-28 m/s, opacity 0.2-1.7 tau, humidity trace. 5 atmosphere gases with correct percentages (CO2 95.3%, N2 2.7%, Ar 1.6%, O2 0.13%, CO 0.08%). Dust storm alert system: 3 severity levels + all-clear state, pulsing border animation on active alerts. Wind compass with rotating needle. 24-point sparkline history graphs for temp/pressure/opacity. 7-sol forecast with condition icons. Floating dust particle canvas (count scales with opacity). Dust haze overlay at high opacity. Sol counter from real date conversion. Animated LMST clock. CRT scan line overlay. Share Tech Mono + Rajdhani typography, red neon on dark mars-surface palette.

## issues
- None yet

## todos
- Seasonal dust storm patterns (Ls-based Mars calendar)
- Rover cam placeholder images
- Compare with Earth equivalent conditions
- Historical sol lookup

## notes
- No database — pure frontend, deterministic from date
- Seeded RNG: mulberry32 from sol*7919+hour, same data for all users same hour
- Sol calculation: days from 2026-01-01 / 1.027 (Mars sol length ratio)
- Temperature: base -63±15, range ±32 from base, sin variation ±2C live
- Pressure: 600-720 Pa (real Mars ~610 avg), sin variation ±5 live
- Opacity: 0.2-1.7 tau, >1.0 = dustStorm, severity = floor((opacity-1)*3)+1
- Dust particles: 20 + opacity*60 count, canvas overlay, haze at opacity>0.5
- Alert: level 1 = advisory, level 2 = warning, level 3 = global event
- Sparklines: 24 points, min-max normalized, glow layer at 15% alpha
- Atmosphere bars: CO2 shown at true % scale, small gases scaled 20x for visibility
- Forecast: seeded per future sol, 6 condition types
- Live update: 200ms interval for smooth value fluctuation
