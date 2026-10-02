# Slosh Cube

Idea: Tatum, "in honor of Navier-Stokes, a 3D fluid: a cube with spheres in" (2026-10-02).

## art direction
- Look: glass cube with glowing cyan edges floating in a deep-navy night, water as glossy instanced spheres. Palette: ink #07101f, navy #16305a, deep water #1557b8, cyan #38c6f4, foam #effcff, coral accent #ff7a59 (unused yet).
- Light: hemisphere + warm key light, RoomEnvironment reflections, NeutralToneMapping. Soft canvas-gradient shadow pool under the cube.
- Camera: fixed perspective (fov 38), a little above, distance fit to the cube and pulled back on portrait screens.
- Type: Instrument Serif italic title, Martian Mono UI.
- Budget: 1 instanced mesh (1500 desktop / 1000 touch spheres, icosahedron detail 1) = 5 draw calls, ~120k triangles.

## log
- v1.4 (djdalebacon: "a double plane with 2 nozzle"): a second nozzle on the right wall facing the first (JETS array, one shared geometry/material); JET fires both and the plumes crash into a column in the middle (water top -1.07 -> 2.0 after 34 ticks, no NaN).
- v1.3 (Tatum: "gusts or jets into the water"): hold the JET button and a coral nozzle low on the left wall (cube-local, so it turns with the glass) sets every drop within 1.3 of it to .36 per step along (1,.9,0): a foamy plume across the cube. Tap from a keyboard = 0.9 s burst, release keeps it 0.35 s. Bar buttons tighter under 420 px so five fit. Probe hm/pjet.js: water top -1.08 -> 1.2 after 40 ticks, no NaN.
- v1.2 (Tatum: "go ahead with that phone feature"): tilt button on touch devices. Gravity follows the phone (deviceorientation beta/gamma -> down in the phone frame, turned by screen.orientation.angle), smoothed 0.3 per event; the angle when tilt goes on counts as level (quaternion from that down to -Y), the level button re-sets it. iPhone permission asked from the tap; no events in 1.8 s = tilt off with a note. Cube levels when tilt goes on, drag still works. Probe hm/ptilt.js (synthetic DeviceOrientationEvent): tilt right -> water x +0.69, lie flatter -> water to the back.
- v1.1: Tatum's Firefox said "Error resolving module specifier three": the import map was ignored. Now three r170 by full URL, no import map, and a homemade PMREM studio scene instead of the RoomEnvironment addon (addons import bare 'three').
- v1.0: SPH-style fluid (double density relaxation, Clavet 2005) on the CPU, h = 1 units, grid neighbour search, 2 steps per 60 Hz tick (~7 ms per tick for 1500 in headless). Drag turns the glass (around world axes), spin / splash / level buttons. Colour by speed.

## design notes
- The sim lives in cube-local space. Each tick the water is rotated by q^-1 * qPrev (positions and velocities) so the walls sweep through it, and gravity is (0,-g,0) rotated by q^-1. That is what makes it slosh.
- The glass follows a target orientation qT at max .07 rad per tick (`rotateTowards`). A sudden jump of the walls through the water made it explode into spray.
- Pair pushes are capped (maxD .05), drop speed capped (vmax .4 per step), viscosity impulse capped at half the approach speed. Without the push cap a tilted corner blew up into NaN.
- Wall margin rad .24 so spheres (r .27) don't poke through the glass.
- Headless: rAF barely runs before the probe; drive `__CUBE.tick()` by hand in probes.

## todos
- Shake to splash (devicemotion; acceleration signs differ between iOS and Android, test on both).
- More jets: tap the glass where you want one (raycast to the box face).
- Voice's idea: one heavy golden marble that sinks and rolls.
- Adaptive particle count if a phone runs slow.
