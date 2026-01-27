# Graffiti Wall - Draw Together

Global collaborative graffiti wall. Spray paint together with everyone in realtime!

## log
- 2026-01-25: Added realtime collaboration
  - Supabase realtime channel for broadcasting strokes
  - Other artists' cursors visible with their names
  - Strokes persisted to graffiti_strokes table
  - Existing strokes loaded on page load
  - Artists online count with presence
  - Random artist names (NeonPainter, CyberBomber, etc.)
- 2026-01-18: Initial creation
  - Full-screen spray paint canvas
  - Neon color palette (7 colors)
  - Three brush sizes
  - Particle-based spray effect with glow
  - Brick wall texture overlay
  - Save to PNG functionality
  - Mobile touch support

## features
- REALTIME COLLABORATION - see others spray in real-time
- Other artists' cursors visible with their color and name
- Artists online count indicator
- All strokes synced via Supabase broadcast channel
- Strokes persisted to database, loads on refresh
- Spray paint particle effect (not solid lines)
- Glow effect at spray center
- 7 neon colors: magenta, cyan, yellow, red, green, pink, white
- 3 brush sizes: small, medium, large
- Custom spray cursor with pulsing ring
- Dark brick wall background
- Clear wall button
- Save artwork as PNG
- Header fades when drawing starts

## database tables
- graffiti_strokes: x, y, color, size, artist_name, user_id, created_at

## design
- Permanent Marker + Bebas Neue fonts
- Dark industrial wall aesthetic
- Neon glow effects on colors
- Particle spray for authentic graffiti feel
- Gradient shifting title

## controls
- Click/tap and drag to spray
- Color buttons to change paint color
- Size buttons to change brush size
- Clear button to reset wall (clears YOUR view only)
- Save button to download artwork

## todos
- None currently

## Next Development Phase: GRAFFITI v2.0
**Theme: Advanced Tools & Community Curation**

1. **Enhanced Drawing Tools**
   - Full color picker with custom hex
   - Undo/redo with 50-state history
   - Brush opacity/transparency
   - Spray pattern variations (splatter, drip)
   - Shape stencils (circles, squares, stars)

2. **Layer System**
   - Multiple canvas layers
   - Layer opacity controls
   - Background layer presets
   - Import image as layer

3. **Community Features**
   - Gallery of saved walls
   - Wall voting/likes
   - Featured artist spotlight
   - Time-lapse replays of creation

4. **Collaboration Modes**
   - Private rooms with invite links
   - Turn-based collaborative mode
   - Artist battle mode
   - Themed wall challenges

5. **Export & Sharing**
   - High-res export options
   - Animated GIF export (creation replay)
   - Direct share to Sloppygram
   - Print-ready poster generation

## issues
- None yet
