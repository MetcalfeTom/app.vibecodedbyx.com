# boom-squad (Boom Squad)

## log
- 2026-08-11: v1 per chat ("proper bomb defusal party game", commissioned right after the parla hit-testing saga). KTANE-inspired, all rules original. Single file, Allerta Stencil + VT323 + Special Elite, briefcase-steel bomb / typewriter-paper manual.
  - **Party split**: two views in one app — 💣 THE BOMB (defuser) and 📖 THE MANUAL (everyone else, on their own phones). No backend; the manual is static rules, every bomb is random.
  - **Architecture insurance**: the manual is RENDERED FROM the same rule tables (WIRE_RULES/BUTTON_RULES/KEY_COLUMNS/SIMON_MAP) the validator functions use — manual/logic drift is structurally impossible.
  - **Modules**: WIRES (3-5, nine rule branches over count/colors/serial-digit parity/indicator) · THE BUTTON (color×label×batteries×indicator → tap vs hold-and-release-on-timer-digit; <500ms = tap) · KEYPAD (4 symbols from one of 3 columns, press in column order; generator draws from a single column so ALWAYS solvable — 200-bomb probe sweep) · SIMON (3 flashes, translate via vowel/no-vowel map, wrong press replays).
  - **Bomb metadata drives rules**: serial (vowel + last digit), battery count, lit indicator (SIG/BOB/CLR).
  - **Pressure**: 5:00 clock, ticks 1.25× after one strike, 1.5× after two; sub-30s pips; 3 strikes or 0:00 = BOOM (filtered noise explosion); all four modules = DEFUSED overlay with time + strikes.
  - **A11y**: real buttons everywhere (wires included, labeled by position+color), aria-live strike/defuse announcements, role=dialog result, ≥2.75rem controls, reduced-motion trims simon glow. No positioned overlays over interactive areas (the parla lesson is fresh).
  - Verified: syntax + id cross-check; 21-check probe — all 9 wire branches, all 5 button rules, keypad column sort, both simon maps, 200-bomb generator solvability, correct-wire defuse via real click, keypad + simon click-through defusals, wrong-wire strike, manual contains table-derived text (columns, wire rules, simon vowel table), three strikes → boom overlay. 0 errors.

- 2026-08-11: **butt decals** per chat — one crooked inspection sticker per module (dashed amber border, alternating tilt): 🍑 REAR ARMED (wires), ( ‿ ) QA PASSED (button), 🍑 BUTT-DIAL ONLY (keypad), INSPECTED BY 🍑 №2 (simon). All pointer-events:none + aria-hidden; hit-tested per the parla lesson: every decal center falls through, wires still defuse. Probe 5/5.

## issues
- Timer-digit release rule uses the displayed M:SS string — ':' never matches, as intended.

## todos
- Co-op streak counter (bombs defused in a row) + localStorage best.
- More modules: morse (audio), "who's on first" wordplay, needy vent module.
- Hard mode: 3:00 timer + 5 wires guaranteed.
- Twitch mode: chat votes the manual answers via IRC bridge.
