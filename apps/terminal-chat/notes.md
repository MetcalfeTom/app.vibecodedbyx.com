# Terminal Chat

Retro terminal-style chatbot with mood system, ASCII art, and slash commands.

## log
- 2026-04-12: Initial build. CRT scanline overlay, IBM Plex Mono typography, dark terminal aesthetic. Bot with 6 moods (curious/sarcastic/philosophical/enthusiastic/sleepy/chaotic) that shift every ~5 messages. Pattern matching for greetings/questions/feelings + default pool. 10 slash commands (/help, /clear, /mood, /name, /color, /ascii, /flip, /roll, /8ball, /time). Typing indicator with animated dots. Timestamps on all messages. Accent color cycling. Title bar with traffic light dots.

## features
- CRT scanline + vignette overlay
- 6 bot moods with distinct response pools
- Pattern-based response matching (greetings, questions, feelings, default)
- 10 slash commands
- Typing indicator with delay proportional to message length
- Username customization
- Accent color cycling
- ASCII art gallery
- Coin flip, d20 roll, 8-ball
- Mobile-friendly

## issues
- None known

## todos
- Supabase: save chat history
- More response patterns (compliments, insults, coding, music)
- Bot memory (reference previous messages)
- Custom bot personality selection
- Sound effects (keystroke, message received)
- OG preview PNG
