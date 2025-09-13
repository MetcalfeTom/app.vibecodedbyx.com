(function(){
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 1.5);

  // ui
  const btnStart = document.getElementById('btnStart');
  const btnReset = document.getElementById('btnReset');
  const soapEl = document.getElementById('soapPct');
  const timerEl = document.getElementById('timer');

  // state
  let w = canvas.clientWidth, h = canvas.clientHeight;
  let washing = false, soap = 0, time = 0;
  const hands = { lx: 0, ly: 0, rx: 0, ry: 0 };
  const foam = [];

  function resize(){
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resize();
  addEventListener('resize', resize);

  // layout areas
  function sinkRect(){
    const cw = Math.min(w * 0.7, 720); const ch = Math.min(h * 0.5, 320);
    const x = (w - cw) / 2; const y = (h - ch) / 2 + 30;
    return { x, y, w: cw, h: ch };
  }
  function waterRect(){
    const s = sinkRect();
    const pad = Math.min(s.w, s.h) * 0.12;
    return { x: s.x + pad, y: s.y + pad, w: s.w - pad * 2, h: s.h - pad * 2 };
  }

  function addFoam(x, y, n=6){
    for(let i=0;i<n;i++){
      foam.push({ x: x + (Math.random()-0.5)*24, y: y + (Math.random()-0.5)*16, r: 3 + Math.random()*3, a: 0.9, vx: (Math.random()-0.5)*0.4, vy: -0.2 - Math.random()*0.3 });
    }
  }

  // input
  let dragging = false; let lastX=0, lastY=0; let overWater = false;
  function ptIn(r, x, y){ return x>=r.x && x<=r.x+r.w && y>=r.y && y<=r.y+r.h; }
  function moveHands(x, y){
    const wr = waterRect();
    const clampX = Math.max(wr.x+20, Math.min(wr.x+wr.w-20, x));
    const clampY = Math.max(wr.y+10, Math.min(wr.y+wr.h-10, y));
    hands.lx = clampX - 32; hands.ly = clampY + 8;
    hands.rx = clampX + 32; hands.ry = clampY - 8;
  }
  function onDown(e){ dragging = true; const p = point(e); lastX=p.x; lastY=p.y; overWater = ptIn(waterRect(), p.x, p.y); moveHands(p.x, p.y); if (overWater) startWash(); canvas.setPointerCapture?.(e.pointerId); }
  function onUp(e){ dragging = false; canvas.releasePointerCapture?.(e.pointerId); }
  function onMove(e){ if(!dragging) return; const p = point(e); moveHands(p.x, p.y); if (washing && ptIn(waterRect(), p.x, p.y)) { const d = Math.hypot(p.x-lastX, p.y-lastY); soap = Math.min(100, soap + Math.min(1.6, d*0.12)); if (d>2) addFoam(p.x, p.y, 2); } lastX=p.x; lastY=p.y; }
  function point(e){ const rect = canvas.getBoundingClientRect(); return { x: (e.clientX - rect.left), y: (e.clientY - rect.top) }; }
  canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', onUp);

  // buttons
  function startWash(){ washing = true; soap = Math.max(soap, 0); }
  function reset(){ washing=false; soap=0; time=0; foam.length=0; soapEl.textContent='0%'; timerEl.textContent='0.0s'; }
  btnStart.addEventListener('click', startWash);
  btnReset.addEventListener('click', reset);

  // render helpers
  function drawSink(){
    const s = sinkRect();
    // counter
    ctx.fillStyle = '#2a3038'; ctx.fillRect(s.x-24, s.y-18, s.w+48, s.h+48);
    // basin
    const grd = ctx.createLinearGradient(0, s.y, 0, s.y + s.h);
    grd.addColorStop(0, '#6f7b8a'); grd.addColorStop(1, '#47525f');
    roundRect(s.x, s.y, s.w, s.h, 18, grd, '#2d3640');
    // water
    const wtr = waterRect();
    const wg = ctx.createLinearGradient(0, wtr.y, 0, wtr.y + wtr.h);
    wg.addColorStop(0, '#3aa1cf'); wg.addColorStop(1, '#216a8c');
    roundRect(wtr.x, wtr.y, wtr.w, wtr.h, 14, wg, '#204b63');
    // highlight lines
    ctx.globalAlpha = 0.15; ctx.strokeStyle = '#ffffff';
    for(let i=0;i<wtr.w;i+=24){ ctx.beginPath(); ctx.moveTo(wtr.x+i + (Date.now()/60)%24, wtr.y+wtr.h-6); ctx.lineTo(wtr.x+i+40 + (Date.now()/60)%24, wtr.y+6); ctx.stroke(); }
    ctx.globalAlpha = 1;
    // faucet
    const fx = s.x + s.w/2, fy = s.y - 12;
    ctx.fillStyle = '#9ea7ad'; ctx.fillRect(fx-10, fy-30, 20, 30); // post
    ctx.fillRect(fx-40, fy-22, 80, 10); // spout
  }
  function roundRect(x,y,wid,hei,r, fill, stroke){
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+wid, y, x+wid, y+hei, r);
    ctx.arcTo(x+wid, y+hei, x, y+hei, r);
    ctx.arcTo(x, y+hei, x, y, r);
    ctx.arcTo(x, y, x+wid, y, r);
    if (fill){ ctx.fillStyle = fill; ctx.fill(); }
    if (stroke){ ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  }
  function drawHands(){
    // simple rounded rectangles for hands
    ctx.fillStyle = '#ffd7b5';
    drawHand(hands.lx, hands.ly, -1);
    drawHand(hands.rx, hands.ry, 1);
  }
  function drawHand(cx, cy, dir){
    const w2 = 64, h2 = 28, r=14;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(dir*0.05);
    roundRect(-w2/2, -h2/2, w2, h2, r, '#ffd7b5', '#2d2d2d');
    // knuckle hints
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for(let i=-1;i<=1;i++) ctx.fillRect(-10 + i*10, -6, 4, 12);
    ctx.restore();
  }
  function drawFoam(){
    foam.forEach(b=>{
      ctx.globalAlpha = b.a; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r, b.r*0.85, 0, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function stepFoam(){
    for(let i=foam.length-1;i>=0;i--){ const b=foam[i]; b.x += b.vx; b.y += b.vy; b.a *= 0.985; if (b.a < 0.04) foam.splice(i,1); }
  }

  function update(){
    if (washing){ time += 1/60; if (soap >= 100) washing = false; }
    soapEl.textContent = `${Math.floor(soap)}%`;
    timerEl.textContent = `${time.toFixed(1)}s`;
    stepFoam();
  }
  function render(){
    ctx.clearRect(0,0,w,h);
    drawSink();
    drawFoam();
    drawHands();
  }

  function loop(){ update(); render(); requestAnimationFrame(loop); }
  // initial hand positions
  const wr = waterRect(); hands.lx = wr.x + wr.w*0.4 - 32; hands.ly = wr.y + wr.h*0.6;
  hands.rx = wr.x + wr.w*0.6 + 32; hands.ry = wr.y + wr.h*0.4;
  loop();
})();

