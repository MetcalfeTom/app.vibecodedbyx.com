# Wolf Wall

Generative firewall art — digital wolves patrol logic gates in a living security mesh.

## log
- 2026-03-13: Initial build. Full-screen canvas generative art. Logic gates (AND, OR, XOR, NOT, NAND, NOR) as a network mesh with connection lines and data flow dots. Digital wolves patrol gate-to-gate with segmented bodies, ears, snouts, eyes, jaw animation, paw print trails, howl ring effects. Wolves react to threats: ears perk, eyes turn red, jaw opens to howl, concentric alert rings. Threat packets spawn from edges (probes = amber squares, malware = red spiky stars), wolves intercept and destroy them. Click anywhere to spawn threats and watch wolves react. Background data streams of binary/box chars. Gates pulse when wolves pass, flash red under threat. HUD shows packet count and wolf deployment. Major Mono Display + IBM Plex Mono typography, deep navy/cyan palette shifting to red on threats.

## issues
- None yet

## todos
- Sound: ambient hum, wolf howl audio
- Firewall breach event if too many threats pile up
- Wolf pack behavior (coordinate pursuit)
- Day/night cycle affecting gate activity

## notes
- No database — pure generative canvas art
- Gates placed on ~90px grid with random jitter, 55% fill rate
- Connections: gates within 150px, 60% chance
- Wolves: segmented body (8 segments), follow gate connections
- Threats spawn at ~2% per frame, wolves reduce threat.life on proximity
- Click spawns 3 threats + alerts nearby wolves within 200px
- Gate types drawn with distinct shapes (D-latch, curved OR, triangle NOT, etc.)
