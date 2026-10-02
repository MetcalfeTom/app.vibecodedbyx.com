# Slosh Cube

Idea: Tatum, "in honor of Navier-Stokes, a 3D fluid: a cube with spheres in" (2026-10-02).

## art direction
- Look: glass cube with glowing cyan edges floating in a deep-navy night, water as glossy instanced spheres. Palette: ink #07101f, navy #16305a, deep water #1557b8, cyan #38c6f4, foam #effcff, coral accent #ff7a59 (unused yet).
- Light: hemisphere + warm key light, RoomEnvironment reflections, NeutralToneMapping. Soft canvas-gradient shadow pool under the cube.
- Camera: fixed perspective (fov 38), a little above, distance fit to the cube and pulled back on portrait screens.
- Type: Instrument Serif italic title, Martian Mono UI.
- Budget: 1 instanced mesh (1500 desktop / 1000 touch spheres, icosahedron detail 1) = 5 draw calls, ~120k triangles.

## log
- v1.1: Tatum's Firefox said "Error resolving module specifier three": the import map was ignored. Now three r170 by full URL, no import map, and a homemade PMREM studio scene instead of the RoomEnvironment addon (addons import bare 'three').
- v1.0: SPH-style fluid (double density relaxation, Clavet 2005) on the CPU, h = 1 units, grid neighbour search, 2 steps per 60 Hz tick (~7 ms per tick for 1500 in headless). Drag turns the glass (around world axes), spin / splash / level buttons. Colour by speed.

## design notes
- The sim lives in cube-local space. Each tick the water is rotated by q^-1 * qPrev (positions and velocities) so the walls sweep through it, and gravity is (0,-g,0) rotated by q^-1. That is what makes it slosh.
- The glass follows a target orientation qT at max .07 rad per tick (`rotateTowards`). A sudden jump of the walls through the water made it explode into spray.
- Pair pushes are capped (maxD .05), drop speed capped (vmax .4 per step), viscosity impulse capped at half the approach speed. Without the push cap a tilted corner blew up into NaN.
- Wall margin rad .24 so spheres (r .27) don't poke through the glass.
- Headless: rAF barely runs before the probe; drive `__CUBE.tick()` by hand in probes.

## todos
- Device tilt on phones (DeviceOrientation, iOS needs a permission tap).
- Voice's idea: one heavy golden marble that sinks and rolls.
- Adaptive particle count if a phone runs slow.
