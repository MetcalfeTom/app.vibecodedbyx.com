# neon-jelly-sandbox · notes

## log
- 2026-05-16: v1 — **verlet soft-body physics sandbox where every object is a wobbly neon jelly** per chat ask: "build a wobbly physics sandbox where everything is made of neon jelly." Shipped as a new app at `/neon-jelly-sandbox`.
  - **Engine**: pure canvas 2D, no libraries. Verlet integration (position-based: `new = pos + (pos - old)*damping + accel*dt²`) for stability. Each jelly is a mass-spring SoftBody: ring of perimeter points + central point connected via three spring layers: (a) perimeter springs `k=0.42` between consecutive points, (b) spoke springs `k=0.18` from each perimeter point to centre, (c) diagonal braces `k=0.06` between opposite points for shape memory. 3 spring-relaxation iterations per frame keep the network from exploding under load.
  - **4 shape modes**: **Blob** (16 evenly-spaced perimeter points), **Slime** (18 points with sin-based radial irregularity for a drippy outline), **Square** (16 points projected onto a square edge for a wobbly cube), **Star** (20 points alternating between 100% and 55% of the radius for spikes).
  - **Neon glow rendering**: each body is drawn as a closed bezier through midpoint-smoothed perimeter points (so the outline stays smooth even as the spring net distorts), filled with a radial gradient (95% → 55% → 5% alpha of the body colour) under `shadowBlur: 28` of the same colour, then stroked with a bright outline, plus a tiny rotated specular highlight ellipse for that gel look. Motion trail via per-frame `rgba(8,5,26,0.36)` fillRect over the canvas.
  - **12-colour neon palette**: hot pink, violet, cyan, lime, amber, coral, white, blue, red, mint, magenta, chartreuse. Swatches scale up + glow when active.
  - **Input**:
    - **Click** empty space → spawn jelly at cursor with current colour/shape/size
    - **Drag** any jelly → pin its centre point to the cursor and fling on release (the spring net + verlet velocity handles the throw naturally)
    - **Right-click** any jelly → pop with an 18-particle burst in its colour
    - **Spacebar** → SHAKE — every jelly gets a random ±6 horizontal + 4-12 upward impulse
    - **C** key → clear all
  - **Toolbar** (left): 12 colour swatches in a 6×2 grid, 4 shape buttons in a row, three sliders (Size 14-80px / Gravity -0.5 → 2.0 / Bounce 0-1), three action buttons (⚡ Shake / ☁ Rain / ⌫ Clear). All styled with the violet glassmorphism + tabular-numeric value readouts.
  - **Status pill** bottom-right showing live jelly count + FPS. Hint pill bottom-centre with the keybindings fades on first interaction.
  - **Rain action**: drops 14 jellies from above with staggered timing and randomised colours.
  - **Capping**: max 60 jellies — oldest gets culled when over.
  - **Floor friction**: `vx *= 0.95` on floor contact so jellies don't slide forever (the squash also accumulates so jellies look "settled" after landing).
  - **Audio (synth)**: triangle + sine plop on spawn with random pitch, square pop on right-click, sawtooth + sine thunk on shake. Resume on first pointerdown.
  - **Mobile**: pointer events work for touch (`touch-action: none`). Toolbar shrinks at 640px breakpoint.
  - **Seed**: 5 staggered jellies drop in on load so the sandbox isn't empty.
  - **OG image**: Pollinations flux seed 8181.

## issues
- Inter-body collision is simple centre-to-centre push apart — doesn't account for the deformed perimeter. Jellies sometimes overlap visually when squashed together. The spring net masks it most of the time, but a true SAT polygon collision would be more accurate (and slower).
- Sharp-angled shapes (Square / Star) can get tangled if you stack a lot of them — the diagonal braces help but aren't perfect.
- Trail effect via per-frame fillRect alpha is cheap but on extreme jelly counts (>40) the GPU shadowBlur draw cost dominates frame time.
- Inverted gravity (slider < 0) works but jellies can escape the ceiling if you push them hard while floating.
- Pop particles spawn at the body's last centre — if you pop a very-stretched jelly the burst origin doesn't match the visible silhouette perfectly.

## todos
- "Glue mode": click two jellies to spring them together permanently.
- A "wind" slider that adds a constant horizontal force.
- Confetti shape (many small jellies).
- Pull a jelly through a "pasta extruder" rect that turns it into a long noodle.
- Save/load arrangement to localStorage.
- A "freeze" button that pauses physics so you can pose them.
- Touch joystick for mobile so the keyboard shortcuts are reachable.
