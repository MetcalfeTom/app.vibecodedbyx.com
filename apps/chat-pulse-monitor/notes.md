# Chat Pulse Monitor

Real-time oscilloscope visualization showing the heartbeat of sloppy.live.

## Log
- 2026-01-28: Initial creation with ECG waveform, multi-table monitoring, retro terminal aesthetic

## Features
- Canvas-based oscilloscope with ECG-style waveform
- Glowing green heartbeat animation on each message
- Screen flash pulse effect
- Real-time Supabase subscriptions to:
  - sloppygram_messages
  - sloppygram_posts
  - word_bricks
- Stats panel: total pulses, peak rate, last pulse, uptime
- Recent signals list showing latest messages
- Messages per minute (BPM) counter
- CRT scanline overlay effect

## Technical
- VT323 monospace font for retro terminal look
- requestAnimationFrame for smooth 60fps rendering
- Wave decay with noise for organic feel
- Multi-channel Supabase subscriptions

## Aesthetic
- Medical monitor / oscilloscope theme
- Green phosphor CRT style
- Scanlines and glow effects

## Issues
- None yet

## Todos
- Add audio beep option on pulse
- Consider adding frequency analysis view
