export function initScope(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); let st = 0;
  function draw(){ const r = canvas.getBoundingClientRect(); canvas.width=r.width*devicePixelRatio; canvas.height=r.height*devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); const w=r.width,h=r.height; ctx.clearRect(0,0,w,h); ctx.strokeStyle='rgba(0,255,180,.9)'; ctx.lineWidth=2; ctx.beginPath(); for(let x=0;x<w;x++){ const y = h/2 + Math.sin((x+st)/18)*18 + Math.sin((x+st*0.7)/7)*6; if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.stroke(); st+=2; requestAnimationFrame(draw);} const ro = new ResizeObserver(draw); ro.observe(canvas); draw();
}

