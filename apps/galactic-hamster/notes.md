# Galactic Hamster Quest

A 90s point-and-click adventure. Help Captain Nibbles escape the space station.

## log
- 2026-04-13: Upgraded to browser SpeechSynthesis API for character voices. Nibbles=high-pitch fast female, Guard=deep slow male, Robot=mid-pitch rapid, Mouse=highest pitch fastest, Narrator=normal calm male. Voice matching tries preferred voices then falls back to English. Cleans asterisk sound effects from spoken text. Cancels speech on new dialogue or mute.
- 2026-04-13: Added full audio system. 9 SFX types (pickup, door, metal, beep, creak, clunk, step, win, roomchange). Ambient space background music (drone, pad chord, filtered noise, random melodic pings with delay). Room-specific mood changes. Auto-detects voice from dialogue text. Mute toggle button.
- 2026-04-13: Initial build. 4 rooms (Detention Cell, Station Hallway, Ventilation Shafts, Hangar Bay) plus ending screen. 6 verbs (Look, Use, Pick up, Talk, Push, Open). 7 inventory items (screwdriver, keycard, string, coin, cheese, fuel, map). Multiple puzzle paths — escape via door (keycard) or vent (screwdriver+string). Canvas-rendered pixel-art scenes with animated elements (sleeping guard Zs, spinning fan, blinking console, nebula). Hamster character with walking animation. Classic verb bar + inventory strip UI. Press Start 2P + VT323 typography.

## features
- 4 explorable rooms with canvas-rendered backgrounds
- 6 verb actions (look, use, take, talk, push, open)
- 7 collectible inventory items
- Multiple puzzle solutions (door path vs vent path)
- Point-and-click walking to hotspots
- Animated hamster character
- Interactive hotspots with verb-specific responses
- Inventory item selection and use on world objects
- Funny dialogue and descriptions
- Sleeping alien guard with animated Zs
- Spinning vent fan
- Wanted poster easter egg
- Ending cinematic with flying ship
- Title screen
- Touch support

## issues
- No save system — refresh loses progress
- Hotspots not visually highlighted on hover (could add later)

## todos
- OG preview PNG
- Hotspot highlight on hover
- More rooms (engine room, bridge, escape pod bay)
- Save/load game state
- More puzzles and inventory combinations
- Character portraits during dialogue
- Animated cutscenes between rooms
