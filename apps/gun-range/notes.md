# Gun Range

Borderlands-style weapon firing simulator with manufacturer fire modes and elemental effects.

## log
- 2026-03-18: Initial build. 4 manufacturers with unique fire modes: DAHL (3-round burst), VLADOF (full auto), TORGUE (explosive semi-auto with shockwave), MALIWAN (charge beam, pierces). 5 elements: None, Fire (DOT), Shock (chain lightning to nearest target), Corrosive (DOT), Cryo (slow visual). Targets on grid with HP, respawn on death, shake on hit. Scoring with combo multiplier. Bullet tracers, shell casings, muzzle flash, damage numbers (gold for crits). WebAudio gunshot sounds per manufacturer. Ammo/reload system. Keyboard shortcuts (1-4 manufacturer, Q-T elements). Custom crosshair. Teko + Share Tech Mono typography.

## issues
- None yet

## todos
- Add Jakobs (semi-auto, high crit damage, ricochet)
- Add Hyperion (reverse recoil, gets more accurate)
- Moving targets
- Leaderboard
- Weapon sound variety

## notes
- No database — pure frontend
- Fire modes: burst (queued shots), auto (hold to fire), semi (click), charge (hold+release)
- Shock chains to nearest target within 150px
- Torgue has explosion particle burst + shockwave ring
- Maliwan charge beam uses line-to-point distance for multi-target hits
