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
  function loadState(obj) {
    if (!obj || !Array.isArray(obj.layers)) return false;
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
    if (!layers.length) return false;
    S.layers = layers;
    S.pal = Number.isInteger(obj.pal) && PALETTES[obj.pal] ? obj.pal : 0;
    S.aspect = ASPECTS[obj.aspect] ? obj.aspect : '1:1';
    return true;
  }
  const packState = () => ({ v: 1, pal: S.pal, aspect: S.aspect, layers: S.layers.map(l => [l.gen, l.seed, l.blend, +l.opacity.toFixed(2), l.on ? 1 : 0, l.p].concat(l.ns != null ? [l.ns] : [])) });

  // ---------- rendering ----------
  const cache = new Map();
  function renderLayer(L, W, H, pal, store) {
    const key = JSON.stringify([L.gen, L.seed, L.ns, L.p, pal.bg, pal.c, W, H]);
    const hit = store.get(L.id);
    if (hit && hit.key === key) return hit.cv;
    const cv = hit ? hit.cv : document.createElement('canvas');
    cv.width = W; cv.height = H;
    const x = cv.getContext('2d');
    x.clearRect(0, 0, W, H);
    try {
      GENS[L.gen].draw(x, W, H, L.p, rng(L.seed), pal, makeNoise(rng(L.ns != null ? L.ns : L.seed ^ 0x9e3779b9)), Math.min(W, H) / 1000);
    } catch (e) { console.error(L.gen, e); }
    store.set(L.id, { key, cv });
    return cv;
  }
  function composite(ctx, W, H, store) {
    const pal = PALETTES[S.pal];
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = pal.bg;
    ctx.fillRect(0, 0, W, H);
    for (const L of S.layers) {
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

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    $('busy').classList.add('on');
    // two frames: let the "weaving" pill paint before a heavy layer blocks the thread
    requestAnimationFrame(() => requestAnimationFrame(() => {
      queued = false;
      const [W, H] = size(previewLong());
      if (art.width !== W || art.height !== H) { art.width = W; art.height = H; }
      for (const id of cache.keys()) if (!S.layers.some(l => l.id === id)) cache.delete(id);
      composite(actx, W, H, cache);
      $('busy').classList.remove('on');
      art.setAttribute('aria-label', 'Generated artwork: ' + S.layers.filter(l => l.on).map(l => GENS[l.gen].name).join(', ') + ' in the ' + PALETTES[S.pal].name + ' palette');
      persist();
    }));
  }
  let persistT = 0;
  function persist() {
    clearTimeout(persistT);
    persistT = setTimeout(() => { try { localStorage.setItem('seedloom-state', JSON.stringify(packState())); } catch (e) {} }, 400);
  }

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
      b.style.background = pal.bg;
      b.innerHTML = pal.c.map(c => `<i style="background:${c}"></i>`).join('');
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

  function fmt(d, v) { return d.step < 1 ? (+v).toFixed(d.step < 0.1 ? 2 : 1) : String(Math.round(v)); }

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
      li.innerHTML = `
        <div class="layer-head">
          <button type="button" class="layer-name" aria-expanded="${L.open}" aria-controls="${bodyId}">${g.name}</button>
          <button type="button" class="icon" data-a="eye" aria-pressed="${L.on}" aria-label="Show ${g.name}" title="Show / hide">${L.on ? '◉' : '○'}</button>
          <button type="button" class="icon" data-a="dice" aria-label="Reseed ${g.name}" title="Reseed: same settings, new roll">⚄</button>
        </div>
        <div class="layer-body" id="${bodyId}">
          <div class="ctl"><label for="bl${L.id}">blend</label><select id="bl${L.id}" data-a="blend">${BLENDS.map(([v, n]) => `<option value="${v}"${v === L.blend ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
          <div class="ctl"><label for="op${L.id}">opacity</label><input type="range" id="op${L.id}" data-a="opacity" min="0" max="1" step="0.01" value="${L.opacity}"><output>${Math.round(L.opacity * 100)}%</output></div>
          ${g.params.map(d => d.options
            ? `<div class="ctl"><label for="p${L.id}${d.k}">${d.label}</label><select id="p${L.id}${d.k}" data-k="${d.k}">${d.options.map(o => `<option${o === L.p[d.k] ? ' selected' : ''}>${o}</option>`).join('')}</select></div>`
            : `<div class="ctl"><label for="p${L.id}${d.k}">${d.label}</label><input type="range" id="p${L.id}${d.k}" data-k="${d.k}" min="${d.min}" max="${d.max}" step="${d.step}" value="${L.p[d.k]}"><output>${fmt(d, L.p[d.k])}</output></div>`).join('')}
          <div class="row">
            <button type="button" class="icon" data-a="up" aria-label="Move ${g.name} up" title="Draw later (move up)" ${idx === S.layers.length - 1 ? 'disabled' : ''}>↑</button>
            <button type="button" class="icon" data-a="down" aria-label="Move ${g.name} down" title="Draw earlier (move down)" ${idx === 0 ? 'disabled' : ''}>↓</button>
            <button type="button" class="icon" data-a="dup" aria-label="Duplicate ${g.name}" title="Duplicate">⧉</button>
            <button type="button" class="icon" data-a="reset" aria-label="Reset ${g.name} settings" title="Reset settings">↺</button>
            <button type="button" class="icon" data-a="del" aria-label="Delete ${g.name}" title="Delete" ${S.layers.length === 1 ? 'disabled' : ''}>✕</button>
          </div>
        </div>`;
      li.querySelector('.layer-name').onclick = () => { L.open = !L.open; buildLayers(); };
      li.addEventListener('click', e => {
        const a = e.target.closest('[data-a]')?.dataset.a;
        if (!a || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
        if (a === 'eye') L.on = !L.on;
        else if (a === 'dice') { L.seed = newSeed(); delete L.ns; }
        else if (a === 'up' || a === 'down') {
          const j = idx + (a === 'up' ? 1 : -1);
          if (j < 0 || j >= S.layers.length) return;
          [S.layers[idx], S.layers[j]] = [S.layers[j], S.layers[idx]];
        } else if (a === 'dup') {
          S.layers.splice(idx + 1, 0, makeLayer(L.gen, { p: { ...L.p }, blend: L.blend, opacity: L.opacity, open: true }));
          L.open = false;
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
        if (t.dataset.a === 'opacity') { L.opacity = +t.value; t.nextElementSibling.textContent = Math.round(L.opacity * 100) + '%'; }
        else if (t.dataset.a === 'blend') L.blend = t.value;
        else if (t.dataset.k) {
          const d = g.params.find(q => q.k === t.dataset.k);
          L.p[d.k] = d.options ? t.value : +t.value;
          if (!d.options) t.nextElementSibling.textContent = fmt(d, t.value);
        } else return;
        schedule();
      });
      ul.appendChild(li);
    });
  }

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
        S.layers.forEach(l => l.open = false);
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
    base: [['glass', { fillp: [0.85, 1] }], ['subdiv', { fillp: [0.9, 1], depth: [5, 6, 7, 8] }], ['truchet', {}], ['flow', {}], ['topo', { style: ['bands', 'bands + lines'] }], ['rays', { style: ['wedges', 'wedges + rings'] }]],
    mid: [['circles', {}], ['ridges', {}], ['topo', { style: ['lines'] }], ['harmono', {}], ['glass', { style: ['outline'] }], ['rays', { style: ['beams', 'rings'] }], ['flow', {}], ['truchet', {}]],
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
  function remix() {
    const R = Math.random, one = arr => arr[Math.floor(R() * arr.length)];
    S.pal = Math.floor(R() * PALETTES.length);
    const dark = lum(PALETTES[S.pal].bg) < 0.4;
    const [bg, bf] = one(ROLES.base);
    let [mg, mf] = one(ROLES.mid);
    while (mg === bg && R() < 0.8) [mg, mf] = one(ROLES.mid);
    const blends = dark ? ['source-over', 'screen', 'screen', 'overlay', 'difference'] : ['source-over', 'multiply', 'multiply', 'color-burn', 'soft-light'];
    S.layers = [
      makeLayer(bg, { p: rollLayer(R, bg, bf), opacity: +(0.8 + R() * 0.2).toFixed(2) }),
      makeLayer(mg, { p: rollLayer(R, mg, mf), blend: one(blends), opacity: +(0.7 + R() * 0.3).toFixed(2), open: true }),
    ];
    if (R() < 0.55) S.layers.push(makeLayer('grain', { p: rollLayer(R, 'grain', { style: ['speckle', 'speckle', 'halftone'], color: ['ink', 'paper'], size: [0.8, 1.2, 1.6], density: [0.2, 0.3, 0.45] }), blend: 'source-over', opacity: +(0.25 + R() * 0.3).toFixed(2) }));
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
          a.download = 'seedloom-' + S.layers.map(l => l.seed.toString(36)).join('-').slice(0, 40) + '.png';
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

  // ---------- presets for a first visit ----------
  const PRESETS = [
    { pal: 0, aspect: '1:1', layers: [['flow', 90210, 'source-over', 1, 1, { lines: 1800, steps: 140, scale: 1.8, curl: 1.4, width: 1, alpha: 0.55, color: 'direction' }], ['circles', 424242, 'screen', 0.85, 1, { count: 160, minR: 6, maxR: 80, gap: 6, style: 'rings', width: 1.2 }]] },
    { pal: 9, aspect: '4:5', layers: [['truchet', 777, 'source-over', 0.22, 1, { size: 90, style: 'arcs', width: 3, colors: 1 }], ['ridges', 1983, 'source-over', 1, 1, { lines: 56, amp: 170, scale: 3.2, focus: 0.8, width: 1.4, fill: 'yes', color: 'one' }]] },
    { pal: 1, aspect: '1:1', layers: [['truchet', 31337, 'source-over', 1, 1, { size: 64, style: 'weave', width: 13, colors: 3 }], ['circles', 5150, 'multiply', 0.75, 1, { count: 40, minR: 30, maxR: 200, gap: 20, style: 'filled', width: 2 }]] },
    { pal: 4, aspect: '4:5', layers: [['glass', 2718, 'source-over', 1, 1, { count: 180, pattern: 'sunflower', lead: 7, fillp: 1, style: 'glass' }], ['grain', 88, 'source-over', 0.35, 1, { style: 'speckle', density: 0.3, size: 1.2, scale: 2, angle: 30, color: 'paper' }]] },
    { pal: 8, aspect: '16:9', layers: [['topo', 4040, 'source-over', 1, 1, { levels: 26, scale: 1.6, warp: 1.1, detail: 4, style: 'lines', width: 1.1 }], ['harmono', 1234, 'screen', 0.9, 1, { ratio: '2:3', detune: 0.012, decay: 0.004, turns: 260, size: 0.8, width: 0.8, color: 'gradient' }]] },
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
  ];
  let tilesDrawn = false;
  function buildGallery() {
    const grid = $('gGrid');
    grid.innerHTML = '';
    TILES.forEach(([gen, pal, seed], i) => {
      const g = GENS[gen], b = document.createElement('button');
      b.type = 'button';
      b.className = 'g-tile';
      b.setAttribute('role', 'listitem');
      b.style.setProperty('--i', i);
      b.setAttribute('aria-label', g.name + ': ' + g.blurb + '. Start weaving with it');
      b.innerHTML = `<canvas width="500" height="500" aria-hidden="true"></canvas><span class="g-label" aria-hidden="true">${g.name}</span>`;
      b.onclick = () => startWith(i);
      grid.appendChild(b);
    });
  }
  function drawTiles() {
    if (tilesDrawn) return;
    tilesDrawn = true;
    const tiles = [...$('gGrid').children];
    let i = 0;
    (function next() { // one tile per frame so the wall fills in instead of freezing
      if (i >= TILES.length) return;
      const [gen, pi, seed, ns, over] = TILES[i], pal = PALETTES[pi], cv = tiles[i].querySelector('canvas'), x = cv.getContext('2d');
      x.fillStyle = pal.bg;
      x.fillRect(0, 0, cv.width, cv.height);
      try { GENS[gen].draw(x, cv.width, cv.height, Object.assign(defaults(gen), over || {}), rng(seed), pal, makeNoise(rng(ns)), cv.width / 1000); } catch (e) { console.error(gen, e); }
      i++;
      requestAnimationFrame(next);
    })();
  }
  function showView(gallery) {
    $('gallery').hidden = !gallery;
    $('app').hidden = gallery;
    if (gallery) { toggleMenu(false); drawTiles(); $('continueBtn').hidden = !S.layers.length; }
    scrollTo(0, 0);
  }
  function startWith(i) {
    const [gen, pi, seed, ns, over] = TILES[i];
    S.pal = pi;
    S.layers = [makeLayer(gen, { seed, ns, open: true, p: Object.assign(defaults(gen), over || {}) })];
    enterEditor();
    toast('Slide things around, then + add a layer to stack another loom');
  }
  function enterEditor() {
    showView(false);
    syncPalettes();
    buildAspects();
    buildLayers();
    refreshMenu();
    schedule();
    $('backBtn').focus({ preventScroll: true });
  }
  $('backBtn').onclick = () => showView(true);
  $('continueBtn').onclick = () => enterEditor();
  $('surpriseBtn').onclick = () => { loadPreset(); enterEditor(); };

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
    buildGallery();
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
