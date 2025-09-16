(() => {
  const $ = (s) => document.querySelector(s);
  const editor = $('#editor');
  const title = $('#docTitle');
  const goalSel = $('#goal');
  const toneSel = $('#tone');
  const hintPanel = $('#hintPanel');
  const wordCount = $('#wordCount');
  const charCount = $('#charCount');
  const readTime = $('#readTime');
  const goalProgress = $('#goalProgress');
  const timerBox = $('#timerBox');
  const timerBar = $('#timerBar');
  const timerLabel = $('#timerLabel');

  // localstorage keys
  const K = {
    body: 'app015-body',
    title: 'app015-title',
    settings: 'app015-settings'
  };

  // restore state
  try {
    editor.value = localStorage.getItem(K.body) || '';
    title.value = localStorage.getItem(K.title) || '';
    const st = JSON.parse(localStorage.getItem(K.settings) || '{}');
    if (st.goal) goalSel.value = st.goal;
    if (st.tone) toneSel.value = st.tone;
  } catch (e) { console.warn('state restore failed', e); }

  // event bindings
  editor.addEventListener('input', () => { persist(); updateStats(); maybeHints(); });
  title.addEventListener('input', () => { persist(); });
  goalSel.addEventListener('change', () => { persist(); updateStats(); });
  toneSel.addEventListener('change', () => { persist(); maybeHints(); });

  $('#newDoc').addEventListener('click', () => {
    if (editor.value.trim().length > 0 && !confirm('clear current document?')) return;
    editor.value = '';
    title.value = '';
    persist();
    updateStats();
    renderHints([]);
  });

  $('#exportMd').addEventListener('click', () => {
    const name = (title.value || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const blob = new Blob([`# ${title.value || 'untitled'}\n\n${editor.value}`], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${name || 'untitled'}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $('#copyAll').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(`# ${title.value || 'untitled'}\n\n${editor.value}`);
      toast('copied');
    } catch (e) { toast('copy failed'); }
  });

  $('#toggleHints').addEventListener('click', () => {
    hintPanel.classList.toggle('hidden');
    if (!hintPanel.classList.contains('hidden')) maybeHints();
  });

  // outline
  $('#outlineBtn').addEventListener('click', () => {
    const t = title.value.trim();
    const base = t || 'your topic';
    const outline = `# ${t || 'untitled'}\n\n` +
      `1. introduction: why ${base} matters\n` +
      `2. key points\n   - point 1\n   - point 2\n   - point 3\n` +
      `3. counterpoint or challenge\n` +
      `4. practical examples\n` +
      `5. conclusion: wrap and next steps\n`;
    if (confirm('insert outline at cursor?')) insertAtCursor(editor, outline);
  });

  // timer (25m)
  let timer = null, startAt = 0, duration = 25 * 60 * 1000;
  $('#toggleTimer').addEventListener('click', () => {
    timerBox.classList.toggle('hidden');
  });
  $('#startTimer').addEventListener('click', () => {
    if (timer) return;
    startAt = Date.now();
    tick();
    timer = setInterval(tick, 200);
  });
  $('#resetTimer').addEventListener('click', () => {
    if (timer) { clearInterval(timer); timer = null; }
    timerBar.style.width = '0%';
    timerLabel.textContent = fmtTime(duration);
  });

  function tick(){
    const elapsed = Date.now() - startAt;
    const remain = Math.max(0, duration - elapsed);
    const pct = Math.min(100, (elapsed / duration) * 100);
    timerBar.style.width = `${pct}%`;
    timerLabel.textContent = fmtTime(remain);
    if (remain <= 0) {
      clearInterval(timer); timer = null; toast('time! take a short break');
    }
  }

  function fmtTime(ms){
    const s = Math.round(ms/1000);
    const m = Math.floor(s/60), ss = s%60;
    return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  }

  function insertAtCursor(el, text){
    const [start,end] = [el.selectionStart, el.selectionEnd];
    const before = el.value.slice(0,start);
    const after = el.value.slice(end);
    el.value = before + text + after;
    el.selectionStart = el.selectionEnd = start + text.length;
    el.focus();
    el.dispatchEvent(new Event('input'));
  }

  function persist(){
    try {
      localStorage.setItem(K.body, editor.value);
      localStorage.setItem(K.title, title.value);
      localStorage.setItem(K.settings, JSON.stringify({ goal: goalSel.value, tone: toneSel.value }));
    } catch(e) {}
  }

  function updateStats(){
    const text = editor.value;
    const words = (text.trim().match(/\b\w+\b/g) || []).length;
    const chars = text.length;
    const mins = Math.max(1, Math.round(words / 200));
    wordCount.textContent = String(words);
    charCount.textContent = String(chars);
    readTime.textContent = `${mins}m`;
    const goal = parseInt(goalSel.value, 10) || 0;
    if (goal > 0) {
      const pct = Math.min(100, Math.round((words/goal)*100));
      goalProgress.textContent = `${words}/${goal} (${pct}%)`;
      goalProgress.style.color = pct >= 100 ? 'var(--good)' : 'var(--ink)';
    } else { goalProgress.textContent = '–'; }
  }

  function maybeHints(){
    if (hintPanel.classList.contains('hidden')) return;
    const text = editor.value;
    const hints = [];

    // passive voice heuristic
    const passive = text.match(/\b(?:was|were|be|been|being|is|are|am)\s+\w+ed\b/gi) || [];
    if (passive.length) hints.push({ tag:'voice', msg:`${passive.length} possible passive constructions. prefer active voice.` });

    // adverbs ending ly
    const adverbs = text.match(/\b\w+ly\b/gi) || [];
    if (adverbs.length) hints.push({ tag:'adverbs', msg:`${adverbs.length} -ly adverbs. cut or pick stronger verbs.` });

    // filler words
    const fillerList = ['just','really','very','quite','perhaps','maybe','sort of','kind of','basically','actually'];
    const fillerCount = fillerList.reduce((n,w)=> n + ((text.match(new RegExp(`\\b${w.replace(/([.*+?^${}()|\\\\\[\]\\/\\\\])/g,'\\$1')}\\b`,'gi'))||[]).length), 0);
    if (fillerCount) hints.push({ tag:'filler', msg:`${fillerCount} filler/hedge words found. tighten your prose.` });

    // sentence length check
    const sentences = text.split(/[.!?]+\s/).filter(Boolean);
    const long = sentences.filter(s => s.split(/\s+/).length > 25).length;
    if (long) hints.push({ tag:'length', msg:`${long} long sentences. aim for 8–18 words.` });

    // tone nudges
    const tone = toneSel.value;
    if (tone === 'concise') hints.push({ tag:'tone', msg:'tone: concise → prefer short sentences and verbs.' });
    if (tone === 'friendly') hints.push({ tag:'tone', msg:'tone: friendly → use warm, direct language.' });
    if (tone === 'formal') hints.push({ tag:'tone', msg:'tone: formal → avoid slang; prefer precise terms.' });

    // good state if few issues
    if (!hints.length && text.trim().length) hints.push({ tag:'good', msg:'looking clean. keep going!', good:true });

    renderHints(hints);
  }

  function renderHints(items){
    hintPanel.innerHTML = items.map(it => `
      <div class="issue ${it.good?'good':''}">
        <span class="tag">${it.tag}</span>
        <span>${escapeHtml(it.msg)}</span>
      </div>
    `).join('') || '<div class="issue"><span class="tag">tips</span><span>toggle to see suggestions as you type.</span></div>';
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]));
  }

  function toast(msg){
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position='fixed'; t.style.bottom='16px'; t.style.left='50%'; t.style.transform='translateX(-50%)';
    t.style.background='#1b1f27'; t.style.border='1px solid #232733'; t.style.padding='8px 12px'; t.style.borderRadius='8px'; t.style.color='var(--ink)'; t.style.boxShadow='var(--shadow)';
    document.body.appendChild(t);
    setTimeout(()=>{ t.remove(); }, 1400);
  }

  // initial paint
  updateStats();
  // show hints if previously open
  if (!hintPanel.classList.contains('hidden')) maybeHints();
})();

