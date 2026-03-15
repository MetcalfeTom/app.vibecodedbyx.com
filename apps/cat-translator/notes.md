# Cat Translator

Record your cat's meow. Receive their absurd demands. They own you.

## log
- 2026-03-15: Initial build. Two modes: mic recording (listens for 4s, shows waveform visualizer) or instant "What did my cat say?" button. 10 meow types (short meow, long mrooow, rapid mew, growly, silent mouth, chirping trill, yowling, purr-meow, squeak, breathy huff) with descriptions. 40 hilarious demand translations. 12 mood states with icons. Animated cat face emoji (bouncing while listening, head-tilt while translating). Waveform visualizer from AnalyserNode on canvas with pink/purple glow. Synth meow sound (sine sweep with LFO vibrato). Translation reveal chime (E-A-C# triangle arpeggio). Translation card with gradient top border, slide-up animation. Scrolling history of previous demands. Anybody + Caveat typography, dark purple/pink neon palette.

## issues
- None yet

## todos
- Share translation as image card
- Cat personality profiles (sassy, dramatic, royal)
- Meow intensity meter from actual audio levels
- Multi-cat mode (different cat personalities)

## notes
- No database — pure frontend
- Mic: getUserMedia, auto-stops at 4s, graceful fallback to instant mode
- Waveform: getByteTimeDomainData, dual-layer stroke (thin pink + thick purple glow)
- Synth meow: sine osc with frequency sweep (baseFreq*1.5 → baseFreq → baseFreq*0.7), LFO vibrato 5-8Hz
- 40 unique demand strings, all written as first-person entitled cat monologues
- History: keeps last 10, renders items 2+ (current shown in main card)
- Cat face states: 🐱 idle, 😺 listening, 🤔 translating, 😼 result
