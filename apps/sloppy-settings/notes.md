# Sloppy Settings

## log
- 2026-02-04: Extracted Settings & Theme system from Sloppygram monolith. 4 tabs (Profile, Themes, Sounds, System). Overlay iframe pattern (same as sloppy-support, sloppy-media). postMessage bridge for apply-theme, apply-opacity, apply-background, broadcast-setting, reboot-system. Sounds tab embeds /sloppy-notifications/ as nested iframe. Shared localStorage (same origin) for theme persistence. secureStorage (XOR+Base64) copied from monolith. Boot-time theme loader kept in monolith for FOUC prevention.

## issues
- Nested iframe: notifications settings iframe runs inside settings iframe. Sound-settings-changed messages are relayed through settings iframe to monolith parent.
- Theme changes apply CSS vars to parent document via postMessage, not to iframe itself (except for local preview).
- Same-origin localStorage means both monolith and settings app can read/write theme data directly.

## todos
- Consider adding custom color picker (hex input) beyond the grid options
- Potential: export/import theme as JSON

## architecture
- Standalone mode: full settings page at /sloppy-settings/
- Embed mode (?embed=true): overlay iframe triggered by monolith's settings button
- postMessage API:
  - Parent -> iframe: open-settings (with profile/badges), close-settings
  - Iframe -> parent: settings-closed, apply-theme, apply-opacity, apply-background, broadcast-setting, reboot-system, sound-settings-changed (relayed), settings-ready
