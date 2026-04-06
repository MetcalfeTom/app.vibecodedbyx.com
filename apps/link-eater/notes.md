# Link Eater

## log
- 2026-04-06: Initial build — retro CRT terminal that detects and "eats" any text containing URLs or link patterns. Glitch animation on eaten lines, screen shake, NOM popups. Regex catches http/https/www/TLDs. VT323 typography, green-on-black terminal with scanline overlay.

## features
- CRT terminal aesthetic with scanline overlay and green phosphor text
- Regex detects: http(s) URLs, www prefixes, domain.tld patterns, common TLDs
- Eaten lines get glitch animation (shake, color shift, fade to nothing)
- Screen shake + floating NOM/CHOMP/GULP popup on eat
- 15 randomized eat responses, 10 safe-passage responses
- Mood system tracks feeding level (hungry → peckish → satisfied → stuffed → MEGA FED)
- Commands: help, stats, clear, hunger
- Stats: links eaten, lines processed, survival rate
- Boot sequence with typing effect
- Click anywhere to focus input

## issues
- Regex might false-positive on some domain-like patterns
- No persistence across reloads
- No sound effects

## todos
- Sound effects (chomp, burp, gulp)
- Creature ASCII art that grows as it eats more
- Leaderboard for most links eaten in a session
- OG image
