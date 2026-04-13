# Puns of the Golem

A stone golem judges your puns. Tell it puns on random topics and it reacts with voice, facial expressions, and scores.

## log
- 2026-04-13: Initial build. Canvas-rendered golem with animated face (eyes, mouth, mood expressions, brow, cracks, glowing runes). SpeechSynthesis golem voice (pitch 0.4, rate 0.75, deep male). Mouth animation synced to speech via onstart/onend/onboundary events. Pun scoring engine checks topic presence, question format, punchline structure, phonetic similarity, word embedding, length sweet spot, setup words, rhyme, random factor. 6 reaction tiers (masterpiece/great/okay/bad/terrible/notapun). 20 topics with hints. Streak system with bonus points. 6 golem moods affecting eye color, brow, mouth shape. Uncial Antiqua + Crimson Pro typography, dark cave aesthetic.

## features
- Canvas-rendered animated golem with mood-based expressions
- SpeechSynthesis TTS with deep golem voice
- Mouth animation synced to speech events
- Pun scoring heuristic (no API needed)
- 20 random topics with hint text
- 6 reaction tiers with unique golem responses
- Streak system with bonus points
- Score tracking
- Mobile responsive

## issues
- Speech synthesis voice availability varies by browser/OS
- Pun scoring is heuristic-based, not AI — some good puns may score low

## todos
- OG preview PNG
- Add voice recognition so users can speak puns instead of typing
- Supabase leaderboard for high scores
- More topics
- Sound effects (rumble, stone cracking)
