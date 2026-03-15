# Vintage Radio

Tune an analog radio through static to find hidden lo-fi stations. Satisfying knobs on warm wood.

## log
- 2026-03-15: Initial build. Vintage wooden radio with SVG turbulence wood grain texture, glass reflection highlights, speaker grille with slats, frequency dial with tick marks. Two rotary knobs: Tune (frequency 88-108 MHz) and Volume. Power button with warm-up LED. 6 hidden stations at specific dial positions: Midnight Jazz (mellow chords with tremolo), Lo-Fi Dreams (bass + filtered pad), Deep Ambient (droning sine waves with slow LFO), Vinyl Beats (kick pattern + hi-hat), Ghost Signal (eerie filtered sawtooth), Warm Static (sine + filtered noise). Web Audio static noise through bandpass filter, fades as you approach stations. Dial needle follows tune knob. Station name fades in when tuned close. Speaker grille canvas visualization with sine wave rows that respond to volume. Warm center glow on speaker. Knob interaction: click-drag rotation, scroll wheel, touch support. Warm-up effect: audio fades in gradually after power on. Playfair Display + IBM Plex Mono typography, warm brown wood palette with amber accents.

## issues
- None yet

## todos
- AM/FM band switch
- Antenna that affects signal quality
- Record button to capture audio
- More station variety (news, classical)
- Tube glow animation visible through back panel
- Crackling vinyl noise layer on stations

## notes
- No database — pure frontend
- Audio: Web Audio API with oscillators, LFOs, bandpass filters
- Static: looped noise buffer through bandpass at 2000Hz
- Station width: ±0.025 on 0..1 dial range (~0.5 MHz band)
- Station signal: quadratic falloff from center frequency
- Static level: 0.3 * (1 - totalStationStrength * 0.85), min 0.03
- Knob rotation: atan2-based drag, maps ±135° to 0..1
- Warmup: 0.008 per frame, affects master gain
- 6 station types each built from different oscillator/filter combos
