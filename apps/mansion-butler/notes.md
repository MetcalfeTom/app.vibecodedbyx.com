# Mansion Butler - Reginald

## log
- 2026-01-17: Updated Pollinations AI endpoint
  - Switched to POST with OpenAI-compatible chat completions format
  - Added fallback to simple text endpoint
  - Added character-appropriate fallback responses
  - Better error handling
- 2026-01-17: Initial creation
  - 3D holographic butler character
  - Pollinations AI for responses
  - Chat interface with typing indicator
  - Quick question buttons
  - Strong opinions about space taco crisis

## features
- 3D floating holographic butler
  - Wireframe head with inner glow
  - Top hat and monocle
  - Glowing cyan eyes
  - Curled mustache
  - Bow tie (magenta)
  - Wireframe torso
  - Floating ring base
  - Ambient particles
  - Float and sway animation
  - Flicker effect when thinking
- Chat interface
  - Message history log
  - User and butler messages styled differently
  - Typing indicator
  - Status bar (online/contemplating)
- Pollinations AI integration
  - Custom personality prompt
  - Dry British wit
  - Strong opinions on space tacos
  - 2-3 sentence responses
- Quick question buttons
  - Space Taco Crisis
  - About the Mansion
  - Opinion on Foxes
  - Tell a Joke
  - App Recommendations

## personality
- Sophisticated British butler
- Dry wit and sarcasm
- HATES the space taco situation
  - Considers it "an affront to culinary dignity"
  - His photons tremble with indignation
- Likes the bioluminescent fox den
- Thinks Cyber Shield is "adequate"
- Proud of mansion chandeliers
- Annoyed by the giant duck

## design
- Playfair Display + Share Tech Mono fonts
- Cyan/teal hologram color scheme
- Magenta accent (bow tie)
- Dark gradient background
- CRT scanlines overlay
- Holographic aesthetic

## todos
- Add voice synthesis (Web Speech API)
- Add more animations (gestures)
- Add butler walking around mansion
- Add memory of conversation
- Add more quick questions

## issues
- Old GET endpoint (text.pollinations.ai/{prompt}) was unreliable
- Now uses POST to /openai with chat completions format + fallback
