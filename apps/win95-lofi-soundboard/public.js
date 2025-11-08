import supabase, { supabaseSession } from './supabase-config.js';

const beatsBody = document.getElementById('beatsBody');
const publishBtn = document.getElementById('publishBtn');
const beatTitle = document.getElementById('beatTitle');
const pubError = document.getElementById('pubError');
const pubStatus = document.getElementById('pubStatus');

let currentUser = null;

init();

async function init(){
  try {
    const { user } = await supabaseSession();
    currentUser = user;
    await loadBeats();
  } catch (e) {
    showError('Auth failed: ' + e.message);
  }
}

publishBtn.addEventListener('click', async () => {
  clearMsg();
  try {
    if (!currentUser) { await init(); }
    const title = (beatTitle.value || 'Untitled Beat').slice(0, 60);
    const app = window.Win95App;
    if (!app) throw new Error('App API unavailable');
    const pattern = app.getPattern();
    const bpm = Math.round(app.getBpm() || 92);
    const lofi = Math.round((app.getLofi() || 0) * 100);
    if (!hasAnyStep(pattern)) throw new Error('Empty pattern — add some steps first');

    const { error } = await supabase
      .from('lofi_beats')
      .insert([{ title, bpm, lofi, pattern, user_id: currentUser.id }]);
    if (error) throw error;

    pubStatus.textContent = 'Published!';
    beatTitle.value = '';
    await loadBeats();
  } catch (e) {
    showError('Publish failed: ' + e.message);
  }
});

function hasAnyStep(p){
  try {
    const keys = Object.keys(p);
    for (const k of keys){
      const arr = p[k];
      if (Array.isArray(arr) && arr.some(Boolean)) return true;
    }
  } catch {}
  return false;
}

async function loadBeats(){
  try {
    clearMsg();
    beatsBody.innerHTML = '<tr><td colspan="4" class="muted">Loading…</td></tr>';
    const { data, error } = await supabase
      .from('lofi_beats')
      .select('id, title, bpm, lofi, pattern, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    if (!data || data.length === 0) {
      beatsBody.innerHTML = '<tr><td colspan="4" class="muted">No public beats yet. Be the first!</td></tr>';
      return;
    }

    // Fetch user votes to mark toggles
    const myVotes = await getMyVotes();
    const myVoteSet = new Set(myVotes.map(v => String(v.beat_id)));

    // Fetch counts per beat (N+1 for simplicity)
    const rows = [];
    for (const b of data){
      const vc = await countVotes(b.id);
      rows.push(renderBeatRow(b, vc, myVoteSet.has(String(b.id))));
    }
    beatsBody.innerHTML = rows.join('');
    bindRowActions();
  } catch (e) {
    showError('Failed to load beats: ' + e.message);
  }
}

async function getMyVotes(){
  if (!currentUser) return [];
  const { data, error } = await supabase
    .from('lofi_beat_votes')
    .select('beat_id')
    .eq('user_id', currentUser.id)
    .limit(200);
  if (error) { console.warn('Vote load error', error.message); return []; }
  return data || [];
}

async function countVotes(beatId){
  const { count, error } = await supabase
    .from('lofi_beat_votes')
    .select('*', { count: 'exact', head: true })
    .eq('beat_id', beatId);
  if (error) { console.warn('Count error', error.message); return 0; }
  return count || 0;
}

function renderBeatRow(b, votes, haveVoted){
  const you = currentUser && b.user_id === currentUser.id ? ' (you)' : '';
  const title = escapeHtml(b.title || 'Untitled Beat') + you;
  const voteBtn = haveVoted ? `<button class="btn" data-unvote="${b.id}">Unvote</button>` : `<button class="btn" data-vote="${b.id}">Upvote</button>`;
  return `<tr>
    <td>${title}</td>
    <td>${b.bpm}</td>
    <td><span id="votes-${b.id}">${votes}</span></td>
    <td>
      <button class="btn primary" data-play="${b.id}">Play</button>
      ${voteBtn}
    </td>
  </tr>`;
}

function bindRowActions(){
  beatsBody.querySelectorAll('[data-play]').forEach(btn => {
    btn.addEventListener('click', async () => {
      clearMsg();
      const id = Number(btn.dataset.play);
      const { data, error } = await supabase.from('lofi_beats').select('*').eq('id', id).single();
      if (error) { showError('Load failed: ' + error.message); return; }
      try {
        window.Win95App.setPattern(data.pattern);
        window.Win95App.setBpm(data.bpm);
        window.Win95App.setLofi((data.lofi || 0)/100);
        pubStatus.textContent = 'Loaded public beat.';
      } catch (e) { showError('Apply failed: ' + e.message); }
    });
  });

  beatsBody.querySelectorAll('[data-vote]').forEach(btn => {
    btn.addEventListener('click', async () => {
      clearMsg();
      const beatId = Number(btn.dataset.vote);
      try {
        const { error } = await supabase.from('lofi_beat_votes').insert([{ beat_id: beatId, user_id: currentUser.id }]);
        if (error) throw error;
        await refreshRow(beatId);
      } catch (e) { showError('Vote failed: ' + e.message); }
    });
  });

  beatsBody.querySelectorAll('[data-unvote]').forEach(btn => {
    btn.addEventListener('click', async () => {
      clearMsg();
      const beatId = Number(btn.dataset.unvote);
      try {
        const { error } = await supabase.from('lofi_beat_votes').delete().eq('beat_id', beatId).eq('user_id', currentUser.id);
        if (error) throw error;
        await refreshRow(beatId);
      } catch (e) { showError('Unvote failed: ' + e.message); }
    });
  });
}

async function refreshRow(beatId){
  // re-render entire list (simpler)
  await loadBeats();
}

function showError(msg){ pubError.textContent = msg; pubError.style.display = 'block'; }
function clearMsg(){ pubError.style.display = 'none'; pubError.textContent = ''; pubStatus.textContent = ''; }
function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

