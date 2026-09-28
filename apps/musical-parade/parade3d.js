// Musical Parade: the 3D look. index.html loads this on demand (import('./parade3d.js')).
// The 2D app keeps the song, the band list and the clock; this module only draws them in 3D.
import * as THREE from 'three';

const PX = 1.2 / 46, RZ = 0.8 / 28;      // 2D px -> metres (one band column = 46px = 1.2 m)
const BW = 4.5, NB = 22, CPB = 6;         // building width, building slots, crowd per building
const PI = Math.PI;
const _o = new THREE.Object3D(), _m = new THREE.Matrix4(), _m2 = new THREE.Matrix4(), _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _q = new THREE.Quaternion(), _c = new THREE.Color();
const CC = {};
function C(s) { const k = String(s); if (!CC[k]) CC[k] = new THREE.Color(k.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]*\)/, 'rgb($1,$2,$3)')); return CC[k]; }
function hsh(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function lerp(a, b, t) { return a + (b - a) * t; }

/* ---------- geometry kit: primitives baked into one vertex-coloured geometry per layer ---------- */
function merge(list) {
  let n = 0; list.forEach(g => n += g.attributes.position.count);
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3); let o = 0;
  list.forEach(g => { pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3); col.set(g.attributes.color.array, o * 3); o += g.attributes.position.count; g.dispose(); });
  const r = new THREE.BufferGeometry();
  r.setAttribute('position', new THREE.BufferAttribute(pos, 3)); r.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); r.setAttribute('color', new THREE.BufferAttribute(col, 3));
  r.computeBoundingSphere(); return r;
}
class Kit {
  constructor() { this.L = { b: [], m: [], g: [] }; this.X = null; }
  put(geo, c, x, y, z, rx, ry, rz, sx, sy, sz, layer) {
    _o.position.set(x, y, z); _o.rotation.set(rx || 0, ry || 0, rz || 0); _o.scale.set(sx || 1, sy || sx || 1, sz || sx || 1); _o.updateMatrix();
    const g = geo.index ? geo.toNonIndexed() : geo; if (g !== geo) geo.dispose();
    if (g.attributes.uv) g.deleteAttribute('uv');
    g.applyMatrix4(_o.matrix); if (this.X) g.applyMatrix4(this.X);
    const k = C(c), n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = k.r; a[i * 3 + 1] = k.g; a[i * 3 + 2] = k.b; }
    g.setAttribute('color', new THREE.BufferAttribute(a, 3)); this.L[layer || 'b'].push(g); return this;
  }
  cyl(c, x, y, z, rt, rb, h, rx, ry, rz, L, seg) { return this.put(new THREE.CylinderGeometry(rt, rb, h, seg || 12), c, x, y, z, rx, ry, rz, 1, 1, 1, L); }
  sph(c, x, y, z, r, sx, sy, sz, L) { return this.put(new THREE.SphereGeometry(r, 12, 9), c, x, y, z, 0, 0, 0, sx || 1, sy || sx || 1, sz || sx || 1, L); }
  box(c, x, y, z, w, h, d, rx, ry, rz, L) { return this.put(new THREE.BoxGeometry(w, h, d), c, x, y, z, rx, ry, rz, 1, 1, 1, L); }
  tor(c, x, y, z, R, t, rx, ry, rz, arc, L) { return this.put(new THREE.TorusGeometry(R, t, 7, 22, arc || PI * 2), c, x, y, z, rx, ry, rz, 1, 1, 1, L); }
  cone(c, x, y, z, r, h, rx, ry, rz, L, seg) { return this.put(new THREE.ConeGeometry(r, h, seg || 8), c, x, y, z, rx, ry, rz, 1, 1, 1, L); }
  seg(c, a, b, r, L, r2) {
    const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), len = d.length();
    const g = new THREE.CylinderGeometry(r2 === undefined ? r : r2, r, len, 8); g.translate(0, len / 2, 0);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()));
    return this.put(g, c, a[0], a[1], a[2], 0, 0, 0, 1, 1, 1, L);
  }
  frame(x, y, z, rx, ry, rz, fn) { const prev = this.X; _o.position.set(x, y, z); _o.rotation.set(rx, ry, rz); _o.scale.set(1, 1, 1); _o.updateMatrix(); this.X = _o.matrix.clone(); if (prev) this.X.premultiply(prev); fn(this); this.X = prev; return this; }
  build() { const o = {}; for (const k in this.L) o[k] = this.L[k].length ? merge(this.L[k]) : null; return o; }
}

