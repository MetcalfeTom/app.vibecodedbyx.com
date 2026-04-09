# Glyph Gun

High-speed typing combat. Enemies drift toward a central turret; each one carries a word. Every correct keystroke fires a bullet; the final letter kills. Mistyping takes hull damage and breaks the lock.

## log
- 2026-04-09: Initial build. Canvas game at 880x560, green-terminal aesthetic with CRT scanlines + grid background + vignette + horizon line. Three enemy tiers (triangle/hex/octagon) keyed to word length (easy <6, mid 6-7, hard 8+), escalating speed per wave. Lock-on system: first keystroke that matches an enemy's first letter acquires a lock; all subsequent keystrokes must match the current enemy's next letter. Mistype = -6 hp + combo reset + break lock + red flash + shake. Last letter flags bullet as "killing" (gold glow) so kill registers on bullet impact. Bullets home in on target with corrective steering. HUD: hull, score, live WPM, accuracy%, combo streak, wave. Wave system: 5+2*wave enemies, easier pools up to wave 3 then mid, hard pool unlocks at wave 10. Sound: WebAudio square/triangle/sawtooth blips for shoot/miss/hit/kill/hurt/wave. JetBrains Mono + Major Mono Display typography, deep teal + acid green + amber + blood-red palette. Mobile: hidden text input focused on canvas tap forwards soft-keyboard input to handleKey().

## features
- 3 enemy tiers via word length with distinct geometry and colors
- Lock-on system prevents letter collisions across enemies (words with same first letter gated)
- Homing bullets with muzzle flash + trail particles
- Live WPM + accuracy tracking
- Combo streak multiplier
- Screen shake + color flash on damage/kill
- Wave banner announcements
- WebAudio SFX
- CRT scanlines + grid + pulsing turret
- Mobile support via hidden input

## issues
- On rare occasions multiple enemies may share a first letter (pickWord collision-checks the active set but does not retroactively reshuffle)
- No leaderboard yet
- Key repeat from held keys is blocked only by browser default; dedicated debounce could be added if stuck keys spam

## todos
- Supabase leaderboard (score + wpm + accuracy)
- Boss enemies every 5 waves with multi-word phrases
- Power-ups: EMP (freeze all enemies), auto-aim (next 3 words free), shield pulse
- Special modifier words that grant score bonuses
- Add OG preview PNG
