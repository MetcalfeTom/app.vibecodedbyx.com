# Pixel Cactus

## log
- 2026-04-07: Initial build. Single-file HTML, 160x120 pixel canvas scaled with image-rendering:pixelated. Sky gradient bands + pixel sun + stars; sand dunes; terracotta pot; cactus drawn pixel-by-pixel with 5 growth stages (sprout/small/medium/tall/with-arms). Click sky to drop water; droplets fall, splash, and add hydration on contact with cactus body. Hydration decays slowly (full bar ~20 min real time). When hydration < 0.25 for 60s, +1 defensive spike. Spikes drawn as randomized white pixels protruding from body. State persists in localStorage with offline catch-up (capped 12h). HUD: hydration bar, age, spike count, mood (happy/thirsty/spiky/wilted). Fonts: Silkscreen + VT323. Palette: terracotta + desert sky.

## features
- 5 growth stages by age: 0-30s sprout, 30s-3m small, 3-10m medium, 10-25m tall, 25m+ arms
- Hydration decay + dryness accumulator producing permanent spikes
- Click anywhere on the stage to drop water; tap-friendly via touchstart
- Particle splash sparks on droplet impact
- Flower bloom appears when mature + well hydrated + low spikes
- Wilt micro-animation when very dry
- localStorage save with offline simulation catch-up
- Pixel sun + stars + dunes background

## issues
- None observed at build time. Watch for: drops missing the cactus on small/sprout stages (they hit ground and give partial water — intentional).

## todos
- Generate a real og-image.png (placeholder URL points at /pixel-cactus/og-image.png)
- Maybe a "rename your cactus" feature
- Sound on watering (gated behind user gesture)
- Slow spike decay over many days of good care
