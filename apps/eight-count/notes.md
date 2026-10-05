# Eight Count

A choreography tool for dance instructors: load a song, the beat is found, the song splits into eight-counts, and each count gets a move. A 3D toon dancer performs the routine on the beat. Asked for by pushedbutton (Twitch) on 2026-10-05, inspired by Harmony's 8-count window: "a 3D dancer with editable moves, beat matched to a song with a wave form. No need for a crate or playlist".

## log
- v1 (2026-10-05): three.js r170 by full URL (no import map). Toon dancer built from capsules (hips, spine, head, arms with elbows, legs with knees; the hips drop so the standing foot stays on the floor). 16 moves as pose functions of the beat phase, blended from the previous beat's end pose over the first 30% of each beat; "hold" repeats the last pose. Demo groove synthesized at 112 bpm (16 eights) with a showy demo routine. Load a song: decodeAudioData, then a tempo guess (bass-weighted onset envelope at 100 fps, comb over 70-180 bpm with a soft 118 bpm prior). Timing drawer: ÷2 ×2, tap tempo (sets the phase while playing), ±10 ms nudge, "move the 1". Waveform shows four eights around the one you edit plus a whole-song strip; tap to jump. Editor: 8 slots, tap a count then a move (auto-advances), copy to the next eight, repeat to the end, all bounce. Optional click track (accent on the 1). Saved per song (file name + rounded duration) in localStorage `eight-count-v1`. Paused: the dancer loops the eight you're editing.

## issues
- Tempo guess can land on half or double time, and the "1" can sit on the wrong beat; the timing drawer fixes both. Downbeat detection isn't attempted.
- Songs themselves are not stored (too big); load the same file again to get its routine back.

## todos
- Counts spoken aloud ("five, six, seven, eight") before the routine starts.
- Mirror view (dancer facing away, like a class following the teacher), speed control for practice (0.5×, 0.75×).
- More moves (grapevine, box step, slide, spin 2 beats), moves that span two beats.
- Export/share a routine as text.

## notes
- window.__EC exposes ST, MV, detect, poseAt, loadDemo, play, pause, seek, now for headless probes; window.DANCER.draw(pose) renders one frame.
- Probe hash must not be an element id (#play scrolled the page to the button); hm/pec.js uses #go.
