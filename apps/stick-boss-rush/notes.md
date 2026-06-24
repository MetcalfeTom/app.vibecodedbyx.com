# Stick Boss Rush — notes
requested-by: truzegamer (chat) — "2D boss-rush fighter, Animator-vs-Animation stick figures vs Minecraft-style bosses, animated combat moves"

## log
- 2026-06-24: Created. Self-contained canvas brawler, zero deps.
  - **Player**: procedural stick-figure rig (`drawStick`) — joints computed from pose angles measured from straight-down, positive swings toward facing. Per-state pose targets lerped each frame (`setPlayerPose`): idle breathing, run leg/arm cycle via sin, jump tuck, punch arm-thrust, kick leg-thrust, dash lean, special charge→fire, hurt recoil. Glowing orange "Chosen One" with iframe flicker.
  - **Combat**: J punch (10dmg), K kick (16dmg, knockback), Shift dash (i-frames + afterimage), S block (75% reduction), L energy beam (46dmg, needs full ENERGY meter — fills 9 per hit). Combo counter (special charge + on-screen Nx). Hit window pr 0.28–0.62 of attack, one hit per swing (`hitApplied`). Hitstop 50ms + screen shake + spark particles + floating damage numbers.
  - **4 blocky bosses** (Minecraft pixel-art draw fns): CREEPER KING (lunge + telegraphed AOE explosion — jump/dash clear), BONEBOW skeleton (kites + shoots gravity arrows), BLAZE TITAN (floats, fireball bursts at player angle), ENDER COLOSSUS (teleports behind you, void-orb spread, slam). Each: hp bar with ghost-trail, flash-white on hit, boss-intro card with name+desc.
  - **Projectiles** (arrows/fire/void) with their own update + player collision. Player energy beam = instant raycast hit on boss.
  - Background (sky + parallax blocky hills + grass/dirt block ground) cached to offscreen canvas, rebuilt on resize — drawImage per frame so the ~1000-cell ground doesn't redraw live.
  - **Audio**: Web Audio synth SFX (punch/kick/hit/jump/dash/charge/blast/bosshit/explode/hurt/arrow/win/lose). M mutes.
  - Mobile: 7 on-screen pads (move/jump/punch/kick/dash/⚡) shown on coarse pointers.
  - WCAG: canvas role=application + control-summary aria-label, focus-visible on buttons, rem sizing, prefers-reduced-motion, 2.75rem button min-height.

## issues
- Melee connects on floating bosses even though they visually hover up (logical boss.y stays at ground). Acceptable arcade feel; revisit if it reads wrong.
- Creeper explode block has a redundant double-condition (both call hurt(22,300)); harmless.

## todos
- Optional: difficulty scaling / boss-2 phases, more player moves (uppercut launcher → air combo), parry timing window on block.
- Optional: boss-specific arena tints / hazards.
