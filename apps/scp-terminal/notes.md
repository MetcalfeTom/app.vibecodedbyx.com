# SCP Terminal

## log
- 2026-08-06 v1.1: **RAISA-4 chat** per chat — pure rules engine (`raisaReply(q, clearance)` → {lines, open}), zero-empathy persona by construction: number retrieval (opens file, class-first data line), class-of (data only), list <class>, how many, random, help; small-talk branches all dismiss in character ('GRATITUDE IS NOT INDEXABLE', empathy module = procurement decision). Typewriter render, opens files via r.open. Deliberately NOT an LLM (voice fits rules; offline-reliable; testable). +BUGS: **python heredoc \b → literal backspace \x08 in regexes** (4 chars, number parser dead — if a regex mysteriously never matches after a python patch, hexdump it); Date.now precedence nonsense in random branch. 33/33 checks.
- 2026-08-06 v1.0: new app per chat — SCiPNET terminal, search by number, **object class rendered before description** (explicit request; render order tested: class → containment → description). Redacted classified aesthetic: Staatliches + Courier Prime, scanlines, TOP SECRET stamp, class badges (Safe/Euclid/Keter/Thaumiel/Apollyon colors).
  - **Redaction engine** (pure): markup `⟦N|text⟧` (revealed at clearance ≥ N — below level, text is NOT in the DOM, only █ bars) and `⟦X⟧` = [DATA EXPUNGED], never revealed. Clearance buttons LVL1–4 re-render; **O5 = denial easter egg** (MTF dispatched overlay, clearance reset).
  - **15 curated files written in-house** (original phrasing, clinical voice): 173, 049, 096, 682, 999, 087, 106, 055, 914, 294, 3008, 426 (in first person, as it must be), 1471, 500, 131. **SCP-001** = fully expunged special. All other numbers 2–9999 get **deterministic procedural files** (hash32 → class weights 32/43/19/5/1%, template banks with embedded redactions, 'PROVISIONAL RECORD' watermark).
  - Recent-files chips, random button, Enter submits, keyclick/access/deny synth audio.
  - Tests: scp-test.js — 19 checks (curated integrity + lore, render ORDER, redaction reveal/expunge/escape, generator determinism + distribution, 001/invalid/override paths).
  - NOTE: all entry text is original fan-written material in SCP style; no wiki text copied (SCP wiki is CC BY-SA 3.0 — if we ever import real entries via scp-data.tedivm.com or Crom API, MUST add attribution + share-alike notice. Both probed reachable 200 from sandbox 2026-08-06.)

## issues
- Procedural nicknames occasionally collide with real SCP nicknames by chance — cosmetic.
- 4-digit input maxlength blocks SCP-XXXXX series by design (wiki has up to 8999+; raise cap if chat asks).

## todos
- Optional LIVE ARCHIVE mode via scp-data.tedivm.com JSON (CC BY-SA attribution footer required) — chat has asked about APIs; offered as A/B.
- Search by keyword across curated nicks.
- Print/export view (paper mode).
