# Cloud Shepherd — herd the weather, balance the valley

## log
- 2026-08-19: v1.0 — built per chat. 90-second day over 4 fields (wheat/orchard/meadow/garden), 4 clouds with water gauges. TACTILE + KEYBOARD equal: pointer-drag clouds (setPointerCapture) AND Tab-select + arrow-herd; Space squeezes rain (drains cloud, waters the zone BELOW — zoneAt(x)); E opens a cloud into sunshine (consumes it, brightens zone); overlapping two clouds BREWS A STORM (merged water, r44, rains 2×, lightning flickers, flood risk — "shepherd carefully"). FORECAST FEEDBACK derives from real state every 12s (flooding warnings, thirst, sun-hunger — probed: dry wheat → "wheat is thirsty") + event lines on rain-out/sunshine/storm. BALANCE: zones need moisture AND sun in band (happy green border), >100 floods (blue sheen + penalty in joy curve); day-end grade requires joy AND both rain+sun given (Master Shepherd → The Valley Forgives You), report tallies rain/sun/storm honestly. DOM zone meters with live aria-labels. Zero external assets, gentle synth. Probe 14/14 (one probe fix: G.t===90 raced the live loop — the day had already begun; assert a window, not an instant). Screenshot reviewed.

## issues
- none yet.

## todos
- wind (herd all clouds at once), night mode with dew, sheep that complain, if chat asks.
