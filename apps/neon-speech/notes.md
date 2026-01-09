# Neon Speech - Text to Voice

## log
- 2026-01-09: Initial creation
  - Text to speech using Web Speech API
  - Voice selection from system voices
  - Language filter dropdown
  - Speed and pitch sliders
  - Visual audio bars animation
  - Preset text buttons
  - Neon cyberpunk aesthetic

## features
- Text area for input
- Voice selection dropdown
- Language filter (All, English, Spanish, French, German, Italian, Japanese, Korean, Chinese)
- Speed slider (0.5x to 2x)
- Pitch slider (0.5 to 2)
- Speak and Stop buttons
- Animated visualizer bars while speaking
- Speaking status indicator
- Preset text buttons:
  - Tickle Mode: "Gah! Ehehehe!!"
  - Sci-Fi: futuristic intro
  - News: breaking news style
  - Epic: movie trailer voice
  - Robot: beep boop style
- Voice count display
- Ctrl+Enter keyboard shortcut

## controls
- Type text in textarea
- Select voice from dropdown
- Adjust speed and pitch
- Click SPEAK to hear it
- Click STOP to cancel
- Click presets for sample text

## technical
- Uses Web Speech API (SpeechSynthesis)
- Loads system voices dynamically
- Filters voices by language prefix
- Handles speech events (start, end, error)
- Animated visualizer during playback

## design
- Dark purple gradient background
- Cyan title with glow
- Magenta/pink accents
- Neon slider controls
- Pulsing speak button while active
- Gradient visualizer bars
- Orbitron font

## browser support
- Chrome: Full support
- Edge: Full support
- Safari: Full support
- Firefox: Full support
- Not supported in some older browsers

## todos
- Add volume control
- Add save/export audio option
- Add voice preview button
- Add more language filters
- Add text highlighting while speaking
