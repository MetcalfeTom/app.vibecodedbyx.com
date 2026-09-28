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
  lathe(c, pts, x, y, z, sx, sy, sz, seg, L) { const P = pts[0][1] > pts[pts.length - 1][1] ? pts.slice().reverse() : pts; return this.put(new THREE.LatheGeometry(P.map(p => new THREE.Vector2(p[0], p[1])), seg || 12), c, x, y, z, 0, 0, 0, sx, sy, sz, L); }
  frame(x, y, z, rx, ry, rz, fn) { const prev = this.X; _o.position.set(x, y, z); _o.rotation.set(rx, ry, rz); _o.scale.set(1, 1, 1); _o.updateMatrix(); this.X = _o.matrix.clone(); if (prev) this.X.premultiply(prev); fn(this); this.X = prev; return this; }
  build() { const o = {}; for (const k in this.L) o[k] = this.L[k].length ? merge(this.L[k]) : null; return o; }
}

/* ---------- marchers (face +X, feet at y=0, right hand side is +Z) ---------- */
const BRASS = '#e7b545', BRASS2 = '#a8782a', SILVER = '#d9dee4', WHITE = '#f7f3ea', INK = '#1d2a44';
const HAIR = ['#f5d36b', '#2b1a12', '#c4462f', '#efe6d6', '#6b3a1e', '#15121c', '#e07bd6', '#3de0ff'];
const NAT = ['#2a1d14', '#5a3a22', '#c9a063', '#1b1b1b', '#8c4a2f', '#3b2a1e', '#6b4a2e', '#b8b0a4', '#231a16'];
const HEAD = [0.03, 1.63, 0];
// torso profile (radius, height), squashed front-to-back: a chest, a waist, hips and shoulders instead of a tin can
const TORSO = [[0.001, 0.86], [0.15, 0.86], [0.168, 0.93], [0.162, 1.0], [0.148, 1.08], [0.165, 1.18], [0.185, 1.28], [0.19, 1.35], [0.175, 1.42], [0.12, 1.47], [0.05, 1.5], [0.001, 1.5]], TSX = 0.74, TSZ = 1.08;
function fx(y) { for (let i = 1; i < TORSO.length; i++) { const a = TORSO[i - 1], b = TORSO[i]; if (b[1] > a[1] && y <= b[1]) return lerp(a[0], b[0], (y - a[1]) / (b[1] - a[1])) * TSX; } return 0.04; }
function arm(k, c, sh, hand, el, cuff) {
  const e = el || [(sh[0] + hand[0]) / 2 - 0.05, Math.min(sh[1], hand[1]) - 0.1, (sh[2] + hand[2]) / 2 + (sh[2] > 0 ? 0.07 : -0.07)];
  k.seg(c, sh, e, 0.046, 'b', 0.039).sph(c, e[0], e[1], e[2], 0.039).seg(c, e, hand, 0.037, 'b', 0.031);
  if (cuff) { const w = [lerp(e[0], hand[0], 0.72), lerp(e[1], hand[1], 0.72), lerp(e[2], hand[2], 0.72)], w2 = [lerp(e[0], hand[0], 0.9), lerp(e[1], hand[1], 0.9), lerp(e[2], hand[2], 0.9)]; k.seg(cuff, w, w2, 0.036, 'b', 0.035); }
}
function buildMarcher(sty, type, S, ti) {
  const k = new Kit(), lead = type === 'lead', T = lead ? S.L : S.T[type], neon = !!S.neon, jazz = sty === 'jazz', carn = sty === 'carnival', march = sty === 'march';
  const coat = T.coat, trim = T.plume, armc = T.arm || coat, hairC = neon && ti % 3 === 1 ? HAIR[ti % HAIR.length] : NAT[(ti * 5) % NAT.length];
  let hands = [[0.2, 1.05, -0.2], [0.2, 1.05, 0.2]], act = null, actAt = [0, 0, 0], handAct = -1;
  // torso: one lathe, then shoulders
  k.lathe(coat, TORSO, 0, 0, 0, TSX, 1, TSZ, 20);
  k.sph(coat, 0, 1.4, -0.2, 0.064).sph(coat, 0, 1.4, 0.2, 0.064);
  const belt = (c, y, h) => k.put(new THREE.CylinderGeometry(0.172, 0.172, h, 20), c, 0, y, 0, 0, 0, 0, TSX + 0.03, 1, TSZ + 0.02);
  belt(jazz ? '#1b1b22' : carn ? trim : march ? WHITE : '#120c24', 0.93, 0.06);
  const F = (y, d) => fx(y) + (d || 0.006);
  if (march) {
    for (const sd of [-1, 1]) { k.seg(WHITE, [F(0.97), 0.97, -sd * 0.12], [F(1.3, 0.01), 1.3, sd * 0.04], 0.016).seg(WHITE, [F(1.3, 0.01), 1.3, sd * 0.04], [0.06, 1.47, sd * 0.14], 0.016); }
    for (let i = 0; i < 3; i++) k.sph(BRASS, F(1.06 + i * 0.12, 0.004), 1.06 + i * 0.12, 0, 0.016, 1, 1, 1, 'm');
    k.sph(BRASS, 0, 1.455, -0.2, 0.072, 1, 0.38, 1.2, 'm').sph(BRASS, 0, 1.455, 0.2, 0.072, 1, 0.38, 1.2, 'm');
    k.cyl(trim === WHITE || trim === '#fffaf0' ? '#b8322a' : trim, 0.005, 1.5, 0, 0.062, 0.072, 0.06);
  } else if (jazz) {
    if (!lead) {
      k.box(trim, F(1.3), 1.3, 0, 0.012, 0.24, 0.048).box(trim, F(1.43, 0.012), 1.43, 0, 0.02, 0.04, 0.06);
      for (const sd of [-1, 1]) k.seg('#2a2a33', [F(0.97, 0.004), 0.97, sd * 0.1], [F(1.3, 0.004), 1.3, sd * 0.11], 0.012).seg('#2a2a33', [F(1.3, 0.004), 1.3, sd * 0.11], [0.02, 1.47, sd * 0.12], 0.012);
    } else { k.box(WHITE, F(1.34, 0.002), 1.34, 0, 0.012, 0.22, 0.1).box(trim, F(1.38, 0.012), 1.38, 0.1, 0.02, 0.08, 0.05); }
    k.cyl(WHITE, 0.005, 1.5, 0, 0.058, 0.066, 0.05);
  } else if (carn) {
    k.seg(trim, [F(0.98), 0.98, -0.14], [F(1.32, 0.012), 1.32, 0.08], 0.03).seg(trim, [F(1.32, 0.012), 1.32, 0.08], [0.04, 1.47, 0.15], 0.03);
    for (let i = 0; i < 9; i++) { const y = 1.0 + (i % 5) * 0.09, a = (i * 0.7) % (PI * 2) - PI / 2, rr = fx(y) / TSX + 0.006; k.sph(i & 1 ? '#fff6c8' : trim, rr * TSX * Math.cos(a), y, rr * TSZ * Math.sin(a), 0.016, 1, 1, 1, 'm'); }
    k.cyl(trim, 0.005, 1.5, 0, 0.066, 0.075, 0.05);
  } else {
    k.seg(trim, [F(0.95, 0.003), 0.95, 0], [F(1.34, 0.006), 1.34, 0], 0.008, 'g').seg(trim, [F(1.34, 0.006), 1.34, 0], [F(1.45, 0.006), 1.45, 0], 0.008, 'g');
    k.cyl(trim, 0.005, 1.5, 0, 0.066, 0.078, 0.035, 0, 0, 0, 'g', 12);
    k.box(coat, 0, 1.445, -0.2, 0.2, 0.08, 0.12).box(coat, 0, 1.445, 0.2, 0.2, 0.08, 0.12);
  }
  // face: eyes, brows, lips, then hair (neon wears a glowing visor instead of eyes)
  const hx = HEAD[0], hy = HEAD[1];
  if (!neon) {
    for (const sd of [-1, 1]) {
      k.put(new THREE.SphereGeometry(0.0135, 8, 6), '#f2ece4', hx + 0.083, hy + 0.02, sd * 0.033, 0, 0, 0, 0.6, 1, 1);
      k.put(new THREE.SphereGeometry(0.0078, 6, 5), '#2b1a12', hx + 0.089, hy + 0.02, sd * 0.033);
      k.box(hairC, hx + 0.084, hy + 0.046, sd * 0.034, 0.012, 0.0075, 0.034, sd * 0.12, 0, 0);
    }
    k.put(new THREE.SphereGeometry(0.02, 8, 6), '#8e4a45', hx + 0.089, hy - 0.056, 0, 0, 0, 0, 0.42, 0.32, 1);
  } else {
    for (const sd of [-1, 1]) k.box(hairC, hx + 0.083, hy + 0.058, sd * 0.034, 0.012, 0.0075, 0.034, sd * 0.12, 0, 0);
    k.put(new THREE.SphereGeometry(0.02, 8, 6), '#8e4a45', hx + 0.089, hy - 0.056, 0, 0, 0, 0, 0.42, 0.32, 1);
  }
  if (!(march && lead) && !neon) k.put(new THREE.SphereGeometry(0.104, 16, 12), hairC, hx - 0.02, hy + 0.014, 0, 0, 0, 0, 0.95, 1.08, 0.9);
  // hats
  if (march) {
    if (lead) {
      k.sph('#15151c', hx - 0.01, hy + 0.24, 0, 0.16, 1, 1.4, 1).tor(BRASS, hx + 0.012, hy - 0.03, 0, 0.098, 0.006, 0, PI / 2, 0.35, 0, 'm');
      k.cyl(trim === WHITE ? '#fffaf0' : trim, hx - 0.02, hy + 0.34, 0.15, 0.03, 0.02, 0.34, -0.25, 0, 0).sph('#b8322a', hx - 0.02, hy + 0.51, 0.19, 0.045);
    } else {
      k.cyl(INK, hx - 0.01, hy + 0.14, 0, 0.115, 0.108, 0.22, 0, 0, 0, 'b', 18).cyl('#0d1320', hx + 0.075, hy + 0.04, 0, 0.085, 0.085, 0.012, 0, 0, -0.25);
      k.put(new THREE.CircleGeometry(0.045, 12), BRASS, hx + 0.104, hy + 0.14, 0, 0, PI / 2, 0, 1, 1, 1, 'm');
      k.cyl(BRASS, hx - 0.01, hy + 0.245, 0, 0.116, 0.116, 0.012, 0, 0, 0, 'm', 18);
      k.cyl(trim, hx, hy + 0.34, 0, 0.032, 0.016, 0.2).sph(trim, hx, hy + 0.45, 0, 0.038, 1, 1.3, 1);
    }
  } else if (jazz) {
    if (lead) { k.sph('#18181e', hx - 0.01, hy + 0.1, 0, 0.125, 1, 0.8, 1).cyl('#18181e', hx - 0.01, hy + 0.088, 0, 0.2, 0.2, 0.014, 0, 0, 0, 'b', 18).cyl(trim, hx - 0.01, hy + 0.11, 0, 0.127, 0.127, 0.03, 0, 0, 0, 'b', 18); }
    else { k.cyl(WHITE, hx - 0.005, hy + 0.14, 0, 0.13, 0.115, 0.07, 0, 0, 0, 'b', 16).cyl('#1b1b22', hx - 0.01, hy + 0.095, 0, 0.114, 0.114, 0.045, 0, 0, 0, 'b', 16); k.box('#1b1b22', hx + 0.12, hy + 0.078, 0, 0.1, 0.012, 0.16, 0, 0, -0.12); k.put(new THREE.CircleGeometry(0.02, 8), BRASS, hx + 0.105, hy + 0.11, 0, 0, PI / 2, 0, 1, 1, 1, 'm'); }
  } else if (carn) {
    k.cyl(trim, hx - 0.012, hy + 0.075, 0, 0.113, 0.108, 0.06, 0, 0, 0, 'b', 16);
    const n = lead ? 11 : 7, cols = [trim, coat, '#fff6c8'];
    for (let i = 0; i < n; i++) { const a = (i / (n - 1) - 0.5) * (lead ? 2.3 : 1.9); k.put(new THREE.SphereGeometry(0.1, 8, 6), cols[i % 3], hx - 0.05, hy + 0.12 + Math.cos(a) * 0.26, Math.sin(a) * 0.26, a, 0, 0, 0.18, lead ? 3.1 : 2.4, 0.7); }
    k.sph('#fff6c8', hx + 0.088, hy + 0.08, 0, 0.026, 1, 1, 1, 'm');
  } else {
    k.put(new THREE.SphereGeometry(0.104, 16, 12), hairC, hx - 0.03, hy + 0.03, 0, 0, 0, 0, 0.95, 1.08, 0.9);
    k.put(new THREE.SphereGeometry(0.1, 14, 10), hairC, hx - 0.01, hy + 0.1, 0, 0, 0, -0.35, 1.05, 0.7, 0.95);
    k.put(new THREE.SphereGeometry(0.07, 12, 8), hairC, hx - 0.085, hy - 0.07, 0, 0, 0, 0, 0.7, 1.3, 1.05);
    k.box(trim, hx + 0.092, hy + 0.022, 0, 0.02, 0.03, 0.17, 0, 0, 0, 'g');
  }
  // instruments
  const sh = [[0.01, 1.41, -0.2], [0.01, 1.41, 0.2]];
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
  const cuff = march ? WHITE : jazz ? (lead ? WHITE : '#f4f0e6') : carn ? trim : null;
  if (!['bass'].includes(type)) { arm(k, armc, sh[0], hands[0], null, cuff); arm(k, armc, sh[1], hands[1], null, cuff); }
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

/* ---------- time of day: keyframes by hour (4.5 .. 28.5 wraps); each band keeps its own light at its home hour ---------- */
const DAY = [
  // hour, sky top, horizon, hemi sky, hemi ground, hemi i, sun colour, sun i, elevation deg, night
  [4.5, '#0a0f2a', '#27305e', '#5a6ab0', '#1a1a2a', 0.82, '#a8c0ff', 1.1, 34, 1],
  [5.4, '#1d2452', '#6a5a8a', '#7a78c8', '#2a2436', 0.75, '#ff9a6a', 0.35, 2, 0.7],
  [6.4, '#5d6fb0', '#ffb98f', '#cfc8ee', '#5c4a44', 1.0, '#ffa877', 1.6, 6, 0.25],
  [8.6, '#7ec3e6', '#fde9cf', '#e0f0ff', '#8a6c4c', 1.45, '#ffe8c8', 2.8, 30, 0],
  [12.5, '#35bfe0', '#fff1b8', '#eafcff', '#b6955e', 1.8, '#fff7da', 3.3, 63, 0],
  [15, '#8fcfc6', '#f7e7c4', '#e4f3ff', '#8a6c4c', 1.5, '#fff0d2', 3.0, 45, 0],
  [18.3, '#4a4f86', '#f4a877', '#a9a2ff', '#6a4038', 1.15, '#ffb27a', 2.8, 15, 0.1],
  [19.4, '#262b62', '#c0687a', '#8a82d0', '#3a2830', 0.9, '#ff8a6a', 1.1, 3, 0.45],
  [20.2, '#121842', '#4a3e72', '#6a70b8', '#221e30', 0.72, '#b8b8ff', 0.35, 4, 0.8],
  [21.8, '#070b22', '#1c2552', '#5a6ab0', '#1a1a2a', 0.82, '#a8c0ff', 1.15, 36, 1],
  [28.5, '#0a0f2a', '#27305e', '#5a6ab0', '#1a1a2a', 0.82, '#a8c0ff', 1.1, 34, 1],
];
const HOME = { march: 15, jazz: 18.3, carnival: 12.5 }, DAYH = 24 / 300;
const hdist = (a, b) => { const d = Math.abs(a - b) % 24; return Math.min(d, 24 - d); };
function moonTex() {
  return ctex(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 20, 64, 64, 64); gr.addColorStop(0, 'rgba(236,242,255,1)'); gr.addColorStop(0.5, 'rgba(226,234,255,1)'); gr.addColorStop(0.56, 'rgba(200,214,255,.28)'); gr.addColorStop(1, 'rgba(200,214,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    g.fillStyle = 'rgba(150,160,190,.35)'; for (const [x, y, r] of [[52, 50, 7], [74, 66, 9], [58, 78, 5], [78, 46, 4]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  });
}

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
  // a head with a skull, jaw, nose, ears and neck (skin comes from the instance colour)
  const headG = (() => { const k = new Kit();
    k.put(new THREE.SphereGeometry(0.1, 20, 14), '#fff', 0, 0, 0, 0, 0, 0, 0.95, 1.16, 0.86);
    k.put(new THREE.SphereGeometry(0.07, 16, 10), '#fff', 0.03, -0.055, 0, 0, 0, 0, 0.95, 0.85, 0.92);
    k.cone('#fff', 0.105, -0.005, 0, 0.019, 0.05, 0, 0, -PI / 2, 'b', 8);
    for (const sd of [-1, 1]) k.put(new THREE.SphereGeometry(0.028, 8, 6), '#fff', -0.005, -0.005, sd * 0.086, 0, 0, 0, 0.45, 1, 0.3);
    k.cyl('#fff', -0.005, -0.14, 0, 0.045, 0.05, 0.12, 0, 0, 0, 'b', 12);
    return k.build().b; })();
  const lathe = (pts, seg, extra) => { const k = new Kit(); k.lathe('#fff', pts, 0, 0, 0, 1, 1, 1, seg); if (extra) extra(k); return k.build().b; };
  const thighG = lathe([[0.001, 0], [0.08, -0.01], [0.083, -0.08], [0.072, -0.24], [0.058, -0.4], [0.05, -0.46], [0.001, -0.47]], 14);
  const shinG = lathe([[0.001, 0.01], [0.052, 0], [0.058, -0.1], [0.052, -0.2], [0.04, -0.34], [0.036, -0.4], [0.001, -0.41]], 14, k => {
    k.sph('#fff', 0.006, 0, 0, 0.052);
    k.put(new THREE.SphereGeometry(0.06, 14, 8), '#1a1a1a', 0.055, -0.43, 0, 0, 0, 0, 2.2, 0.75, 0.9);
    k.box('#141414', -0.04, -0.465, 0, 0.1, 0.02, 0.1); });
  const handG = (() => { const k = new Kit(); k.put(new THREE.SphereGeometry(0.037, 12, 8), '#fff', 0, 0, 0, 0, 0, 0, 1.15, 0.95, 0.8); k.put(new THREE.SphereGeometry(0.015, 8, 6), '#fff', 0.02, 0.026, 0, 0, 0, 0, 1.6, 1, 1); return k.build().b; })();
  const MAXM = 32;
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
  const poolM = new THREE.MeshBasicMaterial({ color: '#ffc877', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }), LPOOL = new THREE.InstancedMesh(new THREE.CircleGeometry(1.25, 28).rotateX(-PI / 2), poolM, NB); LPOOL.frustumCulled = false; LPOOL.count = 0; LPOOL.renderOrder = 1; world.add(LPOOL);
  const flagG = new THREE.BufferGeometry(); flagG.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-0.17, 0, 0, 0.17, 0, 0, 0, -0.32, 0]), 3)); flagG.computeVertexNormals();
  const flagM = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.8 }), FLAG = winst(flagG, flagM, NB * 14);
  const crowdM = new THREE.MeshStandardMaterial({ roughness: 0.8 });
  // the crowd: whole people from instanced parts (feet at y=0, facing +X, 1.72 m tall at scale 1)
  const crowdV = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }), skinV = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7 });
  const NC = NB * CPB, cg = fn => { const k = new Kit(); fn(k); return k.build().b; };
  const LEGS = winst(cg(k => {
    for (const sd of [-1, 1]) { k.lathe('#fff', [[0.001, 0.065], [0.03, 0.07], [0.036, 0.1], [0.048, 0.22], [0.056, 0.4], [0.052, 0.47], [0.068, 0.6], [0.082, 0.78], [0.085, 0.89], [0.001, 0.9]], 0, 0, sd * 0.085, 1, 1, 1, 6); k.put(new THREE.SphereGeometry(0.05, 7, 5), '#2c2622', 0.045, 0.045, sd * 0.085, 0, 0, 0, 2.1, 0.9, 1); }
    k.lathe('#fff', [[0.001, 0.83], [0.14, 0.84], [0.165, 0.9], [0.15, 0.97], [0.001, 0.98]], 0, 0, 0, 0.75, 1, 1.1, 8); }), crowdV, NC, true);
  const TORSOC = winst(cg(k => { k.lathe('#fff', [[0.001, 0.93], [0.155, 0.93], [0.15, 1.02], [0.152, 1.12], [0.17, 1.24], [0.185, 1.33], [0.17, 1.41], [0.11, 1.46], [0.045, 1.49], [0.001, 1.49]], 0, 0, 0, 0.72, 1, 1.08, 8); for (const sd of [-1, 1]) k.put(new THREE.SphereGeometry(0.058, 7, 5), '#fff', 0, 1.395, sd * 0.19); }), crowdV, NC, true);
  const ARMC = winst(cg(k => k.lathe('#fff', [[0.001, -0.54], [0.028, -0.53], [0.034, -0.44], [0.036, -0.3], [0.04, -0.26], [0.046, -0.1], [0.05, 0], [0.001, 0.02]], 0, 0, 0, 1, 1, 1, 5)), crowdV, NC * 2);
  const HANDC = winst(new THREE.SphereGeometry(0.036, 6, 5).scale(1.1, 1.2, 0.8), SKIN, NC * 2);
  const HEADC = winst(cg(k => {
    k.cyl('#fff', 0.005, 1.5, 0, 0.044, 0.05, 0.12, 0, 0, 0, 'b', 6);
    k.put(new THREE.SphereGeometry(0.1, 9, 7), '#fff', 0.01, 1.625, 0, 0, 0, 0, 0.95, 1.15, 0.86);
    k.put(new THREE.SphereGeometry(0.068, 7, 5), '#fff', 0.04, 1.57, 0, 0, 0, 0, 0.95, 0.85, 0.9);
    k.cone('#fff', 0.11, 1.615, 0, 0.016, 0.04, 0, 0, -PI / 2, 'b', 4);
    for (const sd of [-1, 1]) k.put(new THREE.SphereGeometry(0.011, 4, 3), '#1d1614', 0.095, 1.642, sd * 0.032); }), skinV, NC);
  const hairG = long => cg(k => { k.put(new THREE.SphereGeometry(0.104, 9, 6), '#fff', -0.012, 1.645, 0, 0, 0, 0, 1, 1.08, 0.95); if (long) k.put(new THREE.SphereGeometry(0.1, 8, 6), '#fff', -0.055, 1.52, 0, 0, 0, 0, 0.55, 1.55, 1.02); });
  const HAIRS = winst(hairG(false), crowdV, NC), HAIRL = winst(hairG(true), crowdV, NC);
  const CAP = winst(cg(k => { k.put(new THREE.SphereGeometry(0.108, 10, 5, 0, PI * 2, 0, PI / 2), '#fff', -0.005, 1.668, 0, 0, 0, 0, 1.06, 0.55, 0.98); k.put(new THREE.CylinderGeometry(0.075, 0.075, 0.012, 10), '#fff', 0.085, 1.672, 0, 0, 0, -0.12, 1, 1, 1.2); }), crowdV, NC);
  const PANTS = ['#2b3a55', '#3b3b3b', '#5a4632', '#1f2a3a', '#6b6f78', '#caa77a', '#2f3b2c'], HAIRC = ['#2a1d14', '#5a3a22', '#c9a063', '#1b1b1b', '#8c4a2f', '#b8b0a4', '#3b2a1e'], CAPC = ['#4a4038', '#2f3a2f', '#6b5a44', '#1f2430', '#8a6a4a', '#b8322a'];
  const PM = new THREE.Matrix4(), AM = new THREE.Matrix4(), T1 = new THREE.Matrix4(), T2 = new THREE.Matrix4(), ZERO = new THREE.Matrix4().makeScale(1e-4, 1e-4, 1e-4);
  // each person's colours, set per building slot; only people in view get packed into the instance buffers each frame
  const CCOL = Array.from({ length: NC }, () => ({ sh: new THREE.Color(), pa: new THREE.Color(), sk: new THREE.Color(), ha: new THREE.Color(), ca: new THREE.Color(), fl: new THREE.Color() }));
  const frus = new THREE.Frustum(), PV = new THREE.Matrix4(), BB = new THREE.Box3();
  const farM = new THREE.MeshBasicMaterial(), FAR = winst(box1, farM, NB);
  const XF = winst(flagG, flagM, NB * 12);
  const hfG = (() => { const k = new Kit(); k.cyl('#3a3a3a', 0, 0.2, 0, 0.008, 0.008, 0.4, 0, 0, 0, 'b', 5).box('#ffffff', 0.11, 0.33, 0, 0.2, 0.13, 0.006); return k.build().b; })();
  const hfM = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, side: THREE.DoubleSide }), HF = winst(hfG, hfM, NB * CPB);
  const cfM = new THREE.MeshBasicMaterial(), CF = winst(new THREE.PlaneGeometry(0.07, 0.045).rotateX(-PI / 2), cfM, NB * 40);
  // sky bits
  const sunM = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, fog: false }), sunD = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), sunM); sunD.renderOrder = -1; scene.add(sunD);
  const cloudM = new THREE.MeshBasicMaterial({ fog: false, transparent: true, opacity: 0.92 }), CLOUD = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), cloudM, 24); CLOUD.frustumCulled = false; scene.add(CLOUD);
  const starG = new THREE.BufferGeometry(), sp = new Float32Array(600); for (let i = 0; i < 200; i++) { sp[i * 3] = (hsh(i) - 0.5) * 400; sp[i * 3 + 1] = 14 + hsh(i + 0.5) * 70; sp[i * 3 + 2] = -110 - hsh(i + 0.7) * 20; }
  starG.setAttribute('position', new THREE.BufferAttribute(sp, 3)); const STARS = new THREE.Points(starG, new THREE.PointsMaterial({ color: '#fff4e0', size: 1.4, sizeAttenuation: false, fog: false })); scene.add(STARS);
  // fireworks: a night show over the rooftops. A shell goes up on a beat and bursts two beats later, on the beat;
  // particles live in world coordinates (x + scroll) so the band marches past them. One Points draw call + a flash light.
  const FWN = 2400, fwP = new Float32Array(FWN * 3), fwV = new Float32Array(FWN * 3), fwC = new Float32Array(FWN * 3), fwK = new Float32Array(FWN * 3), fwL = new Float32Array(FWN), fwL0 = new Float32Array(FWN), fwT = new Uint8Array(FWN);
  const fwG = new THREE.BufferGeometry(), fwPA = new THREE.BufferAttribute(fwP, 3).setUsage(THREE.DynamicDrawUsage), fwCA = new THREE.BufferAttribute(fwC, 3).setUsage(THREE.DynamicDrawUsage);
  fwG.setAttribute('position', fwPA); fwG.setAttribute('color', fwCA); fwG.setDrawRange(0, 0);
  const fwDot = ctex(32, 32, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.22, 'rgba(255,255,255,.9)'); gr.addColorStop(0.5, 'rgba(255,255,255,.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
  const FW = new THREE.Points(fwG, new THREE.PointsMaterial({ size: 1.6, map: fwDot, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  FW.frustumCulled = false; FW.renderOrder = 2; FW.visible = false; scene.add(FW);
  const fwHemi = new THREE.HemisphereLight('#000000', '#000000', 0); scene.add(fwHemi);
  const fwPal = a => a.map(q => q.map(c => new THREE.Color(c)));
  const FWPC = fwPal([['#ff4a3d', '#ffd84a'], ['#44b8ff', '#ffffff'], ['#5cff86', '#fff07a'], ['#ff6ad8', '#9a7bff'], ['#ffb347', '#ff5a1f'], ['#ffffff', '#a8ecff']]);
  const FWNC = fwPal([['#ff2fd6', '#27f3ff'], ['#27f3ff', '#b84dff'], ['#ffb3f0', '#ff2fd6'], ['#b84dff', '#ffffff']]);
  const FWGOLD = new THREE.Color('#ffc45a'), FWH1 = new THREE.Color('#ff4f8b'), FWH2 = new THREE.Color('#ffc9dc'), FWEMB = new THREE.Color('#ffb070');
  const FWDRAG = [3.2, 1.55, 2.3, 1.55, 1.7], FWGRAV = [1.2, 2.4, 3.4, 2.4, 1.6];   // per type: 0 ember, 1 spark, 2 willow, 3 glitter, 4 heart
  const SHELLS = []; let fwOn = false, fwB0 = 0, fwLast = -1, fwCam = 0, fwFlash = 0, fwI = 0, fwHi = 0, fwAlive = 0, fwAx = 0, fwAz = 0, fwPx = 1, fwPz = 0, fwSp = 14, curYa = 0, curBeat = 0, fwU = 0, fwShows = 0, fwYo = 0;
  function fwSpark(x, y, z, vx, vy, vz, col, life, type) {
    const i = fwI, k = i * 3; fwI = (fwI + 1) % FWN;
    fwP[k] = x; fwP[k + 1] = y; fwP[k + 2] = z; fwV[k] = vx; fwV[k + 1] = vy; fwV[k + 2] = vz;
    fwK[k] = col.r; fwK[k + 1] = col.g; fwK[k + 2] = col.b; fwL[i] = fwL0[i] = life; fwT[i] = type; if (i >= fwHi) fwHi = i + 1;
  }
  function fwLaunch(sx, kind, big) {
    const P = S.neon ? FWNC : FWPC, pal = P[Math.floor(Math.random() * P.length)];
    const x = fwAx + fwPx * sx * fwSp + (Math.random() - 0.5) * 2.5 + fwU, z = fwAz + fwPz * sx * fwSp + (Math.random() - 0.5) * 4;
    SHELLS.push({ x, z, y: 8, y0: 8, y1: 17.5 + fwYo + Math.random() * 4 + (big ? 2 : 0) - (kind === 4 ? 2 : 0), t: 0, d: Math.max(0.45, 120 / (st.bpm || 100)), kind, pal, big });
    if (A.sfx) A.sfx(big ? 'whistle' : 'launch', 1);
  }
  function fwBurst(s) {
    const kind = s.kind, big = s.big, n = kind === 2 ? (big ? 130 : 95) : kind === 4 || kind === 1 ? 110 : big ? 210 : 150, sp = (big ? 18 : 14.5) * (kind === 2 ? 1.2 : 1) * (0.9 + Math.random() * 0.2);
    const c1 = kind === 2 ? FWGOLD : kind === 4 ? FWH1 : s.pal[0], c2 = kind === 4 ? FWH2 : s.pal[1], tA = Math.random() * PI, tB = 0.35 + Math.random() * 0.8;
    for (let i = 0; i < n; i++) {
      let dx, dy, dz, v = sp;
      if (kind === 1) {        // ring, tilted
        const a = i / n * 2 * PI, cx = Math.cos(a), cy = Math.sin(a), y1 = cy * Math.cos(tB), z1 = cy * Math.sin(tB);
        dx = cx * Math.cos(tA) - z1 * Math.sin(tA); dz = cx * Math.sin(tA) + z1 * Math.cos(tA); dy = y1;
      } else if (kind === 4) { // heart, facing the street
        const a = i / n * 2 * PI, hx = 16 * Math.pow(Math.sin(a), 3) / 17, hy = (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17;
        dx = fwPx * hx; dz = fwPz * hx; dy = hy + 0.15; v = sp * 0.95;
      } else {                 // peony / willow / glitter: a sphere
        const u1 = Math.random() * 2 - 1, a = Math.random() * 2 * PI, r = Math.sqrt(1 - u1 * u1); dx = r * Math.cos(a); dy = u1; dz = r * Math.sin(a); v = sp * (0.82 + Math.random() * 0.18);
      }
      const col = kind === 2 ? c1 : kind === 4 ? (i % 4 ? c1 : c2) : i % 3 === 0 ? c2 : c1, life = kind === 2 ? 2.6 + Math.random() * 0.8 : 1.5 + Math.random() * 0.7;
      fwSpark(s.x, s.y, s.z, dx * v, dy * v, dz * v, col, life, kind === 0 ? 1 : kind);
    }
    fwFlash = Math.min(2.2, fwFlash + (big ? 1.5 : 1)); fwHemi.color.copy(c1);
    if (A.sfx) A.sfx(kind === 3 || kind === 2 ? 'crackle' : 'boom', big ? 1.4 : 1);
  }
  // the show: 8 bars, from a slow opening to a finale
  function fwScript(b) {
    if (b < 8) { if (!(b & 1)) fwLaunch([0, -0.6, 0.6, 0][b >> 1], [0, 1, 0, 3][b >> 1], false); }
    else if (b < 16) fwLaunch(b & 1 ? 0.7 : -0.7, [0, 1, 0, 3][b & 3], false);
    else if (b < 24) { if (!(b & 1)) { fwLaunch(-0.5, b & 2 ? 1 : 0, false); fwLaunch(0.5, b & 2 ? 0 : 3, false); if (b === 22) fwLaunch(0, 2, true); } }
    else if (b < 28) { if (b === 24 || b === 26) fwLaunch(0, 4, b === 24); else fwLaunch(b & 1 ? 0.75 : -0.75, 0, false); }
    else if (b < 31) { fwLaunch(-0.8, 3, false); fwLaunch(0, b & 1 ? 1 : 0, true); fwLaunch(0.8, 3, false); }
    else if (b === 31) { fwLaunch(0, 2, true); fwLaunch(-0.6, 2, true); fwLaunch(0.6, 2, true); fwLaunch(-0.3, 3, false); fwLaunch(0.3, 3, false); }
  }
  function fwReady() { return fwOn ? 2 : st.playing && (S.neon || night > 0.5) ? 1 : 0; }
  function fireworks() {
    if (fwReady() !== 1) return false;
    fwOn = true; fwShows++; fwB0 = Math.ceil(curBeat); fwLast = -1; fwYo = (cam.aspect < 1 ? 3 : 4) + (S.neon ? 4.5 : 0);
    const dx = -Math.sin(curYa), dz = -Math.cos(curYa);   // straight ahead of the camera, over the rooftops
    fwAx = camX - 0.2 + dx * 26; fwAz = -0.2 + dz * 26; fwPx = -dz; fwPz = dx; fwSp = 17 * Math.min(1, 0.15 + cam.aspect * 0.85);
    return true;
  }
  // tests: fast-forward the show (headless renders a frame a second)
  function fwSim(sec) { for (let i = 0, n = Math.round(sec * 30); i < n; i++) fwStep(1 / 30, curBeat + (st.bpm || 100) / 1800, fwU); camX = null; return fwAlive; }
  function fwStop() { fwOn = false; SHELLS.length = 0; fwL.fill(0); fwC.fill(0); fwHi = fwAlive = 0; fwFlash = 0; fwHemi.intensity = 0; FW.visible = false; }
  function fwStep(dt, beat, u) {
    curBeat = beat; fwU = u;
    if (fwOn) {
      if (!st.playing) fwOn = false;
      else {
        let b = Math.floor(beat) - fwB0; if (b < fwLast - 2) { fwB0 = Math.floor(beat) - fwLast - 1; b = fwLast + 1; }
        if (b - fwLast > 4) fwLast = b - 1;
        while (fwLast < b) { fwLast++; if (fwLast >= 0 && fwLast < 32) fwScript(fwLast); }
        if (b >= 36) fwOn = false;
      }
    }
    fwCam += ((fwOn ? 1 : 0) - fwCam) * Math.min(1, dt * 1.3);
    for (let i = SHELLS.length - 1; i >= 0; i--) {
      const s = SHELLS[i]; s.t += dt; const f = Math.min(1, s.t / s.d); s.y = s.y0 + (s.y1 - s.y0) * (1 - (1 - f) * (1 - f));
      fwSpark(s.x + (Math.random() - 0.5) * 0.12, s.y, s.z, (Math.random() - 0.5) * 0.4, -0.6, (Math.random() - 0.5) * 0.4, FWEMB, 0.4 + Math.random() * 0.2, 0);
      if (f >= 1) { fwBurst(s); SHELLS.splice(i, 1); }
    }
    fwAlive = 0;
    if (fwHi) {
      for (let i = 0; i < fwHi; i++) {
        if (fwL[i] <= 0) continue;
        const k = i * 3, t = fwT[i]; fwL[i] -= dt;
        if (fwL[i] <= 0) { fwC[k] = fwC[k + 1] = fwC[k + 2] = 0; continue; }
        const dr = Math.exp(-dt * FWDRAG[t]); fwV[k] *= dr; fwV[k + 1] = fwV[k + 1] * dr - FWGRAV[t] * dt; fwV[k + 2] *= dr;
        fwP[k] += fwV[k] * dt; fwP[k + 1] += fwV[k + 1] * dt; fwP[k + 2] += fwV[k + 2] * dt;
        const lf = fwL[i] / fwL0[i]; let a = t === 2 ? lf : lf * lf * (t === 0 ? 0.7 : 1.35);
        if (t === 3 && lf < 0.65) a *= Math.random() < 0.45 ? 2.2 : 0.08;
        fwC[k] = fwK[k] * a; fwC[k + 1] = fwK[k + 1] * a; fwC[k + 2] = fwK[k + 2] * a; fwAlive++;
      }
      if (!fwAlive && !SHELLS.length) fwHi = 0;
      fwPA.needsUpdate = fwCA.needsUpdate = true; fwG.setDrawRange(0, fwHi);
    }
    FW.visible = fwHi > 0; FW.position.x = -u;
    fwFlash *= Math.exp(-dt * 4.5); fwHemi.intensity = fwFlash < 0.01 ? 0 : fwFlash * (S.neon ? 0.9 : 1.2);
  }
  // solo spotlight
  const spotM = new THREE.MeshBasicMaterial({ color: '#fff3c8', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 1.25, 7, 28, 1, true), spotM); cone.position.y = 3.5;
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1.25, 28), spotM.clone()); pool.rotation.x = -PI / 2; pool.position.y = 0.03;
  const spot = new THREE.Group(); spot.add(cone, pool); scene.add(spot);

  let sty = null, S = null, base = null, envT = null;
  const pm = new THREE.PMREMGenerator(R);
  function applyStyle() {
    sty = st.style; S = A.STY[sty]; const Lt = LIGHT[sty], neon = !!S.neon;
    fwStop();
    if (scene.background && scene.background !== dayT) scene.background.dispose(); scene.background = neon ? skyTex(S) : dayT;
    tod = neon ? null : HOME[sty]; skyH = envH = -99; poolM.opacity = 0; winM.color.set('#ffffff'); METAL.envMapIntensity = 1.2;
    scene.fog = new THREE.Fog(C(S.sky[1]), Lt.fog[0], Lt.fog[1]);
    hemi.color.set(Lt.hemi[0]); hemi.groundColor.set(Lt.hemi[1]); hemi.userData.i = Lt.hemi[2];
    sun.color.set(Lt.sun[0]); sun.userData.i = Lt.sun[1]; sun.userData.off = Lt.sun[2];
    for (const m of [roadM, paveM, pave2M]) { if (m.map) m.map.dispose(); }
    roadM.map = roadTex(sty); roadM.map.repeat.set(240 / 3, 6.6 / 3); roadM.emissiveMap = neon ? roadM.map : null; roadM.emissive.set(neon ? '#ffffff' : '#000000'); roadM.emissiveIntensity = neon ? 0.55 : 0; roadM.needsUpdate = true;
    paveM.map = paveTex(sty); paveM.map.repeat.set(240 / 1.5, 2.9 / 1.5); pave2M.map = paveM.map.clone(); pave2M.map.repeat.set(240 / 1.5, 12 / 1.5); pave2M.map.needsUpdate = true; paveM.needsUpdate = pave2M.needsUpdate = true;
    curbM.color.set(neon ? '#3a2a66' : '#b3aa9c');
    if (signM.map) signM.map.dispose(); signM.map = signTex(S, sty); signM.needsUpdate = true;
    lampM.color.set(neon ? '#ff9fe8' : sty === 'jazz' ? '#ffd88a' : '#fff4d6'); lampB.copy(lampM.color);
    farM.color.set(Lt.farc);
    if (sunT) sunT.dispose(); sunM.map = sunT = sunTex(S, neon); sunM.color.set('#ffffff'); sunM.needsUpdate = true;
    cfM.color.set(neon ? '#ffffff' : '#f4f0e6'); cloudM.color.set(sty === 'jazz' ? '#ffd2c4' : '#ffffff'); cloudM.opacity = 0.92; CLOUD.visible = !neon; STARS.visible = neon || sty === 'jazz'; STARS.material.opacity = neon ? 1 : 0.5; STARS.material.transparent = !neon;
    if (neon) mkEnv(C(S.sky[0]), C(S.sky[1]), C(Lt.sun[0]).clone().multiplyScalar(3), Lt.sun[2]);
    base = null; recs.forEach(r => r.key = ''); yaw = pitch = 0; zoom = 1;
  }
  // env map for the brass: a sky gradient with a bright sun blob
  function mkEnv(top, hor, sc, dir) {
    const es = new THREE.Scene(); es.background = null;
    const sg = new THREE.SphereGeometry(10, 24, 12), cols = new Float32Array(sg.attributes.position.count * 3), gnd = C(ROAD[sty][1]);
    for (let i = 0; i < sg.attributes.position.count; i++) { const y = sg.attributes.position.getY(i) / 10; _c.copy(y > 0 ? hor : gnd).lerp(y > 0 ? top : gnd, Math.min(1, Math.abs(y) * 1.6)); cols[i * 3] = _c.r; cols[i * 3 + 1] = _c.g; cols[i * 3 + 2] = _c.b; }
    sg.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    es.add(new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
    const sb = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 8), new THREE.MeshBasicMaterial({ color: sc })); sb.position.set(dir[0], dir[1], dir[2]).normalize().multiplyScalar(8); es.add(sb);
    if (envT) envT.dispose(); envT = pm.fromScene(es, 0.02).texture; METAL.envMap = envT; METAL.needsUpdate = true;
    es.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  }
  // the moving sun: sample the keyframes, lean toward the band's own look near its home hour
  const DK = { top: new THREE.Color(), hor: new THREE.Color(), hs: new THREE.Color(), hg: new THREE.Color(), sc: new THREE.Color() }, WHITE3 = new THREE.Color('#ffffff'), NIGHTF = new THREE.Color('#10152e'), WINN = new THREE.Color('#ffc86e').multiplyScalar(1.35), SUNE = new THREE.Color();
  const dayC = document.createElement('canvas'); dayC.width = 4; dayC.height = 256; const dayT = new THREE.CanvasTexture(dayC); dayT.colorSpace = THREE.SRGBColorSpace;
  const moonT = moonTex(), lampB = new THREE.Color(), WINB = new Float32Array(NB * 16 * 3), WTH = new Float32Array(NB * 16), WDK = new THREE.Color('#f0b55a').multiplyScalar(1.2), _w = new THREE.Color();
  // at dusk the windows go dark with the sky, then switch on one by one (every lit-type window, ~45 % of the dark ones)
  function winPaint(force) {
    if (!force && Math.abs(night - winN) < 0.008) return; winN = night;
    for (let k = 0; k < WIN.count; k++) {
      const r = WINB[k * 3], g = WINB[k * 3 + 1], bb = WINB[k * 3 + 2], lit = r + g + bb > 1.2, th = WTH[k], f = 1 - 0.75 * night;
      _w.setRGB(r * f, g * f, bb * f);
      if (lit || th < 0.45) { const on = Math.min(1, Math.max(0, (night - 0.15 - th * 0.6) / 0.06)); if (on > 0) _w.lerp(lit ? _c.setRGB(WINN.r * Math.max(r, 0.9), WINN.g * Math.max(g, 0.8), WINN.b * Math.max(bb, 0.6)) : WDK, on); }
      WIN.setColorAt(k, _w);
    }
    WIN.instanceColor.needsUpdate = true;
  }
  let tod = null, skyH = -99, envH = -99, sunT = null, night = 0, dayOn = true, winN = -1;
  function applyDay(h) {
    let i = 0; while (i < DAY.length - 2 && DAY[i + 1][0] <= h) i++;
    const a = DAY[i], b = DAY[i + 1], t0 = Math.min(1, Math.max(0, (h - a[0]) / (b[0] - a[0]))), t = t0 * t0 * (3 - 2 * t0), Lt = LIGHT[sty];
    DK.top.copy(C(a[1])).lerp(C(b[1]), t); DK.hor.copy(C(a[2])).lerp(C(b[2]), t); DK.hs.copy(C(a[3])).lerp(C(b[3]), t); DK.hg.copy(C(a[4])).lerp(C(b[4]), t); DK.sc.copy(C(a[6])).lerp(C(b[6]), t);
    let hi = lerp(a[5], b[5], t), si = lerp(a[7], b[7], t); const el = lerp(a[8], b[8], t); night = lerp(a[9], b[9], t);
    const w = Math.max(0, 1 - hdist(h, HOME[sty]) / 2.2);
    if (w > 0) { DK.top.lerp(C(S.sky[0]), w); DK.hor.lerp(C(S.sky[1]), w); DK.hs.lerp(C(Lt.hemi[0]), w); DK.hg.lerp(C(Lt.hemi[1]), w); DK.sc.lerp(C(Lt.sun[0]), w); hi = lerp(hi, Lt.hemi[2], w); si = lerp(si, Lt.sun[1], w); }
    hemi.color.copy(DK.hs); hemi.groundColor.copy(DK.hg); hemi.userData.i = hi; sun.color.copy(DK.sc); sun.userData.i = si;
    // sun from dawn to dusk, then the moon; the light stays a little in front so faces keep some light
    dayOn = h >= 5.4 && h < 20.2;
    const ang = dayOn ? Math.max(-1.45, Math.min(1.45, (h - 12.7) / 6.5 * 1.35)) : ((h < 5.4 ? h + 24 : h) - 25) / 4.8 * 0.9, e = Math.max(2, el) * PI / 180;
    sun.userData.off = [Math.sin(ang) * 16 * Math.cos(e), Math.max(1.6, Math.sin(e) * 16), 6 + 3 * Math.cos(ang)];
    sun.userData.disc = [Math.sin(ang) * 55 - 10, 3 + el * 0.55, -80];
    const mp = dayOn ? sunT : moonT; if (sunM.map !== mp) { sunM.map = mp; sunM.needsUpdate = true; }
    if (dayOn) sunM.color.copy(DK.sc).lerp(WHITE3, 0.55); else sunM.color.set('#ffffff');
    scene.fog.color.copy(DK.hor);
    if (Math.abs(h - skyH) > 0.03) {
      skyH = h; const g = dayC.getContext('2d'), gr = g.createLinearGradient(0, 0, 0, 256);
      gr.addColorStop(0, '#' + DK.top.getHexString()); gr.addColorStop(0.62, '#' + DK.hor.getHexString()); gr.addColorStop(1, '#' + DK.hor.getHexString()); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); dayT.needsUpdate = true;
    }
    if (hdist(h, envH) > 1.5) { envH = h; const o = sun.userData.off; mkEnv(DK.top, DK.hor, SUNE.copy(DK.sc).multiplyScalar(dayOn ? 6 : 2), o); }
    METAL.envMapIntensity = 1.2 * (1 - 0.55 * night);
    winPaint(false); lampM.color.copy(lampB).multiplyScalar(1 + 0.9 * night); poolM.opacity = 0.42 * Math.max(0, night - 0.15) / 0.85;
    farM.color.set(Lt.farc).lerp(NIGHTF, night * 0.8);
    cloudM.color.copy(WHITE3).lerp(DK.hor, 0.35).multiplyScalar(1 - 0.72 * night); cloudM.opacity = 0.92 - 0.4 * night;
    const so = Math.max(night, sty === 'jazz' ? 0.5 * w : 0); STARS.visible = so > 0.04; STARS.material.opacity = Math.min(1, so); STARS.material.transparent = true;
  }

  function setWorld(b) {
    base = b; const n = st.style, neon = !!S.neon;
    let nb = 0, nc = 0, nf = 0, nw = 0, nd = 0, np = 0, nl = 0, nfl = 0, nfar = 0, nxf = 0, ncf = 0;
    const put = (mesh, i, x, y, z, sx, sy, sz, col, rx) => { _o.position.set(x, y, z); _o.rotation.set(rx || 0, 0, 0); _o.scale.set(sx, sy, sz); _o.updateMatrix(); mesh.setMatrixAt(i, _o.matrix); if (col && mesh.instanceColor) mesh.setColorAt(i, _c.set(col)); };
    for (let s = 0; s < NB; s++) {
      const i = b + s - (NB >> 1), x = (s - (NB >> 1)) * BW + BW / 2, h = (6.4 + hsh(i) * 5.8) * (neon ? 1.25 : 1), bc = S.bld[Math.floor(hsh(i + 0.3) * S.bld.length)];
      put(BLD, nb++, x, 0, -9.2, BW - 0.06, h, 6, bc);
      _c.set(bc).multiplyScalar(0.72); const dk = '#' + _c.getHexString();
      put(CORN, nc++, x, h - 0.32, -6.15, BW + 0.12, 0.34, 0.5, dk); put(CORN, nc++, x, 3.28, -6.15, BW, 0.16, 0.3, dk);
      for (let y = 3.9, fl = 0; y + 1.5 < h - 0.4; y += 2.3, fl++) for (let c = -1; c <= 1; c++) {
        const wx = x + c * 1.35, wc = S.win[Math.floor(hsh(i * 7 + fl * 3 + c + 0.2) * S.win.length)];
        put(FRAME, nf++, wx, y + 0.72, -6.19, 0.98, 1.56, 0.08, neon ? '#0c0820' : '#f1e8d6');
        put(WIN, nw++, wx, y + 0.72, -6.14, 0.82, 1.36, 1, wc); WINB[nw * 3 - 3] = _c.r; WINB[nw * 3 - 2] = _c.g; WINB[nw * 3 - 1] = _c.b; WTH[nw - 1] = hsh(i * 13 + fl * 5 + c * 7 + 0.37);
        if (!neon && hsh(i * 11 + fl + c * 3) > 0.72) put(FRAME, nf++, wx, y + 0.02, -6.02, 0.95, 0.14, 0.34, '#6b4a2e');
      }
      put(DOOR, nd++, x - 1.3, 0.16, -6.17, 0.95, 2.1, 0.08, neon ? '#120c26' : '#4a3222');
      put(DOOR, nd++, x + 0.6, 0.62, -6.17, 2.2, 1.55, 0.06, neon ? '#2a1850' : '#2b3550');
      put(AWN, s, x + 0.2, 2.42, -5.75, 3.4, 0.07, 1.1, S.bunt[Math.floor(hsh(i + 0.6) * S.bunt.length)], 0.34);
      put(SIGN, s, x + 0.2, 2.95, -6.1, 2.6, 0.62, 1); aSign.setX(s, 9 - (((i % 10) + 10) % 10));
      if ((i & 1) === 0) {
        put(POST, np++, x - BW / 2, 0.16, -3.75, 1, 3.55, 1, neon ? '#2a2050' : '#23262e'); put(LPOOL, nl, x - BW / 2, 0.166, -4.7, 1.5, 1, 1); put(LAMP, nl++, x - BW / 2, 3.78, -3.75, 1, 1.1, 1, '#ffffff');
        for (let f = 0; f < 13; f++) { const t = (f + 0.5) / 13, fx = x - BW / 2 + t * BW * 2, fy = 3.45 - Math.sin(t * PI) * 0.75; put(FLAG, nfl++, fx, fy, -3.75, 1, 1, 1, S.bunt[(f + i) % S.bunt.length]); }
      }
      if ((i & 1) === 0) { const x0 = x - BW / 2 + 1.1; for (let f = 0; f < 12; f++) { const t = (f + 0.5) / 12, fz = lerp(-6.1, 8, t), fy = 6.1 - Math.sin(t * PI) * 1.25; _o.position.set(x0, fy, fz); _o.rotation.set(0, PI / 2, 0); _o.scale.set(1.1, 1.1, 1.1); _o.updateMatrix(); XF.setMatrixAt(nxf, _o.matrix); XF.setColorAt(nxf++, _c.set(S.bunt[(f + i * 3) % S.bunt.length])); } }
      for (let q = 0; q < 40; q++) { const qi = i * 40 + q; _o.position.set(x + (hsh(qi + 0.11) - 0.5) * BW, 0.012, -3.1 + hsh(qi + 0.27) * 6.2); _o.rotation.set(0, hsh(qi + 0.5) * PI, 0); _o.scale.setScalar(0.8 + hsh(qi + 0.7) * 0.6); _o.updateMatrix(); CF.setMatrixAt(ncf, _o.matrix); CF.setColorAt(ncf++, _c.set(A.CROWD[qi % A.CROWD.length])); }
      put(FAR, nfar++, x * 1.9, 0, -34 - hsh(i + 0.1) * 8, BW * 1.6, (14 + hsh(i + 0.4) * 22) * (neon ? 1.3 : 1), 6, Lt().farc);
      for (let c = 0; c < CPB; c++) {
        const j = s * CPB + c, pj = i * CPB + c, cc = A.CROWD[Math.floor(hsh(pj + 0.3) * A.CROWD.length)];
        const q = CCOL[j]; q.sh.set(cc); q.fl.set(S.bunt[Math.floor(hsh(pj + 0.45) * S.bunt.length)]); q.pa.set(PANTS[Math.floor(hsh(pj + 0.52) * PANTS.length)]);
        q.sk.set(A.SKIN[Math.floor(hsh(pj + 0.8) * A.SKIN.length)]); q.ha.set(HAIRC[Math.floor(hsh(pj + 0.57) * HAIRC.length)]); q.ca.set(CAPC[Math.floor(hsh(pj + 0.63) * CAPC.length)]);
      }
    }
    BLD.count = nb; CORN.count = nc; FRAME.count = nf; WIN.count = nw; DOOR.count = nd; AWN.count = NB; SIGN.count = NB; POST.count = np; LAMP.count = nl; LPOOL.count = nl; if (tod !== null) winPaint(true); FLAG.count = nfl; FAR.count = nfar;
    LEGS.count = TORSOC.count = HEADC.count = HAIRS.count = HAIRL.count = CAP.count = HF.count = NC; ARMC.count = HANDC.count = NC * 2; XF.count = nxf; CF.count = ncf;
    for (const m of [BLD, CORN, FRAME, WIN, DOOR, AWN, SIGN, POST, LAMP, FLAG, FAR, LEGS, TORSOC, ARMC, HANDC, HEADC, HAIRS, HAIRL, CAP, XF, HF, CF]) { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
    aSign.needsUpdate = true;
  }
  const Lt = () => LIGHT[sty];

  // second line: followers who step off the sidewalk and dance along behind a big band
  const NFOL = 9, FJ = new Float32Array(NFOL), FPM = Array.from({ length: NFOL }, () => new THREE.Matrix4()), FPH = new Float32Array(NFOL), FCL = new Array(NFOL); let nFol = 0;
  function crowd(p, now, exc, dt) {
    const beat = p / 4; let j = 0;
    PV.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); frus.setFromProjectionMatrix(PV);
    for (let s = 0; s < NB; s++) {
      const i = base + s - (NB >> 1), x0 = (s - (NB >> 1)) * BW + BW / 2, wx = x0 + world.position.x;
      BB.min.set(wx - BW / 2 - 1.4, 0, -5.4); BB.max.set(wx + BW / 2 + 0.6, 2.7, -3.4);
      if (!frus.intersectsBox(BB)) continue;
      for (let c = 0; c < CPB; c++) {
        const pj = i * CPB + c, h1 = hsh(pj + 0.1);
        if (h1 < 0.1) continue;
        const q = CCOL[s * CPB + c];
        TORSOC.setColorAt(j, q.sh); ARMC.setColorAt(j * 2, q.sh); ARMC.setColorAt(j * 2 + 1, q.sh); LEGS.setColorAt(j, q.pa); HF.setColorAt(j, q.fl);
        HEADC.setColorAt(j, q.sk); HANDC.setColorAt(j * 2, q.sk); HANDC.setColorAt(j * 2 + 1, q.sk); HAIRS.setColorAt(j, q.ha); HAIRL.setColorAt(j, q.ha); CAP.setColorAt(j, q.ca);
        const kid = hsh(pj + 0.9) < 0.12, hf = kid ? 0.6 + hsh(pj + 0.5) * 0.1 : 0.9 + hsh(pj + 0.5) * 0.16, row = c & 1;
        const x = x0 + (c - 2.5) * 0.72 + (h1 - 0.5) * 0.3, z = -4.05 - row * 0.8 - hsh(pj + 0.2) * 0.15;
        const hype = exc > hsh(pj + 0.6) * 0.9, on = st.playing && hype, jump = on ? Math.max(0, Math.sin((beat + hsh(pj) * 0.3) * PI * 2)) * 0.07 * exc : 0;
        _o.position.set(x, 0.16 + jump, z); _o.rotation.set(0, -PI / 2 + (hsh(pj + 0.66) - 0.5) * 0.6, 0); _o.scale.setScalar(hf); _o.updateMatrix(); PM.copy(_o.matrix);
        LEGS.setMatrixAt(j, PM); TORSOC.setMatrixAt(j, PM); HEADC.setMatrixAt(j, PM);
        const capOn = hsh(pj + 0.61) < 0.16, lng = !capOn && !kid && hsh(pj + 0.71) < 0.42;
        HAIRS.setMatrixAt(j, lng ? ZERO : PM); HAIRL.setMatrixAt(j, lng ? PM : ZERO); CAP.setMatrixAt(j, capOn ? PM : ZERO);
        const flag = hsh(pj + 0.33) > 0.62, clap = hsh(pj + 0.77) < 0.5;
        for (let a = 0; a < 2; a++) {
          const sd = a ? 1 : -1, fa = a && flag;
          T1.makeTranslation(0, 1.4, sd * 0.2); AM.multiplyMatrices(PM, T1);
          if (on && clap && !fa) { const kk = Math.max(0, Math.sin((beat * 2 + hsh(pj) * 0.2) * PI * 2)); T1.makeRotationX(sd * (0.36 + 0.17 * kk)); T2.makeRotationZ(0.8); T1.multiply(T2); }
          else if (on || fa) { T1.makeRotationX(-sd * ((fa ? (on ? 2.5 : 1.95) : 2.6) + (on ? Math.sin(now * 6 + pj + a) * 0.25 : 0))); }
          else { T1.makeRotationX(-sd * (0.07 + 0.03 * Math.sin(now * 0.8 + pj))); T2.makeRotationZ(0.05 * Math.sin(now * 0.6 + pj * 1.7)); T1.multiply(T2); }
          AM.multiply(T1); ARMC.setMatrixAt(j * 2 + a, AM);
          T1.makeTranslation(0, -0.575, 0); AM.multiply(T1); HANDC.setMatrixAt(j * 2 + a, AM);
          if (a) { if (fa) { T1.makeRotationX(PI + Math.sin(now * (on ? 5 : 1.5) + pj) * (on ? 0.4 : 0.15)); AM.multiply(T1); T1.makeRotationY(PI / 2); AM.multiply(T1); HF.setMatrixAt(j, AM); } else HF.setMatrixAt(j, ZERO); }
        }
        j++;
      }
    }
    let rx = 1e9; for (const m of A.alive()) rx = Math.min(rx, X(m)); if (rx > 1e8) rx = X(LEADER);
    const want = st.playing ? Math.round(Math.max(0, Math.min(1, (exc - 0.45) / 0.5)) * (sty === 'jazz' ? 9 : 6)) : 0;
    nFol = 0;
    for (let f = 0; f < NFOL; f++) {
      FJ[f] = f < want ? Math.min(1, FJ[f] + dt / 2.4) : Math.max(0, FJ[f] - dt / 1.6);
      if (FJ[f] <= 0 || j >= NC) continue;
      const e0 = FJ[f], e = e0 * e0 * (3 - 2 * e0), q = CCOL[(f * 17 + 5) % NC], pj = 900 + f * 7.3;
      const xt = rx - 1.35 - Math.floor(f / 3) * 0.95 - (f % 2) * 0.25, zt = ((f % 3) - 1) * 1.15 + (hsh(pj) - 0.5) * 0.3;
      const ph = beat * PI + f * 0.7, bob = Math.abs(Math.sin(ph)) * 0.06 * e, hf = 0.92 + hsh(pj + 0.5) * 0.14;
      _o.position.set(xt + (1 - e) * 0.8, (e < 0.3 ? 0.16 : 0) + bob, lerp(-4.2, zt, e)); _o.rotation.set(0, (1 - e) * -PI / 2 + Math.sin(ph * 0.5) * 0.25 * e, Math.sin(ph) * 0.05 * e); _o.scale.setScalar(hf); _o.updateMatrix();
      FPM[nFol].copy(_o.matrix); FPH[nFol] = ph; FCL[nFol] = q.pa; nFol++;
      T1.makeTranslation(-world.position.x, 0, 0); PM.multiplyMatrices(T1, _o.matrix);   // the crowd meshes live in the scrolling world group
      TORSOC.setColorAt(j, q.sh); ARMC.setColorAt(j * 2, q.sh); ARMC.setColorAt(j * 2 + 1, q.sh); LEGS.setColorAt(j, q.pa); HF.setColorAt(j, WHITE3);
      HEADC.setColorAt(j, q.sk); HANDC.setColorAt(j * 2, q.sk); HANDC.setColorAt(j * 2 + 1, q.sk); HAIRS.setColorAt(j, q.ha); HAIRL.setColorAt(j, q.ha); CAP.setColorAt(j, q.ca);
      LEGS.setMatrixAt(j, ZERO); TORSOC.setMatrixAt(j, PM); HEADC.setMatrixAt(j, PM);
      const capOn = hsh(pj + 0.61) < 0.2, lng = !capOn && hsh(pj + 0.71) < 0.45;
      HAIRS.setMatrixAt(j, lng ? ZERO : PM); HAIRL.setMatrixAt(j, lng ? PM : ZERO); CAP.setMatrixAt(j, capOn ? PM : ZERO);
      const hk = sty === 'jazz' && f % 2 === 0;
      for (let a = 0; a < 2; a++) {
        const sd = a ? 1 : -1, fa = a && hk, up = a || f % 3 !== 1 ? 2.3 : 0.5;
        T1.makeTranslation(0, 1.4, sd * 0.2); AM.multiplyMatrices(PM, T1);
        T1.makeRotationX(-sd * (0.08 + (up + Math.sin(now * 5 + pj + a * 1.3) * 0.3) * e)); AM.multiply(T1); ARMC.setMatrixAt(j * 2 + a, AM);
        T1.makeTranslation(0, -0.575, 0); AM.multiply(T1); HANDC.setMatrixAt(j * 2 + a, AM);
        if (a) { if (fa) { T1.makeRotationX(PI + Math.sin(now * 5 + pj) * 0.4); AM.multiply(T1); T1.makeRotationY(PI / 2); AM.multiply(T1); HF.setMatrixAt(j, AM); } else HF.setMatrixAt(j, ZERO); }
      }
      j++;
    }
    LEGS.count = TORSOC.count = HEADC.count = HAIRS.count = HAIRL.count = CAP.count = HF.count = j; ARMC.count = HANDC.count = j * 2;
    for (const M of [LEGS, TORSOC, ARMC, HANDC, HEADC, HAIRS, HAIRL, CAP, HF]) { M.instanceMatrix.needsUpdate = true; M.instanceColor.needsUpdate = true; }
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
  let camX = 0, camD = 12, yaw = 0, pitch = 0, zoom = 1, fps = [], lowQ = false, lastNow = 0;
  const mat4 = new THREE.Matrix4(), off = new THREE.Matrix4(), rz = new THREE.Matrix4();
  function X(m) { return (m.x - A.VW() / 2) * PX; }
  function Z(m) { return (m.y - (A.VH() - 58)) * RZ; }

  function render(p, now, exc) {
    if (st.style !== sty) applyStyle();
    const dt = Math.min(0.05, Math.max(0, now - lastNow)); lastNow = now;
    if (tod !== null) { if (st.playing) { tod += dt * DAYH; if (tod >= 28.5) tod -= 24; } applyDay(tod); }
    if (!lowQ && fps.length < 90) { fps.push(dt); if (fps.length === 90) { const av = fps.slice(20).reduce((a, b) => a + b, 0) / 70; if (av > 0.024) { lowQ = true; R.setPixelRatio(1); R.shadowMap.enabled = false; sun.castShadow = false; resize(); } } }
    const u = st.scroll * PX, b = Math.floor(u / BW); if (b !== base) setWorld(b);
    world.position.x = -(u - b * BW);
    // ground scroll
    roadM.map.offset.x = (u / 3) % 1; paveM.map.offset.x = (u / 1.5) % 1; pave2M.map.offset.x = (u / 1.5) % 1;
    crowd(p, now, exc, dt);
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
        off.makeTranslation(0, 0.94 + r.up.position.y * 0.5, L ? 0.085 : -0.085); rz.makeRotationZ(th); off.multiply(rz); _m.multiplyMatrices(mat4, off);
        THIGH.setMatrixAt(nl, _m); _m2.makeTranslation(0, -0.47, 0); rz.makeRotationZ(sh); _m2.multiply(rz); _m.multiply(_m2); SHIN.setMatrixAt(nl, _m);
        const lc = m.leader && sty === 'jazz' ? '#1b1b22' : S.legs[0]; THIGH.setColorAt(nl, _c.set(lc)); SHIN.setColorAt(nl, _c); nl++;
      }
    }
    recs.forEach((r, m) => { if (!seen.has(m)) { scene.remove(r.g); recs.delete(m); } });
    // followers' legs walk (they share the marchers' leg meshes)
    for (let f = 0; f < nFol && nl < MAXM * 2 - 1; f++) {
      const ph = FPH[f], cl = FCL[f];
      for (let L = 0; L < 2; L++) {
        const a = ph + L * PI, th = Math.sin(a) * 0.42, sh = -Math.max(0, Math.cos(a)) * 0.7;
        off.makeTranslation(0, 0.94, L ? 0.085 : -0.085); rz.makeRotationZ(th); off.multiply(rz); _m.multiplyMatrices(FPM[f], off);
        THIGH.setMatrixAt(nl, _m); _m2.makeTranslation(0, -0.47, 0); rz.makeRotationZ(sh); _m2.multiply(rz); _m.multiply(_m2); SHIN.setMatrixAt(nl, _m);
        THIGH.setColorAt(nl, cl); SHIN.setColorAt(nl, cl); nl++;
      }
    }
    if (nFol) mn = Math.min(mn, FPM[nFol - 1].elements[12] + 0.4);
    HEADS.count = nh; HANDS.count = nk; THIGH.count = SHIN.count = nl;
    for (const x of [HEADS, HANDS, THIGH, SHIN]) { x.instanceMatrix.needsUpdate = true; x.instanceColor.needsUpdate = true; }
    // spotlight + dimming
    const sa = st.spotA;
    if (sm && sa > 0.02) { spot.visible = true; spot.position.set(X(sm), 0, Z(sm)); spotM.opacity = 0.14 * sa; pool.material.opacity = 0.32 * sa; } else spot.visible = false;
    hemi.intensity = hemi.userData.i * (1 - 0.45 * sa); sun.intensity = sun.userData.i * (1 - 0.55 * sa);
    // camera: fit the band, 3/4 view from the near sidewalk
    if (mn > mx) { mn = mx = X(LEADER); }
    const PH = cam.aspect < 1, FOV0 = PH ? 46 : 36, fc = fwCam * fwCam * (3 - 2 * fwCam);   // fc: the camera tilts up to the sky for fireworks
    const y0 = cam.aspect < 1 ? 0.82 : 0.42, cx = (mn + mx) / 2, hw = ((mx - mn) / 2 + 1.5) * Math.cos(y0) + 1.2 * Math.sin(y0), vf = FOV0 * PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * cam.aspect);
    const want = Math.min(30, Math.max(cam.aspect < 1 ? 7.2 : 6, hw / Math.tan(hf / 2) * 0.98)) * zoom * (1 + (PH ? 0.15 : 1) * fc);
    const k = camX === null ? 1 : Math.min(1, dt * 2); camX += (cx - camX) * k; camD += (want - camD) * k;
    const ya = y0 + yaw, pa = 0.2 + pitch - (PH ? 0.3 : 0.4) * fc, tx = camX - 0.2, ty = 1.15 + Math.max(0, 1 - zoom) * 0.5 + (PH ? 3.2 : 4.5) * fc, tz = -0.2; curYa = ya;
    const fv = FOV0 + (PH ? 8 : 20) * fc; if (Math.abs(cam.fov - fv) > 0.01) { cam.fov = fv; cam.updateProjectionMatrix(); }
    cam.position.set(tx + Math.sin(ya) * Math.cos(pa) * camD, ty + Math.sin(pa) * camD, tz + Math.cos(ya) * Math.cos(pa) * camD); cam.lookAt(tx, ty, tz);
    const so = sun.userData.off; sun.position.set(tx + so[0], so[1], tz + so[2]); sun.target.position.set(tx, 0, tz);
    const sp2 = tod !== null ? sun.userData.disc : LIGHT[sty].sunPos; sunD.position.set(tx + sp2[0], sp2[1], sp2[2]); sunD.scale.setScalar(S.neon ? 44 : dayOn || tod === null ? 34 : 13); sunD.lookAt(cam.position);
    // clouds drift slowly
    let ci = 0; for (let c = 0; c < 6; c++) { const cxw = ((c * 37 - u * 0.25 + now * 0.3) % 220 + 220) % 220 - 110 + tx, cyw = 26 + (c % 3) * 5, czw = -95; for (let pff = 0; pff < 4; pff++) { _o.position.set(cxw + pff * 3.2 - 5, cyw + (pff & 1) * 1.4, czw); _o.rotation.set(0, 0, 0); _o.scale.set(3.2 + (pff & 1), 1.8 + (pff & 1) * 0.6, 1.5); _o.updateMatrix(); CLOUD.setMatrixAt(ci++, _o.matrix); } }
    CLOUD.count = ci; CLOUD.instanceMatrix.needsUpdate = true;
    STARS.position.x = tx;
    fwStep(dt, p / 4, u);
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
  // zoom in to see faces (0.28 = nose to nose), out to see the whole street; returns false at a limit so the page can scroll
  function hour() { return tod === null ? null : tod % 24; }
  function setHour(h) { if (tod === null) return null; tod = ((h - 4.5) % 24 + 24) % 24 + 4.5; applyDay(tod); return hour(); }
  function skip(dh) { return tod === null ? null : setHour(tod + dh); }
  function zoomBy(f) { const z = Math.max(0.28, Math.min(1.6, zoom * f)); if (Math.abs(z - zoom) < 1e-4) return false; zoom = z; return true; }
  function show(on) { canvas.hidden = !on; if (on) resize(); }
  function stats() { return { calls: R.info.render.calls, tris: R.info.render.triangles, lowQ, fol: nFol, fw: fwAlive, fwOn, fwCam: +fwCam.toFixed(2), fwShows, fwLast, night: +night.toFixed(2) }; }
  return { render, resize, pick, proj, show, stats, orbit, screen, zoomBy, hour, setHour, skip, fireworks, fwReady, fwSim };
}
