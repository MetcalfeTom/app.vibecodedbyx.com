# SketchNet

## log
- 2026-04-23: Created. In-browser **TensorFlow.js 4.20** teachable shape classifier — you provide the training data by doodling. **4 classes**: ○ Circle / □ Square / △ Triangle / ✕ Cross. **Pipeline**: 256×256 draw canvas → downsample to **32×32 grayscale** via `drawImage` to offscreen canvas → luminance (`0.299r + 0.587g + 0.114b`) → invert (1 = ink, 0 = blank) → Float32Array of length 1024 → `tf.tensor([[32,32,1]])`. **Model** (`tf.sequential`): Conv2D(8, 3×3, ReLU, heNormal) → MaxPool(2) → Conv2D(16, 3×3, ReLU, heNormal) → MaxPool(2) → Flatten → Dense(32, ReLU) → Dropout(0.2) → Dense(4, softmax). Compiled with `adam(lr=0.005)` + categoricalCrossentropy + accuracy metric. ~8k params (shown live). **Training**: validate ≥2 classes × ≥2 samples each → build tensors from stored `Float32Array` data → `model.fit(xs, ys, { epochs: 30, batchSize: min(8, N), shuffle: true })` → `onEpochEnd` callback updates progress bar fill + `loss 0.234 · acc 87.5%` status line. Tensors disposed in `finally`. **Live predictions**: 90ms debounced `schedulePredict()` on every pointermove during drawing — runs a single forward pass, softmax probs drive 4 probability bars (top class gets accent red fill, others lilac) with `% ` readouts. Verdict card shows `guess` in 28px Big Shoulders + confidence %. Blank canvas (`isBlank` sums <4.0) returns null → bars zero out and guess shows "blank". **UI**: chalkboard lab aesthetic — cream graph-paper bg (repeating 32px grid + 11°/101° fiber noise overlay), ink navy `#1d2a38` / coral `#e84c3d` accent / sun amber `#d9a43a` / lilac `#8770b8`. Big Shoulders Display 900 weight title ("Sketch" ink / "Net" coral), Newsreader italic tagline, JetBrains Mono for all metadata/numbers. Header meta strip shows live TF.js version + active backend (`webgl`/`cpu`) + model state badge (red `untrained` / amber `training` / green `ready`). **Canvas panel**: 256×256 canvas with inner 24px graph grid, 4 corner labels (32×32 / RGBA→L / grayscale / normalized), brush slider (6–28px). **Class selector**: 4-card grid with SVG icons (stroked ink, inverts to paper when active); active state is fully black. Hot-key `1-4` badges in corner. Sample count per class shown inline. **Gallery**: pixel-rendered 32×32 thumbnails generated from stored arrays (reverse invert: `255 - arr[i]*255`, tiny blue shift), 3-letter class tag bottom-left, hover-× delete button, dashed-border empty state. **Train strip**: full-width navy bar with Big Shoulders title "Train the Net" (Net in sun amber), gradient progress bar (coral → amber), inline status/stats, sun-amber TRAIN button (Big Shoulders 900, deep shadow). Turns red + says "Training…" during fit. **Hint bar**: left-accent-border note listing keyboard shortcuts (1-4 / space / C / T / R) and training tip. **Keyboard**: 1-4 class select, Space add, C clear, T train, R reset model (disposes tensors, zeros UI). Mobile responsive: layout collapses to single column, train strip stacks, classes go 2×2. Pointer events with preventDefault touch for mobile drawing. Pollinations OG.

## features
- 4-class CNN trained entirely in the browser — zero server, zero uploads
- Real-time predictions as you draw (90ms debounce)
- TensorFlow.js version + active backend readout
- Live param count shown once model built
- Training progress bar with per-epoch loss/acc
- Sample gallery with click-to-delete thumbnails
- Adjustable brush size (6–28px)
- Keyboard shortcuts for everything
- Model reset (disposes tensors cleanly)
- Mobile-friendly touch drawing

## issues
- WebGL backend negotiation can take a beat on first `tf.ready()` — header shows `—` briefly before resolving.
- Small training sets (<5 per class) overfit fast; model may be very confident on patterns you didn't intend. This is realistic CNN behavior, not a bug.
- Shape detection is translation-sensitive since there's no data augmentation; drawing the same triangle tiny-in-corner vs big-in-middle counts as different patterns. Augmentation (random shift/rotate/scale) would help but blows up model size and training time.
- `tf.min.js` is ~1.2MB first load; cached after.
- Samples live in memory only — refresh clears them. localStorage persistence would be nice but Float32Array serialization gets chunky fast.
- Accuracy metric (`logs.acc`) may read `undefined` on very old TF.js builds; 4.20 is fine.

## todos
- Data augmentation (random affine) to improve generalization
- Save/load trained model + samples to IndexedDB
- Add a "MNIST digits" mode with a pre-bundled tiny sample set
- Confusion matrix view after training
- Live feature map visualization (show what each conv filter activates on)
- Export model as JSON+weights for download
- Share trained model via URL hash (hard — weights are too big for hash)
