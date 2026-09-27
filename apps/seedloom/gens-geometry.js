// Seedloom looms, geometry / math / optics batch: strange attractor, moiré gratings, a room of isometric cubes.
// Loaded after gens.js; registers GENS.attractor, GENS.moire, GENS.iso.
(function () {
  const { TAU, GENS } = window.SL;

  // ---------- shared helpers (local copies so this file stands alone) ----------
  const rgbOf = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const lumOf = hex => { const c = rgbOf(hex); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; };
  // palette colours ordered from the one closest to the background to the one that stands out most
  const byContrast = pal => pal.c.slice().sort((p, q) => Math.abs(lumOf(p) - lumOf(pal.bg)) - Math.abs(lumOf(q) - lumOf(pal.bg)));
  const shuffle = (R, arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  // 256-step RGB lookup table along a list of colours; cyclic wraps the last colour back to the first
  function makeLut(cols, cyclic) {
    const c = cols.map(rgbOf), L = c.length, out = new Uint8Array(256 * 3);
    for (let i = 0; i < 256; i++) {
      let k, f, k2;
      if (cyclic) { const t = i / 256 * L; k = Math.floor(t); f = t - k; k2 = (k + 1) % L; }
      else { const t = i / 255 * (L - 1); k = Math.min(L - 2, Math.floor(t)); f = t - k; k2 = k + 1; }
      for (let ch = 0; ch < 3; ch++) out[i * 3 + ch] = Math.round(c[k][ch] + (c[k2][ch] - c[k][ch]) * f);
    }
    return out;
  }
  // one reusable offscreen canvas for pixel renders: putImageData ignores compositing, so pixels are
  // written here first and then drawn over the (possibly pre-filled) target canvas
  let OFF = null, IMG = null;
  function offscreen(w, h) {
    if (!OFF) OFF = typeof document !== 'undefined' ? document.createElement('canvas') : new OffscreenCanvas(1, 1);
    if (OFF.width !== w || OFF.height !== h) { OFF.width = w; OFF.height = h; }
    const x = OFF.getContext('2d');
    if (!IMG || IMG.width !== w || IMG.height !== h) IMG = x.createImageData(w, h); else IMG.data.fill(0);
    return { cv: OFF, x, img: IMG };
  }
  // a second, transparent scratch canvas for vector work that uses its own compositing (xor):
  // the target may already hold the background (wall tiles, menu thumbnails), which xor would punch through
  let OFF2 = null;
  function scratch(w, h) {
    if (!OFF2) OFF2 = typeof document !== 'undefined' ? document.createElement('canvas') : new OffscreenCanvas(1, 1);
    if (OFF2.width !== w || OFF2.height !== h) { OFF2.width = w; OFF2.height = h; }
    const x = OFF2.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.clearRect(0, 0, w, h);
    return { cv: OFF2, x };
  }

  // ---------- Strange attractor: two-line maps iterated millions of times into a density buffer ----------
  const MAPS = {
    clifford: { r: [[-2, 2], [-2, 2], [-1.6, 1.6], [-1.6, 1.6]], good: [-1.4, 1.6, 1.0, 0.7] },
    'de jong': { r: [[-3, 3], [-3, 3], [-3, 3], [-3, 3]], good: [1.4, -2.3, 2.4, -2.1] },
    svensson: { r: [[-3, 3], [-3, 3], [-2.2, 2.2], [-2.2, 2.2]], good: [1.4, 1.56, 1.4, -2.2] },
    dream: { r: [[-3, 3], [-3, 3], [-0.5, 1.5], [-0.5, 1.5]], good: [-0.966918, 2.879879, 0.765145, 0.744728] },
  };
  const KIND = { clifford: 0, 'de jong': 1, svensson: 2, dream: 3 };
  // branchless polynomial sine (error < 1e-8), ~1.5x faster than Math.sin in the hot loop; cos(v) = sn(v + HP)
  const HP = Math.PI / 2;
  const sn = v => {
    let t = v * 0.15915494309189535 + 0.5; t = t - Math.floor(t) - 0.5;
    const s = t * t;
    return t * (6.283185279327873 + s * (-41.34169792404639 + s * (81.605055533938 + s * (-76.70202103775316 + s * (42.0195923135075 + s * (-14.88048383021143 + s * 3.215388573132799))))));
  };
  function mapStep(K, a, b, c, d, x, y, o) {
    if (K === 0) { o[0] = sn(a * y) + c * sn(a * x + HP); o[1] = sn(b * x) + d * sn(b * y + HP); }
    else if (K === 1) { o[0] = sn(a * y) - sn(b * x + HP); o[1] = sn(c * x) - sn(d * y + HP); }
    else if (K === 2) { o[0] = d * sn(a * x) - sn(b * y); o[1] = c * sn(a * x + HP) + sn(b * y + HP); }
    else { o[0] = sn(b * y) + c * sn(b * x); o[1] = sn(a * x) + d * sn(a * y); }
  }
  // trial orbit: Lyapunov exponent (is it chaotic?), how much of its box it fills (on a GxG grid), and its extent
  function probe(K, co, n, warm, G) {
    const [a, b, c, d] = co, o = [0, 0], q = [0, 0], d0 = 1e-7;
    let x = 0.1, y = -0.2, ex = x + d0, ey = y, ly = 0;
    const xs = new Float64Array(n), ys = new Float64Array(n);
    for (let i = -warm; i < n; i++) {
      mapStep(K, a, b, c, d, x, y, o); mapStep(K, a, b, c, d, ex, ey, q);
      x = o[0]; y = o[1];
      let dx = q[0] - x, dy = q[1] - y, dist = Math.hypot(dx, dy);
      if (!(dist > 0)) { dx = d0; dy = 0; dist = d0; ly -= 30; }
      else if (i >= 0) ly += Math.log(dist / d0);
      ex = x + dx / dist * d0; ey = y + dy / dist * d0;
      if (i >= 0) { xs[i] = x; ys[i] = y; }
    }
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let i = 0; i < n; i++) { if (xs[i] < x0) x0 = xs[i]; if (xs[i] > x1) x1 = xs[i]; if (ys[i] < y0) y0 = ys[i]; if (ys[i] > y1) y1 = ys[i]; }
    const cells = new Uint8Array(G * G), sx = (x1 - x0) || 1, sy = (y1 - y0) || 1;
    let fill = 0;
    for (let i = 0; i < n; i++) {
      const k = Math.min(G - 1, ((xs[i] - x0) / sx * G) | 0) + Math.min(G - 1, ((ys[i] - y0) / sy * G) | 0) * G;
      if (!cells[k]) { cells[k] = 1; fill++; }
    }
    return { ly: ly / n, fill: fill / (G * G), xs, ys, ok: isFinite(x) && isFinite(y) && x1 - x0 > 0.05 && y1 - y0 > 0.05 };
  }
  // reused buffers (the app re-renders on every slider tick): density at full resolution, and the summed
  // direction of travel [dx, dy] at half resolution, which is all a colour needs
  const BUFS = {};
  function buf(name, n) {
    let b = BUFS[name];
    if (!b || b.length !== n) b = BUFS[name] = new Float32Array(n); else b.fill(0);
    return b;
  }
  // cheap atan2 mapped straight to [0,1) (max error ~0.3 degrees, plenty for picking a colour)
  function turn(y, x) {
    const ax = Math.abs(x), ay = Math.abs(y), mn = Math.min(ax, ay), mx = Math.max(ax, ay) || 1e-12, t = mn / mx, s = t * t;
    let r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * t + t;
    if (ay > ax) r = 1.57079637 - r;
    if (x < 0) r = 3.14159274 - r;
    if (y < 0) r = -r;
    return (r / TAU + 1) % 1;
  }
  const AFILL = [0.3, 0.62];

  GENS.attractor = {
    name: 'Strange Attractor',
    blurb: 'a million points in orbit',
    params: [
      { k: 'kind', label: 'equation', options: ['clifford', 'de jong', 'svensson', 'dream'], def: 'clifford' },
      { k: 'points', label: 'points', min: 0.2, max: 2.5, step: 0.1, def: 0.7 },
      { k: 'morph', label: 'morph', min: -1, max: 1, step: 0.01, def: 0 },
      { k: 'sym', label: 'symmetry', options: ['none', '2', '3', '4', '5', '6'], def: 'none' },
      { k: 'zoom', label: 'zoom', min: 0.4, max: 2.5, step: 0.01, def: 1 },
      { k: 'glow', label: 'exposure', min: 0.3, max: 3, step: 0.05, def: 1 },
      { k: 'color', label: 'colour by', options: ['motion', 'density', 'ink'], def: 'motion' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const M = MAPS[p.kind] || MAPS.clifford, K = KIND[p.kind] || 0;
      const fl = AFILL;
      // roll coefficients until the orbit is chaotic and neither a thin loop nor a shapeless blob
      let co = null;
      for (let t = 0; t < 90 && !co; t++) {
        const cand = M.r.map(([lo, hi]) => lo + (hi - lo) * R());
        const q = probe(K, cand, 500, 300, 16); // quick screen, then a closer look
        if (!q.ok || q.ly < 0.1 || q.fill < 0.2) continue;
        const s = probe(K, cand, 5000, 800, 48);
        if (s.ok && s.ly > 0.1 && s.fill > fl[0] && s.fill < fl[1]) co = cand;
      }
      if (!co) co = M.good.slice();
      // morph walks the coefficients along a seeded direction, so the slider melts one shape into another
      const dir = [0, 1, 2, 3].map(() => R() * 2 - 1), dl = Math.hypot(...dir) || 1;
      co = co.map((v, i) => v + p.morph * 0.32 * (M.r[i][1] - M.r[i][0]) / 4 * dir[i] / dl);
      const [a, b, c, d] = co;

      // fit: trimmed extent of a trial orbit
      const pr = probe(K, co, 6000, 800, 16), sym = p.sym === 'none' ? 1 : +p.sym, nP = pr.xs.length;
      const sx = pr.xs.slice().sort(), sy = pr.ys.slice().sort(), lo = 10, hi = nP - 11;
      const mx = (sx[lo] + sx[hi]) / 2, my = (sy[lo] + sy[hi]) / 2;
      let S;
      if (sym === 1) S = Math.min(w * 0.86 / Math.max(1e-3, sx[hi] - sx[lo]), h * 0.86 / Math.max(1e-3, sy[hi] - sy[lo])) * p.zoom;
      else {
        const rr = pr.xs.map((v, i) => Math.hypot(v - mx, pr.ys[i] - my)).sort();
        S = Math.min(w, h) * 0.46 / Math.max(1e-3, rr[hi]) * p.zoom;
      }
      const rot = [];
      for (let k = 0; k < sym; k++) { const an = k * TAU / sym - (sym > 1 ? HP : 0); rot.push(Math.cos(an), Math.sin(an)); }

      const WH = w * h, motion = p.color === 'motion', D = buf('d', WH);
      const CW = (w >> 1) + 2, CH = (h >> 1) + 2, CB = buf('c', motion ? CW * CH * 2 : 2);
      const total = Math.round(Math.min(12e6, p.points * 1e6 * Math.max(0.6, WH / 1e6)));
      const perCopy = Math.ceil(total / sym), w2 = w / 2 - 0.5, h2 = h / 2 - 0.5, wm = w - 1, hm = h - 1;
      let x = pr.xs[nP - 1], y = pr.ys[nP - 1];
      for (let i = 0; i < perCopy; i++) {
        let nx, ny;
        if (K === 0) { nx = sn(a * y) + c * sn(a * x + HP); ny = sn(b * x) + d * sn(b * y + HP); }
        else if (K === 1) { nx = sn(a * y) - sn(b * x + HP); ny = sn(c * x) - sn(d * y + HP); }
        else if (K === 2) { nx = d * sn(a * x) - sn(b * y); ny = c * sn(a * x + HP) + sn(b * y + HP); }
        else { nx = sn(b * y) + c * sn(b * x); ny = sn(a * x) + d * sn(a * y); }
        const vx = nx - x, vy = ny - y;
        x = nx; y = ny;
        const ux = (x - mx) * S, uy = (y - my) * S;
        for (let k = 0; k < rot.length; k += 2) {
          const cs = rot[k], sc = rot[k + 1], X = w2 + ux * cs - uy * sc, Y = h2 + ux * sc + uy * cs;
          if (X < 0 || Y < 0 || X >= wm || Y >= hm) continue;
          const ix = X | 0, iy = Y | 0, fx = X - ix, fy = Y - iy, j = iy * w + ix;
          const w11 = fx * fy, w10 = fx - w11, w01 = fy - w11, w00 = 1 - fx - fy + w11;
          D[j] += w00; D[j + 1] += w10; D[j + w] += w01; D[j + w + 1] += w11;
          if (motion) { const cj = (((Y * 0.5 + 0.5) | 0) * CW + ((X * 0.5 + 0.5) | 0)) * 2; CB[cj] += vx * cs - vy * sc; CB[cj + 1] += vx * sc + vy * cs; }
        }
      }

      // log tone map against the 99.5th percentile of lit pixels, so a few hot spots don't dim everything
      const lmax = Math.log1p(total), HB = 4096, hist = new Uint32Array(HB);
      let lit = 0;
      for (let i = 0; i < WH; i++) { const v = D[i]; if (v > 0) { const l = Math.log1p(v); D[i] = l; hist[Math.min(HB - 1, (l / lmax * HB) | 0)]++; lit++; } }
      if (!lit) return;
      let acc = 0, kref = HB - 1;
      for (let k = 0; k < HB; k++) { acc += hist[k]; if (acc >= lit * 0.995) { kref = k; break; } }
      const lref = Math.max(1e-6, (kref + 1) / HB * lmax);
      // exposure curve and colours as small lookup tables
      const TQ = 1024, aLut = new Uint8Array(TQ + 1), tLut = new Uint8Array(TQ + 1), g = 1 / p.glow;
      for (let q = 0; q <= TQ; q++) { const t = Math.pow(q / TQ, g); aLut[q] = Math.round(255 * Math.min(1, 1.3 * Math.pow(t, 1.3))); tLut[q] = Math.round(255 * t); }
      const ordered = byContrast(pal), hot = rgbOf(ordered[4]);
      const lin = makeLut(ordered.slice(1), false), cyc = makeLut(shuffle(R, pal.c.slice()), true);
      const { cv, x: ox, img } = offscreen(w, h), px = img.data, ink = p.color === 'ink', dens = p.color === 'density';
      for (let i = 0; i < WH; i++) {
        const l = D[i];
        if (!(l > 0)) continue;
        const q = Math.min(TQ, (l / lref * TQ) | 0), al = aLut[q], o = i * 4;
        if (!al) continue;
        if (ink) { px[o] = hot[0]; px[o + 1] = hot[1]; px[o + 2] = hot[2]; }
        else if (dens) { const m = tLut[q] * 3; px[o] = lin[m]; px[o + 1] = lin[m + 1]; px[o + 2] = lin[m + 2]; }
        else {
          // direction of travel, bilinear from the half-res grid
          const yy = (i / w) | 0, xx = i - yy * w, gx = xx * 0.5, gy = yy * 0.5, cx = gx | 0, cy = gy | 0, ax = gx - cx, ay = gy - cy;
          const c0 = (cy * CW + cx) * 2, c1 = c0 + CW * 2;
          const vX = (CB[c0] * (1 - ax) + CB[c0 + 2] * ax) * (1 - ay) + (CB[c1] * (1 - ax) + CB[c1 + 2] * ax) * ay;
          const vY = (CB[c0 + 1] * (1 - ax) + CB[c0 + 3] * ax) * (1 - ay) + (CB[c1 + 1] * (1 - ax) + CB[c1 + 3] * ax) * ay;
          const m = ((turn(vY, vX) * 256) | 0) * 3, t = tLut[q] / 255, hk = t * t * t * t * 0.55;
          px[o] = cyc[m] + (hot[0] - cyc[m]) * hk; px[o + 1] = cyc[m + 1] + (hot[1] - cyc[m + 1]) * hk; px[o + 2] = cyc[m + 2] + (hot[2] - cyc[m + 2]) * hk;
        }
        px[o + 3] = al;
      }
      ox.putImageData(img, 0, 0);
      ctx.drawImage(cv, 0, 0);
    },
  };

  // ---------- Moiré: two or more fine gratings laid over each other; where they cross, fringes appear ----------
  GENS.moire = {
    name: 'Moiré',
    blurb: 'gratings that shimmer when crossed',
    params: [
      { k: 'style', label: 'grating', options: ['lines', 'rings', 'zone plates', 'spirals'], def: 'lines' },
      { k: 'layers', label: 'gratings', min: 2, max: 5, step: 1, def: 2 },
      { k: 'period', label: 'spacing', min: 8, max: 60, step: 0.5, def: 20 },
      { k: 'spread', label: 'offset', min: 0, max: 1, step: 0.01, def: 0 },
      { k: 'ink', label: 'ink', min: 0.15, max: 0.85, step: 0.01, def: 0.5 },
      { k: 'warp', label: 'warp', min: 0, max: 1, step: 0.01, def: 0.6 },
      { k: 'mode', label: 'overlap', options: ['cancel', 'stack'], def: 'cancel' },
    ],
    draw(target, w, h, p, R, pal, N, u) {
      const { cv, x: ctx } = scratch(w, h);
      const n = Math.round(p.layers), P = p.period * u, M = Math.min(w, h), lw = p.ink * P;
      const cols = byContrast(pal).reverse();
      const top = shuffle(R, cols.slice(0, 3)).concat(cols.slice(3));
      const rot0 = R() * TAU, ma = R() * TAU, md = R() * 0.18 * M, mcx = w / 2 + Math.cos(ma) * md, mcy = h / 2 + Math.sin(ma) * md;
      // warp: one smooth displacement field, applied in growing amounts to each grating after the first.
      // The fringes then trace the field's contours, the way watered silk shimmers
      const amp = p.warp * 8 * P, fq = 1.3 / (1000 * u);
      const GC = 24 * u, GW = Math.ceil(w / GC) + 3, GH = Math.ceil(h / GC) + 3, WX = new Float32Array(GW * GH), WY = new Float32Array(GW * GH);
      if (amp > 0) for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
        const X = (i - 1) * GC, Y = (j - 1) * GC;
        WX[j * GW + i] = N.fbm(X * fq, Y * fq, 2) * amp; WY[j * GW + i] = N.fbm(X * fq + 31.7, Y * fq + 12.9, 2) * amp;
      }
      const warp = (X, Y, f, o) => {
        const gx = Math.max(0, Math.min(GW - 1.001, X / GC + 1)), gy = Math.max(0, Math.min(GH - 1.001, Y / GC + 1));
        const i = gx | 0, j = gy | 0, fx = gx - i, fy = gy - j, k = j * GW + i;
        o[0] = X + f * ((WX[k] * (1 - fx) + WX[k + 1] * fx) * (1 - fy) + (WX[k + GW] * (1 - fx) + WX[k + GW + 1] * fx) * fy);
        o[1] = Y + f * ((WY[k] * (1 - fx) + WY[k + 1] * fx) * (1 - fy) + (WY[k + GW] * (1 - fx) + WY[k + GW + 1] * fx) * fy);
      };
      // polyline step: short enough that a chord never strays more than ~0.3px from its circle, never longer than 30u
      const tmp = [0, 0], seg = 12 * u, pad = amp * 0.7 + lw + 4 * u, segAt = r => Math.min(30 * u, Math.max(2, Math.sqrt(2.4 * r)));
      // a circle, as a polyline through the warp when this grating bends (else a plain arc)
      const ring = (path, cx, cy, r, f) => {
        if (!(f > 0)) { path.moveTo(cx + r, cy); path.arc(cx, cy, r, 0, TAU); return; }
        const steps = Math.max(24, Math.ceil(TAU * r / segAt(r)));
        for (let s = 0; s <= steps; s++) {
          const an = s / steps * TAU; warp(cx + Math.cos(an) * r, cy + Math.sin(an) * r, f, tmp);
          if (s === 0) path.moveTo(tmp[0], tmp[1]); else path.lineTo(tmp[0], tmp[1]);
        }
      };
      const farR = (cx, cy) => Math.max(Math.hypot(cx, cy), Math.hypot(w - cx, cy), Math.hypot(cx, h - cy), Math.hypot(w - cx, h - cy)) + pad;
      ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
      for (let k = 0; k < n; k++) {
        const col = top[k % top.length], an = rot0 + k * TAU / n, off = p.spread * 0.26 * M;
        const cx = mcx + Math.cos(an) * off, cy = mcy + Math.sin(an) * off, ph = R();
        const fk = amp > 0 && n > 1 ? k / (n - 1) : 0, bend = fk > 0;
        ctx.globalCompositeOperation = p.mode === 'cancel' && k > 0 ? 'xor' : 'source-over';
        ctx.globalAlpha = p.mode === 'stack' ? 0.82 : 1;
        ctx.strokeStyle = col; ctx.fillStyle = col;
        if (p.style === 'rings') {
          const path = new Path2D(), Rm = farR(cx, cy);
          for (let r = (ph + 0.5) * P; r < Rm; r += P) ring(path, cx, cy, r, fk);
          ctx.lineWidth = lw; ctx.stroke(path);
        } else if (p.style === 'zone plates') {
          // Fresnel zone plate: zone m ends at sqrt(m) times the first radius; zones are never finer than the spacing
          const Rm = farR(cx, cy), f = 2 * Rm * P, path = new Path2D();
          for (let m = 0; ; m++) {
            const r0 = Math.sqrt((m + ph * 0.5) * f), r1 = Math.sqrt((m + ph * 0.5 + p.ink) * f);
            if (r0 > Rm) break;
            if (!bend) { path.moveTo(cx + r1, cy); path.arc(cx, cy, r1, 0, TAU); if (r0 > 0.01) { path.moveTo(cx + r0, cy); path.arc(cx, cy, r0, TAU, 0, true); } }
            else { ring(path, cx, cy, r1, fk); if (r0 > 0.01) ring(path, cx, cy, r0, fk); }
          }
          ctx.fill(path, 'evenodd');
        } else if (p.style === 'lines') {
          // parallel lines, each grating turned a few degrees and slightly re-spaced
          const t = n === 1 ? 0 : k / (n - 1) - 0.5, ang = rot0 + t * p.spread * 0.42, Pk = P * (1 + t * p.spread * 0.08);
          const dx = Math.cos(ang), dy = Math.sin(ang), L = Math.hypot(w, h) / 2 + pad, path = new Path2D();
          const steps = bend ? Math.ceil(2 * L / seg) : 1;
          for (let o = -L + ph * Pk; o < L; o += Pk) {
            const bx = w / 2 - dy * o, by = h / 2 + dx * o;
            for (let s = 0; s <= steps; s++) {
              const along = -L + 2 * L * s / steps; let X = bx + dx * along, Y = by + dy * along;
              if (bend) { warp(X, Y, fk, tmp); X = tmp[0]; Y = tmp[1]; }
              if (s === 0) path.moveTo(X, Y); else path.lineTo(X, Y);
            }
          }
          ctx.lineWidth = lw; ctx.stroke(path);
        } else {
          // Archimedean spirals, alternating hand, so neighbours sweep against each other
          const hand = k % 2 ? -1 : 1, Rm = farR(cx, cy), path = new Path2D(), a0 = ph * TAU;
          let th = 0, first = true;
          while (true) {
            const r = P * th / TAU;
            if (r > Rm) break;
            let X = cx + Math.cos(a0 + hand * th) * r, Y = cy + Math.sin(a0 + hand * th) * r;
            if (bend) { warp(X, Y, fk, tmp); X = tmp[0]; Y = tmp[1]; }
            if (first) { path.moveTo(X, Y); first = false; } else path.lineTo(X, Y);
            th += Math.min(0.3, segAt(r) / Math.max(r, 1));
          }
          ctx.lineWidth = lw; ctx.stroke(path);
        }
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      target.drawImage(cv, 0, 0);
    },
  };

  // ---------- Iso cubes: a random plane partition (cubes piled into the corner of a box) seen in isometric ----------
  // The heights are shuffled by heat-bath Monte Carlo from a perfect staircase; fully melted, the famous
  // "arctic circle" appears: frozen corners of one lozenge each and a disordered disc in the middle.
  const ROOMS = { hexagon: [1, 1, 1], tall: [0.7, 0.7, 1.45], wide: [1.45, 0.75, 0.7], deep: [0.75, 1.45, 0.8] };
  GENS.iso = {
    name: 'Cube Room',
    blurb: 'cubes settling into a corner',
    params: [
      { k: 'size', label: 'cubes', min: 3, max: 64, step: 1, def: 22 },
      { k: 'melt', label: 'melt', min: 0, max: 1, step: 0.01, def: 1 },
      { k: 'fill', label: 'fill', min: -1, max: 1, step: 0.01, def: -0.4 },
      { k: 'shape', label: 'room', options: ['hexagon', 'tall', 'wide', 'deep'], def: 'hexagon' },
      { k: 'zoom', label: 'zoom', min: 0.4, max: 3, step: 0.01, def: 0.92 },
      { k: 'gap', label: 'gap', min: 0, max: 0.45, step: 0.01, def: 0 },
      { k: 'style', label: 'style', options: ['tones', 'tones + lines', 'by height', 'lines'], def: 'tones' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const n = Math.round(p.size), sh = ROOMS[p.shape] || ROOMS.hexagon;
      const A = Math.max(1, Math.round(n * sh[0])), B = Math.max(1, Math.round(n * sh[1])), C = Math.max(1, Math.round(n * sh[2]));
      // heights with a padded border: row/col 0 = C (the walls), row A+1 / col B+1 = 0 (the open side)
      const SW = B + 2, H = new Int16Array((A + 2) * SW);
      for (let j = 0; j < B + 2; j++) H[j] = C;
      for (let i = 0; i < A + 2; i++) H[i * SW] = C;
      H[0] = C;
      // start from a perfect staircase (a tilted plane of cubes), pushed up or down a little by fill
      const K = Math.round((A + B + C) / 2 * (1 + 0.35 * p.fill));
      for (let i = 1; i <= A; i++) for (let j = 1; j <= B; j++) H[i * SW + j] = Math.max(0, Math.min(C, K - (i - 1) - (j - 1)));
      // heat-bath sweeps: each height is redrawn from the range its neighbours allow, weighted q^height.
      // PS[k] = 1 + q + ... + q^k, so a draw is a short scan (spans are small once the crystal has melted)
      const sweeps = Math.round(Math.pow(p.melt, 3) * (0.55 * n * n + 60)), q = Math.exp(p.fill * 5 / n);
      const PS = new Float64Array(C + 2);
      for (let k = 0, acc = 0, qk = 1; k <= C + 1; k++, qk *= q) { acc += qk; PS[k] = acc; }
      for (let sw = 0; sw < sweeps; sw++) {
        const rev = sw & 1;
        for (let ii = 1; ii <= A; ii++) {
          const i = rev ? A + 1 - ii : ii;
          for (let jj = 1; jj <= B; jj++) {
            const j = rev ? B + 1 - jj : jj, k = i * SW + j;
            const lo = Math.max(H[k + SW], H[k + 1]), hi = Math.min(H[k - SW], H[k - 1]), span = hi - lo;
            if (span <= 0) continue;
            const t = R() * PS[span];
            let v = 0;
            while (v < span && PS[v] < t) v++;
            H[k] = lo + v;
          }
        }
      }
      const h0 = (i, j) => H[(i + 1) * SW + (j + 1)]; // i in -1..A, j in -1..B

      // isometric frame, fitted to the canvas
      const C30 = Math.cos(Math.PI / 6);
      const ew = (A + B) * C30, eh = (A + B) / 2 + C;
      const s = Math.min(w / ew, h / eh) * 0.9 * p.zoom;
      const ox = w / 2 - (A - B) / 2 * C30 * s, oy = h / 2 - ((A + B) / 2 - C) / 2 * s;
      const PX = (x, y, z) => ox + (x - y) * C30 * s, PY = (x, y, z) => oy + (x + y) * 0.5 * s - z * s;

      // faces: 0 = tops, 1 = +x walls, 2 = +y walls; each a quad, bucketed by colour
      const style = p.style, byH = style === 'by height', BANDS = byH ? 10 : 1;
      const paths = [], zs = [];
      for (let f = 0; f < 3 * BANDS; f++) paths.push(new Path2D());
      const outline = style === 'lines' || style === 'tones + lines' ? new Path2D() : null;
      // with no gap every face grows by ~0.4px so neighbours overlap and no anti-aliasing seams show through
      const shrink = style === 'lines' ? 0 : p.gap, kq = shrink > 0.005 ? 1 - shrink : 1 + 0.8 / Math.max(1, s);
      const quad = (face, z, x0, y0, z0, dx1, dy1, dz1, dx2, dy2, dz2) => {
        const X = [], Y = [];
        const pts = [[x0, y0, z0], [x0 + dx1, y0 + dy1, z0 + dz1], [x0 + dx1 + dx2, y0 + dy1 + dy2, z0 + dz1 + dz2], [x0 + dx2, y0 + dy2, z0 + dz2]];
        for (const [a, b, c] of pts) { X.push(PX(a, b, c)); Y.push(PY(a, b, c)); }
        if (X[0] < -s * 2 && X[1] < -s * 2 && X[2] < -s * 2 && X[3] < -s * 2) return;
        if (X[0] > w + s * 2 && X[1] > w + s * 2 && X[2] > w + s * 2 && X[3] > w + s * 2) return;
        if (Y[0] < -s * 2 && Y[1] < -s * 2 && Y[2] < -s * 2 && Y[3] < -s * 2) return;
        if (Y[0] > h + s * 2 && Y[1] > h + s * 2 && Y[2] > h + s * 2 && Y[3] > h + s * 2) return;
        const mx = (X[0] + X[2]) / 2, my = (Y[0] + Y[2]) / 2, k = kq;
        const band = byH ? Math.min(BANDS - 1, Math.floor(z / C * BANDS)) : 0;
        const pa = paths[face * BANDS + band];
        pa.moveTo(mx + (X[0] - mx) * k, my + (Y[0] - my) * k);
        for (let v = 1; v < 4; v++) pa.lineTo(mx + (X[v] - mx) * k, my + (Y[v] - my) * k);
        pa.closePath();
        if (outline) { outline.moveTo(X[0], Y[0]); for (let v = 1; v < 4; v++) outline.lineTo(X[v], Y[v]); outline.closePath(); }
      };
      for (let i = 0; i < A; i++) for (let j = 0; j < B; j++) { const z = h0(i, j); quad(0, z, i, j, z, 1, 0, 0, 0, 1, 0); }
      for (let j = 0; j < B; j++) for (let i = 0; i <= A; i++) for (let z = h0(i, j); z < h0(i - 1, j); z++) quad(1, z + 0.5, i, j, z, 0, 1, 0, 0, 0, 1);
      for (let i = 0; i < A; i++) for (let j = 0; j <= B; j++) for (let z = h0(i, j); z < h0(i, j - 1); z++) quad(2, z + 0.5, i, j, z, 1, 0, 0, 0, 0, 1);

      const paint = (path, col) => { ctx.fillStyle = col; ctx.fill(path); };
      if (style !== 'lines') {
        if (byH) {
          // colour climbs the palette with height; tops lit, +y walls in shadow
          const cs = byContrast(pal).slice(1), dark = lumOf(pal.bg) < 0.5 ? rgbOf(pal.bg) : [0, 0, 0];
          for (let b = 0; b < BANDS; b++) {
            const base = rampRgb(cs, b / (BANDS - 1));
            paint(paths[b], mixRgb(base, [255, 255, 255], 0.22));
            paint(paths[BANDS + b], mixRgb(base, base, 0));
            paint(paths[2 * BANDS + b], mixRgb(base, dark, 0.38));
          }
        } else {
          // three tones that differ in lightness (so every face reads) and stand off the background;
          // one of the best few triples per seed, lightest on top so the stack reads as lit from above
          const cs = pal.c, lb = lumOf(pal.bg), tri = [];
          for (let x = 0; x < cs.length; x++) for (let y = x + 1; y < cs.length; y++) for (let z = y + 1; z < cs.length; z++) {
            const t = [cs[x], cs[y], cs[z]], L = t.map(lumOf);
            const sep = Math.min(Math.abs(L[0] - L[1]), Math.abs(L[0] - L[2]), Math.abs(L[1] - L[2]));
            const off = Math.min(...L.map(v => Math.abs(v - lb)));
            tri.push({ t, sc: sep + 0.35 * off });
          }
          tri.sort((x, y) => y.sc - x.sc);
          const cand = tri[Math.min(tri.length - 1, Math.floor(R() * R() * 3))].t.slice().sort((x, y) => lumOf(y) - lumOf(x));
          for (let f = 0; f < 3; f++) paint(paths[f], cand[f]);
        }
      }
      if (outline) {
        ctx.lineJoin = 'round';
        ctx.lineWidth = style === 'lines' ? Math.max(0.8, Math.min(3 * u, s * 0.12)) : Math.max(0.6, Math.min(2.2 * u, s * 0.09));
        ctx.strokeStyle = style === 'lines' ? byContrast(pal)[4] : (lumOf(pal.bg) < 0.5 ? pal.bg : byContrast(pal)[4]);
        ctx.stroke(outline);
      }
    },
  };
  // rgb helpers for the shaded style
  function rampRgb(cs, t) {
    const x = Math.max(0, Math.min(1, t)) * (cs.length - 1), i = Math.min(cs.length - 2, Math.floor(x)), f = x - i;
    const a = rgbOf(cs[i]), b = rgbOf(cs[i + 1]);
    return [0, 1, 2].map(k => Math.round(a[k] + (b[k] - a[k]) * f));
  }
  function mixRgb(c, hex, k) {
    const b = typeof hex === 'string' ? rgbOf(hex) : hex;
    return `rgb(${[0, 1, 2].map(i => Math.round(c[i] + (b[i] - c[i]) * k)).join(',')})`;
  }
})();
