# Circle Clash

## log
- 2026-04-22: Created. Minimalist top-down arena survival with 3 playable classes (Spikey / Shooter / Miner) vs. AI enemies drawn from the same 3 classes. **Aesthetic**: clean Swiss-style minimalism — cream paper bg `#f7f1e6`, pure white arena `#fbf7ee` with 1px black ring + subtle 26px dot grid + thin crosshair at center, three accent colors (Spikey `#e3473c` / Shooter `#2d73d2` / Miner `#e0a42f`). No gradients, flat fills, thin strokes. Instrument Serif italic for display (title clamp 64–138px, "clash" in red italic), JetBrains Mono for HUD/labels (uppercase 0.3em tracked), Archivo for body. Hard-edged boxy UI with 1px ink borders + offset block shadows. **Class select**: 3-card grid with SVG silhouette previews (rotated spikes radiating from Spikey's core; dashed ring + barrel protrusion for Shooter; 6 cog-teeth + dark drill core for Miner), 4-bar stat radar (Health/Speed/Damage/Range), per-class kit notes. Hover lifts card with 4px+6px block shadow. **Player classes**: 
  - **Spikey** — HP 90, speed 260, radius 20. No primary — deals 28 contact damage passively (×1.5 while dashing). Secondary **Dash** (Space): 0.3s burst at 1.9× speed with 0.32s i-frames, 1.2s CD. Rotating spike silhouette (12 lines radiating from center), flicker during i-frames.
  - **Shooter** — HP 70, speed 190, radius 18. Primary: click-to-fire 520u/s bullets (14 dmg, 0.25s CD). Secondary **Volley**: 5-round spread fan (0.9 rad spread, +4 dmg each), 3.2s CD. Dashed outer ring + rotating barrel rectangle points at aim.
  - **Miner** — HP 130, speed 160, radius 22. Primary: drop proximity mine at foot (46 dmg, 56 radius, 0.4s arm, 12s life, 0.65s CD, cap 6 active). Secondary **Pulse**: detonate all own mines simultaneously + 0.2s i-frames + screen shake, 4.5s CD. 6 cog-teeth rotating around core + dark drill center.
- **Enemies**: same 3 classes at 0.55× base HP × scaling factor `1 + (wave-1)*0.08`, 0.78× player speed. Spikey enemies charge and slam for 20 dmg contact (0.45s CD + small knockback). Shooter enemies maintain 230u distance, strafe, fire jittered bullets (10 dmg, 0.8–1.4s CD). Miner enemies keep 160u distance, drop 30-dmg mines every 2–3.5s. All have 0.6s fade-in spawn telegraph (dashed expanding ring). HP pip under enemy (visible once damaged). **Wave system**: start at wave 1 with 4–5 enemies, each subsequent wave +1.5 count and increasing class mix (wave 1: 70% spikey/30% shooter; wave 2–3: 50/35/15; wave 4+: 40/35/25). 0.55–0.85s spawn cadence. Wave clear → 1.8s interlude + +30% HP regen + next wave starts. Big italic Instrument Serif wave number banner fades in/out. **Controls**: WASD/arrows move, mouse aim + left click primary, Space secondary, P pause. Mobile: 108px virtual joystick (bottom-left) + 96px FIRE button (bottom-right) + 64px ◈ dash button, auto-aim toward nearest enemy when using touch. **Physics**: enemies separate to avoid clumping (push by (minD - dd) * 0.5 when overlapping). Player + enemies clamped inside arena radius via `keepInArena()`. Bullets auto-despawn past arena edge. **Effects**: particle burst on damage/kill (4/16 per hit/kill), floating damage numbers (JetBrains Mono 14px, rises 20px, 0.8s life), screen shake (0–20 damped -0.5/frame) on player damage + pulse detonations. **Audio**: Web Audio synth — square shoot bleep, noise+sub volley, triangle mine beep, noise+sub explode, saw+noise dash, sub-bass+noise pulse, noise hit, sawtooth+noise death, ascending 440→660→880 wave chime. **Game over overlay**: "so it goes." Instrument Serif italic + summary (wave/kills/class) + Retry/Back. Pause overlay with matching aesthetic. OG image via Pollinations (no `referrer` param).

## features
- 3 distinct classes with unique primary + secondary abilities
- Wave-based survival (endless scaling)
- Circular arena with thin black ring + dot grid
- Enemy mix of all 3 classes (shooter, miner, spikey)
- Spawn telegraph (dashed fade-in circle)
- Click-to-start class select with stat radar + kit descriptions
- Mobile virtual joystick + fire + dash buttons, auto-aim
- Pause (P), Retry, Quit
- Floating damage numbers in class accent colors
- Minimalist swiss-design palette (cream + 3 accents, no gradients)
- Screen shake on damage + pulse detonations
- Heal 30% HP between waves
- Web Audio synth SFX (no assets)

## issues
- All enemy class silhouettes use the same render as their player counterpart — they are visually identical to the player class. Fine for now; a distinguishing outline or aura could help readability in chaotic waves.
- Miner player's "Pulse" secondary needs at least 1 active mine to be useful. Short 1s CD applies when pressed without mines so the button isn't completely dead.
- Spikey dash direction defaults to aim direction if there's no WASD input — ensures it's always useful, but means keyboard users need to press a direction before dashing to get the intended move.
- Dot grid + arena clip: rendered inside arena path clip, so edges fade cleanly with the ring.
- Mobile Space-key equivalent is the ◈ dash button; on desktop Space defaults to page scroll so `e.preventDefault()` is explicitly called on keydown.

## todos
- Unique enemy variants — darker outline for enemy sprites so you can't mix them up with your own player circle
- Boss enemies every 5 waves (jumbo variant with 3× HP and unique attack)
- Score multiplier combo (kill X enemies within 2s for bonus)
- Powerup pickups between waves (speed, damage, heal, extra life)
- Persistent best wave per class in localStorage
- Touch controls: aim stick on right (split-stick) for explicit aiming
- Alt color mode / high-contrast option
- Music: light ambient loop with BPM-synced wave pulses
