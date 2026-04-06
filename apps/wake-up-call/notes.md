# Wake Up Call

## log
- 2026-04-06: Initial build — brutal alarm app that flashes red and plays a harsh buzzer until you type "hello". Square+sawtooth oscillators with LFO warble for maximum annoyance. Red flash overlay every 150ms. Tracks elapsed suffering time. Victory chime (C-E-G) on dismiss. Bungee Shade + IBM Plex Mono typography, red alarm / green peaceful states.

## features
- Harsh WebAudio buzzer: square wave (220Hz) + sawtooth (223Hz) + LFO warble (4Hz)
- Red flash overlay pulsing every 150ms
- Shaking alarm clock icon
- Must type exactly "hello" to dismiss
- Wrong input (5+ chars) shakes input and clears it
- Elapsed time counter ("Xs of suffering")
- Victory state: green theme, sunrise icon, C-E-G chime
- ARM AGAIN button to restart the alarm
- Visual alarm starts immediately, audio on first tap (browser requirement)
- Autofocus on input field

## issues
- Mobile browsers may block audio until user taps — visual alarm runs immediately but buzzer waits for gesture
- Could be genuinely startling with headphones on

## todos
- Volume slider (for the brave)
- Harder modes: type a random word, solve math, type backwards
- Escalating buzzer that gets louder over time
- OG image
