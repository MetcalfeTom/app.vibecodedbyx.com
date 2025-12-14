(() => {
  const TRACKS = [
    { key: 'kick',  label: 'Kick',  color: '#7bd389' },
    { key: 'snare', label: 'Snare', color: '#d3a57b' },
    { key: 'hat',   label: 'Hat',   color: '#9fb0c3' },
    { key: 'ding',  label: 'Ding',  color: '#b99ad6' },
    { key: 'chord', label: 'Chord', color: '#9bd2de' },
    { key: 'error', label: 'Error', color: '#f2a6a6' },
    { key: 'startup', label: 'Startup', color: '#ffd700' },
    { key: 'shutdown', label: 'Shutdown', color: '#ff6347' },
    { key: 'notify', label: 'Notify', color: '#87ceeb' },
    { key: 'tada', label: 'Tada', color: '#ff69b4' },
  ];
  const STEPS = 32;

  // DOM
  const gridEl = document.getElementById('grid');
  const mixRow = document.getElementById('mixRow');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const bpmEl = document.getElementById('bpm');
  const bpmValEl = document.getElementById('bpmVal');
  const lofiEl = document.getElementById('lofi');
  const randomizeBtn = document.getElementById('randomizeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const saveBtn = document.getElementById('saveBtn');
  const loadBtn = document.getElementById('loadBtn');
  const statusEl = document.getElementById('status');

  // State
  let pattern = createEmptyPattern();
  let step = 0;
  let ticking = false;
  let timer = null;

  // Audio
  let ctx = null;
  let master = null; // master gain
  let lofi = null;   // master low-pass
  const channels = new Map(); // trackKey -> { gain }

  function createEmptyPattern(){
    const p = {};
    TRACKS.forEach(t => { p[t.key] = Array(STEPS).fill(false); });
    return p;
  }

  function ensureAudio(){
    if (ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.9;
    lofi = ctx.createBiquadFilter();
    lofi.type = 'lowpass';
    lofi.frequency.value = mapLofi(+lofiEl.value);
    lofi.Q.value = 0.707;
    lofi.connect(master);
    master.connect(ctx.destination);

    // mild compressor for glue
    try {
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -20;
      comp.knee.value = 24;
      comp.ratio.value = 3;
      comp.attack.value = 0.01;
      comp.release.value = 0.1;
      master.disconnect();
      master.connect(comp);
      comp.connect(ctx.destination);
    } catch(e) {
      // optional, ignore
    }

    // channels
    TRACKS.forEach(t => {
      const g = ctx.createGain();
      g.gain.value = 0.9;
      g.connect(lofi);
      channels.set(t.key, { gain: g });
    });
  }

  function mapLofi(v){
    // v in [0..1] => frequency 800..12000 (exponential-ish)
    const min=800, max=12000;
    return min * Math.pow(max/min, v);
  }

  function now(){ return ctx ? ctx.currentTime : 0; }

  // Instruments (Win95‑evoking synths)
  function playKick(time){
    const g = channels.get('kick').gain;
    const osc = ctx.createOscillator();
    const eg = ctx.createGain();
    osc.type='sine';
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(50, time+0.12);
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(1.0, time+0.005);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+0.25);
    osc.connect(eg).connect(g);
    osc.start(time);
    osc.stop(time+0.3);
  }
  function playSnare(time){
    const g = channels.get('snare').gain;
    const noiseBuf = whiteNoiseBuffer();
    const n = ctx.createBufferSource();
    n.buffer = noiseBuf;
    const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1800;
    const bp = ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=2200; bp.Q.value=0.8;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(0.8, time+0.002);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+0.18);
    n.connect(hp).connect(bp).connect(eg).connect(g);
    n.start(time);
    n.stop(time+0.2);
  }
  function playHat(time){
    const g = channels.get('hat').gain;
    const n = ctx.createBufferSource();
    n.buffer = whiteNoiseBuffer();
    const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=6000;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(0.5, time+0.002);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+0.07);
    n.connect(hp).connect(eg).connect(g);
    n.start(time);
    n.stop(time+0.1);
  }
  function playDing(time){
    const g = channels.get('ding').gain;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(0.7, time+0.005);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+0.4);
    [880, 1320].forEach((f,i)=>{
      const o = ctx.createOscillator();
      o.type='sine'; o.frequency.value=f;
      o.connect(eg);
      o.start(time);
      o.stop(time+0.45);
    });
    eg.connect(g);
  }
  function playChord(time){
    const g = channels.get('chord').gain;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(0.6, time+0.02);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+0.6);
    const root=392; // G4
    [root, root*1.25, root*1.5].forEach(f=>{
      const o = ctx.createOscillator();
      o.type='triangle'; o.frequency.value=f;
      o.connect(eg);
      o.start(time);
      o.stop(time+0.65);
    });
    eg.connect(g);
  }
  function playError(time){
    const g = channels.get('error').gain;
    const o = ctx.createOscillator();
    const eg = ctx.createGain();
    o.type='square';
    o.frequency.setValueAtTime(900, time);
    o.frequency.exponentialRampToValueAtTime(220, time+0.25);
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(0.7, time+0.005);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+0.26);
    o.connect(eg).connect(g);
    o.start(time);
    o.stop(time+0.28);
  }
  function playStartup(time){
    const g = channels.get('startup').gain;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(0.6, time+0.05);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+1.2);
    // Windows startup jingle inspired melody
    const notes = [392, 523, 659, 784]; // G4, C5, E5, G5
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(eg);
      o.start(time + i * 0.25);
      o.stop(time + i * 0.25 + 0.35);
    });
    eg.connect(g);
  }
  function playShutdown(time){
    const g = channels.get('shutdown').gain;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(0.6, time+0.05);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+1.0);
    // Windows shutdown inspired (descending)
    const notes = [659, 523, 392, 294]; // E5, C5, G4, D4
    notes.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(eg);
      o.start(time + i * 0.2);
      o.stop(time + i * 0.2 + 0.3);
    });
    eg.connect(g);
  }
  function playNotify(time){
    const g = channels.get('notify').gain;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(0.5, time+0.01);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+0.3);
    // Simple notification beep
    [1047, 1319].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      o.connect(eg);
      o.start(time + i * 0.08);
      o.stop(time + i * 0.08 + 0.12);
    });
    eg.connect(g);
  }
  function playTada(time){
    const g = channels.get('tada').gain;
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, time);
    eg.gain.exponentialRampToValueAtTime(0.7, time+0.05);
    eg.gain.exponentialRampToValueAtTime(0.0001, time+1.5);
    // Tada inspired fanfare
    const melody = [523, 659, 784, 1047]; // C5, E5, G5, C6
    melody.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      o.connect(eg);
      o.start(time + i * 0.15);
      o.stop(time + i * 0.15 + 0.4);
    });
    eg.connect(g);
  }

  // Noise buffer cache
  let _noiseBuf=null;
  function whiteNoiseBuffer(){
    if (_noiseBuf) return _noiseBuf;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i=0;i<data.length;i++) data[i] = Math.random()*2-1;
    _noiseBuf = buffer; return buffer;
  }

  function scheduleStep(s){
    const t = now();
    const stepDur = 60 / (+bpmEl.value) / 4; // 16th note
    const when = t + 0.03; // slight lookahead

    // Visual active column
    highlightColumn(s);

    // Play any active cells
    TRACKS.forEach((tr,i)=>{
      if (!pattern[tr.key][s]) return;
      try {
        switch(tr.key){
          case 'kick':  playKick(when); break;
          case 'snare': playSnare(when); break;
          case 'hat':   playHat(when); break;
          case 'ding':  playDing(when); break;
          case 'chord': playChord(when); break;
          case 'error': playError(when); break;
          case 'startup': playStartup(when); break;
          case 'shutdown': playShutdown(when); break;
          case 'notify': playNotify(when); break;
          case 'tada': playTada(when); break;
        }
      } catch (e) {
        console.error('Audio error', e);
        setStatus('Audio error: '+ e.message);
      }
    });
  }

  function highlightColumn(col){
    document.querySelectorAll('.cell').forEach(c=>c.classList.remove('active'));
    document.querySelectorAll(`.cell[data-col="${col}"]`).forEach(c=>c.classList.add('active'));
  }

  function start(){
    ensureAudio();
    ctx.resume();
    if (ticking) return;
    ticking = true;
    setStatus('Playing...');
    const tick = () => {
      scheduleStep(step);
      step = (step + 1) % STEPS;
    };
    const intervalMs = (60 / (+bpmEl.value) / 4) * 1000;
    tick();
    timer = setInterval(tick, intervalMs);
  }

  function stop(){
    if (!ticking) return;
    ticking = false;
    clearInterval(timer); timer = null;
    setStatus('Stopped.');
  }

  function setStatus(msg){ statusEl.textContent = msg; }

  function buildGrid(){
    gridEl.innerHTML = '';
    TRACKS.forEach((t, rIndex) => {
      const row = document.createElement('div');
      row.className = 'row';

      const label = document.createElement('div');
      label.className = 'label';
      label.innerHTML = `<span style="width:10px;height:10px;border-radius:50%;background:${t.color};display:inline-block"></span>${t.label}`;
      row.appendChild(label);

      for (let c=0;c<STEPS;c++){
        const cell = document.createElement('label');
        cell.className = 'cell';
        cell.dataset.row = String(rIndex);
        cell.dataset.col = String(c);

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = pattern[t.key][c];
        input.addEventListener('change', () => {
          pattern[t.key][c] = input.checked;
          persistDraft();
        });

        const pad = document.createElement('div'); pad.className = 'pad';
        cell.appendChild(input); cell.appendChild(pad);
        row.appendChild(cell);
      }
      gridEl.appendChild(row);
    });
  }

  function buildMixer(){
    mixRow.innerHTML = '';
    TRACKS.forEach(t => {
      const strip = document.createElement('div');
      strip.className = 'strip';
      strip.innerHTML = `
        <h4>${t.label}</h4>
        <label><span>Vol</span> <input type="range" min="0" max="1" step="0.01" value="0.9" data-key="${t.key}" class="vol"></label>
      `;
      mixRow.appendChild(strip);
    });

    mixRow.querySelectorAll('.vol').forEach(el => {
      el.addEventListener('input', e => {
        ensureAudio();
        const key = el.dataset.key;
        const ch = channels.get(key);
        if (ch) ch.gain.gain.value = +el.value;
      });
    });
  }

  // Controls
  startBtn.addEventListener('click', () => {
    try { start(); } catch(e){ setStatus('Failed to start audio.'); console.error(e);} 
  });
  stopBtn.addEventListener('click', stop);
  bpmEl.addEventListener('input', () => {
    bpmValEl.textContent = bpmEl.value;
    if (!ticking) return;
    clearInterval(timer);
    const intervalMs = (60 / (+bpmEl.value) / 4) * 1000;
    timer = setInterval(() => {
      scheduleStep(step);
      step = (step + 1) % STEPS;
    }, intervalMs);
  });
  lofiEl.addEventListener('input', () => {
    ensureAudio();
    lofi.frequency.value = mapLofi(+lofiEl.value);
  });
  randomizeBtn.addEventListener('click', () => {
    randomizePattern();
    buildGrid();
    persistDraft();
    setStatus('Randomized.');
  });
  clearBtn.addEventListener('click', () => {
    pattern = createEmptyPattern();
    buildGrid();
    persistDraft();
    setStatus('Cleared.');
  });
  saveBtn.addEventListener('click', () => {
    try{
      localStorage.setItem('win95_lofi_pattern', JSON.stringify(pattern));
      setStatus('Saved.');
    }catch(e){ setStatus('Save failed.'); }
  });
  loadBtn.addEventListener('click', () => {
    try{
      const raw = localStorage.getItem('win95_lofi_pattern');
      if (!raw) { setStatus('Nothing saved yet.'); return; }
      const obj = JSON.parse(raw);
      if (!obj || !obj.kick) throw new Error('Invalid pattern');
      pattern = obj;
      buildGrid();
      setStatus('Loaded.');
    }catch(e){ setStatus('Load failed.'); }
  });

  function persistDraft(){
    try { localStorage.setItem('win95_lofi_draft', JSON.stringify(pattern)); } catch {}
  }
  function loadDraft(){
    try {
      const raw = localStorage.getItem('win95_lofi_draft');
      if (raw){ const p = JSON.parse(raw); if (p && p.kick) pattern = p; }
    } catch {}
  }

  function randomizePattern(){
    // Create a lo‑fi friendly pattern
    pattern = createEmptyPattern();
    // kick on 1 and 9, maybe 11/13
    [0,8].forEach(i => pattern.kick[i] = true);
    if (Math.random()>0.4) pattern.kick[12] = true;
    if (Math.random()>0.6) pattern.kick[10] = true;
    // snare on 5 and 13
    [4,12].forEach(i => pattern.snare[i] = true);
    // hats mostly on 1/3/5/... with some stutters
    for (let i=0;i<STEPS;i++) if (i%2===0) pattern.hat[i] = Math.random() > 0.15;
    if (Math.random()>0.5) pattern.hat[7] = true;
    if (Math.random()>0.6) pattern.hat[15] = true;
    // ding sparingly
    [2,6,14].forEach(i => { if (Math.random()>0.6) pattern.ding[i] = true; });
    // chord on downbeats
    [0,8].forEach(i => { if (Math.random()>0.3) pattern.chord[i] = true; });
    // error occasional fill
    [11].forEach(i => { if (Math.random()>0.7) pattern.error[i] = true; });
  }

  // Preset buttons
  document.getElementById('presetStartup')?.addEventListener('click', () => {
    pattern = createEmptyPattern();
    pattern.startup[0] = true;
    pattern.chord[0] = true;
    pattern.kick[0] = true;
    buildGrid();
    persistDraft();
    setStatus('Loaded Startup preset.');
  });

  document.getElementById('presetShutdown')?.addEventListener('click', () => {
    pattern = createEmptyPattern();
    pattern.shutdown[0] = true;
    pattern.snare[8] = true;
    pattern.chord[0] = true;
    buildGrid();
    persistDraft();
    setStatus('Loaded Shutdown preset.');
  });

  document.getElementById('presetNotify')?.addEventListener('click', () => {
    pattern = createEmptyPattern();
    pattern.notify[0] = true;
    pattern.notify[4] = true;
    pattern.notify[8] = true;
    pattern.hat[2] = true;
    pattern.hat[6] = true;
    pattern.hat[10] = true;
    buildGrid();
    persistDraft();
    setStatus('Loaded Notify preset.');
  });

  document.getElementById('presetTada')?.addEventListener('click', () => {
    pattern = createEmptyPattern();
    pattern.tada[0] = true;
    pattern.kick[0] = true;
    pattern.kick[8] = true;
    pattern.snare[4] = true;
    pattern.chord[0] = true;
    pattern.chord[8] = true;
    for(let i=0; i<32; i+=2) pattern.hat[i] = true;
    buildGrid();
    persistDraft();
    setStatus('Loaded Tada preset.');
  });

  // Initialize UI
  loadDraft();
  buildGrid();
  buildMixer();
  bpmValEl.textContent = bpmEl.value;
  setStatus('Ready. Tap Start to begin.');

  // Expose a tiny API for public sharing module
  window.Win95App = {
    getPattern: () => JSON.parse(JSON.stringify(pattern)),
    setPattern: (p) => {
      try {
        if (!p || !p.kick || !Array.isArray(p.kick) || p.kick.length !== STEPS) throw new Error('Invalid pattern');
        pattern = p; buildGrid(); persistDraft(); setStatus('Loaded public beat.');
      } catch(e) { setStatus('Failed to load beat.'); }
    },
    getBpm: () => Number(bpmEl.value),
    setBpm: (v) => {
      const val = Math.min(140, Math.max(60, Math.round(v||92)));
      bpmEl.value = String(val); bpmValEl.textContent = String(val);
      // if playing, retime interval
      if (ticking) {
        clearInterval(timer);
        const intervalMs = (60 / (+bpmEl.value) / 4) * 1000;
        timer = setInterval(() => { scheduleStep(step); step = (step + 1) % STEPS; }, intervalMs);
      }
    },
    getLofi: () => Number(lofiEl.value),
    setLofi: (v) => { const val = Math.max(0, Math.min(1, Number(v))); lofiEl.value = String(val); if (ctx) { lofi.frequency.value = mapLofi(val); } },
    start, stop,
  };
})();
