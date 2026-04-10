# Chatle

Guess which chat user wrote the quote. 10 rounds, 4 choices per round, pulled live from sloppy.live chat logs.

## log
- 2026-04-10: Initial build. Fetches 800 recent messages from sloppygram_messages table, filters for text-only, 12+ chars, no links/emoji-only, excludes anon/sloppy_ai. Groups by username, requires 3+ messages per user for inclusion. Each round: shows a quote with timestamp, 4 username choices (1 correct + 3 random active chatters). Correct = +1 score + streak. Wrong = streak reset + reveal answer. 10 rounds then game over with score/best streak. Play Again reshuffles pool. Instrument Serif + Geist Mono typography, dark gold/warm editorial aesthetic.

## features
- Live data from sloppygram_messages (real quotes, not hardcoded)
- Filters for quality: min length, no URLs, no bots, active users only
- 4-choice multiple choice with avatar display
- Score + streak tracking
- Replay without page refresh (re-fetches pool)
- Escaped HTML output (safe against XSS from message content)

## issues
- If chat has few active users with 3+ messages, game may fail to start
- No leaderboard
- No difficulty scaling (could filter by message uniqueness or user similarity)
- Bot messages from sloppy_ai are excluded but other bot-like patterns could slip through

## todos
- Supabase leaderboard (score per game, best streak)
- Difficulty modes: fewer choices, shorter quotes, similar users grouped
- Hint system: reveal first letter of username or show user's avatar
- OG preview PNG