/* ---------- marchers (face +X, feet at y=0, right hand side is +Z) ---------- */
const BRASS = '#e7b545', BRASS2 = '#a8782a', SILVER = '#d9dee4', WHITE = '#f7f3ea', INK = '#1d2a44';
const HAIR = ['#f5d36b', '#2b1a12', '#c4462f', '#efe6d6', '#6b3a1e', '#15121c', '#e07bd6', '#3de0ff'];
const HEAD = [0.02, 1.6, 0];
function arm(k, c, sh, hand, el) {
  const e = el || [(sh[0] + hand[0]) / 2 - 0.05, Math.min(sh[1], hand[1]) - 0.1, (sh[2] + hand[2]) / 2 + (sh[2] > 0 ? 0.07 : -0.07)];
  k.seg(c, sh, e, 0.05, 'b', 0.048).sph(c, e[0], e[1], e[2], 0.048).seg(c, e, hand, 0.045, 'b', 0.041);
}
function buildMarcher(sty, type, S, ti) {
  const k = new Kit(), lead = type === 'lead', T = lead ? S.L : S.T[type], neon = !!S.neon, jazz = sty === 'jazz', carn = sty === 'carnival', march = sty === 'march';
  const coat = T.coat, trim = T.plume, armc = T.arm || coat, GL = neon ? 'g' : 'b';
  let hands = [[0.2, 1.05, -0.2], [0.2, 1.05, 0.2]], act = null, actAt = [0, 0, 0], handAct = -1;
  // torso
  k.cyl(coat, 0, 1.18, 0, 0.2, 0.16, 0.58, 0, 0, 0, 'b', 14);
  k.put(new THREE.SphereGeometry(0.2, 14, 8, 0, PI * 2, 0, PI / 2), coat, 0, 1.46, 0, 0, 0, 0, 1, 0.42, 1);
  k.cyl(jazz ? '#1b1b22' : carn ? trim : march ? WHITE : '#120c24', 0, 0.92, 0, 0.168, 0.168, 0.07);
  k.cyl(coat, 0, 0.86, 0, 0.168, 0.15, 0.1);
  if (march) {
    k.box(WHITE, 0.155, 1.2, 0, 0.012, 0.62, 0.06, 0.62, 0, 0).box(WHITE, 0.155, 1.2, 0, 0.012, 0.62, 0.06, -0.62, 0, 0);
    for (let i = 0; i < 3; i++) k.sph(BRASS, 0.172, 1.06 + i * 0.12, 0, 0.017, 1, 1, 1, 'm');
    k.sph(BRASS, 0, 1.47, -0.19, 0.075, 1, 0.45, 1.2, 'm').sph(BRASS, 0, 1.47, 0.19, 0.075, 1, 0.45, 1.2, 'm');
    k.cyl(trim === WHITE || trim === '#fffaf0' ? '#b8322a' : trim, 0, 1.49, 0, 0.075, 0.09, 0.06);
  } else if (jazz) {
    k.box(trim, 0.158, 1.3, 0, 0.012, 0.3, 0.05).box(trim, 0.16, 1.44, 0, 0.02, 0.05, 0.07);
    if (!lead) { k.box('#2a2a33', 0.1, 1.2, -0.12, 0.02, 0.56, 0.035, 0, 0, 0.12).box('#2a2a33', 0.1, 1.2, 0.12, 0.02, 0.56, 0.035, 0, 0, 0.12); }
    else { k.box(WHITE, 0.158, 1.34, 0, 0.012, 0.22, 0.1).box(trim, 0.17, 1.38, 0.1, 0.02, 0.08, 0.05); }
  } else if (carn) {
    k.box(trim, 0.02, 1.2, 0, 0.36, 0.08, 0.43, 0.7, 0, 0);
    for (let i = 0; i < 9; i++) k.sph(i & 1 ? '#fff6c8' : trim, 0.16 * Math.cos(i * 0.7), 1.0 + (i % 5) * 0.09, 0.16 * Math.sin(i * 0.7), 0.018, 1, 1, 1, 'm');
    k.cyl(trim, 0, 1.49, 0, 0.09, 0.1, 0.05);
  } else {
    k.box(trim, 0.162, 1.18, 0, 0.012, 0.56, 0.02, 0, 0, 0, 'g').cyl(trim, 0, 1.49, 0, 0.085, 0.1, 0.035, 0, 0, 0, 'g', 12);
    k.box(coat, 0, 1.44, -0.2, 0.2, 0.08, 0.12).box(coat, 0, 1.44, 0.2, 0.2, 0.08, 0.12);
  }
  // eyes
  if (!neon) k.sph('#1a1414', 0.118, 1.625, -0.045, 0.014).sph('#1a1414', 0.118, 1.625, 0.045, 0.014);
  // hats
  const hx = HEAD[0], hy = HEAD[1];
  if (march) {
    if (lead) {
      k.sph('#15151c', hx - 0.01, hy + 0.2, 0, 0.16, 1, 1.5, 1).cyl(BRASS, hx + 0.02, hy - 0.04, 0, 0.12, 0.12, 0.012, 0, 0, 0.3, 'm');
      k.cyl(trim === WHITE ? '#fffaf0' : trim, hx - 0.02, hy + 0.3, 0.15, 0.03, 0.02, 0.34, -0.25, 0, 0).sph('#b8322a', hx - 0.02, hy + 0.47, 0.19, 0.045);
    } else {
      k.cyl(INK, hx, hy + 0.15, 0, 0.125, 0.118, 0.24).cyl('#0d1320', hx + 0.09, hy + 0.04, 0, 0.09, 0.09, 0.012, 0, 0, -0.25);
      k.put(new THREE.CircleGeometry(0.05, 12), BRASS, hx + 0.124, hy + 0.15, 0, 0, PI / 2, 0, 1, 1, 1, 'm');
      k.cyl(BRASS, hx, hy + 0.27, 0, 0.126, 0.126, 0.012, 0, 0, 0, 'm');
      k.cyl(trim, hx + 0.01, hy + 0.36, 0, 0.035, 0.018, 0.2).sph(trim, hx + 0.01, hy + 0.47, 0, 0.04, 1, 1.3, 1);
    }
  } else if (jazz) {
    if (lead) { k.sph('#18181e', hx, hy + 0.08, 0, 0.13, 1, 0.8, 1).cyl('#18181e', hx, hy + 0.07, 0, 0.2, 0.2, 0.014).cyl(trim, hx, hy + 0.1, 0, 0.132, 0.132, 0.03); }
    else { k.cyl(WHITE, hx + 0.01, hy + 0.13, 0, 0.14, 0.122, 0.07).cyl('#1b1b22', hx, hy + 0.08, 0, 0.123, 0.123, 0.045); k.box('#1b1b22', hx + 0.14, hy + 0.06, 0, 0.12, 0.012, 0.18, 0, 0, -0.12); k.put(new THREE.CircleGeometry(0.02, 8), BRASS, hx + 0.13, hy + 0.1, 0, 0, PI / 2, 0, 1, 1, 1, 'm'); }
  } else if (carn) {
    k.cyl(trim, hx, hy + 0.08, 0, 0.13, 0.125, 0.07);
    const n = lead ? 11 : 7, cols = [trim, coat, '#fff6c8'];
    for (let i = 0; i < n; i++) { const a = (i / (n - 1) - 0.5) * (lead ? 2.3 : 1.9); k.put(new THREE.SphereGeometry(0.1, 8, 6), cols[i % 3], hx - 0.05, hy + 0.12 + Math.cos(a) * 0.26, Math.sin(a) * 0.26, a, 0, 0, 0.18, lead ? 3.1 : 2.4, 0.7); }
    k.sph('#fff6c8', hx + 0.1, hy + 0.1, 0, 0.03, 1, 1, 1, 'm');
  } else {
    k.sph(HAIR[ti % HAIR.length], hx - 0.035, hy + 0.05, 0, 0.14, 1.15, 1.05, 1.18);
    k.box(trim, hx + 0.11, hy + 0.03, 0, 0.03, 0.045, 0.2, 0, 0, 0, 'g');
  }
  // instruments
  const sh = [[0.02, 1.42, -0.21], [0.02, 1.42, 0.21]];
  if (type === 'snare') {
    k.cyl(coat, 0.32, 0.99, 0.02, 0.19, 0.19, 0.16, 0, 0, -0.12, 'b', 16).cyl(WHITE, 0.33, 1.075, 0.02, 0.186, 0.186, 0.01, 0, 0, -0.12, 'b', 16);
    k.tor(SILVER, 0.33, 1.07, 0.02, 0.19, 0.012, PI / 2, 0, -0.12, 0, 'm').tor(SILVER, 0.31, 0.91, 0.02, 0.19, 0.012, PI / 2, 0, -0.12, 0, 'm');
    for (let i = 0; i < 8; i++) { const a = i / 8 * PI * 2; k.cyl(SILVER, 0.32 + Math.cos(a) * 0.192, 0.99 + Math.cos(a) * 0.02, 0.02 + Math.sin(a) * 0.192, 0.007, 0.007, 0.16, 0, 0, -0.12, 'm', 4); }
    k.seg(WHITE, sh[1], [0.3, 0.96, 0.2], 0.018);
    hands = [[0.2, 1.13, -0.1], [0.2, 1.13, 0.14]]; actAt = [0.2, 1.13, 0.02];
    act = new Kit(); act.seg('#e9d7ad', [0, 0, -0.12], [0.3, -0.02, -0.06], 0.011, 'b', 0.008).seg('#e9d7ad', [0, 0, 0.12], [0.3, -0.02, 0.04], 0.011, 'b', 0.008);
  } else if (type === 'bass') {
    k.cyl(coat, 0.3, 1.12, 0, 0.37, 0.37, 0.3, PI / 2, 0, 0, 'b', 22).cyl(WHITE, 0.3, 1.12, 0, 0.352, 0.352, 0.312, PI / 2, 0, 0, 'b', 22);
    k.tor(trim, 0.3, 1.12, 0.155, 0.365, 0.024, 0, 0, 0, 0, 'b').tor(trim, 0.3, 1.12, -0.155, 0.365, 0.024, 0, 0, 0, 0, 'b');
    for (let i = 0; i < 10; i++) { const a = i / 10 * PI * 2; k.box(BRASS, 0.3 + Math.cos(a) * 0.372, 1.12 + Math.sin(a) * 0.372, 0, 0.03, 0.03, 0.2, 0, 0, a, 'm'); }
    if (march) k.put(new THREE.CircleGeometry(0.12, 16), trim, 0.3, 1.12, 0.158, 0, 0, 0, 1, 1, 1, 'b');
    hands = [[0.3, 1.36, -0.24], [0.3, 1.36, 0.25]]; actAt = [0.3, 1.36, 0];
    act = new Kit(); act.seg('#6b4a2e', [0, 0, 0.25], [0.04, -0.2, 0.22], 0.012).sph(WHITE, 0.04, -0.24, 0.215, 0.05).seg('#6b4a2e', [0, 0, -0.24], [0.04, -0.2, -0.22], 0.012).sph(WHITE, 0.04, -0.24, -0.215, 0.05);
    k.seg(coat, sh[0], [0.24, 1.36, -0.24], 0.05).seg(coat, sh[1], [0.24, 1.36, 0.25], 0.05);
  } else if (type === 'cymbal') {
    hands = [[0.34, 1.27, -0.1], [0.34, 1.27, 0.1]]; actAt = [0.36, 1.27, 0];
    act = new Kit(); act.cyl(BRASS, 0, 0, -0.06, 0.21, 0.19, 0.016, PI / 2, 0, 0, 'm', 20).cyl(BRASS, 0, 0, 0.06, 0.19, 0.21, 0.016, PI / 2, 0, 0, 'm', 20).cyl(BRASS2, 0, 0, -0.07, 0.04, 0.05, 0.02, PI / 2, 0, 0, 'm').cyl(BRASS2, 0, 0, 0.07, 0.05, 0.04, 0.02, PI / 2, 0, 0, 'm');
  } else if (type === 'tuba') {
    k.tor(BRASS, 0, 1.12, 0, 0.3, 0.055, PI / 2 + 0.42, 0, 0, 0, 'm');
    k.seg(BRASS, [-0.06, 1.36, -0.26], [-0.02, 1.8, -0.12], 0.06, 'm', 0.1);
    k.cyl(BRASS, 0.16, 1.93, -0.06, 0.42, 0.1, 0.4, 0, 0, -PI / 2, 'm', 22).cyl('#6e4c18', 0.365, 1.93, -0.06, 0.4, 0.4, 0.01, 0, 0, -PI / 2, 'b', 22).tor(BRASS, 0.36, 1.93, -0.06, 0.42, 0.022, 0, PI / 2, 0, 0, 'm');
    k.seg(BRASS, [0.08, 1.2, 0.24], [0.13, 1.54, 0.02], 0.018, 'm');
    for (let i = 0; i < 3; i++) k.cyl(SILVER, 0.08 + i * 0.05, 1.28, 0.25, 0.018, 0.018, 0.1, 0, 0, 0, 'm');
    hands = [[0.13, 1.35, 0.26], [0.16, 1.03, -0.25]];
  } else if (type === 'bone') {
    k.seg(BRASS, [-0.14, 1.64, 0.035], [0.52, 1.64, 0.035], 0.016, 'm').cyl(BRASS, 0.63, 1.64, 0.035, 0.13, 0.018, 0.24, 0, 0, -PI / 2, 'm', 18).tor(BRASS, 0.75, 1.64, 0.035, 0.13, 0.012, 0, PI / 2, 0, 0, 'm');
    k.tor(BRASS, -0.14, 1.6, 0.017, 0.04, 0.014, 0, 0, PI / 2, PI, 'm').seg(BRASS, [-0.14, 1.56, 0], [0.13, 1.56, 0], 0.013, 'm');
    k.seg(BRASS, [0.13, 1.555, 0], [0.6, 1.555, 0], 0.012, 'm').seg(BRASS, [0.13, 1.485, 0], [0.6, 1.485, 0], 0.012, 'm');
    hands = [[0.16, 1.58, -0.03], [0.5, 1.52, 0.05]]; actAt = [0.55, 1.52, 0]; handAct = 1;
    act = new Kit(); act.seg(BRASS, [-0.2, 0.035, 0], [0.12, 0.035, 0], 0.016, 'm').seg(BRASS, [-0.2, -0.035, 0], [0.12, -0.035, 0], 0.016, 'm').tor(BRASS, 0.12, 0, 0, 0.035, 0.015, 0, 0, -PI / 2, PI, 'm').box(BRASS2, -0.05, 0, 0, 0.012, 0.07, 0.012, 0, 0, 0, 'm');
  } else if (type === 'trumpet') {
    k.seg(BRASS, [0.12, 1.57, 0], [0.42, 1.57, 0], 0.014, 'm').cyl(BRASS, 0.49, 1.57, 0, 0.075, 0.014, 0.16, 0, 0, -PI / 2, 'm', 16).tor(BRASS, 0.57, 1.57, 0, 0.075, 0.008, 0, PI / 2, 0, 0, 'm');
    for (let i = 0; i < 3; i++) k.cyl(SILVER, 0.24 + i * 0.035, 1.6, 0, 0.012, 0.012, 0.08, 0, 0, 0, 'm').cyl(SILVER, 0.24 + i * 0.035, 1.645, 0, 0.016, 0.016, 0.012, 0, 0, 0, 'm');
    k.seg(BRASS, [0.2, 1.525, 0], [0.38, 1.525, 0], 0.013, 'm').tor(BRASS, 0.2, 1.548, 0, 0.023, 0.012, 0, 0, PI / 2, PI, 'm');
    hands = [[0.27, 1.66, 0.03], [0.31, 1.53, -0.05]];
  } else if (type === 'flute') {
    k.seg(SILVER, [0.13, 1.585, -0.03], [0.26, 1.5, 0.3], 0.011, 'm').sph(SILVER, 0.13, 1.585, -0.03, 0.013, 1, 1, 1, 'm');
    hands = [[0.16, 1.56, 0.05], [0.23, 1.52, 0.22]];
  } else if (type === 'glock') {
    k.seg('#2b2b33', [0.22, 0.98, 0], [0.3, 1.78, 0.03], 0.013);
    k.frame(0.36, 1.55, 0.06, 0, -0.75, 0, f => {
      f.seg(BRASS, [0, -0.22, -0.02], [0, 0.2, -0.17], 0.013, 'm').seg(BRASS, [0, -0.22, 0.02], [0, 0.2, 0.17], 0.013, 'm').seg(BRASS, [0, 0.2, -0.17], [0, 0.2, 0.17], 0.011, 'm');
      for (let i = 0; i < 8; i++) { const y = -0.17 + i * 0.045, w = 0.07 + i * 0.034; f.box(i % 2 ? SILVER : '#eef1f4', 0.01, y, 0, 0.02, 0.028, w, 0, 0, 0, 'm'); }
      f.sph(trim, 0, 0.25, -0.17, 0.05).sph(trim, 0, 0.25, 0.17, 0.05);
    });
    hands = [[0.26, 1.32, 0.0], [0.3, 1.4, 0.24]]; actAt = [0.3, 1.4, 0.24];
    act = new Kit(); act.seg('#2b2b33', [0, 0, 0], [0.06, 0.16, -0.12], 0.008).sph(WHITE, 0.06, 0.16, -0.12, 0.022);
  } else if (lead) {
    if (march) { hands = [[0.14, 1.06, -0.2], [0.22, 1.25, 0.22]]; actAt = [0.22, 1.25, 0.22]; act = new Kit(); act.seg(SILVER, [0, -0.5, 0], [0, 0.55, 0], 0.014, 'm').sph(BRASS, 0, 0.58, 0, 0.055, 1, 1, 1, 'm').sph(BRASS, 0, -0.52, 0, 0.03, 1, 1, 1, 'm').tor(trim === WHITE ? '#b8322a' : trim, 0, 0.3, 0, 0.03, 0.015, PI / 2, 0, 0, 0, 'b'); }
    else if (jazz) { hands = [[0.14, 1.06, -0.2], [0.18, 1.62, 0.24]]; actAt = [0.18, 1.62, 0.24]; act = new Kit(); act.seg('#2b2b33', [0, -0.08, 0], [0, 0.72, 0], 0.012).put(new THREE.ConeGeometry(0.48, 0.22, 10, 1, true), trim, 0, 0.66, 0, 0, 0, 0, 1, 1, 1, 'b').put(new THREE.ConeGeometry(0.48, 0.22, 10, 1, true), '#6b3fa0', 0, 0.659, 0, PI, 0, 0, 1, -1, 1, 'b').tor('#2e8b57', 0, 0.55, 0, 0.47, 0.03, PI / 2, 0, 0, 0, 'b'); }
    else if (carn) { hands = [[0.2, 1.2, 0.2], [0.2, 1.5, 0.22]]; actAt = [0.2, 1.3, 0.22]; act = new Kit(); act.seg('#8a6a3a', [0, -0.3, 0], [0, 1.25, 0], 0.016).sph(BRASS, 0, 1.27, 0, 0.035, 1, 1, 1, 'm').box(trim, 0.36, 1.02, 0, 0.66, 0.42, 0.012).box(coat, 0.36, 1.02, 0, 0.66, 0.12, 0.016).box('#1fa37a', 0.36, 1.18, 0, 0.66, 0.1, 0.016); }
    else { k.frame(0.26, 1.18, 0.14, 0, 0, 0.42, f => { f.box(trim, 0, 0, 0, 0.5, 0.12, 0.06, 0, 0, 0, 'g').box(WHITE, 0.02, 0.07, 0, 0.3, 0.02, 0.05).box('#1a1030', 0.36, 0.02, 0, 0.26, 0.05, 0.04).box('#3de0ff', 0.48, 0.02, 0, 0.03, 0.08, 0.05, 0, 0, 0, 'g'); }); hands = [[0.3, 1.26, 0.18], [0.46, 1.33, 0.12]]; }
  }
  if (!['bass'].includes(type)) { arm(k, armc, sh[0], hands[0]); arm(k, armc, sh[1], hands[1]); }
  if (neon) { k.tor(trim, hands[0][0] - 0.03, hands[0][1], hands[0][2], 0.045, 0.01, 0, PI / 2, 0, 0, 'g'); k.tor(trim, hands[1][0] - 0.03, hands[1][1], hands[1][2], 0.045, 0.01, 0, PI / 2, 0, 0, 'g'); }
  const o = k.build();
  o.act = act ? act.build() : null; o.actAt = actAt; o.hands = hands; o.handAct = handAct;
  return o;
}

