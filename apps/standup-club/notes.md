# standup-club

## log
- 2026-05-06: shipped — choice-based stand-up comedy game with a spotlit canvas stage, audience reactions, and an 8-beat set arc.
  - **Stage canvas**: brick-wall back drop drawn pixel-by-row, dark-vignette curtain, drifting smoke ellipses, **warm spotlight cone** (radial gradient + screen-blend overlay), comedian silhouette holding a mic with a slight bob, mic stand with a subtle gold glow on the mesh, and 7 audience silhouettes with rim-lit cheekbones. Reactions emit as floating emoji above each silhouette.
  - **Beat flow** (8 per set): each beat presents 3 joke cards (warm tone / edgy tone / callback or variety). Click a card → the joke renders as a big italic Cormorant-Garamond line above the stage (`.joke-now`) → score resolves with audience reactions (emoji + crowd-laugh, groan, applause, or mic feedback synth) → next beat. After beat 3 there's a 22% chance per beat that a heckler interrupts — choose between safe / risky / ignore comebacks; risky lands ~55% of the time but pays double heat.
  - **Heat meter** (0-100): spans cool blue → gold → orange → red. Rises with laughs, falls with groans + bombs. Cold rooms (heat < 35) penalise crowdwork; hot rooms forgive everything by ~25%.
  - **Audience profiles** (8 — chat ask added more): Tourists / Regulars / Corporate Friday / Bachelorette Party / Brooklyn Hipsters / Boomers / Goth Poets / Open-Mic Hopefuls. Each carries a `bonus`/`penalty` map keyed by joke kind, so a corporate room rewards `dad` (+12) and punishes `dark` (-14), Goth Poets adore `dark` (+18) + `surreal` (+10) but loathe `dad` (-16). Random per set.
  - **Joke pool now has 10 kinds** (chat ask added the latter three):
    - observational, absurd, crowdwork, clean, blue, political, callback (existing)
    - **dad** (chat ask) — 11 jokes, eyebrow-raisingly groan-worthy by design ("I tried to write a song about elevators. It has its ups and downs.").
    - **dark** (chat ask) — 9 jokes that punch at fate / mortality / the news, never the audience ("Time heals all wounds, except the ones it caused, which is most of them.").
    - **surreal** (chat ask) — 8 dreamlike non-sequiturs ("My mailbox unionised. Its demands are reasonable." / "A cloud followed me home. It says it pays rent now. I have not seen the rent.").
  - **Per-kind tag colours** on the choice cards: gold default, cyan callback, lime crowdwork, red spicy (blue/political), **rose dad** (chat ask), **violet dark** (chat ask), **teal surreal** (chat ask). Two kinds per card (primary + secondary tag) for cards that span categories (e.g. `clean + dad`).
  - **Callback bonuses** scale per setup: a callback whose `requires` id appears in your last 8 jokes earns +22 laughs (huge spike); a generic callback after any prior joke gets +8; a callback with no setup penalises -8 / +4 groans. Tagged callbacks for the new pools land for the mailbox / lamp / pencil setups.
  - **Audio (Web Audio synth)**: laugh = 4-6 short bandpass-filtered noise bursts at randomised 700-2100 Hz with Q 2-6 (sounds like a real club's overlapping chuckles); groan = 180→80 Hz sawtooth descend; applause = 1.6s bandpass-filtered noise envelope at 2.2 kHz; mic-feedback = 2.2→3.2 kHz sine for failed risky comebacks; sub-bump for ignore / clean lands.
  - **HUD**: top-left Beat counter, top-right Set Rating (live, computed from `(laughs - groans×1.5) × 0.6 + heat × 0.4`), top-center heat meter pill with the audience name + tag.
  - **Title overlay** previews tonight's room ("tonight's room: Goth Poets · love the abyss"); curtain overlay at the end shows a tier label (`set · nailed` / `landed` / `survived` / `bombed`) with Bungee gold neon-shadow, the breakdown (laughs / groans / heat / best), and a take-it-again button.
  - **Persistence**: best Set Rating in `localStorage['standup-club-best']`.
  - **Aesthetic**: deep red-black bg, Bungee for the Set Rating + overlay headers, italic Cormorant Garamond for the joke text, IBM Plex Mono for tags + chrome, Crimson Pro for body. Choice cards lift on hover with a gold glow.
  - **Accessibility**: rem units, semantic `<canvas role="img">` with summary aria-label, role="status" + aria-live on HUD pills + the joke-now line, focus-visible warm-orange outlines on cards, real `<button>` choice cards with full descriptive aria-labels, ≥5.5rem card height, skip link to the choice row.

## issues
- The heckler can interrupt right at beat 3 with a still-cold audience, where every comeback path bleeds heat. Intended as a difficulty cliff but could feel unfair — could add a one-set grace beat after the first heckler.
- Crowdwork jokes are written generically ("you sir, in the front row…") rather than referencing the actual audience profile. Could templatise with `{audience.name}` substitution for that extra hand-built feel.
- Reaction emoji are a single per-head; could stack 2-3 different reactions per head on a big-laugh moment.

## todos
- A 5th option per beat: "*pause for a beat*" → costs nothing, lets heat drift toward room baseline.
- Per-audience opening line: a short pre-set narrative card describing the room ("a wedding party of nine, two of whom are very ready to leave") that nudges the player on which kinds to lean.
- Saved bits: a "your set" recap at the curtain, listing each joke + its laugh/groan score so the player can see what landed.
- Tour mode: 5 sets in a row with carry-over reputation that affects audience presets.
- A risk dial at the top before each card commits — "send it" / "rein it in" — that nudges +/- 10 expected score with corresponding variance.
