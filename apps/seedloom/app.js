// Seedloom: layers of generators composited with blend modes. State lives in S; every change calls schedule().
(function () {
  const { GENS, rng, makeNoise } = window.SL;

  const PALETTES = [
    { name: 'Tidepool', bg: '#0e1b24', c: ['#2ec4b6', '#cbf3f0', '#ff9f1c', '#ffbf69', '#e71d36'] },
    { name: 'Risograph', bg: '#f4efe6', c: ['#ff48b0', '#0078bf', '#ffe800', '#00a95c', '#1d1d1d'] },
    { name: 'Bauhaus', bg: '#efe6d2', c: ['#d7263d', '#1b998b', '#f4c95d', '#2e294e', '#101010'] },
    { name: 'Nocturne', bg: '#0b0a12', c: ['#6c5ce7', '#a29bfe', '#fd79a8', '#ffeaa7', '#dfe6e9'] },
    { name: 'Kiln', bg: '#2b1d16', c: ['#e07a5f', '#f2cc8f', '#81b29a', '#f4f1de', '#3d405b'] },
    { name: 'Moss', bg: '#1a2118', c: ['#a3b18a', '#588157', '#dad7cd', '#e9c46a', '#3a5a40'] },
    { name: 'Ukiyo', bg: '#f2e8cf', c: ['#264653', '#2a9d8f', '#e76f51', '#f4a261', '#1b1b1b'] },
    { name: 'Acid', bg: '#0a0a0a', c: ['#ccff00', '#ff00aa', '#00e5ff', '#ffffff', '#7a00ff'] },
    { name: 'Blueprint', bg: '#0d3b66', c: ['#faf0ca', '#f4d35e', '#ee964b', '#9ec9ff', '#ffffff'] },
    { name: 'Sumi ink', bg: '#f7f3ea', c: ['#111111', '#3a3a3a', '#8a8a8a', '#c9c3b6', '#b3261e'] },
    { name: 'Coral', bg: '#fff4ec', c: ['#ff6f59', '#254441', '#43aa8b', '#b2b09b', '#ef3054'] },
    { name: 'Dusk', bg: '#1d1a2f', c: ['#ff8c61', '#ce6a85', '#985277', '#5c374c', '#faa275'] },
  ];
  const ASPECTS = { '1:1': [1, 1], '4:5': [4, 5], '16:9': [16, 9], '9:16': [9, 16] };
  const BLENDS = [
    ['source-over', 'normal'], ['multiply', 'multiply'], ['screen', 'screen'], ['overlay', 'overlay'],
    ['soft-light', 'soft light'], ['difference', 'difference'], ['lighter', 'add'], ['color-burn', 'burn'],
    ['color-dodge', 'dodge'], ['hue', 'hue'], ['xor', 'cut out'],
  ];
  const BLEND_OK = new Set(BLENDS.map(b => b[0]));

  const $ = id => document.getElementById(id);
  const art = $('art'), actx = art.getContext('2d');
  const S = { pal: 0, aspect: '1:1', layers: [], nextId: 1 };

  // ---------- state helpers ----------
  const newSeed = () => (Math.random() * 2 ** 31) >>> 0;
  function defaults(gen) {
    const p = {};
    for (const d of GENS[gen].params) p[d.k] = d.def;
    return p;
  }
  function makeLayer(gen, extra = {}) {
    return Object.assign({ id: S.nextId++, gen, seed: newSeed(), blend: 'source-over', opacity: 1, on: true, open: false, p: defaults(gen) }, extra);
  }
  // Anything that comes from a link or storage gets checked against the generator's own ranges
  function cleanParams(gen, p) {
    const out = defaults(gen);
    if (!p || typeof p !== 'object') return out;
    for (const d of GENS[gen].params) {
      const v = p[d.k];
      if (d.options) { if (d.options.includes(v)) out[d.k] = v; }
      else if (typeof v === 'number' && isFinite(v)) out[d.k] = Math.min(d.max, Math.max(d.min, v));
    }
    return out;
  }
  function parseState(obj) {
    if (!obj || !Array.isArray(obj.layers)) return null;
    const layers = [];
    for (const l of obj.layers.slice(0, 12)) {
      const [gen, seed, blend, opacity, on, p, ns] = l;
      if (!GENS[gen]) continue;
      layers.push({
        id: S.nextId++, gen, seed: (Number(seed) >>> 0) || newSeed(),
        blend: BLEND_OK.has(blend) ? blend : 'source-over',
        opacity: Math.min(1, Math.max(0, Number(opacity) || 0)),
        on: on !== false && on !== 0, open: false, p: cleanParams(gen, p),
        ...(Number.isInteger(ns) && ns >= 0 ? { ns: ns >>> 0 } : {}),
      });
    }
    if (!layers.length) return null;
    return { layers, pal: Number.isInteger(obj.pal) && PALETTES[obj.pal] ? obj.pal : 0, aspect: ASPECTS[obj.aspect] ? obj.aspect : '1:1' };
  }
  function loadState(obj) {
    const st = parseState(obj);
    if (!st) return false;
    Object.assign(S, st);
    return true;
  }
  const packState = () => ({ v: 1, pal: S.pal, aspect: S.aspect, layers: S.layers.map(l => [l.gen, l.seed, l.blend, +l.opacity.toFixed(2), l.on ? 1 : 0, l.p].concat(l.ns != null ? [l.ns] : [])) });

  // ---------- the museum label: a title that belongs to this exact piece ----------
  const WORD_A = ['Quiet', 'Copper', 'Hollow', 'Late', 'Salt', 'Paper', 'Velvet', 'Northern', 'Slow', 'Amber', 'Iron', 'Silver', 'Tidal', 'Burnt', 'Pale', 'Folded', 'Distant', 'Sunday', 'Wild', 'Borrowed', 'Glass', 'Lunar', 'Humming', 'Winter'];
  const WORD_B = ['Harbour', 'Orchard', 'Signal', 'Weather', 'Garden', 'Current', 'Choir', 'Lantern', 'Meridian', 'Archive', 'Tide', 'Ember', 'Atlas', 'Hymn', 'Field', 'Echo', 'Parade', 'Quarry', 'Window', 'Engine', 'Letter', 'Delta', 'Loom', 'Static'];
  function pieceTitle(st = S) {
    let h = 2166136261 ^ st.pal;
    for (const l of st.layers) if (l.on) { h = Math.imul(h ^ l.seed, 16777619); h = Math.imul(h ^ l.gen.length * 131, 16777619); }
    h >>>= 0;
    return WORD_A[h % WORD_A.length] + ' ' + WORD_B[(h >>> 8) % WORD_B.length];
  }
  function updateLabel() {
    const on = S.layers.filter(l => l.on);
    $('artTitle').textContent = pieceTitle();
    $('artMedium').textContent = (on.length ? on.slice().reverse().map(l => GENS[l.gen].name.toLowerCase()).join(' over ') : 'bare canvas') + ' · ' + PALETTES[S.pal].name.toLowerCase() + ' palette · ' + S.aspect;
  }

  // ---------- rendering ----------
  const cache = new Map();
  const layerKey = (L, W, H, pal) => JSON.stringify([L.gen, L.seed, L.ns, L.p, pal.bg, pal.c, W, H]);
  // cached layers are canvases, or ImageBitmaps when a worker painted them
  const isCanvas = c => typeof HTMLCanvasElement !== 'undefined' && c instanceof HTMLCanvasElement;
  const drop = hit => { if (hit && !isCanvas(hit.cv) && hit.cv.close) hit.cv.close(); };
  function renderLayer(L, W, H, pal, store) {
    const key = layerKey(L, W, H, pal);
    const hit = store.get(L.id);
    if (hit && hit.key === key) return hit.cv;
    if (hit && !isCanvas(hit.cv)) drop(hit);
    const cv = hit && isCanvas(hit.cv) ? hit.cv : document.createElement('canvas');
    cv.width = W; cv.height = H;
    const x = cv.getContext('2d');
    x.clearRect(0, 0, W, H);
    try {
      GENS[L.gen].draw(x, W, H, L.p, rng(L.seed), pal, makeNoise(rng(L.ns != null ? L.ns : L.seed ^ 0x9e3779b9)), Math.min(W, H) / 1000);
    } catch (e) { console.error(L.gen, e); }
    store.set(L.id, { key, cv });
    return cv;
  }
  function composite(ctx, W, H, store, st = S) {
    const pal = PALETTES[st.pal];
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, W, H);
    for (const L of st.layers) {
      if (!L.on || L.opacity <= 0) continue;
      const cv = renderLayer(L, W, H, pal, store);
      ctx.globalAlpha = L.opacity;
      ctx.globalCompositeOperation = L.blend;
      ctx.drawImage(cv, 0, 0);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function size(longSide) {
    const [a, b] = ASPECTS[S.aspect];
    return a >= b ? [longSide, Math.round(longSide * b / a)] : [Math.round(longSide * a / b), longSide];
  }
  const previewLong = () => (innerWidth < 860 ? 1100 : 1400);
  // while you drag on the art it redraws small and fast; letting go paints it at full size
  let draft = false;
  const dcv = document.createElement('canvas'), dctx = dcv.getContext('2d'), dcache = new Map();
  // sliders get the same treatment: quick sketches while they move, the full painting once they rest
  let settleT = 0;
  function live() {
    draft = true;
    clearTimeout(settleT);
    settleT = setTimeout(() => { if (!drag) { draft = false; schedule(); } }, 200);
    schedule();
  }

  // full-size paintings: each layer goes to a background worker when there are any, so the page never freezes;
  // a quick sketch shows the change at once and the sharp version replaces it when every layer is back
  const edQueue = [], inflight = new Set(), noAsync = new Set();
  let draftSig = '';
  function fullAsync(W, H) {
    const pal = PALETTES[S.pal];
    let missing = 0;
    for (const L of S.layers) {
      if (!L.on || L.opacity <= 0) continue;
      const key = layerKey(L, W, H, pal), hit = cache.get(L.id);
      if ((hit && hit.key === key) || noAsync.has(key)) continue;
      missing++;
      if (!inflight.has(key)) { inflight.add(key); edQueue.push({ ed: true, lid: L.id, key, W, H }); }
    }
    if (missing) pump();
    return missing > 0;
  }
  // the job still matches what the layer looks like now
  function edLive(job) {
    const L = S.layers.find(l => l.id === job.lid);
    return L && L.on && L.opacity > 0 && layerKey(L, job.W, job.H, PALETTES[S.pal]) === job.key ? L : null;
  }
  function edDone(job, m) {
    inflight.delete(job.key);
    if (m.fail) { noAsync.add(job.key); schedule(); return; }
    if (edLive(job)) { drop(cache.get(job.lid)); cache.set(job.lid, { key: job.key, cv: m.bmp }); schedule(); }
    else m.bmp.close();
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    if (!draft) $('busy').classList.add('on');
    // two frames: let the "weaving" pill paint before a heavy layer blocks the thread
    requestAnimationFrame(() => requestAnimationFrame(() => {
      queued = false;
      const [W, H] = size(previewLong());
      if (art.width !== W || art.height !== H) { art.width = W; art.height = H; }
      for (const m of [cache, dcache]) for (const id of m.keys()) if (!S.layers.some(l => l.id === id)) { drop(m.get(id)); m.delete(id); }
      const pending = !draft && pool.length > 0 && fullAsync(W, H);
      if (draft || pending) {
        const sig = JSON.stringify(packState()) + W + 'x' + H;
        if (draft || sig !== draftSig) {
          const [w, h] = size(560);
          if (dcv.width !== w || dcv.height !== h) { dcv.width = w; dcv.height = h; }
          composite(dctx, w, h, dcache);
          actx.drawImage(dcv, 0, 0, W, H);
          draftSig = sig;
        }
      } else { composite(actx, W, H, cache); draftSig = ''; }
      drawThumbs(draft || pending ? dcache : cache);
      if (!pending) $('busy').classList.remove('on');
      updateLabel();
      art.setAttribute('aria-label', 'Generated artwork: ' + S.layers.filter(l => l.on).map(l => GENS[l.gen].name).join(', ') + ' in the ' + PALETTES[S.pal].name + ' palette');
      persist();
    }));
  }
  let persistT = 0;
  // history: a snapshot once things settle, so a slider drag is one undo step
  const past = [], future = [];
  let current = null, restoring = false;
  function persist() {
    clearTimeout(persistT);
    persistT = setTimeout(() => {
      const snap = JSON.stringify(packState());
      if (!restoring && current && snap !== current) { past.push(current); if (past.length > 60) past.shift(); future.length = 0; }
      restoring = false;
      current = snap;
      syncHistory();
      try { localStorage.setItem('seedloom-state', snap); } catch (e) {}
    }, 350);
  }
  function syncHistory() { $('undoBtn').hidden = !past.length; $('redoBtn').hidden = !future.length; }
  function travel(from, to) {
    if (!from.length) return;
    to.push(current);
    current = from.pop();
    restoring = true;
    const open = S.layers.findIndex(l => l.open);
    loadState(JSON.parse(current));
    if (S.layers[open]) S.layers[open].open = true;
    syncPalettes(); buildAspects(); buildLayers(); schedule(); syncHistory();
  }
  const undo = () => travel(past, future), redo = () => travel(future, past);

  // ---------- UI ----------
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('on'), 2600);
  }

  function buildPalettes() {
    const box = $('palettes');
    box.innerHTML = '';
    PALETTES.forEach((pal, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pal';
      b.setAttribute('aria-label', pal.name + ' palette');
      b.title = pal.name;
      b.setAttribute('aria-pressed', i === S.pal);
      // the ground fills the card, its five inks run along the bottom
      b.style.background = `linear-gradient(90deg, ${pal.c.map((c, k) => `${c} ${k * 20}% ${(k + 1) * 20}%`).join(', ')}) bottom / 100% 38% no-repeat, ${pal.bg}`;
      b.onclick = () => { S.pal = i; syncPalettes(); refreshMenu(); schedule(); };
      box.appendChild(b);
    });
  }
  const syncPalettes = () => [...$('palettes').children].forEach((b, i) => b.setAttribute('aria-pressed', i === S.pal));

  function buildAspects() {
    const box = $('aspects');
    box.innerHTML = '';
    for (const a of Object.keys(ASPECTS)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = a;
      b.setAttribute('aria-pressed', a === S.aspect);
      b.onclick = () => { S.aspect = a; [...box.children].forEach(c => c.setAttribute('aria-pressed', c.textContent === a)); schedule(); };
      box.appendChild(b);
    }
  }

  const paintFill = r => r.style.setProperty('--fill', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
  function fmt(d, v) { return d.step < 1 ? (+v).toFixed(d.step < 0.1 ? 2 : 1) : String(Math.round(v)); }

  // the two settings you can also drag on the art: sideways (x) and up/down (y)
  const PAD = { flow: ['scale', 'curl'], circles: ['maxR', 'gap'], truchet: ['size', 'width'], ridges: ['amp', 'scale'], glass: ['count', 'lead'], topo: ['scale', 'warp'], harmono: ['detune', 'decay'], subdiv: ['depth', 'gap'], rays: ['x', 'y'], grain: ['scale', 'density'], tartan: ['thread', 'stripes'], stitch: ['size', 'motif'], kilim: ['scale', 'teeth'], coral: ['zoom', 'mutate'], branch: ['reach', 'wander'], phyllo: ['twist', 'size'], attractor: ['morph', 'glow'], moire: ['spread', 'warp'], iso: ['fill', 'melt'] };
  function padOf(gen) {
    const nums = GENS[gen].params.filter(d => !d.options);
    const pick = (PAD[gen] || []).map(k => nums.find(d => d.k === k)).filter(Boolean);
    for (const d of nums) if (pick.length < 2 && !pick.includes(d)) pick.push(d);
    return pick;
  }
  const openLayer = () => S.layers.find(l => l.open) || S.layers[S.layers.length - 1];

  function drawThumbs(store) {
    const bg = PALETTES[S.pal].bg;
    for (const th of $('layers').querySelectorAll('canvas.thumb')) {
      const x = th.getContext('2d'), hit = store.get(+th.dataset.id);
      x.fillStyle = bg;
      x.fillRect(0, 0, th.width, th.height);
      if (hit) {
        const s = Math.min(hit.cv.width, hit.cv.height);
        x.drawImage(hit.cv, (hit.cv.width - s) / 2, (hit.cv.height - s) / 2, s, s, 0, 0, th.width, th.height);
      }
    }
  }

  function buildLayers() {
    const ul = $('layers');
    ul.innerHTML = '';
    const list = [...S.layers].reverse(); // top of the list = drawn last
    list.forEach(L => {
      const idx = S.layers.indexOf(L);
      const li = document.createElement('li');
      li.className = 'layer' + (L.open ? ' open' : '') + (L.on ? '' : ' hidden-layer');
      const g = GENS[L.gen];
      const bodyId = 'lb' + L.id;
      const pad = padOf(L.gen), rest = g.params.filter(d => !d.options && !pad.includes(d));
      const num = (d, axis) => `<div class="ctl"><label for="p${L.id}${d.k}">${d.label}${axis ? `<i class="axis" aria-hidden="true" title="or drag ${axis === 'x' ? 'sideways' : 'up and down'} on the art">${axis === 'x' ? '↔' : '↕'}</i>` : ''}</label><input type="range" id="p${L.id}${d.k}" data-k="${d.k}" min="${d.min}" max="${d.max}" step="${d.step}" value="${L.p[d.k]}"><output>${fmt(d, L.p[d.k])}</output></div>`;
      li.innerHTML = `
        <div class="layer-head">
          <button type="button" class="layer-name" aria-expanded="${L.open}" aria-controls="${bodyId}"><canvas class="thumb" data-id="${L.id}" width="96" height="96" aria-hidden="true"></canvas><span>${g.name}<small>${L.blend === 'source-over' ? '' : BLENDS.find(b => b[0] === L.blend)[1]}</small></span></button>
          <button type="button" class="icon" data-a="eye" aria-pressed="${L.on}" aria-label="Show ${g.name}" title="Show / hide">${L.on ? '◉' : '○'}</button>
          <button type="button" class="icon" data-a="dice" aria-label="Reseed ${g.name}" title="Reseed: same settings, new roll">⚄</button>
        </div>
        <div class="layer-body" id="${bodyId}">
          ${g.params.filter(d => d.options).map(d => `<div class="ctl opts"><span class="lbl" id="p${L.id}${d.k}">${d.label}</span><div class="row" role="group" aria-labelledby="p${L.id}${d.k}">${d.options.map(o => `<button type="button" class="opt" data-k="${d.k}" data-v="${o}" aria-pressed="${o === L.p[d.k]}">${o}</button>`).join('')}</div></div>`).join('')}
          ${pad.map((d, i) => num(d, i ? 'y' : 'x')).join('')}
          <div class="ctl mix"><label for="bl${L.id}">mix</label><select id="bl${L.id}" data-a="blend">${BLENDS.map(([v, n]) => `<option value="${v}"${v === L.blend ? ' selected' : ''}>${n}</option>`).join('')}</select><input type="range" data-a="opacity" aria-label="${g.name} opacity" min="0" max="1" step="0.01" value="${L.opacity}"><output>${Math.round(L.opacity * 100)}%</output></div>
          <details class="more"${L.more ? ' open' : ''}><summary>more</summary><div>
            ${rest.map(d => num(d)).join('')}
            <div class="layer-tools">
              <button type="button" class="icon" data-a="up" aria-label="Move ${g.name} up" title="Draw later (move up)" ${idx === S.layers.length - 1 ? 'disabled' : ''}>↑</button>
              <button type="button" class="icon" data-a="down" aria-label="Move ${g.name} down" title="Draw earlier (move down)" ${idx === 0 ? 'disabled' : ''}>↓</button>
              <button type="button" class="icon" data-a="dup" aria-label="Duplicate ${g.name}" title="Duplicate">⧉</button>
              <button type="button" class="icon" data-a="reset" aria-label="Reset ${g.name} settings" title="Reset settings">↺</button>
              <button type="button" class="icon" data-a="del" aria-label="Delete ${g.name}" title="Delete" ${S.layers.length === 1 ? 'disabled' : ''}>✕</button>
            </div>
          </div></details>
        </div>`;
      // one layer open at a time: opening this one folds the others
      li.querySelector('.layer-name').onclick = () => { const was = L.open; S.layers.forEach(l => l.open = false); L.open = !was; buildLayers(); };
      li.querySelector('details').addEventListener('toggle', e => { L.more = e.target.open; });
      li.addEventListener('click', e => {
        const opt = e.target.closest('.opt');
        if (opt) {
          L.p[opt.dataset.k] = opt.dataset.v;
          opt.parentElement.querySelectorAll('.opt').forEach(o => o.setAttribute('aria-pressed', o === opt));
          schedule();
          return;
        }
        const a = e.target.closest('[data-a]')?.dataset.a;
        if (!a || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
        if (a === 'eye') L.on = !L.on;
        else if (a === 'dice') { L.seed = newSeed(); delete L.ns; }
        else if (a === 'up' || a === 'down') {
          const j = idx + (a === 'up' ? 1 : -1);
          if (j < 0 || j >= S.layers.length) return;
          [S.layers[idx], S.layers[j]] = [S.layers[j], S.layers[idx]];
        } else if (a === 'dup') {
          S.layers.forEach(l => l.open = false);
          S.layers.splice(idx + 1, 0, makeLayer(L.gen, { p: { ...L.p }, blend: L.blend, opacity: L.opacity, open: true }));
        } else if (a === 'reset') L.p = defaults(L.gen);
        else if (a === 'del') { if (S.layers.length > 1) S.layers.splice(idx, 1); }
        buildLayers();
        schedule();
        // keep keyboard focus on the same control after the rebuild
        const again = [...$('layers').querySelectorAll(`[data-a="${a}"]`)].find(b => b.getAttribute('aria-label')?.endsWith(g.name));
        if (again && !again.disabled && a !== 'del') again.focus();
      });
      li.addEventListener('input', e => {
        const t = e.target;
        if (t.type === 'range') paintFill(t);
        if (t.dataset.a === 'opacity') { L.opacity = +t.value; t.nextElementSibling.textContent = Math.round(L.opacity * 100) + '%'; }
        else if (t.dataset.a === 'blend') L.blend = t.value;
        else if (t.dataset.k) {
          const d = g.params.find(q => q.k === t.dataset.k);
          L.p[d.k] = d.options ? t.value : +t.value;
          if (!d.options) t.nextElementSibling.textContent = fmt(d, t.value);
        } else return;
        t.type === 'range' ? live() : schedule();
      });
      li.querySelectorAll('input[type=range]').forEach(paintFill);
      ul.appendChild(li);
    });
    drawThumbs(cache);
  }

  // ---------- play right on the art: drag to morph the open layer, tap to reroll it ----------
  let drag = null, hudT = 0;
  function hud(text) {
    const h = $('hud');
    h.textContent = text;
    h.classList.add('on');
    clearTimeout(hudT);
    hudT = setTimeout(() => h.classList.remove('on'), drag ? 60000 : 1100);
  }
  function hideHint() {
    $('hint').classList.add('gone');
    try { localStorage.setItem('seedloom-hint', '1'); } catch (e) {}
  }
  function syncSliders(L) {
    for (const d of GENS[L.gen].params) {
      const inp = document.getElementById('p' + L.id + d.k);
      if (!inp || inp.type !== 'range') continue;
      inp.value = L.p[d.k];
      paintFill(inp);
      inp.nextElementSibling.textContent = fmt(d, L.p[d.k]);
    }
  }
  art.addEventListener('pointerdown', e => {
    if (e.button > 0 || !S.layers.length) return;
    const L = openLayer(), [dx, dy] = padOf(L.gen);
    try { art.setPointerCapture(e.pointerId); } catch (err) {}
    drag = { L, dx, dy, x: e.clientX, y: e.clientY, px: dx ? L.p[dx.k] : 0, py: dy ? L.p[dy.k] : 0, r: art.getBoundingClientRect(), moved: false };
    hideHint();
  });
  art.addEventListener('pointermove', e => {
    if (!drag) return;
    const mx = e.clientX - drag.x, my = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(mx, my) < 6) return;
    if (!drag.moved) { drag.moved = true; draft = true; art.classList.add('dragging'); }
    const set = (d, start, frac) => {
      if (!d) return;
      const v = Math.min(d.max, Math.max(d.min, start + frac * (d.max - d.min)));
      drag.L.p[d.k] = +(d.min + Math.round((v - d.min) / d.step) * d.step).toFixed(4);
    };
    set(drag.dx, drag.px, mx / drag.r.width);
    // the sun in Rays follows your finger; everything else grows as you drag up
    set(drag.dy, drag.py, (drag.dy && drag.dy.k === 'y' ? my : -my) / drag.r.height);
    hud([drag.dx, drag.dy].filter(Boolean).map(d => d.label + ' ' + fmt(d, drag.L.p[d.k])).join('   ·   '));
    syncSliders(drag.L);
    schedule();
  });
  function endDrag(e) {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (d.moved) {
      draft = false;
      art.classList.remove('dragging');
      hud($('hud').textContent);
      schedule();
    } else if (e.type === 'pointerup') {
      d.L.seed = newSeed();
      delete d.L.ns;
      hud('new roll · ' + GENS[d.L.gen].name.toLowerCase());
      schedule();
    }
  }
  art.addEventListener('pointerup', endDrag);
  art.addEventListener('pointercancel', endDrag);

  // Add-a-layer menu with a live thumbnail per generator, in the current palette
  const thumbCache = new Map();
  function refreshMenu() {
    const menu = $('genMenu');
    if (menu.hidden) return;
    const pal = PALETTES[S.pal];
    for (const tile of menu.children) {
      const gen = tile.dataset.gen, cv = tile.querySelector('canvas'), x = cv.getContext('2d');
      const key = gen + S.pal;
      if (thumbCache.get(gen) === key) continue;
      thumbCache.set(gen, key);
      const p = defaults(gen);
      for (const k of ['lines', 'count']) if (p[k]) p[k] = Math.round(p[k] / 3);
      x.globalCompositeOperation = 'source-over';
      x.fillStyle = pal.bg;
      x.fillRect(0, 0, cv.width, cv.height);
      try { GENS[gen].draw(x, cv.width, cv.height, p, rng(7), pal, makeNoise(rng(11)), cv.width / 1000); } catch (e) {}
    }
  }
  function buildMenu() {
    const menu = $('genMenu');
    menu.innerHTML = '';
    for (const [id, g] of Object.entries(GENS)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gen-tile';
      b.dataset.gen = id;
      b.innerHTML = `<canvas width="160" height="160" aria-hidden="true"></canvas><span><b>${g.name}</b><br>${g.blurb}</span>`;
      b.onclick = () => {
        const dark = lum(PALETTES[S.pal].bg) < 0.4;
        S.layers.forEach(l => { l.open = false; });
        S.layers.push(makeLayer(id, { open: true, blend: S.layers.length ? (dark ? 'screen' : 'multiply') : 'source-over', opacity: S.layers.length ? 0.85 : 1 }));
        toggleMenu(false);
        buildLayers();
        schedule();
        $('layers').querySelector('.layer-name')?.focus();
      };
      menu.appendChild(b);
    }
  }
  function toggleMenu(open) {
    const menu = $('genMenu');
    menu.hidden = !open;
    $('addBtn').setAttribute('aria-expanded', open);
    $('addBtn').textContent = open ? '× close' : '+ add a layer';
    if (open) refreshMenu();
  }
  $('addBtn').onclick = () => toggleMenu($('genMenu').hidden);

  function lum(hex) {
    const n = parseInt(hex.slice(1), 16);
    return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  }

  // ---------- remix: a fresh composition that still looks intentional ----------
  // a background that covers the canvas, something drawn over it, and sometimes a dusting of grain
  const ROLES = {
    base: [['glass', { fillp: [0.85, 1] }], ['subdiv', { fillp: [0.9, 1], depth: [5, 6, 7, 8] }], ['truchet', {}], ['flow', {}], ['topo', { style: ['bands', 'bands + lines'] }], ['rays', { style: ['wedges', 'wedges + rings'] }], ['tartan', {}], ['kilim', {}], ['stitch', { style: ['knit', 'beads'] }], ['coral', { style: ['bands', 'relief'] }], ['moire', {}]],
    mid: [['circles', {}], ['ridges', {}], ['topo', { style: ['lines'] }], ['glass', { style: ['outline'] }], ['rays', { style: ['beams', 'rings'] }], ['flow', {}], ['truchet', {}], ['stitch', { style: ['cross-stitch'] }], ['branch', {}], ['phyllo', {}], ['coral', { style: ['lines', 'ink'] }], ['attractor', {}], ['iso', {}]],
  };
  function rollLayer(R, gen, force) {
    const p = defaults(gen);
    for (const d of GENS[gen].params) {
      if (force[d.k]) { p[d.k] = force[d.k][Math.floor(R() * force[d.k].length)]; continue; }
      if (d.options) { if (R() < 0.5) p[d.k] = d.options[Math.floor(R() * d.options.length)]; continue; }
      let v = d.def + (R() - 0.5) * (d.max - d.min) * 0.55;
      v = Math.min(d.max, Math.max(d.min, Math.round(v / d.step) * d.step));
      p[d.k] = +v.toFixed(4);
    }
    return p;
  }
  function rollPiece(R) {
    const one = arr => arr[Math.floor(R() * arr.length)];
    const pal = Math.floor(R() * PALETTES.length), dark = lum(PALETTES[pal].bg) < 0.4;
    // only looms that actually loaded can be rolled
    const base = ROLES.base.filter(r => GENS[r[0]]), mid = ROLES.mid.filter(r => GENS[r[0]]);
    const [bg, bf] = one(base);
    let [mg, mf] = one(mid);
    while (mg === bg && R() < 0.8) [mg, mf] = one(mid);
    const blends = dark ? ['source-over', 'screen', 'screen', 'overlay', 'difference'] : ['source-over', 'multiply', 'multiply', 'color-burn', 'soft-light'];
    const layers = [
      makeLayer(bg, { p: rollLayer(R, bg, bf), opacity: +(0.8 + R() * 0.2).toFixed(2) }),
      makeLayer(mg, { p: rollLayer(R, mg, mf), blend: one(blends), opacity: +(0.7 + R() * 0.3).toFixed(2), open: true }),
    ];
    if (R() < 0.55) layers.push(makeLayer('grain', { p: rollLayer(R, 'grain', { style: ['speckle', 'speckle', 'halftone'], color: ['ink', 'paper'], size: [0.8, 1.2, 1.6], density: [0.2, 0.3, 0.45] }), blend: 'source-over', opacity: +(0.25 + R() * 0.3).toFixed(2) }));
    return { pal, aspect: '1:1', layers };
  }
  function remix() {
    const st = rollPiece(Math.random);
    S.pal = st.pal;
    S.layers = st.layers;
    syncPalettes();
    buildLayers();
    refreshMenu();
    schedule();
  }
  // Remix: mostly a fresh roll, sometimes one of the hand-tuned pieces
  $('remixBtn').onclick = () => { if (Math.random() < 0.3) { loadPreset(); syncPalettes(); buildAspects(); buildLayers(); schedule(); } else remix(); toast('✦ A new weave'); };

  // ---------- save & share ----------
  $('saveBtn').onclick = () => {
    toast('Weaving a print-size copy…');
    setTimeout(() => {
      try {
        const [W, H] = size(2800);
        const cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        composite(cv.getContext('2d'), W, H, new Map());
        cv.toBlob(blob => {
          if (!blob) { toast('Could not save the image, try a smaller canvas'); return; }
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'seedloom-' + pieceTitle().toLowerCase().replace(/ /g, '-') + '.png';
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 4000);
          toast('Saved a ' + W + '×' + H + ' PNG');
        }, 'image/png');
      } catch (e) { toast('Could not save the image: ' + e.message); }
    }, 60);
  };

  const b64 = {
    enc: s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
    dec: s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))),
  };
  $('shareBtn').onclick = async () => {
    const url = location.origin + location.pathname + '#w=' + b64.enc(JSON.stringify(packState()));
    history.replaceState(null, '', url);
    try { await navigator.clipboard.writeText(url); toast('Link copied: anyone who opens it sees this exact piece'); }
    catch (e) { toast('The link is in your address bar: copy it from there'); }
  };
  let lastHung = '';
  $('hangBtn').onclick = async () => {
    const btn = $('hangBtn');
    if (btn.disabled) return;
    if (!S.layers.some(l => l.on)) { toast('Nothing to hang yet: switch a layer on first'); return; }
    const recipe = packState(), key = JSON.stringify(recipe);
    if (key === lastHung) { toast('This one is already on the wall'); return; }
    if (key.length > 6000) { toast('Too many layers to hang this one: try a few less'); return; }
    let log = [];
    try { log = JSON.parse(localStorage.getItem('seedloom-hung') || '[]').filter(t => Date.now() - t < 864e5); } catch (e) {}
    if (log.length && Date.now() - log[log.length - 1] < 30000) { toast('Let the paint dry: you can hang another piece in half a minute'); return; }
    if (log.length >= 20) { toast('Twenty pieces today! Leave the wall some room and come back tomorrow'); return; }
    btn.disabled = true;
    toast('Hanging it on the wall…');
    try {
      const { db, session } = await getDb();
      const { user } = await session();
      const { error } = await db.from('seedloom_pieces').insert({ recipe, user_id: user.id });
      if (error) throw error;
      lastHung = key;
      log.push(Date.now());
      try { localStorage.setItem('seedloom-hung', JSON.stringify(log)); } catch (e) {}
      const st = parseState(recipe);
      hungSeen.add(key);
      if (st && !hangNearby(st)) hung.unshift(st);
      toast('Hung! ' + pieceTitle() + ' is on the wall for everyone now');
    } catch (e) { toast('The wall is not answering right now: try again in a bit'); }
    btn.disabled = false;
  };

  // ---------- the shared wall: pieces visitors hung for everyone ----------
  // only the recipe is stored (no names, no text), and every recipe is checked by parseState before it is shown
  let dbP = null;
  const getDb = () => dbP || (dbP = window.__seedloomDb ? Promise.resolve(window.__seedloomDb)
    : import('/supabase-config.js').then(m => ({ db: m.default, session: m.supabaseSession })));
  const hung = [], hungSeen = new Set(), hungPerUser = {};
  let hungCursor = null, hungMore = true, hungLoading = false, hungFirst = true;
  async function loadHung() {
    if (hungLoading || !hungMore) return;
    hungLoading = true;
    try {
      const { db } = await getDb();
      let q = db.from('seedloom_pieces').select('id, recipe, user_id, created_at').order('created_at', { ascending: false }).limit(60);
      if (hungCursor) q = q.lt('created_at', hungCursor);
      const { data, error } = await q;
      if (error) throw error;
      if (!data || data.length < 60) hungMore = false;
      for (const row of data || []) {
        hungCursor = row.created_at;
        const key = JSON.stringify(row.recipe);
        if (!key || key.length > 8000 || hungSeen.has(key)) continue;
        // one visitor can't take over the wall
        if ((hungPerUser[row.user_id] = (hungPerUser[row.user_id] || 0) + 1) > 6) continue;
        hungSeen.add(key);
        const st = parseState(row.recipe);
        if (st && st.layers.some(l => l.on)) hung.push(st);
      }
    } catch (e) { hungMore = false; }
    hungLoading = false;
    hungFirst = false;
    queueFill();
  }
  // the looms fill the first screen while the shared pieces load; after 2.5s the wall carries on without them
  setTimeout(() => { if (hungFirst) { hungFirst = false; queueFill(); } }, 2500);

  // ---------- presets for a first visit ----------
  const PRESETS = [
    { pal: 0, aspect: '1:1', layers: [['flow', 90210, 'source-over', 1, 1, { lines: 1800, steps: 140, scale: 1.8, curl: 1.4, width: 1, alpha: 0.55, color: 'direction' }], ['circles', 424242, 'screen', 0.85, 1, { count: 160, minR: 6, maxR: 80, gap: 6, style: 'rings', width: 1.2 }]] },
    { pal: 9, aspect: '4:5', layers: [['truchet', 777, 'source-over', 0.22, 1, { size: 90, style: 'arcs', width: 3, colors: 1 }], ['ridges', 1983, 'source-over', 1, 1, { lines: 56, amp: 170, scale: 3.2, focus: 0.8, width: 1.4, fill: 'yes', color: 'one' }]] },
    { pal: 1, aspect: '1:1', layers: [['truchet', 31337, 'source-over', 1, 1, { size: 64, style: 'weave', width: 13, colors: 3 }], ['circles', 5150, 'multiply', 0.75, 1, { count: 40, minR: 30, maxR: 200, gap: 20, style: 'filled', width: 2 }]] },
    { pal: 4, aspect: '4:5', layers: [['glass', 2718, 'source-over', 1, 1, { count: 180, pattern: 'sunflower', lead: 7, fillp: 1, style: 'glass' }], ['grain', 88, 'source-over', 0.35, 1, { style: 'speckle', density: 0.3, size: 1.2, scale: 2, angle: 30, color: 'paper' }]] },
    { pal: 11, aspect: '9:16', layers: [['rays', 1111, 'source-over', 1, 1, { rays: 28, rings: 6, x: 0.5, y: 0.78, twist: 0.8, style: 'wedges + rings' }], ['ridges', 2222, 'source-over', 1, 1, { lines: 30, amp: 120, scale: 2.4, focus: 0.3, width: 2, fill: 'yes', color: 'fade' }]] },
    { pal: 2, aspect: '4:5', layers: [['subdiv', 1919, 'source-over', 1, 1, { depth: 7, chance: 0.7, gap: 0, round: 0, fillp: 1, style: 'mondrian' }], ['grain', 7, 'multiply', 0.4, 1, { style: 'halftone', density: 0.5, size: 3, scale: 1.4, angle: 45, color: 'ink' }]] },
    { pal: 5, aspect: '1:1', layers: [['topo', 606, 'source-over', 1, 1, { levels: 14, scale: 1.4, warp: 0.9, detail: 4, style: 'bands + lines', width: 1 }], ['circles', 707, 'overlay', 0.8, 1, { count: 90, minR: 8, maxR: 110, gap: 10, style: 'targets', width: 2 }]] },
  ];


  // ---------- landing: the wall of looms ----------
  // [generator, palette, seed, noise seed, overrides]: the exact wall from the stream screenshot
  const TILES = [
    ['flow', 0, 5, 6], ['circles', 1, 6, 7], ['truchet', 2, 7, 8], ['ridges', 3, 8, 9], ['glass', 4, 9, 10],
    ['topo', 5, 10, 11], ['harmono', 6, 11, 12], ['subdiv', 7, 12, 13], ['rays', 8, 13, 14],
    ['grain', 9, 14, 15, { style: 'halftone', color: 'palette', size: 7, density: 0.7, scale: 1.2 }],
    ['tartan', 2, 21, 22], ['stitch', 4, 23, 24], ['kilim', 6, 25, 26, { layout: 'medallion' }],
    ['coral', 0, 27, 28], ['branch', 6, 29, 30], ['phyllo', 8, 31, 32],
    ['attractor', 4, 33, 34], ['moire', 3, 35, 36], ['iso', 8, 37, 38],
  ].filter(t => GENS[t[0]]);
  // looms beyond the first ten join the front row automatically
  Object.keys(GENS).forEach((id, k) => { if (!TILES.some(t => t[0] === id)) TILES.push([id, (k * 5) % PALETTES.length, 100 + k, 200 + k]); });

  // ---------- the endless wall: the looms first, then hand-tuned pieces and fresh remixes forever ----------
  const wall = [];
  let presetOrder = [], wallScroll = 0;
  const near = new Set(), queue = [];
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      const item = e.target._item;
      if (e.isIntersecting) { near.add(item); if (!item.full && !item.painting && !queue.includes(item)) queue.push(item); pump(); }
      else {
        near.delete(item);
        // far away tiles give their pixels back; they are redrawn from their recipe when you scroll back
        if (item.drawn && wall.length > 96) { item.cv.width = item.cv.height = 1; item.drawn = item.full = false; item.el.classList.remove('in'); }
      }
    }
  }, { rootMargin: '1400px 0px' });
  // keep a couple of screens of wall ready below you, however fast you scroll
  let filling = false;
  function fillWall() {
    if ($('gallery').hidden) return;
    for (let guard = 0; guard < 8 && $('wallEnd').getBoundingClientRect().top < innerHeight * 2.5; guard++) addTiles(12);
  }
  const queueFill = () => { if (!filling) { filling = true; requestAnimationFrame(() => { filling = false; fillWall(); }); } };
  // while the wall moves, the pointer stops hovering tiles (no restyles mid-scroll)
  let scrollT = 0;
  addEventListener('scroll', () => {
    queueFill();
    if (!document.body.classList.contains('scrolling')) document.body.classList.add('scrolling');
    clearTimeout(scrollT);
    scrollT = setTimeout(() => document.body.classList.remove('scrolling'), 140);
  }, { passive: true });
  addEventListener('resize', queueFill);
  // tiles are painted by a small pool of background workers when the browser can (OffscreenCanvas),
  // otherwise one per frame right here
  const pool = [], jobs = new Map();
  let jobId = 0, pumping = false;
  try {
    if (typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap !== 'undefined' && new OffscreenCanvas(1, 1).getContext('2d')) {
      const libs = [...document.scripts].map(sc => sc.getAttribute('src') || '').filter(src => /^gens[\w-]*\.js(\?[\w.=]*)?$/.test(src));
      const n = Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1));
      for (let k = 0; k < n; k++) {
        const w = new Worker('wall-worker.js?v=1.6');
        w.busy = null;
        w.postMessage({ init: libs });
        w.onmessage = e => done(w, e.data);
        w.onerror = () => {
          pool.splice(pool.indexOf(w), 1);
          if (w.busy && w.busy.ed) { inflight.delete(w.busy.key); noAsync.add(w.busy.key); schedule(); }
          else if (w.busy) { w.busy.painting = false; queue.unshift(w.busy); }
          w.terminate();
          pump();
        };
        pool.push(w);
      }
    }
  } catch (e) { pool.length = 0; }
  function done(w, m) {
    const item = jobs.get(m.id);
    jobs.delete(m.id);
    w.busy = null;
    if (item && item.ed) edDone(item, m);
    else if (item) {
      item.painting = false;
      if (m.fail) { window.__wallFails = (window.__wallFails || 0) + 1; paintHere(item); }
      else if (!near.has(item)) m.bmp.close();
      else {
        const t0 = performance.now();
        item.cv.width = item.cv.height = m.bmp.width;
        item.cv.getContext('2d').drawImage(m.bmp, 0, 0);
        m.bmp.close();
        shown(item, t0);
        // a quick sketch goes back in line for its full-size painting
        if (item.sketchJob) queue.push(item);
        else item.full = true;
      }
    }
    pump();
  }
  const tileRes = item => Math.min(760, Math.max(240, Math.round(item.el.getBoundingClientRect().width * Math.min(2, devicePixelRatio || 1))));
  function shown(item, t0) {
    item.drawn = true;
    item.el.classList.add('in');
    (window.__wallMs = window.__wallMs || []).push(Math.round(performance.now() - t0));
  }
  function paintHere(item) {
    const t0 = performance.now(), s = tileRes(item);
    item.cv.width = item.cv.height = s;
    try { composite(item.cv.getContext('2d'), s, s, new Map(), item.st); } catch (e) { console.error(e); }
    item.full = true;
    shown(item, t0);
  }
  // the tile closest to what you are looking at goes first, so a fast scroll never waits behind tiles far below
  function nextItem() {
    let best = -1, bestD = Infinity;
    const mid = innerHeight / 2;
    for (let k = queue.length - 1; k >= 0; k--) {
      const it = queue[k];
      if (it.full || it.painting || !near.has(it)) { queue.splice(k, 1); if (best > k) best--; continue; }
      // empty tiles before sharpening sketches
      const r = it.el.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid) + (it.drawn ? 1e6 : 0);
      if (d < bestD) { bestD = d; best = k; }
    }
    return best < 0 ? undefined : queue.splice(best, 1)[0];
  }
  function pump() {
    if (pool.length) {
      for (const w of pool) {
        if (w.busy) continue;
        // the piece you are editing goes before the wall
        let job;
        while ((job = edQueue.shift()) && !edLive(job)) inflight.delete(job.key);
        if (job) {
          const id = ++jobId;
          w.busy = job;
          jobs.set(id, job);
          w.postMessage({ id, w: job.W, h: job.H, raw: true, pal: PALETTES[S.pal], layers: [edLive(job)] });
          continue;
        }
        const item = nextItem();
        if (!item) return;
        const id = ++jobId;
        item.painting = true;
        w.busy = item;
        jobs.set(id, item);
        // with a backlog (a fast scroll), empty tiles get a half-size sketch first: 4x fewer pixels, sharpened right after
        const full = tileRes(item), sketch = !item.drawn && queue.length >= pool.length;
        item.sketchJob = sketch;
        w.postMessage({ id, s: sketch ? Math.max(120, full >> 1) : full, pal: PALETTES[item.st.pal], layers: item.st.layers });
      }
      return;
    }
    if (pumping) return;
    pumping = true;
    requestAnimationFrame(function step() {
      const item = nextItem();
      if (!item) { pumping = false; return; }
      paintHere(item);
      requestAnimationFrame(step);
    });
  }
  function addTiles(n) {
    const grid = $('gGrid');
    for (let k = 0; k < n; k++) {
      const idx = wall.length;
      let st, name, fromWall = false;
      // past the looms, wait (briefly) for the visitors' pieces so they start right after them
      if (idx === TILES.length && hungFirst) { if (!hungLoading) loadHung(); return; }
      if (idx < TILES.length) {
        const [gen, pal, seed, ns, over] = TILES[idx];
        st = { pal, aspect: '1:1', layers: [makeLayer(gen, { seed, ns, p: Object.assign(defaults(gen), over || {}) })] };
        name = GENS[gen].name;
      } else {
        if (idx === TILES.length) presetOrder = PRESETS.map((_, i) => i).sort(() => Math.random() - 0.5);
        // every other spot goes to a piece a visitor hung, while there are any
        if (idx % 2 === 1 && hung.length) { st = hung.shift(); fromWall = true; }
        else st = presetOrder.length && idx % 3 === 0 ? parseState(PRESETS[presetOrder.pop()]) : rollPiece(Math.random);
        if (hung.length < 4) loadHung();
        st.aspect = '1:1';
        name = pieceTitle(st);
      }
      const item = makeTile(st, name, idx < TILES.length ? 'loom' : fromWall ? 'hung' : '');
      grid.appendChild(item.el);
      wall.push(item);
      io.observe(item.el);
    }
  }
  const TAGS = { hung: 'hung by a visitor', yours: 'hung by you' };
  function makeTile(st, name, kind) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'g-tile' + (kind === 'yours' ? ' yours' : '');
    b.setAttribute('role', 'listitem');
    b.setAttribute('aria-label', name + (kind === 'loom' ? ': ' + GENS[st.layers[0].gen].blurb : TAGS[kind] ? ', ' + TAGS[kind] : '') + '. Open it in the editor');
    b.innerHTML = `<canvas width="1" height="1" aria-hidden="true"></canvas><span class="g-label" aria-hidden="true">${name}${TAGS[kind] ? '<i>' + TAGS[kind] + '</i>' : ''}</span>`;
    const item = { st, el: b, cv: b.querySelector('canvas'), drawn: false, fromWall: kind === 'hung' };
    b._item = item;
    b.onclick = () => openPiece(item, kind === 'loom');
    return item;
  }
  // a piece you just hung goes up right next to the one you opened, so it is there when you walk back
  function hangNearby(st) {
    const at = lastOpened ? wall.indexOf(lastOpened) : -1;
    if (at < 0) return false;
    st.aspect = '1:1';
    const item = makeTile(st, pieceTitle(st), 'yours');
    lastOpened.el.after(item.el);
    wall.splice(at + 1, 0, item);
    io.observe(item.el);
    return true;
  }
  // the tile you tapped lifts off the wall and settles where the art hangs
  function flyIn(item) {
    if (!item.drawn || matchMedia('(prefers-reduced-motion: reduce)').matches || !document.body.animate) return;
    const from = item.el.getBoundingClientRect();
    const ghost = document.createElement('canvas');
    ghost.width = item.cv.width;
    ghost.height = item.cv.height;
    ghost.getContext('2d').drawImage(item.cv, 0, 0);
    ghost.className = 'ghost';
    ghost.setAttribute('aria-hidden', 'true');
    const place = r => Object.assign(ghost.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    place(from);
    document.body.appendChild(ghost);
    let tries = 0;
    (function go() {
      if (queued && tries++ < 60) return requestAnimationFrame(go);
      const to = art.getBoundingClientRect();
      if (!to.width) return ghost.remove();
      place(to);
      const fly = ghost.animate([
        { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
        { transform: 'none' },
      ], { duration: 650, easing: 'cubic-bezier(.2, .8, .2, 1)' });
      fly.onfinish = () => ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260 }).onfinish = () => ghost.remove();
    })();
  }
  let lastOpened = null;
  function openPiece(item, loom) {
    wallScroll = scrollY;
    lastOpened = item;
    S.pal = item.st.pal;
    S.aspect = '1:1';
    S.layers = item.st.layers.map((l, i, arr) => ({ ...l, id: S.nextId++, p: { ...l.p }, open: i === arr.length - 1 }));
    enterEditor();
    flyIn(item);
    toast(loom ? 'Slide things around, then + add a layer to stack another loom' : item.fromWall ? 'A visitor hung this one: make it yours, then hang your version' : 'Yours now: slide, reseed, stack more');
  }
  function showView(gallery) {
    $('gallery').hidden = !gallery;
    $('app').hidden = gallery;
    if (gallery) { toggleMenu(false); if (!wall.length) addTiles(TILES.length + 14); scrollTo(0, wallScroll); queueFill(); }
    else scrollTo(0, 0);
  }
  function enterEditor() {
    showView(false);
    let seen = false;
    try { seen = !!localStorage.getItem('seedloom-hint'); } catch (e) {}
    $('hint').classList.toggle('gone', seen);
    syncPalettes();
    buildAspects();
    buildLayers();
    refreshMenu();
    schedule();
  }
  $('backBtn').onclick = () => showView(true);
  $('undoBtn').onclick = undo;
  $('redoBtn').onclick = redo;
  // keys for people who live on the keyboard; never while typing or on a form control
  addEventListener('keydown', e => {
    if ($('app').hidden || e.target.closest('input, select, textarea')) return;
    const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
    else if (mod && k === 'y') { e.preventDefault(); redo(); }
    else if (mod || e.altKey) return;
    else if (k === 'r') $('remixBtn').click();
    else if (k === 'escape') showView(true);
  });

  let presetBag = [];
  function loadPreset() {
    if (!presetBag.length) presetBag = PRESETS.map((_, i) => i).sort(() => Math.random() - 0.5);
    loadState(PRESETS[presetBag.pop()]);
    S.layers[S.layers.length - 1].open = true;
  }

  function boot() {
    let ok = false;
    const m = location.hash.match(/^#w=([A-Za-z0-9_-]{1,20000})$/);
    if (m) {
      try { ok = loadState(JSON.parse(b64.dec(m[1]))); if (ok) setTimeout(() => toast('Opened a shared piece'), 400); } catch (e) {}
      if (!ok) setTimeout(() => toast('That link looks broken, so here is a fresh piece'), 400);
    }
    const shared = ok;
    if (!ok) { try { ok = loadState(JSON.parse(localStorage.getItem('seedloom-state') || 'null')); } catch (e) {} }
    if (S.layers.length) S.layers[S.layers.length - 1].open = true;
    buildPalettes();
    buildAspects();
    buildMenu();
    if (shared) enterEditor();
    else showView(true);
  }
  window.addEventListener('hashchange', () => {
    const m = location.hash.match(/^#w=([A-Za-z0-9_-]{1,20000})$/);
    if (!m) return;
    try { if (loadState(JSON.parse(b64.dec(m[1])))) enterEditor(); } catch (e) {}
  });
  let lastLong = previewLong();
  window.addEventListener('resize', () => { if (previewLong() !== lastLong) { lastLong = previewLong(); schedule(); } });

  window.__seedloom = { S, remix, schedule, PALETTES, PRESETS, loadState, buildLayers, syncPalettes, buildAspects };
  boot();
})();
