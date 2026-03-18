# Chat Cat

Virtual pixel cat that reacts to activity and sleeps when idle.

## log
- 2026-03-18: Initial build. Pixel art cat on windowsill with moonlit night scene. State machine: sleeping (curled loaf, zzz bubbles), waking, awake (looks around), playing (walks back and forth), eating (food bowl), yawning, sleepy. Cat falls asleep after ~15s of no activity. Type messages to interact — "pet/pat/scratch" triggers purring + hearts, "feed/food/treat" triggers eating, "play/toy" triggers zoomies, "good/cute/love" triggers hearts. Mouse movement and clicks count as activity. Pixel art with stripes, ear wiggle, blink cycle, tail physics, breathing animation. Floating zzz bubbles when sleeping. Damage number style emotes. Stars twinkle, moon glow. Silkscreen typography.

## issues
- None yet

## todos
- Add yarn ball toy (draggable)
- Meow sounds (WebAudio)
- Multiple cat skins/colors
- Day/night cycle based on real time
- Save cat mood to localStorage

## notes
- No database — pure frontend
- PX=4 pixel scale
- State machine: sleeping→waking→awake→playing/eating→sleepy→yawning→sleeping
- Activity level is rolling average, decays at 3/s
- Cat energy decays at 1.5/s, restored by interaction
