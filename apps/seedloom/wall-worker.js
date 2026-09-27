// Seedloom wall painter: renders wall tiles off the main thread so scrolling never stutters.
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
  const { id, s, pal, layers } = m;
  const { rng, makeNoise, GENS } = self.SL;
  try {
    const cv = new OffscreenCanvas(s, s), ctx = cv.getContext('2d');
    const tmp = new OffscreenCanvas(s, s);
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, s, s);
    for (const L of layers) {
      if (!L.on || L.opacity <= 0 || !GENS[L.gen]) continue;
      tmp.width = s; // a fresh, cleared context for every layer
      GENS[L.gen].draw(tmp.getContext('2d'), s, s, L.p, rng(L.seed), pal, makeNoise(rng(L.ns != null ? L.ns : L.seed ^ 0x9e3779b9)), s / 1000);
      ctx.globalAlpha = L.opacity;
      ctx.globalCompositeOperation = L.blend;
      ctx.drawImage(tmp, 0, 0);
    }
    const bmp = cv.transferToImageBitmap();
    postMessage({ id, bmp }, [bmp]);
  } catch (err) {
    postMessage({ id, fail: true });
  }
};
