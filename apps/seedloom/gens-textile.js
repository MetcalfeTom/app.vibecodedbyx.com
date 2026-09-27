// Seedloom textile looms: tartan, stitchwork, kilim. Loaded after gens.js, adds to window.SL.GENS.
// Same contract as gens.js: draw(ctx, w, h, p, R, pal, N, u), sizes in u (= min(w,h)/1000), R/N seeded.
(function () {
  const { TAU, pick, GENS } = window.SL;

  // ---------- small helpers (hex in, hex out, so they chain) ----------
  const toRGB = hx => { const n = parseInt(hx.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const toHex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const tint = (a, b, k) => { const A = toRGB(a), B = toRGB(b); return toHex(A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k); };
  const lum = hx => { const [r, g, b] = toRGB(hx); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  const mod = (a, n) => ((a % n) + n) % n;
  const shuffle = (R, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const canvas = (w, h) => { const c = typeof document !== 'undefined' ? document.createElement('canvas') : new OffscreenCanvas(1, 1); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  // a small tile repeated across the canvas, scaled from its pixel grid to the real thread size
  const tilePattern = (ctx, img, s, ox = 0, oy = 0) => {
    const pat = ctx.createPattern(img, 'repeat');
    pat.setTransform(new DOMMatrix([s, 0, 0, s, ox, oy]));
    return pat;
  };
  const oddify = v => { v = Math.max(1, Math.round(v)); return v % 2 ? v : v + 1; };

  // ================= Tartan: a symmetric sett woven in twill =================
  // warp over weft at (i, j)? i = thread column, j = thread row
  const WEAVE = {
    twill: (i, j) => mod(i - j, 4) < 2,
    herringbone: (i, j) => mod((mod(i, 8) < 4 ? i + j : i - j), 4) < 2,
    plain: (i, j) => mod(i + j, 2) === 0,
    basket: (i, j) => mod((i >> 1) + (j >> 1), 2) === 0,
  };
  // a sett: stripes of thread counts, mirrored at both pivots, as a colour index per thread
  function makeSett(R, n, nc) {
    const s = [];
    let prev = -1;
    for (let k = 0; k < n; k++) {
      let c = Math.floor(R() * nc);
      if (c === prev) c = (c + 1 + Math.floor(R() * (nc - 1))) % nc;
      const wide = k === 0 ? R() < 0.7 : R() < 0.48;
      s.push([c, wide ? pick(R, [12, 16, 20, 24, 28, 32, 40]) : pick(R, [2, 2, 4, 4, 4, 6, 8])]);
      prev = c;
    }
    const full = s.concat(s.slice(1, -1).reverse()), seq = [];
    for (const [c, k] of full) for (let i = 0; i < k; i++) seq.push(c);
    return { seq, first: s[0][1] };
  }

  GENS.tartan = {
    name: 'Tartan',
    blurb: 'a sett woven over and under',
    params: [
      { k: 'stripes', label: 'stripes', min: 2, max: 12, step: 1, def: 6 },
      { k: 'thread', label: 'thread', min: 1.5, max: 16, step: 0.1, def: 3.6 },
      { k: 'weave', label: 'weave', options: ['twill', 'herringbone', 'plain', 'basket'], def: 'twill' },
      { k: 'weft', label: 'weft', options: ['same as warp', 'own sett'], def: 'same as warp' },
      { k: 'colours', label: 'colours', min: 2, max: 6, step: 1, def: 4 },
      { k: 'texture', label: 'texture', min: 0, max: 1, step: 0.05, def: 0.7 },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const t = Math.max(0.75, p.thread * u), nc = Math.round(p.colours);
      const cols = shuffle(R, [pal.bg, ...pal.c]).slice(0, nc);
      const warpS = makeSett(R, Math.round(p.stripes), nc);
      const weftS = p.weft === 'own sett' ? makeSett(R, Math.round(p.stripes), nc) : warpS;
      const nI = Math.ceil(w / t) + 1, nJ = Math.ceil(h / t) + 1;
      const ci = Math.floor(w / 2 / t), cj = Math.floor(h / 2 / t);
      const warp = new Uint8Array(nI), weft = new Uint8Array(nJ);
      for (let i = 0; i < nI; i++) warp[i] = warpS.seq[mod(i - ci + (warpS.first >> 1), warpS.seq.length)];
      for (let j = 0; j < nJ; j++) weft[j] = weftS.seq[mod(j - cj + (weftS.first >> 1), weftS.seq.length)];
      const S = v => Math.round(v * t);
      const runs = (arr, fn) => { let s = 0; for (let i = 1; i <= arr.length; i++) if (i === arr.length || arr[i] !== arr[s]) { fn(arr[s], s, i); s = i; } };

      // 1) the weft: plain horizontal stripes underneath
      const wf = cols.map(() => new Path2D());
      runs(weft, (c, a, b) => wf[c].rect(0, S(a), w, S(b) - S(a)));
      wf.forEach((pa, c) => { ctx.fillStyle = cols[c]; ctx.fill(pa); });

      // 2) the warp: vertical stripes, only where the weave lifts the warp thread over
      const weave = WEAVE[p.weave] || WEAVE.twill, P = 8, K = Math.max(2, Math.min(48, Math.ceil(t)));
      const lifted = new Path2D();
      for (let b = 0; b < P; b++) for (let a = 0; a < P; a++) if (weave(a, b)) lifted.rect(a * K, b * K, K, K);
      const wp = cols.map(() => new Path2D()), used = new Set();
      runs(warp, (c, a, b) => { wp[c].rect(S(a), 0, S(b) - S(a), h); used.add(c); });
      for (const c of used) {
        const tc = canvas(P * K, P * K), tx = tc.getContext('2d');
        tx.fillStyle = cols[c]; tx.fill(lifted);
        ctx.fillStyle = tilePattern(ctx, tc, t / K); ctx.fill(wp[c]);
      }

      const T = p.texture;
      if (T <= 0) return;
      // 3) yarn: every thread a touch lighter or darker than its neighbours
      const slub = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      for (let i = 0; i < nI; i++) { const k = Math.floor(R() * 7); if (k < 4) slub[k].rect(S(i), 0, S(i + 1) - S(i), h); }
      for (let j = 0; j < nJ; j++) { const k = Math.floor(R() * 7); if (k < 4) slub[k].rect(0, S(j), w, S(j + 1) - S(j)); }
      ['rgba(0,0,0,0.09)', 'rgba(0,0,0,0.045)', 'rgba(255,255,255,0.035)', 'rgba(255,255,255,0.07)'].forEach((c, k) => {
        ctx.globalAlpha = T; ctx.fillStyle = c; ctx.fill(slub[k]);
      });
      ctx.globalAlpha = 1;

      // 4) relief: round each float and tuck its ends under the crossing thread (one tile, repeated)
      const sc = canvas(P * K, P * K), sx = sc.getContext('2d');
      const dk = a => `rgba(0,0,0,${(a * T).toFixed(3)})`, lt = a => `rgba(255,255,255,${(a * T).toFixed(3)})`;
      for (let b = 0; b < P; b++) for (let a = 0; a < P; a++) {
        const x = a * K, y = b * K, up = weave(a, b);
        let g = up ? sx.createLinearGradient(x, 0, x + K, 0) : sx.createLinearGradient(0, y, 0, y + K);
        g.addColorStop(0, dk(0.5)); g.addColorStop(0.28, dk(0)); g.addColorStop(0.45, lt(0.2)); g.addColorStop(0.62, dk(0)); g.addColorStop(1, dk(0.42));
        sx.fillStyle = g; sx.fillRect(x, y, K, K);
        const s0 = up ? !weave(a, b - 1) : weave(a - 1, b), s1 = up ? !weave(a, b + 1) : weave(a + 1, b);
        if (s0) {
          g = up ? sx.createLinearGradient(0, y, 0, y + K * 0.7) : sx.createLinearGradient(x, 0, x + K * 0.7, 0);
          g.addColorStop(0, dk(0.62)); g.addColorStop(1, dk(0)); sx.fillStyle = g; sx.fillRect(x, y, K, K);
        }
        if (s1) {
          g = up ? sx.createLinearGradient(0, y + K, 0, y + K * 0.3) : sx.createLinearGradient(x + K, 0, x + K * 0.3, 0);
          g.addColorStop(0, dk(0.62)); g.addColorStop(1, dk(0)); sx.fillStyle = g; sx.fillRect(x, y, K, K);
        }
      }
      ctx.fillStyle = tilePattern(ctx, sc, t / K); ctx.fillRect(0, 0, w, h);
    },
  };

  // ================= Stitchwork: fair isle bands, samplers and beadwork =================
  // an 8-fold symmetric motif of radius r: 0 = ground, 1 = main colour, 2 = accent
  function makeMotif(R, r, fam) {
    const n = 2 * r + 1, M = new Uint8Array(n * n);
    fam = fam || pick(R, ['star', 'rose', 'flake', 'lozenge', 'star', 'rose']);
    const a = Math.max(1, Math.round(r * (0.5 + R() * 0.18)));
    const inStar = (ax, ay, s) => ax <= a * s + 0.01 || ax + ay <= r * s + 0.01;
    const hollow = R() < 0.45, checker = R() < 0.5, q = pick(R, [2, 2, 3]);
    const branches = [];
    for (let k = 2; k < r; k += 2 + Math.floor(R() * 2)) branches.push([k, 1 + Math.floor(R() * Math.max(1, (r - k) * 0.8))]);
    const diag = Math.ceil(r * (0.45 + R() * 0.35));
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
      const ax = Math.max(Math.abs(x), Math.abs(y)), ay = Math.min(Math.abs(x), Math.abs(y)), d = ax + ay;
      let v = 0;
      if (fam === 'star') { // octagram: a square and a diamond laid over each other
        if (inStar(ax, ay, 1)) v = 1;
        if (hollow && r > 3 && inStar(ax, ay, 1 - 1.7 / r)) v = 0;
        if (inStar(ax, ay, 0.5)) v = checker ? (d & 1 ? 0 : 2) : 2;
        if (d <= 1) v = hollow ? 2 : 1;
      } else if (fam === 'rose') { // eight petals split by the axes and diagonals
        if (inStar(ax, ay, 1) && ay !== 0 && ax !== ay) v = d <= r * 0.5 ? 2 : 1;
        if (d === 0) v = 2;
        if (checker && v === 1 && (d & 1) && d > r * 0.5 + 1) v = 0;
      } else if (fam === 'flake') { // arms with v-shaped branches
        if (ay === 0 || (ax === ay && ax <= diag)) v = 1;
        for (const [k, L] of branches) if (ax - ay === k && ay <= L) v = 1;
        if (d <= 1) v = 2;
        if (ax === r && ay === 0) v = 2;
      } else { // nested lozenges with a cross
        if (d <= r) v = Math.floor(d / q) & 1 ? 0 : 1;
        if (d <= r && ax === ay && !(ax & 1)) v = 2;
        if (d <= 1) v = 2;
      }
      M[(y + r) * n + x + r] = v;
    }
    return { r, n, M };
  }
  const motifAt = (m, x, y) => (Math.abs(x) > m.r || Math.abs(y) > m.r) ? 0 : m.M[(y + m.r) * m.n + x + m.r];
  // small filler between big motifs
  function makeFiller(R, f) {
    const kind = pick(R, ['diamond', 'cross', 'dot-diamond', 'x']);
    return (x, y) => {
      const ax = Math.abs(x), ay = Math.abs(y);
      if (ax > f || ay > f) return 0;
      if (kind === 'diamond') return ax + ay <= f ? (ax + ay === 0 && f > 1 ? 2 : 1) : 0;
      if (kind === 'cross') return (ax === 0 || ay === 0) ? (ax + ay === 0 ? 2 : 1) : 0;
      if (kind === 'x') return ax === ay ? (ax === 0 ? 2 : 1) : 0;
      return ax + ay === f || ax + ay === 0 ? 1 : 0;
    };
  }
  // peerie: a small repeating border, h rows tall; fn(X, y0) with y0 = 0..h-1
  function makePeerie(R) {
    const kind = pick(R, ['zigzag', 'diamonds', 'lice', 'checks', 'crosses', 'waves', 'waves', 'diamonds']);
    if (kind === 'zigzag') { const m = pick(R, [2, 3]); return { h: m + 1, fn: (X, y) => (y === Math.abs(mod(X, 2 * m) - m) ? 1 : 0) }; }
    if (kind === 'diamonds') {
      const k = pick(R, [1, 2, 2]), P = 2 * k + 2, solid = R() < 0.5;
      return { h: 2 * k + 1, fn: (X, y) => { const lx = Math.abs(X - P * Math.round(X / P)), d = lx + Math.abs(y - k); return solid ? (d <= k ? (d === 0 ? 2 : 1) : 0) : (d === k ? 1 : d === 0 ? 2 : 0); } };
    }
    if (kind === 'lice') return { h: 3, fn: (X, y) => ((y === 1 && mod(X, 4) === 0) || (y !== 1 && mod(X, 4) === 2) ? 1 : 0) };
    if (kind === 'checks') return { h: 2, fn: (X, y) => (mod(X + y, 2) === 0 ? 1 : 0) };
    if (kind === 'crosses') return { h: 3, fn: (X, y) => { const lx = Math.abs(X - 4 * Math.round(X / 4)), ly = Math.abs(y - 1); return (lx === 0 && ly <= 1) || (ly === 0 && lx <= 1) ? (lx + ly === 0 ? 2 : 1) : 0; } };
    const m = pick(R, [2, 3]);
    return { h: 2 * m + 1, fn: (X, y) => { const tri = Math.abs(mod(X, 2 * m) - m), ly = Math.abs(y - m); return ly === tri ? 1 : (ly === 0 && tri === m ? 2 : 0); } };
  }

  // one stitch drawn once per colour, then stamped everywhere
  function knitSprite(col, W, H) {
    const c = canvas(W, H), x = c.getContext('2d');
    const dark = tint(col, '#000000', 0.5), light = tint(col, '#ffffff', 0.28);
    for (const side of [-1, 1]) {
      x.save();
      x.translate(W / 2 + side * W * 0.235, H * 0.575);
      x.rotate(side * 0.42);
      const rx = W * 0.25, ry = H * 0.42;
      const g = x.createLinearGradient(-rx, 0, rx, 0);
      g.addColorStop(0, dark); g.addColorStop(0.3, col); g.addColorStop(0.55, light); g.addColorStop(0.8, col); g.addColorStop(1, dark);
      x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, rx, ry, 0, 0, TAU); x.fill();
      const g2 = x.createLinearGradient(0, -ry, 0, ry);
      g2.addColorStop(0, 'rgba(0,0,0,0.45)'); g2.addColorStop(0.3, 'rgba(0,0,0,0)'); g2.addColorStop(0.85, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,0.3)');
      x.fillStyle = g2; x.fill();
      x.restore();
    }
    return c;
  }
  function crossSprite(col, W) {
    const c = canvas(W, W), x = c.getContext('2d');
    const e = W * 0.17, lw = W * 0.27, a = e, b = W - e;
    x.lineCap = 'round';
    const line = (x1, y1, x2, y2) => { x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2, y2); x.stroke(); };
    x.strokeStyle = 'rgba(0,0,0,0.3)'; x.lineWidth = lw;
    const o = W * 0.05;
    line(a + o, b + o, b + o, a + o); line(a + o, a + o, b + o, b + o);
    const leg = (x1, y1, x2, y2, base) => {
      x.lineWidth = lw; x.strokeStyle = base; line(x1, y1, x2, y2);
      // two strands of floss, twisted: a dark seam down the middle and a light sheen on one side
      x.lineWidth = lw * 0.14; x.strokeStyle = 'rgba(0,0,0,0.28)'; line(x1, y1, x2, y2);
      const nx = (y2 - y1), ny = -(x2 - x1), L = Math.hypot(nx, ny), s = lw * 0.24;
      x.lineWidth = lw * 0.2; x.strokeStyle = 'rgba(255,255,255,0.32)';
      line(x1 + nx / L * s, y1 + ny / L * s, x2 + nx / L * s, y2 + ny / L * s);
    };
    leg(a, b, b, a, tint(col, '#000000', 0.16));
    leg(a, a, b, b, col);
    return c;
  }
  function beadSprite(col, W, H) {
    const c = canvas(W, H), x = c.getContext('2d');
    const bx = W * 0.05, by = H * 0.07, bw = W * 0.9, bh = H * 0.86, r = Math.min(bw, bh) * 0.32;
    x.beginPath(); if (x.roundRect) x.roundRect(bx, by, bw, bh, r); else x.rect(bx, by, bw, bh);
    x.fillStyle = col; x.fill();
    const g = x.createLinearGradient(0, by, 0, by + bh);
    g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(0.3, 'rgba(255,255,255,0.05)'); g.addColorStop(0.62, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.42)');
    x.fillStyle = g; x.fill();
    x.beginPath(); x.ellipse(W * 0.34, H * 0.29, W * 0.15, H * 0.075, 0, 0, TAU);
    x.fillStyle = 'rgba(255,255,255,0.7)'; x.fill();
    return c;
  }

  GENS.stitch = {
    name: 'Stitchwork',
    blurb: 'fair isle stars, stitch by stitch',
    params: [
      { k: 'style', label: 'stitch', options: ['knit', 'cross-stitch', 'beads'], def: 'knit' },
      { k: 'layout', label: 'layout', options: ['bands', 'all-over'], def: 'bands' },
      { k: 'size', label: 'stitch size', min: 5, max: 40, step: 0.5, def: 12 },
      { k: 'motif', label: 'motif', min: 3, max: 12, step: 1, def: 6 },
      { k: 'colours', label: 'colours', min: 2, max: 6, step: 1, def: 5 },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const style = p.style, sw = p.size * u, sh = style === 'knit' ? sw * 0.8 : style === 'beads' ? sw * 0.86 : sw;
      const nx = Math.ceil(w / 2 / sw) + 1, ny = Math.ceil(h / 2 / sh) + 1, Wd = 2 * nx + 1, Hd = 2 * ny + 1;
      const C = [pal.bg, ...pal.c], L = C.map(lum), bgL = L[0];
      // grounds sit close to the background, pattern colours stand out from it
      const byNear = [0, 1, 2, 3, 4, 5].sort((a, b) => Math.abs(L[a] - bgL) - Math.abs(L[b] - bgL));
      const nc = Math.round(p.colours), open = style === 'cross-stitch';
      const nG = open ? 0 : nc >= 4 ? 2 : 1;
      const grounds = open ? [-1] : byNear.slice(0, nG);
      let cand = byNear.slice().reverse().filter(c => !grounds.includes(c));
      if (open) { const vivid = cand.filter(c => c !== 0 && Math.abs(L[c] - bgL) > 0.25); if (vivid.length >= 2) cand = vivid; }
      const fgs = shuffle(R, cand.slice(0, Math.max(1, nc - nG)));
      const contrastWith = (g, k) => { // k-th pattern colour, skipping ones too close to this ground
        if (g < 0) return fgs[k % fgs.length];
        const ok = fgs.filter(c => Math.abs(L[c] - L[g]) > 0.25);
        const list = ok.length ? ok : fgs.slice().sort((a, b) => Math.abs(L[b] - L[g]) - Math.abs(L[a] - L[g])).slice(0, 1);
        return list[k % list.length];
      };
      const D = new Int8Array(Wd * Hd).fill(-1);
      const set = (X, Y, v) => { D[(Y + ny) * Wd + X + nx] = v; };
      const r0 = Math.round(p.motif);

      if (p.layout === 'all-over') {
        const A = makeMotif(R, r0), rb = Math.max(1, Math.round(r0 * 0.45)), B = rb > 1 ? makeMotif(R, rb, pick(R, ['star', 'lozenge', 'flake'])) : null;
        const Pd = 2 * (r0 + 2), half = Pd / 2, g = grounds[0];
        const a1 = contrastWith(g, 0), a2 = contrastWith(g, 1), b1 = contrastWith(g, 2);
        for (let Y = -ny; Y <= ny; Y++) for (let X = -nx; X <= nx; X++) {
          const lx = X - Pd * Math.round(X / Pd), ly = Y - Pd * Math.round(Y / Pd);
          let v = motifAt(A, lx, ly), c = v === 1 ? a1 : a2;
          if (!v) {
            const ox = half - Math.abs(lx), oy = half - Math.abs(ly);
            v = B ? motifAt(B, ox, oy) : (ox + oy <= 1 ? 1 : 0); c = v === 1 ? b1 : a1;
            // a dotted trellis joining the motifs
            if (!v && ox === oy && ox > rb + 1 && !(ox & 1)) { v = 1; c = b1; }
          }
          set(X, Y, v ? c : g);
        }
      } else {
        // bands, mirrored around the middle like a yoke: one big star band, peeries and stripes outwards
        const bands = [];
        const motifBand = (r) => {
          const M = makeMotif(R, r), f = Math.max(1, Math.min(3, Math.round(r / 3))), F = makeFiller(R, f), c = r + 2 + f, Pd = 2 * c;
          return { h: 2 * r + 3, fn: (X, y) => {
            const ly = y - r - 1, lx = X - Pd * Math.round(X / Pd);
            if (Math.abs(lx) <= r) return motifAt(M, lx, ly);
            return F(c - Math.abs(lx), ly);
          } };
        };
        bands.push(motifBand(r0));
        let pos = (bands[0].h + 1) / 2, k = 1;
        while (pos < ny + 1) {
          const unit = [{ h: 1, fn: () => 0 }, makePeerie(R), { h: 1, fn: () => 0 }];
          if (R() < 0.5) unit.push({ h: 1, fn: () => 1 }, { h: 1, fn: () => 0 });
          unit.push(k % 2 ? motifBand(Math.max(2, Math.round(r0 * (0.5 + R() * 0.3)))) : motifBand(r0));
          for (const b of unit) { bands.push(b); pos += b.h; }
          k++;
        }
        // colour each band: its ground and two pattern colours
        bands.forEach((b, i) => {
          b.g = grounds[Math.floor(Math.max(0, i - 1) / 3) % grounds.length]; // the ground shifts every few bands
          b.c1 = contrastWith(b.g, i); b.c2 = contrastWith(b.g, i + 1);
        });
        // unify runs: the spacer rows share the ground of the next band out
        for (let i = bands.length - 2; i >= 1; i--) if (bands[i].h === 1) bands[i].g = bands[i + 1].g;
        const rowOf = [];
        bands[0].start = -(bands[0].h - 1) / 2;
        let s = (bands[0].h + 1) / 2;
        for (let i = 1; i < bands.length; i++) { bands[i].start = s; s += bands[i].h; }
        for (let dY = 0; dY <= ny; dY++) {
          if (dY < (bands[0].h + 1) / 2) { rowOf[dY] = [bands[0], dY - bands[0].start]; continue; }
          const b = bands.find((bb, i) => i > 0 && dY >= bb.start && dY < bb.start + bb.h);
          rowOf[dY] = [b, dY - b.start];
        }
        for (let Y = -ny; Y <= ny; Y++) {
          const [b, y] = rowOf[Math.abs(Y)];
          for (let X = -nx; X <= nx; X++) {
            const v = b.fn(X, y);
            set(X, Y, v === 1 ? b.c1 : v === 2 ? b.c2 : b.g);
          }
        }
      }

      // stamp the stitches: one sprite per colour used as a pattern, filled over runs of equal stitches
      const knit = style === 'knit', Wp = Math.max(3, Math.ceil(sw));
      const Hp = knit ? Math.ceil(Wp * 0.8 * 1.55) : style === 'beads' ? Math.ceil(Wp * 0.86) : Wp;
      const dh = knit ? sh * 1.55 : sh, lift = knit ? sh * 0.55 : 0, ox = w / 2 - (nx + 0.5) * sw;
      const pats = new Map();
      const pat = ci => {
        if (!pats.has(ci)) pats.set(ci, ctx.createPattern(knit ? knitSprite(C[ci], Wp, Hp) : style === 'beads' ? beadSprite(C[ci], Wp, Hp) : crossSprite(C[ci], Wp), 'repeat'));
        return pats.get(ci);
      };
      if (!open) { // the dark between the stitches
        ctx.fillStyle = tint(C[grounds[0]], '#000000', knit ? 0.6 : 0.7);
        ctx.fillRect(0, 0, w, h);
      }
      const rowRuns = (Y, top, add) => {
        const base = (Y + ny) * Wd;
        let s = 0;
        for (let i = 1; i <= Wd; i++) {
          if (i < Wd && D[base + i] === D[base + s]) continue;
          if (D[base + s] >= 0) add(D[base + s], ox + s * sw, top, (i - s) * sw);
          s = i;
        }
      };
      const fillAll = (paths, ty) => paths.forEach((pa, ci) => {
        const pt = pat(ci);
        pt.setTransform(new DOMMatrix([sw / Wp, 0, 0, dh / Hp, ox, ty]));
        ctx.fillStyle = pt; ctx.fill(pa);
      });
      if (knit) { // row by row, top down, so each row's loops tuck over the one above
        for (let Y = -ny; Y <= ny; Y++) {
          const top = h / 2 + (Y - 0.5) * sh - lift;
          if (top > h || top + dh < 0) continue;
          const paths = new Map();
          rowRuns(Y, top, (ci, x, y, ww) => { if (!paths.has(ci)) paths.set(ci, new Path2D()); paths.get(ci).rect(x, y, ww, dh); });
          fillAll(paths, top);
        }
      } else {
        const paths = new Map();
        for (let Y = -ny; Y <= ny; Y++) {
          const top = h / 2 + (Y - 0.5) * sh;
          if (top > h || top + dh < 0) continue;
          rowRuns(Y, top, (ci, x, y, ww) => { if (!paths.has(ci)) paths.set(ci, new Path2D()); paths.get(ci).rect(x, y, ww, dh); });
        }
        fillAll(paths, h / 2 - (ny + 0.5) * sh);
      }
    },
  };

  // ================= Kilim: stepped diamonds, flat-woven or ikat-blurred =================
  GENS.kilim = {
    name: 'Kilim',
    blurb: 'stepped diamonds, flat woven',
    params: [
      { k: 'layout', label: 'layout', options: ['bands', 'lozenges', 'medallion'], def: 'bands' },
      { k: 'weave', label: 'weave', options: ['kilim', 'ikat'], def: 'kilim' },
      { k: 'grid', label: 'step', min: 3, max: 30, step: 0.5, def: 7 },
      { k: 'scale', label: 'motif', min: 5, max: 45, step: 1, def: 19 },
      { k: 'teeth', label: 'teeth', min: 0, max: 1, step: 0.05, def: 0.6 },
      { k: 'blur', label: 'ikat blur', min: 0, max: 1, step: 0.05, def: 0.5 },
      { k: 'abrash', label: 'abrash', min: 0, max: 1, step: 0.05, def: 0.5 },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const g = Math.max(1.5, p.grid * u);
      const nx = Math.ceil(w / 2 / g) + 1, ny = Math.ceil(h / 2 / g) + 1, cols = 2 * nx + 1, rows = 2 * ny + 1;
      const x0 = w / 2 - (nx + 0.5) * g, y0 = h / 2 - (ny + 0.5) * g;
      const C = [pal.bg, ...pal.c], L = C.map(lum);
      const order = [0, 1, 2, 3, 4, 5].sort((a, b) => L[a] - L[b]), darks = order.slice(0, 3), lights = order.slice(3);
      // ring colours: alternate dark and light so every step reads
      const seq = (n, startDark) => {
        const out = [];
        let prev = -1;
        for (let k = 0; k < n; k++) {
          const from = (k % 2 === 0) === startDark ? darks : lights;
          let c = pick(R, from);
          if (c === prev) c = from[(from.indexOf(c) + 1) % from.length];
          out.push(c); prev = c;
        }
        return out;
      };
      const teeth = p.teeth;
      // nested stepped diamonds on a diamond lattice; e = position along the edge for the serrations
      const lattice = (A, B, nr, schemes, tc) => (X, Y) => {
        const Xn = X / A, Yn = Y / B, U = (Xn + Yn) / 2, V = (Xn - Yn) / 2, ru = Math.round(U), rv = Math.round(V);
        const fu = U - ru, fv = V - rv, au = Math.abs(fu), av = Math.abs(fv);
        let d = 2 * Math.max(au, av);
        if (teeth > 0) { const e = au > av ? fv : fu; if (Math.floor((e + 0.5) * (2 * tc + 1)) & 1) d += teeth * 0.55 / nr; }
        const ring = Math.min(nr - 1, Math.floor(d * nr));
        return schemes(ru, rv)[ring];
      };
      const lozBand = hb => {
        const B = (hb - 1) / 2 + 0.5, A = B * pick(R, [1, 1, 1.5, 2]), nr = Math.max(hb >= 7 ? 3 : 2, Math.min(7, Math.round(B / 2.3)));
        const cm = seq(nr, R() < 0.5), co = seq(nr, R() < 0.5);
        co[nr - 1] = cm[nr - 1];
        const f = lattice(A, B, nr, (ru, rv) => ((ru + rv) & 1 ? co : cm), Math.max(1, Math.round(B / 3)));
        return { h: hb, fn: (X, y) => f(X, y - (hb - 1) / 2) };
      };
      const zigBand = () => {
        const m = pick(R, [2, 3, 4]), sw = pick(R, [1, 1, 2]), cs = seq(pick(R, [2, 3]), R() < 0.5), hb = m + 2 * sw + 1;
        return { h: hb, fn: (X, y) => cs[mod(Math.floor((y + Math.abs(mod(X, 2 * m) - m)) / sw), cs.length)] };
      };
      const teethBand = () => {
        const m = pick(R, [3, 4, 5]), [c1, c2] = seq(2, R() < 0.5);
        return { h: m, fn: (X, y) => (y < Math.abs(mod(X, 2 * m) - m) ? c1 : c2) };
      };
      const pipBand = () => { const [c1, c2] = seq(2, R() < 0.5); return { h: 1, fn: X => (X & 1 ? c1 : c2) }; };
      const solid = (c, hb = 1) => ({ h: hb, fn: () => c });

      const D = new Uint8Array(cols * rows);
      if (p.layout === 'lozenges') {
        const B = Math.max(2, p.scale * 0.65), A = B * pick(R, [1, 1.25, 1.5]), nr = Math.max(2, Math.min(8, Math.round(B / 2.2)));
        const s0 = seq(nr, true), s1 = seq(nr, false), s2 = seq(nr, R() < 0.5), edge = pick(R, darks);
        s0[nr - 1] = s1[nr - 1] = s2[nr - 1] = edge;
        const f = lattice(A, B, nr, (ru, rv) => [s0, s1, s2, s1][mod(ru - rv, 4)], Math.max(1, Math.round(B / 3)));
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) D[j * cols + i] = f(i - nx, j - ny);
      } else if (p.layout === 'medallion') {
        const hx = w / 2 / g, hy = h / 2 / g, bw = Math.max(4, Math.min(16, Math.round(Math.min(hx, hy) * 0.22)));
        const edgeDark = darks[0], fieldC = pick(R, [darks[1], darks[2], lights[0]]);
        const tb = teethBand(), pb = pipBand(), zb = zigBand();
        const border = [solid(edgeDark), pb, solid(edgeDark), tb, solid(edgeDark)];
        let used = border.reduce((s, b) => s + b.h, 0);
        if (used + zb.h + 1 <= bw) { border.push(zb, solid(edgeDark)); used += zb.h + 1; }
        const bandAt = []; // edge distance -> [band, y]
        border.forEach(b => { for (let y = 0; y < b.h; y++) bandAt.push([b, y]); });
        const fx = hx - used, fy = hy - used; // field half-extent
        const A = Math.max(3, fx * 0.8), Bm = Math.max(3, fy * 0.86), nr = Math.max(3, Math.min(8, Math.round(Math.min(A, Bm) / 2.4)));
        const ring = seq(nr, L[fieldC] > 0.5);
        const tc = Math.max(1, Math.round(Math.min(A, Bm) / 4));
        const fillP = Math.max(5, Math.round(p.scale / 2.5)) * 2, fillC = seq(2, L[fieldC] > 0.5);
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
          const X = i - nx, Y = j - ny, ex = Math.floor(hx - Math.abs(X) - 0.5), ey = Math.floor(hy - Math.abs(Y) - 0.5), E = Math.max(0, Math.min(ex, ey));
          let c;
          if (E < used) { const [b, y] = bandAt[E]; c = b.fn(ex < ey ? Y : X, y); }
          else {
            const d0 = Math.abs(X) / A + Math.abs(Y) / Bm;
            let d = d0;
            if (teeth > 0) { const e = (Math.abs(X) / A - Math.abs(Y) / Bm) / Math.max(0.2, 2 * d0); if (Math.floor((e + 0.5) * (2 * tc + 1)) & 1) d += teeth * 0.6 / nr; }
            if (d < 1) c = ring[Math.min(nr - 1, Math.floor(d * nr))];
            else {
              // field: little stepped diamonds on a lattice, kept clear of the medallion
              const lx = X - fillP * Math.round(X / fillP), ly = Y - fillP * Math.round(Y / fillP), dd = Math.abs(lx) + Math.abs(ly);
              const ox = Math.abs(X) - fillP / 2 - fillP * Math.floor(Math.abs(X) / fillP), oy = Math.abs(Y) - fillP / 2 - fillP * Math.floor(Math.abs(Y) / fillP);
              const od = Math.abs(ox) + Math.abs(oy);
              c = fieldC;
              if (d0 > 1.12 && E >= used + 2) {
                if (dd <= 2) c = dd === 1 ? fieldC : fillC[0];
                else if (od <= 1) c = fillC[1];
              }
            }
          }
          D[j * cols + i] = c;
        }
      } else {
        // bands: one big lozenge band in the middle, mirrored bands outwards
        const main = lozBand(oddify(p.scale));
        const bands = [main];
        let pos = (main.h + 1) / 2, k = 0;
        const guard = pick(R, darks);
        while (pos < ny + 1) {
          const unit = [solid(guard), k % 2 ? pipBand() : solid(pick(R, lights)), solid(guard), R() < 0.5 ? teethBand() : zigBand(), solid(guard),
            lozBand(oddify(k % 2 ? p.scale : p.scale * (0.45 + R() * 0.2)))];
          for (const b of unit) { bands.push(b); pos += b.h; }
          k++;
        }
        const rowOf = [];
        let s = (main.h + 1) / 2;
        for (let dY = 0; dY < s; dY++) rowOf[dY] = [main, dY + (main.h - 1) / 2];
        for (let i = 1; i < bands.length; i++) { for (let y = 0; y < bands[i].h; y++) rowOf[s + y] = [bands[i], y]; s += bands[i].h; }
        for (let j = 0; j < rows; j++) {
          const [b, y] = rowOf[Math.abs(j - ny)];
          for (let i = 0; i < cols; i++) D[j * cols + i] = b.fn(i - nx, y);
        }
      }

      const paths = C.map(() => new Path2D());
      const T = p.abrash;
      if (p.weave === 'ikat') {
        // warp threads carry the dyed design, each shifted a little: feathered, flame-like edges
        // threads are tied and dyed in pairs, so each pair shares its shift
        const tw = Math.max(1.2, g / 3, 2.4 * u), nT = Math.ceil(w / tw) + 1, bl = p.blur;
        const shade = [new Path2D(), new Path2D(), new Path2D()];
        for (let ti = 0; ti < nT; ti += 2) {
          const xa = Math.round(ti * tw), xb = Math.round((ti + 2) * tw), i = Math.floor(((ti + 1) * tw - x0) / g);
          if (i < 0 || i >= cols || xb <= xa) continue;
          const off = bl * g * (N.n2(ti * tw / g * 0.21, 3.3) * 2.6 + N.n2(ti * 0.45, 9.1) * 0.9);
          let ys = -g, cur = D[i];
          for (let j = 1; j <= rows; j++) {
            const c = j < rows ? D[j * cols + i] : 255;
            if (c === cur) continue;
            const yb = j < rows ? y0 + j * g + off + (R() - 0.5) * bl * g * 0.9 : h + g;
            paths[cur].rect(xa, ys, xb - xa, yb - ys);
            ys = yb; cur = c;
          }
        }
        for (let ti = 0; ti < nT; ti++) {
          const xa = Math.round(ti * tw), xb = Math.round((ti + 1) * tw);
          shade[ti % 2 ? 0 : 1 + Math.floor(R() * 2)].rect(xa, 0, xb - xa, h);
        }
        paths.forEach((pa, c) => { ctx.fillStyle = C[c]; ctx.fill(pa); });
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fill(shade[0]);
        ctx.fillStyle = `rgba(255,255,255,${0.08 * T})`; ctx.fill(shade[1]);
        ctx.fillStyle = `rgba(0,0,0,${0.08 * T})`; ctx.fill(shade[2]);
        // the fine weft crossing the warp
        const wl = new Path2D(), wsp = Math.max(2, tw * 1.4);
        for (let y = 0; y < h; y += wsp) wl.rect(0, Math.round(y), w, Math.max(1, Math.round(wsp * 0.35)));
        ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fill(wl);
        return;
      }
      // kilim: rows of colour, slits where two colours meet, abrash where the dye lot changes
      const SX = i => Math.round(x0 + i * g), SY = j => Math.round(y0 + j * g);
      const slits = new Path2D(), ab = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      for (let j = 0; j < rows; j++) {
        const ya = SY(j), yb = SY(j + 1);
        if (yb < 0 || ya > h) continue;
        const lv = C.map((_, c) => { const v = N.fbm((j - ny) * 0.075 + c * 17.3, c * 5.1 + 0.5, 2) * 3.2; return v < -0.9 ? 0 : v < -0.35 ? 1 : v > 0.9 ? 3 : v > 0.35 ? 2 : -1; });
        let s = 0;
        for (let i = 1; i <= cols; i++) {
          if (i < cols && D[j * cols + i] === D[j * cols + s]) continue;
          const c = D[j * cols + s], xa = SX(s), xb = SX(i);
          paths[c].rect(xa, ya, xb - xa, yb - ya);
          if (lv[c] >= 0) ab[lv[c]].rect(xa, ya, xb - xa, yb - ya);
          if (i < cols) { slits.moveTo(xb, ya); slits.lineTo(xb, yb); }
          s = i;
        }
      }
      paths.forEach((pa, c) => { ctx.fillStyle = C[c]; ctx.fill(pa); });
      if (T > 0) ['rgba(0,0,0,0.16)', 'rgba(0,0,0,0.08)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.12)'].forEach((c, k) => { ctx.globalAlpha = T; ctx.fillStyle = c; ctx.fill(ab[k]); });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(0,0,0,0.32)'; ctx.lineWidth = Math.max(0.6, g * 0.09); ctx.stroke(slits);
      // weft-faced texture: rows of little wool bumps in a brick bond, one tile per cell
      const K = Math.max(4, Math.min(64, Math.ceil(g))), tile = canvas(K, K), tx = tile.getContext('2d'), passes = g > 9 ? 4 : 3, ph = K / passes;
      for (let k = 0; k < passes; k++) {
        const y = k * ph, gr = tx.createLinearGradient(0, y, 0, y + ph);
        gr.addColorStop(0, 'rgba(255,255,255,0.13)'); gr.addColorStop(0.45, 'rgba(255,255,255,0)'); gr.addColorStop(0.75, 'rgba(0,0,0,0.06)'); gr.addColorStop(1, 'rgba(0,0,0,0.24)');
        tx.fillStyle = gr; tx.fillRect(0, y, K, ph);
        tx.fillStyle = 'rgba(0,0,0,0.13)';
        for (let b = -1; b < 3; b++) tx.fillRect(Math.round(b * K / 2 + (k & 1) * K / 4), y, Math.max(1, K * 0.05), ph);
      }
      ctx.fillStyle = tilePattern(ctx, tile, g / K, x0, y0); ctx.fillRect(0, 0, w, h);
    },
  };
})();
