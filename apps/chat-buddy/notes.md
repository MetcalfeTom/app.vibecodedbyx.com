# Chat Buddy

## log
- 2025-12-30: Initial creation - AI chatbot with Pollinations API, 5 personality modes, fallback responses

## issues
- Pollinations API may have rate limits or occasional downtime
- Fallback responses used if API fails

## todos
- Add message persistence (localStorage)
- Add voice input option
- Add typing sound effects
- Export conversation feature

## notes
- Uses Pollinations AI text API (free, no auth)
- 5 personalities: Friendly, Philosopher, Comedian, Scientist, Poet
- Keeps last 10 messages for context
- Fallback local responses if API unavailable
- Conversation history clears on personality change
