# La Lucarne

Penalty shootout and free kicks at night at the Vélodrome. You shoot as Payet (10), then dive in goal for OM; or take five free kicks against a jumping wall. Asked for by Elieutch (French viewer, OM fan) on 2026-10-07: "fais un petit jeu avec Payet le joueur de l'OM".

## Art direction
- **Look**: low-poly stadium at night, MeshStandard with flat colours, one InstancedMesh crowd (5,200 boxes in sky blue, white and navy) that bounces in a vertex shader.
- **Palette**: night navy #071425, OM sky blue #2faee0 / #8fd8f5, white kits, gold accent #ffd23f for calls, aim and buttons. Rivals in burgundy #7a1f3d.
- **Mood and light**: floodlit night. Key light warm white from high front-right with soft shadows, a cool blue fill, fog #0a1a30, flares flickering in the virage.
- **Camera**: behind the penalty spot. Landscape: (0, 2.3, 19.2) looking at (0, 1, 1), fov 38. Portrait: (0, 3.4, 18.2) looking at (0, .7, 2), keeping a 15.5° horizontal half-angle.
- **Hero**: Payet in white with PAYET 10 on the back (canvas texture, redrawn once Big Shoulders loads).
- **Type**: Big Shoulders Display (scoreboard, calls, titles) + Familjen Grotesk (body).
- **Budget**: ~94 draw calls, ~73k triangles, one shadow light (1024 on phones, 2048 on desktop).

