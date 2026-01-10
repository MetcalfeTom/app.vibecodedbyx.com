# BLUE BOX 2600

## log
- 2026-01-10: Initial creation
  - Authentic DTMF tone generation
  - 2600 Hz phreaker tone
  - MF (Multi-Frequency) blue box tones
  - Waveform oscilloscope display
  - Retro monochrome cyan aesthetic
  - CRT scanline overlay
  - Keyboard support

## features
- Full DTMF keypad (0-9, *, #, A-D)
- Authentic dual-tone generation
- 2600 Hz "whistle" tone
- Blue box MF tones (KP, ST, KP2, etc.)
- Real-time waveform visualization
- Number display with frequency info
- Clear and Redial functions
- Keyboard input support
- Touch/mouse hold to sustain tone

## DTMF frequencies
Standard dual-tone multi-frequency:
- Row frequencies: 697, 770, 852, 941 Hz
- Column frequencies: 1209, 1336, 1477, 1633 Hz
- Each key plays two simultaneous tones

## Blue Box MF tones
- 2600 Hz: Trunk idle/disconnect signal
- KP (1100+1700): Key Pulse, start of number
- ST (1500+1700): Start, end of number
- KP2 (1300+1700): International
- ST' (900+1700): ST Prime
- ST2' (1100+1700): ST 2 Prime
- ST3' (700+1700): ST 3 Prime

## controls
- Click/Touch: Hold to play tone
- Keyboard 0-9, *, #, A-D: DTMF tones
- CLEAR: Reset display
- REDIAL: Play last sequence

## design
- Monochrome cyan neon aesthetic
- VT323 terminal font
- CRT scanline overlay
- Waveform oscilloscope display
- Glowing neon borders
- 2600 button in warning red
- MF buttons in magenta

## history
The 2600 Hz tone was used in the 1960s-80s
to signal trunk lines were idle, allowing
"phone phreakers" to make free calls.
Captain Crunch whistle, blue boxes, etc.
Modern phone networks use out-of-band
signaling, making these tones ineffective.

## todos
- Add tone sequence recording
- Add preset famous numbers
- Add MF digit tones (different from DTMF)
- Add red box coin tones
- Add spectrum analyzer view
- Add audio export
