# Gravity Clock

## log
- 2026-04-09: Initial build. Mechanical wall-clock aesthetic rendered entirely in canvas 2D. Wooden case with bezier wood-grain lines and brass moldings, brass rim clock face with Roman numerals + minute ticks + maker's mark, hour/minute/second hands reading real local time (smooth second hand via ms). Pendulum below face swings with `sin(t * 2π * 0.5)` giving a 1s half-period (1 tick per second). Six spinning gears in the case at varying radii/tooth counts/speeds/directions, drawn with tooth geometry + spokes + hub + radial gradient. Two falling weights (HOURS + STRIKE) slowly descend; "↑ Wind" button animates them back up. 1s tick sound via WebAudio square blip (unlocked on first click). Cormorant Garamond + Special Elite typography, brass/dark-wood palette.

## features
- Real-time clock driven by Date()
- Smooth second hand (ms-interpolated)
- 6 spinning gears with distinct speeds and directions
- 2 weights that slowly descend and can be wound back up
- Swinging pendulum synced to 1Hz
- WebAudio tick on each second
- Digital readout below the face
- Scales responsively to any viewport via canvas transform

## issues
- Wood grain + gear redraws on every frame; could cache the case to an offscreen canvas if perf is an issue on low-end devices
- Tick sound only unlocks after a user gesture (browser autoplay policy)

## todos
- Cache static case/face to offscreen canvas
- Chime on the hour (bell tone sequence)
- Skeuomorphic glass reflection on face
- Daylight vs night tint
- Escapement wheel visible behind the face
