# Mesh Curvature Analyzer

## log
- 2026-01-06: Initial creation - Gaussian curvature and geodesic distances with LUT system

## features
- Multiple parametric surfaces: Sphere, Torus, Saddle, Bumpy Sphere, Klein Bottle
- Gaussian curvature calculation using angle deficit method
- Geodesic distance calculation using Dijkstra's algorithm
- LUT-based coloring: Viridis, Plasma, Coolwarm, Spectral, Turbo
- Click to select geodesic source vertex
- Real-time stats: K min/max/mean, total curvature (Gauss-Bonnet)
- Variable resolution (32/48/64 segments)
- OrbitControls for 3D navigation
- Wireframe overlay

## algorithm

### Gaussian Curvature (Angle Deficit)
For discrete meshes, Gaussian curvature at vertex v:
- K(v) = (2π - Σθ) / A
- θ = angles of incident faces at v
- A = 1/3 of total area of incident faces
- Positive K = elliptic (sphere-like)
- Negative K = hyperbolic (saddle-like)
- Zero K = parabolic (flat)

### Geodesic Distances
- Dijkstra's algorithm on mesh edge graph
- Edge weights = Euclidean distance between vertices
- Click any vertex to set as source

### Gauss-Bonnet Theorem
- ∫K dA = 2πχ (Euler characteristic)
- Sphere: χ=2, so ∫K dA = 4π
- Torus: χ=0, so ∫K dA = 0

## LUT Texture System (Jack's request)
- 256×1 RGBA DataTexture for GPU sampling
- Custom ShaderMaterial samples LUT in fragment shader
- Curvature values stored as vertex attribute [0,1]
- GPU-side texture lookup for smooth color mapping
- Linear filtering for smooth interpolation
- 5 LUTs: Viridis, Plasma, Coolwarm, Spectral, Turbo
- Symmetric range for curvature (centered at 0)
- [0, max] range for geodesic distances

## design
- Dark theme with cyan accents
- IBM Plex Mono + Space Grotesk fonts
- Color bar preview with labels
- Stats panel with curvature metrics

## technical
- Three.js with ES modules
- Vertex merging to handle seams
- O(V log V + E) geodesic calculation
- Per-vertex colors via BufferGeometry

## issues
- Klein bottle self-intersects in 3D
- High resolution can be slow for geodesics
- Boundary vertices on saddle have artifacts

## todos
- Add mean curvature (H)
- Add principal curvatures (k1, k2)
- Add curvature tensor visualization
- Add heat method for faster geodesics
- Add geodesic path tracing
