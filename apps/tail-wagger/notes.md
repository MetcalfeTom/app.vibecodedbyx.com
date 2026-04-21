# Tail Wagger

## log
- 2026-04-21: Created. Cartoon dog whose tail wags continuously and who barks whenever the pet-counter lands on a prime. **Dog art**: inline SVG (500×400 viewBox) of a chunky cartoon pup — floppy ears, round muzzle with nose highlight, star-pendant red collar, legs + paw pads, belly gradient, tongue that poofs out on bark. Tail is a separate `<g class="tail">` with `transform-origin: 16% 40%` drawn *behind* the body so it rotates around its base. Head group bobs vertically; ears rotate counter to tail for extra excitement. Eyelids (initially scaleY=0) flick every 2.2–5.7s. **Wag physics**: `tailAngle = sin(phase*2π) * amp`; amp = `wagAmp (10°) + wagBoost*1.6 + (barking?18:0)`, speed = `2 + wagBoost*0.18 + (barking?8:0)`; `wagBoost` decays with half-life 0.7s. Each pet adds +7 boost (capped 40); bark adds +14. **Counter**: click/tap the stage = +1, PET button = +1, +10 button = +10, RESET zeros state. For each increment, run `isPrime(count)` (2,3 special-cased + 6k±1 loop). On prime: `doBark(n)` — random word from `['WOOF!','BORK!','ARF!','RUFF!','BARK!','YIP!']`, speech div fades in (rotate(-6deg) scale 0→1), dog `.bark` class triggers `bodyBounce` keyframe + tongue visible for 420ms, stage `.shake` keyframe, pink counter color, and bark SFX. Pet bursts float up with "wag!"/"pet"/"boop"/"good"/"✦" (or "★ BARK ★" on primes) spawned at pointer position. **Audio**: Web Audio synth bark = white-noise buffer (360ms, `(1-i/len)^1.6` envelope) through bandpass 1100→420Hz Q=4 + sawtooth growl 220→95Hz, noise 0→0.65 + growl 0→0.22 gains with fast attack / exp decay, master 0.9. Pet blip = 520→760Hz triangle, 120ms bell. Muted by default? No — on by default, 🔊/🔇 toggle button. Audio unlocks on first gesture. **Styling**: cream/brown/collar-red/gold palette, repeating-linear-gradient picnic-blanket bg, Bungee (title "TAIL WAGGER" triple-shadow gold→red), Rubik Mono One for the big counter number, Fraunces italic for subtitles, Space Mono for body. Prime counter flips to hot pink `#ff3d7f`. Bark Roll card shows last 40 primes as pink chips with brown offset shadow. Stage has inset soft dot-speckles and shadow ellipse under dog. Controls: PET / +10 / RESET / SOUND toggle. Mobile: panel collapses to single column.
- Pollinations OG image (cheerful brown dog poster).

## features
- Click/tap dog OR use PET button (+1), or +10 for speed
- Prime detection on every increment → BARK animation + synth woof
- Continuous tail wag sine animation, pets add decay-boosted amplitude + speed
- Head bob, ear counter-sway, random blinks
- Tongue pops out during bark, body bounces, screen shake
- Pink-chip bark roll showing all primes hit (last 40)
- Mute toggle, reset
- Mobile + desktop friendly

## issues
- Very fast mashing can stack bark SFX; no debounce — at +10 increments hitting multiple primes, barks fire sequentially with 60ms offset.
- No persistence (counter resets on reload) — intentional, feels more toy-like.
- `isPrime` uses O(√n) trial division — fine up to millions; practical limit is UI patience.
- Big jumps (+10) can skip primes visually (no intermediate animations per jump) — we still log every prime in the chip row.

## todos
- Save best streak / most barks in localStorage
- Auto-pet / "zoomies" mode: hands-free wagging
- Different dog breeds (corgi / shiba / dachshund art variants)
- Treats: special counter milestones (100, 1000) unlock confetti
- "Prime stairs" minigame: reach target prime without overshooting
- Shareable dog portrait PNG
