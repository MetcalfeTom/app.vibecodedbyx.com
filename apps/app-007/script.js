// basic three.js setup
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
const orbit = { target: new THREE.Vector3(0, 1.0, 0), r: 10, phi: 0.9, theta: 0.7 };

function size() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
size();
window.addEventListener('resize', size);

// lights
const amb = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(amb);
const key = new THREE.DirectionalLight(0xffffff, 0.8);
key.position.set(4, 8, 6);
key.castShadow = false;
scene.add(key);

// materials
const wood = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8, metalness: 0.1 });
const chairWood = new THREE.MeshStandardMaterial({ color: 0x704b3a, roughness: 0.85 });
const plateMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f2, roughness: 0.35 });
const clothMat = new THREE.MeshStandardMaterial({ color: 0xd9e7ff, roughness: 0.95 });
const glassMat = new THREE.MeshStandardMaterial({ color: 0x99ccff, roughness: 0.05, metalness: 0.0, opacity: 0.35, transparent: true });

// room (simple floor + walls)
const room = new THREE.Group();
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 1 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
room.add(floor);
const wallMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 1 });
const wall1 = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), wallMat); wall1.position.set(0, 3, -10); room.add(wall1);
const wall2 = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), wallMat); wall2.position.set(-10, 3, 0); wall2.rotation.y = Math.PI/2; room.add(wall2);
const wall3 = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), wallMat); wall3.position.set(10, 3, 0); wall3.rotation.y = -Math.PI/2; room.add(wall3);
scene.add(room);

// dining table
const table = new THREE.Group();
const top = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 2.8), wood); top.position.y = 1; table.add(top);
const legGeo = new THREE.BoxGeometry(0.18, 1, 0.18);
const makeLeg = (x, z) => { const m = new THREE.Mesh(legGeo, wood); m.position.set(x, 0.5, z); table.add(m); };
makeLeg(-2.7, -1.2); makeLeg(-2.7, 1.2); makeLeg(2.7, -1.2); makeLeg(2.7, 1.2);
const cloth = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 2.5, 1, 1), clothMat);
cloth.position.set(0, 1.01, 0); cloth.rotation.x = -Math.PI/2; table.add(cloth);
table.position.set(0, 0, 0);
scene.add(table);

// chair builder
function makeChair() {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.15, 1.1), chairWood); seat.position.y = 0.6; g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.0, 0.12), chairWood); back.position.set(0, 1.15, -0.5); g.add(back);
  const legG = new THREE.BoxGeometry(0.1, 0.6, 0.1);
  const mk = (x,z) => { const m = new THREE.Mesh(legG, chairWood); m.position.set(x, 0.3, z); g.add(m); };
  mk(-0.45, -0.45); mk(0.45, -0.45); mk(-0.45, 0.45); mk(0.45, 0.45);
  return g;
}

// simple person builder (boxes + sphere)
function makePerson(color) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.35), new THREE.MeshStandardMaterial({ color, roughness: 0.7 }));
  body.position.y = 1.1; group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffe0bd, roughness: 0.7 }));
  head.position.y = 1.65; group.add(head);
  // arms (for animations)
  const armGeo = new THREE.BoxGeometry(0.12, 0.5, 0.12);
  const armL = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color, roughness: 0.7 }));
  const armR = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color, roughness: 0.7 }));
  armL.position.set(-0.35, 1.25, 0);
  armR.position.set(0.35, 1.25, 0);
  armL.userData.baseRot = armL.rotation.x;
  armR.userData.baseRot = armR.rotation.x;
  group.add(armL); group.add(armR);
  group.userData.armL = armL; group.userData.armR = armR;
  return group;
}

// place chairs and people
const chairPositions = [
  { x: -2.2, z: -1.9, r: 0 }, // head of table
  { x: -0.7, z: -1.9, r: 0 },
  { x: 0.7,  z: -1.9, r: 0 },
  { x: 2.2,  z: -1.9, r: 0 },
  { x: -2.2, z: 1.9,  r: Math.PI },
  { x: -0.7, z: 1.9,  r: Math.PI },
  { x: 0.7,  z: 1.9,  r: Math.PI },
  { x: 2.2,  z: 1.9,  r: Math.PI },
];

