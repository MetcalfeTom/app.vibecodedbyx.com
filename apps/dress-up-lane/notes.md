# Dress-Up Lane

pochinia's idea (2026-10-10 04:55 UTC, "make a mini dress-up game for the whole gang"): the neighbours of Fairylight Lane on a little stage, one wardrobe, Mewo judges every outfit.

Art direction: one 400-box canvas, a night dressing room (plum wall with soft stripes, rose curtains, a fairy-light string, round wooden podium, warm spotlight). Fonts Mochiy Pop One + M PLUS Rounded 1c, the lane's night palette. Thick ink outlines (about 6 px on stage, scaled with LWF), soft gradients, chibi proportions. Characters drawn with code copied from Fairylight Lane / Nero's House / Bunny Post / Window Loaf, adapted to take parameters; if a sibling changes a look, copy it over by hand.

## log
- 2026-10-10 05:07 UTC v1: five models (Wan-kun sitting, Mewo loaf, Bnuy full height, Nero bust in a hoodie, Poppo big in profile), 3 slots (hats 9, neck 4, face 5), tap again or "take it all off" to remove, 🎲 surprise me. Clothes are drawn in "head units" (head half-width 34) at each model's anchor in A (x,y,u,top,ey,edx,ny,nw, side=profile for Poppo: single-lens glasses). Mewo judges from a cushion in the corner: says a low paw score out loud, the fansub subtitle under the stage says what she means (5 paws); SPECIAL combos (Wan beanie/cat ears/halo, Poppo top hat/monocle, Nero halo/scarf/cat ears, Bnuy crown/santa). When Mewo is the model, Wan-kun is the guest judge. Each model reacts in its own bubble. Bnuy's red mail cap and Wan-kun's bow come off when a hat goes on. Outfits saved in 'dress-up-lane' {o:{w:{h,n,f},...},cur}. Wan-kun's beanie syncs with Wan Wan Pup ('wan-wan-pup-hat'): he arrives in it and refuses twice before it comes off (and taking it off here removes the key there). Names from the sibling apps' storage, Mewo's coat from 'window-loaf'. Keys 1-5 pick a model, arrows on the focused canvas. Desktop: stage left, wardrobe right (>=860 px wide). Tested headless 390x844 + 1280x720, all 5 models x 2 outfits in a grid probe, 0 errors.

## issues
- emoji in buttons render as boxes in headless only.
- the og image shows slivers of the judge cushion at each slot's left edge.

## todos
- 📸 group photo: all five in their outfits on the snowy lane, saved as a PNG.
- more clothes (Nero's long purple scarf is the scarf; maybe a winter coat slot, earmuffs, a cape for Poppo).
- show the outfits on Fairylight Lane itself.
