# Chat Boss Battle

## Log
- 2026-01-10: Added FLORIDA MAN DRAGON boss for explodingcheeseorb
  - Replaced Dragon Emperor with peak Florida energy
  - Neon glowing AK-47 with cyan/magenta pulse
  - Glowing Bud Light (beer) accessory
  - Shoots liquid bullets when attacked
  - Pet gator companion underneath
  - Special attack messages
- 2025-11-10: Created chat-playable boss battle game for stream
- Designed for stream overlay with chat commands
- Auto-simulates attacks for demo purposes
- 7 progressive bosses with increasing HP
- Live at https://sloppy.live/chat-boss-battle

## Features
- **Chat Commands**: Simple commands like !attack, !slash, !fireball
- **Boss Battles**: 7 bosses with escalating difficulty (1000 HP → 5000 HP)
- **Visual Effects**: Floating damage numbers, boss shake animations
- **Statistics Tracking**: Total attacks, total damage, top attacker
- **Activity Feed**: Real-time feed of all actions
- **Victory Screen**: Celebration when boss is defeated
- **Stream Overlay Ready**: Designed to be embedded in OBS
- **Auto-progression**: Automatically loads next boss after victory

## Chat Commands
- `!attack` - Deal 10-30 damage
- `!slash` - Deal 20-40 damage
- `!fireball` - Deal 30-60 damage
- `!heal` - Heal boss by 10 HP (troll command!)
- `!stats` - Show game statistics

## Boss List
1. 👹 Demon Lord (1000 HP)
2. 🐊 FLORIDA MAN DRAGON (1500 HP) - Special boss with neon AK-47 and glowing beer!
3. ❄️ Ice Titan (2000 HP)
4. 👻 Shadow Fiend (2500 HP)
5. 🔥 Lava Golem (3000 HP)
6. 👾 Cosmic Horror (4000 HP)
7. 🌟 Ancient God (5000 HP)

## Florida Man Dragon Features
- Custom multi-sprite boss (gator + gun + beer)
- Neon cyan/magenta glowing AK-47
- Glowing golden beer
- Shoots liquid bullets (💧💦🌊) when attacked
- Pet gator companion
- Special attack messages

## Technical Implementation
- Pure HTML/CSS/JS - no external dependencies
- Auto-simulates attacks every 2 seconds for demo
- Damage numbers with CSS animations
- Health bar with smooth transitions
- Activity feed with scrolling history
- Tracks attackers and their total damage
- Boss shake effect on hit

## Stream Integration
To integrate with actual chat:
1. Connect to Twitch/YouTube chat API
2. Parse messages for command patterns
3. Call attack(username, damage) function
4. Or heal(username) for heal command

## Issues
- Currently just auto-simulates attacks (no real chat integration)
- No persistent leaderboard across sessions
- No authentication or user tracking
- Heal command might be annoying (intentional troll feature)

## Todos
- Add actual Twitch/YouTube chat integration
- Add persistent leaderboard using Supabase
- Add special attacks with cooldowns
- Add boss abilities that fight back
- Add sound effects
- Add combo system for consecutive attacks
- Add difficulty modes
- Consider adding team vs team battles
- Add boss enrage timer
