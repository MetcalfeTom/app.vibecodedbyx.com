# Laughter Meter

## log
- 2026-01-07: Initial creation - sonic overload visualizer with mic input

## features
- Microphone audio input visualization
- Circular meter ring with gradient fill
- Multiple laughter levels (silence to BOOM)
- Dynamic emoji reactions based on volume
- Frequency bars visualizer (32 bars)
- Floating emoji particles at high volumes
- Sonic wave pulses at extreme levels
- Screen shake at overload
- Peak dB tracker
- Background pulse effect
- Demo mode (click anywhere without mic)

## levels
- 0-20: 😶 SILENCE
- 20-35: 🙂 QUIET - "hmm..."
- 35-45: 😊 CHUCKLE - "heh"
- 45-55: 😄 GIGGLE - "hehe!"
- 55-65: 😆 LAUGH - "HAHA!"
- 65-75: 🤣 ROFL - "LMAOOO"
- 75-85: 😂 DYING - "I CANT 💀"
- 85-95: 🔊 SONIC! - "OVERLOAD!!!"
- 95+: 💥 BOOM - "🔥🔥🔥"

## controls
- Click "ACTIVATE MIC" to start with microphone
- Click anywhere else for demo mode (simulated audio)

## design
- Dark background with pulsing colors
- Bungee font for titles/reactions
- Share Tech Mono for data
- Gradient color scheme (cyan → green → yellow → red)
- Neon glow effects throughout
- Floating laugh emojis at high levels

## technical
- Web Audio API for microphone input
- FFT analysis for frequency data
- Real-time volume calculation
- Particle system for floating emojis
- CSS animations for sonic waves
- RequestAnimationFrame for smooth updates

## todos
- Add sound recording/playback
- Add laugh detection (specific frequency patterns)
- Add leaderboard for peak scores
- Add different visualization modes
- Add share screenshot feature