/* ---------- canvas textures ---------- */
function ctex(w, h, fn, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; } return t;
}
const ROAD = { march: ['#b9a88c', '#8f7c62'], jazz: ['#8f8278', '#6b5f58'], carnival: ['#efe2c6', '#cbb690'], neon: ['#1a1233', '#0e0a20'] };
function roadTex(sty) {
  const R = ROAD[sty];
  return ctex(256, 256, (g, w, h) => {
    g.fillStyle = R[1]; g.fillRect(0, 0, w, h);
    if (sty === 'neon') { g.strokeStyle = '#ff3fb4'; g.lineWidth = 3; g.shadowColor = '#ff3fb4'; g.shadowBlur = 8; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); } return; }
    if (sty === 'carnival') { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) & 1 ? '#2c2c2c' : R[0]; if ((x * 3 + y * 5) % 7 < 3) g.fillStyle = R[0]; g.fillRect(x * 32 + 1, y * 32 + 1, 30, 30); } return; }
    for (let y = 0; y < 12; y++) for (let x = -1; x < 12; x++) { const off = (y & 1) * 11, v = hsh(x * 13 + y * 7) * 0.22; g.fillStyle = R[0]; g.globalAlpha = 0.75 + v; const px = x * 22 + off, py = y * 21.33; g.beginPath(); g.roundRect(px + 1.5, py + 1.5, 19, 18, 6); g.fill(); g.globalAlpha = 0.16; g.fillStyle = '#fff'; g.fillRect(px + 5, py + 3, 10, 2); }
    g.globalAlpha = 1;
  }, true);
}
function paveTex(sty) {
  const base = sty === 'neon' ? '#241a44' : sty === 'jazz' ? '#9c948c' : sty === 'carnival' ? '#f3ead8' : '#cfc6b4';
  return ctex(128, 128, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; g.strokeRect(1, 1, 62, 62); g.strokeRect(65, 1, 62, 62); g.strokeRect(1, 65, 62, 62); g.strokeRect(65, 65, 62, 62); if (sty === 'carnival') { g.strokeStyle = 'rgba(30,30,30,.55)'; g.lineWidth = 6; g.beginPath(); for (let x = 0; x <= w; x += 4) g.lineTo(x, 64 + Math.sin(x / w * PI * 4) * 22); g.stroke(); } }, true);
}
function signTex(S, sty) {
  return ctex(512, 640, (g) => {
    S.signs.forEach((s, i) => {
      const y = i * 64, bg = sty === 'neon' ? '#0d0820' : S.bunt[i % S.bunt.length];
      g.fillStyle = bg; g.fillRect(0, y, 512, 64); g.fillStyle = sty === 'neon' ? S.bunt[i % S.bunt.length] : '#fffaf0';
      g.font = '40px Shrikhand, Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      if (sty === 'neon') { g.shadowColor = g.fillStyle; g.shadowBlur = 14; }
      g.fillText(s, 256, y + 34, 470); g.shadowBlur = 0;
      if (sty !== 'neon') { g.strokeStyle = 'rgba(29,42,68,.55)'; g.lineWidth = 4; g.strokeRect(4, y + 4, 504, 56); }
    });
  });
}
function skyTex(S) { return ctex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, S.sky[0]); gr.addColorStop(0.62, S.sky[1]); gr.addColorStop(1, S.sky[1]); g.fillStyle = gr; g.fillRect(0, 0, w, h); }); }
function sunTex(S, neon) {
  return ctex(256, 256, (g) => {
    if (neon) { const gr = g.createLinearGradient(0, 30, 0, 226); gr.addColorStop(0, '#ffe65c'); gr.addColorStop(1, '#ff3fb4'); g.fillStyle = gr; g.beginPath(); g.arc(128, 128, 98, 0, 7); g.fill(); g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 7; i++) g.fillRect(0, 140 + i * 13, 256, 3 + i * 1.3); return; }
    const gr = g.createRadialGradient(128, 128, 30, 128, 128, 128); gr.addColorStop(0, 'rgba(255,248,220,1)'); gr.addColorStop(0.36, 'rgba(255,240,200,.95)'); gr.addColorStop(0.4, 'rgba(255,236,190,.35)'); gr.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  });
}
const STRIPE = ctex(64, 64, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i & 1 ? '#ffffff' : '#e8e2d8'; g.fillRect(i * 8, 0, 8, 64); } g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 56, 64, 8); });

