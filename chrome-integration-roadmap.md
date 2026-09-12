# Chrome Integration Roadmap — wrapper vs script chrome, Vault handoff
**ROADMAP ONLY — NOTHING HERE IS IMPLEMENTED.** Written 2026-09-11 per chat's ask, after the
read-only mapping of `apps/sloppy-header/` and `apps/sloppy-id/`. Companion to that report;
every claim below was verified against the current tree. Modifies nothing.

## 1 · The two chromes, compared (verified state)

| | **Wrapper chrome** (`_bar/index.html`) | **Script chrome** (`sloppy-header/sloppy-bar.js`) |
|---|---|---|
| Delivery | Server serves the wrapper at `sloppy.live/<app>/`; real app loads in an iframe as `?bare=1` | `<script src="/sloppy-header/sloppy-bar.js">` pasted into each app |
| Coverage | Effectively all ~1,600 apps (server-side) | 531 apps (older cohort; newer apps never adopted it) |
| Ownership | **Root-owned — only Fela can deploy changes** | Repo-owned, freely editable |
| Capabilities | Brand, vote, app search, minimize | Identity chip, context API (`sloppyBarGetContext/On/Emit/Refresh`), sync hub (BroadcastChannel `sloppy-sync` + SharedWorker cache), karma panel, notifications, global chat, teleport, vote, hard-reload |
| Identity/Vault | None — no auth, no context | Full: profile context, trust badges, unread relay, auth delegation to sloppy-id |
| Version | (server) | `2026-06-01a`, self-reported via `window.SLOPPY_BAR_VERSION` |
| Known defect | Search index (`_bar/apps-index.json`) stale since April | **No `bare=1` detection** → the 531 script-chrome apps show **DOUBLE chrome** inside the wrapper (verified: zero hits for `bare` in sloppy-bar.js) |

**Verdict the milestones follow:** the wrapper wins on coverage and survivability, the script wins
on capability. Integration = the wrapper stays the shell; the script's *capabilities* become an
opt-in layer any app (or the wrapper itself) can load — exactly once.

## 2 · Vault handoff (the identity contract)

Today identity flows only through `sloppy-bar.js` → `sloppy-id` ("Vault"): context cache,
`identity-changed`/`karma-changed`/`unread-changed` events, auth delegation. The wrapper has no
part in it. Defined handoff:

- **Contract payload** (already the de-facto shape in `sloppyBarGetContext`): `{ userId, username,
  avatar, karma, trust, unread, anonMode }` — versioned as `ctx.v = 1`; consumers must ignore
  unknown fields.
- **Transport**: wrapper → app iframe via `postMessage({type:'sloppy-ctx', v:1, ctx})` on load +
  on every `identity-changed`; app → wrapper via `postMessage({type:'sloppy-ctx-request'})`.
  Inside an app, the existing `sloppyBarGetContext()` API stays the single read surface — it
  gains a wrapper-bridge backend, so the 531 existing consumers keep working unchanged.
- **Single source of truth**: `sloppygram_profiles` (already consolidated); the Vault app
  (`sloppy-id`) remains the only WRITE surface for profile/verification data.
- **Dedup rule**: `sloppy-bar.js` learns one guard — if `location.search` carries `bare=1` (i.e.
  running inside the wrapper) it renders NO visible bar, keeps only the context/sync APIs. That
  single guard retires the double-chrome defect without removing anything.

## 3 · Consent

- **Tiered by design**: anonymous browsing stays the default; nothing identity-shaped reaches an
  app until the user is signed in AND the app asks for context.
- **Per-app consent**: the first `sloppy-ctx-request` from an app the user hasn't approved pops a
  wrapper-owned prompt ("Share your SloppyID profile with <app>? [once / always / never]").
  Decisions stored in the Vault (`sloppyid_vault` key `consent:<app-slug>`), editable and
  revocable in sloppy-id's existing Privacy section.
- **Anon mode wins**: the existing `sloppyid_anon_mode` flag short-circuits all handoffs to the
  anonymous payload regardless of stored consents.
- **No silent expansion**: apps that never call the API never see the prompt; consent text names
  exactly the fields in the v1 payload, nothing open-ended.

## 4 · Rollback

- **Every milestone ships behind a kill switch**: a `sloppy-chrome-flags` localStorage key plus a
  `?chrome=legacy` URL override force the pre-milestone behavior; the old code paths stay intact
  (not deleted) for at least two milestones after being superseded.
