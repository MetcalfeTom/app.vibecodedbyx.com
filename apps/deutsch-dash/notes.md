# Deutsch Dash

## log
- 2026-01-04: Added Hans the Tutor - snarky German teacher who zaps wrong answers
- 2026-01-04: Fixed word repetition - deck system ensures no repeats until exhausted
- 2026-01-04: CEFR system - modular word banks A1-C1 with neon certificate
- 2026-01-04: ELITE MODE - tricky distractors, false friends, compound words
- 2026-01-04: Initial creation - neon German learning app with vocabulary games

## features
- ELITE MODE - designed for serious learners like Kriegsschiff
- 3 game modes: Flash Cards, Quiz, Speed Dash
- 8 vocabulary categories: Basics, Food, Animals, Colors, Numbers, Verbs, False Friends, Compounds
- Tricky distractor system - each word has hand-crafted similar-sounding wrong answers
- False friends category - German words that look like English but mean different things
- Compound words category - German's famous long words
- Score tracking with streak multiplier
- Visual feedback for correct/incorrect answers
- Keyboard support for Speed Dash (Enter to submit)
- Progress tracking per session
- Responsive design for mobile/desktop

## game modes
### Flash Cards
- Click to flip card
- German on front, English on back
- Navigate with Previous/Next buttons

### Quiz
- Multiple choice (4 options)
- Shows German word, pick English translation
- Score increments on correct answer
- Streak bonus for consecutive correct answers

### Speed Dash
- Type the English translation
- Case-insensitive matching
- Visual feedback (green glow = correct, red shake = wrong)
- Auto-advances to next word on correct

## vocabulary
- Basics: Hallo, Tschüss, Danke, Bitte, Ja, Nein, Gut, Schlecht
- Food: Brot, Wasser, Käse, Apfel, Milch, Ei, Fleisch, Gemüse
- Animals: Hund, Katze, Vogel, Fisch, Pferd, Kuh, Schwein, Schaf
- Colors: Rot, Blau, Grün, Gelb, Schwarz, Weiß, Orange, Lila
- Numbers: Eins through Zehn (1-10)
- Verbs: sein, haben, gehen, kommen, machen, sehen, wissen, können

## design
- Neon red/gold German-themed aesthetic
- Orbitron + Source Code Pro fonts
- Glowing buttons and cards
- CRT-style scanline overlay
- Dark background with subtle gradient

## technical
- Pure HTML/CSS/JavaScript
- No external dependencies (except fonts)
- Fisher-Yates shuffle for randomization
- CSS animations for feedback

## issues
- None yet

## todos
- Add more vocabulary categories (Body parts, Family, Weather)
- Add pronunciation audio
- Add difficulty levels
- Add Supabase leaderboard for Speed Dash
- Add spaced repetition system
- Add reverse mode (English to German)
