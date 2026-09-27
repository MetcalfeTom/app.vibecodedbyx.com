// Seedloom painter: renders wall tiles and the editor's full-size layers off the main thread, so nothing stutters.
// It runs the same looms as the page (gens.js and any extra gens-*.js files the page lists).
self.window = self;
let ready = false;

onmessage = e => {
  const m = e.data;
  if (m.init) {
    importScripts(...m.init);
    ready = true;
    return;
  }
  if (!ready) return postMessage({ id: m.id, fail: true });
  // a wall tile: an s x s square with every layer composited on the palette background;
  // raw: one layer on its own, w x h and transparent, for the editor to composite
  const { id, s, pal, layers, raw } = m, w = m.w || s, h = m.h || s;
  const { rng, makeNoise, GENS } = self.SL;
  try {
    const cv = new OffscreenCanvas(w, h), ctx = cv.getContext('2d');
    const draw = (L, x) => GENS[L.gen].draw(x, w, h, L.p, rng(L.seed), pal, makeNoise(rng(L.ns != null ? L.ns : L.seed ^ 0x9e3779b9)), Math.min(w, h) / 1000);
    if (raw) {
      if (!GENS[layers[0].gen]) throw new Error('unknown loom');
      draw(layers[0], ctx);
    } else {
      const tmp = new OffscreenCanvas(w, h);
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, w, h);
      for (const L of layers) {
        if (!L.on || L.opacity <= 0 || !GENS[L.gen]) continue;
        tmp.width = w; // a fresh, cleared context for every layer
        draw(L, tmp.getContext('2d'));
        ctx.globalAlpha = L.opacity;
        ctx.globalCompositeOperation = L.blend;
        ctx.drawImage(tmp, 0, 0);
      }
    }
    const bmp = cv.transferToImageBitmap();
    postMessage({ id, bmp }, [bmp]);
  } catch (err) {
    postMessage({ id, fail: true });
  }
};
