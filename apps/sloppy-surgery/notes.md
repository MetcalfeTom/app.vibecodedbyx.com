# Sloppy Surgery

## log
- 2026-04-20: Created. Trauma-Center-inspired precision surgery sim on a 1200×820 canvas. 5 tools (scalpel/forceps/gauze/syringe/suture) selected via click or keys 1–5; wrong-tool clicks cost vitality. 3 cases with increasing complexity:
  - **Case I · Shards** — 4 glass shards around the abdomen, forceps-only. Each shard rendered as shaded glass polygon w/ highlight stroke and blood drip halo; pluck on click, 200 pts × chain.
  - **Case II · Burst** — phase 1 gauze-wipe 3 radial blood pools (drag to reduce `wet` by 0.07 per frame inside radius; wipe SFX throttled to 80ms), phase 2 syringe-seal 3 pulsing ruptures (pulse sin radius + warning dashed ring; sealed turns mint-green).
  - **Case III · The Full** — 4 phases: scalpel trace 22-point sinusoidal incision path, forceps extract 3 foreign bodies, syringe cauterize 2 ruptures, suture 14-point stitch close. After phase 1 the body shows an open red-tissue wound (gradient-filled ribbon around incision path coords).
- HUD: ECG canvas (220×60) with QRS spike pattern injected at BPM-derived interval + grid + mint/red glow trace; BPM counter pulses red below 25% vitality; vitality bar; score, chain multiplier (×1 up to ×9, decays after 2.5s without chainable action), time, rank.
- Vitality drains automatically (base 0.008/frame + case modifier); unsealed ruptures bleed extra; wrong tool click = 0.02 drain; missed shard click = 0.015 drain. Vitality 0 → FLATLINE.
- Scoring: 40 per incision dot, 200 per shard (chainable), 120 per cleaned pool, 220 per rupture (chainable), 50 per stitch, 400 phase bonus. Rank S/A/B/C/D/F based on score + time + success.
- Custom cursor renders the selected tool (scalpel blade, forceps prongs, gauze puff that stains red on drag, syringe with mint serum, curved suture needle + thread). Canvas uses `cursor:none` so custom cursor follows mouse/touch precisely.
- Web Audio synth SFX: tool beep, cut (saw + noise burst), pluck (two-tone bell), wipe (white noise), inject (pure tone), stitch (two-click), heartbeat (80/120 Hz layered sine), warn, win (arpeggio), fail (descending saw). Audio context unlocked on first click/tap.
- Bungee Shade (title + toast) + Unica One (labels/buttons) + VT323 (vitals numbers) + JetBrains Mono (body) typography. Teal/skin/blood/mint palette with operating-room light cone gradient.
- Mobile: vitals panel shrinks at <720px, tool panel shrinks, stat grid hidden. Touch events pipeline through same interact() path; gauze/scalpel/suture naturally dragged, extract/inject are touchstart-only.

## issues
- Wipe phase uses a flat-radius hit check — dragging fast can skip past pools without depositing enough taps. Tune if users complain.
- Particles use simple gravity; at very high drag velocities on gauze wipes they can stack up in thousands. Particle count is bounded by spawn events so this is fine in practice.
- Canvas uses native 1200×820 coords but scales via CSS — mouse rescaling done in `canvasCoords` via `rect.width/height`. Works but rounding in layout can shift hitboxes a pixel or two; tolerance radii are generous enough.
- No post-incision wound rendering for Cases I/II (only Case III). Keeps Case I/II focused on one mechanic each.

## todos
- Difficulty modes: Normal / Intern / Attending with different drain rates and counts.
- More cases: heart massage (rhythmic click-timing), defib (charge + release), transplant (align donor organ).
- Supabase leaderboard — cases × score × rank.
- Drag-to-trace for incision uses dot-hit tolerance; could add path-deviation scoring instead.
- Red-alert screen flash when vitality < 15%.
- Ranking screen on phase complete (per-phase flair like Trauma Center COOL/COMPLETE/AMAZING).
- Chaining across phases is implicit only via the +1 chain — add a visual chain ribbon.
- Case narratives / character portraits for patients.

## design
- Palette: gown #1a545f, skin #fcd9b6, blood #d41c33, chrome #d2dce6, mint #58e3a8, warn #ffdc48.
- Fonts: Bungee Shade (display), Unica One (all-caps labels), VT323 (vitals, CRT digits), JetBrains Mono (copy).
- Operating light is a radial gradient from CW/2,CH/2+30; patient is an ellipse gown with inner skin ellipse and subtle navel marker.
- Each tool renders at the cursor with unique shapes/colors so the current tool is always obvious without reading the sidebar.
- ECG is a sliding buffer that shifts left every frame and writes a discrete QRS pattern at heartbeat intervals — not a procedural sine but a faked EKG trace.
