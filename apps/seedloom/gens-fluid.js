// Seedloom looms, water and sound batch: paper marbling (ink drops pushed apart, then combed) and
// Chladni plates (sand shaken into the still lines of a vibrating plate).
// Loaded after gens.js; registers GENS.marble, GENS.chladni. No document access, so the wall workers can paint both.
(function () {
  const { TAU, GENS, mix } = window.SL;

  const rgbOf = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const lumOf = hex => { const c = rgbOf(hex); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; };
  const byContrast = pal => pal.c.slice().sort((p, q) => Math.abs(lumOf(p) - lumOf(pal.bg)) - Math.abs(lumOf(q) - lumOf(pal.bg)));
  // reusable pixel scratch: grains are written straight into an ImageData, then drawn over the target
  let OFF = null, IMG = null;
  function offscreen(w, h) {
    if (!OFF) OFF = typeof document !== 'undefined' ? document.createElement('canvas') : new OffscreenCanvas(1, 1);
    if (OFF.width !== w || OFF.height !== h) { OFF.width = w; OFF.height = h; }
    const x = OFF.getContext('2d');
    if (!IMG || IMG.width !== w || IMG.height !== h) IMG = x.createImageData(w, h); else IMG.data.fill(0);
    return { cv: OFF, x, img: IMG };
  }
  const shuffle = (R, arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };

  // ---------- Marbling: every move is an area-preserving map applied to every ink outline ----------
  // Drops follow Jaffer & Lu's ink-drop map (a new drop of radius r at c pushes each point p to
  // c + (p - c) * sqrt(1 + r^2 / |p - c|^2)); combs and swirls are shears and radius-only rotations,
  // so the inks never overlap or tear. Outlines are resampled after each move where they stretch.
  function marbleMove(polys, T, maxSeg, budget) {
    const o = [0, 0];
    let total = 0;
    for (const P of polys) total += P.pts.length >> 1;
    const seg2 = total > budget ? maxSeg * maxSeg * 9 : maxSeg * maxSeg, keep2 = seg2 * 0.04;
    function sub(ax, ay, tax, tay, bx, by, tbx, tby, depth, out) {
      const dx = tbx - tax, dy = tby - tay;
      if (depth >= 6 || dx * dx + dy * dy <= seg2) return;
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      T(mx, my, o);
      const tmx = o[0], tmy = o[1];
      sub(ax, ay, tax, tay, mx, my, tmx, tmy, depth + 1, out);
      out.push(tmx, tmy);
      sub(mx, my, tmx, tmy, bx, by, tbx, tby, depth + 1, out);
    }
    for (const P of polys) {
      const a = P.pts, n = a.length >> 1, tp = new Float64Array(n * 2), out = [];
      for (let i = 0; i < n; i++) { T(a[2 * i], a[2 * i + 1], o); tp[2 * i] = o[0]; tp[2 * i + 1] = o[1]; }
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, L = out.length;
        // squeezed stretches of an outline shed points instead of piling them up
        if (L >= 2) { const ex = tp[2 * i] - out[L - 2], ey = tp[2 * i + 1] - out[L - 1]; if (ex * ex + ey * ey >= keep2) out.push(tp[2 * i], tp[2 * i + 1]); }
        else out.push(tp[2 * i], tp[2 * i + 1]);
        sub(a[2 * i], a[2 * i + 1], tp[2 * i], tp[2 * i + 1], a[2 * j], a[2 * j + 1], tp[2 * j], tp[2 * j + 1], 0, out);
      }
      P.pts = out.length >= 6 ? out : a;
    }
  }
  // one-way comb: tines every s along the across-axis drag ink along the pull axis, most right at a tine
  // and not at all halfway between two tines (so nothing slides in from outside the tray)
  function combMap(horizontal, s, off, z, lam) {
    const base = lam / (s / 2 + lam);
    return (x, y, o) => {
      const t = horizontal ? y : x, tm = ((t - off) % s + s) % s, d = Math.min(tm, s - tm);
      const k = z * (lam / (d + lam) - base);
      if (horizontal) { o[0] = x + k; o[1] = y; } else { o[0] = x; o[1] = y + k; }
    };
  }
  GENS.marble = {
    name: 'Marbling',
    blurb: 'ink dropped on water, then combed',
    params: [
      { k: 'drops', label: 'drops', min: 6, max: 90, step: 1, def: 34 },
      { k: 'size', label: 'drop size', min: 0.3, max: 2, step: 0.01, def: 1 },
      { k: 'layout', label: 'layout', options: ['scatter', 'bullseye', 'rows'], def: 'scatter' },
      { k: 'comb', label: 'comb', options: ['combed', 'nonpareil', 'waves', 'swirl', 'still'], def: 'combed' },
      { k: 'tines', label: 'tines', min: 2, max: 30, step: 1, def: 9 },
      { k: 'pull', label: 'pull', min: 0, max: 3, step: 0.01, def: 1 },
      { k: 'veins', label: 'veins', options: ['hair', 'ink', 'none'], def: 'hair' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const m = Math.min(w, h), nd = Math.round(p.drops), maxSeg = Math.max(2, m / 240), budget = 260000;
      const cols = shuffle(R, pal.c.slice());
      // the tray colour turns up as pale veins between the inks, like the size showing through
      const seq = nd > 8 ? cols.slice(0, 3).concat([pal.bg], cols.slice(3)) : cols;
      const rBase = p.size * Math.sqrt(w * h / nd / Math.PI) * 1.5;
      const hubs = 1 + Math.floor(R() * 3);
      const polys = [];
      const rows = Math.max(1, Math.round(Math.sqrt(nd * h / w))), perRow = Math.ceil(nd / rows);
      for (let i = 0; i < nd; i++) {
        let cx, cy, r = rBase * (0.55 + R() * 0.8);
        if (p.layout === 'bullseye') {
          // a few stones, each hit again and again in the same spot: concentric rings
          const hub = i % hubs;
          const hr = mulberry(hub * 7919 + nd);
          cx = w * (0.2 + 0.6 * hr()) + (R() - 0.5) * rBase * 0.1; cy = h * (0.2 + 0.6 * hr()) + (R() - 0.5) * rBase * 0.1;
          if (hubs === 1) { cx = w / 2; cy = h / 2; }
        } else if (p.layout === 'rows') {
          const row = Math.floor(i / perRow) % rows, col = i % perRow;
          cx = (col + 0.5 + (row % 2) * 0.5) * w / perRow; cy = (row + 0.5) * h / rows;
          cx += (R() - 0.5) * w / perRow * 0.2; cy += (R() - 0.5) * h / rows * 0.2;
        } else { cx = R() * w; cy = R() * h; }
        const rr = r * r;
        if (polys.length) marbleMove(polys, (x, y, o) => {
          const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy || 1e-9, f = Math.sqrt(1 + rr / d2);
          o[0] = cx + dx * f; o[1] = cy + dy * f;
        }, maxSeg, budget);
        const nv = Math.max(24, Math.ceil(TAU * r / maxSeg)), pts = new Array(nv * 2);
        for (let k = 0; k < nv; k++) { const a = k / nv * TAU; pts[2 * k] = cx + Math.cos(a) * r; pts[2 * k + 1] = cy + Math.sin(a) * r; }
        polys.push({ pts, col: seq[i % seq.length] });
      }
      const z = p.pull * m * 0.17, tines = Math.round(p.tines);
      const moves = [];
      if (p.comb === 'combed' && z > 0) {
        const s = w / tines;
        moves.push(combMap(false, s, s / 2, z, s * 0.14));
      } else if (p.comb === 'nonpareil' && z > 0) {
        // a coarse back-and-forth pass first, then a fine comb straight through it
        const s1 = h / Math.max(2, Math.round(tines / 3)), s2 = w / (tines * 2);
        moves.push((x, y, o) => { o[0] = x + z * 1.4 * Math.sin(TAU * y / s1); o[1] = y; });
        moves.push(combMap(false, s2, s2 / 2, z * 0.8, s2 * 0.12));
      } else if (p.comb === 'waves' && z > 0) {
        const L1 = w / Math.max(1, tines / 3), L2 = h / Math.max(1, tines / 4), ph1 = R() * TAU, ph2 = R() * TAU;
        moves.push((x, y, o) => { o[0] = x; o[1] = y + z * 1.2 * Math.sin(TAU * x / L1 + ph1); });
        moves.push((x, y, o) => { o[0] = x + z * 0.7 * Math.sin(TAU * y / L2 + ph2); o[1] = y; });
      } else if (p.comb === 'swirl' && z > 0) {
        const nv = 1 + Math.floor(R() * 3);
        for (let k = 0; k < nv; k++) {
          const vx = w * (0.2 + 0.6 * R()), vy = h * (0.2 + 0.6 * R()), sg = m * (0.18 + R() * 0.2), turn = (R() < 0.5 ? -1 : 1) * p.pull * 2.4;
          moves.push((x, y, o) => {
            const dx = x - vx, dy = y - vy, a = turn * Math.exp(-(dx * dx + dy * dy) / (sg * sg)), c = Math.cos(a), s = Math.sin(a);
            o[0] = vx + dx * c - dy * s; o[1] = vy + dx * s + dy * c;
          });
        }
      }
      for (const T of moves) marbleMove(polys, T, maxSeg, budget);
      // oldest ink first: every later drop sits on top of the ones it pushed aside
      const veinW = p.veins === 'ink' ? Math.max(1, m * 0.0035) : Math.max(0.6, m * 0.0012);
      ctx.lineJoin = 'round';
      for (const P of polys) {
        const a = P.pts, pa = new Path2D();
        pa.moveTo(a[0], a[1]);
        for (let k = 2; k < a.length; k += 2) pa.lineTo(a[k], a[k + 1]);
        pa.closePath();
        ctx.fillStyle = P.col; ctx.fill(pa);
        if (p.veins !== 'none') { ctx.strokeStyle = mix(P.col, pal.bg, p.veins === 'ink' ? 0.55 : 0.35); ctx.lineWidth = veinW; ctx.stroke(pa); }
      }
    },
  };
  // a tiny seeded generator for things that must repeat within one piece (bullseye hubs)
  function mulberry(a) {
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  // ---------- Chladni plate: sand gathers where the plate stays still ----------
  // Square plate: cos(n pi x) cos(m pi y) -/+ cos(m pi x) cos(n pi y). Round plate: cos(k theta) sin(m pi r).
  // Grains are dropped where the plate barely moves, then nudged one Newton step onto the still line.
  GENS.chladni = {
    name: 'Chladni',
    blurb: 'sand shaken into the still lines of a singing plate',
    params: [
      { k: 'n', label: 'mode n', min: 1, max: 14, step: 0.05, def: 5 },
      { k: 'm', label: 'mode m', min: 1, max: 14, step: 0.05, def: 2 },
      { k: 'plate', label: 'plate', options: ['square', 'round', 'both'], def: 'square' },
      { k: 'sign', label: 'symmetry', options: ['odd', 'even'], def: 'odd' },
      { k: 'sand', label: 'sand', min: 0.1, max: 3, step: 0.01, def: 1 },
      { k: 'settle', label: 'settle', min: 0.2, max: 3, step: 0.01, def: 1 },
      { k: 'color', label: 'colour by', options: ['cells', 'depth', 'one'], def: 'cells' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const m = Math.min(w, h), PI = Math.PI, n = p.n, mm = p.m, sgn = p.sign === 'even' ? 1 : -1;
      const ka = Math.max(1, Math.round(n)), rot = R() * TAU, x0 = (w - m) / 2, y0 = (h - m) / 2;
      const W = Math.ceil(w), Hh = Math.ceil(h), fv = new Float32Array(W * Hh);
      // the plate's shape on the pixel grid; the square mode is separable, so it is two table lookups a pixel
      const cnx = new Float32Array(W), cmx = new Float32Array(W), cny = new Float32Array(Hh), cmy = new Float32Array(Hh);
      for (let i = 0; i < W; i++) { const x = (i + 0.5 - x0) / m; cnx[i] = Math.cos(n * PI * x); cmx[i] = Math.cos(mm * PI * x); }
      for (let j = 0; j < Hh; j++) { const y = (j + 0.5 - y0) / m; cny[j] = Math.cos(n * PI * y); cmy[j] = Math.cos(mm * PI * y); }
      const round = p.plate !== 'square', both = p.plate === 'both';
      for (let j = 0, q = 0; j < Hh; j++) {
        const dy = (j + 0.5 - y0) / m - 0.5;
        for (let i = 0; i < W; i++, q++) {
          let v = cnx[i] * cmy[j] + sgn * cmx[i] * cny[j];
          if (round) {
            const dx = (i + 0.5 - x0) / m - 0.5, rv = Math.cos(ka * Math.atan2(dy, dx) + rot) * Math.sin(mm * PI * Math.sqrt(dx * dx + dy * dy) * 1.6);
            v = both ? v * rv * 1.6 : rv;
          }
          fv[q] = v;
        }
      }
      // sand settles where the plate barely moves: each pixel holds a grain with a chance that falls off with |f|
      const sig = 0.07 / p.settle, is2 = 1 / (sig * sig);
      let E = 0;
      const far = 16 * sig * sig;
      for (let q = 0; q < fv.length; q++) { const v2 = fv[q] * fv[q]; if (v2 < far) E += Math.exp(-v2 * is2); }
      const want = p.sand * w * h / 12, qk = E > 0 ? want / E : 0;
      const cols = byContrast(pal), nc = cols.length, col3 = cols.map(rgbOf), glint = cols.map(c => rgbOf(mix(c, '#ffffff', 0.5)));
      const O = offscreen(W, Hh), px = O.img.data, gs = Math.max(1, m * 0.0012), jit = sig * 0.08 * m, cap = 0.02 / p.settle * m;
      const put = (gx, gy, s, c3) => {
        const ax = Math.max(0, Math.round(gx - s / 2)), ay = Math.max(0, Math.round(gy - s / 2)), bx = Math.min(W, ax + s), by = Math.min(Hh, ay + s);
        for (let yy = ay; yy < by; yy++) for (let xx = ax; xx < bx; xx++) { const o = (yy * W + xx) * 4; px[o] = c3[0]; px[o + 1] = c3[1]; px[o + 2] = c3[2]; px[o + 3] = 255; }
      };
      for (let j = 1; j < Hh - 1; j++) for (let i = 1; i < W - 1; i++) {
        const q = j * W + i, v = fv[q];
        if (v * v >= far || R() > qk * Math.exp(-v * v * is2)) continue;
        // one damped Newton step towards the still line (gradient from the neighbouring pixels), capped
        const gx = (fv[q + 1] - fv[q - 1]) / 2, gy = (fv[q + W] - fv[q - W]) / 2, g2 = gx * gx + gy * gy;
        let x = i + R(), y = j + R();
        if (g2 > 1e-12) {
          let k = 0.55 * v / g2, sx = k * gx, sy = k * gy;
          const sl = Math.hypot(sx, sy);
          if (sl > cap) { sx *= cap / sl; sy *= cap / sl; }
          x -= sx; y -= sy;
        }
        x += (R() - 0.5) * jit; y += (R() - 0.5) * jit;
        let ci;
        if (p.color === 'one') ci = nc - 1;
        else if (p.color === 'depth') ci = Math.max(0, nc - 1 - Math.min(nc - 1, Math.floor(Math.abs(v) / sig * nc * 0.8)));
        else ci = ((Math.floor((x - x0) / m * n) + Math.floor((y - y0) / m * mm)) % nc + nc) % nc;
        put(x, y, Math.max(1, Math.round(gs * (0.6 + R() * 0.9))), R() < 0.04 ? glint[ci] : col3[ci]);
      }
      O.x.putImageData(O.img, 0, 0);
      ctx.drawImage(O.cv, 0, 0);
    },
  };
})();
