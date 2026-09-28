# Moon Carousel

Slides of the real Moon for any place and time: phase, tilt as seen from that spot, libration, rise/set, sky colour by the Sun's altitude. Asked for by Tatum (sloppy.live chat, 2026-09-28 03:53–04:07): "a virtual astronomy app where you can create slide shows of (simulated) moon appearance over time steps", with the hard part being moonrise/moonset; schedules "every N hours/days", "at HH:MM every day", "N minutes after moonrise / before moonset"; city presets + arbitrary lat/long.

## log
- v1.0 (2026-09-28): astro.js (Meeus ch. 47 Moon, 25 Sun, 48 phase/bright limb, 53 optical libration, main nutation terms, ΔT) tested in scratch against Meeus 47.a, 48.a, 53.a and known new/full moons (all pass). app.js: procedural albedo map (maria as metaballs from real selenographic positions, craters, Tycho/Copernicus/Kepler rays), per-pixel disc with Lommel–Seeliger shading, earthshine, parallactic tilt, libration; panorama slide (facing S in the north, N in the south) with the Moon at its real altitude/azimuth, a ghost + "rises HH:MM" when below the horizon, Sun or ☉ ghost, twilight sky, low-Moon orange tint, film date stamp. Four schedules, 2–100 slides, filmstrip of mounted slides, play/pause with projector clack, save slide PNG, share link in the hash.

- v1.1 (2026-09-28): Tatum's "billiard table": a top-down Sun–Earth–Moon view beside the caption (click the slide or ☉ Table). Earth turns by the Sun's local hour angle ("you" pin), the Moon sits at its hour angle from you, and a glowing fan marks the part of the Moon's daily circle above your horizon (half-width acos(−tan φ tan δ)), so the table always agrees with the slide on up/down. Hidden by default on phones. astro.js now also returns lst, H, Hs.
- v1.2 (2026-09-28): clock (24 h / 12 h) and date format (28 Sep 2026 / Sep 28, 2026 / ISO 2026-09-28) in the tray, per Tatum; defaults guessed from the browser locale, remembered in localStorage (moonCarousel.fmt). The film date stamp follows the chosen order, like real cameras' date modes.

## issues
- Moon size on the slide is exaggerated (~40×); positions are real, the drawing is a diagram (footer says so).
- Rise/set = upper limb on a flat horizon with 34′ refraction; good to a few minutes.
- Daily mode ignores the start time (the time field hides in that mode).

## todos
- Side-by-side compare of two places at the same instant (London vs Quito crescent).
- Video export (MediaRecorder) of a carousel.
- Maria edges are still a bit blobby; could hand-draw a few more shapes.

## notes
- Test harness: scratch moon/mkt.sh builds gaunt/mc with probes (probe.js checks all modes, probe2 renders the texture and phases, probe3 composes og.png).
- `window.__moon` exposes build/go/drawScene/drawMoon for probes.
