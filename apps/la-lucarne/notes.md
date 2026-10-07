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

## Lucarne (v1.6)
- The name: la lucarne is the top corner, and French commentary says a shot there knocks out the cobwebs (les toiles d'araignée). The webs are reset at every kick (resetSpot, startFk) and when a replay starts.

## Corners (v1.7)
- Five corners, alternating sides (1st from the right, x = +25.6, z .4, by a blue corner flag at x = ±26; touchlines at x = ±26 and corner arcs painted on the pitch canvas, the goal line now stops at the corners).
- ckaim: the intro opens on Payet at the flag (INTRO, the FK hold/swoop), then the box camera (ckCam: high behind the box, portrait h 11 / z 20 with a lens wide enough for x ±5.6, looking 1.6 m (.8 portrait) toward the flag side). Three gold rings on the grass: near post, penalty spot, far post (CK_Z, mirrored by side). Four Rivals mark three OM attackers in a [2,1,1] or [2,2,0] pattern, shuffled, so one zone is always lighter; reading it is the game. Tap near a zone (ckZoneAt: nearest projected zone within ~110 px+), keys 1/2/3 or a/s/d.
- ckrun (.75 s, off screen) -> ckfly: ckBallAt = a line from the flag to the contact point H (zone + 2.25 m up, ±.2 m delivery noise) + a 2.3 m arc (3.3 left the ball above the frame until the last third) + a curl across the line (inswinger from the left, outswinger from the right; Payet is right-footed). tf = distance / 19.5 (~1.2-1.5 s).
- The timing ring (TRING) shrinks onto the gold dot (TDOT) over the last .9 s; tap the goal: where you tap is where you head it (goalPoint), when you tap sets the quality q (window -.3 s .. +.2 s around contact; outside it: TROP TÔT ! / TROP TARD ! and a Rival clears). A marker wins the header with p = .03 (none), .08 + .3(1-q) (one), .18 + .4(1-q) (two) -> DÉGAGÉ !. Header error .2 + 1.4(1-q)^1.5 + .06 per marker, speed 10 + 8q m/s, the keeper (kx0 = .7 towards the near post) dives at his guess with error .3 + .5q after .1 + .1q s, then resolve()/landed() as ever (HEADER! / DE LA TÊTE !, LUCARNE ! still wins for a top corner).
- The corner men are merged wallMan meshes (wallMan now takes shirt, shorts and a loose-arms pose), 1 draw call each; the attacker in your zone jumps to peak at contact, his markers jump with him (higher when they win it).
- Best in localStorage la-lucarne:ckbest.
- Corner goals get a replay (v1.7.1, ckReplay): RP.cks 1.7x slow from c.k0 (the cross leaves the flag), camera fixed at (-sg*5.2, 3, -4.6) beside the far post behind the goal line, look lerps after the ball; ckBallAt before G.kickT (the header), ballAt after; ckMen(t) takes the replay clock; ckStep returns early in replay. The keeper stands at kx0 until his dive starts (fk replays too: he used to lie where he landed during the lead-in).

## Free kicks (v1.2)
- Five spots in order (FK_SPOTS): (-5.5, 21), (1.5, 23.5), (7.5, 20), (-9, 18.5), (3.5, 27). Score = goals out of 5, best kept in localStorage `la-lucarne:fkbest`. End titles: 4+ Magique, 2-3 Pas mal, 0-1 Le mur a gagné; the crowd celebrates from 3.
- Input: press on the goal to aim (locked), slide sideways to curl (CURLMAX 2.2 m of bow at mid-flight, full curl = 30% of the screen width, max 260 px), release to shoot. Mouse hover previews. Keys: arrows curl, Q-D shoot, Space/Enter shoot at the previewed aim. A dotted preview shows the first half of the flight.
- Flight: ballAt = straight line to the target + curl along the perpendicular (G.px, G.pz; 1, 0 for penalties) + arc G.arc (penalties .25 / .1 low; free kicks .35 + .5·aim y). tf = distance / 23 m/s.
- Wall: 4 men (3 when |x| > 7), one merged vertex-coloured mesh each (wallMan), 9.15 m out on the line to the near post, the outer man .5 m past that line. Jumps .38 m for .55 s starting .08-.16 s after the kick, 70% of kicks. wallCheck() finds where the planned flight crosses the wall line: blocked (G.wallU) or over the top (G.over, the keeper reads it late).
- Keeper: starts .5 m toward the far post (G.kx0), dives at his guess (target + error .35, +.3 for full curl, +.3 unsighted) .2-.46 s after the kick, with a .3 m shuffle step (G.step) that penalties don't get. diveState/keeperReaches work relative to G.kx0.
- Camera: behind the ball on the line to the goal (8.2 back, 2.8 up; phones 9 back, 3.4 up), fov fitted so the bar and ball both show and 6.4 m (phones 5.4) either side of the goal centre fits; the ball sits at ~80% height.
- Under the wall (v1.3): aims below .5 m become driven shots (fkArc ramps .02 at y .12 up to .6 at y .5, continuous with .35 + .5y above). Kicks 2-5 have a 50% chance of a man lying behind the wall (LIER, a wallMan on his back along the wall, .8 m behind it, G.lie). The wall jumps 90% with him there, 60% without. wallCheck: a ball whose top is under the jumping boots passes (G.under, keeper unsighted x1.5) and then meets the lier's line (.94 m half-length, blocks anything below .3 m); labels SOUS LE MUR ! / L'HOMME AU SOL !. The call says "· un joueur au sol" when he's there.
- Opening shot (v1.3): each free kick holds .55 s on a side view of the wall (INTRO, from the inner side, 3.1 m up), then swoops 1.15 s to the shooting camera (smoothstep on pos, look and fov; CAM.fov keeps the fk fov). A tap during it skips it; hover preview waits for it.
- Daily challenge (v1.5, Défi du jour): a third title button (#goD, sky blue, own row). Day n = local calendar days since 2026-10-07 + 1. dailySet(n) (mulberry32 seeded n*7919+1789) gives 5 kicks: spot x ±9.5, z 18.5-28, the lier (kicks 2-5, 50%), the wall-jump roll jr and delay jd, so the setup and the wall's jump are the same for everyone; nerves and the keeper's guess stay random. G.daily rides on G.game 'fk' (startFk/fkPlan read G.dk[n]). The first finished run of the day is stored in localStorage 'la-lucarne:daily' {n, g, em}; later runs that day are practice (entraînement) and the end card also shows the official one. End card: coloured tiles with emoji (#dres: goal green, wall maroon, save gold, post grey, miss red; aria-label in words); Share sends 'La Lucarne · Défi du jour n°N · g/5' + the emoji row + the URL. The title button shows ✓ g/5 once done. Free-kick best (fkbest) ignores daily runs. Headless has no emoji font: the tiles show tofu there, real phones are fine.
- Replay (v1.4): every free-kick goal, 1.6 s after it lands, replays from behind the net (RP.pos at z -5.6, beside the target, fov 46 / 60 on tall screens) at 1/2.6 speed: G.rt is the replayed clock (kickT + (G.t - .35)/2.6), driving ballAt, the kick leg, the keeper's dive (diveState at G.rt) and the wall's jump (wallY(G.rt)); the ball runs into the net and bulges it once. A red ▶ RALENTI / REPLAY badge (#rp) blinks top left. Tap, Space, Enter or Esc skips (endReplay → next()). Penalties get none (too many kicks).
- Probe odds (v1.3, 300 kicks per spot): favourite over-the-wall curler 51-73% (with a lier 50-73%); low near-post shot under the wall, no lier: through 53%, goals ~22-27% before the keeper's x1.5 unsighted penalty; with a lier 0% (he stops 72-85%, the wall the rest); low far-post 19-25%.
- Probe odds (v1.2, nerves of the first kick): aiming the centre with no curl ~10-17% goals; average over all aims ~18-25%; the best (near-post corners curled round the wall, or over the wall into the near top corner) ~62-68%.

## Log
- v1.0 (2026-10-07 19:13 UTC): stadium, players, shootout, keeping, sound, FR/EN, share. Back net was slanted the wrong way in the first render (fixed: rotation.x = +atan2(GD, GH)); after a goal the ball bounced off the back net and rolled out of the mouth (fixed: G.inNet keeps it behind the line, side netting clamps x).
- v1.1 (2026-10-07 19:30 UTC): the tifo: before Payet's 5th kick, every sudden-death kick and on a win, the virage flips cards in a wave (34 m/s, left to right) into a hand-drawn 26x16 "10" (TIFO_10) in sky blue on white, with stripes out to the corners. A banner plane with the same bitmap sits just behind the cards so the seat gaps show the right colour; the crowd stops bouncing while it's held. Scoreboard: at most 6 dots per side (sudden death shows the last 5 plus the next), no empty placeholder after the end, smaller on phones. "Penalty shootout" kicker translated. Corner buttons stacked so the hint never covers them.

- v1.2 (2026-10-07 ~20:00 UTC): free kicks mode (Coups francs) with a jumping wall, spray foam, curl preview and a keeper cheating to the far post; title card has two buttons. First balance pass was far too easy (90% over the wall): lowered the arc, more nerves, wall outer man further out, keeper nearer the centre with a shuffle step.

- v1.3 (2026-10-07 ~20:20 UTC): under the wall: a man lying behind the wall on some kicks, low driven shots slip under a jumping wall, and each free kick opens on a side view of the wall. Pushedbutton scored 3/5 on v1.2.

- v1.4 (2026-10-07 ~20:30 UTC): slow-motion replay of every free-kick goal from behind the net, with a blinking RALENTI badge; tap to skip.

- v1.5 (2026-10-07 ~20:40 UTC): Défi du jour, five seeded free kicks a day, the same for everyone, first try counts, an emoji row to share.
- v1.5.1 (2026-10-07 ~20:55 UTC): daily streak (localStorage la-lucarne:streak {n, c}: an official run on day n-1 then n adds one; shown as 🔥c on the daily button and in the share text, 'série c jours' on the end card from 2), a countdown to local midnight on the end card (nextIn), and the replay button reads S’entraîner / Practise on daily end cards.
- v1.6 (2026-10-07 ~21:05 UTC): cobwebs in both top corners (WEBS: a 1.1 m plane each with a 256 px canvas cobweb (WEB_TEX: 7 thick spokes, 5 sagging rings, a misty veil; the 1 px LineSegments of the first try were invisible from the spot), opacity .9, at the bar/post joint just behind the line). A goal whose target is within .78 m of a post and above GH - .66 (isWeb) knocks that corner's web away (webKnock: it flies back, up, falls and fades over 1.3 s), the call reads LUCARNE ! / TOP CORNER!, the crowd jumps higher, and the daily row gets a 🕸️ tile (green with a gold ring). It tears again in the replay (webReset in startReplay, knock at the replay's net hit, webStep at replay speed). End cards count the game's lucarnes (websTxt). An 'Autres modes / Other modes' link under the end card's buttons goes back to the title (before, the only way to switch modes was a reload).
- v1.7 (2026-10-07 ~22:12 UTC): CORNERS, a third mode (title button Corners): five corners from alternating flags, pick near post / penalty spot / far post against a shuffled marking pattern, time the header on the closing ring, tap where to head it. Touchlines, corner arcs and two blue corner flags on the pitch. wallMan takes kit colours and a loose pose. Probe: perfect timing 6/9 goals (2 saves, 1 marker won it), +.12 s wide/post, -.2 s saved, -.45 TROP TÔT !, no tap TROP TARD !; 96-99 draw calls, 85k triangles at 1280x720.
- v1.7.1 (2026-10-07 ~22:22 UTC): corner goals get a slow-motion replay from beside the far post (the whole cross from the flag, the leap, the header into the net); the keeper no longer lies on the grass during a replay's lead-in (free kicks too).

## Issues
- Probing free-kick odds: let the game run at G.speed 60 for a moment first so the clock T is past ~2 s, otherwise `diveAt - tf` goes negative and the keeper never dives in the sim.
- G.speed (test hook) multiplies dt: a full 10-kick game runs in ~75 s headless at speed 4. But a probe polling every 20 ms can't time a keeper tap inside krun at 5 fps, so test dives through resolve() instead (a perfect, on-time dive saves ~90% of rival shots; one at 60% of the dive, ~11%).
- Headless frames are slow: probe the logic directly (`__LU.resolve`, `kick`, `over`, `rivalTarget`) and freeze with `G.hold = 1` for screenshots.
- Probe odds (v1.0): corner shots ~96% goal before the nerves, low/middle ~68%; keeping saves ~15-18% from a blind guess, more for a reaction dive.

## Todos
- Corners: live, the cross is on screen only for its last ~.5 s on desktop (the flag is ~35° outside the lens); goals now replay the whole whip (v1.7.1). A brief side camera for the live delivery is still an option.
- Free kicks: Elieutch's pick for a spot (the voice suggested dead centre, ~25 m).
- Ask Elieutch: free kicks or more of the shootout?
