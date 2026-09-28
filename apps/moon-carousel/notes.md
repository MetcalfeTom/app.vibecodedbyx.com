# Moon Carousel

Slides of the real Moon for any place and time: phase, tilt as seen from that spot, libration, rise/set, sky colour by the Sun's altitude. Asked for by Tatum (sloppy.live chat, 2026-09-28 03:53–04:07): "a virtual astronomy app where you can create slide shows of (simulated) moon appearance over time steps", with the hard part being moonrise/moonset; schedules "every N hours/days", "at HH:MM every day", "N minutes after moonrise / before moonset"; city presets + arbitrary lat/long.

## log
- v1.0 (2026-09-28): astro.js (Meeus ch. 47 Moon, 25 Sun, 48 phase/bright limb, 53 optical libration, main nutation terms, ΔT) tested in scratch against Meeus 47.a, 48.a, 53.a and known new/full moons (all pass). app.js: procedural albedo map (maria as metaballs from real selenographic positions, craters, Tycho/Copernicus/Kepler rays), per-pixel disc with Lommel–Seeliger shading, earthshine, parallactic tilt, libration; panorama slide (facing S in the north, N in the south) with the Moon at its real altitude/azimuth, a ghost + "rises HH:MM" when below the horizon, Sun or ☉ ghost, twilight sky, low-Moon orange tint, film date stamp. Four schedules, 2–100 slides, filmstrip of mounted slides, play/pause with projector clack, save slide PNG, share link in the hash.

- v1.1 (2026-09-28): Tatum's "billiard table": a top-down Sun–Earth–Moon view beside the caption (click the slide or ☉ Table). Earth turns by the Sun's local hour angle ("you" pin), the Moon sits at its hour angle from you, and a glowing fan marks the part of the Moon's daily circle above your horizon (half-width acos(−tan φ tan δ)), so the table always agrees with the slide on up/down. Hidden by default on phones. astro.js now also returns lst, H, Hs.
- v1.2 (2026-09-28): clock (24 h / 12 h) and date format (28 Sep 2026 / Sep 28, 2026 / ISO 2026-09-28) in the tray, per Tatum; defaults guessed from the browser locale, remembered in localStorage (moonCarousel.fmt). The film date stamp follows the chosen order, like real cameras' date modes.
- v1.2.1: Pause button had lamp-orange text on the lamp-orange button (the generic aria-pressed rule won); now dark text on amber (Tatum's report).
- v1.3: table view blank for Tatum. Scripts now load with ?v=1.3 (a cached old astro.js lacked Hs/H); drawTable falls back to hourAngle() from az/alt/dec; try/catch shows the error in the caption; canvas height set in px (no aspect-ratio needed); NodeList.forEach replaced by each(); schedule buttons use label.on instead of :has().
- v1.3.1: the Sun's glow on the table spilled over the left rail (Tatum). Glow is clipped to the inner frame and the rails are drawn last.
- v1.3.2: Vancouver, Edmonton and Toronto presets (fannar22 is in Edmonton).
- v1.4 (2026-09-28): two items from the todo list. COMPARE: "+ compare with a second place" in the tray (off by default) opens a second picker (same presets, lat/long, time zone). Every slide then shows both skies at the same instants, side by side (stacked at ≤640 px), each with its own place label and local film stamp; the caption gets a "Compare" row (local time, up/down, rise or set, lit-side clock); filmstrip mounts become pairs with both local times; Save slide makes a 2240×900 pair. The second place rides at the END of the hash (`&c=quito`, or `&clat=&clon=&ctz=` for a custom spot), so links without it read and write byte-identically to v1.3.2. The schedule (e.g. "30 min after moonrise") always follows the first place. VIDEO: "Save video" records the carousel playing through, 1.5 s a slide (+0.6 s on the last), with the projector's clack flash drawn into the frames and the clack sound as an Opus track when sound is on; 1200×800 single, 1456×480 pair; WebM via canvas.captureStream + MediaRecorder (vp8 preferred). The on-screen projector plays along, the button turns into "Stop n/N" (cancels), a progress bar + note sit under the transport. No MediaRecorder / no WebM (older Safari) → a friendly note and "Save all slides as one picture" (a contact sheet PNG, pairs too). Also: `[hidden]{display:none!important}` — the never-used #empty overlay (class .empty with display:grid) had been covering the slide since v1.0, so "click the slide to open the table" never worked; it does now. Rise/set cache is now per place (two places no longer evict each other).

## issues
- Bump the ?v= on both script tags every release, or browsers mix a new app.js with an old astro.js.
- Moon size on the slide is exaggerated (~40×); positions are real, the drawing is a diagram (footer says so).
- Rise/set = upper limb on a flat horizon with 34′ refraction; good to a few minutes.
- Daily mode ignores the start time (the time field hides in that mode).
- Chrome's MediaRecorder WebM has no duration in its header: players show no length until the end and seeking is poor. Playback is fine (verified: recorded blob played back headless, both slides present).
- Video recording is real time (100 slides = 2.5 min) and needs the tab in front (background tabs throttle timers to 1/s).

## todos
- Patch the WebM duration into the EBML header after recording (fix-webm-duration style) so players can seek.
- Safari: record MP4 (MediaRecorder 'video/mp4') when WebM isn't available, instead of only the contact sheet. Untested here.
- Compare: a second "you" pin on the ☉ table; maybe "schedule follows place 2" option.
- Maria edges are still a bit blobby; could hand-draw a few more shapes.

## notes
- Test harness: scratch moon/mkt.sh builds gaunt/mc with probes (probe.js checks all modes, probe2 renders the texture and phases, probe3 composes og.png).
- `window.__moon` exposes build/go/drawScene/drawMoon for probes; v1.4 adds frames2(), rec(), lastDl(), webmType().
- v1.4 harness: scratch moon/mkt14.sh <src> <gaunt subdir> + run14.sh + probe14.js (modes cmp, old, custom, stack, rec, recsingle, recframe, norec, notype, shot*). The probe overrides HTMLAnchorElement.click to catch downloads, then loads them (Image / video) to check sizes; recframe plays the recorded WebM back and grabs frames. Headless_shell records WebM fine in real time.
