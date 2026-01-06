# Mesh Relaxation - Manifolds

## log
- 2026-01-05: Initial creation - mesh deformation with equilateral constraints
- 2026-01-05: Major rewrite - 3D manifold surfaces with Three.js

## features
- Multiple parametric surfaces:
  - Plane (open boundary)
  - Cylinder (U-wrapped)
  - Torus (U+V wrapped, orientable)
  - Möbius Strip (non-orientable, 180° twist)
  - Klein Bottle (non-orientable, self-intersecting)
  - Sphere (closed surface)
- Proper topology: vertices identified across seams
- Spring-based edge relaxation toward uniform length
- Laplacian smoothing toward neighbor centroids
- Quality visualization (red→green triangle coloring)
- Distort button to randomize vertex positions
- OrbitControls for 3D camera navigation

## algorithm
The relaxation preserves manifold topology:
1. Topology is fixed at generation time (vertex identification at seams)
2. Neighbors list captures connectivity across seams
3. Spring forces pull edges toward average length
4. Laplacian smoothing moves vertices toward neighbor centroid
5. Forces applied in 3D space
6. Mesh rebuilt each frame but topology unchanged

## topology handling
- Möbius: u=1 identified with u=0 but v is flipped (180° twist)
- Torus: both u and v wrap around
- Klein: u wraps with v-flip, v also wraps
- Sphere: v=0 and v=1 collapse to poles

## design
- Three.js 3D rendering
- Quality-based HSL coloring per face
- Semi-transparent mesh with wireframe overlay
- Surface description info box

## technical
- Three.js with ES modules
- OrbitControls for camera
- BufferGeometry rebuilt each step
- Vertex neighbors stored in Set for O(1) lookup

## issues
- Klein bottle self-intersects in 3D embedding
- Very fast relaxation can cause instability

## todos
- Add mesh subdivision
- Add boundary constraints for open surfaces
- Add volume preservation for closed surfaces
- Add edge collapse/split for adaptive meshing
