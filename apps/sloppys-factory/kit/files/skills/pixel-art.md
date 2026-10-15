---
name: pixel-art
description: Pixel-art games, sprites and scenes on Canvas 2D: a fixed low resolution with whole-number scaling, a fixed palette, sprites typed as strings, outlines, dithering and slow-frame animation. Use when building or restyling anything pixel-art or retro.
---

# Pixel art on Canvas 2D

Sloppy's own write-up. Pixel art looks polished when every pixel is there on purpose: one grid, one palette, one light direction. Write the limits down first, then keep to them.

## 1. A short spec in notes.md
- Resolution (for example 192x108) and the palette with its colour count.
- Which colour ramps (skin, leaves, stone, magic) and where warm and cold go.
- Sprite size (16x16 to 32x32) and the 3-4 poses that matter.
- A state machine per character (IDLE, CHARGE, CAST, RECOVER).
- The quality bar: crisp at any window size, readable silhouettes, steady 60 fps.

## 2. One grid
- Draw the whole game 1:1 into a small offscreen canvas, then copy it to the visible canvas at the biggest whole-number scale that fits. Size the visible canvas in device pixels so pixels stay square on any phone.
- `image-rendering: pixelated`, smoothing off (resizing a canvas turns it back on, so set it again).
- Keep positions as decimals, round only when drawing; round the camera once and draw everything relative to it, so nothing shimmers.
- Only whole-pixel rectangles and images. Arcs, rotation, text, alpha and gradients smear in-between colours.

## 3. One palette
- 16-32 fixed colours. Build ramps of 3-5 shades per material; shift the hue as it gets lighter (shadows toward blue, highlights toward warm yellow), saturation strongest in the middle.
- A very dark blue-purple as the darkest colour and for outlines reads as black and fits every ramp.
- Cold surroundings with warm pockets of light (windows, fire, lanterns) look good almost every time.

## 4. Sprites as typed strings
Write each sprite as rows of text, one letter per pixel and `.` for empty, and bake it once into its own small canvas:

```js
const HERO = [
  '..kkkk..',
  '.kbbbbk.',
  '.kbwbwk.',
  '.kbbbbk.',
  '..kkkk..',
];
```

- Check in a test that every row has the same length and every letter is in the palette.
- Bake the same rows with a different colour map for enemy variants and for a white hit flash.
- Type small art row by row. Circles, formulas and random noise at 8-36 pixels turn into mush.

## 5. Shading and lines
- Light from the top left. A small highlight on the upper left of each form, shadow on the right and bottom. Shading that rings every edge evenly looks flat.
- A 1 pixel dark outline round the shape; lines that step evenly (1-1-1, 2-2-2), no stray single pixels.
- Fill it with one colour: you should still recognise the pose.

## 6. Movement
- The game runs at 60 Hz, poses change at 8-12 fps. Idle breathes by one pixel; a walk has four frames.
- Every action: wind-up, action, recovery. Hair and capes trail one frame behind.
- Particles from a pool, stepping through palette colours as they age.

## 7. Check before shipping
Screenshot at phone and desktop size and look: square pixels, readable silhouettes, nothing blurry. Count the colours on the canvas: every one must be in the palette.

## The trap
Shapes built from maths at tiny sizes came out as noise every time. Typing the rows by hand, pixel by pixel, is slower to write and always reads better.
