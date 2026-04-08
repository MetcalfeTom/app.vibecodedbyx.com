# Cabin Dead

## log
- 2026-04-08: Added Trader shop (thyrepz request). Killing zombies now awards gold (walker 10, runner 15, crawler 20, brute 30) + clear bonus (20 + wave×5). Shop auto-opens 1.2s after clearing a wave; "BACK TO THE WINDOW" closes and triggers next wave after 800ms. 6 items: HEALTH PACK (60g +40hp), FIELD MEDKIT (180g full heal), AMMO CRATE (50g +18), PLANK BUNDLE (120g +25 maxHp + board), HEAVY MG (400g one-time purchase — clip 6→30, cooldown 180→60ms, auto-fire while held), MG BELT (120g +60 reserve, requires MG). MG renders as vented-barrel weapon with ammo belt. Added `firing` flag for mouse-hold auto-fire. Shoot disabled while shop is open. Gold stat added to top HUD.
- 2026-04-08: Initial build — first-person zombie cabin defense. Fixed-camera view from inside a boarded-up cabin window; zombies spawn at the treeline (z≈0) and walk toward the glass (z→1). Hit-scan shooting on click: pick the nearest zombie under the crosshair based on screen rect containment. 4 zombie types (walker / runner / brute / crawler) with distinct hp, speed, color, and size. Pixelated procedural sprites drawn with `P=floor(h/28)` pixel unit so sprite grid scales with depth — feels like 8-bit pixel art at any screen size. Per-wave scaling: +1 hp every 2 nights, ×1.09 compounding speed per night. Brutes unlock at wave 3, crawlers at wave 4, runners at wave 2. Between waves the player is granted +12 reserve ammo (+3 per wave) and +20 hp healing. R = reload (1.4s bar bottom-center), E = reinforce (spend 3 reserve for +15 hp). Muzzle flash overlay, damage-flash vignette, screen shake, pixel blood bursts. Silkscreen + Special Elite typography, blood-red/bone/moonlight palette, CSS scanline overlay.

## features
- First-person fixed camera from inside a cabin window
- 4 zombie types with distinct stats and sprites
- Per-wave compounding speed + hp scaling
- Pixel-art procedural sprites scaling to depth
- Shotgun weapon with recoil tilt + muzzle flash
- Click shoot, R reload, E reinforce
- Night sky, moon, stars, tree silhouettes, ground mist
- Board-up ribs nailed across the window react to `state.boards`
- Wave banners, between-wave healing + ammo resupply
- Damage vignette, screen shake, pixel blood

## issues
- None yet

## todos
- Supabase leaderboard (night survived, kills)
- Sound (shotgun, zombie moans, reload)
- More weapons (pistol, MG, grenade)
- Special boss zombies every 5 waves
