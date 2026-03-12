# Haunted Thailand

Interactive dark map of Thailand's most haunted and eerie locations.

## log
- 2026-02-14: Initial build. SVG map with simplified Thailand outline, 18 scary locations with glowing colored markers (ghost/temple/forest/urban types). Pan + zoom (mouse drag, scroll wheel, touch, buttons). Info panel slides up with name, location, type badge, description, warning. Creepster + IBM Plex Mono typography, dark blood-red aesthetic with fog overlay. No database needed.

## issues
- None yet

## todos
- User-submitted stories/sightings
- More locations
- Ambient sound effects

## notes
- SVG-based map with simplified Thailand polygon outline
- Markers color-coded by type: red (ghost), orange (temple), green (forest), purple (urban)
- Lat/lon projected to SVG coords via simple linear mapping
- Pan: mouse drag / touch drag
- Zoom: scroll wheel / +/- buttons / pinch (via scroll)
- 18 locations with detailed descriptions and warnings
- No external tile provider needed — fully self-contained
