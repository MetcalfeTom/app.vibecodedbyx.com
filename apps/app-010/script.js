(function(){
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 1.5);

  const dishes = [
    { id:'margherita', label:'pizza margherita', color:'#e74c3c' },
    { id:'carbonara', label:'spaghetti carbonara', color:'#f1c40f' },
    { id:'lasagna', label:'lasagna', color:'#c0392b' },
    { id:'gnocchi', label:'gnocchi', color:'#e67e22' },
    { id:'risotto', label:'risotto', color:'#f39c12' },
    { id:'tiramisu', label:'tiramisu', color:'#8e6e53' },
  ];

  // ui
  const servedEl = document.getElementById('served');
  const timerEl = document.getElementById('timer');
  const tipsEl = document.getElementById('tips');
  const btnStart = document.getElementById('btnStart');
  const btnReset = document.getElementById('btnReset');
  const dlg = document.getElementById('dialog');
  const dlgName = document.getElementById('dlgName');
  const dlgClose = document.getElementById('dlgClose');
  const menuGrid = document.getElementById('menuGrid');
  const chatLine = document.getElementById('chatLine');

  // state
  let w = canvas.clientWidth, h = canvas.clientHeight;
  let time = 0; let running = false; let servedCount = 0; let tips = 0;
  const table = { x: 0, y: 0, r: 180 };
  const diners = [];
  let seatsCount = 4;
  let selectedDiner = null;
  // player avatar (walk around the restaurant)
  const player = { x: 0, y: 0, r: 14, speed: 140, tx: null, ty: null };
  const keys = new Set();
  let pendingInteract = null; // diner to auto-open when in range
  const tokens = []; // draggable dish tokens
  let dragId = null; let dragOffset = {x:0,y:0};

  function resize(){
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    layout();
  }
  resize(); addEventListener('resize', resize);

  function layout(){
    table.x = w/2; table.y = h/2 + 30; table.r = Math.min(w,h)*0.22;
    // diners around the table (4 family members)
    diners.length = 0;
    const seats = seatsCount; const radius = table.r + 70;
    for(let i=0;i<seats;i++){
      const ang = -Math.PI/2 + i * (Math.PI*2/seats);
      const x = table.x + Math.cos(ang)*radius;
      const y = table.y + Math.sin(ang)*radius;
      diners.push({
        x, y, r: 26, order: null, served:false, name: randomName(),
        // ai state
        state: 'waiting', // waiting -> ordered -> eating -> done
        patience: 1.0,
        wantTimer: 0, // time until they auto-place order if ignored
        like: pickLike(),
        dislike: pickDislike(),
      });
    }
    // serving counter area at bottom
    layoutTokens();
    // place player near the counter initially
    player.x = w/2; player.y = Math.min(h - 140, table.y + table.r + 120);
  }

  function layoutTokens(){
    const barY = h - 110; const gap = 96; const startX = Math.max(60, w/2 - (dishes.length-1)*gap/2);
    tokens.length = 0;
    for (let i=0;i<dishes.length;i++){
      tokens.push({ id:dishes[i].id, label:dishes[i].label, color:dishes[i].color, x:startX + i*gap, y:barY, w:80, h:40, held:false });
    }
  }

  function startService(){
    running = true; time = 0; servedCount = 0; tips = 0;
    seatsCount = 4 + Math.floor(Math.random()*3); // 4..6
    layout();
    diners.forEach(d => { d.served=false; d.order = null; });
    servedEl.textContent = `0/${diners.length}`; tipsEl.textContent = `$0`;
  }
  function reset(){ running=false; time=0; servedCount=0; tips=0; diners.forEach(d=>{d.order=null; d.served=false}); servedEl.textContent='0'; timerEl.textContent='0.0s'; tipsEl.textContent='$0'; layoutTokens(); }

  function randomOrder(){
    const pool = dishes.map(d=>d.id);
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function dishById(id){ return dishes.find(d=>d.id===id); }
  function randomName(){
    const f = ['maria','anna','giulia','francesca','sofia','luca','marco','andrea','nicola','giovanni'];
    return f[Math.floor(Math.random()*f.length)];
  }
  function pickLike(){ return dishes[Math.floor(Math.random()*dishes.length)].id; }
  function pickDislike(){
    let id = dishes[Math.floor(Math.random()*dishes.length)].id;
    // ensure dislike not equal to like randomly when both used
    return id;
  }

  // input
  function ptIn(x,y,r){ return (mouse.x>=x-r && mouse.x<=x+r && mouse.y>=y-r && mouse.y<=y+r); }
  function rectIn(rx,ry,rw,rh){ return (mouse.x>=rx && mouse.x<=rx+rw && mouse.y>=ry && mouse.y<=ry+rh); }
  const mouse = { x:0,y:0, down:false };
  canvas.addEventListener('pointerdown', (e)=>{
    mouse.down = true; const p = point(e); mouse.x=p.x; mouse.y=p.y;
    // pick token first if pressed on the bar
    for(let i=tokens.length-1;i>=0;i--){ const t=tokens[i]; if (rectIn(t.x-t.w/2, t.y-t.h/2, t.w, t.h)){ dragId = i; dragOffset.x = mouse.x - t.x; dragOffset.y = mouse.y - t.y; t.held=true; canvas.setPointerCapture?.(e.pointerId); return; } }
    // else, check diner tap to open menu/dialogue
    const diner = dinerAt(mouse.x, mouse.y);
    if (diner){
      // if close enough, open; otherwise walk to them then open
      if (dist(player.x, player.y, diner.x, diner.y) <= 70) { openDialog(diner); }
      else { player.tx = diner.x; player.ty = diner.y; pendingInteract = diner; }
      return;
    }
    // background tap: walk target
    player.tx = mouse.x; player.ty = mouse.y; pendingInteract = null;
    canvas.setPointerCapture?.(e.pointerId);
  });
  canvas.addEventListener('pointerup', (e)=>{
    mouse.down = false; const p = point(e); mouse.x=p.x; mouse.y=p.y;
    if (dragId!==null){
      // try serve
      const t = tokens[dragId];
      let served = false;
      diners.forEach(d => {
        if (!d.served && ptIn(d.x, d.y, d.r+20) && d.order === t.id){
          d.served = true; d.state = 'eating';
          served = true; servedCount++;
          // tip based on patience and preference
          const base = 6 + Math.max(0, 10 - Math.floor(time));
          let mult = 1.0;
          if (d.order === d.like) mult += 0.25;
          if (d.order === d.dislike) mult -= 0.25;
          mult = Math.max(0.5, Math.min(1.5, mult));
          tips += Math.round(base * mult * d.patience);
        }
      });
      // snap back token to bar
      t.held=false; layoutTokens();
      if (served){ servedEl.textContent = `${servedCount}/${diners.length}`; tipsEl.textContent = `$${tips}`; }
      if (servedCount >= diners.length){ running=false; }
    }
    dragId = null; canvas.releasePointerCapture?.(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e)=>{
    const p = point(e); mouse.x=p.x; mouse.y=p.y;
    if (dragId!==null){ const t=tokens[dragId]; t.x = mouse.x - dragOffset.x; t.y = mouse.y - dragOffset.y; }
  });

  function point(e){ const r = canvas.getBoundingClientRect(); return { x:(e.clientX - r.left), y:(e.clientY - r.top) }; }
  function dinerAt(x,y){
    for (let i=diners.length-1;i>=0;i--){ const d=diners[i]; const dx=x-d.x, dy=y-d.y; if (dx*dx+dy*dy <= (d.r+20)*(d.r+20)) return d; }
    return null;
  }
  function dist(ax,ay,bx,by){ const dx=bx-ax, dy=by-ay; return Math.hypot(dx,dy); }

  // movement and collisions
  function updatePlayer(dt){
    // keyboard input vector
    let vx = 0, vy = 0;
    if (keys.has('arrowup') || keys.has('w')) vy -= 1;
    if (keys.has('arrowdown') || keys.has('s')) vy += 1;
    if (keys.has('arrowleft') || keys.has('a')) vx -= 1;
    if (keys.has('arrowright') || keys.has('d')) vx += 1;
    // target click-to-move if no keys
    if (vx === 0 && vy === 0 && player.tx != null && player.ty != null) {
      const ang = Math.atan2(player.ty - player.y, player.tx - player.x);
      vx = Math.cos(ang); vy = Math.sin(ang);
      if (dist(player.x, player.y, player.tx, player.ty) < 6) { player.tx = player.ty = null; }
    }
    const len = Math.hypot(vx, vy);
    if (len > 0) { vx /= len; vy /= len; }
    const step = player.speed * dt;
    let nx = player.x + vx * step;
    let ny = player.y + vy * step;
    // collide with table disk
    const toCenter = dist(nx, ny, table.x, table.y);
    const minDist = table.r + player.r + 10;
    if (toCenter < minDist) {
      // push out along normal
      const ang = Math.atan2(ny - table.y, nx - table.x);
      nx = table.x + Math.cos(ang) * minDist;
      ny = table.y + Math.sin(ang) * minDist;
    }
    // collide with diners
    diners.forEach(d => {
      const dd = dist(nx, ny, d.x, d.y);
      const clear = d.r + player.r + 8;
      if (dd < clear) {
        const ang = Math.atan2(ny - d.y, nx - d.x);
        nx = d.x + Math.cos(ang) * clear;
        ny = d.y + Math.sin(ang) * clear;
      }
    });
    player.x = nx; player.y = ny;
    // auto-open dialog if we were heading to a diner and arrived
    if (pendingInteract && dist(player.x, player.y, pendingInteract.x, pendingInteract.y) <= 70) {
      openDialog(pendingInteract);
      pendingInteract = null;
      player.tx = player.ty = null;
    }
  }

  // draw helpers
  function roundRect(x,y,wid,hei,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+wid,y,x+wid,y+hei,r); ctx.arcTo(x+wid,y+hei,x,y+hei,r); ctx.arcTo(x,y+hei,x,y,r); ctx.arcTo(x,y,x+wid,y,r); ctx.closePath(); }
  function drawTable(){
    // table top
    ctx.save();
    const g = ctx.createRadialGradient(table.x, table.y, table.r*0.3, table.x, table.y, table.r);
    g.addColorStop(0,'#5c3b2e'); g.addColorStop(1,'#3a231a');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(table.x, table.y, table.r, 0, Math.PI*2); ctx.fill();
    // plates and diners
    diners.forEach(d=>{
      // plate
      ctx.fillStyle = '#f2f2f2'; ctx.beginPath(); ctx.arc(d.x, d.y, 22, 0, Math.PI*2); ctx.fill(); ctx.strokeStyle='#ddd'; ctx.stroke();
      // diner head
      ctx.fillStyle = '#ffe0bd'; ctx.beginPath(); ctx.arc(d.x, d.y - 58, 16, 0, Math.PI*2); ctx.fill();
      // small name tag
      ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(d.x-24, d.y-92, 48, 16); ctx.fillStyle='#fff'; ctx.font='11px Inter, sans-serif'; ctx.textAlign='center'; ctx.fillText(d.name, d.x, d.y-80);
      // patience ring around head (green->red)
      const px = d.x, py = d.y - 58; const pr = 20;
      const hue = Math.floor(120 * d.patience); // 120=green -> 0=red
      ctx.strokeStyle = `hsl(${hue} 80% 50% / 0.9)`;
      ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(px, py, pr, -Math.PI/2, -Math.PI/2 + Math.PI*2*d.patience); ctx.stroke();
      // order bubble
      if (running && !d.served && d.order){ const dish = dishById(d.order); const bx=d.x + (d.x<table.x? -52:52), by=d.y-78; ctx.fillStyle='rgba(0,0,0,0.55)'; roundRect(bx-48,by-18,96,28,8); ctx.fill(); ctx.fillStyle=dish.color; ctx.fillRect(bx-36, by-8, 16, 16); ctx.fillStyle='#fff'; ctx.font='12px Inter, sans-serif'; ctx.textAlign='left'; ctx.fillText(dish.label, bx-16, by+4); }
      else if (running && !d.served && !d.order) { // wants to order
        const bx=d.x + (d.x<table.x? -32:32), by=d.y-78; ctx.fillStyle='rgba(0,0,0,0.5)'; roundRect(bx-20,by-18,40,28,8); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='16px Inter, sans-serif'; ctx.fillText('?', bx-5, by+4);
      }
      // served tick
      if (d.served){ ctx.fillStyle='#2ecc71'; ctx.beginPath(); ctx.arc(d.x, d.y, 10, 0, Math.PI*2); ctx.fill(); }
    });
    ctx.restore();
  }

  function drawPlayer(){
    // simple person with shadow
    ctx.save();
    // shadow
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(player.x, player.y + 6, 18, 8, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    // body
    ctx.fillStyle = '#6fa8ff';
    ctx.beginPath(); ctx.arc(player.x, player.y - 18, 10, 0, Math.PI*2); ctx.fill(); // head
    ctx.fillStyle = '#88c'; ctx.fillRect(player.x - 10, player.y - 18, 20, 22); // torso
    ctx.restore();
  }

  function drawCounter(){
    const y = h - 80; ctx.fillStyle='#262833'; ctx.fillRect(0, y, w, 120);
    tokens.forEach(t=>{
      ctx.save(); ctx.translate(t.x, t.y);
      // dish token card
      ctx.fillStyle='rgba(0,0,0,0.45)'; roundRect(-t.w/2, -t.h/2, t.w, t.h, 10); ctx.fill(); ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.stroke();
      // colored square + label
      ctx.fillStyle=t.color; ctx.fillRect(-t.w/2+8, -10, 22, 22);
      ctx.fillStyle='#fff'; ctx.font='12px Inter, sans-serif'; const name = t.label; ctx.fillText(name, -t.w/2+36, 4);
      ctx.restore();
    });
  }

  function update(){
    if (running){
      time += 1/60; timerEl.textContent = `${time.toFixed(1)}s`;
      // diner ai updates
      diners.forEach(d => {
        // patience decays while waiting for order or food
        const waiting = (!d.order) || (!d.served && d.order);
        if (waiting) d.patience = Math.max(0.1, d.patience - 0.003);
        else d.patience = Math.min(1.0, d.patience + 0.001);
        // if no order yet, start wanting timer
        if (!d.order) {
          d.wantTimer += 1/60;
          // after 6–10s, they place an order themselves (biased by like)
          const limit = 6 + (d.like.charCodeAt(0) % 5); // pseudo-random per diner
          if (d.wantTimer > limit) {
            // weighted pick: like favored
            const pool = dishes.flatMap(ds => ds.id === d.like ? [ds.id, ds.id, ds.id] : [ds.id]);
            d.order = pool[Math.floor(Math.random()*pool.length)];
          }
        }
        // transition to done after served for a bit
        if (d.served && d.state === 'eating') {
          d.wantTimer += 1/60;
          if (d.wantTimer > 8) d.state = 'done';
        }
      });
    }
    updatePlayer(1/60);
  }
  function render(){ ctx.clearRect(0,0,w,h); drawTable(); drawPlayer(); drawCounter(); }
  function loop(){ update(); render(); requestAnimationFrame(loop); }

  // buttons
  btnStart.addEventListener('click', startService);
  btnReset.addEventListener('click', reset);

  // dialog interactions
  function openDialog(d){
    selectedDiner = d; dlgName.textContent = d.name; chatLine.textContent = '';
    // build menu
    menuGrid.innerHTML = '';
    dishes.forEach(ds => {
      const b = document.createElement('button');
      const sw = document.createElement('span'); sw.className='menu-swatch'; sw.style.background = ds.color; b.appendChild(sw);
      const lbl = document.createElement('span'); lbl.textContent = ds.label; b.appendChild(lbl);
      b.addEventListener('click', () => { d.order = ds.id; closeDialog(); });
      menuGrid.appendChild(b);
    });
    // chat buttons
    document.querySelectorAll('#dialog [data-chat]').forEach(el => {
      el.onclick = () => {
        const k = el.getAttribute('data-chat');
        chatLine.textContent = chatReply(k);
      };
    });
    dlg.classList.add('open'); dlg.removeAttribute('hidden');
  }
  function closeDialog(){ dlg.classList.remove('open'); dlg.setAttribute('hidden',''); selectedDiner=null; }
  dlgClose.addEventListener('click', closeDialog);
  ['click','touchstart'].forEach(evt=> dlg.addEventListener(evt, (e)=>{ if (e.target === dlg){ e.preventDefault(); closeDialog(); } }, { passive:false }));
  function chatReply(key){
    const replies = {
      rec: [
        'chef says the carbonara sings tonight.',
        'gnocchi’s light as a cloud. highly recommended.',
        'pizza margherita is a crowd favorite.'
      ],
      day: [
        'long day on the road, but good company helps.',
        'couldn’t be better—smells like fresh basil in here.',
        'hungry and happy, thanks for asking.'
      ],
      kids: [
        'they’re angels, as long as dessert arrives quickly.',
        'we’ve negotiated for extra garlic bread.',
        'promise they’ll behave if there’s tiramisu.'
      ]
    };
    const arr = replies[key] || ['buon appetito!'];
    return arr[Math.floor(Math.random()*arr.length)];
  }

  // init
  layout(); loop();

  // keyboard controls
  addEventListener('keydown', (e)=>{ keys.add(e.key.toLowerCase()); });
  addEventListener('keyup', (e)=>{ keys.delete(e.key.toLowerCase()); });
})();
