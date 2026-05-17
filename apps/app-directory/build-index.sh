#!/usr/bin/env bash
# Builds index.json for the app-directory app by scanning every
# subdirectory of /vibespace/apps/ and extracting title + og:description
# from each app's index.html. Run from cron to keep the directory fresh.
# The official /_bar/apps-index.json is updated externally and lags
# behind, so we self-serve a complete list from disk.

set -euo pipefail
ROOT="/vibespace/apps"
OUT="/vibespace/apps/app-directory/index.json"
TMP="$(mktemp)"

node --input-type=module -e "
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
const root = '$ROOT';
const dirs = fs.readdirSync(root, {withFileTypes:true})
  .filter(d => d.isDirectory())
  .map(d => d.name);

function pick(html, regex){
  const m = html.match(regex);
  return m ? m[1].trim() : '';
}
function decode(s){
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
          .replace(/&quot;/g,'\"').replace(/&#39;/g,\"'\").replace(/&nbsp;/g,' ');
}

// Bake creators per slug from one git log walk over apps/. For each
// commit, every apps/<slug>/ file touched bumps the (slug, author)
// counter; emit the top 5 authors per slug as {name, commits}.
function bakeCreators(){
  const raw = execSync(
    \"git -C /vibespace log --pretty=format:%H%x09%aN --name-only --since=180.days.ago -- apps/\",
    {encoding:'utf8', maxBuffer: 64*1024*1024}
  );
  const perSlug = new Map();   // slug -> Map<author, count>
  let curAuthor = null, curSeen = null;
  for (const line of raw.split('\n')){
    if (!line){ curAuthor = null; curSeen = null; continue; }
    if (line.includes('\\t')){
      const parts = line.split('\\t');
      if (parts.length === 2){ curAuthor = parts[1]; curSeen = new Set(); continue; }
    }
    if (!curAuthor) continue;
    if (!line.startsWith('apps/')) continue;
    const parts = line.split('/');
    if (parts.length < 2 || !parts[1]) continue;
    const slug = parts[1];
    // count each slug at most once per commit (so a commit touching 10
    // files in one app only adds 1 to that author's tally for that app).
    const key = slug + '\\x00' + curAuthor;
    if (curSeen.has(key)) continue;
    curSeen.add(key);
    if (!perSlug.has(slug)) perSlug.set(slug, new Map());
    const m = perSlug.get(slug);
    m.set(curAuthor, (m.get(curAuthor) || 0) + 1);
  }
  const out = {};
  for (const [slug, m] of perSlug.entries()){
    const ranked = [...m.entries()].sort((a,b) => b[1]-a[1]).slice(0, 5);
    out[slug] = ranked.map(([name, commits]) => ({name, commits}));
  }
  return out;
}

let CREATORS = {};
try { CREATORS = bakeCreators(); }
catch(e){ console.error('creator bake failed:', e.message); }

// The git-author tally is dominated by 'sloppy' (the bot makes 99% of
// commits) so it's not useful for 'find apps by user X'. The real chat
// attribution lives in sloppy-ops/data.json under chat_credits_by_app,
// baked from regex over commit subjects ('per X', 'X's request',
// '(handle)', etc). Merge it in so the directory can filter by chat
// handle.
let CHAT_BY_APP = {};
try {
  const d = JSON.parse(fs.readFileSync('/vibespace/apps/sloppy-ops/data.json','utf8'));
  CHAT_BY_APP = d.chat_credits_by_app || {};
} catch(e){ console.error('chat-credits load failed:', e.message); }

// ── strict genre classifier (server-side, baked into index.json) ─────
// Cascade rule, per chat ask: game/sim signals ALWAYS beat ai/art
// signals regardless of word count. So 'ai-themed boss battle' → Games,
// 'AI Garden Simulator' → Sims, but a pure chatbot or LLM app stays in
// AI. AI/Art are reserved for things that are PRIMARILY about the
// medium, not games that use AI as a flavour.
const GENRE_DEFS = {
  // STRICT — only words that scream 'I AM AN AI/ML PRODUCT' (removed
  // overly generic ones like agent, model, oracle, sage, assistant,
  // prompt, vector, inference, classifier, voice, speech, wave, tf, sd
  // that all matched games/utils too).
  ai: ['ai','llm','gpt','chatbot','chat-bot','pollinations','claude',
       'openai','anthropic','rag','embedding','embeddings','transformer',
       'diffusion','stable-diffusion','dalle','midjourney','flux','imagen',
       'whisper','tts','asr','copilot','machine-learning','sloppy-ai',
       'neural','tensorflow','pytorch','onnx','prompt','prompt-engineer',
       'prompt-optimizer','fine-tune','dataset','training','agent','agents',
       'multi-agent','assistant','rag-pipeline','context-window',
       'completion','completions','grok','mistral','llama','gemini',
       'tokens','token','inference','semantic-search','vector-db',
       'system-prompt','jailbreak','hallucinate','hallucination'],
  art: ['art','draw','drawing','paint','painter','painting','sketch',
        'doodle','pixel-art','generative-art','kaleidoscope','fractal',
        'fractals','mandelbrot','mandelbulb','julia','spirograph',
        'psychedelic','glitch-art','synthwave','neon-art','gallery',
        'mural','graffiti','collage','poster','calligraphy','typography',
        'ascii-art','illustration','color-cycler','palette-art','mosaic',
        'watercolor','visualizer','visualization','shader'],
  games: ['game','arcade','shooter','blaster','dodger','runner','platformer',
          'jumper','breakout','pinball','tetris','snake','pong','asteroids',
          'invaders','dungeon','quest','rpg','roguelike','boss','lives',
          'hi-score','leaderboard','multiplayer','opponent','enemy','slay',
          'fps','puzzle','match-3','slots','casino','blackjack','poker',
          'bingo','chess','checkers','sudoku','crossword','trivia','quiz',
          'hangman','racer','racing','rally','combat','battle','smash',
          'smacker','clash','melee','ninja','samurai','warrior','villain',
          'escape','hunt','hunter','rush','fighter','brawl','brawler',
          'tower-defense','defense','defender','defend','arena','duel',
          'versus','shooting','climb','climber','maze','labyrinth',
          'adventure','dodge','tap','tapper','catcher','soccer','football',
          'basketball','tennis','bowling','golf','arrow','sword','spell',
          'wand','cannon','grenade','laser','missile','rocket','blast',
          'explode','explosion','crash','shoot','attack','attacker',
          'siege','strike','war','warfare','battlefield','knight','wizard',
          'mage','beast','monster','horde','wave-defense','sokoban',
          'gameboy','console-game'],
  sims: ['sim','simulator','simulation','tycoon','idle','clicker','factory',
         'garden','gardener','aquarium','terrarium','ecosystem','farm',
         'farming','farmer','pet','tamagotchi','creature','virtual',
         'evolution','evolve','raise','breed','breeder','grow','grower',
         'ant','ants','bee','bees','koi','sandbox','ragdoll','organism',
         'restaurant','cafe','bakery','kitchen','business','empire',
         'dynasty','kingdom','city-builder','town','village','colony',
         'pasture','meadow','reef','swarm','flock','sloppy-sim','pet-rock',
         'life-sim','idle-slots','life-cycle','population','colony-sim',
         'sandbox-sim'],
  tools: ['tool','editor','generator','calculator','calc','converter',
          'parser','formatter','finder','search','picker','tracker',
          'dashboard','monitor','scanner','viewer','analyzer','planner',
          'checker','validator','builder','maker','organizer','manager',
          'board','kanban','notes','note','todo','todo-list','terminal',
          'shell','cli','console','ide','debugger','repl','regex','json',
          'yaml','markdown','html','css','javascript','python','sql',
          'query','api','oauth','hash','encrypt','decrypt','qr','barcode',
          'palette','font','ruler','timer','stopwatch','clock','alarm',
          'calendar','schedule','weather','currency','unit','translator',
          'dictionary','glossary','wiki','docs','helper','summarizer',
          'redactor','audit','report','log','logger','recorder','annotator',
          'sketchpad','whiteboard','directory','catalog','index','feed',
          'reader','rss','crm','crud','admin','taxonomist','tagger',
          'dispatcher','router','status','health','vitals','overview',
          'metrics','statistics','board','spreadsheet']
};

function escRe(s){ return s.replace(/[-\\/\\\\^\\\$*+?.()|[\\]{}]/g, '\\\\\$&'); }
const _genrePatterns = {};
for (const [g, words] of Object.entries(GENRE_DEFS)){
  // Allow an optional trailing 's' so plural forms match too: 'adventure'
  // catches 'adventures', 'agent' catches 'agents', 'game' catches 'games'.
  // The strict non-alnum boundary on both sides prevents 'promptly' or
  // 'gaming' style false positives.
  _genrePatterns[g] = words.map(w =>
    new RegExp('(^|[^a-z0-9])' + escRe(w) + 's?([^a-z0-9]|\$)', 'i'));
}
function classifyApp(app){
  const hay = ((app.slug||'') + ' ' + (app.title||'') + ' ' +
               (app.desc||'') + ' ' + (app.keywords||'')).toLowerCase();
  const score = {};
  for (const [g, pats] of Object.entries(_genrePatterns)){
    let s = 0;
    for (const re of pats) if (re.test(hay)) s++;
    score[g] = s;
  }
  // STRICT CASCADE — game/sim signals always beat ai/art signals.
  // 1. Any sim hit AND sims >= games → Sims (a 'AI Garden Simulator'
  //    has sims=2 (sim+garden) > games=0 → Sims).
  // 2. Any game hit → Games (so even one 'battle' kicks an AI-themed
  //    app out of AI into Games).
  // 3. Otherwise, AI/Art compete; AI wins ties (slightly more specific).
  // 4. Tools as fallback for utility-ish names.
  // 5. Misc if nothing matched.
  if (score.sims > 0 && score.sims >= score.games) return 'sims';
  if (score.games > 0) return 'games';
  if (score.ai > 0 && score.ai >= score.art) return 'ai';
  if (score.art > 0) return 'art';
  if (score.tools > 0) return 'tools';
  return 'misc';
}

const out = [];
for (const slug of dirs){
  const f = path.join(root, slug, 'index.html');
  let title='', desc='', mtime=0;
  try { mtime = Math.floor(fs.statSync(f).mtimeMs / 1000); }
  catch(e){ continue; }   // skip dirs with no index.html
  let html = '';
  try { html = fs.readFileSync(f, 'utf8').slice(0, 8192); }   // head section is plenty
  catch(e){ continue; }
  title = decode(
    pick(html, /<meta\s+property=[\"']og:title[\"']\s+content=[\"']([^\"']+)[\"']/i) ||
    pick(html, /<title>([^<]+)<\/title>/i)
  );
  desc = decode(
    pick(html, /<meta\s+property=[\"']og:description[\"']\s+content=[\"']([^\"']+)[\"']/i) ||
    pick(html, /<meta\s+name=[\"']description[\"']\s+content=[\"']([^\"']+)[\"']/i)
  );
  // 'creators' on each entry merges both signals: chat handles
  // (real attribution from commit subjects, prioritised) followed by
  // any non-bot git authors. Each entry: {name, commits, kind:'chat'|'git'}.
  const merged = [];
  const seen = new Set();
  for (const c of (CHAT_BY_APP[slug] || [])){
    const name = c.username;
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    merged.push({name, commits: c.mentions, kind: 'chat'});
  }
  for (const c of (CREATORS[slug] || [])){
    const name = c.name;
    if (!name || /^(sloppy|root|bot|system|github|noreply)$/i.test(name)) continue;
    if (seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    merged.push({name, commits: c.commits, kind: 'git'});
  }
  const entry = {slug, mtime, title, desc, keywords: '', creators: merged.slice(0, 6)};
  entry.genre = classifyApp(entry);
  out.push(entry);
}
out.sort((a,b) => a.slug.localeCompare(b.slug));
fs.writeFileSync('$TMP', JSON.stringify(out));
const withCreators = out.filter(a => a.creators && a.creators.length).length;
const tally = {games:0,sims:0,ai:0,art:0,tools:0,misc:0};
for (const a of out) tally[a.genre] = (tally[a.genre]||0)+1;
console.error('indexed', out.length, 'apps ·', withCreators, 'with creator data');
console.error('genres:', JSON.stringify(tally));
const aiList = out.filter(a => a.genre === 'ai').map(a => a.slug);
console.error('AI bucket (' + aiList.length + '):', aiList.slice(0, 20).join(', '), aiList.length > 20 ? '…' : '');
"

mv "$TMP" "$OUT"
chmod 644 "$OUT"
echo "wrote $OUT ($(wc -c < "$OUT") bytes)"
