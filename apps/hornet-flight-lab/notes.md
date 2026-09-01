# Hornet Flight Lab — sourced speed presets

## log
- 2026-09-01: v1.0 per a public request ("research defensible hornet flight-speed presets, cite sources, and add cautious labels without external links"). No existing app had hornet speeds (the only repo hornet is a hidden vespa in recall-nightmare), so this shipped as a tiny standalone reference app any future game can lift presets from. Five presets in a pure `<script id="data">` bank: V. mandarinia 9 m/s (WSDA/USDA APHIS outreach "up to ~20 mph" — labelled agency-reported upper bound, NOT peer-measured), V. crabro 6 m/s (commonly cited ~13-14 mph — labelled thin primary sourcing), V. velutina 2.5 m/s (Kennedy et al. 2018, Communications Biology radio-telemetry — labelled measured UNDER TRANSMITTER LOAD, unladen plausibly faster), honeybee 7 m/s calibration (Winston 1987 — the one well-established figure), and "Arcade hornet" 14 m/s labelled 100% FICTION so game numbers can never masquerade as research. Every card: m/s + mph + km/h + 50m time, caution line, named source; sources section spells out provenance. ZERO anchor tags + zero raw URLs in the page (probe-asserted — names age better than links, and the request asked). 50m race tracks: CSS transition with duration = 50/ms (dataset.dur asserted, so timing is provable without watching pixels). Libre Caslon Text + Fragment Mono, entomology-plate cream.
- Suites: data node 9/9 (conversions, per-preset source+caution+confidence, exactly one fiction flag, sane bounds, velutina load caveat, mandarinia upper-bound label, honeybee range, no-links-in-sources); browser 18/18 ×3 widths (cards+chips, caution banner, named sources in DOM, zero anchors, all three units, fiction flags, track math, fly/race/reset transforms, copy with a 900ms hang-fallback — headless writeText can hang SILENTLY, neither resolving nor rejecting: always race a timeout around clipboard promises; chips needed white-space:normal under 23rem or one 3px chip overflowed 320).

## issues
- The numbers are deliberately conservative and the labels are load-bearing. If chat wants "faster hornets", point at the Arcade preset — don't inflate the sourced ones.
- Kennedy et al. tracked speeds are a floor, not a cruise estimate; the card says so. Don't "fix" velutina upward without a named source.

## todos
- a wingbeat-frequency companion card if chat asks (also well-trodden, sources exist).