const peopleColors = [0x60a5fa, 0xf472b6, 0x34d399, 0xf59e0b, 0xa78bfa, 0xf87171, 0x22d3ee, 0x93c5fd];

const family = [];
chairPositions.forEach((p, i) => {
  const chair = makeChair();
  chair.position.set(p.x, 0, p.z);
  chair.rotation.y = p.r;
  scene.add(chair);
  // person on every other chair for spacing
  if (i % 2 === 0) {
    const person = makePerson(peopleColors[i % peopleColors.length]);
    person.position.set(p.x, 0, p.z + (p.r === 0 ? 0.25 : -0.25));
    person.rotation.y = (p.r === 0 ? Math.PI : 0);
    scene.add(person);
    family.push(person);
  }
});

// place settings
const items = new THREE.Group();
scene.add(items);
function addPlace(x, z) {
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.31, 0.03, 24), plateMat);
  plate.rotation.x = Math.PI/2; plate.position.set(x, 1.02, z); items.add(plate);
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.18, 16), glassMat);
  cup.position.set(x + 0.35, 1.12, z - 0.05); items.add(cup);
}
[-2.0, -0.6, 0.6, 2.0].forEach(x => { addPlace(x, -0.7); addPlace(x, 0.7); });

// centerpiece food
const food = new THREE.Group();
scene.add(food);
function addCenterFood() {
  const roast = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 14), new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 }));
  roast.position.set(0, 1.25, 0);
  food.add(roast);
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.2, 20, 1, false), new THREE.MeshStandardMaterial({ color: 0xffe0b2, roughness: 0.8 }));
  bowl.position.set(0.9, 1.12, 0.2); food.add(bowl);
  const pie = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 24), new THREE.MeshStandardMaterial({ color: 0xf5b971, roughness: 0.8 }));
  pie.position.set(-0.9, 1.1, -0.2); food.add(pie);
}
addCenterFood();

// serve new dish action
function serveDish() {
  const angle = Math.random() * Math.PI * 2;
  const radius = 0.9 + Math.random() * 1.1;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * (radius * 0.7);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.08, 20), new THREE.MeshStandardMaterial({ color: Math.random()*0xffffff, roughness: 0.85 }));
  dish.position.set(x, 1.08, z);
  dish.rotation.x = Math.PI/2;
  items.add(dish);
}

// camera orbit controls (no external deps)
let isDragging = false, lastX = 0, lastY = 0;
// multi-touch gesture support
const pointers = new Map();
let lastPinchDist = 0;
let lastPinchCenter = null;

