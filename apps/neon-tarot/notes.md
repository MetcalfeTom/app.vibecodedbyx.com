# Chrome Oracle

Neon cyberpunk tarot reader with glitchy animations and cryptic readings.

## log
- 2026-03-23: Initial build. 22 Major Arcana with cyberpunk themes (The Glitch, The Hacker, The Firewall, etc.). 3-card spread (Past Process / Present State / Future Thread). CSS 3D card flip, glitch animation on reveal via clip-path. Procedural reading generation with intros/bridges/syntheses/closers. 30% reversed card chance. Background perspective grid canvas, scanline overlay, ambient h1 glitch. Orbitron + Share Tech Mono typography, cyan/magenta on dark chrome aesthetic.

## issues
- None yet

## todos
- AI-driven readings (use Pollinations or similar for dynamic text)
- More card spreads (5-card, Celtic Cross)
- Card art (procedural canvas or generated images)
- Sound effects (glitch audio on flip)
- Save reading history to localStorage

## notes
- 22 Major Arcana only (no Minor Arcana)
- Each card has: num, name, symbol (unicode), 3 meanings
- Reversed cards: 30% chance, shown with rotated symbol + gold color + REV label
- Reading: random intro + per-card meaning + bridge + synthesis + closer
- Pure frontend, no database
- Cyberpunk naming: Glitch, Hacker, Firewall, Motherboard, Root Access, Protocol, Fork, Overclock, Encryption, Darknet, Reboot, Debugger, Suspended Process, Format, Load Balancer, Malware, Stack Overflow, Signal, Dark Mode, Display, Callback, Singularity
