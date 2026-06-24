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

- 2026-06-24 (upgrade): **click controls + obsidian phase-two + mutual-KO progression fix**.
  - **Click controls** (desktop mouse): left-hold walks toward the cursor and auto-punches when adjacent to the boss; click high (above y=GROUND-140) hops; right-click kicks. Resolved into a `clickDir` in update() that falls back behind keyboard. `clickHold`/`clickX` from canvas pointer events; cleared on mouseup/blur. Listed on title screen.
  - **Obsidian phase-two** (Ender Colossus): at <=50% HP `enterObsidian()` fires once — body recolors to near-black `#0d0a16` with glowing `#a64dff` veins + brighter taller eyes, +35% speed, cooldowns ×0.62, wider void-orb arc (5 vs 3), slam dmg 14→17, and a NEW sky-rain of 4 void orbs every 1.6s. Boss name swaps to OBSIDIAN COLOSSUS, "PHASE II — OBSIDIAN" banner, purple `phaseFlash` screen tint (decays in updFX, drawn in render).
  - **Progression fix**: mutual-KO guard — if the player dies the same frame a boss dies, the delayed `showBossCard`/`win` no longer pops over the DEFEATED screen (now gated on `state==='play'`). This was the only real soft-lock path after Creeper King.
  - NOTE: there is no separate "Dark Lord hero" — the player is the orange "Chosen One" stick figure; the Ender/Obsidian Colossus is the dark-lord-style final boss.

- 2026-06-24 (bugfix, truzegamer report): **underground spawn + punch-slide + progression-cache**.
  - **Underground spawn**: the stick rig draws legs ~46px BELOW the hip, but the hip was grounded at the surface line, burying the feet. Added `FOOT=46` + `PG()=GROUND()-FOOT` as the player HIP rest line so feet land ON the grass surface. Bosses still rest at GROUND() (they draw upward from their base, so they were already correct).
  - **Punch pushes the player**: run momentum carried through the attack and, with no player/boss collision, crept the player into/under the boss. Two fixes: (a) `this.vx*=0.18` on punch/kick start to plant the feet; (b) soft player↔boss separation each frame (`minSep=boss.w*0.42+16`) so you can't slide into the body — melee reach (72–84) stays longer than the gap, so hits still land.
  - **Progression after Creeper King**: the mutual-KO guard (`state==='play'` gate on the delayed boss card / win) IS in the shipped file — verified via `git show HEAD`. Reporter was on a cached HTML; needs a hard refresh.

## issues
- Melee connects on floating bosses even though they visually hover up (logical boss.y stays at ground). Acceptable arcade feel; revisit if it reads wrong.
- Creeper explode block has a redundant double-condition (both call hurt(22,300)); harmless.

## todos
- Optional: difficulty scaling / boss-2 phases, more player moves (uppercut launcher → air combo), parry timing window on block.
- Optional: boss-specific arena tints / hazards.
