# Health Scanner

Fleet-wide JS error scanner for sloppy.live apps.

## log
- 2026-03-24: Initial build. Scans apps by loading them in sandboxed iframes, captures JS runtime errors and unhandled promise rejections over 2.5s window. Checks for empty pages, missing scripts, error text. Configurable scan count (20/50/100/all). Sequential scanning to avoid browser overload. Filter by status, sorted errors-first. 8s timeout per app.

## issues
- Cross-origin iframes can't always capture errors (sandbox attribute helps)
- Some apps with heavy WebGL/canvas may timeout on slower devices

## todos
- Add periodic auto-scan schedule
- Export results as JSON
- Track error trends over time
- Add network error detection (failed resource loads)

## notes
- Curated list of ~100 notable apps from all categories
- Scan modes: Top 20, Top 50, Top 100, All
- Status types: pass (green), fail (red errors), warn (yellow warnings), skip (timeout)
- Each app gets 8s total timeout, 2.5s runtime error window after load
- Sandboxed iframes: allow-scripts allow-same-origin
- Results sorted: errors first, then warnings, clean, timeouts
- IBM Plex Mono + Space Grotesk typography
