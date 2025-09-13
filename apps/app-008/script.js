// sloppy western hand-wash with simple npcs
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2));
const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
const orbit = { target: new THREE.Vector3(0, 1.0, 0), r: 8, phi: 0.9, theta: -0.5 };
function size(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}size();addEventListener('resize',size);

// lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const sun = new THREE.DirectionalLight(0xfff2cc, 0.9); sun.position.set(5,8,4); scene.add(sun);

// ground + backdrop
const ground = new THREE.Mesh(new THREE.PlaneGeometry(60,60), new THREE.MeshStandardMaterial({color:0x5d4436, roughness:1}));
ground.rotation.x = -Math.PI/2; scene.add(ground);
const back = new THREE.Mesh(new THREE.PlaneGeometry(60,20), new THREE.MeshStandardMaterial({color:0x3b2b23, roughness:1}));
back.position.set(0,5,-18); scene.add(back);

// trough + faucet
const wood = new THREE.MeshStandardMaterial({ color:0x8d6e63, roughness:0.9 });
const metal = new THREE.MeshStandardMaterial({ color:0x9ea7ad, roughness:0.4, metalness:0.5 });
const trough = new THREE.Group();
const basin = new THREE.Mesh(new THREE.BoxGeometry(3.6,0.6,1.2), wood); basin.position.set(0,0.9,0); trough.add(basin);
const rimL = new THREE.Mesh(new THREE.BoxGeometry(0.1,0.8,1.3), wood); rimL.position.set(-1.8,1.0,0); trough.add(rimL);
const rimR = rimL.clone(); rimR.position.x = 1.8; trough.add(rimR);
trough.position.set(0,0,0); scene.add(trough);

const faucet = new THREE.Group();
const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.08,1.0,16), metal); post.position.set(0,1.6,0); faucet.add(post);
const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.8,16), metal); spout.rotation.z = Math.PI/2; spout.position.set(0.4,1.8,0); faucet.add(spout);
scene.add(faucet);

// water surface
const water = new THREE.Mesh(new THREE.PlaneGeometry(3.2,1.0,1,1), new THREE.MeshStandardMaterial({color:0x4fc3f7, roughness:0.2, metalness:0, transparent:true, opacity:0.7}));
water.rotation.x = -Math.PI/2; water.position.set(0,1.2,0); scene.add(water);

// player hands (simple)
const handMat = new THREE.MeshStandardMaterial({ color:0xffd7b5, roughness:0.8 });
const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.6,0.2,0.8), handMat);
const rightHand = leftHand.clone();
leftHand.position.set(-0.5,1.45,0); rightHand.position.set(0.5,1.45,0);
scene.add(leftHand); scene.add(rightHand);

// foam particles (tiny spheres)
const foamGroup = new THREE.Group();
scene.add(foamGroup);
function spawnFoam(n=12){
  for(let i=0;i<n;i++){
    const s=0.06+Math.random()*0.08; const b=new THREE.Mesh(new THREE.SphereGeometry(s,8,8), new THREE.MeshStandardMaterial({color:0xffffff, roughness:1, transparent:true, opacity:0.9}));
    b.position.set((Math.random()-0.5)*0.9, 1.45+Math.random()*0.2, (Math.random()-0.5)*0.5);
    b.userData.v = new THREE.Vector3((Math.random()-0.5)*0.02, 0.02+Math.random()*0.03, (Math.random()-0.5)*0.02);
    foamGroup.add(b);
  }
}

// npcs
const npcs=[]; const npcGeoBody=new THREE.BoxGeometry(0.6,1.0,0.4); const npcGeoHead=new THREE.SphereGeometry(0.22, 16, 16);
const npcPal=[0xc084fc,0x60a5fa,0x34d399,0xf59e0b,0xf87171];
const npcDialog=[
  {name:'ranch hand', lines:[
    'dust gets everywhere out here. soap helps.',
    'heard you can scrub in little circles. works a charm.',
    'when the wind howls, keep your head down and your hands clean.'
  ]},
  {name:'drifter', lines:[
    'town’s quiet, but the dust never sleeps.',
    'you look like you’ve been through the canyon. wash up, partner.',
    'water’s cold this hour. keeps you awake.'
  ]},
  {name:'cook', lines:[
    'no plate touches my table without clean hands.',
    'scrub the knuckles too. can’t forget the knuckles.',
    'soap’s cheap. trouble ain’t.'
  ]},
];
function makeNPC(i,pos){
  const g=new THREE.Group();
  const body=new THREE.Mesh(npcGeoBody,new THREE.MeshStandardMaterial({color:npcPal[i % npcPal.length], roughness:0.9})); body.position.y=1.1; g.add(body);
  const head=new THREE.Mesh(npcGeoHead,new THREE.MeshStandardMaterial({color:0xffe0bd, roughness:0.8})); head.position.y=1.7; g.add(head);
  g.position.copy(pos);
  g.userData = { idx:i, ...npcDialog[i % npcDialog.length], line:0 };
  scene.add(g); npcs.push(g);
}
makeNPC(0,new THREE.Vector3(-3.2,0, 2.2));
makeNPC(1,new THREE.Vector3( 3.2,0, 2.0));
makeNPC(2,new THREE.Vector3( 0.0,0,-3.2));

