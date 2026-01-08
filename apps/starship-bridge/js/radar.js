export function initRadar(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let t = 0; const blips = Array.from({length: 10}, () => ({ a: Math.random()*Math.PI*2, r: Math.random()*0.42 + 0.15 }));
  function draw() {
    const {width, height} = canvas.getBoundingClientRect();
    canvas.width = width * devicePixelRatio; canvas.height = height * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    const cx = width/2, cy = height/2, R = Math.min(width, height)/2 - 10;
    ctx.clearRect(0,0,width,height);
    ctx.strokeStyle = 'rgba(0,255,200,.15)'; ctx.lineWidth = 1;
    for (let i=1;i<=4;i++){ ctx.beginPath(); ctx.arc(cx,cy,(R*i/4),0,Math.PI*2); ctx.stroke(); }
    const ang = t/80; const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,R);
    grad.addColorStop(0,'rgba(0,255,200,.28)'); grad.addColorStop(1,'rgba(0,255,200,0)');
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(ang); ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,R,0,0.6); ctx.closePath(); ctx.fill(); ctx.restore();
    blips.forEach((b,i)=>{ const a = b.a + Math.sin(t/120 + i)*0.2; const r = b.r*R; const x = cx + Math.cos(a)*r; const y = cy + Math.sin(a)*r; const alpha = (Math.sin(t/10 + i)+1)/2; ctx.fillStyle = 'rgba(0,255,200,'+(0.4+alpha*0.5)+')'; ctx.beginPath(); ctx.arc(x,y, 3 + Math.sin(t/9+i)*1.5, 0, Math.PI*2); ctx.fill(); });
    t++;
    requestAnimationFrame(draw);
  }
  const ro = new ResizeObserver(draw); ro.observe(canvas); draw();
}

