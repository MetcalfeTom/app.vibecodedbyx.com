# Transcript Lab — design study & scope (NOT YET IMPLEMENTED)

Status: **study only, per chat 2026-08-12 ("study the local-only transcript prototype design first, then report risks and a minimal implementation plan before coding").** Nothing is built.

## The central finding
"Local-only transcript" and the Web Speech API are largely incompatible: in Chrome,
`webkitSpeechRecognition` ships audio to the vendor's speech servers; the API doesn't even expose *where*
recognition happens. Any page using it while claiming "local-only" is lying. True local word-level ASR
(Whisper-class) needs a runtime + weights we will not download (untrusted libraries, prohibited) and cannot
honestly ship in a static page.

**Design consequence: v1 contains NO word-recognition engine at all.** What can be genuinely local with zero
downloads: mic capture (getUserMedia — audio never leaves the page), voice-activity detection, prosody
features, timestamps, and a human-typed word layer. That is the prototype: an *acoustic transcript* machine
with the human as the (optional) word engine.

## Risks (report)
- **R1 — the false-locality trap (highest).** Using SpeechRecognition would silently violate the product's one
  promise. Mitigation: excluded from v1 entirely. If chat ever wants it: separate mode, separate consent, red
  labeling "this mode sends audio to your browser vendor's servers", never the default.
- **R2 — hot-mic UX.** Mic must never auto-start; recording state must be unmissable (full-width REC banner +
  timer); hard session cap (10 min); auto-stop on tab hide by default; every arm/stop is an audit entry
  (sure-ish consent conjectures C4/C5 apply verbatim).
- **R3 — retention surprise, both directions.** Default = in-memory only (refresh forgets — stated on screen);
  persistence is an explicit "keep on this device" act (IndexedDB); "forget everything" is one button and an
  audit entry. Never Supabase — a transcript in a shared DB is not local.
- **R4 — third parties.** A visible reminder that recording people requires their consent; the page can't
  enforce ethics but must not pretend the issue doesn't exist.
- **R5 — verifiability in sandbox.** Headless has no microphone. The VAD/prosody path must accept synthetic
  PCM via a seam (OfflineAudioContext-rendered bursts) so segmentation is provable; the first real-mic run is
  honestly deferred to chat's browsers, with the footer saying so until confirmed.
- **R6 — clipboard/export leakage.** Export is a user-initiated download only; no share APIs, no URLs.
- **R7 — perf.** Analyser loop at ~50 Hz with fixed buffers; MediaRecorder optional and byte-metered; caps stated.

## Minimal implementation plan (v1, single file, ~600 lines)
1. **Consent gate**: idle page, one "arm microphone" button → browser permission → REC banner + elapsed + cap.
2. **VAD segmentation**: RMS with hysteresis (open at μ+kσ of noise floor, close after 300 ms under), utterance
   segments {t0, t1}; noise floor calibrated in the first second (masked, logged as warm-up).
3. **Acoustic transcript rows** per segment: duration, mean/peak level, pitch estimate + trend (autocorrelation),
   mini waveform; VAD confidence shown as margin-over-threshold (sure-ish blur/CI grammar).
4. **Human word layer**: click a segment → type words (optional); flagged `[human-typed]` in provenance.
5. **Session view + export**: .txt / .json download; in-memory default; explicit IndexedDB keep; delete-all.
6. **Audit log**: arm, stop, auto-stop (cap/hide), keep, delete, export — append-only, timestamps.
7. **Provenance lines**: sample rate, fft size, threshold values, calibration window on every panel.
8. **A11y/conventions**: rem, ≥2.75rem targets, aria-live on state changes, reduced-motion, WCAG AA per repo rule.

## Verification plan (before any live claim)
- Synthetic-PCM probe: tone bursts + silence rendered offline → fed through the SAME segmentation path →
  assert segment count/boundaries ±1 frame; noisy-floor case; overlapping-speech (single mixed channel) case.
- Consent probes: nothing runs pre-click; REC banner visible while armed; cap fires; hide auto-stops; every
  transition audited; delete-all leaves IndexedDB empty (assert via API).
- Real-mic E2E: deferred to chat, labeled in-app until confirmed.

## Out of scope v1
Word-level ASR (local or cloud), speaker diarization claims (mixed-channel guesswork would violate C1 honesty),
uploads of any kind, live sharing, translation.
