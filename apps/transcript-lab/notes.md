# transcript-lab (Transcript Lab — local acoustic transcripts)

## log
- 2026-08-12: v1, built EXACTLY to the pre-agreed scope (/transcript-lab-scope.md — chat ordered study-first, then "build exactly to the studied scope"). Single file, Zilla Slab + Martian Mono, slate/tape/signal-orange field-recorder palette.
  - **No speech engine, by design (R1)**: the Web Speech API sends audio to vendor servers, so it is EXCLUDED — not gated, excluded. The page's promise banner says exactly what's refused. Words come only from a human-typed layer, flagged `[human-typed]` in the UI, .txt and .json.
  - **Consent gate (R2)**: mic never auto-starts; arm → browser permission → sticky red RECORDING banner with elapsed/10:00 hard cap; auto-stop on tab hide (toggle, default on); analysis-only graph (source→analyser, no destination, no MediaRecorder file); stop ends tracks + closes context. Rejection/absence of a mic lands gracefully with an audit entry.
  - **VAD segmentation**: one ingest path (live loop AND probe seam use the same `ingestFrame`): 20ms frames, fft 2048, first 1.0s = masked noise-floor calibration (μ, σ audited), open at μ+max(4σ, .008), close below 0.6·open sustained 300ms. Segments: t0–t1, dur, dB, autocorrelation pitch at loudest frame + rising/falling/level trend (first vs last voiced frame), waveform bars, VAD confidence = margin-over-threshold rendered with the sure-ish blur grammar ("confident-ish").
  - **Retention (R3)**: memory by default (stated on page: "refresh forgets"); explicit `keep on this device` (IndexedDB) + `restore kept session`; **confirmed deletion** — forget → inline "really forget?" → cancel is logged and keeps everything; yes wipes IDB + memory + audit entry FORGOTTEN.
  - **Export (R6)**: .txt / .json downloads only; json carries provenance block (engine:none, thresholds, wordsProvenance).
  - **Audit**: append-only — load, arm, permission grant/refusal, calibration, stop+reason (operator/cap/tab-hidden), keep, restore, export, forget requested/cancelled/FORGOTTEN.
  - **R5 honesty in the footer**: headless can't hear; segmentation verified synthetically; first real-mic confirmation belongs to chat, "report from the field and this line changes."
  - Verified 17/17: idle-by-default; graceful mic failure (headless NotFoundError → audited, no banner); calibration; synthetic 800ms+500ms bursts through the REAL ingest path → 2 segments with sane durations; 200Hz pitch recovered ±25Hz; confidence + provenance rendered; human-typed words in json/txt with provenance flags; keep→kept-state; restore round-trip (words survive); confirm-visible; cancel-keeps; FORGOTTEN clears memory+IDB+gates export buttons. Screenshot reviewed.

## issues
- **Harness lessons (both storage + mic)**: under `--virtual-time-budget`, IndexedDB event delivery races the virtual clock (a put's oncomplete fired but later get/delete callbacks never arrived before dump) → probes use an injected in-memory indexedDB shim for deterministic lifecycle checks; and getUserMedia rejection arrives on the REAL clock → assert it at probe END, not after a virtual wait.
- Pitch autocorrelation is mono + loudest-frame only — overlapping speakers merge into one segment (scope: diarization explicitly out, would violate honesty).
- Real-microphone E2E still unconfirmed (sandbox is deaf) — footer says so until chat reports.

## todos
- Warm-up masking after tab refocus (timing artifacts can open a fake segment on busy machines).
- Per-segment replay would require keeping raw audio (MediaRecorder) — a deliberate NON-feature for now; if chat asks, it needs its own consent + retention design.
- If chat ever asks for cloud ASR: separate mode, separate consent, red vendor-server labeling, never default (scope R1).
