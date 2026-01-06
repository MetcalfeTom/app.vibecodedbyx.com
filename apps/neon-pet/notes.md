# Neon Pet

## log
- 2026-01-06: Initial creation - interactive digital pet with neon aesthetic

## features
- 6 pet choices: 🐱 🐶 🐰 🦊 🐼 👾
- Smooth cursor following with easing
- Click reactions: bounce, spin, grow, shake
- Particle explosions on interaction
- Floating hearts and stars
- Neon cursor trail
- Happiness meter that decays over time
- Mood indicator based on happiness
- Touch support for mobile

## interactions
- Move mouse: pet follows, slight happiness gain
- Click: random animation, particles, hearts, +5 happiness
- Select pet: change pet with celebration animation

## mood system
- 80-100%: 😊 Happy
- 60-79%: 🙂 Content
- 40-59%: 😐 Bored
- 20-39%: 😢 Sad
- 0-19%: 😭 Lonely
- Happiness decays after 3s of no interaction

## design
- Dark purple/blue gradient background
- Neon magenta and cyan colors
- Glowing drop shadows on pet
- Custom neon cursor (hidden native cursor)
- Particle colors: magenta, cyan, pink, teal, yellow, orange

## technical
- requestAnimationFrame for smooth animation
- CSS animations for reactions
- DOM-based particles with removal
- Touch events for mobile support
- Smooth easing: += delta * 0.08

## todos
- Add feeding mechanic
- Add mini-games
- Add pet sounds
- Save pet state to localStorage
