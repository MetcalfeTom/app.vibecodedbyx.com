# Timeline Stabilizer

Drag a slider to align fractured floating calendars and stabilize the timeline.

## log
- 2026-04-16: Initial build. Canvas-based puzzle game with floating calendar cards. Slider controls timeline stability — calendars drift chaotically when unstable, snap to grid when aligned. Hidden target zone per level, must hold slider in zone for ~1.5s to lock. Progressive levels: more calendars, tighter tolerance, longer hold time. Rising chime on stabilize, screen flash, particle bursts. Background stars, grid lines, central timeline beam. Progress ring with lock icon during hold. Instrument Serif + Fira Code typography, deep navy/purple aesthetic.

## features
- Canvas rendering with floating calendar cards (month, day, DOW, year)
- Slider controls chaos: calendars drift, rotate, and float when unstable
- Hidden target zone on slider — must find the sweet spot
- Hold mechanic: stay in zone for increasing duration to lock
- Progressive difficulty: more cards, tighter tolerance, longer hold
- Score with accuracy + time bonus × level multiplier
- Local best score in localStorage
- Visual feedback: calendar color shifts, border glow, grid alignment
- Progress ring with lock/unlock icon during hold
- Rising chime audio on stabilize
- Screen flash and particle bursts on completion
- Twinkling star background
- Screen shake proportional to chaos
- Touch and mobile support

## issues
- None yet

## todos
- Supabase leaderboard
- Multiple timeline themes (medieval, futuristic, prehistoric)
- Anomaly events (slider gets bumped, calendars scatter)
- Two-slider levels (X and Y axis alignment)
- Time pressure mode with countdown