function pointerDown(e) {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  isDragging = true; lastX = e.clientX; lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
}
function pointerUp(e) {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) { lastPinchDist = 0; lastPinchCenter = null; }
  if (pointers.size === 0) { isDragging = false; }
  canvas.releasePointerCapture(e.pointerId);
}
function getPinchMetrics() {
  const pts = Array.from(pointers.values());
  if (pts.length < 2) return null;
  const dx = pts[1].x - pts[0].x;
  const dy = pts[1].y - pts[0].y;
  const dist = Math.hypot(dx, dy);
  const center = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  return { dist, center };
}
function pointerMove(e) {
  if (!isDragging) return;
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  const ptsCount = pointers.size;
  if (ptsCount >= 2) {
    // pinch to zoom + two-finger pan
    const m = getPinchMetrics();
    if (!m) return;
    if (lastPinchDist === 0) { lastPinchDist = m.dist; lastPinchCenter = m.center; return; }
    const distDelta = m.dist - lastPinchDist;
    orbit.r *= (1 - distDelta * 0.002);
    orbit.r = Math.max(4, Math.min(28, orbit.r));

    const cx = m.center.x - lastPinchCenter.x;
    const cy = m.center.y - lastPinchCenter.y;
    const panSpeed = 0.003 * orbit.r;
    const right = new THREE.Vector3();
    camera.getWorldDirection(right); right.cross(camera.up).normalize();
    const up = camera.up.clone();
    orbit.target.addScaledVector(right, -cx * panSpeed);
    orbit.target.addScaledVector(up, cy * panSpeed);
    lastPinchDist = m.dist;
    lastPinchCenter = m.center;
    achState.didZoom = true; achState.didPan = true; tryUnlock();
  } else {
    // single finger/mouse: orbit, shift-key pan remains on desktop
    const dx = e.clientX - lastX; const dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
    if (e.shiftKey && !isMobile) {
      const panSpeed = 0.003 * orbit.r;
      const right = new THREE.Vector3();
      camera.getWorldDirection(right); right.cross(camera.up).normalize();
      const up = camera.up.clone();
      orbit.target.addScaledVector(right, -dx * panSpeed);
      orbit.target.addScaledVector(up, dy * panSpeed);
      achState.didPan = true; tryUnlock();
    } else {
      orbit.theta -= dx * 0.005;
      orbit.phi   -= dy * 0.004;
      orbit.phi = Math.max(0.1, Math.min(Math.PI - 0.1, orbit.phi));
      if (Math.hypot(dx, dy) > 2) { achState.didOrbit = true; tryUnlock(); }
    }
  }
}

canvas.addEventListener('pointerdown', pointerDown);
canvas.addEventListener('pointerup', pointerUp);
canvas.addEventListener('pointercancel', pointerUp);
canvas.addEventListener('pointermove', pointerMove);
canvas.addEventListener('wheel', (e) => { if (isMobile) return; orbit.r *= (1 + Math.sign(e.deltaY) * 0.08); orbit.r = Math.max(4, Math.min(28, orbit.r)); achState.didZoom = true; tryUnlock(); });

function updateCamera() {
  const x = orbit.target.x + orbit.r * Math.sin(orbit.phi) * Math.cos(orbit.theta);
  const y = orbit.target.y + orbit.r * Math.cos(orbit.phi);
  const z = orbit.target.z + orbit.r * Math.sin(orbit.phi) * Math.sin(orbit.theta);
  camera.position.set(x, y, z);
  camera.lookAt(orbit.target);
}
updateCamera();

// animations
let dinnerOn = false;
let chaos = false;

