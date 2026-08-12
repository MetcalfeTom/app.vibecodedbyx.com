# GGUF Sensor — scope document (NOT YET IMPLEMENTED)

Status: **scope only, per chat 2026-08-12 ("document the separate GGUF sensor scope only, do not implement it yet").**
No app folder exists; nothing is built. This document is the contract for when chat says go.

## Purpose
A separate single-file app ("gguf-sensor") that reads a **user-selected local GGUF model file** and reports
its anatomy — magic, version, metadata, tensor table, quantization census — as a set of *instruments*, in the
sure-ish uncertainty-aware style. It is a **sensor, not a runtime**: it executes nothing, ever.

## Hard boundaries (safety, non-negotiable)
- **No inference.** Weights are never dequantized, never evaluated, never fed to any runtime.
- **No downloads.** No external libraries, no WASM runtimes (llama.cpp etc. are untrusted third-party code), no CDN model fetches.
- **No network.** Zero fetch/XHR; the only I/O is the local File the user picks. Nothing is uploaded.
- **No eval.** Metadata strings are rendered as textContent only; never innerHTML, never executed, never parsed as URLs to fetch.
- **Bounded memory.** Only header slices are read via `File.prototype.slice()` + DataView — a 40 GB GGUF must cost ~single-digit MB of RAM.
  Never `arrayBuffer()` on the whole file.

## In scope (the instruments)
1. **Intake**: drag/drop or file picker; instantly show file name, byte size, and last-modified — provenance starts at the file.
2. **Magic & version**: `GGUF` magic check (0x46554747 LE), version u32 (v2/v3 supported; others reported honestly as "unknown version — parsed best-effort").
3. **Counts**: tensor_count u64, metadata_kv_count u64 — with sanity caps (refuse politely above e.g. 2^20 entries: "header claims N tensors; this sensor stops here").
4. **Metadata table**: all GGUF value types (u8..f64, bool, string, array — arrays rendered with head/tail truncation + full count). Key rows: architecture, context length, tokenizer model, quantization version, license if present.
5. **Tensor census**: per-tensor name / dims / dtype (quant format) / offset, capped display (first 200 + "… and N more"); aggregate census by quant type (how many Q4_K, Q6_K, F32 …) with byte-share bars.
6. **Size audit (the uncertainty instrument)**: declared-size arithmetic (Σ tensor bytes by dtype block math + alignment) vs actual file size — mismatch shown with the sure-ish CI/blur language ("accounts for 98.3% of bytes; 1.7% unexplained — stated, not hidden").
7. **Aberration log**: malformed offsets, overlapping tensors, out-of-bounds string lengths, non-monotonic offsets — detected, logged append-only, never "fixed" silently.
8. **Read-only stance + provenance line on every panel**: which byte range each fact came from (`bytes 24–4 096 of local file, read via slice`).

## Out of scope (explicitly)
- Running or sampling the model; perplexity; tokenization tests.
- Editing/re-writing GGUF; format conversion.
- Fetching models from Hugging Face or anywhere else.
- Parsing beyond the header + tensor-info region (weight payload bytes are never mapped).

## Parser plan (no dependencies)
Hand-written little-endian reader over DataView: u8/u32/u64 (BigInt), f32/f64, length-prefixed UTF-8 strings
(TextDecoder, length validated against slice bounds before decode), typed arrays. Every read passes through a
bounds-checked cursor; any violation aborts that section with an aberration entry instead of throwing to console.
Header region read in two slices: fixed 24-byte prelude first, then a metadata slice sized by a capped estimate,
grown geometrically (max 64 MB total) if the KV region proves longer.

## Verification plan (before any live claim)
- In-probe **synthetic GGUF writer** builds fixtures: minimal valid v3, one with every value type, a multi-tensor census case.
- **Fuzz fixtures**: truncated file, huge declared string length, tensor offset past EOF, absurd counts — each must produce a logged aberration + graceful panel, zero uncaught exceptions.
- Memory assertion: probe wraps File.slice to count bytes actually read; cap must hold even for a synthetic "10 GB" sparse blob.

## Estimate
Single index.html, ~500–600 lines, sure-ish visual family (paper/teal/madder), Newsreader + Sono.

## Why not inference, one more time
Chat asked earlier about "safe GGUF loading": loading bytes is safe; *running* them requires an inference runtime
we would have to download untrusted or write from scratch, and multi-GB weights don't belong in a static page.
The sensor is the honest maximum. If that ever changes it will be a new scope document, not scope creep on this one.
