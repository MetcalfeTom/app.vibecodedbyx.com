# The Singularity

## log
- 2026-01-18: Initial creation
  - Complex plane visualization
  - Division by zero handling
  - Grid warping under function transformation
  - 8 preset functions including poles

## features
- Complex plane with real/imaginary axes
- Division by zero visualization (singularities)
- Grid warping shows function transformation
- Imaginary number arithmetic

### Complex Operations:
- Addition, subtraction, multiplication, division
- Complex exponential (e^z)
- Complex sine/cosine
- Square root with branch cut
- Complex logarithm
- Power functions

### Preset Functions:
1. Simple Pole: f(z) = 1/z
2. Double Pole: f(z) = 1/z²
3. Parabolic: f(z) = z²
4. Essential Singularity: f(z) = e^(1/z)
5. Oscillating: f(z) = sin(1/z)
6. Möbius Transform: f(z) = (z-1)/(z+1)
7. Branch Cut: f(z) = √z
8. Logarithm: f(z) = ln(z)

### Visualization:
- Grid lines warp under transformation
- Singularities shown with pulsing markers
- Infinity symbol at poles
- Color cycling based on position
- Probe point for exact values

### Output Display:
- f(z) value (complex)
- Magnitude |f(z)|
- Argument arg(f(z))
- Point type classification

## design
- Crimson Pro + JetBrains Mono fonts
- Dark gold/red/purple palette
- Mathematical aesthetic
- Animated singularity markers

## controls
- Function input field
- Preset buttons
- Zoom slider
- Grid density slider
- Warp intensity slider
- Animation speed slider
- Click to probe point

## todos
- Add more function presets
- Add pole/zero finder
- Add contour integration
- Add Riemann surface view
- Add color-coded phase plot

## issues
- None yet
