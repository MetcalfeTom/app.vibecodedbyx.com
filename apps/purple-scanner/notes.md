# Purple Pixel Scanner

## log
- 2026-01-10: Initial creation
  - Image upload via drag/drop or click
  - Adjustable purple detection thresholds
  - HSL-based color detection
  - Coordinate export to CSV
  - Side-by-side preview with highlighting
  - Statistics display

## features
- Drag and drop image upload
- Click to browse files
- Adjustable hue range (default 260-320° for purple)
- Adjustable saturation minimum
- Adjustable lightness minimum
- Real-time color swatch preview
- Progress bar during scan
- Side-by-side original vs highlighted view
- Purple pixels shown in bright magenta
- Non-purple pixels dimmed
- Coordinate list (up to 500 displayed)
- CSV export with x,y,r,g,b values
- Statistics: total, purple count, percentage, avg hue

## controls
- HUE MIN/MAX: Define purple hue range (260-320 default)
- MIN SATURATION: Filter out desaturated colors
- MIN LIGHTNESS: Filter out very dark pixels
- SCAN: Analyze image for purple pixels
- EXPORT: Download coordinates as CSV

## detection
Uses HSL color space for more intuitive purple detection:
- Hue: Angular position on color wheel (purple ~260-320°)
- Saturation: Color intensity (filter grays)
- Lightness: Brightness level (filter blacks/whites)

## design
- Purple neon aesthetic
- Orbitron font
- Glowing borders and buttons
- Progress bar during scan
- Color swatches show current range
- Responsive grid layout

## output
CSV format with columns:
- x: horizontal pixel position
- y: vertical pixel position
- r: red value (0-255)
- g: green value (0-255)
- b: blue value (0-255)

## limitations
- Max 10,000 coordinates stored
- Max 500 displayed in UI
- Images scaled to 800px max width
- Processing is single-threaded

## todos
- Add more color presets (red, blue, green, etc.)
- Add heatmap visualization
- Add cluster detection
- Add image download with highlights
- Add Web Worker for faster processing
- Add pixel selection by clicking
