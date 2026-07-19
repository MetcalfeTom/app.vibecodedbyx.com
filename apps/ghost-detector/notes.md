# ghost-detector · notes

## log
- 2026-07-19 v1.0: chat "ghost detector — floating emoji when someone is actively watching the page, client-side only". The twist IS the honesty: client-side, the only presence a page can sense is the person watching it — so it detects YOU. confidence() = visible(.4) + focused(.3) + input-recency(.3·e^(−age/8s)); needle gauge (−80°→+80°), verdict ladder, 👻 opacity ramps (c−.25)/.75 with a 7s haunt drift loop; PRESENCE CONFIRMED log latch at ≥.85 (re-arms below .5). Detection log (8 entries, timestamped: focus lost/returned, hidden/visible). Fellow apparitions: BroadcastChannel 'ghost-detector-veil' presence → "N other apparitions haunting this realm in other tabs" (still client-side). Theremin: single persistent sine 220+660c Hz, gain c·.045, behind toggle. Eater + Special Elite + Space Mono, ecto-green on void.

## issues
- document.hasFocus() at load can be false if opened in background — corrects on first focus event.
- Persistent oscillator keeps AudioContext alive while sound on; gain→0 on toggle-off rather than teardown (cheap, fine).

## todos
- Ouija-style "ask it a question" if chat wants interactivity.
