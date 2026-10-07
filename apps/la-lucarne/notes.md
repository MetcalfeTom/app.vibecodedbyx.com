# La Lucarne

Penalty shootout at night at the Vélodrome. You shoot as Payet (10), then dive in goal for OM. Asked for by Elieutch (French viewer, OM fan) on 2026-10-07: "fais un petit jeu avec Payet le joueur de l'OM".

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

## Log
- v1.0 (2026-10-07): stadium, players, shootout, keeping, sound, FR/EN, share.

## Issues
- Headless frames are slow: probe the logic directly (`__LU.resolve`, `kick`, `over`, `rivalTarget`) and freeze with `G.hold = 1` for screenshots.
- Probe odds (v1.0): corner shots ~96% goal before the nerves, low/middle ~68%; keeping saves ~15-18% from a blind guess, more for a reaction dive.

## Todos
- Free kicks mode (Payet's speciality): a wall and curl.
- A tifo in the virage spelling 10, now and then.
- A goal replay camera.
- Ask Elieutch: free kicks or more of the shootout?
