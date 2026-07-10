# dodgecore · notes

## log
- 2026-07-10: v1 (chat ask: NEW top-down arena distinct from Gladiamond — joystick controls, dodge, basic attacks, skills, plain canvas). **Circular arena** (R=44% of min viewport dim, faint ring grid + crosshair), neon-brutalist palette: void black / acid #d9ff3d / coral #ff4f5e / ice #9adcff, Archivo Black + IBM Plex Mono. **Controls**: desktop = WASD move, mouse aim, hold-LMB autofire (0.16s), Space dash, Q nova, E lance, M mute, R retry; touch = left joystick (identifier-tracked) + FIRE (hold) / DASH / NOVA / LANCE buttons, aim auto-locks nearest foe (`touchMode` flips on first touch input). **Dodge**: 0.22s dash at 760u/s toward move dir (falls back to aim dir standing still), 0.3s i-frames + sprite flicker, 1.2s cd, acid afterimage trail. **Skills**: NOVA (5s cd) = expanding ring, 40 dmg + knockback in r150, ALSO wipes enemy orbs inside — the panic button; LANCE (8s cd) = instant 1200u piercing beam, 70 dmg to every foe within 16+r of the segment (point-to-segment dist). **Foes**: coral triangle chasers (contact 14) + ice square spitters (kite to 220u, fire 150u/s orbs, contact 10), wave scaling on hp/speed/spawn-rate/spitter-ratio, foes clamped inside arena. Player 100hp, 0.7s hurt i-frames + 20u knockback, hp bar goes coral <35. Score/wave/best (localStorage). Cooldown chips (desktop top-right, scaleY drain) + dimmed touch buttons. WebAudio synth per action. WCAG: role=application w/ control summary, aria-labels, focus-visible, reduced-motion kills shake/trail/flicker-adjacent anims. Pollinations OG (flux seed 3327). **Headless-sim tested** (node Proxy-ctx stubs): arena clamp over 10s, autofire kill, nova clearing 4 surrounding foes, lance piercing 3-in-a-line, dash-through-chaser with zero damage, park-until-death. Hook `__dodge {state,start,step,key,aim,fire,dash,nova,lance,spawn}`.

## issues
- `spawn()` returns the foe object — sim tests reposition it directly; fine, but remember foes spawn OUTSIDE the ring (R+40) and walk in, so "why is the wave slow to start" is spawn-travel time, not a bug.
- Touch aim = nearest foe; if chat reports "can't aim at the spitter behind the chaser", that's the tradeoff — a right-stick twin-stick mode is the upgrade path.

## todos
- Right joystick for true twin-stick aim on touch.
- 3rd skill slot (time-slow bubble?) once chat has played it.
- Co-op via Supabase Realtime (pixel-fog recipe) if requested.