// ---- simple web audio sound engine (procedural, no downloads) ----
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = false;
    this._ambTimer = null;
  }
  async init() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return; // no audio support
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(this.ctx.destination);
  }
  async enable() {
    await this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.enabled = true;
    this.startAmbience();
  }
  disable() {
    this.enabled = false;
    if (this._ambTimer) { clearInterval(this._ambTimer); this._ambTimer = null; }
  }
  startAmbience() {
    if (this._ambTimer) return;
    this._ambTimer = setInterval(() => {
      if (!this.enabled || !this.ctx) return;
      const r = Math.random();
      if (r < 0.35) this.playClink(0.08 + Math.random() * 0.04);
      else if (r < 0.6) this.playChatter(0.05 + Math.random() * 0.05);
    }, 900);
  }
  // helpers
  _gainEnv(duration = 0.12, peak = 1.0) {
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + duration * 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    return g;
  }
  _noiseBuffer(lenSec = 0.2) {
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * lenSec));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }
  playClink(duration = 0.1) {
    if (!this.enabled || !this.ctx) return;
    // sine blip + filtered noise burst
    const t0 = this.ctx.currentTime;
    const sine = this.ctx.createOscillator();
    sine.type = 'sine';
    sine.frequency.setValueAtTime(2200, t0);
    sine.frequency.exponentialRampToValueAtTime(900, t0 + duration);
    const sGain = this._gainEnv(duration, 0.3);
    sine.connect(sGain).connect(this.master);
    sine.start();
    sine.stop(t0 + duration);

    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuffer(duration);
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'highpass'; bp.frequency.value = 1800; bp.Q.value = 0.7;
    const nGain = this._gainEnv(duration * 0.9, 0.15);
    src.connect(bp).connect(nGain).connect(this.master);
    src.start();
  }
  playThump(duration = 0.12) {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t0);
    osc.frequency.exponentialRampToValueAtTime(90, t0 + duration);
    const g = this._gainEnv(duration, 0.4);
    osc.connect(g).connect(this.master);
    osc.start();
    osc.stop(t0 + duration);
  }
  playStart() {
    if (!this.enabled || !this.ctx) return;
    const t0 = this.ctx.currentTime;
    [440, 554.37, 659.25].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const g = this._gainEnv(0.35 + i * 0.05, 0.2);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t0 + i * 0.01);
      osc.connect(g).connect(this.master);
      osc.start(t0 + i * 0.01);
      osc.stop(t0 + 0.5 + i * 0.01);
    });
  }
  playChaos() {
    if (!this.enabled || !this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuffer(0.35);
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1200; bp.Q.value = 2;
    const g = this._gainEnv(0.4, 0.25);
    src.connect(bp).connect(g).connect(this.master);
    src.start();
  }
  playChatter(duration = 0.08) {
    if (!this.enabled || !this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuffer(duration);
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 400 + Math.random() * 800;
    bp.Q.value = 0.8;
    const g = this._gainEnv(duration, 0.06);
    src.connect(bp).connect(g).connect(this.master);
    src.start();
  }
}
const sound = new SoundEngine();

// ---- achievements ----
const achDefs = [
  { id: 'first-bite', name: 'first bite', desc: 'start the family dinner', test: s => s.started },
  { id: 'server-i', name: 'server i', desc: 'serve your first dish', test: s => s.served >= 1 },
  { id: 'server-ii', name: 'server ii', desc: 'serve 5 dishes', test: s => s.served >= 5 },
  { id: 'feast', name: 'feast', desc: 'serve 12 dishes', test: s => s.served >= 12 },
  { id: 'table-talk', name: 'table talk', desc: 'orbit the camera around the table', test: s => s.didOrbit },
  { id: 'zoom-zoom', name: 'zoom zoom', desc: 'pinch or scroll to zoom', test: s => s.didZoom },
  { id: 'pan-handler', name: 'pan handler', desc: 'pan the view of the room', test: s => s.didPan },
  { id: 'agent-of-chaos', name: 'agent of chaos', desc: 'toggle chaos mode', test: s => s.toggledChaos },
  { id: 'family-time', name: 'family time', desc: 'keep dinner going for 30 seconds', test: s => s.dinnerSeconds >= 30 },
];
const achState = {
  served: 0,
  started: false,
  toggledChaos: false,
  dinnerSeconds: 0,
  didOrbit: false,
  didZoom: false,
  didPan: false,
  unlocked: new Set(),
};

function loadAchievements() {
  try {
    const raw = localStorage.getItem('fds3d_achievements');
    if (!raw) return;
    const obj = JSON.parse(raw);
    (obj.unlocked || []).forEach(id => achState.unlocked.add(id));
  } catch (_) {}
}
function saveAchievements() {
  try {
    localStorage.setItem('fds3d_achievements', JSON.stringify({ unlocked: Array.from(achState.unlocked) }));
  } catch (_) {}
}
function notify(msg) {
  const host = document.getElementById('toastHost');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = `achievement unlocked: ${msg}`;
  host.appendChild(el);
  // play a tiny chime
  sound.enable().then(() => sound.playStart());
  setTimeout(() => { el.remove(); }, 2600);
}
function tryUnlock() {
  let changed = false;
  achDefs.forEach(def => {
    if (!achState.unlocked.has(def.id) && def.test(achState)) {
      achState.unlocked.add(def.id);
      notify(def.name);
      changed = true;
    }
  });
  if (changed) { saveAchievements(); renderAchList(); }
}
function renderAchList() {
  const list = document.getElementById('achList');
  if (!list) return;
  list.innerHTML = '';
  achDefs.forEach(def => {
    const li = document.createElement('li');
    const ok = achState.unlocked.has(def.id);
    li.className = ok ? '' : 'locked';
    const badge = document.createElement('div');
    badge.className = `ach-badge ${ok ? 'ok' : 'no'}`;
    badge.textContent = ok ? '✓' : '○';
    const body = document.createElement('div');
    body.className = 'ach-body';
    const h3 = document.createElement('h3'); h3.textContent = def.name;
    const p = document.createElement('p'); p.textContent = def.desc;
    body.appendChild(h3); body.appendChild(p);
    li.appendChild(badge); li.appendChild(body);
    list.appendChild(li);
  });
}
function showAchPanel(show) {
  const panel = document.getElementById('achPanel');
  if (!panel) return;
  if (show) { panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); }
  else { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); }
}

