# vibe-vault · notes

## log
- 2026-07-14 v1.0: chat request "build the Vibe Vault with seven collapsible sections from MarciPopsis's blueprint" — the blueprint itself never arrived in the terminal, so shipped an interpretation: seven vibe drawers (Chill/Hype/Melancholy/Cozy/Chaos/Focus/Dream), each an accessible accordion section (button + aria-expanded + aria-controls + role=region) holding a 5-swatch tap-to-copy palette (luma-aware chip text color), three italic "artifacts", a WebAudio chord button (per-vibe waveform + freqs, lowpass tamed for saw/square, gesture-unlocked by the click itself), and a local deposit box (localStorage vibe-vault-deposits-v1, 12/drawer cap, esc()'d on render). Art-deco vault aesthetic: Limelight + Cormorant Garamond + IBM Plex Mono, charcoal steel + brass, repeating-conic sunburst behind the title, dial glyph rotates 135° on open. Footer invites MarciPopsis to send the real section names for re-engraving. WCAG basics: rem-only, 2.75rem targets, focus-visible brass outlines, prefers-reduced-motion, aria-live toast.

## issues
- Deposits are per-browser only (localStorage) — if chat wants a SHARED vault, needs a supabase table (remember user_id on insert).
- The seven names are my interpretation, not MarciPopsis's blueprint. Standing offer in the footer to re-engrave.

## todos
- Re-engrave sections when/if MarciPopsis delivers the actual blueprint.
- Shared deposits via supabase, per-drawer counts.
- A "vault door" load animation (big dial spin) — high-impact page-load moment.
