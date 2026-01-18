# Mundane Poetry Generator

## log
- 2026-01-18: Fixed deprecation notice
  - Removed model parameter which was triggering deprecation warning
  - Using simple GET endpoint without model= param
  - Added response cleanup for markdown artifacts
- 2026-01-18: Fixed Pollinations API
  - Updated to POST to /openai endpoint with chat completions format
  - Added fallback to GET endpoint if POST fails
- 2026-01-18: Initial creation
  - AI-generated free verse poetry
  - Text-to-speech with voice selection
  - Preset mundane topics
  - Custom topic input
  - History with localStorage

## features
- AI poetry generation via Pollinations
  - Free verse, 4-8 lines
  - Contemplative, melancholic tone
  - Finds beauty in ordinary moments
- Text-to-speech
  - Web Speech API
  - Voice selection dropdown
  - Adjustable rate (0.85x for poetry)
  - Stop/play toggle
- Preset topics:
  - waiting for the microwave
  - checking emails
  - folding laundry
  - sitting in traffic
  - watching paint dry
  - loading screens
  - monday mornings
  - grocery shopping
- Custom topic input
- Copy poem to clipboard
- Poem history (last 10, localStorage)
- Line-by-line fade-in animation

## design
- Libre Baskerville serif for poetry
- DM Sans for UI elements
- Warm cream/beige color palette
- Gold accent (#b8860b)
- Card-based layout
- Minimal, literary aesthetic

## todos
- Add poem sharing
- Add more voice options
- Add background music option
- Add print-friendly view
- Add daily prompt suggestion

## issues
- None yet
