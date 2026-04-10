# Spirit Radar

Haunted radar that detects glitchy pixel spirits nearby.

## log
- 2026-04-10: Initial build. Canvas radar with rotating sweep line, fading trail arc, 4-ring grid, crosshairs, diagonal guides. 10 spirit types (Pixel Wraith, Glitch Shade, Data Phantom, Byte Specter, Static Ghost, Hex Poltergeist, Null Entity, Echo Spirit, Void Lurker, Fragment Haunt) with threat levels 1-3, unique colors, and flavor text. Spirits drift, pulse, glitch (scatter into pixel fragments), and fade over time. Sweep detection triggers blip ping and optional feed message. Deep Scan button spawns 3-6 spirits with scanline glitch overlay. Threat level system (Calm/Active/High/Critical). Static noise particle layer, CRT scanline overlay. Auto-spawn over time, max 12 spirits. VT323 + Silkscreen typography, green-on-black terminal aesthetic.

## features
- Rotating radar sweep with fading trail
- 10 unique spirit types with threat levels
- Pixel spirit rendering with pulse and glitch scatter
- Sweep detection triggers blip ring animation
- Deep Scan button (spawns burst of spirits + glitch effect)
- Threat level indicator (Calm → Critical)
- Activity feed with spirit sightings
- Static noise particles
- CRT scanline overlay
- Auto-spawn system
- WebAudio detection pings
- Mobile responsive

## issues
- No interaction with spirits (detection only)
- No persistence

## todos
- Click/tap to banish spirits
- Supabase spirit log
- Spirit capture mechanic
- Rarer spirit types with special effects
- OG preview PNG
