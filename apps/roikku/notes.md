# Roikku - Japanese Phrases

## log
- 2026-01-18: Initial creation
  - 6 categories of everyday phrases
  - 40+ phrases with romaji and translations
  - Pronunciation tips for each phrase
  - Context/usage guidance
  - Text-to-speech with Web Speech API
  - Warm neon aesthetic
- 2026-01-18: Added search and quiz mode
  - Search bar filters all phrases by Japanese, romaji, or English
  - Quiz mode with 4-option multiple choice
  - Track correct/wrong/streak stats
  - Feedback with romaji after answer
  - Mode toggle between Learn and Quiz
- 2026-01-18: Added hiragana/katakana reference panel
  - Slide-out panel on right side
  - Toggle button on screen edge
  - Full hiragana + katakana charts with romaji
  - Includes voiced and half-voiced rows
  - Click any character to hear pronunciation
- 2026-01-18: Replaced voice gender toggle with pitch slider
  - Granular pitch control (0.5 to 1.5)
  - Defaults to 1.1 for clear pronunciation
  - Blue-to-pink gradient slider
- 2026-01-18: Updated quiz mode to show romaji
  - Romaji now displays directly beneath Japanese text in quiz
- 2026-01-18: Fixed TTS to not read metadata/labels
  - Explicitly finds Japanese voice before speaking
  - Falls back to reading romaji in English if no Japanese voice
  - All speak calls now pass romaji as fallback
- 2026-01-18: Added volume slider below pitch slider
  - Granular volume control (0 to 1)
  - Gray-to-cyan gradient slider
  - Voice controls grouped together

## features
- Categories:
  - Greetings (8 phrases)
  - Shopping (6 phrases)
  - Restaurant (8 phrases)
  - Directions (7 phrases)
  - Social (8 phrases)
  - Emergency (6 phrases)
- Each phrase includes:
  - Japanese text (kanji/hiragana)
  - Romaji pronunciation
  - English translation
  - Pronunciation tip
  - Usage context
- Text-to-speech (Japanese voice, pitch + volume sliders)
- Quick phrases section
- Progress bar per category
- Keyboard navigation (arrows + space)
- Search bar (filters Japanese, romaji, English)
- Quiz mode with multiple choice
- Score tracking (correct/wrong/streak)
- Hiragana/Katakana reference panel (toggle from side)

## design
- Zen Maru Gothic + Noto Sans JP fonts
- Warm pink/coral/gold color scheme
- Dark gradient background
- Card-based phrase display
- Soft rounded corners

## controls
- Category buttons: switch topics
- Arrow buttons: prev/next phrase
- Listen button: play pronunciation
- Keyboard: ← → to navigate, space to speak
- Quick phrases: click to hear

## todos
- Add favorites/bookmarks
- Add spaced repetition
- Add more categories (travel, work, etc.)
- Add writing practice

## issues
- None yet
