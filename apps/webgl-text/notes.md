# WebGL Text Distortion

## Log
- Initial creation: Interactive WebGL text effect
- Features: Mouse-reactive 3D text distortion with wave effects
- Custom vertex shader for geometric distortion
- Custom fragment shader for texture wave and color shift
- Text: "VIBE CODE" with gradient colors (red → teal → blue)
- Custom cursor that grows on hover
- Smooth animations using requestAnimationFrame

## Technical Details
- WebGL with GLSL shaders
- Vertex shader: Distorts mesh geometry based on mouse proximity
- Fragment shader: Applies wave distortion to texture UVs and color shifting
- Text rendered to canvas, then used as WebGL texture
- 6 vertices forming 2 triangles for quad
- Mouse tracking with distance calculation for interaction radius
- Time-based sine/cosine waves for organic movement
- Alpha blending enabled for transparency

## Issues
- None yet

## Todos
- Could add text input to customize the displayed text
- Could add different distortion modes (swirl, ripple, explosion)
- Could add color theme picker
- Could make it responsive with touch support
- Could add audio reactivity
- Could add particle effects on hover

## Notes
- Distortion radius: 0.3 normalized units
- Hover detection: 200px from center
- Text canvas: 1024x256 resolution
- Wave frequency: 20.0 for texture distortion
- Color shift intensity: 0.3 * distortion amount