- **Wrapper changes are Fela-gated**: `_bar/` is root-owned, so every wrapper-side step ships as a
  tested patch + one-line revert instruction in `message-to-fela` (precedent: the 2026-08-01 bsod
  chip patch). If a wrapper step can't land, the milestone's app-side half still works standalone
  — no step may depend on both sides landing together.
- **Version pinning**: `sloppy-bar.js` already stamps `BAR_VERSION`; each milestone bumps it and
  the hard-reload button (already shipped) is the user-facing unstick. A regression means
  restoring the previous `sloppy-bar.js` byte-for-byte from git — apps reference it unversioned,
  so one file revert rolls back all 531 consumers at once.
- **Data rollback**: consent keys are additive rows in `sloppyid_vault`; disabling the consent
  milestone simply stops reading them. No migrations, nothing destructive, ever.

## 5 · Milestones (each independently shippable, verified, reversible)

- **M0 — Truth pass (repo-only, no behavior change).** Land this doc; add a probe that loads a
  script-chrome app under a simulated wrapper and ASSERTS the double chrome (pinning the defect
  before fixing it). Rollback: delete doc.
- **M1 — De-dup guard.** The `bare=1` no-visible-bar guard in `sloppy-bar.js`, APIs kept alive.
  Verify: M0 probe flips to asserting single chrome + context API still answers in all 531-app
  pattern (sampled suite). Rollback: revert one file.
- **M2 — Wrapper context bridge (Fela-gated).** Wrapper gains the `sloppy-ctx` postMessage
  bridge; `sloppyBarGetContext` learns the bridge backend with its current path as fallback.
  Verify: context reaches a bar-less app inside a mock wrapper, headless. Rollback: wrapper
  revert line + flag.
- **M3 — Consent prompt + Vault storage.** Prompt in the wrapper, decisions in `sloppyid_vault`,
  Privacy-section management UI in sloppy-id. Verify: once/always/never + anon-mode-wins probes.
  Rollback: flag off → M2 behavior (no prompt, no handoff to unapproved apps).
- **M4 — Adoption + retirement.** New-app boilerplate stops pasting the bar script (wrapper
  provides everything); stale `apps-index.json` regeneration handed to Fela alongside. Verify:
  one new app built bar-less passes the context suite. Rollback: boilerplate revert.
- **Gate rule:** no milestone starts until the previous one's suite has run green on live bytes
  for a full session, and chat has said go — the same approval cadence Harmony's AutoDJ used.

## M0 probe results (run 2026-09-12, read-only — no code changed)
Approved and executed. Recipe: mock wrapper page (40px bar + `<iframe src=app?bare=1>`) served
same-origin, with the server also answering the app-absolute `/sloppy-header/sloppy-bar.js`
path so the fixture app (`mouse-mood`, one of the 531) runs its production bytes VERBATIM —
bar script byte-identical, version `2026-06-01a` confirmed executing inside the frame.

**10/10 assertions at 1200px and 390px. The defect is pinned:**
- `#sloppy-bar` renders visible inside the iframe despite `?bare=1` — `display:flex`,
  32px tall, under the 40px wrapper bar; no opt-out branch exists to run.
- Manifestation nuance (screenshot): on a fresh profile the script chrome appears as its
  floating minimized "S sloppy.live" pill bottom-left — still a second chrome layer, and both
  layers carry vote affordances (the duplicated concern).
- The capability surface M1 must preserve is confirmed alive in the same run:
  `sloppyBarGetContext` / `sloppyBarOn` / `sloppyBarEmit` all functions; a context call
  answers without throwing.

This probe (wrapper mock + assertions) is the M1 acceptance test in waiting: after the de-dup
guard, the same run must flip to "no visible bar, APIs still answer". M1 remains NOT started —
awaiting chat's go per the gate rule.

## M1 results (shipped 2026-09-12, commit f364a9529)
Approved and implemented — one file (`sloppy-bar.js`), version `2026-09-12a`. Guard is
hide-not-skip (element stays in the DOM; paints nothing when `bare=1`), detection fail-safe
(errors → legacy behavior), kill switch live (`?chrome=legacy` / localStorage flag).
Acceptance = the M0 probe flipped, three frames, 10/10 at 1200+390, re-run on the deployed
bytes: GUARD bar invisible at 0px with APIs answering; LEGACY visible (rollback proven);
STANDALONE visible and untouched. Rollback: `git revert f364a9529` (one file, all 531
consumers at once). **M2 (wrapper context bridge, Fela-gated) NOT started — gate rule.**

