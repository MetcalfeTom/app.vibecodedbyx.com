export function initViewscreen(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function draw() {
    const rect = canvas.getBoundingClientRect(); canvas.width = rect.width * devicePixelRatio; canvas.height = rect.height * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    const w = rect.width, h = rect.height;
    const g = ctx.createRadialGradient(w*0.7, h*0.3, 30, w*0.4, h*0.6, Math.max(w,h));
    g.addColorStop(0, 'rgba(0,255,200,.10)'); g.addColorStop(0.3,'rgba(0,100,255,.06)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.clearRect(0,0,w,h); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    const n = 80; ctx.strokeStyle = 'rgba(180,230,255,.45)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let i=0;i<n;i++){ const x = (Math.random()*w)|0, y=(Math.random()*h)|0, len = Math.random()*40+10; ctx.moveTo(x,y); ctx.lineTo(x-len, y+len*0.3); }
    ctx.stroke();
    requestAnimationFrame(draw);
  }
  const ro = new ResizeObserver(draw); ro.observe(canvas); draw();
}