## Rules and feel
- 5 kicks each, alternating, you shoot first; it ends early when one side can't catch up, then sudden death.
- Shooting: tap the goal. The shot lands at the aim plus nerves (σ .13 → .40 as the kicks go on). The top corners can't be saved even when the keeper reads you. ✨ Pied magique (one per game): no nerves, faster, with curl.
- The AI keeper dives at the kick: a side (leaning toward where you've shot before) or stays in the middle; 18% of the time he reads the shot (never against the magic foot).
- Keeping: tap where to dive. A tap more than .2 s before the kick lets the shooter see you and switch sides half the time. No tap means you stand in the middle, which still saves central shots. The rivals' ball gets faster each kick (.80 s → .60 s).
- Crowd bounce, crowd noise and nerves all rise with the kick number.
- FR/EN (French by default for French browsers, a toggle bottom-left), mute, keys Q W E / A S D, F for the magic foot, M to mute.
- Fan tribute: no club crest or logo, rivals are generic ("Rivaux").

## Free kicks (v1.2)
- Five spots in order (FK_SPOTS): (-5.5, 21), (1.5, 23.5), (7.5, 20), (-9, 18.5), (3.5, 27). Score = goals out of 5, best kept in localStorage `la-lucarne:fkbest`. End titles: 4+ Magique, 2-3 Pas mal, 0-1 Le mur a gagné; the crowd celebrates from 3.
- Input: press on the goal to aim (locked), slide sideways to curl (CURLMAX 2.2 m of bow at mid-flight, full curl = 30% of the screen width, max 260 px), release to shoot. Mouse hover previews. Keys: arrows curl, Q-D shoot, Space/Enter shoot at the previewed aim. A dotted preview shows the first half of the flight.
- Flight: ballAt = straight line to the target + curl along the perpendicular (G.px, G.pz; 1, 0 for penalties) + arc G.arc (penalties .25 / .1 low; free kicks .35 + .5·aim y). tf = distance / 23 m/s.
- Wall: 4 men (3 when |x| > 7), one merged vertex-coloured mesh each (wallMan), 9.15 m out on the line to the near post, the outer man .5 m past that line. Jumps .38 m for .55 s starting .08-.16 s after the kick, 70% of kicks. wallCheck() finds where the planned flight crosses the wall line: blocked (G.wallU) or over the top (G.over, the keeper reads it late).
- Keeper: starts .5 m toward the far post (G.kx0), dives at his guess (target + error .35, +.3 for full curl, +.3 unsighted) .2-.46 s after the kick, with a .3 m shuffle step (G.step) that penalties don't get. diveState/keeperReaches work relative to G.kx0.
- Camera: behind the ball on the line to the goal (8.2 back, 2.8 up; phones 9 back, 3.4 up), fov fitted so the bar and ball both show and 6.4 m (phones 5.4) either side of the goal centre fits; the ball sits at ~80% height.
- Under the wall (v1.3): aims below .5 m become driven shots (fkArc ramps .02 at y .12 up to .6 at y .5, continuous with .35 + .5y above). Kicks 2-5 have a 50% chance of a man lying behind the wall (LIER, a wallMan on his back along the wall, .8 m behind it, G.lie). The wall jumps 90% with him there, 60% without. wallCheck: a ball whose top is under the jumping boots passes (G.under, keeper unsighted x1.5) and then meets the lier's line (.94 m half-length, blocks anything below .3 m); labels SOUS LE MUR ! / L'HOMME AU SOL !. The call says "· un joueur au sol" when he's there.
- Opening shot (v1.3): each free kick holds .55 s on a side view of the wall (INTRO, from the inner side, 3.1 m up), then swoops 1.15 s to the shooting camera (smoothstep on pos, look and fov; CAM.fov keeps the fk fov). A tap during it skips it; hover preview waits for it.
- Probe odds (v1.3, 300 kicks per spot): favourite over-the-wall curler 51-73% (with a lier 50-73%); low near-post shot under the wall, no lier: through 53%, goals ~22-27% before the keeper's x1.5 unsighted penalty; with a lier 0% (he stops 72-85%, the wall the rest); low far-post 19-25%.
- Probe odds (v1.2, nerves of the first kick): aiming the centre with no curl ~10-17% goals; average over all aims ~18-25%; the best (near-post corners curled round the wall, or over the wall into the near top corner) ~62-68%.

## Log
- v1.0 (2026-10-07 19:13 UTC): stadium, players, shootout, keeping, sound, FR/EN, share. Back net was slanted the wrong way in the first render (fixed: rotation.x = +atan2(GD, GH)); after a goal the ball bounced off the back net and rolled out of the mouth (fixed: G.inNet keeps it behind the line, side netting clamps x).
- v1.1 (2026-10-07 19:30 UTC): the tifo: before Payet's 5th kick, every sudden-death kick and on a win, the virage flips cards in a wave (34 m/s, left to right) into a hand-drawn 26x16 "10" (TIFO_10) in sky blue on white, with stripes out to the corners. A banner plane with the same bitmap sits just behind the cards so the seat gaps show the right colour; the crowd stops bouncing while it's held. Scoreboard: at most 6 dots per side (sudden death shows the last 5 plus the next), no empty placeholder after the end, smaller on phones. "Penalty shootout" kicker translated. Corner buttons stacked so the hint never covers them.

- v1.2 (2026-10-07 ~20:00 UTC): free kicks mode (Coups francs) with a jumping wall, spray foam, curl preview and a keeper cheating to the far post; title card has two buttons. First balance pass was far too easy (90% over the wall): lowered the arc, more nerves, wall outer man further out, keeper nearer the centre with a shuffle step.

- v1.3 (2026-10-07 ~20:20 UTC): under the wall: a man lying behind the wall on some kicks, low driven shots slip under a jumping wall, and each free kick opens on a side view of the wall. Pushedbutton scored 3/5 on v1.2.

## Issues
- Probing free-kick odds: let the game run at G.speed 60 for a moment first so the clock T is past ~2 s, otherwise `diveAt - tf` goes negative and the keeper never dives in the sim.
- G.speed (test hook) multiplies dt: a full 10-kick game runs in ~75 s headless at speed 4. But a probe polling every 20 ms can't time a keeper tap inside krun at 5 fps, so test dives through resolve() instead (a perfect, on-time dive saves ~90% of rival shots; one at 60% of the dive, ~11%).
- Headless frames are slow: probe the logic directly (`__LU.resolve`, `kick`, `over`, `rivalTarget`) and freeze with `G.hold = 1` for screenshots.
- Probe odds (v1.0): corner shots ~96% goal before the nerves, low/middle ~68%; keeping saves ~15-18% from a blind guess, more for a reaction dive.

## Todos
- Free kicks: a goal replay, Elieutch's pick for a spot (the voice suggested dead centre, ~25 m).
- A goal replay camera.
- Ask Elieutch: free kicks or more of the shootout?