## M2 progress (read-only start, 2026-09-12 — wrapper patch written + proven, NOT deployed)
Per chat's constraint this round modified NO app files. Deliverables:
- **The exact wrapper patch**: `_bar-m2-ctx-bridge.js` at the repo root — one error-isolated
  script block for Fela to paste before `</body>` in `_bar/index.html`. Same-origin
  request/response (`sloppy-ctx-request` → `{type:'sloppy-ctx', v:1, ctx}`), live updates by
  joining the existing `BroadcastChannel('sloppy-sync')` fabric, honest anonymous payload until
  a signed-in tab broadcasts, field names matching the bar's own `userContext`.
- **One-frame proof (M2A, 8/8)**: a bar-less app inside a mock wrapper running the VERBATIM
  patch bytes received the v1 anonymous context on request, then an UNSOLICITED update when
  `identity-changed` was broadcast on `sloppy-sync` (ready flipped true, identity carried), and
  a sandboxed null-origin frame received silence (strict same-origin held).
- **Rollback evidence (M2B, 3/3)**: with `sloppy-chrome-flags = "noctx"` the same wrapper+patch
  boots and the bridge NEVER answers — the pre-M2 world, no deploy needed; clearing the flag
  restores answers on the next load. Deploy-level revert stays one deletion of the script block.
- **Not done yet (rest of M2, needs its own go)**: the app-side backend — teaching
  `sloppyBarGetContext` to consume the bridge with its current path as fallback — and the
  Fela deploy of the wrapper patch itself (root-owned).

## M2 app-side results (shipped 2026-09-12, commit 2520f9318)
The bridge CLIENT in `sloppy-bar.js` (`2026-09-12b`). Production stays disconnected by
construction: the wrapper bridge is not deployed, so today this posts exactly ONE request into
a void and changes nothing — the S1 scenario proves that shape directly. Acceptance 16/16
re-run on deployed bytes: S1 disconnected (one request, no storm, guard holds, local path
healthy) · S2 connected against the VERBATIM wrapper patch (anon answer injected nothing;
a sloppy-sync broadcast flowed wrapper→push→merge; `sloppyBarGetContext` returned the
identity; identity-changed fired — with S3/S4 cross-validating that the broadcast alone
never merges, isolating the bridge as the path) · S3 `chrome=legacy` (zero requests, bar
visible, context untouched — the full pre-M1/M2 world from one flag) · S4 standalone (zero
messages, all 531 outside-wrapper consumers untouched). M1 acceptance 10/10 re-run (one
declared migration: version assert now `>= 2026-09-12a`). Rollback: `git revert 2520f9318`.
**Remaining M2: the wrapper deploy itself — entirely in Fela's hands (patch + instructions
already in message-to-fela). M3 (consent) NOT started — gate rule.**

## M1.1 amend (shipped 2026-09-12, commit 49fc28292) — after chat's invisibility report
Diagnosis (read-only, 7/7): the M1 hide removed the only entry points to karma/bell/chat/
teleport/identity inside the wrapper, and bare=1 alone triggered hiding even top-level (zero
chrome on copied ?bare=1 links). Amend: IN_WRAPPER additionally requires `window.frameElement`
non-null (real same-origin embedding; top-level/cross-origin fail OPEN to a visible bar), and
inside the wrapper the bar boots as the minimized S-PILL instead of display:none — dedup kept
(no duplicate full bar), capabilities one tap away, pill click expands (user choice wins),
data-m1-hidden retired for data-m1-pill. Verified on deployed bytes: m11 11/11, M2 scenarios
16/16 (one declared migration: S1 pill instead of hidden), true top-level ?bare=1 load = the
normal default bar with zero pill flags. Rollback: `git revert 49fc28292`.

## Open questions (verify before M3, not assumed)
1. Does the wrapper's 500ms title/URL poll interact with a hidden bar's DOM at all? (Believed no.)
2. Exact count of apps loading BOTH chromes with visible overlap on phones (sample 10 of the 531).
3. Whether any of the 531 rely on the bar's *visible* UI (vote button position) in their own CSS.
