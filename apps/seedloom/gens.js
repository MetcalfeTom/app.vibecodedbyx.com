// Seedloom generators. Every one draws into a plain 2D canvas from (params, seeded random, palette, noise).
// Sizes are written for a 1000-unit canvas and scaled by u, so a layer looks the same at preview and print size.
(function () {
  const TAU = Math.PI * 2;

  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Classic gradient noise with a seeded permutation, plus fractal sums
  function makeNoise(R) {
    const perm = new Uint8Array(512);
    const base = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
    for (let i = 0; i < 512; i++) perm[i] = base[i & 255];
    const gx = [1, -1, 1, -1, 1, -1, 0, 0], gy = [1, 1, -1, -1, 0, 0, 1, -1];
    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    function n2(x, y) {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const X = xi & 255, Y = yi & 255;
      const g = (h, dx, dy) => { h &= 7; return gx[h] * dx + gy[h] * dy; };
      const aa = perm[perm[X] + Y], ab = perm[perm[X] + Y + 1], ba = perm[perm[X + 1] + Y], bb = perm[perm[X + 1] + Y + 1];
      const u = fade(xf), v = fade(yf);
      const x1 = g(aa, xf, yf) + u * (g(ba, xf - 1, yf) - g(aa, xf, yf));
      const x2 = g(ab, xf, yf - 1) + u * (g(bb, xf - 1, yf - 1) - g(ab, xf, yf - 1));
      return (x1 + v * (x2 - x1)) * 0.9;
    }
    function fbm(x, y, oct = 4) {
      let s = 0, a = 0.5, f = 1;
      for (let i = 0; i < oct; i++) { s += a * n2(x * f, y * f); f *= 2.03; a *= 0.5; }
      return s;
    }
    return { n2, fbm };
  }

  const pick = (R, arr) => arr[Math.floor(R() * arr.length)];
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  }
  function mix(h1, h2, k) {
    const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
    const c = (s) => Math.round(((a >> s) & 255) + (((b >> s) & 255) - ((a >> s) & 255)) * k);
    return `rgb(${c(16)},${c(8)},${c(0)})`;
  }

  const GENS = {};

  // ——— Flow field: thousands of threads combed by noise
  GENS.flow = {
    name: 'Flow Field',
    blurb: 'threads combed by noise',
    params: [
      { k: 'lines', label: 'threads', min: 100, max: 5000, step: 50, def: 1400 },
      { k: 'steps', label: 'length', min: 10, max: 400, step: 5, def: 110 },
      { k: 'scale', label: 'zoom', min: 0.3, max: 8, step: 0.1, def: 2 },
      { k: 'curl', label: 'curl', min: 0.2, max: 4, step: 0.05, def: 1.2 },
      { k: 'width', label: 'weight', min: 0.2, max: 8, step: 0.1, def: 1.1 },
      { k: 'alpha', label: 'ink', min: 0.05, max: 1, step: 0.05, def: 0.65 },
      { k: 'color', label: 'colour by', options: ['palette', 'direction', 'height'], def: 'direction' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.lineWidth = p.width * u;
      const sc = p.scale / (1000 * u), step = 2.2 * u, c = pal.c;
      for (let i = 0; i < p.lines; i++) {
        let x = R() * w, y = R() * h;
        const a0 = N.fbm(x * sc, y * sc, 3);
        const col = p.color === 'palette' ? pick(R, c)
          : p.color === 'height' ? c[Math.min(c.length - 1, Math.floor(y / h * c.length))]
          : c[Math.min(c.length - 1, Math.floor((a0 * 1.6 + 0.5 + 10) % 1 * c.length))];
        ctx.strokeStyle = hexA(col, p.alpha);
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let s = 0; s < p.steps; s++) {
          const a = N.fbm(x * sc, y * sc, 3) * TAU * p.curl;
          x += Math.cos(a) * step; y += Math.sin(a) * step;
          if (x < -20 || y < -20 || x > w + 20 || y > h + 20) break;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
  };

  // ——— Circle packing: bubbles that never touch
  GENS.circles = {
    name: 'Circle Packing',
    blurb: 'bubbles that never touch',
    params: [
      { k: 'count', label: 'circles', min: 20, max: 3000, step: 10, def: 700 },
      { k: 'minR', label: 'smallest', min: 1, max: 40, step: 1, def: 4 },
      { k: 'maxR', label: 'largest', min: 10, max: 320, step: 2, def: 110 },
      { k: 'gap', label: 'gap', min: 0, max: 24, step: 0.5, def: 3 },
      { k: 'style', label: 'style', options: ['filled', 'rings', 'targets', 'outline', 'mixed'], def: 'mixed' },
      { k: 'width', label: 'line', min: 0.5, max: 8, step: 0.1, def: 1.6 },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const minR = p.minR * u, maxR = Math.max(minR, p.maxR * u), gap = p.gap * u;
      const cell = 2 * maxR + gap, cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1;
      const grid = Array.from({ length: cols * rows }, () => []);
      const out = [];
      const tries = p.count * 40;
      for (let t = 0; t < tries && out.length < p.count; t++) {
        const x = R() * w, y = R() * h;
        const gxI = Math.floor(x / cell), gyI = Math.floor(y / cell);
        let r = maxR;
        for (let dy = -1; dy <= 1 && r >= minR; dy++) for (let dx = -1; dx <= 1; dx++) {
          const cx = gxI + dx, cy = gyI + dy;
          if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) continue;
          for (const o of grid[cy * cols + cx]) {
            const room = Math.hypot(o.x - x, o.y - y) - o.r - gap;
            if (room < r) r = room;
            if (r < minR) break;
          }
        }
        if (r < minR) continue;
        // favour a spread of sizes: shrink big candidates now and then
        if (r > minR * 3 && R() < 0.35) r = minR + (r - minR) * R();
        const c = { x, y, r };
        out.push(c);
        grid[gyI * cols + gxI].push(c);
      }
      ctx.lineWidth = p.width * u;
      for (const c of out) {
        const style = p.style === 'mixed' ? pick(R, ['filled', 'rings', 'targets', 'outline']) : p.style;
        const col = pick(R, pal.c), col2 = pick(R, pal.c);
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, TAU);
        if (style === 'filled') { ctx.fillStyle = col; ctx.fill(); }
        else if (style === 'outline') { ctx.strokeStyle = col; ctx.stroke(); }
        else if (style === 'rings') {
          ctx.strokeStyle = col;
          const stepR = Math.max(ctx.lineWidth * 2.5, 3 * u);
          for (let rr = c.r; rr > stepR * 0.5; rr -= stepR) { ctx.beginPath(); ctx.arc(c.x, c.y, rr, 0, TAU); ctx.stroke(); }
        } else {
          ctx.fillStyle = col; ctx.fill();
          ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 0.62, 0, TAU); ctx.fillStyle = col2; ctx.fill();
          ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 0.28, 0, TAU); ctx.fillStyle = col; ctx.fill();
        }
      }
    },
  };

  // ——— Truchet tiles: one tile, four turns, endless mazes
  GENS.truchet = {
    name: 'Truchet Tiles',
    blurb: 'one tile, endless mazes',
    params: [
      { k: 'size', label: 'tile', min: 12, max: 220, step: 2, def: 70 },
      { k: 'style', label: 'style', options: ['arcs', 'weave', 'diagonals', 'triangles'], def: 'weave' },
      { k: 'width', label: 'line', min: 1, max: 60, step: 0.5, def: 12 },
      { k: 'colors', label: 'colours', min: 1, max: 5, step: 1, def: 2 },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const s = p.size * u, cols = Math.ceil(w / s), rows = Math.ceil(h / s);
      const cs = pal.c.slice(0, p.colors);
      ctx.lineCap = p.style === 'diagonals' ? 'round' : 'butt';
      const tiles = [];
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) tiles.push({ x: i * s, y: j * s, f: R() < 0.5, c: pick(R, cs) });
      const arcs = (t) => {
        ctx.beginPath();
        if (t.f) {
          ctx.moveTo(t.x + s / 2, t.y); ctx.arc(t.x, t.y, s / 2, 0, Math.PI / 2);
          ctx.moveTo(t.x + s / 2, t.y + s); ctx.arc(t.x + s, t.y + s, s / 2, Math.PI, Math.PI * 1.5);
        } else {
          ctx.moveTo(t.x + s, t.y + s / 2); ctx.arc(t.x + s, t.y, s / 2, Math.PI / 2, Math.PI);
          ctx.moveTo(t.x, t.y + s / 2); ctx.arc(t.x, t.y + s, s / 2, Math.PI * 1.5, TAU);
        }
      };
      for (const t of tiles) {
        if (p.style === 'triangles') {
          ctx.fillStyle = t.c; ctx.beginPath();
          if (t.f) { ctx.moveTo(t.x, t.y); ctx.lineTo(t.x + s, t.y); ctx.lineTo(t.x, t.y + s); }
          else { ctx.moveTo(t.x + s, t.y); ctx.lineTo(t.x + s, t.y + s); ctx.lineTo(t.x, t.y + s); }
          ctx.fill();
        } else if (p.style === 'diagonals') {
          ctx.strokeStyle = t.c; ctx.lineWidth = p.width * u; ctx.beginPath();
          if (t.f) { ctx.moveTo(t.x, t.y); ctx.lineTo(t.x + s, t.y + s); } else { ctx.moveTo(t.x + s, t.y); ctx.lineTo(t.x, t.y + s); }
          ctx.stroke();
        } else if (p.style === 'weave') {
          arcs(t); ctx.strokeStyle = pal.bg; ctx.lineWidth = p.width * u * 1.8; ctx.stroke();
          arcs(t); ctx.strokeStyle = t.c; ctx.lineWidth = p.width * u; ctx.stroke();
        } else {
          arcs(t); ctx.strokeStyle = t.c; ctx.lineWidth = p.width * u; ctx.stroke();
        }
      }
    },
  };

  // ——— Ridgelines: mountain silhouettes stacked like an old record sleeve
  GENS.ridges = {
    name: 'Ridgelines',
    blurb: 'stacked mountain pulses',
    params: [
      { k: 'lines', label: 'lines', min: 8, max: 140, step: 1, def: 52 },
      { k: 'amp', label: 'height', min: 0, max: 400, step: 2, def: 150 },
      { k: 'scale', label: 'roughness', min: 0.5, max: 12, step: 0.1, def: 3.2 },
      { k: 'focus', label: 'focus', min: 0, max: 1, step: 0.05, def: 0.75 },
      { k: 'width', label: 'line', min: 0.4, max: 6, step: 0.1, def: 1.6 },
      { k: 'fill', label: 'hide behind', options: ['yes', 'no'], def: 'yes' },
      { k: 'color', label: 'color', options: ['one', 'cycle', 'fade'], def: 'one' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const m = 80 * u, top = m + p.amp * u * 0.6, span = h - top - m;
      const stepX = 4 * u, sc = p.scale / (1000 * u);
      ctx.lineWidth = p.width * u; ctx.lineJoin = 'round';
      const cs = pal.c;
      for (let i = 0; i < p.lines; i++) {
        const y0 = top + (p.lines === 1 ? 0 : i / (p.lines - 1)) * span;
        ctx.beginPath(); ctx.moveTo(m, y0);
        for (let x = m; x <= w - m + 0.1; x += stepX) {
          const k = (x - m) / (w - 2 * m) - 0.5;
          const env = (1 - p.focus) + p.focus * Math.exp(-k * k * 18);
          const v = Math.max(0, N.fbm(x * sc, i * 0.23 + 10, 4) + 0.1);
          ctx.lineTo(x, y0 - v * v * 6 * p.amp * u * env);
        }
        if (p.fill === 'yes') {
          ctx.lineTo(w - m, y0 + 2 * u); ctx.lineTo(m, y0 + 2 * u); ctx.closePath();
          ctx.fillStyle = pal.bg; ctx.fill();
        }
        const t = p.lines === 1 ? 0 : i / (p.lines - 1);
        ctx.strokeStyle = p.color === 'cycle' ? cs[i % cs.length] : p.color === 'fade' ? mix(cs[0], cs[2], t) : cs[0];
        ctx.stroke();
      }
    },
  };

  // ---------- shared helpers for the second batch ----------
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  const darkest = pal => [pal.bg, ...pal.c].reduce((a, b) => (lum(a) <= lum(b) ? a : b));
  const lightest = pal => [pal.bg, ...pal.c].reduce((a, b) => (lum(a) >= lum(b) ? a : b));
  // walk the palette like a gradient: 0 = first colour, 1 = last
  const ramp = (cs, t) => { const x = Math.max(0, Math.min(1, t)) * (cs.length - 1), i = Math.min(cs.length - 2, Math.floor(x)); return mix(cs[i], cs[i + 1], x - i); };
  const rrect = (ctx, x, y, w, h, r) => { if (r > 0 && ctx.roundRect) ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); else ctx.rect(x, y, w, h); };

  // ---------- Stained glass: Voronoi cells cut out of the canvas one half-plane at a time ----------
  function clipHalf(poly, px, py, qx, qy) {
    const mx = (px + qx) / 2, my = (py + qy) / 2, nx = qx - px, ny = qy - py, out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const da = (a[0] - mx) * nx + (a[1] - my) * ny, db = (b[0] - mx) * nx + (b[1] - my) * ny;
      if (da <= 0) out.push(a);
      if ((da <= 0) !== (db <= 0)) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  GENS.glass = {
    name: 'Stained Glass',
    blurb: 'voronoi cells with lead lines',
    params: [
      { k: 'count', label: 'cells', min: 6, max: 700, step: 1, def: 140 },
      { k: 'pattern', label: 'seeds', options: ['scattered', 'even', 'sunflower', 'clustered'], def: 'scattered' },
      { k: 'lead', label: 'lead', min: 0, max: 24, step: 0.5, def: 6 },
      { k: 'fillp', label: 'filled', min: 0, max: 1, step: 0.05, def: 1 },
      { k: 'style', label: 'style', options: ['glass', 'flat', 'outline'], def: 'glass' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const n = Math.round(p.count), pts = [];
      if (p.pattern === 'even') {
        const cols = Math.max(1, Math.round(Math.sqrt(n * w / h))), rows = Math.max(1, Math.round(n / cols));
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pts.push([(c + 0.5 + (R() - 0.5) * 0.8) * w / cols, (r + 0.5 + (R() - 0.5) * 0.8) * h / rows]);
      } else if (p.pattern === 'sunflower') {
        const rad = Math.hypot(w, h) / 2, ga = Math.PI * (3 - Math.sqrt(5)), rot = R() * TAU;
        for (let i = 0; i < n; i++) { const r = rad * Math.sqrt((i + 0.5) / n), a = i * ga + rot; pts.push([w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r]); }
      } else if (p.pattern === 'clustered') {
        for (let tries = 0; pts.length < n && tries < n * 80; tries++) {
          const x = R() * w, y = R() * h, v = N.fbm(x / (w * 0.3), y / (w * 0.3), 3) + 0.5;
          if (R() < v * v * v * 2) pts.push([x, y]);
        }
      } else for (let i = 0; i < n; i++) pts.push([R() * w, R() * h]);

      const cells = [], m = pts.length, d2s = new Float64Array(m), idx = new Uint32Array(m);
      for (let i = 0; i < m; i++) {
        const px = pts[i][0], py = pts[i][1];
        for (let j = 0; j < m; j++) { const dx = pts[j][0] - px, dy = pts[j][1] - py; d2s[j] = dx * dx + dy * dy; idx[j] = j; }
        idx.sort((a, b) => d2s[a] - d2s[b]);
        let poly = [[0, 0], [w, 0], [w, h], [0, h]];
        for (let k = 1; k < m && poly.length >= 3; k++) {
          const j = idx[k];
          let far = 0;
          for (const v of poly) { const dx = v[0] - px, dy = v[1] - py; far = Math.max(far, dx * dx + dy * dy); }
          if (d2s[j] > 4 * far) break; // no farther seed can cut this cell any more
          poly = clipHalf(poly, px, py, pts[j][0], pts[j][1]);
        }
        if (poly.length >= 3) cells.push(poly);
      }
      const trace = poly => { ctx.moveTo(poly[0][0], poly[0][1]); for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]); ctx.closePath(); };
      if (p.style !== 'outline') {
        for (const poly of cells) {
          const col = pick(R, pal.c), fill = R() < p.fillp;
          if (!fill) continue;
          ctx.beginPath(); trace(poly);
          ctx.fillStyle = col; ctx.fill();
          if (p.style === 'glass') {
            let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
            for (const v of poly) { x0 = Math.min(x0, v[0]); y0 = Math.min(y0, v[1]); x1 = Math.max(x1, v[0]); y1 = Math.max(y1, v[1]); }
            const g = ctx.createLinearGradient(x0, y0, x1, y1);
            g.addColorStop(0, 'rgba(255,255,255,0.38)'); g.addColorStop(0.5, 'rgba(255,255,255,0.04)'); g.addColorStop(1, 'rgba(0,0,0,0.28)');
            ctx.fillStyle = g; ctx.fill();
          }
        }
      }
      const lw = p.style === 'outline' ? Math.max(1, p.lead) * u : p.lead * u;
      if (lw > 0) {
        ctx.beginPath(); for (const poly of cells) trace(poly);
        ctx.lineJoin = 'round'; ctx.lineWidth = lw;
        ctx.strokeStyle = p.style === 'outline' ? pal.c[0] : darkest(pal);
        ctx.stroke();
      }
    },
  };

  // ---------- Topography: marching squares over a domain-warped noise field ----------
  const SEG = [[], [3, 2], [2, 1], [3, 1], [0, 1], [3, 0, 2, 1], [0, 2], [3, 0], [3, 0], [0, 2], [0, 1, 3, 2], [0, 1], [3, 1], [2, 1], [3, 2], []];
  GENS.topo = {
    name: 'Topography',
    blurb: 'contour lines of an imaginary land',
    params: [
      { k: 'levels', label: 'levels', min: 3, max: 60, step: 1, def: 22 },
      { k: 'scale', label: 'zoom out', min: 0.5, max: 8, step: 0.1, def: 2.2 },
      { k: 'warp', label: 'warp', min: 0, max: 3, step: 0.05, def: 0.8 },
      { k: 'detail', label: 'detail', min: 1, max: 6, step: 1, def: 4 },
      { k: 'style', label: 'style', options: ['lines', 'bands', 'bands + lines'], def: 'lines' },
      { k: 'width', label: 'line', min: 0.3, max: 6, step: 0.1, def: 1.2 },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const cell = Math.max(3, 6 * u), cols = Math.ceil(w / cell) + 1, rows = Math.ceil(h / cell) + 1;
      const F = new Float32Array(cols * rows), sc = p.scale * cell / (1000 * u), oct = Math.round(p.detail);
      let lo = Infinity, hi = -Infinity;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        let x = i * sc, y = j * sc;
        if (p.warp > 0) { const wx = N.fbm(x + 5.2, y + 1.3, 3), wy = N.fbm(x + 1.7, y + 9.2, 3); x += p.warp * wx * 2; y += p.warp * wy * 2; }
        const v = N.fbm(x, y, oct);
        F[j * cols + i] = v; if (v < lo) lo = v; if (v > hi) hi = v;
      }
      const L = Math.round(p.levels), thr = k => lo + (hi - lo) * (k + 1) / (L + 1);
      const at = (i, j) => F[j * cols + i];
      if (p.style !== 'lines') {
        ctx.fillStyle = ramp(pal.c, 0); ctx.fillRect(0, 0, w, h);
        for (let k = 0; k < L; k++) {
          const t = thr(k);
          ctx.beginPath();
          for (let j = 0; j < rows - 1; j++) {
            let run = -1;
            for (let i = 0; i < cols; i++) {
              const a = i < cols - 1 ? at(i, j) : -Infinity, b = i < cols - 1 ? at(i + 1, j) : -Infinity;
              const c = i < cols - 1 ? at(i + 1, j + 1) : -Infinity, d = i < cols - 1 ? at(i, j + 1) : -Infinity;
              const full = a > t && b > t && c > t && d > t;
              if (full) { if (run < 0) run = i; continue; }
              if (run >= 0) { ctx.rect(run * cell, j * cell, (i - run) * cell + 0.5, cell + 0.5); run = -1; }
              if (i === cols - 1 || (a <= t && b <= t && c <= t && d <= t)) continue;
              // clockwise walk: keep corners above t, add a crossing point on every edge that changes side
              const cx = [i, i + 1, i + 1, i], cy = [j, j, j + 1, j + 1], cv = [a, b, c, d];
              let first = true;
              for (let q = 0; q < 4; q++) {
                const r = (q + 1) & 3;
                if (cv[q] > t) { if (first) { ctx.moveTo(cx[q] * cell, cy[q] * cell); first = false; } else ctx.lineTo(cx[q] * cell, cy[q] * cell); }
                if ((cv[q] > t) !== (cv[r] > t)) {
                  const s = (t - cv[q]) / (cv[r] - cv[q]), X = (cx[q] + (cx[r] - cx[q]) * s) * cell, Y = (cy[q] + (cy[r] - cy[q]) * s) * cell;
                  if (first) { ctx.moveTo(X, Y); first = false; } else ctx.lineTo(X, Y);
                }
              }
              ctx.closePath();
            }
          }
          ctx.fillStyle = ramp(pal.c, (k + 1) / L);
          ctx.fill();
        }
      }
      if (p.style !== 'bands') {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const ink = hexA(darkest(pal), 0.6);
        for (let k = 0; k < L; k++) {
          const t = thr(k);
          ctx.beginPath();
          for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
            const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
            const segs = SEG[(a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (d > t ? 1 : 0)];
            for (let s = 0; s < segs.length; s += 2) {
              for (let e = 0; e < 2; e++) {
                const E = segs[s + e]; let X, Y;
                if (E === 0) { X = i + (t - a) / (b - a); Y = j; } else if (E === 1) { X = i + 1; Y = j + (t - b) / (c - b); }
                else if (E === 2) { X = i + (t - d) / (c - d); Y = j + 1; } else { X = i; Y = j + (t - a) / (d - a); }
                if (e === 0) ctx.moveTo(X * cell, Y * cell); else ctx.lineTo(X * cell, Y * cell);
              }
            }
          }
          const index = (k + 1) % 5 === 0; // every fifth line is an index contour, like on a real map
          ctx.lineWidth = p.width * u * (index ? 2.2 : 1);
          ctx.strokeStyle = p.style === 'lines' ? ramp(pal.c, k / Math.max(1, L - 1)) : ink;
          ctx.stroke();
        }
      }
    },
  };

  // ---------- Harmonograph: two damped pendulums per axis ----------
  const RATIOS = { '1:1': [1, 1], '1:2': [1, 2], '2:3': [2, 3], '3:4': [3, 4], '3:5': [3, 5], '4:5': [4, 5] };
  GENS.harmono = {
    name: 'Harmonograph',
    blurb: 'pendulums swinging a pen',
    params: [
      { k: 'ratio', label: 'ratio', options: ['1:1', '1:2', '2:3', '3:4', '3:5', '4:5', 'surprise'], def: '2:3' },
      { k: 'detune', label: 'detune', min: 0, max: 0.05, step: 0.001, def: 0.01 },
      { k: 'decay', label: 'fade', min: 0.0005, max: 0.02, step: 0.0005, def: 0.0035 },
      { k: 'turns', label: 'length', min: 20, max: 600, step: 5, def: 240 },
      { k: 'size', label: 'size', min: 0.2, max: 1.2, step: 0.01, def: 0.88 },
      { k: 'width', label: 'line', min: 0.3, max: 5, step: 0.1, def: 0.9 },
      { k: 'color', label: 'color', options: ['gradient', 'one'], def: 'gradient' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const [a, b] = p.ratio === 'surprise' ? pick(R, Object.values(RATIOS)) : RATIOS[p.ratio];
      const f = [a, b, b, a].map(v => v * (1 + (R() * 2 - 1) * p.detune));
      const ph = [0, 1, 2, 3].map(() => R() * TAU), k2 = 0.45 + R() * 0.5;
      const A = Math.min(w, h) * 0.5 * p.size / (1 + k2), T = p.turns * TAU, steps = Math.round(p.turns * 110);
      const pt = s => {
        const t = s / steps * T, e = Math.exp(-p.decay * t);
        return [w / 2 + A * e * (Math.sin(f[0] * t + ph[0]) + k2 * Math.sin(f[1] * t + ph[1])),
                h / 2 + A * e * (Math.sin(f[2] * t + ph[2]) + k2 * Math.sin(f[3] * t + ph[3]))];
      };
      ctx.lineWidth = p.width * u; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const chunks = 180;
      for (let c = 0; c < chunks; c++) {
        const s0 = Math.floor(c * steps / chunks), s1 = Math.floor((c + 1) * steps / chunks);
        ctx.beginPath();
        let q = pt(s0); ctx.moveTo(q[0], q[1]);
        for (let s = s0 + 1; s <= s1; s++) { q = pt(s); ctx.lineTo(q[0], q[1]); }
        ctx.strokeStyle = p.color === 'one' ? pal.c[0] : ramp(pal.c, c / (chunks - 1));
        ctx.stroke();
      }
    },
  };

  // ---------- Subdivide: split rectangles, then split them again ----------
  GENS.subdiv = {
    name: 'Subdivide',
    blurb: 'rectangles split and split again',
    params: [
      { k: 'depth', label: 'depth', min: 1, max: 10, step: 1, def: 6 },
      { k: 'chance', label: 'split odds', min: 0.2, max: 1, step: 0.05, def: 0.75 },
      { k: 'gap', label: 'gap', min: 0, max: 30, step: 0.5, def: 6 },
      { k: 'round', label: 'corners', min: 0, max: 80, step: 1, def: 6 },
      { k: 'fillp', label: 'filled', min: 0, max: 1, step: 0.05, def: 0.9 },
      { k: 'style', label: 'style', options: ['blocks', 'mondrian', 'patterned', 'outline'], def: 'blocks' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const leaves = [], minS = 26 * u;
      const cuts = [1 / 3, 1 / 2, 2 / 3, 0.382, 0.618];
      (function split(x, y, W, H, d) {
        if (d >= p.depth || (d > 1 && R() > p.chance) || Math.min(W, H) < minS * 2) { leaves.push([x, y, W, H]); return; }
        const vert = W > H * 1.25 ? true : H > W * 1.25 ? false : R() < 0.5, k = pick(R, cuts);
        if (vert) { split(x, y, W * k, H, d + 1); split(x + W * k, y, W * (1 - k), H, d + 1); }
        else { split(x, y, W, H * k, d + 1); split(x, y + H * k, W, H * (1 - k), d + 1); }
      })(0, 0, w, h, 0);
      const g = p.gap * u, r = p.round * u, ink = darkest(pal), paper = lightest(pal);
      for (const [x, y, W, H] of leaves) {
        const col = pick(R, pal.c), roll = R(), kind = Math.floor(R() * 4), ang = pick(R, [0, 1, 2, 3]);
        const X = x + g / 2, Y = y + g / 2, Ww = W - g, Hh = H - g;
        if (Ww <= 0 || Hh <= 0) continue;
        ctx.beginPath(); rrect(ctx, X, Y, Ww, Hh, r);
        if (p.style === 'mondrian') {
          ctx.fillStyle = roll < p.fillp * 0.35 ? col : paper; ctx.fill();
          ctx.lineWidth = Math.max(2 * u, g * 0.9 + 3 * u); ctx.strokeStyle = ink; ctx.stroke();
        } else if (p.style === 'outline') {
          if (roll < p.fillp) { ctx.lineWidth = 2 * u; ctx.strokeStyle = col; ctx.stroke(); }
        } else {
          if (roll >= p.fillp) continue;
          ctx.fillStyle = col; ctx.fill();
          if (p.style === 'patterned') {
            ctx.save(); ctx.clip();
            const other = pal.c[(pal.c.indexOf(col) + 1 + kind) % pal.c.length];
            ctx.fillStyle = other; ctx.strokeStyle = other;
            const s = Math.max(8 * u, Math.min(Ww, Hh) / 7);
            ctx.beginPath();
            if (kind === 0) { // stripes
              ctx.lineWidth = s * 0.35; const D = Ww + Hh;
              for (let o = -D; o < D; o += s) { if (ang % 2) { ctx.moveTo(X + o, Y); ctx.lineTo(X + o + Hh, Y + Hh); } else { ctx.moveTo(X, Y + o); ctx.lineTo(X + Ww, Y + o); } }
              ctx.stroke();
            } else if (kind === 1) { // dots
              for (let yy = Y + s / 2; yy < Y + Hh; yy += s) for (let xx = X + s / 2; xx < X + Ww; xx += s) { ctx.moveTo(xx + s * 0.22, yy); ctx.arc(xx, yy, s * 0.22, 0, TAU); }
              ctx.fill();
            } else if (kind === 2) { // quarter circle from a corner
              const cx = ang & 1 ? X + Ww : X, cy = ang & 2 ? Y + Hh : Y, rr = Math.min(Ww, Hh);
              ctx.moveTo(cx, cy); ctx.arc(cx, cy, rr, 0, TAU); ctx.fill();
            } else { // concentric rings
              ctx.lineWidth = s * 0.3; const cx = X + Ww / 2, cy = Y + Hh / 2;
              for (let rr = s * 0.5; rr < Math.hypot(Ww, Hh) / 2; rr += s) { ctx.moveTo(cx + rr, cy); ctx.arc(cx, cy, rr, 0, TAU); }
              ctx.stroke();
            }
            ctx.restore();
          }
        }
      }
    },
  };

  // ---------- Sunburst: wedges, beams and rings around a movable sun ----------
  GENS.rays = {
    name: 'Sunburst',
    blurb: 'rays and rings from a hidden sun',
    params: [
      { k: 'rays', label: 'rays', min: 4, max: 180, step: 1, def: 32 },
      { k: 'rings', label: 'rings', min: 0, max: 40, step: 1, def: 7 },
      { k: 'x', label: 'sun x', min: -0.5, max: 1.5, step: 0.01, def: 0.5 },
      { k: 'y', label: 'sun y', min: -0.5, max: 1.5, step: 0.01, def: 0.7 },
      { k: 'twist', label: 'twist', min: -4, max: 4, step: 0.05, def: 0 },
      { k: 'style', label: 'style', options: ['wedges', 'beams', 'wedges + rings', 'rings'], def: 'wedges' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const cx = p.x * w, cy = p.y * h;
      const Rm = Math.max(Math.hypot(cx, cy), Math.hypot(w - cx, cy), Math.hypot(cx, h - cy), Math.hypot(w - cx, h - cy)) + 4;
      const n = Math.round(p.rays), da = TAU / n, rot = R() * TAU, tw = r => p.twist * r / Rm;
      if (p.style === 'wedges' || p.style === 'wedges + rings') {
        const seg = 48;
        for (let i = 0; i < n; i += 2) {
          const a0 = rot + i * da, a1 = a0 + da;
          ctx.beginPath(); ctx.moveTo(cx, cy);
          for (let s = 1; s <= seg; s++) { const r = Rm * s / seg; ctx.lineTo(cx + Math.cos(a0 + tw(r)) * r, cy + Math.sin(a0 + tw(r)) * r); }
          for (let s = seg; s >= 1; s--) { const r = Rm * s / seg; ctx.lineTo(cx + Math.cos(a1 + tw(r)) * r, cy + Math.sin(a1 + tw(r)) * r); }
          ctx.closePath();
          ctx.fillStyle = pal.c[(i / 2) % pal.c.length]; ctx.fill();
        }
      }
      if (p.style === 'beams') {
        ctx.lineCap = 'round';
        for (let i = 0; i < n; i++) {
          const a = rot + i * da + (R() - 0.5) * da * 0.8, len = Rm * (0.35 + R() * 0.65), col = pick(R, pal.c);
          const g = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len);
          g.addColorStop(0, hexA(col, 0.95)); g.addColorStop(1, hexA(col, 0));
          ctx.strokeStyle = g; ctx.lineWidth = (2 + R() * 14) * u;
          ctx.beginPath(); ctx.moveTo(cx, cy);
          for (let s = 1; s <= 24; s++) { const r = len * s / 24; ctx.lineTo(cx + Math.cos(a + tw(r)) * r, cy + Math.sin(a + tw(r)) * r); }
          ctx.stroke();
        }
      }
      const rings = Math.round(p.rings);
      if (rings > 0 && p.style !== 'beams') {
        const step = Rm / (rings + 1);
        for (let k = 1; k <= rings; k++) {
          ctx.beginPath(); ctx.arc(cx, cy, k * step, 0, TAU);
          if (p.style === 'rings') { ctx.lineWidth = step * 0.42; ctx.strokeStyle = pal.c[k % pal.c.length]; }
          else { ctx.lineWidth = Math.max(1.5 * u, step * 0.08); ctx.strokeStyle = darkest(pal); }
          ctx.stroke();
        }
      }
      // the sun itself
      ctx.beginPath(); ctx.arc(cx, cy, Math.min(w, h) * 0.06, 0, TAU);
      ctx.fillStyle = lightest(pal); ctx.fill();
    },
  };

  // ---------- Grain: texture to lay over everything else ----------
  GENS.grain = {
    name: 'Grain',
    blurb: 'speckle, stipple and halftone',
    params: [
      { k: 'style', label: 'style', options: ['speckle', 'halftone', 'stipple'], def: 'speckle' },
      { k: 'density', label: 'density', min: 0.05, max: 1, step: 0.01, def: 0.35 },
      { k: 'size', label: 'size', min: 0.5, max: 30, step: 0.5, def: 1.5 },
      { k: 'scale', label: 'zoom out', min: 0.3, max: 8, step: 0.1, def: 2 },
      { k: 'angle', label: 'screen angle', min: 0, max: 90, step: 1, def: 30 },
      { k: 'color', label: 'color', options: ['ink', 'paper', 'palette'], def: 'ink' },
    ],
    draw(ctx, w, h, p, R, pal, N, u) {
      const cols = p.color === 'palette' ? pal.c : [p.color === 'paper' ? lightest(pal) : darkest(pal)];
      const field = (x, y) => Math.max(0, Math.min(1, N.fbm(x * p.scale / (1000 * u), y * p.scale / (1000 * u), 4) * 1.5 + 0.5));
      if (p.style === 'speckle') {
        const s = p.size * u, n = Math.min(260000, Math.round(p.density * w * h / (s * s * 9)));
        const buckets = cols.map(() => [[], [], []]);
        for (let i = 0; i < n; i++) buckets[Math.floor(R() * cols.length)][Math.floor(R() * 3)].push(R() * w, R() * h, s * (0.5 + R()));
        buckets.forEach((bs, ci) => bs.forEach((b, ai) => {
          ctx.beginPath();
          for (let i = 0; i < b.length; i += 3) ctx.rect(b[i], b[i + 1], b[i + 2], b[i + 2]);
          ctx.globalAlpha = [0.3, 0.6, 0.9][ai]; ctx.fillStyle = cols[ci]; ctx.fill();
        }));
        ctx.globalAlpha = 1;
      } else if (p.style === 'halftone') {
        const sp = Math.max(4 * u, p.size * u * 2.2), a = p.angle * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), D = Math.hypot(w, h);
        const paths = cols.map(() => new Path2D());
        for (let gy = -D; gy < D; gy += sp) for (let gx = -D; gx < D; gx += sp) {
          const x = w / 2 + gx * ca - gy * sa, y = h / 2 + gx * sa + gy * ca;
          if (x < -sp || y < -sp || x > w + sp || y > h + sp) continue;
          const v = field(x, y) * p.density * 1.6, r = sp * 0.5 * Math.sqrt(Math.min(1.3, v));
          if (r < 0.4) continue;
          const ci = cols.length > 1 ? Math.min(cols.length - 1, Math.floor(field(y + 311, x + 97) * cols.length)) : 0;
          paths[ci].moveTo(x + r, y); paths[ci].arc(x, y, r, 0, TAU);
        }
        paths.forEach((pa, i) => { ctx.fillStyle = cols[i]; ctx.fill(pa); });
      } else {
        const r = Math.max(0.5, p.size * u * 0.6), n = Math.min(300000, Math.round(p.density * w * h / (r * r * 12)));
        const paths = cols.map(() => new Path2D());
        for (let i = 0; i < n; i++) {
          const x = R() * w, y = R() * h, v = field(x, y);
          if (R() > v * v * v * 1.4) continue;
          const pa = paths[Math.floor(R() * cols.length)];
          pa.moveTo(x + r, y); pa.arc(x, y, r, 0, TAU);
        }
        paths.forEach((pa, i) => { ctx.fillStyle = cols[i]; ctx.fill(pa); });
      }
    },
  };

  window.SL = { TAU, rng, makeNoise, pick, hexA, mix, GENS };
})();
