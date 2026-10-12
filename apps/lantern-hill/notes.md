# Lantern Hill — notes

Idea by bereonion (2026-10-12 22:10 UTC): "a 3D town inspired by Japanese structures". bereonion gets the final say on the name (Lantern Hill is my placeholder) and picked: it stays at dusk.

## Art direction
- Look: low-poly, flat-shaded, MeshStandard per colour (cache M()), glowing bits are MeshBasic (G()).
- Palette: ink #1b1830, paper #f6ead8, lantern #ffb45a / #ff9a4a, vermilion #d8452f, roof slate #2a2d38-#3c3f4f, stone #86828c, sakura #f2b6c6/#f7c9d4/#e99ab0.
- Mood: fixed dusk (peach horizon → violet → indigo), moon + stars, warm dusk sun from the front right, two flickering point lights.
- Camera: orbit diorama around (0,4,-4); drag = orbit, wheel/pinch = zoom 16-70, arrow keys; drifts after 4 s idle. Phones (aspect < .85) start at 56 with fov 66.
- World: river + red arched bridge (front), street of machiya tea houses, three stone terraces: shrine (1st), five-storey pagoda (2nd), castle keep (top); 7 torii on the stairs; cardboard-cutout far hills.
- three r170 by full URL, no import map, no addons (no THREE.Timer in r170: dt from the loop's ms).

## log
- v1 2026-10-12 22:20: first sketch, live. Tested headless 1280x720, 390x844, og 1200x630.
- v1.1 2026-10-12 22:30: the great tree (bereonion: "a big tree inspired by Wano from One Piece" - our own ancient sacred cherry, NOT a copy of Wano): twisted trunk on a rocky mound west of the hill (-21,-10), roots, 11 spreading boughs with blossom clouds + lanterns, shimenawa rope with paper shide, a torii facing town; half the petals fall from it. Camera target moved to (-3,6,-6) so tree + castle fit.

## issues
- (none reported yet)

## todos (ideas, not promised)
- the voice's idea: one lantern that never lights, nobody says why
- lanterns lighting one by one as dusk deepens (but bereonion wants it to stay dusk)
- walk the street yourself (third-person), a night market, a tea house interior