// ui
const q = id => document.getElementById(id);
const btnStart=q('btnStart'), btnTalk=q('btnTalk'), btnNext=q('btnNext'), btnReset=q('btnReset');
const soapPct=q('soapPct'), timerEl=q('timer');
const dialog=q('dialog'), dialogClose=q('dialogClose'), npcName=q('npcName'), npcLine=q('npcLine');

// state
let washing=false; let soap=0; let time=0; let selectedNPC=null;

// camera controls with touch gestures
let dragging=false,lastX=0,lastY=0; const pointers=new Map(); let lastPinch=0;
let inputMode='orbit'; // 'orbit' or 'scrub'
let scrubActive=false; let scrubPointerId=null; let lastScrubPos=null;
function updateCam(){const x=orbit.target.x+orbit.r*Math.sin(orbit.phi)*Math.cos(orbit.theta);const y=orbit.target.y+orbit.r*Math.cos(orbit.phi);const z=orbit.target.z+orbit.r*Math.sin(orbit.phi)*Math.sin(orbit.theta);camera.position.set(x,y,z);camera.lookAt(orbit.target)}
updateCam();
function onPointerDown(e){
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  // if touch/click begins over water, enter scrub mode
  if (hitWater(e)) {
    inputMode='scrub'; scrubActive=true; scrubPointerId=e.pointerId; lastScrubPos = intersectWater(e);
  } else {
    inputMode='orbit'; dragging=true; lastX=e.clientX; lastY=e.clientY;
  }
  canvas.setPointerCapture(e.pointerId)
}
function onPointerUp(e){
  pointers.delete(e.pointerId);
  if (scrubPointerId===e.pointerId){ scrubActive=false; inputMode='orbit'; lastScrubPos=null; }
  if(pointers.size<2)lastPinch=0; if(pointers.size===0)dragging=false; canvas.releasePointerCapture(e.pointerId)
}
function onPointerMove(e){
  if (scrubActive && e.pointerId===scrubPointerId) {
    // move hands towards intersection point and add soap
    const pt = intersectWater(e);
    if (pt) {
      moveHandsTo(pt);
      if (lastScrubPos) {
        const d = pt.distanceTo(lastScrubPos);
        if (washing && d > 0.01) {
          soap = Math.min(100, soap + Math.min(1.2, d*120));
          if (Math.random() < 0.6) spawnFoam(1);
        }
      }
      lastScrubPos = pt;
    }
    return;
  }
  if(!dragging)return; if(pointers.has(e.pointerId))pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size>=2){const pts=[...pointers.values()];const dx=pts[1].x-pts[0].x,dy=pts[1].y-pts[0].y;const dist=Math.hypot(dx,dy);if(lastPinch===0){lastPinch=dist;return}const dd=dist-lastPinch;orbit.r*=1-dd*0.002;orbit.r=Math.max(4,Math.min(24,orbit.r));lastPinch=dist;}else{const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;orbit.theta-=dx*0.005;orbit.phi-=dy*0.004;orbit.phi=Math.max(0.1,Math.min(Math.PI-0.1,orbit.phi));}
  updateCam()
}
canvas.addEventListener('pointerdown',onPointerDown);canvas.addEventListener('pointerup',onPointerUp);canvas.addEventListener('pointercancel',onPointerUp);canvas.addEventListener('pointermove',onPointerMove);canvas.addEventListener('wheel',e=>{if(isMobile)return;orbit.r*=1+Math.sign(e.deltaY)*0.08;orbit.r=Math.max(4,Math.min(24,orbit.r));updateCam()});

