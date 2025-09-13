// basic three.js setup
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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
canvas.addEventListener('pointerdown', (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointerup',   (e) => { isDragging = false; canvas.releasePointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastX; const dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
  if (e.shiftKey) {
    // pan
    const panSpeed = 0.003 * orbit.r;
    const right = new THREE.Vector3();
    camera.getWorldDirection(right); right.cross(camera.up).normalize();
    const up = camera.up.clone();
    orbit.target.addScaledVector(right, -dx * panSpeed);
    orbit.target.addScaledVector(up, dy * panSpeed);
  } else {
    orbit.theta -= dx * 0.005;
    orbit.phi   -= dy * 0.004;
    orbit.phi = Math.max(0.1, Math.min(Math.PI - 0.1, orbit.phi));
  }
});
canvas.addEventListener('wheel', (e) => { orbit.r *= (1 + Math.sign(e.deltaY) * 0.08); orbit.r = Math.max(4, Math.min(28, orbit.r)); });

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
document.getElementById('btnStart').addEventListener('click', () => { dinnerOn = true; });
document.getElementById('btnServe').addEventListener('click', serveDish);
document.getElementById('btnChaos').addEventListener('click', () => { chaos = !chaos; });
document.getElementById('btnReset').addEventListener('click', () => { dinnerOn = false; chaos = false; });

// main loop
let t = 0;
function loop() {
  t += 0.016;
  animateArms(t);
  updateCamera();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();

