# MediaForge

## log
- 2026-04-07: Initial build — futuristic media server dashboard mockup. Glassmorphism panels (backdrop-filter blur, subtle borders, grid overlay), 4 KPI cards with live sparklines, main multi-series chart (bandwidth/CPU/streams), hardware panel (CPU/GPU/RAM/disk I/O), active streams list with progress bars, library stats, realtime activity log. All data is simulated via random walks. Chakra Petch + JetBrains Mono typography. Cyan/purple neon accents on deep navy with scan-line overlay.

## features
- Glassmorphism cards with backdrop-filter, animated scan line across header
- 4 KPI cards with live sparklines (streams, bandwidth, transcodes, library)
- Multi-series line chart (bandwidth/CPU/streams) with glow and gradient fills
- Hardware panel: CPU, GPU encode, RAM, disk I/O with dynamic color bars (green/yellow/red)
- Now Streaming list with poster tiles, bitrate/codec meta, per-user progress bars
- Library breakdown: Movies/TV/Anime/Music/Audiobooks with fill bars
- Realtime activity log with 12 templates (stream.start, transcoder.complete, scanner.index, etc.) and INFO/OK/WARN/ERR levels
- Live clock, auto-incrementing uptime counter
- Random-walk simulation for all metrics (smooth not jittery)
- Responsive: 3-breakpoint layout (wide/tablet/mobile)
- Background: radial neon glow + grid + horizontal scan lines
- Fully simulated — no actual backend required

## issues
- All data is fake (intentional — it's a mockup)
- Chart has no interaction (tooltips, zoom)
- Hardcoded stream list is limited to 6 items

## todos
- Add tooltips on chart hover
- Dark/light theme toggle
- Real log filtering by level
- Per-stream termination buttons
- Settings panel
- OG image
