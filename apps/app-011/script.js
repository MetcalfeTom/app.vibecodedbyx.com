// open world italian-themed plaza with simple 3d, walkable nav and npc chat
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500);
const orbit = { yaw: 0, pitch: -0.1 }; // third-person orbit
const player = { pos: new THREE.Vector3(0, 1, 0), vel: new THREE.Vector3(), speed: 6.5, sprint: 10.5, heading: 0 };
let lastT = performance.now();

function size() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
size(); window.addEventListener('resize', size);

// lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xfff1c1, 1.0); sun.position.set(8, 12, 6); scene.add(sun);

// sky dome gradient
const skyGeo = new THREE.SphereGeometry(200, 24, 16);
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: { top: { value: new THREE.Color(0x243b55) }, bottom: { value: new THREE.Color(0x141e30) } },
  vertexShader:`varying vec3 vPos; void main(){ vPos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
  fragmentShader:`uniform vec3 top; uniform vec3 bottom; varying vec3 vPos; void main(){ float h = normalize(vPos).y*0.5+0.5; gl_FragColor=vec4(mix(bottom, top, h), 1.0); }`
});
scene.add(new THREE.Mesh(skyGeo, skyMat));

// ground + roads
const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ color: 0x2e2a27, roughness: 1 }));
ground.rotation.x = -Math.PI/2; scene.add(ground);

// piazza center tiles
const plaza = new THREE.Mesh(new THREE.CircleGeometry(28, 48), new THREE.MeshStandardMaterial({ color: 0x3a332f, roughness: 1 }));
plaza.rotation.x = -Math.PI/2; plaza.position.set(0, 0.001, 0); scene.add(plaza);

// simple building factory
function makeBuilding(w=6, d=8, h=4, color=0x7b4e3e){
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.9 })); base.position.y = h/2; g.add(base);
  return g;
}

// create town blocks
const colliders = [];
function addBuilding(x, z, w, d, h, color){ const b = makeBuilding(w,d,h,color); b.position.set(x, 0, z); scene.add(b); colliders.push({ pos: b.position.clone(), w, d, h }); return b; }

// main restaurant with open front
const rColor = 0x8b5a2b;
const resto = addBuilding(14, -6, 12, 10, 5, rColor);
// carve an open door (visual only): add a darker frame and sign
const sign = new THREE.Mesh(new THREE.PlaneGeometry(6,1.2), new THREE.MeshStandardMaterial({ color: 0xffe082, roughness: 0.6 }));
sign.position.set(14, 4.2, -1.6); sign.rotation.y = -Math.PI/2; scene.add(sign);

// scatter other buildings
for (let i=0;i<14;i++){
  const x = -40 + Math.random()*80;
  const z = -40 + Math.random()*80;
  if (Math.hypot(x, z) < 16) continue; // keep plaza open
  addBuilding(x, z, 6+Math.random()*8, 6+Math.random()*8, 3.5+Math.random()*3.5, 0x5a3a2e + (Math.random()*0x222222)|0);
}

// cafe tables outside
const tableMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.9 });
for (let i=0;i<8;i++){
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.6,0.1,16), tableMat);
  t.position.set(-6 + (i%4)*3, 0.56, 6 + Math.floor(i/4)*3); scene.add(t);
}

// player visual (capsule-like)
const playerG = new THREE.Group();
const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffe0bd })); head.position.y = 1.6; playerG.add(head);
const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.6, 8, 16), new THREE.MeshStandardMaterial({ color: 0x6fa8ff, roughness: 0.7 })); body.position.y = 1.1; playerG.add(body);
scene.add(playerG);

// npcs
const npcs = [];
function makeNPC(name, x, z){
  const g = new THREE.Group();
  const h = head.clone(); const b = body.clone();
  g.add(h); g.add(b);
  g.position.set(x, 0, z);
  g.userData = { name, talk: smallTalk(name) };
  scene.add(g); npcs.push(g);
}
makeNPC('marco', -5, 4);
makeNPC('giulia', 2, -8);
makeNPC('sofia', 18, -4);

// input
const keys = new Set();
let dragging = false, lx = 0, ly = 0;
canvas.addEventListener('pointerdown', e=>{ dragging = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointerup', e=>{ dragging = false; canvas.releasePointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e=>{
  if (!dragging) return;
  const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
  orbit.yaw -= dx * 0.003; orbit.pitch = Math.max(-1.2, Math.min(0.4, orbit.pitch - dy * 0.002));
});
addEventListener('keydown', e=>{ keys.add(e.key.toLowerCase()); if (e.key.toLowerCase()==='e') tryInteract(); });
addEventListener('keyup', e=>{ keys.delete(e.key.toLowerCase()); });

// simple collision check against building AABBs
function collide(next){
  const px = next.x, pz = next.z; const r = 0.35;
  for (const c of colliders){
    const minX = c.pos.x - c.w/2 - r, maxX = c.pos.x + c.w/2 + r;
    const minZ = c.pos.z - c.d/2 - r, maxZ = c.pos.z + c.d/2 + r;
    if (px > minX && px < maxX && pz > minZ && pz < maxZ) {
      // push out on the shallowest axis
      const dx = Math.min(Math.abs(px - minX), Math.abs(maxX - px));
      const dz = Math.min(Math.abs(pz - minZ), Math.abs(maxZ - pz));
      if (dx < dz) next.x = (px - minX < maxX - px) ? minX : maxX;
      else next.z = (pz - minZ < maxZ - pz) ? minZ : maxZ;
    }
  }
}

// movement + camera
function step(dt){
  // input vector in camera space
  let ix = 0, iz = 0;
  if (keys.has('w') || keys.has('arrowup')) iz -= 1;
  if (keys.has('s') || keys.has('arrowdown')) iz += 1;
  if (keys.has('a') || keys.has('arrowleft')) ix -= 1;
  if (keys.has('d') || keys.has('arrowright')) ix += 1;
  const len = Math.hypot(ix, iz) || 1; ix/=len; iz/=len;
  const speed = (keys.has('shift')) ? player.sprint : player.speed;
  const yaw = orbit.yaw;
  const dir = new THREE.Vector3(
    ix*Math.cos(yaw) - iz*Math.sin(yaw),
    0,
    ix*Math.sin(yaw) + iz*Math.cos(yaw)
  );
  const next = player.pos.clone().addScaledVector(dir, speed*dt);
  collide(next); player.pos.copy(next);
  if (ix!==0 || iz!==0) player.heading = Math.atan2(dir.x, dir.z);
  // position visuals
  playerG.position.copy(player.pos);
  playerG.rotation.y = player.heading;
  // camera third-person follow
  const camDist = 4.2, camHeight = 2.1;
  const camOffset = new THREE.Vector3(Math.sin(orbit.yaw)*camDist, camHeight + Math.sin(orbit.pitch)*0.8, Math.cos(orbit.yaw)*camDist);
  const camPos = player.pos.clone().add(camOffset);
  camera.position.copy(camPos);
  camera.lookAt(player.pos.clone().add(new THREE.Vector3(0,1.2,0)));
  // hud
  document.getElementById('speed').textContent = (speed*Math.hypot(ix,iz)).toFixed(1) + ' m/s';
}

// minimap
const map = document.getElementById('minimap');
const mctx = map.getContext('2d');
function drawMinimap(){
  const w = map.width, h = map.height; mctx.clearRect(0,0,w,h);
  mctx.fillStyle = 'rgba(0,0,0,0.35)'; mctx.fillRect(0,0,w,h);
  // convert world [-40..40] into map
  const scale = 1.6; // pixels per unit
  function toMap(x,z){ return { x: w/2 + x*scale, y: h/2 + z*scale }; }
  // buildings
  mctx.fillStyle = '#7b4e3e';
  colliders.forEach(c=>{ const a=toMap(c.pos.x, c.pos.z); mctx.fillRect(a.x- (c.w*scale/2), a.y- (c.d*scale/2), c.w*scale, c.d*scale); });
  // player
  const p = toMap(player.pos.x, player.pos.z); mctx.fillStyle = '#ffd38a'; mctx.beginPath(); mctx.arc(p.x, p.y, 4, 0, Math.PI*2); mctx.fill();
}

// dialog
const dlg = document.getElementById('dialog');
const dlgClose = document.getElementById('dlgClose');
const npcName = document.getElementById('npcName');
const npcLine = document.getElementById('npcLine');
const chatButtons = document.getElementById('chatButtons');
function openDialog(n){
  npcName.textContent = n.userData.name;
  npcLine.textContent = '';
  chatButtons.innerHTML = '';
  n.userData.talk.forEach(t=>{
    const b = document.createElement('button'); b.textContent = t.label; b.onclick = ()=>{ npcLine.textContent = sample(t.replies); }; chatButtons.appendChild(b);
  });
  dlg.classList.add('open'); dlg.removeAttribute('hidden');
}
function closeDialog(){ dlg.classList.remove('open'); dlg.setAttribute('hidden',''); }
dlgClose.addEventListener('click', closeDialog);
['click','touchstart'].forEach(evt=> dlg.addEventListener(evt, (e)=>{ if (e.target===dlg) { e.preventDefault(); closeDialog(); } }, {passive:false}));

function tryInteract(){
  // interact with nearest npc within radius
  let nearest=null, best=1.6;
  npcs.forEach(n=>{ const d = n.position.distanceTo(player.pos); if (d < best) {best=d; nearest=n;} });
  if (nearest) openDialog(nearest);
}

function sample(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function smallTalk(name){
  const topics = [
    { label: 'ciao! recommendation?', replies: ['pizza by the fountain is unbeatable.', 'ask for the chef’s special—no regrets.', 'the risotto here is a little symphony.'] },
    { label: 'nice night, eh?', replies: ['stars are out, pigeons are asleep.', 'perfect breeze for a long stroll.', 'even the street lamps look hungry.'] },
    { label: 'music sounds good', replies: ['accordion makes the pasta twirl itself.', 'the violinist winked at my breadstick.', 'i tip in applause. it counts.'] },
    { label: 'football news?', replies: ['my team only loses when i don’t order dessert.', 'we won! i owe tiramisu to half the town.', 'i root for whoever brings garlic bread first.'] },
  ];
  // pick 3
  const pool = topics.slice(); const picked=[]; for(let i=0;i<3;i++){ const k=Math.floor(Math.random()*pool.length); picked.push(pool.splice(k,1)[0]); }
  return picked;
}

// loop
let running = false;
function loop(){
  const t = performance.now(); const dt = Math.min(0.05, (t - lastT)/1000); lastT = t;
  if (running) step(dt);
  drawMinimap();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();

// start button
document.getElementById('btnStart').addEventListener('click', () => { running = true; document.getElementById('zone').textContent = 'piazza del sole'; });

