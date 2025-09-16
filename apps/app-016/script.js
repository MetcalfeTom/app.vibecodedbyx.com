// sloppy — star seeker: find hidden bright stars in a twinkling sky
(() => {
  'use strict';

  // dom
  const canvas = document.getElementById('sky');
  const ctx = canvas.getContext('2d', { alpha: false });
  const elLevel = document.getElementById('level');
  const elFound = document.getElementById('found');
  const elTargetCount = document.getElementById('targetCount');
  const elTime = document.getElementById('time');
  const elBest = document.getElementById('best');
  const elMsg = document.getElementById('message');
  const restartBtn = document.getElementById('restartBtn');
  const muteBtn = document.getElementById('muteBtn');
  const shareBtn = document.getElementById('shareBtn');

  // sizing
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let width = 0, height = 0;

  // game state
  let stars = [];
  let targets = [];
  let found = new Set();
  let level = 1;
  let playing = false;
  let timeLeft = 30; // seconds per level
  let lastTime = performance.now();
  let ripples = [];
  let lines = [];
  let best = Number(localStorage.getItem('star-seeker-best') || '0');
  elBest.textContent = String(best);
  let muted = localStorage.getItem('star-seeker-muted') === '1';
  updateMuteUI();

  function updateMuteUI(){
    muteBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    muteBtn.textContent = muted ? '🔇' : '🔊';
  }

  function rand(min, max){ return Math.random() * (max - min) + min; }
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  function resize(){
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // starfield generation
  function makeStars(density){
    const count = Math.floor(width * height * density);
    const s = [];
    for (let i = 0; i < count; i++){
      s.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: rand(0.4, 1.6),
        b: rand(0.5, 1),  // base brightness
        tw: rand(0.5, 2.5), // twinkle speed
        ph: Math.random() * Math.PI * 2,
        hue: rand(210, 260) + rand(-8, 8), // cool-ish star tint
      });
    }
    return s;
  }

  function pickTargets(n){
    // pick n of the brightest-ish stars, spaced out
    const candidates = [...stars]
      .sort((a, b) => (b.b + b.r) - (a.b + a.r))
      .slice(0, Math.min(400, stars.length));
    const chosen = [];
    const minDist = Math.min(width, height) * 0.12;
    for (const c of candidates){
      if (chosen.length >= n) break;
      if (chosen.every(o => ((o.x - c.x) ** 2 + (o.y - c.y) ** 2) > (minDist * minDist))) {
        chosen.push(c);
      }
    }
    // if we didn't get enough (tiny screens), just fill from top candidates
    while (chosen.length < n && chosen.length < candidates.length){
      chosen.push(candidates[chosen.length]);
    }
    return chosen;
  }

  function startLevel(lv){
    level = lv;
    const density = clamp(0.00012 + (level - 1) * 0.00003, 0.00012, 0.00038);
    stars = makeStars(density);
    const nTargets = clamp(3 + Math.floor(level * 1.1), 3, 12);
    targets = pickTargets(nTargets);
    found = new Set();
    lines = [];
    ripples = [];
    timeLeft = 30 + Math.max(0, 8 - level); // slightly less time as levels rise
    elLevel.textContent = String(level);
    elFound.textContent = '0';
    elTargetCount.textContent = String(nTargets);
    elTime.textContent = formatTime(timeLeft);
    elMsg.classList.add('hidden');
    playing = true;
    lastTime = performance.now();
  }

  function formatTime(t){
    const s = Math.max(0, Math.floor(t));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return mm + ':' + ss;
  }

  function tone(freq = 440, dur = 0.08, vol = 0.05){
    if (muted) return;
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = vol;
      o.connect(g); g.connect(ac.destination);
      o.start();
      setTimeout(() => { o.stop(); ac.close(); }, dur * 1000);
    } catch { /* ignore audio errors */ }
  }

  function ping(x, y){
    ripples.push({ x, y, r: 0, a: 1 });
    tone(520, 0.06, 0.04);
  }

  function handleTap(clientX, clientY){
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ping(x, y);
    // check for nearby target
    const radius = Math.max(18, Math.min(28, Math.min(width, height) * 0.02));
    let hitIndex = -1;
    for (let i = 0; i < targets.length; i++){
      if (found.has(i)) continue;
      const t = targets[i];
      const d2 = (t.x - x) ** 2 + (t.y - y) ** 2;
      if (d2 <= radius * radius){ hitIndex = i; break; }
    }
    if (hitIndex >= 0){
      found.add(hitIndex);
      elFound.textContent = String(found.size);
      tone(740, 0.08, 0.06);
      // add a tiny connection line from last found
      const idxs = [...found];
      if (idxs.length >= 2){
        const a = targets[idxs[idxs.length - 2]];
        const b = targets[idxs[idxs.length - 1]];
        lines.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, a: 0 });
      }
      if (found.size === targets.length){
        // level complete
        playing = false;
        const score = level; // simple scoring by reached level
        if (score > best){ best = score; localStorage.setItem('star-seeker-best', String(best)); elBest.textContent = String(best); }
        elMsg.textContent = `nice! you found them all. advancing to level ${level + 1}.`;
        elMsg.classList.remove('hidden');
        setTimeout(() => startLevel(level + 1), 1400);
      }
    } else {
      // soft hint: draw a faint pulse on nearest target direction
      const nearest = targets
        .filter((_, i) => !found.has(i))
        .map((t, i) => ({ i, d: (t.x - x) ** 2 + (t.y - y) ** 2 }))
        .sort((a, b) => a.d - b.d)[0];
      if (nearest){
        const t = targets[nearest.i];
        // add a very faint guiding ripple closer to target
        ripples.push({ x: t.x, y: t.y, r: 0, a: 0.22 });
      }
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    handleTap(e.clientX, e.clientY);
  }, { passive: false });

  restartBtn.addEventListener('click', () => startLevel(1));
  muteBtn.addEventListener('click', () => { muted = !muted; localStorage.setItem('star-seeker-muted', muted ? '1' : '0'); updateMuteUI(); });
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'star seeker — find the hidden stars',
      text: 'i am finding hidden stars in this cozy night-sky game ✨',
      url: 'https://app-016.vibecodedbyx.com/'
    };
    if (navigator.share){
      try { await navigator.share(shareData); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        flashMessage('link copied to clipboard');
      } catch {}
    }
  });

  function flashMessage(text){
    elMsg.textContent = text;
    elMsg.classList.remove('hidden');
    setTimeout(() => elMsg.classList.add('hidden'), 1200);
  }

  // render
  function drawBackground(){
    // subtle vertical gradient night sky
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, '#0a0f1d');
    g.addColorStop(1, '#060912');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  function drawStars(t){
    ctx.save();
    for (let i = 0; i < stars.length; i++){
      const s = stars[i];
      const twinkle = 0.55 + 0.45 * Math.sin((t * 0.001 * s.tw) + s.ph);
      const bright = s.b * twinkle;
      const isTarget = targets.includes(s);
      const r = s.r * (isTarget ? 1.5 : 1.0) + (isTarget ? 0.4 * twinkle : 0);
      const alpha = clamp(0.35 + bright * 0.65, 0.35, 1);
      ctx.beginPath();
      ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      ctx.closePath();
      if (isTarget){
        ctx.fillStyle = `hsla(${s.hue}, 90%, ${70 + twinkle * 20}%, ${alpha})`;
      } else {
        ctx.fillStyle = `hsla(${s.hue}, 70%, ${65 + twinkle * 20}%, ${alpha})`;
      }
      ctx.fill();
    }
    ctx.restore();
  }

  function drawLines(){
    if (!lines.length) return;
    ctx.save();
    ctx.lineWidth = 1.6;
    for (const ln of lines){
      ln.a = clamp(ln.a + 0.05, 0, 1);
      ctx.strokeStyle = `rgba(138,182,255,${0.18 * ln.a})`;
      ctx.beginPath();
      ctx.moveTo(ln.ax, ln.ay);
      ctx.lineTo(ln.bx, ln.by);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRipples(dt){
    ctx.save();
    for (let i = ripples.length - 1; i >= 0; i--){
      const p = ripples[i];
      p.r += dt * 0.18 * Math.min(width, height);
      p.a *= 0.96;
      if (p.a < 0.01){ ripples.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(138,182,255,${p.a * 0.3})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFoundMarkers(){
    ctx.save();
    for (const i of found){
      const t = targets[i];
      ctx.beginPath();
      ctx.arc(t.x, t.y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(121,255,168,0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  function loop(now){
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    if (playing){
      timeLeft -= dt;
      elTime.textContent = formatTime(timeLeft);
      if (timeLeft <= 0){
        playing = false;
        elMsg.textContent = 'time! better luck on the next night ✨';
        elMsg.classList.remove('hidden');
        tone(220, 0.12, 0.05);
      }
    }

    drawBackground();
    drawStars(now);
    drawLines();
    drawRipples(dt);
    drawFoundMarkers();

    requestAnimationFrame(loop);
  }

  // kick off
  startLevel(1);
  requestAnimationFrame(loop);
})();

