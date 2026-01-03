# Dungeon Crawler

## log
- 2026-01-03: Major update - added party system with 4 character classes
- 2026-01-02: Initial creation - retro first-person dungeon crawler

## features
- First-person pseudo-3D view
- Grid-based movement (WASD/arrows)
- 4 cardinal directions with compass
- Procedurally generated dungeons
- Multiple floor levels (descending)
- **PARTY SYSTEM** - 4 unique heroes
- Turn-based combat with party selection
- 6 monster types with scaling difficulty
- Supply crates heal entire party
- Individual character leveling
- CRT scanline overlay

## character classes
1. **Warrior** 🛡️ - High HP/DEF, Power Strike special
2. **Mage** 🔮 - High MP, Magic attack, Fireball special
3. **Rogue** 🗡️ - High ATK, Backstab special (2.8x damage)
4. **Cleric** ✝️ - Heal ability, Holy Light (heal all party)

## class stats
| Class   | HP  | MP  | ATK | DEF | Special Cost |
|---------|-----|-----|-----|-----|--------------|
| Warrior | 30  | 5   | 8   | 6   | 5 MP         |
| Mage    | 18  | 25  | 4   | 3   | 8 MP         |
| Rogue   | 22  | 10  | 7   | 4   | 6 MP         |
| Cleric  | 24  | 20  | 5   | 5   | 10 MP        |

## monster types
1. Rat - HP 8, ATK 3, DEF 1, XP 8
2. Goblin - HP 15, ATK 5, DEF 2, XP 15
3. Skeleton - HP 22, ATK 7, DEF 3, XP 22
4. Orc - HP 35, ATK 10, DEF 5, XP 35
5. Demon - HP 50, ATK 14, DEF 7, XP 50
6. Dragon - HP 80, ATK 20, DEF 10, XP 100

## controls
- W/↑: Move forward
- S/↓: Move backward
- A/←: Turn left
- D/→: Turn right
- 1-4: Select party member
- Space/Enter: Attack
- Click party member to select

## combat actions
- **Attack** - Basic attack (all classes)
- **Magic** - Mage spell attack (4 MP)
- **Heal** - Cleric heals weakest ally (6 MP)
- **Special** - Class-specific powerful ability

## leveling
- XP needed = level × 25
- Each class has unique stat growth
- Full HP/MP restore on level up
- XP shared among living party members

## design
- Party panel on right side
- HP/MP/XP bars per character
- Action buttons for combat
- Mobile-responsive layout
- Start screen with instructions

## issues
- None yet

## todos
- Add resurrection mechanic
- Add equipment/inventory
- Add boss encounters
- Add more character names
- Add sound effects
- Add save/load game
