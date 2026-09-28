# Black Hole Billiards

Pool on a table in space: planets and stars bend shots, pockets are black holes. Tatum's idea (sloppy.live user), 2026-09-28.

## log
- v1.0: 7 tables (Flat Space, Pale Moon, Binary Stars, Asteroid Belt, Gas Giant, Slingshot, Event Horizon), par + stars, best shots in localStorage (bhb.best), slingshot drag aim with a gravity-bent preview (first 330 units, ghost ball at first contact), keyboard aim (arrows, space twice), portrait phones rotate the table 90°, WebAudio clacks and gulps (bhb.snd).
- v1.1: table 8 Moon Cue (Tatum): the cue ball has gravity (cueM 3e6) and tugs balls it passes; dotted ring shows its reach (sqrt(cueM/MUS)). Tugged balls carry b.ex so move() doesn't put them back to rest.
- v1.2: longer aim preview (620 units on tables 1-4, 420 after) after Tatum found the gravity learning curve steep.
- v1.3: danger hum: a low tone that rises in pitch and volume as the moving cue ball nears a black hole (inspired by fannar22's projector-booth alarms). sfx exported on window.__bhb for probes; probe hash hum=1 samples the gain.
- v1.4: combo pops (Tatum): 2+ balls in one shot shows neon DOUBLE! / TRIPLE! / QUADRUPLE! / SUPERNOVA! / BIG BANG! near the pocket with a rising chime. Probe hash pop=1 forces a double.

## issues
- Resting balls ignore gravity until hit (static friction MUS=420). When placing balls, keep |g| < MUS at every spot; the probe prints gmax per table.
- Balls touching a planet drop the inward pull (move()), otherwise they jitter forever and the turn never ends. Turns are also capped at 22 s.
- `.panel[hidden]` needs its own display:none because .panel sets display:grid.

## todos
- A drifting moon that moves only while balls roll.
- Two-player hot seat.

## notes
- World is 1000x500 with 46-unit rails; view() rotates for portrait, toWorld() inverts it.
- Headless: SP/bhb/mkt.sh + probe.js (hash lv, ang, pow). Probe prints rest (balls awake at load, should be all 0), gmax, and one test shot per table.
