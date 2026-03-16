# Robo Lab

Robotic testing facility. Power up a robot, run diagnostics, stress tests, and shock it with electricity.

## log
- 2026-03-16: Initial build. Canvas-drawn robot with articulated limbs (arms swing, legs move during servo test). Head with glowing green eyes + tracking pupils, animated mouth equalizer bars, blinking antenna LED. Chest panel with 6 color-cycling LEDs and CPU load bar. 6 arc gauges: CPU Load, Core Temp, Power, Servo RPM, Signal, Memory — each with needle, ticks, color thresholds (green→yellow→red), glow. 6 control buttons: Power (toggle on/off with boot/shutdown sounds), Diagnostics (6 subsystem checks with pass/fail), Stress Test (maxes all gauges for 6s with screen shake), Servo Test (arms+legs animate, RPM ramps), Shock Test (electric spark particles + noise burst + shake), Factory Reset (descending arpeggio, all zeroed). System log with timestamped entries, auto-scroll, 200-line cap. Status bar with live dot (green/yellow/red), uptime counter, unit ID. 8 Web Audio SFX. Chakra Petch + Share Tech Mono typography, dark industrial palette with green/orange accents.

## issues
- None yet

## todos
- Add robot personality reactions (happy eyes on good diagnostics, sad on fail)
- Temperature smoke particles when overheating
- Multiple robot models to test
- Repair minigame when diagnostics fail

## notes
- No database — pure frontend
- Gauge rendering: arc from 0.8π to 2.2π, needle rotates proportionally, color changes at warn/crit thresholds
- Some gauges have invertWarn (power/signal: low = bad)
- Values lerp toward target at 0.04 rate with small random drift when powered
- Robot shake: multiplied by 0.95 per frame, applied as random translate offset
- Spark particles: velocity + gravity, fade by life/maxLife ratio, orange glow
- Servo test: 4.5s duration, arms swing ±15°, legs offset, RPM ramps to 7500
- Stress test: 6s duration, all gauges spike, then cool down
- Boot sound: ascending square wave 200→800Hz, shutdown: descending 800→150Hz
