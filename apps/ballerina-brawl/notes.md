# Ballerina Brawl

Pixel art fighting game where ballerinas throw down in a fight club basement. Best of 3 rounds.

## log
- 2026-04-12: Initial build. Canvas-based pixel art fighter at 3x scale. 2 ballerinas (Prima/pink, Tutu/blue) with pixel-art bodies, tutus, hair buns, expressive eyes. Fight club basement arena with brick walls, hanging light with light cone, ring ropes, corner posts. 3 attack types: punch (fast/light), kick (mid/range), special pirouette (heavy/sparkles/cooldown). Hitbox detection, knockback, hitstun, combo counter with float text. AI opponent with approach/retreat/attack/dodge logic. Best-of-3 rounds with transition screens. HP bars, round counter, score display. Johnny Bravo game over screen: winner in exaggerated flex pose with sunglasses, big pompadour hair, comb sparkle, orbiting stars; loser KO'd flat on ground with dizzy stars. Screen shake on hits, slowmo on KO. 5 WebAudio SFX. P1 controls: WASD+FGR. P2 controls: arrows+JKU (auto-detects, falls back to AI). Press Start 2P + Silkscreen typography, dark magenta fight club aesthetic.

## features
- Pixel art rendering at 3x scale with image-rendering:pixelated
- 2 ballerina fighters with tutus, hair buns, graceful arm poses
- Fight club basement arena with brick walls, light, ropes
- 3 attack types: punch, kick, special pirouette
- Frame-based attack startup/active/recovery windows
- Hitbox collision detection
- Knockback and hitstun system
- Combo counter with float text
- AI opponent with approach/dodge/attack behavior
- 2-player support (auto-detects P2 input)
- Best-of-3 rounds with transition screens
- Johnny Bravo-style game over: winner flex + sunglasses + pompadour
- HP bars, round counter, score
- Screen shake on hits
- Slowmo on KO
- WebAudio SFX (hit, kick, special, KO, round)
- Particle effects on hits
- Mobile-friendly (canvas scales)

## issues
- No touch controls for mobile yet — keyboard only
- AI difficulty is static

## todos
- OG preview PNG
- Touch controls overlay for mobile
- More fighters / character select
- Supabase leaderboard for win streaks