// raycaster for npc selection
const ray=new THREE.Raycaster(); const mouse=new THREE.Vector2();
function pickNPC(e){const rect=canvas.getBoundingClientRect(); const x=(e.clientX-rect.left)/rect.width*2-1; const y=-(e.clientY-rect.top)/rect.height*2+1; mouse.set(x,y); ray.setFromCamera(mouse,camera); const hits=ray.intersectObjects(npcs,true); if(hits.length){const root=hits[0].object.parent; selectedNPC=root; btnTalk.disabled=false; highlightSelection(root);} }
function highlightSelection(n){npcs.forEach(g=>{g.traverse(o=>{if(o.material&&o.material.emissive){o.material.emissive.setHex(0x000000)}})}); n.traverse(o=>{if(o.material&&o.material.emissive){o.material.emissive.setHex(0x222211)}})}
canvas.addEventListener('pointerdown', (e)=>{ // tap selection only if not over water
  if (!hitWater(e)) pickNPC(e);
});

function intersectWater(e){
  const rect=canvas.getBoundingClientRect(); const x=(e.clientX-rect.left)/rect.width*2-1; const y=-(e.clientY-rect.top)/rect.height*2+1; mouse.set(x,y); ray.setFromCamera(mouse,camera);
  const hit = ray.intersectObject(water, false);
  return hit.length ? hit[0].point.clone() : null;
}
function hitWater(e){ return !!intersectWater(e); }
function moveHandsTo(pt){
  // constrain to trough bounds
  const minX=-1.4, maxX=1.4, minZ=-0.45, maxZ=0.45; const x=Math.max(minX,Math.min(maxX, pt.x)); const z=Math.max(minZ,Math.min(maxZ, pt.z));
  leftHand.position.set(x-0.35, 1.42, z+0.05);
  rightHand.position.set(x+0.35, 1.42, z-0.05);
}

// washing logic
function startWash(){washing=true; soap=0; time=0; btnStart.disabled=true; spawnFoam(24)}
function reset(){washing=false; soap=0; time=0; soapPct.textContent='0%'; timerEl.textContent='0.0s'; btnStart.disabled=false; foamGroup.clear()}

btnStart.addEventListener('click',()=>startWash());
btnReset.addEventListener('click',()=>reset());
btnTalk.addEventListener('click',()=>{ if(!selectedNPC) return; showDialog(true); renderLine(selectedNPC) });
btnNext.addEventListener('click',()=>{ if(!selectedNPC) return; selectedNPC.userData.line=(selectedNPC.userData.line+1)%selectedNPC.userData.lines.length; renderLine(selectedNPC) });
dialogClose.addEventListener('click',()=>showDialog(false));
['click','touchstart'].forEach(evt=>{ dialog.addEventListener(evt,(e)=>{ if(e.target===dialog){ e.preventDefault(); showDialog(false)} }, {passive:false})});

function showDialog(show){ if(show){ dialog.classList.add('open'); btnNext.disabled=false } else { dialog.classList.remove('open'); btnNext.disabled=true } }
function renderLine(npc){ npcName.textContent=npc.userData.name; npcLine.textContent=npc.userData.lines[npc.userData.line] }

// main loop
let t=0; function loop(){ t+=0.016; // foam rise/evaporate
  foamGroup.children.forEach(b=>{ b.position.add(b.userData.v); b.material.opacity*=0.985; if(b.material.opacity<0.03){ foamGroup.remove(b)} });
  if(washing){ time+=0.016; // increase soap when scrubbing or auto-oscillate if idle
    if (!scrubActive) {
      const oscill=Math.sin(t*6)*0.4; leftHand.position.z=oscill*0.4; rightHand.position.z=-oscill*0.4; leftHand.position.y=1.42+Math.abs(Math.cos(t*5))*0.06; rightHand.position.y=1.42+Math.abs(Math.sin(t*5))*0.06;
      if(Math.abs(oscill)<0.2){ soap=Math.min(100, soap+0.4); if(Math.random()<0.2) spawnFoam(1) }
    }
    if(soap>=100){ washing=false }
    soapPct.textContent = `${Math.floor(soap)}%`; timerEl.textContent = `${time.toFixed(1)}s`;
  }
  renderer.render(scene,camera); requestAnimationFrame(loop)} loop();
