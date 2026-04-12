# Ragdoll Gears

Chaotic ragdoll physics simulator. Click & drag to throw stick figures into giant spinning gears.

## log
- 2026-04-12: Initial build. Verlet-integration ragdoll physics with 12-node stick figures (head, neck, chest, hip, elbows, hands, knees, feet, 16 constraints). 3 default spinning gears with teeth geometry. Gear collision pushes ragdolls and applies tangential rotation force — teeth gaps grab limbs for extra chaos. Spark particles, blood splats, crunch/grind SFX. Click & drag to throw with power indicator. R to reset, G to add random gears, +/- for gear speed. Chakra Petch + Share Tech Mono typography, dark industrial orange aesthetic.

## features
- Verlet-integration ragdoll physics with 12 nodes, 16 constraints
- 8 iterations per frame for stable joints
- Click & drag to throw with directional power indicator
- 3 default spinning gears with detailed tooth geometry
- Gear collision: push-out + tangential rotation force
- Tooth gap detection for limb-grabbing chaos
- Spark particles on gear contact
- Blood splats that persist on floor
- WebAudio SFX: impact thuds, crunch, gear grind
- Add random gears (G key), adjust speed (+/-)
- Reset (R key)
- Touch support for mobile
- Floor collision with bounce and friction
- Wall containment
- 8 ragdoll colors
- Vignette overlay

## issues
- None known

## todos
- OG preview PNG
- Conveyor belts / additional hazards
- Ragdoll grab & drag with mouse