/* ---------- per-band light ---------- */
const LIGHT = {
  march: { hemi: ['#e4f3ff', '#8a6c4c', 1.5], sun: ['#fff0d2', 3.0, [7, 13, 9]], fog: [26, 95], sunPos: [30, 26, -80], farc: '#7ea3a8' },
  jazz: { hemi: ['#a9a2ff', '#6a4038', 1.15], sun: ['#ffb27a', 2.8, [15, 4.2, 5]], fog: [22, 80], sunPos: [44, 9, -80], farc: '#5e4a78' },
  carnival: { hemi: ['#eafcff', '#b6955e', 1.8], sun: ['#fff7da', 3.3, [4, 16, 7]], fog: [30, 110], sunPos: [26, 32, -80], farc: '#3f9a86' },
  neon: { hemi: ['#8a64ff', '#3a1450', 1.25], sun: ['#ff6fcf', 1.5, [9, 7, 8]], fog: [18, 70], sunPos: [18, 8, -70], farc: '#26134f' },
};

export function init(A) {
  const { st, cv, LEADER } = A;
  const canvas = document.createElement('canvas'); canvas.id = 'street3d'; canvas.setAttribute('aria-hidden', 'true'); canvas.hidden = true;
  const R = new THREE.WebGLRenderer({ canvas, antialias: (window.devicePixelRatio || 1) < 2, powerPreference: 'high-performance' });
  cv.parentNode.insertBefore(canvas, cv);
  let PR = Math.min(window.devicePixelRatio || 1, 2); R.setPixelRatio(PR);
  R.toneMapping = THREE.NeutralToneMapping; R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(36, 2, 0.1, 260);
  const hemi = new THREE.HemisphereLight('#fff', '#888', 1.5), sun = new THREE.DirectionalLight('#fff', 3);
  sun.castShadow = true; sun.shadow.mapSize.setScalar(1024); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 60 }); sun.shadow.camera.updateProjectionMatrix();
  scene.add(hemi, sun, sun.target);

  // materials
  const MAT = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.62, metalness: 0.02 });
  const METAL = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.3, metalness: 0.85, envMapIntensity: 1.2 });
  const GLOW = new THREE.MeshBasicMaterial({ vertexColors: true });
  const SKIN = new THREE.MeshStandardMaterial({ roughness: 0.72 });
  const LEGM = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 });
  const PLAIN = new THREE.MeshStandardMaterial({ roughness: 0.9 });
  const BASIC = new THREE.MeshBasicMaterial();

  // shared instanced parts of marchers: heads, hands, thighs, shins
  const headG = (() => { const k = new Kit(); k.sph('#fff', 0, 0, 0, 0.115, 1, 1.05, 0.98).sph('#fff', 0.105, -0.015, 0, 0.026, 1, 1, 0.9).sph('#fff', -0.005, -0.005, -0.112, 0.026, 0.6, 1, 0.5).sph('#fff', -0.005, -0.005, 0.112, 0.026, 0.6, 1, 0.5).cyl('#fff', -0.01, -0.13, 0, 0.05, 0.055, 0.1); return k.build().b; })();
  const thighG = (() => { const k = new Kit(); k.cyl('#fff', 0, -0.22, 0, 0.078, 0.066, 0.46); return k.build().b; })();
  const shinG = (() => { const k = new Kit(); k.cyl('#fff', 0, -0.2, 0, 0.066, 0.058, 0.42).box('#161616', 0.05, -0.43, 0, 0.25, 0.08, 0.11).box('#161616', 0.15, -0.405, 0, 0.05, 0.05, 0.1); return k.build().b; })();
  const handG = new THREE.SphereGeometry(0.045, 10, 8);
  const MAXM = 24;
  function inst(g, m, n) { const x = new THREE.InstancedMesh(g, m, n); x.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3); x.castShadow = true; x.frustumCulled = false; x.count = 0; scene.add(x); return x; }
  const HEADS = inst(headG, SKIN, MAXM), HANDS = inst(handG, SKIN, MAXM * 2), THIGH = inst(thighG, LEGM, MAXM * 2), SHIN = inst(shinG, LEGM, MAXM * 2);

  // ground: road + sidewalks (static; their textures scroll)
  const roadM = new THREE.MeshStandardMaterial({ roughness: 0.92 }), paveM = new THREE.MeshStandardMaterial({ roughness: 0.95 }), pave2M = paveM.clone(), curbM = new THREE.MeshStandardMaterial({ color: '#a39a8c', roughness: 0.9 });
  const road = new THREE.Mesh(new THREE.PlaneGeometry(240, 6.6), roadM); road.rotation.x = -PI / 2; road.receiveShadow = true;
  const far = new THREE.Mesh(new THREE.BoxGeometry(240, 0.16, 2.9), paveM); far.position.set(0, 0.08, -4.75); far.receiveShadow = true;
  const near = new THREE.Mesh(new THREE.BoxGeometry(240, 0.16, 12), pave2M); near.position.set(0, 0.08, 9.3); near.receiveShadow = true;
  const curb1 = new THREE.Mesh(new THREE.BoxGeometry(240, 0.18, 0.2), curbM), curb2 = curb1.clone(); curb1.position.set(0, 0.09, -3.3); curb2.position.set(0, 0.09, 3.3);
  scene.add(road, far, near, curb1, curb2);

  // the scrolling world (buildings, crowd, lamps, bunting), recycled per building slot
  const world = new THREE.Group(); scene.add(world);
  function winst(g, m, n, shadow) { const x = new THREE.InstancedMesh(g, m, n); x.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3); x.frustumCulled = false; x.castShadow = !!shadow; x.receiveShadow = true; x.count = 0; world.add(x); return x; }
  const box1 = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const BLD = winst(box1, PLAIN, NB), CORN = winst(box1, PLAIN, NB * 2), FRAME = winst(new THREE.BoxGeometry(1, 1, 1), PLAIN, NB * 16);
  const winM = new THREE.MeshBasicMaterial(), WIN = winst(new THREE.PlaneGeometry(1, 1), winM, NB * 16);
  const awnM = new THREE.MeshStandardMaterial({ map: STRIPE, roughness: 0.8 }), AWN = winst(new THREE.BoxGeometry(1, 1, 1), awnM, NB);
  const DOOR = winst(new THREE.BoxGeometry(1, 1, 1), PLAIN, NB * 2);
  const signM = new THREE.MeshBasicMaterial({ map: null });
  signM.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <uv_pars_vertex>', '#include <uv_pars_vertex>\nattribute float aSign;').replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_MAP\nvMapUv = vec2(vMapUv.x, (vMapUv.y + aSign) / 10.0);\n#endif'); };
  const signG = new THREE.PlaneGeometry(1, 1), aSign = new THREE.InstancedBufferAttribute(new Float32Array(NB), 1); signG.setAttribute('aSign', aSign);
  const SIGN = new THREE.InstancedMesh(signG, signM, NB); SIGN.frustumCulled = false; SIGN.count = 0; world.add(SIGN);
  const POST = winst(new THREE.CylinderGeometry(0.055, 0.075, 1, 8).translate(0, 0.5, 0), PLAIN, NB);
  const lampM = new THREE.MeshBasicMaterial(), LAMP = winst(new THREE.SphereGeometry(0.2, 12, 8), lampM, NB);
  const flagG = new THREE.BufferGeometry(); flagG.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-0.17, 0, 0, 0.17, 0, 0, 0, -0.32, 0]), 3)); flagG.computeVertexNormals();
  const flagM = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.8 }), FLAG = winst(flagG, flagM, NB * 14);
  const crowdM = new THREE.MeshStandardMaterial({ roughness: 0.8 });
  const CB = winst(new THREE.CapsuleGeometry(0.17, 0.46, 2, 8), crowdM, NB * CPB, true), CH = winst(new THREE.SphereGeometry(0.105, 8, 6), SKIN, NB * CPB), CA = winst(new THREE.CapsuleGeometry(0.045, 0.34, 1, 5), crowdM, NB * CPB * 2);
  const farM = new THREE.MeshBasicMaterial(), FAR = winst(box1, farM, NB);
  // sky bits
  const sunM = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, fog: false }), sunD = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), sunM); sunD.renderOrder = -1; scene.add(sunD);
  const cloudM = new THREE.MeshBasicMaterial({ fog: false, transparent: true, opacity: 0.92 }), CLOUD = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), cloudM, 24); CLOUD.frustumCulled = false; scene.add(CLOUD);
  const starG = new THREE.BufferGeometry(), sp = new Float32Array(600); for (let i = 0; i < 200; i++) { sp[i * 3] = (hsh(i) - 0.5) * 400; sp[i * 3 + 1] = 14 + hsh(i + 0.5) * 70; sp[i * 3 + 2] = -110 - hsh(i + 0.7) * 20; }
  starG.setAttribute('position', new THREE.BufferAttribute(sp, 3)); const STARS = new THREE.Points(starG, new THREE.PointsMaterial({ color: '#fff4e0', size: 1.4, sizeAttenuation: false, fog: false })); scene.add(STARS);
  // solo spotlight
  const spotM = new THREE.MeshBasicMaterial({ color: '#fff3c8', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 1.25, 7, 28, 1, true), spotM); cone.position.y = 3.5;
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1.25, 28), spotM.clone()); pool.rotation.x = -PI / 2; pool.position.y = 0.03;
  const spot = new THREE.Group(); spot.add(cone, pool); scene.add(spot);

  let sty = null, S = null, base = null, envT = null;
  const pm = new THREE.PMREMGenerator(R);
  function applyStyle() {
    sty = st.style; S = A.STY[sty]; const Lt = LIGHT[sty], neon = !!S.neon;
    if (scene.background) scene.background.dispose(); scene.background = skyTex(S);
    scene.fog = new THREE.Fog(C(S.sky[1]), Lt.fog[0], Lt.fog[1]);
    hemi.color.set(Lt.hemi[0]); hemi.groundColor.set(Lt.hemi[1]); hemi.userData.i = Lt.hemi[2];
    sun.color.set(Lt.sun[0]); sun.userData.i = Lt.sun[1]; sun.userData.off = Lt.sun[2];
    for (const m of [roadM, paveM, pave2M]) { if (m.map) m.map.dispose(); }
    roadM.map = roadTex(sty); roadM.map.repeat.set(240 / 3, 6.6 / 3); roadM.emissiveMap = neon ? roadM.map : null; roadM.emissive.set(neon ? '#ffffff' : '#000000'); roadM.emissiveIntensity = neon ? 0.55 : 0; roadM.needsUpdate = true;
    paveM.map = paveTex(sty); paveM.map.repeat.set(240 / 1.5, 2.9 / 1.5); pave2M.map = paveM.map.clone(); pave2M.map.repeat.set(240 / 1.5, 12 / 1.5); pave2M.map.needsUpdate = true; paveM.needsUpdate = pave2M.needsUpdate = true;
    curbM.color.set(neon ? '#3a2a66' : '#b3aa9c');
    if (signM.map) signM.map.dispose(); signM.map = signTex(S, sty); signM.needsUpdate = true;
    lampM.color.set(neon ? '#ff9fe8' : sty === 'jazz' ? '#ffd88a' : '#fff4d6');
    farM.color.set(Lt.farc);
    if (sunM.map) sunM.map.dispose(); sunM.map = sunTex(S, neon); sunM.needsUpdate = true;
    cloudM.color.set(sty === 'jazz' ? '#ffd2c4' : '#ffffff'); CLOUD.visible = !neon; STARS.visible = neon || sty === 'jazz'; STARS.material.opacity = neon ? 1 : 0.5; STARS.material.transparent = !neon;
    // env map for the brass: a sky gradient with a bright sun blob
    const es = new THREE.Scene(); es.background = null;
    const sg = new THREE.SphereGeometry(10, 24, 12), cols = new Float32Array(sg.attributes.position.count * 3), top = C(S.sky[0]), hor = C(S.sky[1]), gnd = C(ROAD[sty][1]);
    for (let i = 0; i < sg.attributes.position.count; i++) { const y = sg.attributes.position.getY(i) / 10; _c.copy(y > 0 ? hor : gnd).lerp(y > 0 ? top : gnd, Math.min(1, Math.abs(y) * 1.6)); cols[i * 3] = _c.r; cols[i * 3 + 1] = _c.g; cols[i * 3 + 2] = _c.b; }
    sg.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    es.add(new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
    const sb = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(Lt.sun[0]).multiplyScalar(neon ? 3 : 6) })); sb.position.set(Lt.sun[2][0], Lt.sun[2][1], Lt.sun[2][2]).normalize().multiplyScalar(8); es.add(sb);
    if (envT) envT.dispose(); envT = pm.fromScene(es, 0.02).texture; METAL.envMap = envT; METAL.needsUpdate = true;
    es.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    base = null; recs.forEach(r => r.key = ''); yaw = pitch = 0;
  }

  function setWorld(b) {
    base = b; const n = st.style, neon = !!S.neon;
    let nb = 0, nc = 0, nf = 0, nw = 0, nd = 0, np = 0, nl = 0, nfl = 0, nfar = 0;
    const put = (mesh, i, x, y, z, sx, sy, sz, col, rx) => { _o.position.set(x, y, z); _o.rotation.set(rx || 0, 0, 0); _o.scale.set(sx, sy, sz); _o.updateMatrix(); mesh.setMatrixAt(i, _o.matrix); if (col && mesh.instanceColor) mesh.setColorAt(i, _c.set(col)); };
    for (let s = 0; s < NB; s++) {
      const i = b + s - (NB >> 1), x = (s - (NB >> 1)) * BW + BW / 2, h = (6.4 + hsh(i) * 5.8) * (neon ? 1.25 : 1), bc = S.bld[Math.floor(hsh(i + 0.3) * S.bld.length)];
      put(BLD, nb++, x, 0, -9.2, BW - 0.06, h, 6, bc);
      _c.set(bc).multiplyScalar(0.72); const dk = '#' + _c.getHexString();
      put(CORN, nc++, x, h - 0.32, -6.15, BW + 0.12, 0.34, 0.5, dk); put(CORN, nc++, x, 3.28, -6.15, BW, 0.16, 0.3, dk);
      for (let y = 3.9, fl = 0; y + 1.5 < h - 0.4; y += 2.3, fl++) for (let c = -1; c <= 1; c++) {
        const wx = x + c * 1.35, wc = S.win[Math.floor(hsh(i * 7 + fl * 3 + c + 0.2) * S.win.length)];
        put(FRAME, nf++, wx, y + 0.72, -6.19, 0.98, 1.56, 0.08, neon ? '#0c0820' : '#f1e8d6');
        put(WIN, nw++, wx, y + 0.72, -6.14, 0.82, 1.36, 1, wc);
        if (!neon && hsh(i * 11 + fl + c * 3) > 0.72) put(FRAME, nf++, wx, y + 0.02, -6.02, 0.95, 0.14, 0.34, '#6b4a2e');
      }
      put(DOOR, nd++, x - 1.3, 0.16, -6.17, 0.95, 2.1, 0.08, neon ? '#120c26' : '#4a3222');
      put(DOOR, nd++, x + 0.6, 0.62, -6.17, 2.2, 1.55, 0.06, neon ? '#2a1850' : '#2b3550');
      put(AWN, s, x + 0.2, 2.42, -5.75, 3.4, 0.07, 1.1, S.bunt[Math.floor(hsh(i + 0.6) * S.bunt.length)], 0.34);
      put(SIGN, s, x + 0.2, 2.95, -6.1, 2.6, 0.62, 1); aSign.setX(s, 9 - (((i % 10) + 10) % 10));
      if ((i & 1) === 0) {
        put(POST, np++, x - BW / 2, 0.16, -3.75, 1, 3.55, 1, neon ? '#2a2050' : '#23262e'); put(LAMP, nl++, x - BW / 2, 3.78, -3.75, 1, 1.1, 1, '#ffffff');
        for (let f = 0; f < 13; f++) { const t = (f + 0.5) / 13, fx = x - BW / 2 + t * BW * 2, fy = 3.45 - Math.sin(t * PI) * 0.75; put(FLAG, nfl++, fx, fy, -3.75, 1, 1, 1, S.bunt[(f + i) % S.bunt.length]); }
      }
      put(FAR, nfar++, x * 1.9, 0, -34 - hsh(i + 0.1) * 8, BW * 1.6, (14 + hsh(i + 0.4) * 22) * (neon ? 1.3 : 1), 6, Lt().farc);
      for (let c = 0; c < CPB; c++) {
        const j = s * CPB + c, pj = i * CPB + c, cc = A.CROWD[Math.floor(hsh(pj + 0.3) * A.CROWD.length)];
        CB.setColorAt(j, _c.set(cc)); CA.setColorAt(j * 2, _c); CA.setColorAt(j * 2 + 1, _c); CH.setColorAt(j, _c.set(A.SKIN[Math.floor(hsh(pj + 0.8) * A.SKIN.length)]));
      }
    }
    BLD.count = nb; CORN.count = nc; FRAME.count = nf; WIN.count = nw; DOOR.count = nd; AWN.count = NB; SIGN.count = NB; POST.count = np; LAMP.count = nl; FLAG.count = nfl; FAR.count = nfar;
    CB.count = CH.count = NB * CPB; CA.count = NB * CPB * 2;
    for (const m of [BLD, CORN, FRAME, WIN, DOOR, AWN, SIGN, POST, LAMP, FLAG, FAR, CB, CH, CA]) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
    aSign.needsUpdate = true;
  }
  const Lt = () => LIGHT[sty];

  function crowd(p, now, exc) {
    const beat = p / 4;
    for (let s = 0; s < NB; s++) {
      const i = base + s - (NB >> 1), x0 = (s - (NB >> 1)) * BW + BW / 2;
      for (let c = 0; c < CPB; c++) {
        const j = s * CPB + c, pj = i * CPB + c, h1 = hsh(pj + 0.1), gap = h1 < 0.1;
        const hf = gap ? 0.0001 : 0.82 + hsh(pj + 0.5) * 0.28 - (hsh(pj + 0.9) < 0.12 ? 0.25 : 0), row = c & 1;
        const x = x0 + (c - 2.5) * 0.72 + (h1 - 0.5) * 0.3, z = -4.05 - row * 0.8 - hsh(pj + 0.2) * 0.15;
        const hype = exc > hsh(pj + 0.6) * 0.9, jump = st.playing && hype ? Math.max(0, Math.sin((beat + hsh(pj) * 0.3) * PI * 2)) * 0.09 * exc : 0;
        const y0 = 0.16 + jump, bh = (0.34 + 0.46) * hf, cy = y0 + bh / 2;
        _o.position.set(x, cy, z); _o.rotation.set(0, 0, 0); _o.scale.set(1, hf, 1); _o.updateMatrix(); CB.setMatrixAt(j, _o.matrix);
        _o.position.set(x + 0.01, y0 + bh + 0.09 * hf + 0.02, z); _o.scale.setScalar(gap ? 0.0001 : 1); _o.updateMatrix(); CH.setMatrixAt(j, _o.matrix);
        const up = hype && st.playing ? 1 : 0.15 + 0.1 * Math.sin(now + pj), wav = st.playing && hype ? Math.sin(now * 6 + pj) * 0.25 : 0;
        for (let a = 0; a < 2; a++) {
          const sd = a ? 1 : -1, ang = lerp(0.18, 2.7, up) + (a ? wav : -wav);
          _o.position.set(x, y0 + bh * 0.8, z + sd * 0.19); _o.rotation.set(-sd * ang, 0, 0); _o.scale.setScalar(gap ? 0.0001 : hf); _o.translateY(-0.2); _o.updateMatrix(); CA.setMatrixAt(j * 2 + a, _o.matrix);
        }
      }
    }
    CB.instanceMatrix.needsUpdate = CH.instanceMatrix.needsUpdate = CA.instanceMatrix.needsUpdate = true;
  }

  /* marcher records */
  const recs = new Map();
  const GEO = {};
  function geoFor(type) {
    const key = sty + '|' + type;
    if (!GEO[key]) GEO[key] = buildMarcher(sty, type, S, A.ORDER.indexOf(type) + 1);
    return GEO[key];
  }
  function rec(m) {
    let r = recs.get(m); const key = sty + '|' + (m.leader ? 'lead' : m.type);
    if (r && r.key === key) return r;
    if (!r) { r = { g: new THREE.Group(), up: new THREE.Group(), meshes: [] }; r.g.add(r.up); scene.add(r.g); recs.set(m, r); }
    r.meshes.forEach(x => { x.parent.remove(x); }); r.meshes = []; r.key = key;
    const G = geoFor(m.leader ? 'lead' : m.type);
    const mk = (geo, mat, parent) => { if (!geo) return null; const x = new THREE.Mesh(geo, mat); x.castShadow = true; parent.add(x); r.meshes.push(x); return x; };
    mk(G.b, MAT, r.up); mk(G.m, METAL, r.up); mk(G.g, GLOW, r.up);
    r.act = null;
    if (G.act) { r.act = new THREE.Group(); r.act.position.fromArray(G.actAt); r.up.add(r.act); r.meshes.push(r.act); mk(G.act.b, MAT, r.act); mk(G.act.m, METAL, r.act); mk(G.act.g, GLOW, r.act); }
    r.G = G; return r;
  }

  const GAIT = { march: [1.2, 1, 0.025, 0], jazz: [0.5, 0.8, 0.02, 0.09], carnival: [0.62, 2, 0.05, 0.05], neon: [0.55, 1, 0.03, 0.06] };
  const GLOVE = { march: '#f7f3ea', carnival: '#f7f3ea', neon: '#1a1a22' };
  let camX = 0, camD = 12, yaw = 0, pitch = 0, fps = [], lowQ = false, lastNow = 0;
  const mat4 = new THREE.Matrix4(), off = new THREE.Matrix4(), rz = new THREE.Matrix4();
  function X(m) { return (m.x - A.VW() / 2) * PX; }
  function Z(m) { return (m.y - (A.VH() - 58)) * RZ; }

  function render(p, now, exc) {
    if (st.style !== sty) applyStyle();
    const dt = Math.min(0.05, Math.max(0, now - lastNow)); lastNow = now;
    if (!lowQ && fps.length < 90) { fps.push(dt); if (fps.length === 90) { const av = fps.slice(20).reduce((a, b) => a + b, 0) / 70; if (av > 0.024) { lowQ = true; R.setPixelRatio(1); R.shadowMap.enabled = false; sun.castShadow = false; resize(); } } }
    const u = st.scroll * PX, b = Math.floor(u / BW); if (b !== base) setWorld(b);
    world.position.x = -(u - b * BW);
    // ground scroll
    roadM.map.offset.x = (u / 3) % 1; paveM.map.offset.x = (u / 1.5) % 1; pave2M.map.offset.x = (u / 1.5) % 1;
    crowd(p, now, exc);
    // marchers
    const list = A.band().slice(); list.push(LEADER);
    const seen = new Set(), g = GAIT[sty] || GAIT.march;
    let nh = 0, nk = 0, nl = 0, mn = 1e9, mx = -1e9;
    const sm = st.spotA > 0.02 ? st.spotM : null;
    for (const m of list) {
      const r = rec(m); seen.add(m);
      const x = X(m), z = Z(m), mv = Math.abs(m.tx - m.x) > 3 || m.gone, go = st.playing || mv;
      if (!m.gone) { mn = Math.min(mn, x); mx = Math.max(mx, x); }
      let ph = (st.playing && !m.gone ? p / 4 : now * 2) * g[1]; const fr = ph - Math.floor(ph), lg = Math.floor(ph) & 1, lift = go ? Math.sin(fr * PI) : 0;
      const hit = Math.max(0, 1 - (now - m.hit) / 0.14);
      const isSolo = sm === m, sol = isSolo ? st.spotA : 0;
      r.g.position.set(x, 0, z); r.g.rotation.y = m.gone ? lerp(r.g.rotation.y, PI, Math.min(1, dt * 5)) : -0.75 * sol;
      r.g.scale.setScalar(1 + 0.06 * sol);
      r.up.position.y = go ? Math.abs(Math.sin(fr * PI)) * g[2] : 0;
      r.up.rotation.x = go ? Math.sin(ph * PI) * g[3] : 0;
      r.up.rotation.z = (['bone', 'trumpet', 'flute', 'tuba'].includes(m.type) ? hit * 0.05 : 0) - (sty === 'neon' && go ? 0.04 * Math.sin(ph * PI * 2) : 0);
      if (r.act) {
        const t = m.type;
        if (t === 'snare' || t === 'bass' || t === 'glock') r.act.rotation.z = 0.45 * (1 - hit) - 0.1;
        else if (t === 'cymbal') r.act.scale.z = 1 + hit * 1.6;
        else if (t === 'bone') { const e = Math.max(0, Math.min(0.34, (8 - (m.slc || 4)) * 0.035)); r.act.position.x = r.G.actAt[0] + e; }
        else if (m.leader && sty === 'march') r.act.rotation.z = st.playing ? p * PI / 4 : 0.25;
        else if (m.leader && sty === 'jazz') r.act.rotation.y = now * 1.4;
        else if (m.leader && sty === 'carnival') { r.act.rotation.y = Math.sin(now * 2.6) * 0.5; r.act.rotation.x = Math.sin(now * 1.7) * 0.08; }
      }
      r.g.updateMatrixWorld(true);
      // head + hands
      mat4.copy(r.up.matrixWorld);
      off.makeTranslation(HEAD[0], HEAD[1], HEAD[2]); _m.multiplyMatrices(mat4, off); HEADS.setMatrixAt(nh, _m); HEADS.setColorAt(nh, _c.set(m.skin || '#c58a62')); nh++;
      const gl = GLOVE[sty] || m.skin || '#c58a62';
      r.G.hands.forEach((hp, hi) => { let hx = hp[0]; if (hi === r.G.handAct && r.act) hx += r.act.position.x - r.G.actAt[0]; off.makeTranslation(hx, hp[1], hp[2]); _m.multiplyMatrices(mat4, off); HANDS.setMatrixAt(nk, _m); HANDS.setColorAt(nk, _c.set(gl)); nk++; });
      // legs
      mat4.copy(r.g.matrixWorld);
      for (let L = 0; L < 2; L++) {
        const up = (L === lg ? 1 : 0), th = go ? (up ? lift * g[0] : -lift * 0.14) : 0, sh = up ? -lift * g[0] * (sty === 'march' ? 1.05 : 0.9) : 0;
        off.makeTranslation(0, 0.9 + r.up.position.y * 0.5, L ? 0.09 : -0.09); rz.makeRotationZ(th); off.multiply(rz); _m.multiplyMatrices(mat4, off);
        THIGH.setMatrixAt(nl, _m); _m2.makeTranslation(0, -0.44, 0); rz.makeRotationZ(sh); _m2.multiply(rz); _m.multiply(_m2); SHIN.setMatrixAt(nl, _m);
        const lc = m.leader && sty === 'jazz' ? '#1b1b22' : S.legs[0]; THIGH.setColorAt(nl, _c.set(lc)); SHIN.setColorAt(nl, _c); nl++;
      }
    }
    recs.forEach((r, m) => { if (!seen.has(m)) { scene.remove(r.g); recs.delete(m); } });
    HEADS.count = nh; HANDS.count = nk; THIGH.count = SHIN.count = nl;
    for (const x of [HEADS, HANDS, THIGH, SHIN]) { x.instanceMatrix.needsUpdate = true; x.instanceColor.needsUpdate = true; }
    // spotlight + dimming
    const sa = st.spotA;
    if (sm && sa > 0.02) { spot.visible = true; spot.position.set(X(sm), 0, Z(sm)); spotM.opacity = 0.14 * sa; pool.material.opacity = 0.32 * sa; } else spot.visible = false;
    hemi.intensity = hemi.userData.i * (1 - 0.45 * sa); sun.intensity = sun.userData.i * (1 - 0.55 * sa);
    // camera: fit the band, 3/4 view from the near sidewalk
    if (mn > mx) { mn = mx = X(LEADER); }
    const y0 = cam.aspect < 1 ? 0.82 : 0.42, cx = (mn + mx) / 2, hw = ((mx - mn) / 2 + 1.5) * Math.cos(y0) + 1.2 * Math.sin(y0), vf = cam.fov * PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * cam.aspect);
    const want = Math.min(30, Math.max(cam.aspect < 1 ? 7.2 : 6, hw / Math.tan(hf / 2) * 0.98));
    const k = camX === null ? 1 : Math.min(1, dt * 2); camX += (cx - camX) * k; camD += (want - camD) * k;
    const ya = y0 + yaw, pa = 0.2 + pitch, tx = camX - 0.2, ty = 1.15, tz = -0.2;
    cam.position.set(tx + Math.sin(ya) * Math.cos(pa) * camD, ty + Math.sin(pa) * camD, tz + Math.cos(ya) * Math.cos(pa) * camD); cam.lookAt(tx, ty, tz);
    const so = sun.userData.off; sun.position.set(tx + so[0], so[1], tz + so[2]); sun.target.position.set(tx, 0, tz);
    const sp2 = LIGHT[sty].sunPos; sunD.position.set(tx + sp2[0], sp2[1], sp2[2]); sunD.scale.setScalar(S.neon ? 44 : 34); sunD.lookAt(cam.position);
    // clouds drift slowly
    let ci = 0; for (let c = 0; c < 6; c++) { const cxw = ((c * 37 - u * 0.25 + now * 0.3) % 220 + 220) % 220 - 110 + tx, cyw = 26 + (c % 3) * 5, czw = -95; for (let pff = 0; pff < 4; pff++) { _o.position.set(cxw + pff * 3.2 - 5, cyw + (pff & 1) * 1.4, czw); _o.rotation.set(0, 0, 0); _o.scale.set(3.2 + (pff & 1), 1.8 + (pff & 1) * 0.6, 1.5); _o.updateMatrix(); CLOUD.setMatrixAt(ci++, _o.matrix); } }
    CLOUD.count = ci; CLOUD.instanceMatrix.needsUpdate = true;
    STARS.position.x = tx;
    R.render(scene, cam);
  }

  function resize() {
    const r = cv.getBoundingClientRect(); if (!r.width) return;
    R.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.fov = cam.aspect < 1 ? 46 : 36; cam.updateProjectionMatrix();
  }
  function projM(m, y) { _v.set(X(m), y, Z(m)).project(cam); return _v; }
  function pick(cx, cy) {
    const r = canvas.getBoundingClientRect(), nx = (cx - r.left) / r.width * 2 - 1, ny = -((cy - r.top) / r.height * 2 - 1);
    let best = null, bd = 1e9; const list = A.alive().concat([LEADER]);
    for (const m of list) {
      const f = projM(m, 0), fx = f.x, fy = f.y, fz = f.z; const t = projM(m, 2.0), ty = t.y; _v2.set(X(m) + 0.34, 1, Z(m)).project(cam); const w = Math.abs(_v2.x - fx) + 0.01;
      if (Math.abs(nx - fx) < w && ny > fy - 0.02 && ny < ty && fz < bd) { bd = fz; best = m; }
    }
    return best;
  }
  function proj(m) { const v = projM(m, 2.05); return [(v.x + 1) / 2 * A.VW(), (1 - v.y) / 2 * A.VH()]; }
  function orbit(dx, dy) { yaw = Math.max(-1.0, Math.min(1.1, yaw - dx * 0.006)); pitch = Math.max(-0.14, Math.min(0.55, pitch + dy * 0.004)); }
  function screen(m) { const v = projM(m, 1.0), r = canvas.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; }
  function show(on) { canvas.hidden = !on; if (on) resize(); }
  function stats() { return { calls: R.info.render.calls, tris: R.info.render.triangles, lowQ }; }
  return { render, resize, pick, proj, show, stats, orbit, screen };
}
