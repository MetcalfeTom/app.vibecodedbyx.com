# Graffiti Wall - Draw Together

Global collaborative graffiti wall. Spray paint together with everyone in realtime!

## log
- 2026-09-26: v2 "one wall" rescue
  - ROOT BUG: loaded /supabase-config.js as a classic script — it's an ES module, so SUPABASE_URL was never set and the app silently ran in local mode (no sync, nothing saved, likely since the config became a module). Now `import('/supabase-config-fixed.js')` + supabaseSession(); inserts carry user_id
  - Fixed 1920×1080 wall canvas shared by everyone (old strokes were raw screen pixels, so phone art landed in a desktop's top-left). Landscape screens see the whole wall; tall phones get scale 0.5, two-finger slide, wheel/right-drag on desktop, minimap (tap to jump)
  - Strokes are densified to evenly spaced points (size×0.3) so replay from the DB is a line, not dots; live broadcast `paint` {a,s,c,z,p:[x,y,…]} every 60 ms, remote side joins points of the same stroke `s`
  - Saves batched (≤400 rows every 0.9 s); load = newest 30k rows in 1000-row pages, painted 1500/frame
  - Network input validated: colour must be #rrggbb, size clamped 5–60, points inside the wall, names as text
  - Bricks baked into the canvas (saved PNG has them); old "clear wall" removed (it only cleared your screen); channel renamed graffiti-wall-v2 (old cached clients spoke screen coords)
  - Pointer events (pen/mouse/touch), coalesced events, aria-pressed toolbar, keys 1–7 colours, [ ] size; og.png
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

## issues
- Many older apps may have the same classic-script supabase-config bug (69 apps reference window.SUPABASE_ANON_KEY) — worth an audit
- Headless test: `window.__gwTest` skips connect; `__gw.conn = {db, userId, channel, live}` injects fakes
