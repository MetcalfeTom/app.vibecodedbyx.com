/* Sand Boxing line test (Tatum's 1 px black line, 2026-10-06).
   Each linetest/vX.html is that version's real index.html, byte for byte, plus this one script at the top of <head>,
   so the rendering code (canvas sizing, backdrop, sky, sea, ground, HUD and dialogs) is the version's own.
   This file only:
   - gives the old version its own in-memory localStorage, so your real saves are left alone
   - reload knobs (?opaque ?noaa ?keep ?dpr1) that change the WebGL context or the pixel ratio before three.js starts
   - a small panel (bottom left) to hide layers one by one, freeze the frame, empty the 3D scene and read the sizes
   - a vignette chooser (Tatum found the line is the vignette layer, 14:44 UTC): the old CSS gradient, the same on its own GPU layer,
     an inset box-shadow, a stretched 2D canvas image, or drawn inside the 3D view (the v1.21.2 fix)
   - a version badge on the 🧪 button and a short toast on load, so it is plain which version is running */
(function () {
  'use strict';
  var VERS = [
    ['v1', '6 Oct 01:43', 'first beach'],
    ['v1.7', '6 Oct 03:30', 'adds the lab + fade layer'],
    ['v1.13', '6 Oct 05:50', 'sea sparkle line'],
    ['v1.16', '6 Oct 06:59', 'last one before the load rework'],
    ['v1.17', '6 Oct 09:29', 'sunset backdrop behind the canvas, faster load'],
    ['v1.20', '6 Oct 13:12', 'before the stamina strip'],
    ['v1.21.2', '6 Oct 15:10', 'the fix: the vignette is drawn inside the 3D view']
  ];
  var BASE = '/sand-boxing/'; // absolute links: the same target from linetest.html, /linetest, /linetest/ or a version page
  var KNOBS = [
    ['opaque', 'opaque canvas (WebGL alpha off)'],
    ['noaa', 'no antialias'],
    ['keep', 'keep the drawing buffer'],
    ['dpr1', 'pixel ratio 1']
  ];
  var NAMES = {
    gl: '3D canvas', vig: 'vignette', hurt: 'hurt flash', fade: 'lab fade', hud: 'meters', mute: 'mute button',
    pzBtn: 'pause button', banner: 'banner', perma: 'poison mark', term: 'lab screen', cough: 'cough prompt',
    card: 'start card', end: 'end card', pz: 'pause menu', touch: 'touch buttons', tipCatch: 'hint catcher', nogl: 'no-WebGL note'
  };
  var Q = new URLSearchParams(location.search);
  var here = (location.pathname.match(/\/(v[\d-]+)(?:\.html)?\/?$/) || [])[1] || '';
  var curV = here.replace(/-/g, '.');

  /* 1. old versions save into memory only */
  function memStore() {
    var m = new Map();
    return {
      getItem: function (k) { k = String(k); return m.has(k) ? m.get(k) : null; },
      setItem: function (k, v) { m.set(String(k), String(v)); },
      removeItem: function (k) { m.delete(String(k)); },
      clear: function () { m.clear(); },
      key: function (i) { var a = Array.from(m.keys()); return i < a.length ? a[i] : null; },
      get length() { return m.size; }
    };
  }
  try { Object.defineProperty(window, 'localStorage', { value: memStore(), configurable: true, writable: true }); } catch (e) {}

  /* 2. reload knobs, applied before three.js makes its context */
  var over = {};
  if (Q.has('opaque')) over.alpha = false;
  if (Q.has('noaa')) over.antialias = false;
  if (Q.has('keep')) over.preserveDrawingBuffer = true;
  if (Object.keys(over).length) {
    var gc = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, attrs) {
      if (/webgl/i.test(String(type))) attrs = Object.assign({}, attrs || {}, over);
      return gc.call(this, type, attrs);
    };
  }
  if (Q.has('dpr1')) {
    try { Object.defineProperty(window, 'devicePixelRatio', { get: function () { return 1; }, configurable: true }); } catch (e) {}
  }

  /* 3. three.js announces its renderer and scenes to __THREE_DEVTOOLS__; listening changes nothing it draws */
  var T = { scenes: [], renderer: null };
  try {
    var dt = window.__THREE_DEVTOOLS__ || (window.__THREE_DEVTOOLS__ = new EventTarget());
    dt.addEventListener('observe', function (e) {
      var o = e.detail;
      if (!o) return;
      if (o.isScene) T.scenes.push(o);
      else if (typeof o.setAnimationLoop === 'function' && typeof o.getContext === 'function') T.renderer = o;
    });
  } catch (e) {}

  /* freeze: hold rAF callbacks; the canvas keeps its last frame */
  var rafOrig = window.requestAnimationFrame, held = [], frozen = false;
  function setFreeze(f) {
    frozen = f;
    if (f) window.requestAnimationFrame = function (cb) { held.push(cb); return 0; };
    else { window.requestAnimationFrame = rafOrig; held.splice(0).forEach(function (cb) { rafOrig.call(window, cb); }); }
  }

  /* links keep ?bare=1 (the sloppy.live frame) and the reload knobs */
  function query(change) {
    var p = new URLSearchParams();
    if (Q.has('bare')) p.set('bare', '1');
    KNOBS.forEach(function (k) {
      var on = change && k[0] in change ? change[k[0]] : Q.has(k[0]);
      if (on) p.set(k[0], '1');
    });
    var s = p.toString();
    return s ? '?' + s : '';
  }
  function fileOf(v) { return BASE + 'linetest/' + v.replace(/\./g, '-') + '.html'; }

  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(function () {
    var css = document.createElement('style');
    css.textContent = [
      '.lt-off{display:none!important}',
      'html.lt-magenta,html.lt-magenta body{background:#ff00ff!important}',
      '#lt{position:fixed;left:calc(8px + env(safe-area-inset-left,0px));bottom:calc(8px + env(safe-area-inset-bottom,0px));z-index:2147483647;',
      ' width:min(23rem,calc(100vw - 16px));max-height:min(30rem,calc(62vh - 16px));overflow:auto;box-sizing:border-box;padding:8px 10px;',
      ' scrollbar-width:thin;scrollbar-color:#6b4558 transparent;',
      ' background:rgba(18,8,14,.93);color:#f7e6d2;border-radius:10px;box-shadow:0 6px 24px rgba(0,0,0,.45);',
      ' font:400 10px/1.4 "Martian Mono",ui-monospace,Menlo,Consolas,monospace;text-align:left;-webkit-user-select:text;user-select:text;pointer-events:auto}',
      '#lt.min{width:auto;padding:0;background:none;box-shadow:none;overflow:visible}',
      '#lt.min>:not(.lt-min){display:none!important}',
      '#lt *{box-sizing:border-box;font:inherit;letter-spacing:0;text-transform:none}',
      '#lt h2{margin:0 0 6px;font:400 14px/1.2 "Alfa Slab One",Georgia,serif;color:#ffd45e}',
      '#lt h3{margin:7px 0 3px;font-weight:800;color:#bfa58f;font-size:10px;text-transform:uppercase;letter-spacing:.06em}',
      '#lt .row{display:flex;flex-wrap:wrap;gap:4px}',
      '#lt button,#lt a.b{all:unset;box-sizing:border-box;display:inline-block;cursor:pointer;padding:2px 6px;border-radius:5px;',
      ' background:#3a2230;color:#f7e6d2;border:1px solid #6b4558;font:400 10px/1.4 "Martian Mono",ui-monospace,Menlo,Consolas,monospace;text-decoration:none}',
      '#lt button:hover,#lt a.b:hover{border-color:#ffd45e}',
      '#lt button:focus-visible,#lt a.b:focus-visible{outline:2px solid #ffd45e;outline-offset:1px}',
      '#lt .on{background:#ffd45e;color:#2a1018;border-color:#ffd45e}',
      '#lt .cur{background:#f7e6d2;color:#2a1018;border-color:#f7e6d2;font-weight:800}',
      '#lt .off{opacity:.55;text-decoration:line-through}',
      '#lt .gh{opacity:.55;border-style:dashed}',
      '#lt .forced{border-color:#7fd3cf;color:#bff5ef}',
      '#lt .note{color:#bfa58f;margin:3px 0 0}',
      '#lt .tip{color:#bff5ef;margin:5px 0 0;min-height:1.4em}',
      '#lt pre{margin:3px 0 0;white-space:pre-wrap;word-break:break-word;color:#d9c7b4}',
      '#lt .lt-min{all:unset;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;',
      ' background:rgba(18,8,14,.85);font:18px/1 serif}',
      '#lt:not(.min) .lt-min{position:absolute;right:6px;top:6px;height:26px;background:#3a2230}',
      '#lt .lt-min{width:auto;min-width:34px;padding:0 9px;gap:6px;color:#ffd45e;font:800 12px/1 "Martian Mono",ui-monospace,Menlo,Consolas,monospace}',
      '#lt .lt-min i{font:17px/1 serif;font-style:normal}',
      '#lt:not(.min) .lt-min i{font-size:13px}',
      '#lt h2{padding-right:6.5rem}',
      '#lt-toast{position:fixed;left:50%;top:calc(30% + env(safe-area-inset-top,0px));transform:translate(-50%,-50%);z-index:2147483647;pointer-events:none;',
      ' padding:12px 20px 13px;border-radius:12px;background:rgba(18,8,14,.9);color:#f7e6d2;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.5);',
      ' font:400 12px/1.5 "Martian Mono",ui-monospace,Menlo,Consolas,monospace;transition:opacity .6s;max-width:calc(100vw - 32px)}',
      '#lt-toast b{display:block;font:400 30px/1.1 "Alfa Slab One",Georgia,serif;color:#ffd45e}',
      '#lt-toast.out{opacity:0}'
    ].join('\n');
    document.head.appendChild(css);

    var root = document.createElement('div');
    root.id = 'lt';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Line test panel');
    document.body.appendChild(root);
    ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'click', 'keydown', 'keyup', 'wheel', 'contextmenu'].forEach(function (ev) {
      root.addEventListener(ev, function (e) { e.stopPropagation(); });
    });

    function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
    function btn(txt, fn, title) {
      var b = el('button', '', txt); b.type = 'button'; if (title) b.title = title;
      b.addEventListener('click', function () { fn(b); b.blur(); if (title) tip.textContent = txt + ': ' + title; refresh(); });
      return b;
    }
    var tip = el('div', 'tip');

    var minB = el('button', 'lt-min');
    minB.appendChild(el('i', '', '\u{1F9EA}'));
    minB.appendChild(el('span', '', curV || 'line test'));
    minB.type = 'button';
    minB.title = 'Line test panel: show or tuck away';
    minB.setAttribute('aria-label', 'Show or tuck away the line test panel');
    minB.addEventListener('click', function () { root.classList.toggle('min'); minB.blur(); refresh(); });
    root.appendChild(minB);

    var info = VERS.filter(function (v) { return v[0] === curV; })[0];
    if (info) {
      var toast = el('div', '');
      toast.id = 'lt-toast';
      toast.setAttribute('aria-hidden', 'true');
      toast.appendChild(el('b', '', info[0]));
      toast.appendChild(el('span', '', 'line test · ' + info[1] + ' UTC'));
      document.body.appendChild(toast);
      var bye = function () {
        setTimeout(function () { toast.classList.add('out'); }, 3500);
        setTimeout(function () { toast.remove(); }, 4300);
      };
      if (document.readyState === 'complete') bye(); else addEventListener('load', bye); // counted from when the page has loaded
    }
    root.appendChild(el('h2', '', 'Line test · ' + (info ? info[0] + ' · ' + info[1] : 'Sand Boxing')));
    root.appendChild(el('div', 'note', 'This is ' + (info ? info[0] + "'s" : 'the') + ' real render code. Tap the 🧪 to tuck this panel away while you look for the line.'));

    root.appendChild(el('h3', '', 'Version'));
    var vrow = el('div', 'row');
    VERS.forEach(function (v) {
      var a = el('a', 'b' + (v[0] === curV ? ' cur' : ''), v[0] + ' · ' + v[1].replace('6 Oct ', ''));
      a.href = fileOf(v[0]) + query();
      a.title = v[0] + ', ' + v[1] + ' UTC: ' + v[2];
      vrow.appendChild(a);
    });
    var back = el('a', 'b', 'list');
    back.href = BASE + 'linetest.html' + query();
    back.title = 'Back to the list of versions';
    vrow.appendChild(back);
    root.appendChild(vrow);

    root.appendChild(el('h3', '', 'Vignette · which ones show the line?'));
    var vrow2 = el('div', 'row');
    root.appendChild(vrow2);
    var VMODES = [
      ['ship', 'as shipped', 'this version\'s own vignette (v1 to v1.21.1: the CSS gradient layer; v1.21.2: drawn in the 3D view)'],
      ['off', 'none', 'no vignette at all'],
      ['css', 'CSS gradient', 'the old layer: a full-screen div with a CSS radial-gradient'],
      ['css3d', 'CSS + translateZ(0)', 'the same CSS gradient, pushed onto its own GPU layer with transform: translateZ(0)'],
      ['shadow', 'inset box-shadow', 'a full-screen div with a blurred inset box-shadow instead of a gradient'],
      ['img', '2D canvas image', 'the vignette painted once into a 256×256 canvas and stretched as the div\'s background image'],
      ['gl', 'in the 3D view', 'drawn last into the WebGL canvas itself, no page layer at all (the v1.21.2 fix)']
    ];
    var vmode = 'ship', ltVig = null, vigImg = '', ourMesh = null;
    var GRAD = 'radial-gradient(ellipse at 50% 46%,transparent 58%,rgba(46,12,26,.42))';
    var VS = 'varying vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }';
    var FS = 'varying vec2 vUv; void main() { vec2 d = vec2((vUv.x - 0.5) / 0.70711, (vUv.y - 0.54) / 0.76368);' +
      ' gl_FragColor = vec4(0.18039, 0.04706, 0.10196, 0.42 * clamp((length(d) - 0.58) / 0.42, 0.0, 1.0)); }';
    function oldVig() { return document.querySelector('body > .vig'); }
    function gameMesh() {
      for (var i = 0; i < T.scenes.length; i++) { var m = T.scenes[i].getObjectByName('vignette'); if (m && m !== ourMesh) return m; }
      return null;
    }
    /* versions before v1.21.2 have no 3D vignette: build the same quad from the version's own three.js classes */
    function makeMesh() {
      if (ourMesh) return ourMesh;
      var s = T.scenes[0], plane = null, basic = null;
      if (!s) return null;
      s.traverse(function (o) {
        if (!o.isMesh || o.type !== 'Mesh') return;
        if (!plane && o.geometry && o.geometry.type === 'PlaneGeometry') plane = o;
        var mt = o.material;
        if (!basic && mt && !Array.isArray(mt) && mt.type === 'MeshBasicMaterial') basic = mt;
      });
      if (!plane || !basic) return null;
      try {
        var mat = new basic.constructor({ transparent: true, depthTest: false, depthWrite: false });
        mat.onBeforeCompile = function (sh) { sh.vertexShader = VS; sh.fragmentShader = FS; };
        mat.customProgramCacheKey = function () { return 'lt-vignette'; };
        ourMesh = new plane.constructor(new plane.geometry.constructor(2, 2), mat);
        ourMesh.name = 'vignette'; ourMesh.frustumCulled = false; ourMesh.renderOrder = 1e9; ourMesh.castShadow = ourMesh.receiveShadow = false;
        s.add(ourMesh);
      } catch (e) { ourMesh = null; }
      return ourMesh;
    }
    function paintImg() {
      if (vigImg) return vigImg;
      var c = document.createElement('canvas'), N = 256;
      c.width = c.height = N;
      var g = c.getContext('2d'), im = g.createImageData(N, N), d = im.data;
      for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
        var u = ((x + 0.5) / N - 0.5) / 0.70711, v = ((y + 0.5) / N - 0.46) / 0.76368;
        var a = 0.42 * Math.min(1, Math.max(0, (Math.sqrt(u * u + v * v) - 0.58) / 0.42)), i = (y * N + x) * 4;
        d[i] = 46; d[i + 1] = 12; d[i + 2] = 26; d[i + 3] = Math.round(a * 255);
      }
      g.putImageData(im, 0, 0);
      return (vigImg = c.toDataURL('image/png'));
    }
    function setVis(m, on) { if (!m) return; if ('ltVis' in m.userData) m.userData.ltVis = on; else m.visible = on; }
    function applyVig() {
      var o = oldVig(), gm = gameMesh();
      if (o) o.style.display = vmode === 'ship' ? '' : 'none';
      setVis(gm, vmode === 'ship' || vmode === 'gl');
      if (vmode === 'gl' && !gm) makeMesh();
      setVis(ourMesh, vmode === 'gl' && !gm);
      var css = vmode === 'css' || vmode === 'css3d' || vmode === 'shadow' || vmode === 'img';
      if (!css && !ltVig) return;
      if (!ltVig) {
        ltVig = el('div');
        ltVig.id = 'lt-vig';
        ltVig.setAttribute('aria-hidden', 'true');
        var gl = document.getElementById('gl');
        if (gl && gl.parentNode === document.body) gl.after(ltVig); else document.body.prepend(ltVig);
      }
      ltVig.hidden = !css;
      ltVig.style.cssText = 'position:fixed;inset:0;pointer-events:none;' + (
        vmode === 'css' ? 'background:' + GRAD :
        vmode === 'css3d' ? 'background:' + GRAD + ';transform:translateZ(0)' :
        vmode === 'shadow' ? 'box-shadow:inset 0 0 22vmin 3vmin rgba(46,12,26,.42)' :
        vmode === 'img' ? 'background:url(' + paintImg() + ') 0 0/100% 100% no-repeat' : '');
    }
    var vbtns = VMODES.map(function (m) {
      var b = btn(m[1], function () { vmode = m[0]; applyVig(); }, m[2]);
      b.dataset.vm = m[0];
      vrow2.appendChild(b);
      return b;
    });

    root.appendChild(el('h3', '', 'Layers · tap to hide · dashed = hidden by the game, tap to force on'));
    var lrow = el('div', 'row');
    root.appendChild(lrow);

    root.appendChild(el('h3', '', 'Tests'));
    var trow = el('div', 'row');
    root.appendChild(trow);
    var onlyB = btn('only the 3D canvas', function () {
      var on = !onlyB.classList.contains('on');
      layers(true).forEach(function (L) {
        if (L.id === 'gl') { L.classList.remove('lt-off'); return; }
        if (on) L.classList.add('lt-off'); else L.classList.remove('lt-off');
      });
      onlyB.classList.toggle('on', on);
    }, 'every page layer is hidden except the WebGL canvas. Line still there? The 3D canvas draws it');
    var noglB = btn('no 3D canvas', function () {
      var c = document.getElementById('gl'); if (c) c.classList.toggle('lt-off');
    }, 'the WebGL canvas is hidden, the page layers stay. Line still there? A page layer draws it');
    var magB = btn('magenta behind', function () {
      document.documentElement.classList.toggle('lt-magenta');
    }, 'the page behind the canvas is magenta. A line that turns magenta is a gap where the canvas lets the page through');
    var emptyB = btn('empty 3D scene', function () {
      var on = !emptyB.classList.contains('on');
      T.scenes.forEach(function (s) {
        s.children.forEach(function (o) {
          if (on) { o.userData.ltVis = o.visible; o.visible = false; }
          else if ('ltVis' in o.userData) { o.visible = o.userData.ltVis; delete o.userData.ltVis; }
        });
      });
      emptyB.classList.toggle('on', on);
      if (!on) applyVig();
    }, 'every 3D object (sky, sea, sand, fighters) is hidden, only the clear colour is left. Turn on cyan clear colour too for one flat colour');
    var cyanB = btn('cyan clear colour', function () {
      var on = !cyanB.classList.contains('on'), R = T.renderer;
      if (!R) return;
      if (on) {
        cyanB.dataset.a = R.getClearAlpha();
        R.setClearColor('#00ffd0', 1);
        T.scenes.forEach(function (s) { if (s.background && s.background.isColor) { s.userData.ltBg = s.background; s.background = s.background.clone().set('#00ffd0'); } });
      } else {
        R.setClearColor('#000000', Number(cyanB.dataset.a)); // the game never sets its own clear colour (three's default black)
        T.scenes.forEach(function (s) { if (s.userData.ltBg) { if (s.background && s.background.isColor) s.background = s.userData.ltBg; delete s.userData.ltBg; } });
      }
      cyanB.classList.toggle('on', on);
    }, 'the 3D clear colour is bright cyan. A line that turns cyan is a crack where no 3D object gets drawn');
    var frzB = btn('freeze frame', function () { setFreeze(!frozen); }, 'no new frames are drawn, the canvas keeps its last one');
    var snapB = btn('whole-px canvas box', function () {
      snapOn = !snapOn; snapBox();
    }, 'the canvas box is sized in whole CSS pixels (window width x height) instead of 100vw x 100dvh');
    [onlyB, noglB, magB, cyanB, emptyB, frzB, snapB].forEach(function (b) { trow.appendChild(b); });
    root.appendChild(tip);

    var snapOn = false;
    function snapBox() {
      var c = document.getElementById('gl');
      if (!c) return;
      c.style.width = snapOn ? innerWidth + 'px' : '';
      c.style.height = snapOn ? innerHeight + 'px' : '';
    }
    addEventListener('resize', function () { if (snapOn) snapBox(); });

    root.appendChild(el('h3', '', 'Reload with'));
    var krow = el('div', 'row');
    KNOBS.forEach(function (k) {
      var a = el('a', 'b' + (Q.has(k[0]) ? ' on' : ''), k[1]);
      var ch = {}; ch[k[0]] = !Q.has(k[0]);
      a.href = location.pathname + query(ch);
      krow.appendChild(a);
    });
    root.appendChild(krow);

    root.appendChild(el('h3', '', 'Sizes'));
    var pre = el('pre');
    root.appendChild(pre);

    function layers(withTest) {
      return Array.from(document.body.children).filter(function (L) {
        if (L === root || L.id === 'lt-toast' || (L.id === 'lt-vig' && !withTest)) return false;
        return !/^(SCRIPT|STYLE|LINK|NOSCRIPT|TEMPLATE)$/.test(L.tagName);
      });
    }
    function keyOf(L) { return L.id || L.classList[0] || L.tagName.toLowerCase(); }
    var chips = new Map();
    function chipFor(L) {
      var b = chips.get(L);
      if (b) return b;
      b = el('button');
      b.type = 'button';
      b.addEventListener('click', function () {
        if (L.classList.contains('lt-off')) L.classList.remove('lt-off');
        else if (L.dataset.ltForced) { L.hidden = true; delete L.dataset.ltForced; }
        else if (L.hidden) { L.hidden = false; L.dataset.ltForced = '1'; }
        else L.classList.add('lt-off');
        b.blur(); refresh();
      });
      chips.set(L, b);
      return b;
    }
    function browser() {
      var u = navigator.userAgent, m;
      if ((m = u.match(/Firefox\/([\d.]+)/))) return 'Firefox ' + m[1];
      if ((m = u.match(/Edg\/([\d.]+)/))) return 'Edge ' + m[1];
      if ((m = u.match(/OPR\/([\d.]+)/))) return 'Opera ' + m[1];
      if ((m = u.match(/Chrome\/([\d.]+)/))) return 'Chrome ' + m[1];
      if ((m = u.match(/Version\/([\d.]+).*Safari/))) return 'Safari ' + m[1];
      return u.slice(0, 60);
    }
    var gpu = '';
    function f2(n) { return Math.round(n * 100) / 100; }
    function refresh() {
      if (root.classList.contains('min')) return;
      lrow.textContent = '';
      layers().forEach(function (L) {
        var b = chipFor(L), k = keyOf(L);
        var off = L.classList.contains('lt-off'), forced = !!L.dataset.ltForced, gh = !off && !forced && L.hidden;
        b.className = off ? 'off' : forced ? 'forced' : gh ? 'gh' : '';
        b.textContent = (NAMES[k] || k) + (off ? ' (off)' : forced ? ' (forced on)' : '');
        b.title = '#' + k + (gh ? ': hidden by the game, tap to force it on' : off ? ': hidden by you, tap to show' : ': tap to hide');
        if (k === 'vig' && vmode !== 'ship' && !off) { b.className = 'gh'; b.textContent = 'vignette (swapped above)'; b.title = 'the vignette chooser has swapped this layer out'; }
        lrow.appendChild(b);
      });
      frzB.classList.toggle('on', frozen);
      vbtns.forEach(function (b) { b.classList.toggle('on', b.dataset.vm === vmode); });
      snapB.classList.toggle('on', snapOn);
      magB.classList.toggle('on', document.documentElement.classList.contains('lt-magenta'));
      var c = document.getElementById('gl');
      noglB.classList.toggle('on', !!(c && c.classList.contains('lt-off')));
      var lines = [];
      lines.push('window ' + innerWidth + '×' + innerHeight + ' css px, devicePixelRatio ' + f2(window.devicePixelRatio) +
        (window.visualViewport && visualViewport.scale !== 1 ? ', pinch zoom ' + f2(visualViewport.scale) : ''));
      if (c) {
        var r = c.getBoundingClientRect();
        lines.push('canvas box ' + f2(r.width) + '×' + f2(r.height) + ' at ' + f2(r.left) + ',' + f2(r.top) +
          ' → ' + f2(r.width * devicePixelRatio) + '×' + f2(r.height * devicePixelRatio) + ' device px');
        lines.push('canvas buffer ' + c.width + '×' + c.height);
      }
      if (T.renderer) {
        try {
          var g = T.renderer.getContext(), a = g.getContextAttributes() || {};
          lines.push('webgl: alpha ' + a.alpha + ', antialias ' + a.antialias + ', keep buffer ' + a.preserveDrawingBuffer +
            ', frames drawn ' + T.renderer.info.render.frame + (frozen ? ' (frozen)' : ''));
          if (!gpu) {
            var d = g.getExtension('WEBGL_debug_renderer_info');
            gpu = (d && g.getParameter(d.UNMASKED_RENDERER_WEBGL)) || g.getParameter(g.RENDERER) || '?';
          }
          lines.push('gpu ' + gpu);
        } catch (e) { lines.push('webgl: ' + e.message); }
      } else lines.push('webgl: not started yet');
      lines.push(browser());
      var knobs = KNOBS.filter(function (k) { return Q.has(k[0]); }).map(function (k) { return k[1]; });
      if (knobs.length) lines.push('reloaded with: ' + knobs.join(', '));
      pre.textContent = lines.join('\n');
    }
    refresh();
    setInterval(refresh, 700);
    addEventListener('resize', refresh);
  });
})();
