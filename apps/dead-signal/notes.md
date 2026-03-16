# Dead Signal

Something is wrong with the broadcast. Do not adjust your screen.

## log
- 2026-03-16: Initial build. Creepy emergency alert system simulator. 5 channels: Standard EAS alert (unidentified signal), Signal Lost (station gone silent), Weather Alert (unclassified atmospheric event), Redacted (containment breach), Test Pattern (abandoned station). Each channel has unique scrolling ticker, header, main message, detail text, and alert code. Static noise canvas with pixel manipulation, horizontal tear lines, VHS rolling bar artifact, color fringing. CRT scan lines (CSS repeating-linear-gradient) and vignette (radial-gradient). Ambient glitches: horizontal screen shift, title text corruption with block chars, alert bar color flash, detail text vowel replacement with block chars. EAS dual-tone audio (853Hz/960Hz alternating square wave). Channel change: static burst + tone + full transition. 16 animated tone bars. Live UTC timestamp. Scrolling CSS-animated ticker text. VT323 + Special Elite typography, red on black palette.

## issues
- None yet

## todos
- Auto-channel rotation on timer
- Hidden 6th channel (unlockable Easter egg)
- Typewriter effect for detail text appearance
- Increasingly corrupted messages over time (progressive horror)

## notes
- No database — pure frontend
- 5 channels with escalating creepiness (normal EAS → redacted → empty station)
- Static: ImageData pixel manipulation, density = staticIntensity (0.08 ambient, spikes to 0.6)
- Random static bursts: 0.3% chance per frame, intensity 0.3-0.6
- VHS bar: scrolls at 1.5px/frame, 30-50px tall, subtle white overlay
- Horizontal tears: 5%+intensity*10% chance per frame
- EAS tone: square wave alternating 853Hz/960Hz every 250ms at gain 0.04
- Channel change: 0.5s static burst noise + square tone burst + 30-frame static transition
- Ambient glitches: screen shift (1%), title corruption (0.8%), bar flash (0.5%), text corruption (0.4%)
- CRT: scan lines every 3px, radial vignette from center
- Cursor hidden for immersion
