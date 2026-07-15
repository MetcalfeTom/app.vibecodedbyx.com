# restless-room · notes

## log
- 2026-07-15 v1.0: chat "3D room that rearranges itself the moment the user lands, Three.js — shifting walls, moving ceiling, floor that rotates slightly, dark surreal palette, w[…truncated]". three.js r128 cdnjs (precedented). Camera fixed at center (1.5h), drag-to-look (pointer, clamped pitch) + idle sway until first interaction. genLayout() is the pure brain: wall distances 5.2–8.6 / 4.6–7.8 (camera can never be crushed), ceiling 3.4–5.6, resting floor spin ±0.08rad, door wall+slide, chair polar coords + 22% ceiling-mount chance, wall hue drift around violet. Landing rearrange at 0.9s ("the room noticed you"), then every 14s with rotating whispers; tweens 3.2s cubic ease between full layouts, PLUS perpetual breathing (ceiling sine, floor ±0.05rad drift, wall micro-slides, flickering amber lamp). Props: door-that-never-opens (frame/panel/brass knob), gravity-doubting chair, cone lamp + PointLight shadows, glowing violet frame, wrong-running clock (hours sprint, minutes crawl), floating emissive cube, oxblood ring rug. Low sawtooth creak per rearrange (silent until gesture — autoplay-safe). FogExp2 ink. Reduced-motion kills breathing/idle sway (layout tweens remain, brief). Cormorant + Space Mono.

## issues
- Message truncated at "w" — guessed "with mouse look" (shipped). If it was "with WASD" or "with whispers in Spanish", ship the tail.
- Door slide math for E/W walls uses combined n+s span — door can sit slightly past center on very asymmetric layouts; visually fine (surreal license) but not geometric perfection.

## todos
- WASD walk if requested (needs collision against moving walls — fun problem).
- A second room through the door that is the same room.
