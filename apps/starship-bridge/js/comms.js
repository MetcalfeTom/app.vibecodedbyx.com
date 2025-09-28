export function initComms({ commsEl, pingBtn, distressBtn, beep }) {
  if (!commsEl || !pingBtn || !distressBtn) return;
  function typeLine(text){ const d=document.createElement('div'); d.className='line'; commsEl.prepend(d); let i=0; const iv=setInterval(()=>{ d.textContent = (d.textContent||'') + text[i++]; if(i>=text.length) clearInterval(iv); }, 12); }
  pingBtn.addEventListener('click', ()=>{ if (beep) beep(720,.08,'square'); typeLine('TX> PING… RX< ACK [latency '+(20+Math.random()*80|0)+'ms]'); });
  distressBtn.addEventListener('click', ()=>{ if (beep) beep(220,.2,'sawtooth'); typeLine('TX> DISTRESS SENT. RX< WHO DIS? — NEBULA MAILER-DAEMON'); });
}

