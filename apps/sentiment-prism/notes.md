# Sentiment Prism

A living crystal that pulses with color based on the mood of the room.

## log
- 2026-04-12: Initial build. Hexagonal prism rendered with per-facet gradient fills, animated vertex wobble, and inner glow core. 5 sentiment categories (joy/calm/fire/gloom/chaos) each with ~25 keywords, unique hue/sat/light signatures, and distinct chime tones. Keyword-based sentiment analysis with fallback character analysis (caps=fire, questions=chaos, emoji=joy). Weighted circular hue averaging for smooth color blending across categories. Messages decay over 2 minutes so prism drifts back to neutral. Refraction rays burst from center on each message. Pulse ring expands on input. Ambient light particles orbit and drift toward prism. Rainbow spectrum band appears with activity. Message feed with colored sentiment dots. Stats sidebar shows per-category counts. 3 ambient seed messages on load. Newsreader + Fira Code typography, deep void/crystal aesthetic.

## features
- Hexagonal prism with animated vertex wobble
- Per-facet gradient fills with shimmer
- 5 sentiment categories: joy, calm, fire, gloom, chaos
- ~25 keywords per category for analysis
- Fallback character analysis (caps, punctuation, emoji, length)
- Circular hue interpolation for smooth color blending
- Message decay over 2 minutes (scores fade)
- Refraction ray bursts on each message
- Pulse ring animation
- Ambient orbiting particles
- Rainbow spectrum band
- Mood-specific chime SFX (sine/sawtooth/square per mood)
- Message feed with sentiment dots
- Stats sidebar
- Inner glow core

## issues
- None known

## todos
- OG preview PNG
- Connect to live Supabase chat for real-time sentiment
- More sentiment categories (surprise, love, hype)
- Prism rotation on hover/drag