function animateArms(t) {
  family.forEach((p, i) => {
    const A = p.userData.armL, B = p.userData.armR;
    if (!A || !B) return;
    if (dinnerOn) {
      A.rotation.x = -0.6 + Math.sin(t * 2 + i) * 0.1;
      B.rotation.x = -0.4 + Math.cos(t * 2.2 + i * 0.8) * 0.12;
    } else {
      A.rotation.x *= 0.9; B.rotation.x *= 0.9;
    }
    if (chaos) {
      p.rotation.y += Math.sin(t * 2.5 + i) * 0.002;
    }
  });
}

// ui hookups
const btnStart = document.getElementById('btnStart');
const btnServe = document.getElementById('btnServe');
const btnChaos = document.getElementById('btnChaos');
const btnReset = document.getElementById('btnReset');
const btnSound = document.getElementById('btnSound');
const btnAch = document.getElementById('btnAch');
const achClose = document.getElementById('achClose');
const achPanel = document.getElementById('achPanel');

function unlockAudioOnce() { sound.enable(); canvas.removeEventListener('pointerdown', unlockAudioOnce); }
canvas.addEventListener('pointerdown', unlockAudioOnce, { passive: true });

btnStart.addEventListener('click', async () => { dinnerOn = true; achState.started = true; tryUnlock(); await sound.enable(); sound.playStart(); });
btnServe.addEventListener('click', async () => { serveDish(); achState.served++; tryUnlock(); await sound.enable(); sound.playClink(); sound.playThump(0.08); });
btnChaos.addEventListener('click', async () => { chaos = !chaos; achState.toggledChaos = true; tryUnlock(); await sound.enable(); sound.playChaos(); });
btnReset.addEventListener('click', () => { dinnerOn = false; chaos = false; });
btnAch.addEventListener('click', () => showAchPanel(!achPanel.classList.contains('open')));
['click','touchstart'].forEach(evt => {
  achClose.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); showAchPanel(false); }, { passive: false });
});
// tap/click outside the card closes on mobile/desktop
['click','touchstart'].forEach(evt => {
  achPanel.addEventListener(evt, (e) => {
    if (e.target === achPanel) { e.preventDefault(); showAchPanel(false); }
  }, { passive: false });
});
// esc key closes
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') showAchPanel(false); });
btnSound.addEventListener('click', async () => {
  if (!sound.enabled) { await sound.enable(); btnSound.textContent = 'sound: on'; btnSound.setAttribute('aria-pressed', 'true'); }
  else { sound.disable(); btnSound.textContent = 'sound: off'; btnSound.setAttribute('aria-pressed', 'false'); }
});

// main loop
let t = 0;
function loop() {
  t += 0.016;
  animateArms(t);
  updateCamera();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
  // track dinner time for achievement
  if (dinnerOn) { achState.dinnerSeconds += 0.016; if ((Math.floor(achState.dinnerSeconds * 10) % 10) === 0) { /* throttle */ } tryUnlock(); }
}
loop();

// init achievements ui
loadAchievements();
renderAchList();
showAchPanel(false);
