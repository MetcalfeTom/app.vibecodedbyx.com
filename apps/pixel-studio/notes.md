# Pixel Studio

Quick web-based image editor with upload, crop, adjustments, and filters.

## log
- 2026-03-17: Initial build. Upload via button, drag-and-drop, or file input. Crop tool with visual overlay (dimmer + dashed box), drag to select region, auto-applies on release. Adjustment sliders: brightness, contrast, saturation — all real-time pixel manipulation. 8 filters: None, Grayscale, Sepia, Invert, Vintage, Cool, Warm, Noir. Undo stack (up to 20 states). Reset to original. PNG download. Sidebar panels for adjustments and filters. Images capped at 1600x1200 for performance. DM Sans + DM Mono typography, dark IDE aesthetic with purple accents.

## issues
- None yet

## todos
- Rotate / flip tools
- Blur / sharpen filters
- Text overlay
- Drawing / annotation tools
- History panel with thumbnails

## notes
- No database — pure frontend, all processing client-side
- Pixel manipulation via ImageData (willReadFrequently context)
- Crop modifies origData, adjustments/filters are non-destructive from origData
- Undo stack stores ImageData clones (memory-heavy for large images)
