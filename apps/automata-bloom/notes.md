# automata-bloom

## log
- 2026-06-02: initial build. **Glowing multi-rule cellular-automata canvas.** Paint life with the mouse, pick a rule + palette, watch patterns bloom and decay with smooth heat-trail color.
  - **8 rule-sets** in B/S notation: Conway's Life (B3/S23), HighLife (B36/S23), Day & Night (B3678/S34678), Seeds (B2/S — explosive), Maze (B3/S12345), Coral (B3/S45678), Gnarl (B1/S1 — fractal ripples), Mazectric (B3/S1234). Toroidal (wrap-around) neighbor counting.
  - **Heat-trail rendering**: each cell holds a `heat` float that rises fast (×0.55) when alive and fades slow (×0.10) when dead — gives smooth glowing trails instead of hard on/off pixels. Heat 0..1 → 256-entry color LUT.
  - **6 palettes** (cosine-smoothstep gradients between 5 stops): aurora, ember, orchid, lagoon, sunset, mono. Cycle with the swatch button or `n`.
  - **Bloom**: renders the cols×rows offscreen grid scaled up crisp, then a second `globalCompositeOperation='lighter'` blurred(4px) pass at 0.5 alpha for the neon glow.
  - **Controls**: play/pause, single step, ✦ seed (random 18% density), clear, palette cycle, speed slider (1-30 steps/sec, fixed-timestep accumulator capped 4 steps/frame), brush slider (1-12 radius). Drag to paint, shift-drag or right-drag to erase. Keyboard: space play/pause, c clear, r randomize, n palette, s step.
  - **CELL = 6px** logical grid; resize preserves existing cells. Live `gen N · M alive` readout top-left (throttled to every 6th frame).
  - **Aesthetic**: deep-void background with cyan/magenta corner glows, Major Mono Display title with cyan neon shadow, glassmorphism control dock (backdrop-blur 20px + saturate 150%), JetBrains Mono labels, cyan→magenta gradient play button + sliders.
  - **A11y**: rem-everywhere, role=radiogroup on rules + aria-checked, aria-label on canvas describing interaction, focus-visible gold outlines, prefers-reduced-motion respected, sliders labeled.
  - Single self-contained ~22KB HTML, zero deps.

## issues
- The O(cols×rows×9) neighbor scan per step is the bottleneck; on a 4K display (~640×360 cells = 230k) at speed 30 it can dip below 60fps. Could switch to a typed-array sum-of-rows convolution or a bit-packed life kernel if perf complaints arise.
- Blur bloom pass uses `ctx.filter` which is slower on Firefox; acceptable for now.

## todos
- Save / load patterns to localStorage (named slots)
- Drop-in classic patterns (glider, gosper gun, pulsar) from a menu
- Hex / triangular neighborhoods
- Click-drag to PAN + zoom for a larger-than-screen world
- Audio: map alive-count to a drone, births to soft clicks
