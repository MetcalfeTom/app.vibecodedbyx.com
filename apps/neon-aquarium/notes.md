# Neon Aquarium

Glowing fish that grow every time someone chats. Feed the tank together.

## log
- 2026-03-23: Initial build. Canvas-based aquarium with 7 fish species (Tetra, Angel, Guppy, Betta, Neon, Molly, Danio). Each species has unique body proportions, tail size, fin size, speed, and glow color. Fish swim with sine-wave motion, blink randomly, breathe (scale pulse). Environment: light rays, seaweed with sway, sandy bottom with pebbles, dust particles, surface caustics. Chat input at bottom — messages grow a random fish. Tap canvas to feed (smaller growth). Supabase realtime: other users' chats also grow fish. New fish spawn every 8 chats (max 30). Feed particles burst on growth, screen flash. Anybody + Fira Code typography, deep ocean aesthetic.

## issues
- Supabase module may fail on some setups — aquarium works fully offline, chat/realtime is enhancement layer

## todos
- Fish breeding (two large fish produce a baby)
- Predator fish that appear at high biomass
- Day/night cycle
- Sound effects (bubbles, ambient)

## notes
- Supabase table: neon_aquarium_chat (message, username, user_id)
- 7 species with distinct visual profiles (hue, body ratio, tail, fin, speed)
- Growth is smooth (lerp toward growTarget at 0.02/frame)
- Max fish size: 60, max fish count: 30
- Tap grows 0.3-0.6, chat grows 0.6-1.2
- New fish every 8 chats
- Bridge: window._aquaGrow() exposed from IIFE for module script realtime
- Fish sorted by size for depth layering
