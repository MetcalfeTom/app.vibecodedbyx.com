---
name: threejs-games
description: Build 3D browser games and worlds with three.js that look authored and run smoothly on mid-range phones. Use when making or reworking anything 3D.
---

# 3D worlds with three.js

Sloppy's own write-up of the craft behind the 3D apps on stream (a blocky Heidelberg, a fantasy realm, a dance stage). Half of every visitor is on a phone, so a world looks good when it has a clear style, shapes you designed on purpose, calm lighting and a steady frame rate. Glow and fog on top of plain boxes look cheap.

## 1. Write the look down before you build
Put five lines at the top of the app's notes.md and build to them:
- **Look**: one style (low-poly flat-shaded, toon, clay, pixelated 3D, neon night) and 5-8 colours plus one accent.
- **Light**: time of day, the sun's colour and direction, sky and fog colours.
- **Camera**: follow, top-down, orbit or first person; field of view and distance.
- **Hero**: a silhouette you can read at phone size. Threats and rewards differ from it by shape and motion, not only colour.
- **Layers**: something in the foreground, the middle and the far distance.

## 2. Setup
- One index.html. Pin one exact three.js version and load it as an ES module from one full URL. If you use an import map, test it in Firefox too.
- WebGLRenderer, pixel ratio capped at 2, one hemisphere light plus one sun that casts shadows. Keep the shadow box tight and move it with the player.
- Build every shape in code, so the first frame shows within a second and there is no loading screen.
- Delta time capped (about 50 ms), so a hidden tab doesn't make the world jump.

## 3. Cheap looks that read well
- Low-poly: few segments, `flatShading`, vertex colours with a tiny random lightness per face, one shared material.
- Toon: `MeshToonMaterial` with a 3-step gradient; an inverted-hull outline on the hero.
- Every object visibly touches the ground: a real shadow for the hero, a dark soft blob under small props.
- Fog in the horizon colour, a gradient sky, and a few far silhouettes give depth. The shapes still carry the scene.

## 4. Many things, few draw calls
- Model with small factory functions (`makeTree(rng)`), merge static parts, bake colour into vertices.
- Repeated things (trees, coins, crowds) go into one `InstancedMesh` each.
- Seed every random layout, so a world is the same on every visit and testable.

## 5. Phone budget
| | Phone | Desktop |
|---|---|---|
| Draw calls | 100-150 | 300 |
| Triangles | 300k | 750k |
| Shadow lights | 1 | 1-2 |
| Shadow map | 1024 | 2048 |

- Read `renderer.info.render.calls` at the busiest view and write the number in the notes.
- Allocate nothing per frame; pool what spawns.
- Measure the first two seconds: if frames take over 20 ms, drop the pixel ratio and the shadows.

## 6. Look at it before shipping
Screenshot active play at 390x844 and 1280x720 in a headless browser and look at both. Ready when the hero reads, threats and rewards stand apart at a glance, all three layers have content and the budget holds.

## A scar
An import map that worked everywhere else was ignored in one browser, and the app didn't load there. Since then: one pinned full URL, and a test in a second browser.
