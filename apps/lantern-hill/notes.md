# Sakurahime (folder lantern-hill) — notes

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
- v1.2 2026-10-12 22:32: bereonion: "make it swallow the whole sky", then "a weeping tree that surrounds the city" + "background needs more work" + "the floor is rectangular". The beside-the-hill tree is gone; now ONE colossal weeping cherry: trunk at (-2,-40) behind the castle, crown = 900 instanced clumps on a spherical cap (R 67.6, centre y -17.6, rim 50 at y~30) over the whole town, 120 hanging strands round the rim (instanced, stretched 1.7 in y), 10 boughs, shimenawa, 6 big lanterns in the crown. Ground = round island (r 36, centre z -6) in two extruded halves cut by the river, lake disc r 260 round it, 3 mountain ranges (78/118/165) + 2 mist rings. Camera dist 14-42 so it stays inside the curtain. Canopy/trunk castShadow off (else the town sits in shadow).

- v1.3 2026-10-12 22:38: bereonion: "some in the middle also" + "more difference in sizes": strand(rr,a,bottom,size) helper; rim strands 0.5-1.2 or 1.5-2.1, some end high; 60 inner strands inside r 28 (the camera circle is ~38, so none hang in front of the lens), off the street (|x|<5 skipped), ending above the rooftops (+15 over the hill).

- v1.4 2026-10-12 22:42: bereonion named it **Sakurahime** ("cherry blossom princess"; asked for a name with cherry). Title/h1/meta/og renamed; the folder stays lantern-hill so the posted links keep working.
- v1.5 2026-10-12 22:47: moon window (bereonion: "i cant see any moon ngl"). MOON_A = -2.38 (left of the castle from the start view), moon y 27 at r 170 + halo + a silver path on the lake; rim strands skip offMoon(a) < 0.3, mountains skip < 0.32; inner strands r 6-22 and thinner. Note: changing rnd() use reshuffles every random thing after it.
- v1.6 2026-10-12 22:50: stairs rebuilt as three flights (ground→3.2→6.4→9.6) running up the terrace fronts with landings, stone cheeks and 7 torii on them; the old straight ramp was mostly buried inside the terraces (bereonion: "hard to climb"). The street's 4th house pair (z -1.7) sat inside tier 1 (bereonion: "a house inside the mountain"): moved to (-18.5, 8.5) and (18.5, 9), same number of house() calls so rnd stays in step. Terrace front faces: tier1 z -0.78 top, tier2 -5.54, tier3 -9.82.
- v1.7 2026-10-12 23:01: night market (bereonion: "a little market"; "dumbbells"). MK = (21, -6.4) on the meadow east of the hill: 10 yatai stalls facing a stone lane (takoyaki, goldfish tub with swimming fish, candy apples, yakitori with glowing coals, masks, the strongman's dumbbell stall at the entrance (he curls one), lanterns, taiyaki, ramune, kakigori), 6 lantern strings, red entrance arch, 9 people in yukata (2 stroll the lane), steam puffs, pl3 point light. Own seeded mr() so rnd() order is untouched (petals come after it anyway). marketTick[] runs in the loop. Test camera: a close.html copy with camera.position.set + lookAt after the loop's lookAt (never live).
- v1.9 2026-10-13 01:30: nothing inside the rock (bereonion: "the mountain still has 2 houses stuck in the middle of the mountain inside the rock"). The shrine (first terrace) and the pagoda (second) were hand-placed half inside the NEXT drum up (shrine 1.6 m deep, pagoda 1.4 m), plus a stone lantern and two terrace cherries. Root cause = hand-picked coordinates that ignored the next drum's wall. Now: HILL/tiers moved up top + rockDepth(x,y,z) (exact 10-gon frustums), ledge(k, az, f) = a seat on terrace k's open ring (f 0 = next drum's foot, 1 = rim), clearOfRock() slides any footprint straight out from the hill until clear; house() runs every house through it (no current house moves). Shrine at az -1.0 (scale .92, faces out) with stone lanterns either side, pagoda az 1.5 on tier 2, cherries on ledges; same rnd() call order. Also: the shrine's two lanterns were NaN (lantern() got the group as its size) - lantern() takes a parent now; the moss tops sat 0.02 under the drum tops and never showed - raised to h+0.22. Tested: in-page probe (buried.js: every mesh vertex vs rockDepth) 0 meshes inside the rock (was 27), no console errors (4 NaN errors before), shots 1280x720 from Town/Shrine/Castle/west/east/back + 390x844.
- v1.8 2026-10-12 23:08: place buttons (Town / Market / Shrine / Castle / Moon) fly the camera; view has tx now (was a fixed -3), goTo() takes the short way round in yaw and holds 6 s before the idle drift; phones <=460 px hide the emoji, one row, title lifted to 74 px. Headless has no emoji font (tofu in screenshots only).

## issues
- 2026-10-12 22:33: a python splice used a non-unique end anchor ('const pinks' also in sakura()) and duplicated half the file; the live page was broken ~1 min. chk.py printed 'syntax BAD' but EXITED 0, so the && chain went on. Edit a scratch copy, grep chk's output for 'syntax ok', then copy to live.
- (none reported yet)

## todos (ideas, not promised)
- the voice's idea: one lantern that never lights, nobody says why
- lanterns lighting one by one as dusk deepens (but bereonion wants it to stay dusk)
- walk the street yourself (third-person), a night market, a tea house interior
