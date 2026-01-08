# Network Scan

## log
- 2026-01-07: Initial creation - CRT terminal network diagnostics tool

## features
- Real-time network scanning of multiple targets
- CRT monitor aesthetic with scanlines and flicker
- Live waveform visualization based on latency
- Auto-scan on page load
- Targets: sloppy.live, www.sloppy.live, httpstat.us
- Stats display: HTTP status, latency, packets, online status
- Terminal-style output log with timestamps
- Responsive design

## design
- JetBrains Mono and Share Tech Mono fonts
- Green phosphor CRT color scheme (#00ff41)
- Scanline overlay effect
- Glitch animation on title
- Gradient radial vignette

## technical
- Fetch API with HEAD requests for speed
- no-cors mode for cross-origin checks
- AbortController for timeouts
- Canvas-based waveform animation
- Performance.now() for precise timing

## todos
- Add ping history chart
- Add more scan targets
- Add websocket connection test
- Add download speed test
