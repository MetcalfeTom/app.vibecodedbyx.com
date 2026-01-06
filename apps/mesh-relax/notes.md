# Mesh Relaxation

## log
- 2026-01-05: Initial creation - mesh deformation with equilateral constraints

## features
- Delaunay triangulation (Bowyer-Watson algorithm)
- Spring-based edge relaxation toward ideal lengths
- Laplacian smoothing component toward centroids
- Real-time quality visualization (triangle coloring)
- Quality metric: ratio of actual area to ideal equilateral area
- Click to add vertices
- Drag to move vertices
- Step-by-step or continuous relaxation
- Adjustable speed and strength

## algorithm
The relaxation works by:
1. For each edge, calculate ideal length (average of connected triangle edges)
2. Apply spring force: F = (current - ideal) * strength
3. Add Laplacian smoothing: pull vertices toward triangle centroids
4. Apply forces with boundary constraints
5. Re-triangulate to maintain Delaunay property

## design
- Dark theme with quality-based triangle coloring
- Red triangles = poor quality (far from equilateral)
- Green triangles = high quality (near equilateral)
- Blue vertex nodes
- Quality progress bar at bottom

## technical
- Vanilla JavaScript + Canvas 2D
- Bowyer-Watson Delaunay triangulation
- Spring force model for edge constraints
- Laplacian smoothing for vertex positions
- Real-time re-triangulation

## issues
- Very high vertex counts may slow down
- Triangulation must be recalculated each step

## todos
- Add vertex pinning (lock positions)
- Add constrained edges
- Add mesh import/export
- Add 3D visualization option
