// Seedloom organic looms: reaction-diffusion coral, space-colonised branches, phyllotaxis seed heads.
// Loaded after gens.js; adds to window.SL.GENS. Sizes are in u (1/1000 of the short side), all randomness from R and N.
(function () {
  const { TAU, rng, makeNoise, pick, hexA, mix, GENS } = window.SL;

  const rgbOf = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const lum = hex => { const [r, g, b] = rgbOf(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  const clamp01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const smooth = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
  // palette colours ordered by how far they stand out from the background, most contrast first
  const byContrast = pal => { const b = lum(pal.bg); return pal.c.slice().sort((x, y) => Math.abs(lum(y) - b) - Math.abs(lum(x) - b)); };
  function blankCanvas(w, h) {
    if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
    const c = document.createElement('canvas'); c.width = w; c.height = h; return c;
  }

  // =====================================================================================
  // Coral: Gray-Scott reaction-diffusion on a small torus, upscaled bicubically into crisp bands
  // =====================================================================================
  // species as [feed, offset of kill from the saddle-node curve k = sqrt(f)/2 - f, sprout density]:
  // staying close to that curve keeps every mix of two species alive (5-point Laplacian, Du = 0.2, Dv = 0.1)
  const SPECIES = {
    coral: [0.055, 0, 1], maze: [0.04, 0.0004, 1], spots: [0.064, 0.0016, 0.8], holes: [0.05, -0.0015, 1], worms: [0.058, 0.0008, 1],
  };
  // one explicit Euler step (monomorphic on Float64Array); ghost cells already hold the wrapped edges
  function rdStep(U, V, U2, V2, F, FK, gw, gh, W) {
    for (let y = 1; y <= gh; y++) {
      let i = y * W + 1;
      const end = i + gw;
      let uL = U[i - 1], u = U[i], vL = V[i - 1], v = V[i];
      for (; i < end; i++) {
        const uR = U[i + 1], vR = V[i + 1], uvv = u * v * v;
        U2[i] = u + 0.2 * (uL + uR + U[i - W] + U[i + W] - 4 * u) - uvv + F[i] * (1 - u);
        V2[i] = v + 0.1 * (vL + vR + V[i - W] + V[i + W] - 4 * v) + uvv - FK[i] * v;
        uL = u; u = uR; vL = v; v = vR;
      }
    }
  }
  function rdWrap(A, gw, gh, W) {
    for (let y = 1; y <= gh; y++) { const r = y * W; A[r] = A[r + gw]; A[r + gw + 1] = A[r + 1]; }
    A.copyWithin(0, gh * W, gh * W + W);
    A.copyWithin((gh + 1) * W, W, 2 * W);
  }
  // Catmull-Rom taps for every output pixel along one axis: 4 wrapped grid indices + 4 weights
  function taps(n, cs, g) {
    const I = new Int32Array(n * 4), Wt = new Float64Array(n * 4);
    for (let p = 0; p < n; p++) {
      const x = (p + 0.5) / cs - 0.5, i0 = Math.floor(x), t = x - i0, t2 = t * t, t3 = t2 * t;
      Wt[p * 4] = (-t3 + 2 * t2 - t) / 2; Wt[p * 4 + 1] = (3 * t3 - 5 * t2 + 2) / 2;
      Wt[p * 4 + 2] = (-3 * t3 + 4 * t2 + t) / 2; Wt[p * 4 + 3] = (t3 - t2) / 2;
      for (let k = 0; k < 4; k++) I[p * 4 + k] = (((i0 - 1 + k) % g) + g) % g;
    }
    return [I, Wt];
  }
  const pack = (r, g, b, a) => (a << 24) | (b << 16) | (g << 8) | r; // little-endian RGBA word as int32
  // one output row per call, one small monomorphic function per style; gradient from the neighbouring rows
  // gives the edge distance in pixels, so every band edge gets exactly one pixel of anti-aliasing
  const RD_SHADE = {
    bands(px, row, w, prev, cur, next, K) {
      const c0 = K.c0, c1 = K.c1, c2 = K.c2, P0 = pack(c0[0], c0[1], c0[2], 255), P1 = pack(c1[0], c1[1], c1[2], 255), P2 = pack(c2[0], c2[1], c2[2], 255);
      for (let x = 0; x < w; x++) {
        const v = cur[x];
        if (v < 0.22) continue;
        const gx = (cur[x < w - 1 ? x + 1 : x] - cur[x > 0 ? x - 1 : x]) * 0.5, gy = (next[x] - prev[x]) * 0.5;
        const ig = 1 / (Math.sqrt(gx * gx + gy * gy) + 1e-7);
        const a0 = (v - 0.3) * ig + 0.5;
        if (a0 <= 0) continue;
        const a1 = (v - 0.58) * ig + 0.5, a2 = (v - 0.84) * ig + 0.5;
        if (a0 >= 1 && (a1 <= 0 || a1 >= 1) && (a2 <= 0 || a2 >= 1)) { px[row + x] = a2 >= 1 ? P2 : a1 >= 1 ? P1 : P0; continue; }
        const k1 = a1 < 0 ? 0 : a1 > 1 ? 1 : a1, k2 = a2 < 0 ? 0 : a2 > 1 ? 1 : a2, k0 = a0 > 1 ? 1 : a0;
        let r = c0[0] + (c1[0] - c0[0]) * k1, g = c0[1] + (c1[1] - c0[1]) * k1, b = c0[2] + (c1[2] - c0[2]) * k1;
        r += (c2[0] - r) * k2; g += (c2[1] - g) * k2; b += (c2[2] - b) * k2;
        px[row + x] = pack(r | 0, g | 0, b | 0, (k0 * 255) | 0);
      }
    },
    ink(px, row, w, prev, cur, next) {
      for (let x = 0; x < w; x++) {
        const v = cur[x];
        if (v < 0.34) continue;
        const gx = (cur[x < w - 1 ? x + 1 : x] - cur[x > 0 ? x - 1 : x]) * 0.5, gy = (next[x] - prev[x]) * 0.5;
        const a = (v - 0.42) / (Math.sqrt(gx * gx + gy * gy) + 1e-7) + 0.5;
        if (a <= 0) continue;
        px[row + x] = a >= 1 ? -1 : (((a * 255) | 0) << 24) | 0xffffff;
      }
    },
    lines(px, row, w, prev, cur, next, K) {
      const h0 = K.lineW * 0.5 + 0.5, h1 = K.lineW * 0.3 + 0.5;
      for (let x = 0; x < w; x++) {
        const v = cur[x];
        const gx = (cur[x < w - 1 ? x + 1 : x] - cur[x > 0 ? x - 1 : x]) * 0.5, gy = (next[x] - prev[x]) * 0.5;
        const ig = 1 / (Math.sqrt(gx * gx + gy * gy) + 1e-7);
        const a = Math.max(h0 - Math.abs(v - 0.3) * ig, h1 - Math.abs(v - 0.62) * ig);
        if (a <= 0) continue;
        px[row + x] = (((a > 1 ? 255 : (a * 255) | 0)) << 24) | 0xffffff;
      }
    },
    relief(px, row, w, prev, cur, next, K) {
      // the V field read as height and lit from the top left: a glossy gel
      const lo = K.lo, hi = K.hi, zs = K.zs;
      for (let x = 0; x < w; x++) {
        const v = cur[x];
        if (v < 0.16) continue;
        const gx = (cur[x < w - 1 ? x + 1 : x] - cur[x > 0 ? x - 1 : x]) * 0.5, gy = (next[x] - prev[x]) * 0.5;
        const a = (v - 0.24) / (Math.sqrt(gx * gx + gy * gy) + 1e-7) + 0.5;
        if (a <= 0) continue;
        const sx = gx * zs, sy = gy * zs, lit = (0.55 * sx + 0.62 * sy + 0.56) / Math.sqrt(sx * sx + sy * sy + 1);
        let t = (v - 0.2) * 1.4; t = t < 0 ? 0 : t > 1 ? 1 : t; t = t * t * (3 - 2 * t);
        let r = lo[0] + (hi[0] - lo[0]) * t, g = lo[1] + (hi[1] - lo[1]) * t, b = lo[2] + (hi[2] - lo[2]) * t;
        const k = lit - 0.56;
        if (k > 0) { const s = Math.min(1, k * k * 5); r += (255 - r) * s; g += (255 - g) * s; b += (255 - b) * s; }
        else { const s = Math.min(0.85, -k * 1.1); r *= 1 - s; g *= 1 - s; b *= 1 - s; }
        px[row + x] = pack(r | 0, g | 0, b | 0, ((a > 1 ? 1 : a) * 255) | 0);
      }
    },
  };

  GENS.coral = {
    name: 'Coral',
    blurb: 'two chemicals growing coral',
    params: [
      { k: 'species', label: 'species', options: ['coral', 'maze', 'spots', 'holes', 'worms'], def: 'coral' },
      { k: 'zoom', label: 'zoom', min: 0.6, max: 2, step: 0.05, def: 1 },
      { k: 'growth', label: 'growth', min: 60, max: 1600, step: 20, def: 620 },
      { k: 'spread', label: 'spread', min: 0.1, max: 1, step: 0.05, def: 1 },
      { k: 'mutate', label: 'mutation', min: 0, max: 1, step: 0.05, def: 0.45 },
      { k: 'style', label: 'style', options: ['bands', 'ink', 'lines', 'relief'], def: 'bands' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      // the grid has G cells across the short side; aspect snapped so preview and print simulate the same torus
      const G = Math.round(100 / p.zoom), m = Math.min(w, h);
      const gw = Math.max(8, Math.round(G * Math.round(w / m * 50) / 50)), gh = Math.max(8, Math.round(G * Math.round(h / m * 50) / 50));
      const W = gw + 2, n = W * (gh + 2);
      const U = new Float64Array(n).fill(1), V = new Float64Array(n), F = new Float64Array(n), FK = new Float64Array(n);
      const [f0, d0, dens] = SPECIES[p.species] || SPECIES.coral;
      // mutation: feed and kill drift along the pattern-forming band wherever two slow noise fields say so
      const ms = 2.2 / G, off = R() * 100, mu = p.mutate;
      for (let y = 1; y <= gh; y++) for (let x = 1; x <= gw; x++) {
        const t1 = Math.max(-1, Math.min(1, N.fbm(x * ms + off, y * ms, 3) * 2.6)), t2 = Math.max(-1, Math.min(1, N.fbm(x * ms - 31, y * ms + off, 2) * 2.6));
        const f = Math.max(0.036, f0 + mu * t2 * 0.009), d = Math.max(-0.0019, Math.min(0.0024, d0 + mu * t1 * 0.0022)), i = y * W + x;
        F[i] = f; FK[i] = Math.sqrt(f) / 2 + d;
      }
      // sprouts: discs of V at a fixed density (too many and they starve each other), kept only where a
      // second noise field allows when spread < 1
      const sprouts = Math.round(gw * gh / 85 * dens), ss = 1.6 / G;
      for (let s = 0; s < sprouts; s++) {
        const cx = Math.floor(R() * gw), cy = Math.floor(R() * gh), r = 3 + Math.floor(R() * 2);
        if (p.spread < 1 && N.fbm(cx * ss + 40, cy * ss - 17, 3) * 1.8 + 0.5 > p.spread) continue;
        for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy > r * r + 1) continue;
          const i = (((cy + dy) % gh + gh) % gh + 1) * W + (((cx + dx) % gw + gw) % gw + 1);
          U[i] = 0.5; V[i] = 0.25 + R() * 0.2;
        }
      }
      const iters = Math.min(Math.round(p.growth), Math.floor(21e6 / (gw * gh)));
      let A = U, B = V, A2 = new Float64Array(n), B2 = new Float64Array(n);
      for (let it = 0; it < iters; it++) {
        rdWrap(A, gw, gh, W); rdWrap(B, gw, gh, W);
        rdStep(A, B, A2, B2, F, FK, gw, gh, W);
        let t = A; A = A2; A2 = t; t = B; B = B2; B2 = t;
      }
      // V normalised to 0..1 on a plain gw x gh grid
      const Fv = new Float64Array(gw * gh);
      let vmax = 0.05;
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { const v = B[(y + 1) * W + x + 1]; Fv[y * gw + x] = v; if (v > vmax) vmax = v; }
      for (let i = 0; i < Fv.length; i++) Fv[i] /= vmax;

      // bicubic upscale, separable: every grid row resampled to w pixels, then 3 rolling output rows
      const cs = m / G, [XI, XW] = taps(w, cs, gw), [YI, YW] = taps(h, cs, gh);
      const Hv = new Float64Array(gh * w);
      for (let j = 0; j < gh; j++) {
        const r = j * gw, o = j * w;
        for (let x = 0, q = 0; x < w; x++, q += 4) Hv[o + x] = XW[q] * Fv[r + XI[q]] + XW[q + 1] * Fv[r + XI[q + 1]] + XW[q + 2] * Fv[r + XI[q + 2]] + XW[q + 3] * Fv[r + XI[q + 3]];
      }
      const fillRow = (y, out) => {
        const q = y * 4, a = YI[q] * w, b = YI[q + 1] * w, c = YI[q + 2] * w, d = YI[q + 3] * w;
        const w0 = YW[q], w1 = YW[q + 1], w2 = YW[q + 2], w3 = YW[q + 3];
        for (let x = 0; x < w; x++) out[x] = w0 * Hv[a + x] + w1 * Hv[b + x] + w2 * Hv[c + x] + w3 * Hv[d + x];
      };
      let prev = new Float64Array(w), cur = new Float64Array(w), next = new Float64Array(w);
      fillRow(0, cur); prev.set(cur); if (h > 1) fillRow(1, next); else next.set(cur);

      const cvs = blankCanvas(w, h), octx = cvs.getContext('2d'), img = octx.createImageData(w, h);
      const px = new Int32Array(img.data.buffer), style = p.style;
      const cols = byContrast(pal).map(rgbOf);
      const shade = RD_SHADE[style] || RD_SHADE.bands;
      // relief is lit from the most colourful palette entry: dark rim, clean top
      const chroma = c => Math.max(...c) - Math.min(...c), base = cols.reduce((a, b) => (chroma(b) > chroma(a) ? b : a));
      const dark = cols.concat([rgbOf(pal.bg)]).reduce((a, b) => (a[0] + a[1] + a[2] <= b[0] + b[1] + b[2] ? a : b));
      const K = {
        c0: cols[0], c1: cols[1], c2: cols[2], lineW: Math.max(1, 3.2 * u), zs: cs * 2.6,
        lo: base.map((v, i) => v + (dark[i] * 0.6 - v) * 0.6), hi: base.map(v => v + (255 - v) * 0.12),
      };
      for (let y = 0; y < h; y++) {
        shade(px, y * w, w, prev, cur, next, K);
        const t = prev; prev = cur; cur = next; next = t;
        if (y + 2 < h) fillRow(y + 2, next); else next.set(cur);
      }
      octx.putImageData(img, 0, 0);
      if (style === 'ink' || style === 'lines') {
        // colour: a slow ramp through the palette on a tiny canvas, stretched smooth and kept only inside the mask
        const sw = Math.max(2, Math.round(24 * w / m)), sh = Math.max(2, Math.round(24 * h / m));
        const sc = blankCanvas(sw, sh), sctx = sc.getContext('2d'), si = sctx.createImageData(sw, sh), sp = new Int32Array(si.data.buffer);
        const coff = R() * 50, nc = style === 'lines' ? 3 : 4;
        for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
          const t = clamp01(0.5 + N.fbm(x / 24 * 1.4 + coff, y / 24 * 1.4 + 7, 2) * 1.9) * (nc - 1), k = Math.min(nc - 2, Math.floor(t)), f = t - k;
          const A0 = cols[k], A1 = cols[k + 1];
          sp[y * sw + x] = pack((A0[0] + (A1[0] - A0[0]) * f) | 0, (A0[1] + (A1[1] - A0[1]) * f) | 0, (A0[2] + (A1[2] - A0[2]) * f) | 0, 255);
        }
        sctx.putImageData(si, 0, 0);
        octx.globalCompositeOperation = 'source-in';
        octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
        octx.drawImage(sc, 0, 0, w, h);
        octx.globalCompositeOperation = 'source-over';
      }
      ctx.drawImage(cvs, 0, 0);
    },
  };

  // =====================================================================================
  // Branching: space colonisation (Runions et al.) with pipe-model tapering
  // =====================================================================================
  GENS.branch = {
    name: 'Branching',
    blurb: 'twigs racing toward the light',
    params: [
      { k: 'form', label: 'form', options: ['tree', 'fan', 'roots', 'burst'], def: 'tree' },
      { k: 'buds', label: 'buds', min: 100, max: 3000, step: 50, def: 1800 },
      { k: 'reach', label: 'reach', min: 20, max: 220, step: 5, def: 60 },
      { k: 'wander', label: 'wander', min: 0, max: 1.5, step: 0.05, def: 0.35 },
      { k: 'weight', label: 'weight', min: 0.2, max: 3, step: 0.05, def: 1 },
      { k: 'bloom', label: 'blossom', min: 0, max: 1, step: 0.05, def: 0.45 },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const UW = w / u, UH = h / u, cx = UW / 2, cy = UH / 2, M = Math.min(UW, UH);
      const D = 6, di = p.reach, dk = D * 1.7, dk2 = dk * dk, form = p.form;
      // ---- envelope, root and tropism per form (all in 1000-unit space)
      const wob = (a, s) => 1 + 0.28 * N.fbm(Math.cos(a) * 1.3 + s, Math.sin(a) * 1.3 - s, 3) * 2;
      let inside, root, pull;
      if (form === 'fan') {
        const ox = cx, oy = UH - 20, rad = Math.min(M * 0.9, UH - 60);
        inside = (x, y) => { const dx = x - ox, dy = y - oy, a = Math.atan2(dy, dx), r = Math.hypot(dx, dy); return dy < -30 && r < rad * wob(a, 3) && r > 60; };
        root = [ox, oy]; pull = [0, -0.12];
      } else if (form === 'roots') {
        const ox = cx, oy = 10;
        inside = (x, y) => { const t = (y - oy) / (UH - oy); if (t < 0.12 || t > 0.98) return false; const half = (UW * 0.5) * Math.pow(t, 0.55) * wob(t * 3, 5); return Math.abs(x - ox) < half && R() < 1.15 - t * 0.6; };
        root = [ox, oy]; pull = [0, 0.18];
      } else if (form === 'burst') {
        const rad = M * 0.47;
        inside = (x, y) => { const dx = x - cx, dy = y - cy, a = Math.atan2(dy, dx), r = Math.hypot(dx, dy); return r < rad * wob(a, 7) && r > M * 0.06; };
        root = [cx, cy]; pull = [0, 0];
      } else {
        const ccx = cx, ccy = UH * 0.41, rx = Math.min(UW * 0.46, M * 0.52), ry = M * 0.36;
        inside = (x, y) => { const dx = (x - ccx) / rx, dy = (y - ccy) / ry, a = Math.atan2(dy, dx); return dx * dx + dy * dy < wob(a, 1) ** 2 && y < UH * 0.8; };
        root = [cx + (R() - 0.5) * 40, UH + 4]; pull = [0, -0.06];
      }
      // ---- attractors (buds) + a static spatial hash over them
      const nA = Math.round(p.buds), ax = new Float64Array(nA), ay = new Float64Array(nA);
      let got = 0;
      for (let t = 0; got < nA && t < nA * 60; t++) {
        const x = 8 + R() * (UW - 16), y = 8 + R() * (UH - 16);
        if (inside(x, y)) { ax[got] = x; ay[got] = y; got++; }
      }
      const A = got, alive = new Uint8Array(A).fill(1), closest = new Int32Array(A).fill(-1), cd = new Float64Array(A).fill(di * di);
      const cw = Math.ceil(UW / di) + 2, ch = Math.ceil(UH / di) + 2, cellOf = (x, y) => (Math.floor(y / di) + 1) * cw + Math.floor(x / di) + 1;
      const start = new Int32Array(cw * ch + 1), items = new Int32Array(A);
      for (let a = 0; a < A; a++) start[cellOf(ax[a], ay[a]) + 1]++;
      for (let i = 0; i < cw * ch; i++) start[i + 1] += start[i];
      const fillp = start.slice();
      for (let a = 0; a < A; a++) items[fillp[cellOf(ax[a], ay[a])]++] = a;

      // ---- nodes
      const nx = [], ny = [], par = [], kids = [];
      const addNode = (x, y, pa) => {
        const id = nx.length;
        nx.push(x); ny.push(y); par.push(pa); kids.push(0);
        if (pa >= 0) kids[pa]++;
        const gx = Math.floor(x / di) + 1, gy = Math.floor(y / di) + 1;
        let hit = false;
        for (let yy = gy - 1; yy <= gy + 1; yy++) {
          if (yy < 0 || yy >= ch) continue;
          for (let xx = gx - 1; xx <= gx + 1; xx++) {
            if (xx < 0 || xx >= cw) continue;
            const c = yy * cw + xx;
            for (let k = start[c]; k < start[c + 1]; k++) {
              const a = items[k];
              if (!alive[a]) continue;
              const dx = ax[a] - x, dy = ay[a] - y, d2 = dx * dx + dy * dy;
              if (d2 < dk2) { alive[a] = 0; continue; }
              if (d2 < cd[a]) { cd[a] = d2; closest[a] = id; hit = true; }
            }
          }
        }
        return hit;
      };
      const ws = 0.004, wander = p.wander;
      // trunk: grow from the root toward the centre of the buds until one of them notices
      let mx = 0, my = 0;
      for (let a = 0; a < A; a++) { mx += ax[a]; my += ay[a]; }
      mx = A ? mx / A : cx; my = A ? my / A : cy;
      let tip = 0, seen = addNode(root[0], root[1], -1);
      for (let s = 0; !seen && s < 400 && A; s++) {
        let dx = mx - nx[tip], dy = my - ny[tip];
        const l = Math.hypot(dx, dy) || 1, na = N.fbm(nx[tip] * ws, ny[tip] * ws, 2) * TAU * 1.5;
        dx = dx / l + Math.cos(na) * wander * 0.35; dy = dy / l + Math.sin(na) * wander * 0.35;
        const l2 = Math.hypot(dx, dy) || 1;
        seen = addNode(nx[tip] + dx / l2 * D, ny[tip] + dy / l2 * D, tip);
        tip = nx.length - 1;
      }
      // ---- colonise: every bud pulls on its closest node, every pulled node grows one step
      const sx = [], sy = [], sc = [];
      for (let iter = 0; iter < 500; iter++) {
        const touched = [];
        for (let a = 0; a < A; a++) {
          if (!alive[a]) continue;
          const c = closest[a];
          if (c < 0) continue;
          const d = Math.sqrt(cd[a]) || 1;
          if (sc[c] === undefined || sc[c] === 0) { sx[c] = 0; sy[c] = 0; sc[c] = 0; touched.push(c); }
          sx[c] += (ax[a] - nx[c]) / d; sy[c] += (ay[a] - ny[c]) / d; sc[c]++;
        }
        if (!touched.length) break;
        let grew = 0;
        for (const c of touched) {
          let dx = sx[c] / sc[c], dy = sy[c] / sc[c];
          const l = Math.hypot(dx, dy);
          sc[c] = 0;
          if (l < 1e-3 || kids[c] > 3) continue;
          const na = N.fbm(nx[c] * ws + 9, ny[c] * ws, 2) * TAU * 1.5;
          dx = dx / l + pull[0] + Math.cos(na) * wander * 0.3; dy = dy / l + pull[1] + Math.sin(na) * wander * 0.3;
          const l2 = Math.hypot(dx, dy) || 1;
          addNode(nx[c] + dx / l2 * D, ny[c] + dy / l2 * D, c);
          grew++;
        }
        if (!grew) break;
      }
      // ---- prune spurs: side twigs of one or two nodes read as thorns, not branches
      const n0 = nx.length, size = new Int32Array(n0).fill(1), keep = new Int32Array(n0).fill(-1);
      for (let i = n0 - 1; i > 0; i--) size[par[i]] += size[i];
      let n = 0;
      for (let i = 0; i < n0; i++) {
        const pa = par[i];
        if (pa >= 0 && (keep[pa] < 0 || (kids[pa] > 1 && size[i] <= 3))) continue;
        keep[i] = n;
        nx[n] = nx[i]; ny[n] = ny[i]; par[n] = pa >= 0 ? keep[pa] : -1; kids[n] = 0;
        if (pa >= 0) kids[par[n]]++;
        n++;
      }
      // ---- pipe model: a branch is as thick as all the twigs it carries
      const tips = new Float64Array(n), depth = new Float64Array(n);
      for (let i = n - 1; i >= 0; i--) { if (!kids[i]) tips[i] = 1; if (par[i] >= 0) tips[par[i]] += tips[i]; }
      let maxD = 1;
      for (let i = 1; i < n; i++) { depth[i] = depth[par[i]] + 1; if (depth[i] > maxD) maxD = depth[i]; }
      const cols = byContrast(pal), wt = p.weight;
      const widthOf = i => wt * (0.7 + 1.05 * Math.pow(tips[i], 0.56)) * u;
      // ---- draw: bucket segments by (colour step, width step), widest first; round caps hide the joints
      const buckets = new Map();
      for (let i = 1; i < n; i++) {
        const wv = widthOf(i), wq = Math.round(Math.log(wv / u) / Math.log(1.13)), cq = Math.min(5, Math.floor(depth[i] / maxD * 6));
        const key = wq * 8 + cq;
        let b = buckets.get(key);
        if (!b) { b = { w: Math.pow(1.13, wq) * u, cq, path: [] }; buckets.set(key, b); }
        b.path.push(nx[par[i]] * u, ny[par[i]] * u, nx[i] * u, ny[i] * u);
      }
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const ramp = t => mix(cols[0], cols[1], smooth(t * 1.2 - 0.1));
      [...buckets.values()].sort((a, b) => b.w - a.w).forEach(b => {
        ctx.beginPath();
        const P = b.path;
        for (let k = 0; k < P.length; k += 4) { ctx.moveTo(P[k], P[k + 1]); ctx.lineTo(P[k + 2], P[k + 3]); }
        ctx.lineWidth = b.w; ctx.strokeStyle = ramp(b.cq / 5); ctx.stroke();
      });
      // ---- blossoms: little clusters of petals at some of the tips
      if (p.bloom > 0) {
        const bc = cols.slice(2), paths = bc.map(() => new Path2D()), sw = Math.sqrt(wt);
        for (let i = 1; i < n; i++) {
          if (kids[i] || R() > p.bloom) continue;
          const k = Math.floor(R() * bc.length), cnt = 1 + Math.floor(R() * 4);
          for (let j = 0; j < cnt; j++) {
            const r = (1.8 + R() * 4.2) * u * sw, a = R() * TAU, d = j ? (3 + R() * 6) * u * sw : 0;
            const x = nx[i] * u + Math.cos(a) * d, y = ny[i] * u + Math.sin(a) * d;
            paths[k].moveTo(x + r, y); paths[k].arc(x, y, r, 0, TAU);
          }
        }
        ctx.globalAlpha = 0.9;
        paths.forEach((pa, k) => { ctx.fillStyle = bc[k]; ctx.fill(pa); });
        ctx.globalAlpha = 1;
      }
    },
  };

  // =====================================================================================
  // Phyllotaxis: Vogel's sunflower model, one or many heads
  // =====================================================================================
  const GOLDEN = 180 * (3 - Math.sqrt(5)); // 137.5077...
  const FIB = [5, 8, 13, 21, 34, 55, 89, 144];
  GENS.phyllo = {
    name: 'Phyllotaxis',
    blurb: 'seeds spun by the golden angle',
    params: [
      { k: 'count', label: 'seeds', min: 60, max: 3000, step: 10, def: 700 },
      { k: 'twist', label: 'twist', min: -3, max: 3, step: 0.01, def: 0 },
      { k: 'style', label: 'style', options: ['petals', 'seeds', 'dots', 'rings'], def: 'petals' },
      { k: 'color', label: 'colour by', options: ['spirals', 'lattice', 'rings', 'scatter'], def: 'spirals' },
      { k: 'heads', label: 'heads', min: 1, max: 12, step: 1, def: 1 },
      { k: 'size', label: 'size', min: 0.3, max: 1.6, step: 0.01, def: 0.94 },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const m = Math.min(w, h), nh = Math.round(p.heads), heads = [];
      if (nh === 1) heads.push({ x: w / 2, y: h / 2, r: p.size * m / 2 });
      else {
        // pack heads biggest first; shrink a head until it fits
        const base = p.size * Math.sqrt(w * h * 0.62 / nh / Math.PI);
        for (let k = 0; k < nh; k++) {
          let r = base * (k === 0 ? 1.35 : 0.55 + R() * 0.7), placed = false;
          for (let s = 0; s < 60 && !placed; s++, r *= 0.93) {
            for (let t = 0; t < 40 && !placed; t++) {
              const x = r * 0.4 + R() * (w - r * 0.8), y = r * 0.4 + R() * (h - r * 0.8);
              if (heads.every(o => Math.hypot(o.x - x, o.y - y) > o.r + r + 6 * u)) { heads.push({ x, y, r }); placed = true; }
            }
          }
        }
      }
      const area = heads.reduce((s, o) => s + o.r * o.r, 0), cols = byContrast(pal), nc = cols.length;
      const alpha = (GOLDEN + p.twist) * Math.PI / 180, style = p.style;
      heads.forEach((H, hi) => {
        const n = Math.max(24, Math.round(p.count * H.r * H.r / area)), c = H.r / Math.sqrt(n);
        const rot = R() * TAU, cshift = Math.floor(R() * nc);
        // spiral families: the Fibonacci number whose arms show near the rim, and its smaller neighbour.
        // Seeds i and i + F2 sit side by side, so arm (i mod F) * F2 mod F walks the arms in angular order.
        const want = Math.sqrt(n) * 1.25, F = FIB.reduce((a, b) => (Math.abs(b - want) < Math.abs(a - want) ? b : a));
        const fi = FIB.indexOf(F), F2 = FIB[fi - 1] || 3, F3 = FIB[fi - 2] || 2;
        const arm = (i, A, B) => ((i % A) * B) % A;
        const colOf = i => {
          if (p.color === 'rings') return mix(cols[cshift % nc], cols[(cshift + 1) % nc], Math.sqrt(i / n));
          if (p.color === 'scatter') return cols[Math.floor(R() * nc)];
          if (p.color === 'spirals') return cols[(Math.floor(arm(i, F, F2) * nc / F) + cshift) % nc];
          // lattice: bands of both families crossing, a chequer of diamonds that spirals both ways
          const a = Math.floor(arm(i, F, F2) * 10 / F), b = Math.floor(arm(i, F2, F3) * 8 / F2);
          return (a + b) % 2 ? cols[cshift % nc] : cols[(cshift + 1 + (a % 2)) % nc];
        };
        if (style === 'petals') {
          // outermost petals first so the inner ones overlap them, like a dahlia
          ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(0.6, c * 0.09); ctx.strokeStyle = pal.bg;
          const ink = [pal.bg, ...pal.c].reduce((a, b) => (lum(a) <= lum(b) ? a : b));
          for (let i = n - 1; i >= 0; i--) {
            const rr = c * Math.sqrt(i + 0.5), a = i * alpha + rot, ca = Math.cos(a), sa = Math.sin(a), t = rr / H.r;
            const L = c * (1.5 + 3.2 * t * t), Wd = c * (0.8 + 0.7 * t);
            const bx = H.x + ca * (rr - L * 0.35), by = H.y + sa * (rr - L * 0.35), tx = H.x + ca * (rr + L * 0.65), ty = H.y + sa * (rr + L * 0.65);
            const mx = (bx + tx) / 2, my = (by + ty) / 2;
            ctx.beginPath(); ctx.moveTo(bx, by);
            ctx.quadraticCurveTo(mx - sa * Wd, my + ca * Wd, tx, ty);
            ctx.quadraticCurveTo(mx + sa * Wd, my - ca * Wd, bx, by);
            // shaded from a darker heart to a lit tip, so the layers of petals read as depth
            const col = colOf(i), g = ctx.createLinearGradient(bx, by, tx, ty);
            g.addColorStop(0, mix(col, ink, 0.4)); g.addColorStop(0.6, col); g.addColorStop(1, mix(col, '#ffffff', 0.1));
            ctx.fillStyle = g; ctx.fill(); ctx.stroke();
          }
        } else {
          const paths = new Map();
          const pathFor = col => { let pa = paths.get(col); if (!pa) { pa = new Path2D(); paths.set(col, pa); } return pa; };
          for (let i = 0; i < n; i++) {
            const rr = c * Math.sqrt(i + 0.5), a = i * alpha + rot, x = H.x + Math.cos(a) * rr, y = H.y + Math.sin(a) * rr, t = rr / H.r;
            const pa = pathFor(colOf(i));
            if (style === 'seeds') { const rx = c * (0.5 + 0.2 * t), ry = c * (0.34 + 0.12 * t); pa.moveTo(x + Math.cos(a) * rx, y + Math.sin(a) * rx); pa.ellipse(x, y, rx, ry, a, 0, TAU); }
            else if (style === 'dots') { const r = c * (0.18 + 0.34 * t); pa.moveTo(x + r, y); pa.arc(x, y, r, 0, TAU); }
            else { const r = c * (0.26 + 0.28 * t); pa.moveTo(x + r, y); pa.arc(x, y, r, 0, TAU); }
          }
          if (style === 'rings') { ctx.lineWidth = Math.max(1, c * 0.27); paths.forEach((pa, col) => { ctx.strokeStyle = col; ctx.stroke(pa); }); }
          else paths.forEach((pa, col) => { ctx.fillStyle = col; ctx.fill(pa); });
        }
      });
    },
  };
})();
