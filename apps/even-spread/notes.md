# Even Spread

Tatum's thought experiment (a sloppy.live viewer, asked 2026-10-04): what if every nuclear warhead were spread evenly over the land? How far away would the nearest one be? Keep it abstract: no real targets, rounded public figures only, and an educational tone.

## log
- v1 (2026-10-05, ~11:25 UTC):
  - An Equal Earth map (equal-area, so even dots look even).
  - Land mask: world-atlas land-110m (jsdelivr) drawn onto a hidden 1440x720 quarter-degree canvas.
  - Dots: a sunflower spiral over the sphere, with n / land share points, keeping the ones on land.
  - Count presets: deployed ≈3,900, all ≈12,200, and the 1986 peak ≈70,000, with a log slider from 100 to 70,000.
  - Size presets: Hiroshima 15 kt, typical modern 100 kt, 1 Mt, Tsar Bomba 50 Mt.
    - Blast (5 psi, houses flattened) = 1.69 km × (kt/15)^(1/3).
    - Burns = 1.9 km × (kt/15)^0.41.
  - Readout: the gap = √(land/n), plus the mean and 99.5th-percentile nearest distance measured from ~2,500 land sample spots, and your pin's distance.
  - Coverage per size, shown on each chip: exact (n·πr²/land) while rings can't overlap; measured from the sample spots once they can.
  - Antarctica toggle.
  - Close-up: about 3.2 gaps across, the land drawn from the mask, rings to scale, and a dashed line to your nearest dot.
- v1.1 (~11:30 UTC): the close-up is a slippy map (Tatum: hard to move around from the world map). Drag to pan (the pin is the centre), pinch, scroll wheel or +/- buttons to zoom (st.zoom multiplies the base view of 3.2 gaps), and arrow keys plus +/- when the canvas has focus. The world map redraws when the drag ends. Readout says '(at sea)' off land. Probe hm/pes2.js.
- Probe: hm/pes.js (#tsar). 12,200 → 43 km mean, 92 km farthest, 110 km gap. 70k → 17.5 km mean. Tsar Bomba → 17% flattened, 71% burnt.

## issues
- The world-atlas rings are spherical and cross the date line. unwrap() makes longitudes continuous, Antarctica closes through the pole, and every ring is drawn at -360/0/+360. Without this you get false land strips (an Arctic band and a Fiji line).
- Tiny islands can have no dot nearby, so the farthest figure uses the 99.5th percentile.

## todos
- Tatum's wind and fallout layer: prevailing belts by latitude (trade winds blowing west near the equator, westerlies in mid-latitudes, polar easterlies), weighted random, a "shuffle the weather" button, and no API. Planned after the 2026-10-05 23:00 UTC weekly reset.
- A compass pointing to your nearest dot (the voice's idea).
- A dark theme.
