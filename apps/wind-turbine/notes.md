# Wind Turbine Simulator

Control wind speed and blade pitch on a realistic turbine. Watch power output change in real time.

## log
- 2026-04-13: Initial build. Physics-based 3MW wind turbine simulation with Heier Cp model, rotor inertia dynamics, aerodynamic/generator/friction torque balance. Canvas-rendered nighttime scene with tapered blades, nacelle, tapered tower, distant turbines, clouds, moon, wind particles. Controls: wind speed 0-30 m/s, blade pitch 0-90°, yaw angle ±45°, brake, auto-pitch mode. Gauges: power output (kW), rotor RPM, tip speed ratio (λ). Power history graph. Status indicators (generating, low wind, high wind cutout, braking, rated). Wind turbulence model. DM Sans + JetBrains Mono typography, dark navy instrument panel aesthetic. Mobile responsive (stacked layout).

## features
- Physics: Heier Cp curve, rotor inertia, aero/gen/brake/friction torques
- Cut-in (3 m/s), rated (12 m/s), cut-out (25 m/s) wind speeds
- Adjustable wind speed, blade pitch, yaw angle
- Emergency brake
- Auto-pitch mode (targets 15 RPM)
- Wind turbulence simulation
- Canvas nighttime scene with moon, clouds, stars
- Tapered blade rendering with pitch-dependent chord
- 4 distant background turbines
- Wind particle streaks
- Aviation warning light on nacelle
- Power output gauge with color states
- RPM gauge, tip speed ratio display
- Real-time power history graph
- Status indicators
- Mobile responsive layout

## issues
- None known

## todos
- OG preview PNG
- Sound effects (whoosh at varying RPM)
- Day/night cycle
- Multiple turbine wind farm view
- Annual energy production calculator
- Supabase leaderboard (max sustained power)
- Turbine specification presets (1.5MW, 3MW, 5MW)
