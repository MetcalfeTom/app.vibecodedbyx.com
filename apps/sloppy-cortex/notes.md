# Sloppy Cortex

Standalone sentiment analysis and AI-assisted drafting hub — the community's brain scanner.

## log
- 2026-02-01: Initial creation
  - Client-side sentiment analysis using keyword heuristics (positive/negative/neutral scoring)
  - Intensifier detection for amplified sentiment (very, really, so, etc.)
  - Pulse tab: dominant mood, signal counts, overall sentiment bar, 24h mood timeline (1h buckets)
  - Stream tab: real-time sentiment-annotated feed from messages, posts, manifestos
  - Source filtering (All, Chat, Posts, Manifestos) with pagination
  - Trends tab: top 30 themes by frequency with sentiment overlay, #tag extraction
  - Draft tab: AI-assisted writing via Pollinations text API
  - 4 draft styles: Natural, Poetic, Provocative, Analytical
  - Community mood context injected into AI prompts for contextual drafts
  - Refine button for iterative draft improvement
  - Copy to clipboard support
  - Real-time: postgres_changes INSERT on messages/posts/manifestos
  - Cormorant Garamond + IBM Plex Mono typography
  - Pink/teal/dark neural aesthetic
  - Mobile responsive
  - Same database tables as Sloppygram (read-only, full data sync)

## data sources
- sloppygram_messages (chat sentiment)
- sloppygram_posts (post sentiment)
- sloppygram_manifestos (manifesto sentiment)
- ai_events (activity signals)

## sentiment model
- Client-side heuristic: ~35 positive keywords, ~30 negative keywords
- Intensifier multiplier (1.5x for very/really/so/etc.)
- Score normalized by sqrt(word count) for length independence
- Thresholds: >0.15 positive, <-0.15 negative, else neutral
- No external API calls for sentiment — instant, private, works offline

## issues
- None yet

## todos
- Could add sentiment history over days/weeks (requires storing snapshots)
- Could add per-user sentiment profiles
- Could add emotion wheel (beyond pos/neg/neutral)
- Could add AI-powered trend summarization
- Could add draft templates (manifesto, post, rant)
- Could add sentiment alerts (mood shift notifications)
- Could integrate with ai_events for behavioral sentiment (votes, reactions as signals)
