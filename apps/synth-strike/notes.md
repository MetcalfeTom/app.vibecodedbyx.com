# Synth Strike

## log
- 2026-04-18: Created. 4-lane neon rhythm game with synthwave backing track. All audio via Web Audio (kick/snare/hat synthesized, detuned saw bass, detuned saw arp with dotted-eighth delay feedback, saw pad). BPM 104, progression Am–F–C–G over 2 bars each = 8-bar loop × 3 (~111s). Chart built procedurally per-bar: 4-on-the-floor kicks on lanes 0/1, snare-feel on lanes 2/3, bar-phase-varied syncopation fills. Timing windows: ±85ms perfect / ±165ms good / ±220ms miss. Approach time 1.6s. Count-in 4 beats. Grade S/A/B/C/D by accuracy. Canvas synthwave background: star field, sun semicircle with scan lines, perspective grid floor with exponential row spacing scroll, cyan horizon bloom. DOM-based notes + lanes (position via transform). Monoton + Audiowide + Share Tech Mono typography. D F J K + lane tap.

## issues
- Web Audio needs a user gesture on iOS/Safari; handled via Start button (initAudio + resume in startGame).
- Scheduler ticks every 25ms with 150ms look-ahead; any large main-thread stall could drop a hit. Keep main loop cheap.
- Notes spawn at the top of the .lane DIV and use CSS transform to animate down; hit line is at 82% of lanes container height (bottom:18%).

## todos
- Multiple tracks / difficulty select (Easy/Normal/Hard chart densities).
- Hold/long notes (schema supports `hold` class already; just need chart entries).
- Local best score per track.
- Screenshake + bigger FX at high combo streaks (milestone at every 25 combo).
- Sound: side-chain compression on pad so kicks pump visibly.

## design
- Palette: bg #0a0320, horizon #2a003f, hot #ff2975, cyan #00e5ff, violet #b47cff, yellow #ffd23a
- Fonts: Monoton (title / grade), Audiowide (score + pop text + key letters), Share Tech Mono (UI)
- Lane colors: 0 hot, 1 cyan, 2 yellow, 3 violet
- Background: canvas #bg fills the viewport, 60fps, layered sky/sun/grid/stars
- Hit bar: 4px gradient stripe with heavy glow at ~82% height
