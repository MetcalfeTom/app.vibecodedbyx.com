# RAG Tool

## log
- 2026-04-27: **File upload fix**. Users reported ingestion failing. Root cause: drop zone was a `<label>` wrapping the hidden `<input type="file">` AND I had a JS `dropZone.addEventListener('click', () => fileInput.click())` on top. Clicking the label fires the input's click natively, then the JS handler fires `fileInput.click()` again — the second call hits browsers' "user-activation already consumed" guard and the dialog silently fails to open. Fixes: (1) `<label>` → `<div role="button" tabindex="0">` so there's no native label-input pairing. (2) Moved the `<input>` outside the drop zone using `position:absolute;left:-9999px;width:1px;height:1px;opacity:0` instead of `display:none` (more reliable for programmatic `.click()` across browsers). (3) Added `.drop-zone > * { pointer-events:none }` so dragleave doesn't flicker when the cursor crosses the inner `.head/.sub/.formats` text spans. (4) Replaced single dragenter/leave toggle with a `dragDepth` counter so child element re-entries don't drop the `over` class. (5) Added window-level dragover/drop preventDefault for events outside the zone — prior version let a fumbled drop navigate the page to the file URL. (6) Added a visible `#uploadStatus` line that reports `reading N files…` → `✓ added N` (green, fades 3.5s) or `failed: name: reason · …` (magenta) so users see exactly what happened. Inline error reasons: empty file, over 2 MB, would exceed 6 MB total, duplicate name+size, looks binary (NUL-byte heuristic on first 512 chars), read-as-empty/non-text, FileReader exception. (7) `fileInput.value = ''` now happens **before** `.click()` so re-uploading the same file still fires `change`. (8) Drop handler explicitly checks `e.dataTransfer.files.length` and reports "no files in drop (try Finder/Explorer not the browser)" if empty.
- 2026-04-27: Created. **Functional in-browser RAG tool** with local file upload, semantic chunking, and cosine retrieval — nothing leaves the tab. Pivoted from an earlier "rag-pipeline" educational viz idea (deleted before commit) toward an actually usable corpus → query workflow. **5-stage layout** kept as the visual scaffold (Corpus / Chunk / Embed / Index / Retrieve), but each stage is now a real workspace not a slideshow.
  - **Stage 1 — Corpus**: drag/drop or click `<input type="file" multiple>` accepting `.txt .md .markdown .json .csv .log .html .xml .yaml .toml .py .js .ts .go .rs .java .c .cpp .rb .php .swift .sh .sql` etc. (text-readable formats). FileReader.readAsText() for each, 2 MB per file cap, 6 MB total cap (alert + skip on overflow). File list rendered with name + size + × delete. Sample pills (`science / tech / food / all samples`) inject curated sample docs as if they were uploaded files. Extra textarea below for paste-as-doc → tagged `pasted.txt`. Live char/word/sentence/file counters.
  - **Stage 2 — Chunk**: 3 strategies via segmented control:
    - **semantic** (default) — sentence-split via paragraph-aware regex, embed each sentence, compute *windowed* cosine between consecutive groups (window of ±1 sentence on each side), apply -0.15 hard penalty across paragraph breaks, find similarity dips below the bottom-N percentile (`break sensitivity` slider 0.05–0.60, default 0.30 = bottom 30% of similarity drops become breaks), then enforce `max chunk size` by adding extra breaks where chunks would exceed the cap.
    - **by sentence** — group sentences greedily until they would exceed `max chunk size`, with optional sentence-level overlap (re-include last sentence(s) up to `overlap` chars).
    - **by chars** — sliding-window fixed-size with word-boundary backoff (back up to last space if it's > 0.5× size into the slice) + char-level overlap.
    - Strategy switch swaps overlap-slider ↔ break-sensitivity-slider so only the relevant control is visible.
  - **Stage 3 — Embed**: hashing tokenizer (FNV-1a), `dim=128`, words and `_word_`-padded char bigrams hashed into bins (word weight 1.0, bigram weight 0.4), L2-normalized. ~85 stopwords pruned. Renders one row per chunk: `cNNN` id + 128-cell heatmap (cyan = positive, magenta = negative, alpha by magnitude × 4) + chunk preview text (`source · first 70 chars`). Hot (retrieved) chunks get magenta tint and pink id.
  - **Stage 4 — Index**: 380px canvas scatter. 2D projection via two stable random unit vectors (mulberry32 seed 1234567), made approx-orthogonal via Gram-Schmidt. Each chunk = labeled cyan dot (`cNNN` next to it), retrieved = amber, query = pink crosshair `Q` marker, dashed lines from query to each retrieved chunk (top-1 line is heavier + pinker).
  - **Stage 5 — Retrieve**: query input + `top-k` number (1–10, default 3) + retrieve button. On submit: embed the query, compute cosine vs all chunk embeddings, sort desc, slice top-k. Result cards show big `#1/#2/#3` rank, `CHUNK NNN · source.ext · cosine` line, full chunk text (truncated 320c), score bar, similarity number. Top-1 has magenta border + magenta rank/bar. Final assembled prompt rendered in IBM Plex Mono with syntax-colored `SYSTEM › CONTEXT › USER › ASSISTANT ›` roles, **copy-to-clipboard button** writes a clean plain-text version (no markup) to clipboard with "copied ✓" confirmation flash.
- 2026-04-27: **Voy investigated, decided against**. Voy is a WASM-based vector store from tantaraio — but it only solves the *storage/search* half of RAG. You still need an embeddings model to produce vectors. The realistic in-browser embedder is `@xenova/transformers` (Transformers.js) which downloads a 30–90 MB ONNX model on first load. For a quick-loading toy that runs offline, that tradeoff felt wrong. So: I implemented cosine similarity manually on top of a deterministic hashing tokenizer (FNV-1a + char bigrams + word hashes → 128-d L2-normalized vectors). It loses semantic generalization a real model would have (won't match "carbon dioxide" with "CO₂") but it ships in 0 KB extra, runs in ~1 ms per chunk, and keeps the math identical to a real RAG pipeline so the user understands what's happening. Documented this honestly in the footer + embed-info text. If a user wants neural embeddings later, swapping `embed()` for an async `pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')` call is ~10 lines.

## issues
- Hashing embeddings only match on surface lexical overlap (shared word stems and char bigrams). They will NOT match `"how does photosynthesis make food?"` with chunks that talk about glucose unless the word "photosynthesis" appears. This is a fundamental limit of hashing trick vs neural embeddings — clearly disclosed in the embed-info copy.
- Semantic chunking quality is bottlenecked by the same embedder. Sentences end up in different chunks based on word overlap, not deep semantic meaning. Still strictly better than fixed-char windowing for most prose because paragraph boundaries are respected and topic shifts that involve vocabulary change get split correctly.
- Two-vector random-projection scatter can sometimes overlap unrelated chunks because we're squashing 128-d into 2-d. Visualization is illustrative not authoritative — actual retrieval uses full 128-d cosine, not the 2D positions.
- File reader uses `readAsText` with default UTF-8. Binary files (PDF, .docx, images) will be read as garbage if user uploads them. The accept= attribute filters most, but drag-drop bypasses it. Could add a `text/*` MIME check + a "skipped binary file" toast. Future: add pdf.js parsing.
- 2 MB / 6 MB caps are conservative — with 6 MB of text and semantic chunking, embeddings + UI render takes ~2–3s on a fast laptop. Slow phones could chug. Could add an async progress bar during `computeEmbeddings()` for large corpora.

## todos
- pdf.js integration so users can drop PDFs directly (most common ask).
- Optional Transformers.js neural embedder behind a "use real model (~30 MB)" toggle.
- IndexedDB persistence so the corpus survives a page reload.
- Highlight the matched terms inside retrieved chunk text (BM25-style scoring on the side?).
- Hybrid retrieval: combine cosine + BM25 keyword score for better recall.
- Chunk export: download chunks + embeddings as `.jsonl` so users can plug them into their own pipeline.
- Direct LLM hookup: optional pollinations.ai call to actually answer the question with the assembled prompt (gated behind a "send to LLM" button so the tool stays local-only by default).
- Re-rank step: secondary cross-encoder-style scoring of the top-k.

## design
- Palette: bg `#070b14`, panel `#121a2c`/`#182338`, ink `#e6ecf5`, dim `#7a89a3`, cyan `#5fc8e0` primary, amber `#f5b85a` for retrieved, magenta `#e85a8a` for query/top-1, green `#7ed957` for done badges, violet `#b88dff` accent. Lines `rgba(95,200,224,0.18)`.
- Fonts: Bricolage Grotesque (display 800 italic, 500 italic accents), Newsreader (body serif + italic taglines + chunk preview text), IBM Plex Mono (all UI metadata, ranks, scores, prompt preview).
- Layout: top brand + tagline + meta column. 5-pill pipeline strip (number + label + sub). Controls bar with live `corpus / chunks / vectors` counter + reset/run buttons. Each stage = card with numbered title + info column. Hex-grid SVG and scanline overlay backdrops.
- Drop zone = dashed cyan border that goes solid on hover/drag-over with cyan tint.
- Scatter dots labeled with `cNNN`, query crosshair pink with center `Q`.

## code-shape
- Single file, ~1100 lines, ~52KB.
- Top: `SAMPLES` object (3 sample docs as `{name, text}`).
- `state` = `{files[], pasted, strategy, size, overlap, threshold, chunks[], embeddings[], embedDim, query, topK, results[], queryEmbedding}`.
- `embed(text, dim=128)` — FNV-1a hashing tokenizer (words + char bigrams) → L2-normalized vector.
- `cosine(a,b)` — straight dot-product on already-normalized unit vectors.
- `splitSentences(text)` — paragraph-aware: split on `\n\s*\n`, then per-paragraph regex `[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$`, returns `[{text, start, end, paraEnd}]` with absolute char offsets.
- `chunkChar(text, size, overlap, source)` — sliding window with word-boundary backoff.
- `chunkSentence(text, size, overlap, source)` — greedy group with sentence-level overlap.
- `chunkSemantic(text, size, threshold, source)` — embed each sentence, compute windowed similarity (avg of left + right context), apply -0.15 paragraph-boundary penalty, build break-set from bottom-percentile dips, then walk sentences forming chunks (break at break-set OR at `size` overflow).
- `joinSents(sents, source)` — assembles sentence list back into a chunk dict.
- `avgVec(vecs)` — mean + L2-renormalize; used for the windowed sentence-context vector in semantic chunking.
- `corpusDocs()` — combines `state.files` + pasted textarea into one `[{name,text}]` list.
- `rechunk()` — re-runs chunker for active strategy across all docs, invalidates embeddings/results.
- `computeEmbeddings()` — `state.chunks.map(c => embed(c.text))`.
- `runQuery()` — embed query, score all chunks, sort desc, slice top-k, mark hot, re-render everything.
- `buildPromptText()` — plain-text RAG prompt for clipboard.
- `renderPrompt()` — same prompt with syntax-colored spans for the in-page preview.
- File upload: drag-drop on `#dropZone`, click forwards to `<input type="file">`, ingestion via async `readFileAsText` + per-file size + total-size guards.
- Stage pills: `setStage(n, mode)` + `clearStages()` + the run button does a 4-step animation (300/500/500/400 ms) lighting each stage in turn, then runs the query if one is set.
