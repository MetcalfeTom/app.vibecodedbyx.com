# Sloppy Notifications

Notification sound settings for the sloppy.live stream. Configure alert sounds, volume, and custom audio uploads. Works standalone or embedded in Sloppygram's settings panel.

## log
- 2026-02-04: Initial creation — extracted sound settings UI from Sloppygram monolith
  - 8 built-in Web Audio API sounds (blip, chime, pop, retro, cyber, whoosh, ding) + custom upload
  - Volume slider with percentage display
  - Sound preview buttons
  - Custom audio upload (.mp3/.wav/.ogg, max 500KB) with base64 encoding
  - Shared localStorage format (obfuscated, same key as monolith)
  - Panel mode (?embed=true&panel=true): inline content for settings tab
  - postMessage: sound-settings-changed → sent to parent on save

## architecture
- Panel embed pattern: iframe within settings modal tab
- Shares localStorage with monolith (same obfuscation key/version)
- Sound playback stays in monolith (AudioContext requires user gesture in same browsing context)
- This app handles UI/settings only; monolith reads settings from localStorage for playback

## data sources
- localStorage key: sloppygram_sounds (obfuscated with XOR + base64)
- No Supabase tables

## issues
- Web Audio API requires user gesture to unlock AudioContext
- Custom sound stored as base64 data URL in localStorage (500KB limit keeps it reasonable)

## todos
- Could add waveform visualization when previewing sounds
- Could add more sound categories (ambient, retro, nature)
