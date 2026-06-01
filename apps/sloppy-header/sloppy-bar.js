/**
 * SloppyBar - Universal Identity Header for sloppy.live
 *
 * Usage: <script src="/sloppy-header/sloppy-bar.js"></script>
 *
 * Options (via data attributes on script tag):
 *   data-position="top|bottom" (default: bottom)
 *   data-theme="dark|light|auto" (default: dark)
 *   data-minimized="true|false" (default: false)
 *   data-hide-karma="true|false" (default: false)
 *   data-hide-links="true|false" (default: false)
 */

(function() {
  'use strict';

  // Configuration
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const RECENT_APPS_KEY = 'sloppy_recent_apps';
  const MAX_RECENT_APPS = 8;
  // Version string used to cache-bust child resources (sync worker) and
  // exposed on window.SLOPPY_BAR_VERSION so apps can append it to their
  // own <script src="/sloppy-header/sloppy-bar.js?v=…"> tags too.
  // Bump this string when shipping changes that need to defeat the
  // browser/CDN HTTP cache (e.g. tweaks chat is reporting as 'stale').
  const BAR_VERSION = '2026-06-01a';
  try { window.SLOPPY_BAR_VERSION = BAR_VERSION; } catch (_) {}
  // Consolidated to primary instance — previous header instance (dtfaplmockmwvgyqxbep) is dead/unreachable
  const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

  // Get script options
  const script = document.currentScript;
  const options = {
    position: script?.getAttribute('data-position') || 'bottom',
    theme: script?.getAttribute('data-theme') || 'dark',
    // Default MINIMIZED again — chat requested the collapsed-pill default
    // so the bar doesn't eat screen real estate on visualization / game
    // apps. The toggle still lives at the corner, and apps that want the
    // expanded bar by default can set <script data-minimized="false" ...>.
    minimized: script?.getAttribute('data-minimized') !== 'false',
    hideKarma: script?.getAttribute('data-hide-karma') === 'true',
    hideLinks: script?.getAttribute('data-hide-links') === 'true'
  };

  // App categories for discovery mode
  const APP_CATEGORIES = {
    'Games': ['6502-emulator','abstract-tower-defense','alien-artillery','alpha-blast','angry-cookie','asteroids','ball-pit','batsman','beef-clicker','bikini-bottom-brawl','bladder-blast','boss-blocker','bouldering-game','bouncy-berry','breakfast-game','breakout-terminal','candle-jumper','candle-sailor','cat-zap','chaos-blocks','cloud-jumper','code-sprint','code-unlock','coin-pusher','color-match','cosmic-cat-quest-pp','cube-escape','diamond-drill','digit-brain','doom-3d','doom-port','dungeon-crawler','dunny-dash','eggcraft','emoji-shooter','fighting-game','fly-simulator','gemini-puzzle','geometry-dash','ghost-runner','glitchmon','goblin-loot','golden-game','grape-duel','grapple-bot','gravity-flip','gravity-surfer','hex-conquest','hippo-pizzeria','hydraulic-press','icy-tower','impossible-platform','mate-clicker','maze-pathfinder','maxz00m-tictactoe','mech-suit','minecraft','monster-mash','motorbike-racing','nacho-empire','neon-asteroids','neon-bowling','neon-casino','neon-crash','neon-dodgeball','neon-drift','neon-drill','neon-flap','neon-flappy','neon-heist','neon-invaders','neon-pong','neon-racer','neon-slice','neon-snake','neon-tetris','neon-tickle-defense','nuke-sim','orbital-strike','ornament-toss','pancake-stack','phaser-platformer','pho-game','physics-balls','pirate-laser','platformer','pokemon-clone','polybius','pong-terminal','quarantine-pinball','romance-quest','sandwich-stack','sandustry-clone','sensible-soccer','simon-says','simpsons-road-rage','sky-unlimited','slap-battle','sloppy-civ','sloppy-hunt','sloppy-lance','sloppy-slots','snake','snowball-fight','space-chess','space-invaders','space-taco','space-xmas-blocks','sql-towers','star-catcher','submarine-craft','terminal-escape','tetris-mobile','tetris-terminal','tetris','the-unclickable','tic-tac-toe','tickle-defense','tictactoe','toilet-run','train-signals','void-fishing','word-bricks','yorkie-stacker'],
    'Creative': ['ascii-art','ascii-fish','aurora-lab','chrome-sphere','confetti-cannon','cosmic-shapes','dancing-whales','disco-ball','dos-anime-dream','dutch-still-life','fractal-dance','generative-art','gigglesound','graffiti-wall','kaleidoscope','laughter-fractals','lava-lamp','neon-bonsai','neon-donut','neon-dream-visualizer','neon-fireworks','neon-flower','neon-fluid','neon-lava-lamp','neon-life','neon-maelstrom','neon-particles','neon-storm','neon-water','neon-zen','p5-art','pixel-bonfire','pixel-editor','prism-echo','quaternion-orbits','quine-viz','sand-sandbox','south-park-creator','sticker-workshop','text-effects','truchet-tiles','voxel-terrain','voxel-world','webgl-text'],
    'Music': ['drum-machine','neon-rave','neon-soundboard','neon-synth','oscillator','sid-emulator','synth-collab','synth-player','synth','thiel-soundboard','tune-scout','win95-lofi-soundboard','ghost-town-radio'],
    'Social': ['chat-buddy','chat-boss-battle','chatcloud','comedy-club','confession-wall','cosmic-chat','discord-clone','feedback','karma-board','karma-feed','manifesto-generator','neon-guestbook','prank-names','simple-chat','sloppygram','sloppys-manifesto','toiletgram','love-sloppy','simp-meter'],
    'Tools': ['analog-dash','bags-tracker','btc-tracker','calorie-tracker','chart-comparison','chaos-organizer','crt-calculator','crypto-tools','dp-pathfinder','file-generator','finance-shorts','focus-buddy','git-sim','gitscope','golden-stopwatch','gratitude-journal','inventory-manager','json-toon-converter','kanban','lint-roller','mechanical-calculator','solana-tracker','tombstone-todo','train-scheduler','treasure-calculator','tsp-genetic','ubicacion-geografica','world-monitor','writer'],
    'Weird': ['bad-advice','brainrot-os','cowsay','dan-detector','deadfish','desperate-ai','existential-autocorrect','fake-reviews','fake-shutdown','future-news','gorilla-fart','grave-generator','judgmental-cat','knowledge-chaos','laughter-meter','mundane-adventure','mundane-poetry','mysterious-life','not-human-cult','nuclear-pizza','ouija-board-v2','ouija-board','page-of-nothingness','poo-palace','rugpull-simulator','silence-collector','silence-meter','snark-terminal','the-last-word','the-singularity','the-void','throne-rater','trope-mixer','trump-truth'],
    'Sim': ['bear-cycle','butter-physics','cozy-pet','cute-duck','evo-sandbox','fish-tank','fluid-sim','fox-berries','fox-den','fox-playground','fox-tickle-sim','fox-tickle','gravity-vortex','jellyfish-abyss','lil-sloppy','micro-city','moon-explorer','neon-aquarium','neon-fox-chaos','neon-pet','neon-weather','planets','plant-cli','raptor-pet','seahorse','sloppy-os','space-flight','swarm-nexus','tickle-explosion','tickle-grape','tickle-reactor','zen-garden'],
    'Retro': ['black-hole-vortex','blue-box','glitch-vending','hacker-terminal','mac-os9','malloc-madness','matrix-friends','matrix-rain','neon-alarm-clock','neon-phone','neon-terminal','vhs-deck','web-os','win95','windows-95','xp-desktop'],
    'Security': ['access-denied','aegis-protocol','audit-report','cyber-notes','cyber-shield','cyber-vault','detective-board','eggnet-sentinel','evidence-board','fox-security','fox-trap','live-scanner','nda-redactor','network-scan','night-watch','obsidian-security','purple-scanner','purple-trap','redact-o-matic','secret-shredder','witness-protection'],
    'Explore': ['app-directory','app-roulette','app-taxonomist','breath-visualizer','coffee-facts','deprecated-trivia','deutsch-dash','dreamy-sleep','genealogist','hobbit-trip','interactive-novel','lighthouse','logic-grove','minecraft-guide','narnia-map','random-greeting','search-bridge','shenzhen-spa-finder','tag-explorer','uk-pub-finder','wiki-scout','yoga'],
    'Sloppy': ['activity-overlay','chat-pulse-monitor','chat-suggestions','content-manager','crisis-dashboard','federated-truth','fee-watchtower','overview','sloppy-analytics','sloppy-coin-info','sloppy-community','sloppy-dashboard','sloppy-flow','sloppy-id','sloppy-says','sloppy-spectrum','sloppy-xp','sloppys-gift','sploppy','status-dashboard','swarm-oracle','system-health']
  };

  // === Ecosystem modules ===
  // The core sloppygram-extracted apps that should be one-click-reachable from
  // every page across the network. Ordered roughly by traffic / centrality.
  // Categorized into 4 groups: TALK / IDENTITY / MAKE / PLAY for the dropdown
  // section headers. Each entry: { path, name, icon, cat, desc }.
  const ECOSYSTEM_MODULES = [
    // TALK
    { path: 'sloppy-chat',       name: 'Chat',       icon: '💬', cat: 'TALK',     desc: 'global green-phosphor chatroom' },
    { path: 'sloppy-dms',        name: 'DMs',        icon: '💌', cat: 'TALK',     desc: 'direct messages' },
    { path: 'sloppy-feed',       name: 'Feed',       icon: '📰', cat: 'TALK',     desc: 'global posts timeline' },
    { path: 'sloppy-alerts',     name: 'Alerts',     icon: '🔔', cat: 'TALK',     desc: 'mentions / events feed' },
    // IDENTITY
    { path: 'sloppy-id',         name: 'Vault',      icon: '🪪', cat: 'IDENTITY', desc: 'your identity, vault, gifts' },
    { path: 'karma-board',       name: 'Karma',      icon: '📊', cat: 'IDENTITY', desc: 'karma leaderboard' },
    { path: 'sloppy-profiles',   name: 'Profiles',   icon: '👤', cat: 'IDENTITY', desc: 'people directory' },
    { path: 'sloppy-network',    name: 'Network',    icon: '🕸',  cat: 'IDENTITY', desc: 'social graph' },
    // MAKE
    { path: 'sloppy-canvas',     name: 'Canvas',     icon: '🎨', cat: 'MAKE',     desc: 'collab whiteboard' },
    { path: 'sloppy-radio',      name: 'Radio',      icon: '📻', cat: 'MAKE',     desc: 'synchronized radio' },
    { path: 'sloppy-manifestos', name: 'Manifestos', icon: '📜', cat: 'MAKE',     desc: 'long-form essays' },
    { path: 'sloppys-gift',      name: 'Gifts',      icon: '🎁', cat: 'MAKE',     desc: 'generate sigil artifacts' },
    // PLAY
    { path: 'sloppy-factions',   name: 'Factions',   icon: '⚔',  cat: 'PLAY',     desc: 'territory wars' },
    { path: 'sloppy-oracle',     name: 'Oracle',     icon: '🔮', cat: 'PLAY',     desc: 'community Q&A' },
    { path: 'sloppy-tags',       name: 'Tags',       icon: '🏷',  cat: 'PLAY',     desc: 'tag explorer' },
    { path: 'sloppy-feedback',   name: 'Feedback',   icon: '💡', cat: 'PLAY',     desc: 'ideas + voting' },
    // WIDGETS — in-bar floating panels (moved out of the main bar to declutter).
    // Items with `action` are rendered as <button onclick=...> instead of <a href=...>.
    { name: 'Notepad', icon: '📝', cat: 'WIDGETS', desc: 'scratchpad · auto-saves to this browser', action: 'sloppyBarToggleNotepad' },
    { name: 'Twitch',  icon: '📺', cat: 'WIDGETS', desc: 'movable Twitch stream player',            action: 'sloppyBarToggleTwitch' },
  ];

  // Build flat list + reverse lookup (curated fallback)
  const TELEPORT_APPS = [...new Set(Object.values(APP_CATEGORIES).flat())];
  const APP_TO_CATEGORY = {};
  for (const [cat, apps] of Object.entries(APP_CATEGORIES)) {
    for (const app of apps) APP_TO_CATEGORY[app] = APP_TO_CATEGORY[app] || cat;
  }

  // === Live app-directory index (full 1,292+ catalogue) ===
  // The curated APP_CATEGORIES above stays as a hand-tuned fallback; the live
  // index from /app-directory/index.json is loaded lazily on first panel open
  // so teleportation reaches every published app, not just the curated subset.
  const LIVE_INDEX_URL = '/app-directory/index.json';
  const LIVE_INDEX_SS_KEY = 'sloppy_live_index_v1';
  const LIVE_INDEX_TTL = 10 * 60 * 1000; // 10 min sessionStorage cache
  const LIVE_GENRE_EMOJI = { games:'🎮', sims:'🌿', tools:'🛠', art:'🎨', ai:'🤖', misc:'◆' };
  let LIVE_INDEX = null;      // array of {slug,title,desc,genre,creators,mtime}
  let LIVE_INDEX_BY_SLUG = null;
  let _liveIndexLoading = null;

  function _hydrateLiveIndex(arr) {
    LIVE_INDEX = arr;
    LIVE_INDEX_BY_SLUG = Object.create(null);
    for (const e of arr) { if (e && e.slug) LIVE_INDEX_BY_SLUG[e.slug] = e; }
  }

  // Try a synchronous warm-load from sessionStorage so first paint can use it
  try {
    const raw = sessionStorage.getItem(LIVE_INDEX_SS_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached && Array.isArray(cached.data) && (Date.now() - cached.ts) < LIVE_INDEX_TTL) {
        _hydrateLiveIndex(cached.data);
      }
    }
  } catch {}

  function loadLiveIndex() {
    if (LIVE_INDEX) return Promise.resolve(LIVE_INDEX);
    if (_liveIndexLoading) return _liveIndexLoading;
    _liveIndexLoading = fetch(LIVE_INDEX_URL, { cache: 'no-cache' })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(arr => {
        if (!Array.isArray(arr) || !arr.length) throw new Error('empty index');
        _hydrateLiveIndex(arr);
        try { sessionStorage.setItem(LIVE_INDEX_SS_KEY, JSON.stringify({ ts: Date.now(), data: arr })); } catch {}
        return arr;
      })
      .catch(e => {
        console.warn('[sloppy-bar] live index unavailable, falling back to curated list:', e?.message || e);
        // Build a minimal synthetic index from the curated lists so callers still get something
        const synthetic = TELEPORT_APPS.map(slug => ({
          slug, title: slug, desc: '', genre: (APP_TO_CATEGORY[slug] || 'misc').toLowerCase(), creators: []
        }));
        _hydrateLiveIndex(synthetic);
        return synthetic;
      })
      .finally(() => { _liveIndexLoading = null; });
    return _liveIndexLoading;
  }

  // Best-effort: return the full live slug list if loaded, else curated fallback
  function getTeleportPool() {
    if (LIVE_INDEX) return LIVE_INDEX.map(e => e.slug);
    return TELEPORT_APPS;
  }

  // Visited apps tracking for weighted random
  const VISITED_KEY = 'sloppy_visited_apps';
  function getVisitedApps() {
    try { return JSON.parse(localStorage.getItem(VISITED_KEY) || '{}'); } catch { return {}; }
  }
  function markVisited(app) {
    const v = getVisitedApps();
    v[app] = Date.now();
    try { localStorage.setItem(VISITED_KEY, JSON.stringify(v)); } catch {}
  }
  // Mark current app as visited on load
  const _curApp = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').split('/')[0];
  if (_curApp) markVisited(_curApp);

  function weightedRandomPick(apps) {
    const visited = getVisitedApps();
    const now = Date.now();
    // Weights: unvisited = 10, visited >7d ago = 5, visited >1d ago = 2, visited recently = 1
    const weighted = apps.map(app => {
      const ts = visited[app];
      if (!ts) return { app, weight: 10 };
      const daysAgo = (now - ts) / 86400000;
      if (daysAgo > 7) return { app, weight: 5 };
      if (daysAgo > 1) return { app, weight: 2 };
      return { app, weight: 1 };
    });
    const totalWeight = weighted.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * totalWeight;
    for (const w of weighted) {
      r -= w.weight;
      if (r <= 0) return w.app;
    }
    return weighted[weighted.length - 1].app;
  }

  // State
  let supabase = null;
  let currentUser = null;
  let userData = { karma: 0, rank: null, premium: false, username: 'Guest', trustScore: 0, verificationLevel: 0, verifiedProviders: [] };
  let isMinimized = options.minimized;
  let cacheTimestamp = 0;
  let dropdownOpen = false;

  // === Vote state ===
  let _sloppyVoteSlug = null;
  let _sloppyVoteCount = 0;
  let _sloppyVoteUserVoted = false;

  // === Chat state ===
  // Compact live-chat toggle that streams from sloppygram_messages. The chat
  // panel is mutually exclusive with the bell panel — opening one closes the
  // other. Subscription is opened on first panel-open and torn down on close
  // to keep idle tabs from holding a websocket. While the panel is closed,
  // new messages bump _chatUnseenCount which surfaces as a badge on the
  // chat button. The user's own messages don't count against unseen.
  const CHAT_PAGE_SIZE = 25;
  const CHAT_MSG_MAX = 500; // client-side cap on outbound message length
  let _chatPanelOpen = false;
  let _chatUnseenCount = 0;
  let _chatMessages = [];     // newest at the end
  let _chatChannel = null;
  let _chatSendingLock = false;

  // === Notification state ===
  // Persisted log of recent notifications, capped at 30, newest-first.
  // Each entry: { id, type, icon, msg, ts, read, action?: {label, href} }
  const NOTIF_KEY = 'sloppy_notif_log_v1';
  const NOTIF_MAX = 30;
  const TOAST_DEDUPE_WINDOW = 4000; // ms
  const TOAST_RATE_MIN = 250;       // ms between toasts
  const TOAST_MAX_VISIBLE = 4;
  let _notifLog = [];
  let _notifUnreadCount = 0;
  let _notifPanelOpen = false;
  let _toastLastTime = 0;
  let _toastRecent = []; // [{msg, type, ts}] for dedupe
  let _lastSeenUnreadDmCount = 0;
  let _lastSeenUnreadMentionCount = 0;

  function _loadNotifLog() {
    try {
      const raw = localStorage.getItem(NOTIF_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          _notifLog = parsed.slice(0, NOTIF_MAX);
          _notifUnreadCount = _notifLog.filter(n => !n.read).length;
        }
      }
    } catch {}
  }
  function _persistNotifLog() {
    try { localStorage.setItem(NOTIF_KEY, JSON.stringify(_notifLog)); } catch {}
  }
  _loadNotifLog();

  // Detect current app slug from URL path
  (function() {
    try {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
      if (path && path !== '' && path !== 'sloppy-header' && path !== 'index.html') {
        _sloppyVoteSlug = path;
      }
    } catch (e) {}
  })();
  // ===================================================================
  // === IFRAME-WRAPPER DETECTION ======================================
  // ===================================================================
  // nginx wraps every app inside /_bar/index.html — an outer iframe
  // host that ALREADY renders its own voting/teleport/karma bar at the
  // top of the viewport. When this inner sloppy-bar.js ALSO renders a
  // vote button, chat sees two upvote pills stacked vertically. Detect
  // that case (we're embedded in any same-origin parent that owns a
  // sloppy-bar) and suppress our own duplicate vote button so only the
  // outer one renders.
  let _isInsideWrapper = false;
  (function() {
    try {
      if (window.self === window.top) return;     // standalone, render normally
      // Same-origin iframe: peek at parent to check for an outer bar.
      // Cross-origin throws on document access — treat as not-wrapped.
      const parentBar = window.parent && window.parent.document &&
        (window.parent.document.getElementById('sloppy-bar') ||
         window.parent.document.querySelector('.sloppy-bar, .bar-vote, [data-sloppy-wrapper]'));
      if (parentBar) _isInsideWrapper = true;
    } catch (_) { /* cross-origin parent — assume standalone */ }
  })();
  function _shouldRenderVote() { return !!_sloppyVoteSlug && !_isInsideWrapper; }

  // === SharedWorker state (Phase 3) ===
  let syncWorker = null;
  let syncWorkerReady = false;
  let isLeaderTab = false;
  let _workerTabCount = 0;
  const _tabId = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const _seenEvents = new Set(); // dedup fingerprints with TTL

  // === SYNC HUB (Phase 1) ===
  // BroadcastChannel for cross-tab communication
  let syncChannel = null;
  try { syncChannel = new BroadcastChannel('sloppy-sync'); } catch (e) { /* BroadcastChannel not supported */ }

  // Event bus for same-page subscribers
  const _eventListeners = {};

  // Enriched user context (shared across ecosystem)
  const userContext = {
    // Auth state
    isAuthenticated: false,
    authProvider: null, // 'twitter' | 'anonymous' | null
    // Identity (from DB + auth)
    userId: null,
    username: 'Guest',
    isTwitter: false,
    avatar: null,
    avatarUrl: null,
    // Scores (from DB)
    karma: 0,
    rank: null,
    premium: false,
    // Profile (from shared localStorage)
    bio: null,
    color: null,
    bgUrl: null,
    // Trust & Verification (from sloppyid_verifications)
    trustScore: 0,
    verificationLevel: 0, // 0=none, 1=basic, 2=verified, 3=fully verified
    verifiedProviders: [], // ['twitter','email','github']
    // Notifications (from unread-changed events)
    unreadCount: 0,
    // Theme (from shared localStorage)
    theme: null,
    // State
    currentApp: _curApp || null,
    ready: false,
    timestamp: 0
  };

  // SecureStorage reader (compatible with monolith's XOR+Base64 encoding)
  const _SK = 'sl0ppy_2024';
  const _SV = 'v1:';
  function _ssGet(key) {
    try {
      var stored = localStorage.getItem(key);
      if (!stored) return null;
      if (!stored.startsWith(_SV)) return JSON.parse(stored);
      var b64 = stored.slice(_SV.length);
      var obf = decodeURIComponent(escape(atob(b64)));
      var json = '';
      for (var i = 0; i < obf.length; i++) {
        json += String.fromCharCode(obf.charCodeAt(i) ^ _SK.charCodeAt(i % _SK.length));
      }
      return JSON.parse(json);
    } catch (e) { return null; }
  }

  // Read profile + theme from shared localStorage
  function enrichContextFromLocalStorage() {
    var profile = _ssGet('sloppygram_profile');
    if (profile) {
      if (profile.username && !userContext.isTwitter) userContext.username = profile.username;
      userContext.avatar = profile.avatar || null;
      userContext.avatarUrl = profile.avatarUrl || null;
      userContext.bio = profile.bio || null;
      userContext.color = profile.color || null;
      userContext.bgUrl = profile.bgUrl || null;
    }
    var theme = _ssGet('sloppygram_theme');
    if (theme) {
      userContext.theme = theme;
    } else {
      userContext.theme = null;
    }
    // Opacity settings
    var msgOpacity = localStorage.getItem('sloppygram_msg_opacity');
    var widgetOpacity = localStorage.getItem('sloppygram_widget_opacity');
    if (msgOpacity || widgetOpacity) {
      userContext.theme = userContext.theme || {};
      if (msgOpacity) userContext.theme.msgOpacity = parseInt(msgOpacity);
      if (widgetOpacity) userContext.theme.widgetOpacity = parseInt(widgetOpacity);
    }
  }

  // === SharedWorker init + handlers ===

  function initSyncWorker() {
    if (typeof SharedWorker === 'undefined') return;
    try {
      syncWorker = new SharedWorker('/sloppy-header/sloppy-sync-worker.js?v=' + BAR_VERSION, { name: 'sloppy-sync' });
      syncWorker.port.onmessage = handleWorkerMessage;
      syncWorker.onerror = function(err) {
        console.warn('[SloppyBar] SharedWorker error, falling back to BroadcastChannel', err);
        syncWorker = null;
        syncWorkerReady = false;
      };
      syncWorker.port.postMessage({ type: 'register', tabId: _tabId, app: _curApp });
      // 3-second timeout: if no registered response, proceed without worker
      var timeout = setTimeout(function() {
        if (!syncWorkerReady) {
          console.warn('[SloppyBar] SharedWorker timeout, falling back');
          syncWorker = null;
        }
      }, 3000);
      // Stash timeout so we can clear it on success
      syncWorker._initTimeout = timeout;
    } catch (e) {
      console.warn('[SloppyBar] SharedWorker unavailable:', e.message);
      syncWorker = null;
    }
  }

  function handleWorkerMessage(e) {
    var msg = e.data;
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'registered':
        syncWorkerReady = true;
        isLeaderTab = msg.isLeader;
        _workerTabCount = msg.tabCount || 1;
        if (syncWorker && syncWorker._initTimeout) clearTimeout(syncWorker._initTimeout);
        // Apply cached context from worker if available
        if (msg.cachedContext) {
          applyWorkerContext(msg.cachedContext);
        }
        break;

      case 'context-cached':
        if (msg.context) {
          applyWorkerContext(msg.context);
        }
        break;

      case 'event-relay':
        // Dedup check — skip if already received via BroadcastChannel
        if (dedupeEvent(msg)) return;
        _fireLocal(msg.event, {
          event: msg.event,
          data: msg.data || {},
          source: msg.source,
          timestamp: msg.timestamp
        });
        // Auto-apply theme changes
        if (msg.event === 'theme-changed' && msg.data && msg.data.vars) {
          var vars = msg.data.vars;
          for (var key in vars) {
            if (vars.hasOwnProperty(key)) {
              document.documentElement.style.setProperty(key, vars[key]);
            }
          }
        }
        // Refresh context on identity/karma changes
        if (msg.event === 'identity-changed' || msg.event === 'karma-changed') {
          cacheTimestamp = 0;
          enrichContextFromLocalStorage();
        }
        // Update notification dot
        if (msg.event === 'unread-changed' && msg.data) {
          _applyUnreadCount(msg.data);
        }
        // Update trust badges
        if (msg.event === 'verification-changed' && msg.data) {
          _applyVerification(msg.data);
        }
        // Feed bell + (optionally) toast
        try { _autoFeedFromSyncEvent(msg.event, msg.data); } catch(e) {}
        break;

      case 'leader-assigned':
        isLeaderTab = msg.isLeader;
        // If newly elected leader and cache might be stale, fetch
        if (isLeaderTab && (!cacheTimestamp || Date.now() - cacheTimestamp > CACHE_DURATION)) {
          fetchUserData();
        }
        break;

      case 'fetch-context':
        // Worker is asking this tab (leader) to run DB queries
        if (isLeaderTab) {
          cacheTimestamp = 0; // Force fresh fetch
          fetchUserData();
        }
        break;

      case 'tab-count':
        _workerTabCount = msg.count || 0;
        break;
    }
  }

  function applyWorkerContext(ctx) {
    // Merge worker-cached context into local userContext
    var keys = ['isAuthenticated','authProvider','userId','username','isTwitter','avatar','avatarUrl',
                'karma','rank','premium','trustScore','verificationLevel','verifiedProviders',
                'unreadCount','bio','color','bgUrl','theme','currentApp','ready','timestamp'];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (ctx[k] !== undefined && k !== 'currentApp') {
        userContext[k] = ctx[k];
      }
    }
    // Also update userData for render
    if (ctx.karma !== undefined) userData.karma = ctx.karma;
    if (ctx.rank !== undefined) userData.rank = ctx.rank;
    if (ctx.premium !== undefined) userData.premium = ctx.premium;
    if (ctx.username) userData.username = ctx.username;
    if (ctx.isTwitter !== undefined) userData.isTwitter = ctx.isTwitter;
    if (ctx.trustScore !== undefined) userData.trustScore = ctx.trustScore;
    if (ctx.verificationLevel !== undefined) userData.verificationLevel = ctx.verificationLevel;
    if (ctx.verifiedProviders) userData.verifiedProviders = ctx.verifiedProviders;
    // Enrich from local storage (worker can't read it)
    enrichContextFromLocalStorage();
    cacheTimestamp = Date.now();
    render();
  }

  // Dedup: prevent same event from being processed via both worker and BroadcastChannel
  function dedupeEvent(payload) {
    var fingerprint = (payload.event || '') + ':' + (payload.source || '') + ':' + (payload.timestamp || 0);
    if (_seenEvents.has(fingerprint)) return true; // already seen
    _seenEvents.add(fingerprint);
    // Auto-expire after 500ms
    setTimeout(function() { _seenEvents.delete(fingerprint); }, 500);
    return false;
  }

  // Sync context object with current userData
  function syncContext() {
    userContext.isAuthenticated = !!currentUser;
    userContext.authProvider = currentUser
      ? (currentUser.user_metadata?.user_name ? 'twitter' : 'anonymous')
      : null;
    userContext.userId = currentUser ? currentUser.id : null;
    userContext.username = userData.username;
    userContext.isTwitter = !!userData.isTwitter;
    userContext.karma = userData.karma;
    userContext.rank = userData.rank;
    userContext.premium = userData.premium;
    userContext.trustScore = userData.trustScore || 0;
    userContext.verificationLevel = userData.verificationLevel || 0;
    userContext.verifiedProviders = userData.verifiedProviders || [];
    userContext.currentApp = _curApp || null;
    userContext.timestamp = Date.now();
    enrichContextFromLocalStorage();
  }

  // Broadcast an event to all tabs + same-page listeners
  function broadcastEvent(eventName, data) {
    var ts = Date.now();
    var payload = { event: eventName, data: data || {}, source: _curApp, timestamp: ts, tabId: _tabId };
    // Mark as seen for dedup
    dedupeEvent(payload);
    // SharedWorker relay (cross-tab, deduped at receiver)
    if (syncWorker && syncWorkerReady) {
      try {
        syncWorker.port.postMessage({
          type: 'event-broadcast',
          event: eventName,
          data: data || {},
          source: _curApp,
          timestamp: ts
        });
      } catch (e) {}
    }
    // BroadcastChannel (cross-tab fallback / secondary)
    if (syncChannel) {
      try { syncChannel.postMessage(payload); } catch (e) {}
    }
    // Same-page listeners
    _fireLocal(eventName, payload);
  }

  function _fireLocal(eventName, payload) {
    var listeners = _eventListeners[eventName];
    if (listeners) {
      for (var i = 0; i < listeners.length; i++) {
        try { listeners[i](payload); } catch (e) { console.warn('[SloppyBar] Event listener error:', e); }
      }
    }
    // Also fire wildcard listeners
    var wild = _eventListeners['*'];
    if (wild) {
      for (var j = 0; j < wild.length; j++) {
        try { wild[j](payload); } catch (e) {}
      }
    }
  }

  // Listen for cross-tab events
  if (syncChannel) {
    syncChannel.onmessage = function(e) {
      if (!e.data || !e.data.event) return;
      // Don't re-fire events we sent from this tab (use tabId for accurate dedup)
      if (e.data.tabId === _tabId) return;
      if (!e.data.tabId && e.data.source === _curApp && e.data.timestamp && Date.now() - e.data.timestamp < 100) return;
      // Skip if already received via SharedWorker
      if (dedupeEvent(e.data)) return;
      _fireLocal(e.data.event, e.data);

      // Auto-apply theme changes from other tabs
      if (e.data.event === 'theme-changed' && e.data.data && e.data.data.vars) {
        var vars = e.data.data.vars;
        for (var key in vars) {
          if (vars.hasOwnProperty(key)) {
            document.documentElement.style.setProperty(key, vars[key]);
          }
        }
      }

      // Refresh context cache when identity changes in another tab
      if (e.data.event === 'identity-changed' || e.data.event === 'karma-changed') {
        cacheTimestamp = 0;
        enrichContextFromLocalStorage();
      }

      // Update notification dot when unread count changes
      if (e.data.event === 'unread-changed' && e.data.data) {
        _applyUnreadCount(e.data.data);
      }

      // Update trust data when verification changes
      if (e.data.event === 'verification-changed' && e.data.data) {
        _applyVerification(e.data.data);
      }

      // Feed bell + (optionally) toast
      try { _autoFeedFromSyncEvent(e.data.event, e.data.data); } catch(err) {}
    };
  }

  // Inject styles
  const styles = `
    .sloppy-bar {
      position: fixed;
      ${options.position}: 0 !important;
      ${options.position === 'bottom' ? 'top' : 'bottom'}: auto !important;
      left: 0;
      right: 0;
      height: 36px;
      background: transparent;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      border: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
      font-size: 13px;
      color: ${options.theme === 'light' ? '#1a1a2e' : '#e0e0e0'};
      z-index: 99999;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }
    .sloppy-bar * { box-sizing: border-box; }
    .sloppy-bar.minimized {
      width: auto;
      height: 32px;
      ${options.position}: 8px !important;
      ${options.position === 'bottom' ? 'top' : 'bottom'}: auto !important;
      left: 8px;
      right: auto;
      border-radius: 6px;
      background: rgba(10,10,15,0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.08);
      justify-content: center;
      cursor: pointer;
      padding: 0 10px;
      gap: 6px;
    }
    .sloppy-bar.minimized:hover {
      transform: scale(1.03);
      border-color: rgba(255,255,255,0.15);
      background: rgba(10,10,15,0.8);
    }
    .sloppy-bar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sloppy-bar-identity {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .sloppy-bar-identity:hover {
      background: ${options.theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'};
    }
    .sloppy-bar-avatar {
      font-size: 16px;
    }
    .sloppy-bar-username {
      font-weight: 600;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sloppy-bar-karma {
      color: #00ff88;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .sloppy-bar-badges {
      display: flex;
      gap: 4px;
    }
    .sloppy-bar-badge {
      font-size: 12px;
    }
    .sloppy-bar-badge-trust {
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .sloppy-bar-badge-trust.lvl1 { background: rgba(0,200,255,0.2); color: #00c8ff; }
    .sloppy-bar-badge-trust.lvl2 { background: rgba(0,255,136,0.2); color: #00ff88; }
    .sloppy-bar-badge-trust.lvl3 { background: rgba(255,215,0,0.25); color: #ffd700; }
    .sloppy-bar-notif-dot {
      width: 7px; height: 7px;
      background: #ff4466;
      border-radius: 50%;
      display: none;
      position: absolute;
      top: 1px; right: 1px;
      box-shadow: 0 0 6px rgba(255,68,102,0.6);
      animation: sloppy-bar-pulse 1.5s ease-in-out infinite;
    }
    .sloppy-bar-notif-dot.show { display: block; }
    @keyframes sloppy-bar-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.8); }
    }
    .sloppy-bar-vault-wrap { position: relative; }
    .sloppy-bar-center {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sloppy-bar-link {
      color: ${options.theme === 'light' ? '#666' : '#aaa'};
      text-decoration: none;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .sloppy-bar-link:hover {
      color: #00ddff;
      background: ${options.theme === 'light' ? 'rgba(0,221,255,0.1)' : 'rgba(0,221,255,0.15)'};
    }
    .sloppy-bar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sloppy-bar-home {
      color: ${options.theme === 'light' ? '#888' : '#666'};
      text-decoration: none;
      font-size: 12px;
      transition: color 0.2s;
    }
    .sloppy-bar-home:hover {
      color: #00ddff;
    }
    .sloppy-bar-toggle {
      background: none;
      border: none;
      color: ${options.theme === 'light' ? '#888' : '#666'};
      cursor: pointer;
      padding: 4px;
      font-size: 14px;
      transition: color 0.2s;
    }
    .sloppy-bar-toggle:hover {
      color: #00ddff;
    }
    .sloppy-bar-hardreload {
      background: none;
      border: 1px solid ${options.theme === 'light' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)'};
      color: ${options.theme === 'light' ? '#888' : '#888'};
      cursor: pointer;
      width: 22px; height: 22px;
      padding: 0;
      font-size: 13px;
      line-height: 1;
      border-radius: 3px;
      transition: color 0.15s, border-color 0.15s, transform 0.6s;
      margin-right: 4px;
    }
    .sloppy-bar-hardreload:hover { color: #ffd966; border-color: #ffd966; }
    .sloppy-bar-hardreload.spinning { transform: rotate(720deg); color: #ffd966; }
    .sloppy-bar-auth-btn {
      background: linear-gradient(135deg, #00ddff, #00ff88);
      color: #0a0a0f;
      border: none;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
    }
    .sloppy-bar-auth-btn:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }
    .sloppy-bar-minimized-icon {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .sloppy-bar-logo-s {
      font-size: 14px;
      background: linear-gradient(135deg, #ff6b9d, #c44dff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 900;
    }
    .sloppy-bar.minimized .sloppy-bar-left,
    .sloppy-bar.minimized .sloppy-bar-center,
    .sloppy-bar.minimized .sloppy-bar-right {
      display: none;
    }
    .sloppy-bar:not(.minimized) {
      background: rgba(10,10,15,0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .sloppy-bar:not(.minimized) .sloppy-bar-minimized-icon {
      display: none;
    }
    .sloppy-bar-teleport {
      background: linear-gradient(135deg, #aa66ff, #ff66aa);
      color: #fff;
      border: none;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: inherit;
    }
    .sloppy-bar-teleport:hover {
      transform: scale(1.05);
      box-shadow: 0 0 12px rgba(170, 102, 255, 0.5);
    }
    .sloppy-bar-teleport:active {
      transform: scale(0.95);
    }
    .sloppy-bar-teleport-icon {
      animation: sloppy-bar-spin 2s linear infinite;
    }
    .sloppy-bar-vote {
      background: transparent;
      border: 1px solid rgba(0,255,136,0.2);
      color: rgba(0,255,136,0.5);
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.15s;
      display: flex;
      align-items: center;
      gap: 3px;
      font-family: inherit;
      white-space: nowrap;
    }
    .sloppy-bar-vote:hover {
      border-color: rgba(0,255,136,0.4);
      color: #0f8;
      background: rgba(0,255,136,0.06);
    }
    .sloppy-bar-vote.voted {
      border-color: rgba(0,255,136,0.5);
      color: #0f8;
      background: rgba(0,255,136,0.1);
      text-shadow: 0 0 6px rgba(0,255,136,0.3);
    }
    .sloppy-bar-vote .sloppy-vote-arrow { font-size: 13px; line-height: 1; }
    .sloppy-bar-vote .sloppy-vote-count { font-size: 10px; opacity: 0.7; }
    @keyframes sloppy-bar-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (max-width: 600px) {
      .sloppy-bar-center { display: none; }
      .sloppy-bar-username { max-width: 80px; }
    }
    /* === Right-cluster compression on small screens ===
       Avoid the new 📝/📺/💬/🔔 buttons getting pushed past the right viewport
       edge when the cluster overflows. -right has display:flex with no wrap,
       so anything beyond the viewport becomes invisible. Three tweaks: */
    @media (max-width: 720px) {
      /* Drop the redundant "← sloppy.live" home link — the left-side
         brand logo + identity link already cover this affordance. */
      .sloppy-bar-home { display: none; }
    }
    @media (max-width: 540px) {
      /* Tighten the right-cluster gap so the 6 icon buttons + Teleport
         fit on narrow viewports. */
      .sloppy-bar-right { gap: 4px; }
      /* Collapse the Teleport button to emoji-only — keep the icon visible
         (font-size restored just on the .sloppy-bar-teleport-icon span). */
      .sloppy-bar-teleport { font-size: 0; padding: 5px 7px; }
      .sloppy-bar-teleport .sloppy-bar-teleport-icon { font-size: 14px; }
      /* Belt-and-suspenders: if SOME overflow still happens (e.g. an extra
         badge or a wider system font), let users scroll the cluster
         horizontally instead of losing buttons forever. */
      .sloppy-bar-right {
        overflow-x: auto;
        scrollbar-width: none;            /* Firefox */
      }
      .sloppy-bar-right::-webkit-scrollbar { display: none; } /* WebKit */
    }
    /* Recent Apps Dropdown */
    .sloppy-bar-dropdown-wrapper {
      position: relative;
    }
    .sloppy-bar-dropdown {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
      background: ${options.theme === 'light' ? 'rgba(255,255,255,0.98)' : 'rgba(15,15,20,0.98)'};
      border: 1px solid ${options.theme === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)'};
      border-radius: 8px;
      padding: 8px 0;
      min-width: 280px;
      max-width: 340px;
      max-height: 70vh;
      overflow-y: auto;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      z-index: 100000;
      display: none;
    }
    /* Ecosystem grid — compact 2-column list of all sloppygram modules */
    .sloppy-bar-ecogrid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px;
      padding: 0 6px 6px;
    }
    .sloppy-bar-ecogrid .sloppy-bar-dropdown-item {
      padding: 6px 8px;
      font-size: 11px;
      border-radius: 4px;
      gap: 6px;
    }
    .sloppy-bar-ecogrid .sloppy-bar-dropdown-item-icon { font-size: 14px; }
    .sloppy-bar-ecogrid .sloppy-bar-dropdown-item-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sloppy-bar-ecogrid .sloppy-bar-dropdown-item.current {
      background: ${options.theme === 'light' ? 'rgba(0,221,255,0.18)' : 'rgba(0,221,255,0.22)'};
      color: #00ddff;
      pointer-events: none;
    }
    .sloppy-bar-ecogrid .sloppy-bar-dropdown-item.current::after {
      content: '● here';
      margin-left: auto;
      font-size: 9px;
      opacity: 0.7;
    }
    .sloppy-bar-dropdown.open {
      display: block;
      animation: sloppy-dropdown-in 0.15s ease-out;
    }
    @keyframes sloppy-dropdown-in {
      from { opacity: 0; transform: translateX(-50%) translateY(5px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    .sloppy-bar-dropdown-header {
      padding: 6px 14px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${options.theme === 'light' ? '#888' : '#666'};
      border-bottom: 1px solid ${options.theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'};
      margin-bottom: 4px;
    }
    .sloppy-bar-dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      color: ${options.theme === 'light' ? '#333' : '#ddd'};
      text-decoration: none;
      font-size: 12px;
      transition: all 0.15s;
      /* Reset <button> defaults for action items (notepad/twitch widgets) */
      background: transparent;
      border: 0;
      font-family: inherit;
      cursor: pointer;
      width: 100%;
      text-align: left;
    }
    .sloppy-bar-dropdown-item:hover {
      background: ${options.theme === 'light' ? 'rgba(0,221,255,0.1)' : 'rgba(0,221,255,0.15)'};
      color: #00ddff;
    }
    .sloppy-bar-dropdown-item-icon {
      font-size: 14px;
      width: 20px;
      text-align: center;
    }
    .sloppy-bar-dropdown-item-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sloppy-bar-dropdown-item-time {
      font-size: 10px;
      color: ${options.theme === 'light' ? '#999' : '#666'};
    }
    .sloppy-bar-dropdown-empty {
      padding: 12px 14px;
      font-size: 11px;
      color: ${options.theme === 'light' ? '#999' : '#666'};
      text-align: center;
    }
    .sloppy-bar-dropdown-footer {
      padding: 8px 14px;
      border-top: 1px solid ${options.theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'};
      margin-top: 4px;
    }
    .sloppy-bar-dropdown-footer a {
      display: block;
      text-align: center;
      font-size: 11px;
      color: #00ddff;
      text-decoration: none;
    }
    .sloppy-bar-dropdown-footer a:hover {
      text-decoration: underline;
    }
    .sloppy-bar-apps-trigger {
      cursor: pointer;
      position: relative;
    }
    .sloppy-bar-apps-trigger::after {
      content: '▾';
      margin-left: 3px;
      font-size: 9px;
      opacity: 0.6;
    }
    /* Teleport Discovery Panel */
    .sloppy-bar-teleport-panel {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: rgba(8,8,14,0.97);
      border: 1px solid rgba(170,102,255,0.3);
      border-radius: 14px;
      padding: 24px;
      min-width: 340px;
      max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(170,102,255,0.15);
      z-index: 100001;
      display: none;
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      color: #e0e0e0;
      animation: sloppy-tp-in 0.2s ease-out;
    }
    .sloppy-bar-teleport-panel.open {
      display: block;
      transform: translate(-50%, -50%) scale(1);
    }
    @keyframes sloppy-tp-in {
      from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    .sloppy-tp-title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 6px;
      background: linear-gradient(135deg, #aa66ff, #ff66aa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .sloppy-tp-stats {
      font-size: 10px;
      color: #666;
      margin-bottom: 16px;
    }
    .sloppy-tp-stats span { color: #00ff88; }
    .sloppy-tp-cats {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }
    .sloppy-tp-cat {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.04);
      color: #ccc;
      transition: all 0.15s;
      font-family: inherit;
    }
    .sloppy-tp-cat:hover {
      border-color: rgba(170,102,255,0.5);
      background: rgba(170,102,255,0.15);
      color: #fff;
    }
    .sloppy-tp-cat.active {
      background: linear-gradient(135deg, #aa66ff, #ff66aa);
      color: #fff;
      border-color: transparent;
    }
    .sloppy-tp-cat .sloppy-tp-cat-count {
      font-size: 9px;
      opacity: 0.6;
      margin-left: 4px;
    }
    .sloppy-tp-actions {
      display: flex;
      gap: 8px;
    }
    .sloppy-tp-go {
      flex: 1;
      padding: 10px;
      border-radius: 8px;
      border: none;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      background: linear-gradient(135deg, #aa66ff, #ff66aa);
      color: #fff;
      transition: all 0.2s;
    }
    .sloppy-tp-go:hover {
      transform: scale(1.03);
      box-shadow: 0 0 20px rgba(170,102,255,0.4);
    }
    .sloppy-tp-close {
      padding: 10px 16px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.1);
      background: transparent;
      color: #888;
      font-size: 13px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s;
    }
    .sloppy-tp-close:hover {
      border-color: rgba(255,255,255,0.3);
      color: #fff;
    }
    .sloppy-tp-discovery {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,0.06);
      font-size: 10px;
      color: #555;
    }
    .sloppy-tp-progress {
      height: 4px;
      background: rgba(255,255,255,0.06);
      border-radius: 2px;
      margin-top: 6px;
      overflow: hidden;
    }
    .sloppy-tp-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #00ff88, #00ddff);
      border-radius: 2px;
      transition: width 0.3s;
    }
    .sloppy-bar-tp-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 100000;
      display: none;
    }
    .sloppy-bar-tp-overlay.open { display: block; }

    /* Live badge + search */
    .sloppy-tp-live {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.04em;
      padding: 2px 7px;
      border-radius: 10px;
      background: rgba(0,255,136,0.12);
      color: #00ff88;
      border: 1px solid rgba(0,255,136,0.25);
      -webkit-text-fill-color: #00ff88;
      vertical-align: middle;
      margin-left: 6px;
    }
    .sloppy-tp-live.loading {
      background: rgba(255,255,255,0.04);
      color: #888;
      -webkit-text-fill-color: #888;
      border-color: rgba(255,255,255,0.12);
    }
    .sloppy-tp-search-wrap {
      position: relative;
      margin: 0 0 14px 0;
    }
    .sloppy-tp-search {
      width: 100%;
      padding: 9px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.04);
      color: #fff;
      font-size: 12px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s, background 0.15s;
      box-sizing: border-box;
    }
    .sloppy-tp-search::placeholder { color: #666; }
    .sloppy-tp-search:focus {
      border-color: rgba(170,102,255,0.55);
      background: rgba(170,102,255,0.08);
    }
    .sloppy-tp-results {
      display: none;
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      max-height: 280px;
      overflow-y: auto;
      background: rgba(12,12,20,0.98);
      border: 1px solid rgba(170,102,255,0.35);
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      z-index: 100002;
      padding: 4px;
    }
    .sloppy-tp-results.open { display: block; }
    .sloppy-tp-result {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 7px 10px;
      border: none;
      background: transparent;
      color: #e0e0e0;
      font-family: inherit;
      font-size: 11px;
      text-align: left;
      cursor: pointer;
      border-radius: 5px;
      transition: background 0.1s;
    }
    .sloppy-tp-result:hover, .sloppy-tp-result:focus {
      background: rgba(170,102,255,0.18);
      color: #fff;
      outline: none;
    }
    .sloppy-tp-result-emoji {
      font-size: 13px;
      flex-shrink: 0;
      width: 16px;
      text-align: center;
    }
    .sloppy-tp-result-name {
      flex: 1;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sloppy-tp-result-slug {
      font-size: 9px;
      color: #666;
      font-weight: 400;
      flex-shrink: 0;
    }
    .sloppy-tp-seen {
      color: #00ff88;
      font-size: 8px;
      opacity: 0.7;
      flex-shrink: 0;
    }
    .sloppy-tp-empty {
      padding: 12px;
      color: #666;
      font-size: 11px;
      text-align: center;
      font-style: italic;
    }
    .sloppy-tp-more {
      padding: 8px 10px 4px;
      color: #888;
      font-size: 9px;
      text-align: center;
      border-top: 1px solid rgba(255,255,255,0.06);
      margin-top: 4px;
    }

    /* === Notification bell + badge === */
    .sloppy-bar-bell {
      position: relative;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #ddd;
      border-radius: 14px;
      padding: 5px 9px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
      line-height: 1;
    }
    .sloppy-bar-bell:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(170,102,255,0.4);
      color: #fff;
    }
    .sloppy-bar-bell.has-unread {
      animation: sloppy-bell-wiggle 1.6s ease-in-out;
    }
    @keyframes sloppy-bell-wiggle {
      0%, 100% { transform: rotate(0); }
      15% { transform: rotate(-14deg); }
      30% { transform: rotate(12deg); }
      45% { transform: rotate(-8deg); }
      60% { transform: rotate(6deg); }
      75% { transform: rotate(-3deg); }
    }
    .sloppy-bar-bell-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 8px;
      background: linear-gradient(135deg, #ff5577, #ff9d4d);
      color: #fff;
      font-size: 9px;
      font-weight: 800;
      line-height: 16px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      pointer-events: none;
      letter-spacing: 0;
      transform: scale(0);
      transition: transform 0.18s cubic-bezier(.5,1.7,.4,1);
    }
    .sloppy-bar-bell-badge.show { transform: scale(1); }

    /* === Chat toggle button (sibling of bell) === */
    .sloppy-bar-chat {
      position: relative;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #ddd;
      border-radius: 14px;
      padding: 5px 9px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
      line-height: 1;
    }
    .sloppy-bar-chat:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(0,221,255,0.45);
      color: #fff;
    }
    .sloppy-bar-chat.has-unseen {
      animation: sloppy-chat-pop 0.5s ease-out;
    }
    @keyframes sloppy-chat-pop {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.18); }
      100% { transform: scale(1); }
    }
    .sloppy-bar-chat-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 8px;
      background: linear-gradient(135deg, #00ddff, #5eff8a);
      color: #07111a;
      font-size: 9px;
      font-weight: 800;
      line-height: 16px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      pointer-events: none;
      transform: scale(0);
      transition: transform 0.18s cubic-bezier(.5,1.7,.4,1);
    }
    .sloppy-bar-chat-badge.show { transform: scale(1); }

    /* === Twitch toggle button === */
    .sloppy-bar-twitch {
      position: relative;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #ddd;
      border-radius: 14px;
      padding: 5px 9px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
      line-height: 1;
    }
    .sloppy-bar-twitch:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(145,71,255,0.5);
      color: #fff;
    }

    /* === Notepad toggle button === */
    .sloppy-bar-notepad {
      position: relative;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      color: #ddd;
      border-radius: 14px;
      padding: 5px 9px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s;
      font-family: inherit;
      line-height: 1;
    }
    .sloppy-bar-notepad:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,224,102,0.55);
      color: #fff;
    }

    /* === Notepad panel: yellow-legal-pad-on-dark aesthetic === */
    .sloppy-bar-notepad-panel {
      position: fixed;
      ${options.position}: 44px;
      right: 12px;
      width: 340px;
      max-width: calc(100vw - 24px);
      height: 420px;
      max-height: 75vh;
      background: #1a1505;
      background-image:
        repeating-linear-gradient(0deg, transparent 0 23px, rgba(255,224,102,0.06) 23px 24px),
        linear-gradient(180deg, rgba(255,224,102,0.04), transparent 30%);
      border: 1px solid rgba(255,224,102,0.4);
      border-radius: 8px;
      box-shadow: 0 18px 50px rgba(0,0,0,0.6), 0 0 22px rgba(255,224,102,0.18);
      z-index: 100001;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      color: #ffe8a0;
      animation: sloppy-np-in 0.18s ease-out;
    }
    .sloppy-bar-notepad-panel.open { display: flex; }
    /* Left margin "ruled" red line in classic legal-pad style */
    .sloppy-bar-notepad-panel::before {
      content: '';
      position: absolute;
      left: 38px;
      top: 36px;
      bottom: 32px;
      width: 1px;
      background: rgba(255,107,107,0.35);
      pointer-events: none;
    }
    .sloppy-notepad-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 11px;
      border-bottom: 1px solid rgba(255,224,102,0.2);
      background: rgba(40,28,5,0.85);
      flex-shrink: 0;
      position: relative;
      z-index: 2;
    }
    .sloppy-notepad-title {
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      color: #ffe066;
      text-shadow: 0 0 6px rgba(255,224,102,0.4);
    }
    .sloppy-notepad-status {
      display: flex; align-items: center; gap: 6px;
      font-size: 9px;
      color: rgba(255,232,160,0.55);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .sloppy-notepad-status .dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: #66ff9a;
      box-shadow: 0 0 5px #66ff9a;
      opacity: 0.4;
      transition: opacity 0.2s;
    }
    .sloppy-notepad-status.dirty .dot { opacity: 0.4; background: #ffb347; box-shadow: 0 0 5px #ffb347; }
    .sloppy-notepad-status.saved .dot { opacity: 1;   background: #66ff9a; }
    .sloppy-notepad-status.saved.flash .dot { animation: sloppy-np-saveflash 0.55s ease-out; }
    @keyframes sloppy-np-saveflash {
      0% { transform: scale(0.5); opacity: 0; }
      50% { transform: scale(1.4); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .sloppy-notepad-actions {
      display: flex; gap: 4px;
    }
    .sloppy-notepad-actions button {
      background: transparent;
      border: 1px solid rgba(255,224,102,0.2);
      color: rgba(255,232,160,0.7);
      font-size: 10px;
      font-family: inherit;
      padding: 2px 7px;
      border-radius: 3px;
      cursor: pointer;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .sloppy-notepad-actions button:hover { color: #fff; border-color: rgba(255,224,102,0.6); background: rgba(255,224,102,0.08); }
    .sloppy-notepad-actions button.danger { color: #ff9a9a; border-color: rgba(255,107,107,0.3); }
    .sloppy-notepad-actions button.danger:hover { background: rgba(255,107,107,0.12); border-color: rgba(255,107,107,0.6); color: #fff; }
    .sloppy-notepad-textarea {
      flex: 1;
      min-height: 0;
      width: 100%;
      background: transparent;
      border: none;
      color: #ffe8a0;
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      font-size: 13px;
      line-height: 24px;             /* matches the 24px ruled-line spacing */
      padding: 6px 12px 8px 54px;     /* leaves room for the margin line */
      outline: none;
      resize: none;
      text-shadow: 0 0 4px rgba(255,224,102,0.2);
      caret-color: #ffe066;
      tab-size: 4;
    }
    .sloppy-notepad-textarea::placeholder { color: rgba(255,232,160,0.3); font-style: italic; }
    .sloppy-notepad-textarea::-webkit-scrollbar { width: 8px; }
    .sloppy-notepad-textarea::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
    .sloppy-notepad-textarea::-webkit-scrollbar-thumb { background: rgba(255,224,102,0.18); border-radius: 4px; }
    .sloppy-notepad-textarea::-webkit-scrollbar-thumb:hover { background: rgba(255,224,102,0.35); }
    .sloppy-notepad-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 10px 6px;
      font-size: 9px;
      color: rgba(255,232,160,0.45);
      letter-spacing: 0.04em;
      border-top: 1px solid rgba(255,224,102,0.15);
      background: rgba(40,28,5,0.5);
      flex-shrink: 0;
      position: relative;
      z-index: 2;
    }
    @media (prefers-reduced-motion: reduce) {
      .sloppy-notepad-status.saved.flash .dot { animation: none; }
    }

    /* === Twitch stream window: scalable + movable, lazy-loaded iframe === */
    .sloppy-twitch-window {
      position: fixed;
      top: 80px;
      right: 20px;
      width: 480px;
      height: 320px;
      min-width: 240px;
      min-height: 180px;
      max-width: 96vw;
      max-height: 80vh;
      background: #0d0a14;
      border: 1px solid #9147ff;
      border-radius: 8px;
      box-shadow: 0 18px 50px rgba(0,0,0,0.6), 0 0 28px rgba(145,71,255,0.28);
      z-index: 100001;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      color: #efeaff;
    }
    .sloppy-twitch-window.open { display: flex; }
    .sloppy-twitch-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      background: linear-gradient(180deg, rgba(145,71,255,0.18), rgba(145,71,255,0.06));
      border-bottom: 1px solid rgba(145,71,255,0.25);
      flex-shrink: 0;
      cursor: move;
      user-select: none;
      touch-action: none;
    }
    .sloppy-twitch-title {
      display: flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.06em; text-transform: uppercase;
      color: #d9ccff;
    }
    .sloppy-twitch-title .tw-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #f23f4c; box-shadow: 0 0 6px #f23f4c;
      animation: sloppy-tw-pulse 1.4s ease-in-out infinite;
    }
    @keyframes sloppy-tw-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .sloppy-twitch-channel-input {
      flex: 1;
      max-width: 140px;
      background: rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.12);
      color: #efeaff;
      padding: 3px 7px;
      border-radius: 4px;
      font-family: inherit;
      font-size: 11px;
      outline: none;
      margin: 0 8px;
    }
    .sloppy-twitch-channel-input:focus { border-color: #9147ff; }
    .sloppy-twitch-controls { display: flex; gap: 4px; }
    .sloppy-twitch-btn {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.15);
      color: #bbb;
      width: 22px; height: 22px;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      line-height: 1;
      padding: 0;
    }
    .sloppy-twitch-btn:hover { color: #fff; border-color: #9147ff; background: rgba(145,71,255,0.18); }
    .sloppy-twitch-body {
      flex: 1;
      min-height: 0;
      position: relative;
      background: #000;
    }
    .sloppy-twitch-body iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
    .sloppy-twitch-empty {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;
      color: #888;
      font-size: 12px;
      text-align: center;
      padding: 18px;
    }
    .sloppy-twitch-empty .play {
      font-size: 36px;
      color: #9147ff;
      opacity: 0.7;
      cursor: pointer;
      transition: transform 0.15s, opacity 0.15s;
    }
    .sloppy-twitch-empty .play:hover { transform: scale(1.15); opacity: 1; }
    .sloppy-twitch-resize {
      position: absolute;
      right: 0; bottom: 0;
      width: 16px; height: 16px;
      cursor: nwse-resize;
      background:
        linear-gradient(135deg, transparent 50%, rgba(145,71,255,0.6) 50%, rgba(145,71,255,0.6) 60%, transparent 60%, transparent 70%, rgba(145,71,255,0.6) 70%, rgba(145,71,255,0.6) 80%, transparent 80%);
      touch-action: none;
    }
    @media (max-width: 540px) {
      .sloppy-twitch-window { width: calc(100vw - 16px); height: 50vh; right: 8px; top: 60px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .sloppy-twitch-title .tw-dot { animation: none; }
    }

    /* === Chat panel — dark charcoal + phosphor green CRT theme === */
    .sloppy-bar-chat-panel {
      position: fixed;
      ${options.position}: 44px;
      right: 12px;
      width: 340px;
      max-width: calc(100vw - 24px);
      height: 440px;
      max-height: 75vh;
      background: #0a0a0a;
      background-image:
        radial-gradient(ellipse at top, rgba(51,255,102,0.06) 0, transparent 60%),
        repeating-linear-gradient(0deg, rgba(51,255,102,0.04) 0 1px, transparent 1px 3px);
      border: 1px solid #33ff66;
      border-radius: 8px;
      box-shadow: 0 18px 50px rgba(0,0,0,0.7), 0 0 22px rgba(51,255,102,0.22), inset 0 0 30px rgba(51,255,102,0.05);
      z-index: 100001;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'VT323', 'JetBrains Mono', 'SF Mono', monospace;
      color: #33ff66;
      text-shadow: 0 0 1px rgba(51,255,102,0.6), 0 0 4px rgba(51,255,102,0.25);
      animation: sloppy-np-in 0.18s ease-out;
    }
    .sloppy-bar-chat-panel.open { display: flex; }
    .sloppy-chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid #1a8a3a;
      background: rgba(0,12,4,0.85);
      flex-shrink: 0;
    }
    .sloppy-chat-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #9dffb8;
      text-shadow: 0 0 6px rgba(51,255,102,0.55);
      font-family: 'VT323', monospace;
    }
    .sloppy-chat-title .live-dot {
      display: inline-block;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #33ff66;
      margin-right: 6px;
      box-shadow: 0 0 8px #33ff66;
      animation: sloppy-chat-livepulse 1.4s ease-in-out infinite;
      vertical-align: middle;
    }
    @keyframes sloppy-chat-livepulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }
    .sloppy-chat-pop-out {
      background: transparent;
      border: 1px solid #1a8a3a;
      color: #33ff66;
      font-size: 10px;
      font-family: 'VT323', monospace;
      padding: 2px 8px;
      border-radius: 0;
      cursor: pointer;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-decoration: none;
      text-shadow: 0 0 4px rgba(51,255,102,0.5);
    }
    .sloppy-chat-pop-out:hover {
      color: #9dffb8;
      border-color: #33ff66;
      background: rgba(51,255,102,0.08);
    }
    .sloppy-chat-list {
      flex: 1;
      overflow-y: auto;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-height: 0;
      font-family: 'VT323', monospace;
    }
    .sloppy-chat-list::-webkit-scrollbar { width: 8px; }
    .sloppy-chat-list::-webkit-scrollbar-track { background: rgba(0,0,0,0.4); }
    .sloppy-chat-list::-webkit-scrollbar-thumb {
      background: #0d5520;
      box-shadow: 0 0 4px rgba(51,255,102,0.5);
    }
    .sloppy-chat-msg {
      padding: 2px 6px 3px;
      border-left: 2px solid #0d5520;
      transition: border-left-color 0.15s, background 0.1s;
      word-wrap: break-word;
      line-height: 1.25;
    }
    .sloppy-chat-msg:hover {
      border-left-color: #33ff66;
      background: rgba(51,255,102,0.03);
    }
    .sloppy-chat-msg.own {
      border-left-color: #ffb74d;
      background: rgba(255,183,77,0.04);
    }
    .sloppy-chat-msg-user {
      font-size: 13px;
      font-weight: 400;
      color: #9dffb8;
      letter-spacing: 0.02em;
      text-shadow: 0 0 5px rgba(51,255,102,0.55);
    }
    .sloppy-chat-msg-user::after { content: '@sloppy'; color: #1a8a3a; font-size: 11px; margin-left: 1px; }
    .sloppy-chat-msg.own .sloppy-chat-msg-user {
      color: #ffb74d;
      text-shadow: 0 0 5px rgba(255,183,77,0.55);
    }
    .sloppy-chat-msg.own .sloppy-chat-msg-user::after { color: rgba(255,183,77,0.4); }
    .sloppy-chat-msg-time {
      font-size: 11px;
      color: #1a8a3a;
      margin-left: 5px;
      letter-spacing: 0.03em;
    }
    .sloppy-chat-msg-time::before { content: '['; }
    .sloppy-chat-msg-time::after { content: ']'; }
    .sloppy-chat-msg-body {
      font-size: 14px;
      color: #33ff66;
      margin-top: 0;
      line-height: 1.25;
      padding-left: 12px;
      position: relative;
    }
    .sloppy-chat-msg-body::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: #1a8a3a;
    }
    .sloppy-chat-msg.own .sloppy-chat-msg-body { color: #9dffb8; }
    .sloppy-chat-msg.own .sloppy-chat-msg-body::before { color: #ffb74d; }
    .sloppy-chat-msg-body img {
      max-width: 100%;
      max-height: 100px;
      border: 1px solid #1a8a3a;
      margin-top: 3px;
      display: block;
      filter: contrast(0.95);
    }
    .sloppy-chat-msg-icon {
      display: inline-block;
      font-size: 10px;
      color: #1a8a3a;
      margin-right: 3px;
    }
    .sloppy-chat-empty {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1a8a3a;
      font-size: 13px;
      font-family: 'VT323', monospace;
      letter-spacing: 0.04em;
      text-align: center;
      padding: 20px;
    }
    .sloppy-chat-loading {
      padding: 16px;
      text-align: center;
      color: #1a8a3a;
      font-size: 12px;
      letter-spacing: 0.2em;
      font-family: 'VT323', monospace;
      text-transform: uppercase;
    }
    .sloppy-chat-input-row {
      display: flex;
      gap: 6px;
      padding: 8px 10px;
      border-top: 1px solid #1a8a3a;
      background: rgba(0,12,4,0.85);
      flex-shrink: 0;
    }
    .sloppy-chat-input {
      flex: 1;
      background: rgba(0,0,0,0.5);
      border: 1px solid #1a8a3a;
      color: #9dffb8;
      padding: 4px 8px 4px 22px;
      border-radius: 0;
      font-size: 14px;
      font-family: 'VT323', monospace;
      outline: none;
      resize: none;
      min-height: 28px;
      max-height: 80px;
      text-shadow: 0 0 4px rgba(51,255,102,0.5);
      position: relative;
      caret-color: #33ff66;
    }
    .sloppy-chat-input:focus {
      border-color: #33ff66;
      box-shadow: 0 0 12px rgba(51,255,102,0.25);
    }
    .sloppy-chat-input::placeholder { color: #0d5520; font-family: inherit; }
    /* "$_" prompt symbol overlay using a wrapper sibling, simpler approach using bg-image */
    .sloppy-chat-input-row::before {
      content: '$_';
      position: relative;
      left: 12px;
      top: 6px;
      color: #1a8a3a;
      font-family: 'VT323', monospace;
      font-size: 14px;
      pointer-events: none;
      margin-right: -16px;
      animation: sloppy-chat-caret 1s steps(2) infinite;
    }
    @keyframes sloppy-chat-caret {
      0%, 50% { opacity: 1; color: #33ff66; }
      51%, 100% { opacity: 0.4; color: #1a8a3a; }
    }
    .sloppy-chat-send {
      background: transparent;
      color: #9dffb8;
      border: 1px solid #33ff66;
      border-radius: 0;
      padding: 0 12px;
      font-family: 'VT323', monospace;
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.08em;
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.15s;
      text-shadow: 0 0 6px rgba(51,255,102,0.5);
      box-shadow: 0 0 8px rgba(51,255,102,0.15);
    }
    .sloppy-chat-send::before { content: '['; color: #1a8a3a; }
    .sloppy-chat-send::after  { content: ']'; color: #1a8a3a; }
    .sloppy-chat-send:hover:not(:disabled) {
      background: rgba(51,255,102,0.12);
      box-shadow: 0 0 18px rgba(51,255,102,0.4);
    }
    .sloppy-chat-send:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }
    .sloppy-chat-anon-notice {
      font-family: 'VT323', monospace;
      font-size: 12px;
      color: #1a8a3a;
      padding: 8px 10px;
      text-align: center;
      border-top: 1px solid #1a8a3a;
      background: rgba(0,12,4,0.85);
      letter-spacing: 0.04em;
    }
    .sloppy-chat-anon-notice a { color: #33ff66; text-decoration: none; border-bottom: 1px dashed currentColor; }
    .sloppy-chat-anon-notice a:hover { color: #9dffb8; }
    @media (prefers-reduced-motion: reduce) {
      .sloppy-bar-chat-panel { background-image: none; }
      .sloppy-chat-input-row::before { animation: none; opacity: 1; }
    }

    /* === Notification panel === */
    .sloppy-bar-notif-panel {
      position: fixed;
      ${options.position}: 44px;
      right: 12px;
      width: 320px;
      max-width: calc(100vw - 24px);
      max-height: 440px;
      background: rgba(8,8,14,0.97);
      border: 1px solid rgba(170,102,255,0.3);
      border-radius: 12px;
      box-shadow: 0 18px 50px rgba(0,0,0,0.6), 0 0 30px rgba(170,102,255,0.1);
      z-index: 100001;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      color: #e0e0e0;
      animation: sloppy-np-in 0.18s ease-out;
    }
    .sloppy-bar-notif-panel.open { display: flex; }
    @keyframes sloppy-np-in {
      from { opacity: 0; transform: translateY(${options.position === 'bottom' ? '10px' : '-10px'}); }
      to { opacity: 1; transform: translateY(0); }
    }
    .sloppy-np-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .sloppy-np-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      background: linear-gradient(135deg, #aa66ff, #ff66aa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .sloppy-np-mark {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.12);
      color: #aaa;
      font-size: 9px;
      font-family: inherit;
      padding: 3px 8px;
      border-radius: 6px;
      cursor: pointer;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .sloppy-np-mark:hover { color: #fff; border-color: rgba(170,102,255,0.5); }
    .sloppy-np-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px;
      max-height: 340px;
    }
    .sloppy-np-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 9px;
      border-radius: 7px;
      transition: background 0.1s;
      position: relative;
      cursor: default;
    }
    .sloppy-np-item.unread { background: rgba(170,102,255,0.08); }
    .sloppy-np-item.unread::before {
      content: '';
      position: absolute;
      left: 2px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 18px;
      border-radius: 2px;
      background: linear-gradient(180deg, #aa66ff, #ff66aa);
    }
    .sloppy-np-item:hover { background: rgba(255,255,255,0.04); }
    .sloppy-np-icon {
      font-size: 14px;
      line-height: 1.2;
      flex-shrink: 0;
      width: 18px;
      text-align: center;
    }
    .sloppy-np-body {
      flex: 1;
      min-width: 0;
    }
    .sloppy-np-msg {
      font-size: 11px;
      color: #ddd;
      line-height: 1.35;
      word-wrap: break-word;
    }
    .sloppy-np-meta {
      font-size: 9px;
      color: #666;
      margin-top: 2px;
      letter-spacing: 0.04em;
    }
    .sloppy-np-action {
      display: inline-block;
      margin-top: 4px;
      padding: 3px 7px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      border-radius: 4px;
      background: linear-gradient(135deg, #aa66ff, #ff66aa);
      color: #fff;
      text-decoration: none;
      cursor: pointer;
      border: none;
      font-family: inherit;
    }
    .sloppy-np-action:hover { filter: brightness(1.15); }
    .sloppy-np-empty {
      padding: 30px 16px;
      text-align: center;
      color: #555;
      font-size: 10px;
      font-style: italic;
    }
    .sloppy-np-footer {
      padding: 6px 12px;
      border-top: 1px solid rgba(255,255,255,0.06);
      font-size: 9px;
      color: #555;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .sloppy-np-clear {
      background: transparent;
      border: none;
      color: #777;
      font-size: 9px;
      cursor: pointer;
      font-family: inherit;
      padding: 2px 4px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .sloppy-np-clear:hover { color: #ff5577; }
    .sloppy-np-type-success { color: #00ff88; }
    .sloppy-np-type-warn { color: #ffb347; }
    .sloppy-np-type-error { color: #ff5577; }
    .sloppy-np-type-info { color: #66ccff; }

    /* === Global toast container === */
    .sloppy-toast-stack {
      position: fixed;
      top: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 100002;
      pointer-events: none;
      max-width: 360px;
    }
    @media (max-width: 540px) {
      .sloppy-toast-stack { left: 12px; right: 12px; max-width: none; }
    }
    .sloppy-toast {
      pointer-events: auto;
      background: rgba(12,12,20,0.96);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #f0f0f0;
      padding: 10px 12px 10px 14px;
      border-radius: 10px;
      border: 1px solid rgba(170,102,255,0.3);
      border-left: 3px solid #aa66ff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      font-family: 'JetBrains Mono', 'SF Mono', monospace;
      font-size: 11px;
      line-height: 1.4;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      transform: translateX(120%);
      opacity: 0;
      transition: transform 0.28s cubic-bezier(.5,1.7,.4,1), opacity 0.2s;
      min-width: 220px;
      max-width: 360px;
    }
    .sloppy-toast.in { transform: translateX(0); opacity: 1; }
    .sloppy-toast.out { transform: translateX(120%); opacity: 0; }
    .sloppy-toast-success { border-left-color: #00ff88; }
    .sloppy-toast-warn { border-left-color: #ffb347; }
    .sloppy-toast-error { border-left-color: #ff5577; }
    .sloppy-toast-info { border-left-color: #66ccff; }
    .sloppy-toast-icon {
      font-size: 14px;
      line-height: 1.2;
      flex-shrink: 0;
    }
    .sloppy-toast-body { flex: 1; min-width: 0; }
    .sloppy-toast-msg { color: #f0f0f0; word-wrap: break-word; }
    .sloppy-toast-action {
      display: inline-block;
      margin-top: 4px;
      padding: 3px 7px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      border-radius: 4px;
      background: linear-gradient(135deg, #aa66ff, #ff66aa);
      color: #fff;
      text-decoration: none;
      cursor: pointer;
      border: none;
      font-family: inherit;
    }
    .sloppy-toast-action:hover { filter: brightness(1.15); }
    .sloppy-toast-close {
      background: transparent;
      border: none;
      color: #666;
      font-size: 13px;
      cursor: pointer;
      padding: 0 0 0 4px;
      flex-shrink: 0;
      font-family: inherit;
      line-height: 1;
    }
    .sloppy-toast-close:hover { color: #fff; }
    @media (prefers-reduced-motion: reduce) {
      .sloppy-toast, .sloppy-bar-notif-panel { animation: none; transition: opacity 0.15s; }
      .sloppy-toast.in { transform: none; }
      .sloppy-bar-bell.has-unread { animation: none; }
    }

    /* === UNIVERSAL MOBILE FIXES (injected across all ~480 apps) === */
    /* Prevent iOS text size inflation */
    html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
    /* Remove tap highlight on touch devices */
    *, *::before, *::after { -webkit-tap-highlight-color: transparent; }
    /* Ensure touch targets are usable — buttons, links, inputs */
    @media (pointer: coarse) {
      button, [role="button"], a, input[type="button"], input[type="submit"],
      input[type="reset"], select, .sp-btn, .btn, .tab {
        min-height: 44px;
        min-width: 44px;
      }
      input[type="range"] {
        min-height: 32px;
      }
      input[type="range"]::-webkit-slider-thumb {
        width: 24px;
        height: 24px;
      }
    }
    /* Safe area insets for notched phones */
    body {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
    /* Prevent horizontal overflow (common mobile issue) */
    html, body { max-width: 100vw; }
    /* Smooth scrolling for modern mobile */
    html { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
    /* Fix canvas touch — prevent pull-to-refresh on canvas-heavy apps */
    canvas { touch-action: none; }
    /* Scrollable containers should scroll smoothly */
    [style*="overflow"], .scrollable { -webkit-overflow-scrolling: touch; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Preload VT323 for the chat panel's CRT theme — graceful fallback if the
  // host page or browser blocks it (next monospace in stack takes over).
  if (!document.querySelector('link[data-sloppy-font="vt323"]')) {
    var _fontLink = document.createElement('link');
    _fontLink.rel = 'stylesheet';
    _fontLink.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
    _fontLink.setAttribute('data-sloppy-font', 'vt323');
    document.head.appendChild(_fontLink);
  }

  // Inject viewport-fit=cover if missing (safe area support for notched phones)
  const vpMeta = document.querySelector('meta[name="viewport"]');
  if (vpMeta && !vpMeta.content.includes('viewport-fit')) {
    vpMeta.content = vpMeta.content + ',viewport-fit=cover';
  }

  // Cookie domain helper (matches supabase-config-fixed.js logic)
  function _getCookieDomain() {
    var h = window.location.hostname;
    if (h.includes('sloppy.live')) return '.sloppy.live';
    if (h.includes('vibecodedbyx.com')) return '.vibecodedbyx.com';
    if (h.includes('youreabsolutelyright.xyz')) return '.youreabsolutelyright.xyz';
    return undefined; // localhost or unknown — let browser use current hostname
  }

  // Initialize Supabase
  async function initSupabase() {
    if (window.supabase) {
      supabase = window.supabase;
    } else {
      // Use createBrowserClient for proper cookie handling
      var cookieDomain = _getCookieDomain();
      var cookieOpts = { name: 'sb-auth-token', path: '/', sameSite: 'lax' };
      if (cookieDomain) cookieOpts.domain = cookieDomain;
      try {
        const { createBrowserClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/ssr@0.7.0/+esm');
        supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, { cookieOptions: cookieOpts });
      } catch (e) {
        // Fallback to createClient if SSR module unavailable
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
    }

    // Get session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      currentUser = session.user;
    } else {
      // Try anonymous auth
      const { data } = await supabase.auth.signInAnonymously();
      currentUser = data?.user;
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      var prevAuth = userContext.isAuthenticated;
      var prevProvider = userContext.authProvider;
      var prevUserId = userContext.userId;
      currentUser = session?.user;
      cacheTimestamp = 0; // Force refresh
      syncContext(); // Update auth fields immediately
      // Broadcast auth state change if it actually changed
      var nowAuth = userContext.isAuthenticated;
      var nowProvider = userContext.authProvider;
      if (prevAuth !== nowAuth || prevProvider !== nowProvider) {
        broadcastEvent('auth-changed', {
          isAuthenticated: nowAuth,
          authProvider: nowProvider,
          userId: userContext.userId,
          event: event // 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', etc.
        });
      }
      // Re-subscribe to notifications when user changes
      if (prevUserId !== userContext.userId) {
        _subscribeToNotifications();
      }
      fetchUserData();
    });

    await fetchUserData();
    _subscribeToNotifications();
  }

  // Fetch user data
  async function fetchUserData() {
    if (!supabase || !currentUser) return;

    // Check cache
    if (Date.now() - cacheTimestamp < CACHE_DURATION) return;

    // If worker active and this tab is NOT the leader, request from worker instead of DB
    if (syncWorker && syncWorkerReady && !isLeaderTab) {
      syncWorker.port.postMessage({ type: 'request-context' });
      return;
    }

    try {
      // Parallel queries (karma + premium + verifications). Use
      // maybeSingle() instead of single() — both look up rows that
      // legitimately may not exist for new users. single() emits
      // PGRST116 ("no rows") to the console even when our calling
      // code already handles the null case fine; maybeSingle() returns
      // {data: null} silently.
      const [karmaResult, premiumResult, verifyResult] = await Promise.all([
        supabase
          .from('sloppygram_karma')
          .select('karma_total, rank, username')
          .eq('user_id', currentUser.id)
          .maybeSingle(),
        supabase
          .from('users')
          .select('purchased_at')
          .eq('user_id', currentUser.id)
          .maybeSingle(),
        supabase
          .from('sloppyid_verifications')
          .select('verification_type, is_verified')
          .eq('user_id', currentUser.id)
      ]);

      if (karmaResult.data) {
        userData.karma = karmaResult.data.karma_total || 0;
        userData.rank = karmaResult.data.rank;
        if (karmaResult.data.username) userData.username = karmaResult.data.username;
      }

      userData.premium = !!premiumResult.data?.purchased_at;

      // Calculate trust score from verifications
      userData.verifiedProviders = [];
      userData.trustScore = 0;
      if (verifyResult.data) {
        for (var vi = 0; vi < verifyResult.data.length; vi++) {
          var v = verifyResult.data[vi];
          if (!v.is_verified) continue;
          userData.verifiedProviders.push(v.verification_type);
          if (v.verification_type === 'twitter') userData.trustScore += 100;
          else if (v.verification_type === 'email') userData.trustScore += 150;
          else if (v.verification_type === 'github') userData.trustScore += 200;
        }
      }
      // Twitter from auth metadata also counts
      if (currentUser.user_metadata?.user_name && userData.verifiedProviders.indexOf('twitter') === -1) {
        userData.verifiedProviders.push('twitter');
        userData.trustScore += 100;
      }
      userData.verificationLevel = Math.min(userData.verifiedProviders.length, 3);

      // Check for Twitter username (highest priority)
      if (currentUser.user_metadata?.user_name) {
        userData.username = '@' + currentUser.user_metadata.user_name;
        userData.isTwitter = true;
      }

      // If still no username, try sloppygram_profiles
      if (userData.username === 'Guest' && !userData.isTwitter) {
        try {
          var profResult = await supabase
            .from('sloppygram_profiles')
            .select('username')
            .eq('user_id', currentUser.id)
            .maybeSingle();
          if (profResult.data?.username) userData.username = profResult.data.username;
        } catch (e) { /* non-fatal */ }
      }

      // Stable fallback: deterministic from user ID (never random)
      if (userData.username === 'Guest') {
        userData.username = 'Anon_' + currentUser.id.slice(0, 6);
      }

      cacheTimestamp = Date.now();
      syncContext();
      userContext.ready = true;
      // Push context to worker so all tabs get it
      if (syncWorker && syncWorkerReady && isLeaderTab) {
        try {
          syncWorker.port.postMessage({ type: 'context-update', context: Object.assign({}, userContext) });
        } catch (e) {}
      }
      broadcastEvent('context-ready', { context: userContext });
      render();
    } catch (e) {
      console.warn('SloppyBar: Error fetching user data', e);
      // Still sync what we have
      syncContext();
    }
  }


  // Render the bar
  function render() {
    let bar = document.getElementById('sloppy-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'sloppy-bar';
      bar.className = 'sloppy-bar' + (isMinimized ? ' minimized' : '');
      document.body.appendChild(bar);
    }

    bar.className = 'sloppy-bar' + (isMinimized ? ' minimized' : '');

    const isLoggedIn = !!currentUser;
    const isAnon = currentUser?.app_metadata?.provider === 'anonymous' || !currentUser?.user_metadata?.user_name;

    bar.innerHTML = `
      <span class="sloppy-bar-minimized-icon"><span class="sloppy-bar-logo-s">S</span> sloppy.live</span>
      <div class="sloppy-bar-left">
        <a href="/sloppy-id" class="sloppy-bar-identity" title="View your SloppyID profile">
          <span class="sloppy-bar-avatar">${userData.isTwitter ? '🐦' : '<span class="sloppy-bar-logo-s">S</span>'}</span>
          <span class="sloppy-bar-username">${userData.username}</span>
          ${!options.hideKarma && userData.karma > 0 ? `<span class="sloppy-bar-karma">⚡${formatNumber(userData.karma)}</span>` : ''}
        </a>
        <div class="sloppy-bar-badges">
          ${userData.premium ? '<span class="sloppy-bar-badge" title="Premium">👑</span>' : ''}
          ${userData.rank && userData.rank <= 10 ? '<span class="sloppy-bar-badge" title="Top 10">🏆</span>' : ''}
          ${renderTrustBadge()}
        </div>
      </div>
      ${!options.hideLinks ? `
      <div class="sloppy-bar-center">
        <span class="sloppy-bar-vault-wrap"><button class="sloppy-bar-link sloppy-bar-karma-trigger" type="button" onclick="window.sloppyBarToggleKarma(event)" title="Open the Karma leaderboard in an inline panel">📊 Karma</button><span class="sloppy-bar-notif-dot ${userContext.unreadCount > 0 ? 'show' : ''}" id="sloppy-bar-notif"></span></span>
        <div class="sloppy-bar-dropdown-wrapper">
          <span class="sloppy-bar-link sloppy-bar-apps-trigger" onclick="window.sloppyBarToggleDropdown(event)" title="Ecosystem · all modules + recent apps">🚀 Apps</span>
          <div class="sloppy-bar-dropdown ${dropdownOpen ? 'open' : ''}" id="sloppy-bar-dropdown">
            ${renderDropdown()}
          </div>
        </div>
      </div>
      ` : ''}
      <div class="sloppy-bar-right">
        ${_shouldRenderVote() ? `<button class="sloppy-bar-vote${_sloppyVoteUserVoted ? ' voted' : ''}" onclick="window.sloppyBarVote()" title="${_sloppyVoteUserVoted ? 'Remove vote' : 'Upvote this app'}">
          <span class="sloppy-vote-arrow">${_sloppyVoteUserVoted ? '▲' : '△'}</span>${_sloppyVoteCount > 0 ? `<span class="sloppy-vote-count">${_sloppyVoteCount}</span>` : ''}
        </button>` : ''}
        <button class="sloppy-bar-bell${_notifUnreadCount > 0 ? ' has-unread' : ''}" onclick="window.sloppyBarToggleNotifications(event)" title="Notifications" aria-label="Notifications" aria-haspopup="true" aria-expanded="${_notifPanelOpen}">
          🔔<span class="sloppy-bar-bell-badge${_notifUnreadCount > 0 ? ' show' : ''}" id="sloppy-bar-bell-badge">${_notifUnreadCount > 99 ? '99+' : _notifUnreadCount}</span>
        </button>
        <button class="sloppy-bar-chat${_chatUnseenCount > 0 ? ' has-unseen' : ''}" onclick="window.sloppyBarToggleChat(event)" title="Live global chat" aria-label="Live chat" aria-haspopup="true" aria-expanded="${_chatPanelOpen}">
          💬<span class="sloppy-bar-chat-badge${_chatUnseenCount > 0 ? ' show' : ''}" id="sloppy-bar-chat-badge">${_chatUnseenCount > 99 ? '99+' : _chatUnseenCount}</span>
        </button>
        <button class="sloppy-bar-teleport" onclick="window.sloppyBarTeleport()" title="Random app adventure!">
          <span class="sloppy-bar-teleport-icon">🌀</span> Teleport
        </button>
        ${isAnon && isLoggedIn ? `
          <a href="/sloppy-id" class="sloppy-bar-auth-btn">Connect Twitter</a>
        ` : ''}
        <a href="https://sloppy.live" class="sloppy-bar-home">← sloppy.live</a>
        <button class="sloppy-bar-hardreload" onclick="window.sloppyBarHardReload(event)" title="Hard reload — clear caches + service workers then reload (v${BAR_VERSION})" aria-label="Hard reload">
          ♻
        </button>
        <button class="sloppy-bar-toggle" onclick="window.sloppyBarToggle()" title="${isMinimized ? 'Expand' : 'Minimize'}">
          ${isMinimized ? '◀' : '▼'}
        </button>
      </div>
    `;

    // Click to expand when minimized
    if (isMinimized) {
      bar.onclick = () => {
        isMinimized = false;
        render();
      };
    } else {
      bar.onclick = null;
    }
  }

  // ===================================================================
  // === NOTEPAD: persistent scratchpad in the header ===
  // ===================================================================
  // Single-textarea notepad with debounced auto-save to localStorage. The
  // panel is mutually exclusive with the other floating header panels
  // (notif/chat — Twitch can coexist since it's a separate movable window).
  // Storage key is per-browser, NOT per-user — survives sign-out/sign-in
  // intentionally (it's your local scratch, not a vaulted note). Use the
  // Vault in /sloppy-id for cross-device persistent storage.
  const NOTEPAD_KEY = 'sloppy_notepad_v1';
  const NOTEPAD_META_KEY = 'sloppy_notepad_v1_meta';
  const NOTEPAD_SAVE_DEBOUNCE_MS = 350;
  const NOTEPAD_MAX_CHARS = 20000; // ~10 pages of text — generous but bounded
  let _notepadPanelOpen = false;
  let _notepadSaveTimer = null;
  let _notepadDirty = false;

  function _notepadLoad() {
    try { return localStorage.getItem(NOTEPAD_KEY) || ''; }
    catch { return ''; }
  }
  function _notepadLoadMeta() {
    try {
      var raw = localStorage.getItem(NOTEPAD_META_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
  function _notepadSave(text) {
    try {
      var trimmed = text.length > NOTEPAD_MAX_CHARS ? text.slice(0, NOTEPAD_MAX_CHARS) : text;
      localStorage.setItem(NOTEPAD_KEY, trimmed);
      localStorage.setItem(NOTEPAD_META_KEY, JSON.stringify({ ts: Date.now(), len: trimmed.length }));
      _notepadDirty = false;
      _notepadUpdateStatus('saved', true);
      _notepadUpdateFooter();
    } catch (e) {
      _notepadUpdateStatus('error');
    }
  }
  function _notepadUpdateStatus(state, flash) {
    var s = document.getElementById('sloppy-notepad-status');
    if (!s) return;
    s.classList.remove('saved', 'dirty', 'flash');
    if (state === 'saved') {
      s.classList.add('saved');
      if (flash) {
        s.classList.add('flash');
        setTimeout(function() { s.classList.remove('flash'); }, 600);
      }
      var lbl = s.querySelector('.label');
      if (lbl) lbl.textContent = 'saved';
    } else if (state === 'dirty') {
      s.classList.add('dirty');
      var lbl2 = s.querySelector('.label');
      if (lbl2) lbl2.textContent = 'saving…';
    } else if (state === 'error') {
      s.classList.add('dirty');
      var lbl3 = s.querySelector('.label');
      if (lbl3) lbl3.textContent = 'save failed';
    }
  }
  function _notepadUpdateFooter() {
    var foot = document.getElementById('sloppy-notepad-footer');
    var ta   = document.getElementById('sloppy-notepad-textarea');
    if (!foot || !ta) return;
    var meta = _notepadLoadMeta();
    var len = ta.value.length;
    var rel = meta && meta.ts ? _notepadRelTime(meta.ts) : 'never';
    foot.innerHTML =
      '<span>' + len.toLocaleString() + ' / ' + NOTEPAD_MAX_CHARS.toLocaleString() + ' chars</span>' +
      '<span>saved ' + rel + '</span>';
  }
  function _notepadRelTime(ts) {
    var diff = Date.now() - ts;
    if (diff < 5000) return 'just now';
    if (diff < 60000) return Math.floor(diff/1000) + 's ago';
    if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
    return Math.floor(diff/86400000) + 'd ago';
  }
  function _notepadOnInput() {
    var ta = document.getElementById('sloppy-notepad-textarea');
    if (!ta) return;
    if (ta.value.length > NOTEPAD_MAX_CHARS) {
      ta.value = ta.value.slice(0, NOTEPAD_MAX_CHARS);
    }
    _notepadDirty = true;
    _notepadUpdateStatus('dirty');
    _notepadUpdateFooter();
    clearTimeout(_notepadSaveTimer);
    _notepadSaveTimer = setTimeout(function() { _notepadSave(ta.value); }, NOTEPAD_SAVE_DEBOUNCE_MS);
  }
  function _notepadFlushOnLeave() {
    // Flush any pending save when the user navigates away — prevents the last
    // ~350ms of typing from being lost on a fast tab close.
    if (_notepadDirty) {
      var ta = document.getElementById('sloppy-notepad-textarea');
      if (ta) _notepadSave(ta.value);
    }
  }
  // Best-effort save on page unload (sync localStorage call)
  window.addEventListener('beforeunload', _notepadFlushOnLeave);
  window.addEventListener('pagehide', _notepadFlushOnLeave);

  function _renderNotepadPanel() {
    var panel = document.getElementById('sloppy-bar-notepad-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'sloppy-bar-notepad-panel';
      panel.className = 'sloppy-bar-notepad-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Persistent notepad');
      panel.innerHTML =
        '<div class="sloppy-notepad-header">' +
          '<div class="sloppy-notepad-title">📝 notepad</div>' +
          '<div class="sloppy-notepad-status saved" id="sloppy-notepad-status"><span class="dot"></span><span class="label">saved</span></div>' +
          '<div class="sloppy-notepad-actions">' +
            '<button type="button" id="sloppy-notepad-copy" title="Copy all to clipboard">copy</button>' +
            '<button type="button" id="sloppy-notepad-clear" class="danger" title="Clear notepad (cannot be undone)">clear</button>' +
          '</div>' +
        '</div>' +
        '<textarea id="sloppy-notepad-textarea" class="sloppy-notepad-textarea" placeholder="scratch thoughts, links, snippets… auto-saves as you type. cleared only when you ask." spellcheck="false" autocomplete="off"></textarea>' +
        '<div class="sloppy-notepad-footer" id="sloppy-notepad-footer"></div>';
      document.body.appendChild(panel);

      var ta    = panel.querySelector('#sloppy-notepad-textarea');
      var copy  = panel.querySelector('#sloppy-notepad-copy');
      var clear = panel.querySelector('#sloppy-notepad-clear');

      // Populate from localStorage
      ta.value = _notepadLoad();
      _notepadUpdateFooter();

      ta.addEventListener('input', _notepadOnInput);
      ta.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') window.sloppyBarToggleNotepad();
        // Cmd/Ctrl+S → force immediate save
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
          e.preventDefault();
          clearTimeout(_notepadSaveTimer);
          _notepadSave(ta.value);
        }
      });
      copy.addEventListener('click', async function() {
        try {
          await navigator.clipboard.writeText(ta.value);
          try { _showToast('Notepad copied to clipboard', { type: 'success' }); } catch (_) {}
        } catch (_) {
          // Fallback: select all so user can manually Cmd+C
          ta.focus(); ta.select();
        }
      });
      clear.addEventListener('click', function() {
        if (ta.value.trim().length === 0) return;
        if (!confirm('Clear the entire notepad? This cannot be undone.')) return;
        ta.value = '';
        _notepadSave('');
        _notepadUpdateFooter();
        ta.focus();
      });
    }
    panel.classList.add('open');
    // Focus the textarea after panel becomes visible
    setTimeout(function() {
      var ta = document.getElementById('sloppy-notepad-textarea');
      if (ta) ta.focus();
    }, 40);
  }
  function _hideNotepadPanel() {
    // Flush any pending save before hiding
    _notepadFlushOnLeave();
    var panel = document.getElementById('sloppy-bar-notepad-panel');
    if (panel) panel.classList.remove('open');
    _notepadPanelOpen = false;
  }
  // ===================================================================
  // === KARMA LEADERBOARD WINDOW ======================================
  // ===================================================================
  // Inline iframe to /karma-board, lazy-mounted on first toggle. Lives
  // bottom-right above the bar so it sits next to the trigger button.
  // Replaces the old 🪪 Vault link — chat preferred a peek at the karma
  // standings over a navigation away from the current app.
  let _karmaOpen = false;
  let _karmaMounted = false;
  function _ensureKarmaWindowStyles() {
    if (document.getElementById('sloppy-bar-karma-style')) return;
    var st = document.createElement('style');
    st.id = 'sloppy-bar-karma-style';
    st.textContent = '\
    .sloppy-karma-window{position:fixed;bottom:60px;right:14px;width:min(420px,calc(100vw - 28px));height:min(560px,calc(100vh - 90px));background:#0d1018;border:2px solid #3a2c5a;border-radius:6px;box-shadow:0 6px 32px rgba(0,0,0,0.6),0 0 26px rgba(180,120,255,0.18);z-index:99999;display:flex;flex-direction:column;overflow:hidden;font-family:"JetBrains Mono",monospace;color:#cdd6ea}\
    .sloppy-karma-header{display:flex;align-items:center;gap:8px;padding:8px 10px;background:linear-gradient(180deg,#221830,#160f22);border-bottom:1px solid #3a2c5a;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;color:#bb8cff;user-select:none}\
    .sloppy-karma-header .k-title{flex:1}\
    .sloppy-karma-btn{background:#1a1224;border:1px solid #3a2c5a;color:#cdd6ea;width:26px;height:26px;border-radius:3px;cursor:pointer;font-family:inherit;font-size:0.9rem;line-height:1;padding:0}\
    .sloppy-karma-btn:hover{background:#2a1a3e;color:#fff}\
    .sloppy-karma-body{flex:1;background:#06030c;position:relative}\
    .sloppy-karma-body iframe{position:absolute;inset:0;width:100%;height:100%;border:0}\
    .sloppy-karma-empty{display:flex;align-items:center;justify-content:center;height:100%;color:#7a6c92;font-style:italic;font-size:0.85rem}';
    document.head.appendChild(st);
  }
  function _karmaMountIframe() {
    var win = document.getElementById('sloppy-karma-window');
    if (!win) return;
    var body = win.querySelector('.sloppy-karma-body');
    if (!body) return;
    body.innerHTML = '<iframe src="/karma-board/?embed=1" title="Karma leaderboard" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" loading="lazy"></iframe>';
    _karmaMounted = true;
  }
  function _renderKarmaWindow() {
    _ensureKarmaWindowStyles();
    var win = document.getElementById('sloppy-karma-window');
    if (!win) {
      win = document.createElement('div');
      win.id = 'sloppy-karma-window';
      win.className = 'sloppy-karma-window';
      win.setAttribute('role', 'dialog');
      win.setAttribute('aria-label', 'Karma leaderboard');
      win.innerHTML =
        '<div class="sloppy-karma-header">' +
          '<div class="k-title">📊 Karma · Leaderboard</div>' +
          '<button class="sloppy-karma-btn" id="sloppy-karma-reload" title="reload" type="button">↻</button>' +
          '<a class="sloppy-karma-btn" id="sloppy-karma-popout"  title="open full page" href="/karma-board" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none">↗</a>' +
          '<button class="sloppy-karma-btn" id="sloppy-karma-close" title="close" type="button">✕</button>' +
        '</div>' +
        '<div class="sloppy-karma-body"><div class="sloppy-karma-empty">loading karma board…</div></div>';
      document.body.appendChild(win);
      win.querySelector('#sloppy-karma-close').addEventListener('click', function() { window.sloppyBarToggleKarma(); });
      win.querySelector('#sloppy-karma-reload').addEventListener('click', function() { _karmaMountIframe(); });
    }
    if (!_karmaMounted) _karmaMountIframe();
  }
  window.sloppyBarToggleKarma = function(ev) {
    if (ev) { ev.stopPropagation(); ev.preventDefault(); }
    var win = document.getElementById('sloppy-karma-window');
    if (_karmaOpen && win) {
      win.style.display = 'none';
      _karmaOpen = false;
    } else {
      _renderKarmaWindow();
      var w = document.getElementById('sloppy-karma-window');
      if (w) w.style.display = 'flex';
      _karmaOpen = true;
    }
  };

  window.sloppyBarToggleNotepad = function(ev) {
    if (ev) { ev.stopPropagation(); ev.preventDefault(); }
    if (_notepadPanelOpen) { _hideNotepadPanel(); return; }
    // Mutual exclusion with other panels (Twitch stays — it's a separate movable window)
    if (_notifPanelOpen) { try { _hideNotifPanel(); } catch (_) {} }
    if (_chatPanelOpen)  { try { _hideChatPanel();  } catch (_) {} }
    _notepadPanelOpen = true;
    _renderNotepadPanel();
    // Outside-click closer
    setTimeout(function() {
      var off = function(e) {
        var panel = document.getElementById('sloppy-bar-notepad-panel');
        if (!panel) return document.removeEventListener('click', off);
        if (panel.contains(e.target)) return;
        if (e.target.closest('.sloppy-bar-notepad')) return;
        _hideNotepadPanel();
        document.removeEventListener('click', off);
      };
      document.addEventListener('click', off);
    }, 0);
  };

  // ===================================================================
  // === TWITCH STREAM WINDOW: scalable + movable, lazy-loaded iframe ===
  // ===================================================================
  // The window is rendered the first time the user clicks 📺. The iframe
  // is NOT loaded until the user explicitly hits the ▶ play button —
  // this keeps Twitch's tracker scripts + autoplay video off the page
  // for users who never expand the player. Channel persists to
  // localStorage so subsequent toggles remember it.
  const TWITCH_CHANNEL_KEY = 'sloppy_twitch_channel';
  const TWITCH_GEOMETRY_KEY = 'sloppy_twitch_geom_v1';
  let _twitchOpen = false;
  let _twitchLoaded = false;   // true once the iframe is mounted

  function _twitchDefaultChannel() {
    // Default to 'sloppy_ai' (the AI streamer's channel) per chat request.
    // localStorage override still wins if the user typed a different channel.
    try { return localStorage.getItem(TWITCH_CHANNEL_KEY) || 'sloppy_ai'; }
    catch { return 'sloppy_ai'; }
  }
  function _twitchSaveGeometry(rect) {
    try { localStorage.setItem(TWITCH_GEOMETRY_KEY, JSON.stringify(rect)); } catch (_) {}
  }
  function _twitchLoadGeometry() {
    try {
      var raw = localStorage.getItem(TWITCH_GEOMETRY_KEY);
      if (!raw) return null;
      var g = JSON.parse(raw);
      if (typeof g !== 'object' || g == null) return null;
      return g;
    } catch { return null; }
  }
  function _twitchMountIframe(channel) {
    var win = document.getElementById('sloppy-twitch-window');
    if (!win) return;
    var body = win.querySelector('.sloppy-twitch-body');
    if (!body) return;
    var parent = encodeURIComponent(window.location.hostname || 'sloppy.live');
    // Cross-domain hostnames Twitch enforces: each one our app might run under
    var parents = ['sloppy.live', 'app.sloppy.live'];
    var ph = window.location.hostname;
    if (ph && parents.indexOf(ph) === -1) parents.push(ph);
    var parentParam = parents.map(function(h) { return 'parent=' + encodeURIComponent(h); }).join('&');
    var safeChannel = String(channel || 'sloppy_ai').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 25) || 'sloppy_ai';
    var src = 'https://player.twitch.tv/?channel=' + encodeURIComponent(safeChannel) + '&' + parentParam + '&muted=true&autoplay=true';
    body.innerHTML = '<iframe src="' + src + '" allow="autoplay; fullscreen" allowfullscreen="true" sandbox="allow-scripts allow-same-origin allow-popups allow-forms" title="Twitch player"></iframe>';
    _twitchLoaded = true;
  }
  function _twitchUnmountIframe() {
    var win = document.getElementById('sloppy-twitch-window');
    if (!win) return;
    var body = win.querySelector('.sloppy-twitch-body');
    if (!body) return;
    body.innerHTML =
      '<div class="sloppy-twitch-empty">' +
        '<span class="play" id="sloppy-twitch-play" title="play stream">▶</span>' +
        '<div>stream not loaded yet · click ▶ to start</div>' +
      '</div>';
    var play = body.querySelector('#sloppy-twitch-play');
    if (play) play.addEventListener('click', function() {
      var input = document.getElementById('sloppy-twitch-channel');
      _twitchMountIframe(input ? input.value.trim() : _twitchDefaultChannel());
    });
    _twitchLoaded = false;
  }
  function _renderTwitchWindow() {
    var win = document.getElementById('sloppy-twitch-window');
    if (!win) {
      win = document.createElement('div');
      win.id = 'sloppy-twitch-window';
      win.className = 'sloppy-twitch-window';
      win.setAttribute('role', 'dialog');
      win.setAttribute('aria-label', 'Twitch stream player');
      var defaultCh = _twitchDefaultChannel();
      win.innerHTML =
        '<div class="sloppy-twitch-header" id="sloppy-twitch-header">' +
          '<div class="sloppy-twitch-title"><span class="tw-dot" aria-hidden="true"></span>twitch</div>' +
          '<input type="text" class="sloppy-twitch-channel-input" id="sloppy-twitch-channel" value="' + defaultCh.replace(/[<>&"]/g, '') + '" placeholder="channel" maxlength="25" aria-label="Twitch channel">' +
          '<div class="sloppy-twitch-controls">' +
            '<button class="sloppy-twitch-btn" id="sloppy-twitch-reload" title="reload stream" type="button">↻</button>' +
            '<button class="sloppy-twitch-btn" id="sloppy-twitch-stop"   title="stop stream"   type="button">■</button>' +
            '<button class="sloppy-twitch-btn" id="sloppy-twitch-close"  title="close"         type="button">✕</button>' +
          '</div>' +
        '</div>' +
        '<div class="sloppy-twitch-body" id="sloppy-twitch-body"></div>' +
        '<div class="sloppy-twitch-resize" id="sloppy-twitch-resize" aria-hidden="true"></div>';
      document.body.appendChild(win);

      // Restore geometry
      var geom = _twitchLoadGeometry();
      if (geom) {
        if (typeof geom.left === 'number')   win.style.left   = geom.left + 'px';
        if (typeof geom.top === 'number')    win.style.top    = geom.top  + 'px';
        if (typeof geom.width === 'number')  win.style.width  = geom.width  + 'px';
        if (typeof geom.height === 'number') win.style.height = geom.height + 'px';
        if (typeof geom.left === 'number') win.style.right = 'auto';
      }

      // Wire controls
      var inp    = win.querySelector('#sloppy-twitch-channel');
      var reload = win.querySelector('#sloppy-twitch-reload');
      var stop   = win.querySelector('#sloppy-twitch-stop');
      var close  = win.querySelector('#sloppy-twitch-close');
      inp.addEventListener('change', function() {
        try { localStorage.setItem(TWITCH_CHANNEL_KEY, inp.value.trim()); } catch (_) {}
        if (_twitchLoaded) _twitchMountIframe(inp.value.trim());
      });
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); inp.blur(); /* triggers change */ }
      });
      reload.addEventListener('click', function() { _twitchMountIframe(inp.value.trim()); });
      stop.addEventListener('click', _twitchUnmountIframe);
      close.addEventListener('click', function() { window.sloppyBarToggleTwitch(); });

      // Drag from the header
      var header = win.querySelector('#sloppy-twitch-header');
      var drag = null;
      header.addEventListener('pointerdown', function(e) {
        if (e.target.closest('input, button')) return; // don't drag from controls
        header.setPointerCapture(e.pointerId);
        var r = win.getBoundingClientRect();
        drag = { dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width, h: r.height };
        win.style.right = 'auto';
      });
      header.addEventListener('pointermove', function(e) {
        if (!drag) return;
        var x = Math.max(0, Math.min(window.innerWidth  - 60, e.clientX - drag.dx));
        var y = Math.max(0, Math.min(window.innerHeight - 30, e.clientY - drag.dy));
        win.style.left = x + 'px';
        win.style.top  = y + 'px';
      });
      header.addEventListener('pointerup', function() {
        if (!drag) return;
        drag = null;
        var r = win.getBoundingClientRect();
        _twitchSaveGeometry({ left: r.left, top: r.top, width: r.width, height: r.height });
      });

      // Resize handle (bottom-right corner)
      var grip = win.querySelector('#sloppy-twitch-resize');
      var rz = null;
      grip.addEventListener('pointerdown', function(e) {
        grip.setPointerCapture(e.pointerId);
        e.preventDefault();
        var r = win.getBoundingClientRect();
        rz = { startX: e.clientX, startY: e.clientY, w: r.width, h: r.height, left: r.left, top: r.top };
        win.style.right = 'auto';
      });
      grip.addEventListener('pointermove', function(e) {
        if (!rz) return;
        var w = Math.max(240, Math.min(window.innerWidth - rz.left - 8, rz.w + (e.clientX - rz.startX)));
        var h = Math.max(180, Math.min(window.innerHeight - rz.top - 8, rz.h + (e.clientY - rz.startY)));
        win.style.width  = w + 'px';
        win.style.height = h + 'px';
      });
      grip.addEventListener('pointerup', function() {
        if (!rz) return;
        rz = null;
        var r = win.getBoundingClientRect();
        _twitchSaveGeometry({ left: r.left, top: r.top, width: r.width, height: r.height });
      });

      // Initial empty state (no iframe yet → no autoplay until user clicks ▶)
      _twitchUnmountIframe();
    }
    win.classList.add('open');
  }
  function _hideTwitchWindow() {
    var win = document.getElementById('sloppy-twitch-window');
    if (win) win.classList.remove('open');
    _twitchOpen = false;
  }
  window.sloppyBarToggleTwitch = function(ev) {
    if (ev) { ev.stopPropagation(); ev.preventDefault(); }
    if (_twitchOpen) { _hideTwitchWindow(); return; }
    _twitchOpen = true;
    _renderTwitchWindow();
  };

  // ===================================================================
  // === LIVE CHAT: compact panel toggled from the header ===
  // ===================================================================
  function _chatRelTime(iso) {
    var diff = Date.now() - new Date(iso).getTime();
    if (diff < 30000) return 'now';
    if (diff < 60000) return Math.floor(diff/1000) + 's';
    if (diff < 3600000) return Math.floor(diff/60000) + 'm';
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h';
    return Math.floor(diff/86400000) + 'd';
  }
  function _chatEsc(s) {
    return String(s == null ? '' : s).replace(/[<>&"]/g, function(c) {
      return ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;' })[c];
    });
  }
  function _chatRenderMsgBody(m) {
    // message_type can be 'text', 'image', 'drawing', 'gif'
    if (m.message_type === 'drawing' && m.drawing_data) {
      return '<img src="' + _chatEsc(m.drawing_data) + '" alt="doodle">';
    }
    if (m.message_type === 'image' && m.image_data) {
      return (m.content ? _chatEsc(m.content) + '<br>' : '') +
             '<img src="' + _chatEsc(m.image_data) + '" alt="image">';
    }
    return _chatEsc(m.content || '');
  }
  function _chatRender() {
    var panel = document.getElementById('sloppy-bar-chat-panel');
    if (!panel) return;
    var list = panel.querySelector('.sloppy-chat-list');
    if (!list) return;
    if (_chatMessages.length === 0) {
      list.innerHTML = '<div class="sloppy-chat-empty">no messages yet · be the first to type</div>';
      return;
    }
    var myId = currentUser && currentUser.id;
    list.innerHTML = _chatMessages.map(function(m) {
      var isOwn = myId && m.user_id === myId;
      var typeIcon = '';
      if (m.message_type === 'drawing') typeIcon = '<span class="sloppy-chat-msg-icon">✏</span>';
      else if (m.message_type === 'image') typeIcon = '<span class="sloppy-chat-msg-icon">🖼</span>';
      else if (m.message_type === 'gif') typeIcon = '<span class="sloppy-chat-msg-icon">▶</span>';
      return '<div class="sloppy-chat-msg' + (isOwn ? ' own' : '') + '">' +
        '<span class="sloppy-chat-msg-user">' + _chatEsc(m.username || 'anon') + '</span>' +
        '<span class="sloppy-chat-msg-time">· ' + _chatRelTime(m.created_at) + '</span>' +
        '<div class="sloppy-chat-msg-body">' + typeIcon + _chatRenderMsgBody(m) + '</div>' +
      '</div>';
    }).join('');
    // auto-scroll to bottom (newest)
    list.scrollTop = list.scrollHeight;
  }
  async function _chatLoadInitial() {
    if (!supabase) return;
    var panel = document.getElementById('sloppy-bar-chat-panel');
    if (!panel) return;
    var list = panel.querySelector('.sloppy-chat-list');
    if (list && _chatMessages.length === 0) {
      list.innerHTML = '<div class="sloppy-chat-loading">loading…</div>';
    }
    try {
      var res = await supabase
        .from('sloppygram_messages')
        .select('id, username, content, image_data, drawing_data, message_type, user_id, created_at')
        .order('created_at', { ascending: false })
        .limit(CHAT_PAGE_SIZE);
      if (res.error) throw res.error;
      // newest-first → reverse to oldest-first for the list
      _chatMessages = (res.data || []).reverse();
      _chatRender();
    } catch (e) {
      console.warn('[chat] load failed', e);
      if (list) list.innerHTML = '<div class="sloppy-chat-empty">could not load chat</div>';
    }
  }
  function _chatSubscribe() {
    if (_chatChannel || !supabase) return;
    try {
      _chatChannel = supabase.channel('header-chat-stream')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sloppygram_messages' }, function(payload) {
          var m = payload && payload.new;
          if (!m) return;
          // De-dup by id (in case we already inserted optimistically)
          if (_chatMessages.some(function(x){ return x.id === m.id; })) return;
          _chatMessages.push(m);
          if (_chatMessages.length > CHAT_PAGE_SIZE * 2) {
            _chatMessages.splice(0, _chatMessages.length - CHAT_PAGE_SIZE * 2);
          }
          // If the panel is open, render; otherwise bump unseen badge (skip own messages)
          if (_chatPanelOpen) {
            _chatRender();
          } else if (currentUser && m.user_id !== currentUser.id) {
            _chatUnseenCount = Math.min(99, _chatUnseenCount + 1);
            _updateChatBadge();
          }
        })
        .subscribe();
    } catch (e) {
      console.warn('[chat] subscribe failed', e);
    }
  }
  function _chatUnsubscribe() {
    if (!_chatChannel) return;
    try { supabase.removeChannel(_chatChannel); } catch (_) {}
    _chatChannel = null;
  }
  function _updateChatBadge() {
    var badge = document.getElementById('sloppy-bar-chat-badge');
    if (!badge) return;
    if (_chatUnseenCount > 0) {
      badge.textContent = _chatUnseenCount > 99 ? '99+' : String(_chatUnseenCount);
      badge.classList.add('show');
      var btn = badge.parentElement;
      if (btn) {
        btn.classList.remove('has-unseen');
        void btn.offsetWidth;
        btn.classList.add('has-unseen');
        btn.setAttribute('aria-expanded', String(_chatPanelOpen));
      }
    } else {
      badge.classList.remove('show');
      badge.textContent = '0';
    }
  }
  function _renderChatPanel() {
    var panel = document.getElementById('sloppy-bar-chat-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'sloppy-bar-chat-panel';
      panel.className = 'sloppy-bar-chat-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Live global chat');
      panel.innerHTML =
        '<div class="sloppy-chat-header">' +
          '<div class="sloppy-chat-title"><span class="live-dot"></span>live · global chat</div>' +
          '<a class="sloppy-chat-pop-out" href="/sloppy-chat" title="open the full chat app">full ↗</a>' +
        '</div>' +
        '<div class="sloppy-chat-list" aria-live="polite"></div>' +
        '<div class="sloppy-chat-input-row">' +
          '<textarea class="sloppy-chat-input" id="sloppy-chat-input" placeholder="say something… (enter to send, shift+enter newline)" rows="1" maxlength="' + CHAT_MSG_MAX + '"></textarea>' +
          '<button class="sloppy-chat-send" id="sloppy-chat-send" type="button">send</button>' +
        '</div>' +
        '<div class="sloppy-chat-anon-notice" id="sloppy-chat-anon-notice" style="display:none">' +
          'sign in via <a href="/sloppy-id">/sloppy-id</a> to send messages — read-only otherwise' +
        '</div>';
      document.body.appendChild(panel);

      // Wire input + send
      var input = panel.querySelector('#sloppy-chat-input');
      var send  = panel.querySelector('#sloppy-chat-send');
      input.addEventListener('keydown', function(ev) {
        if (ev.key === 'Enter' && !ev.shiftKey) {
          ev.preventDefault();
          _chatSend();
        } else if (ev.key === 'Escape') {
          window.sloppyBarToggleChat();
        }
      });
      input.addEventListener('input', function() {
        send.disabled = input.value.trim().length === 0;
      });
      send.addEventListener('click', _chatSend);
      send.disabled = true;
    }
    // Hide send + show anon notice if not logged in
    var anon = panel.querySelector('#sloppy-chat-anon-notice');
    var inputRow = panel.querySelector('.sloppy-chat-input-row');
    if (currentUser) {
      anon.style.display = 'none';
      inputRow.style.display = 'flex';
    } else {
      anon.style.display = 'block';
      inputRow.style.display = 'none';
    }
    panel.classList.add('open');
    _chatRender();
  }
  function _hideChatPanel() {
    var panel = document.getElementById('sloppy-bar-chat-panel');
    if (panel) panel.classList.remove('open');
    _chatPanelOpen = false;
    var btn = document.querySelector('.sloppy-bar-chat');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
  async function _chatSend() {
    if (_chatSendingLock) return;
    if (!currentUser) return;
    var input = document.getElementById('sloppy-chat-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;
    if (text.length > CHAT_MSG_MAX) text = text.slice(0, CHAT_MSG_MAX);
    _chatSendingLock = true;
    var send = document.getElementById('sloppy-chat-send');
    if (send) send.disabled = true;
    // Resolve username from header context first, then user_metadata
    var uname = (userContext.username && userContext.username !== 'Guest')
                  ? userContext.username
                  : (currentUser.user_metadata && (currentUser.user_metadata.user_name || currentUser.user_metadata.username)) || 'anon';
    var avatar = (userContext.avatarUrl || userContext.avatar || '👤');
    try {
      var res = await supabase.from('sloppygram_messages').insert({
        username: uname.toString().slice(0, 32),
        avatar: typeof avatar === 'string' && !/^(https?:|data:)/.test(avatar) ? avatar : null,
        avatar_url: typeof avatar === 'string' && /^(https?:|data:)/.test(avatar) ? avatar : null,
        content: text,
        message_type: 'text',
        user_id: currentUser.id
      }).select('id, username, content, message_type, user_id, created_at').single();
      if (res.error) throw res.error;
      // Optimistic insertion (Realtime will also fire — dedup'd by id check in subscribe handler)
      if (res.data) {
        _chatMessages.push(res.data);
        if (_chatPanelOpen) _chatRender();
      }
      input.value = '';
    } catch (e) {
      console.warn('[chat] send failed', e);
      try { _showToast('Chat send failed: ' + (e.message || 'unknown'), { type: 'error' }); } catch (_) {}
    } finally {
      _chatSendingLock = false;
      if (send) send.disabled = false;
      if (input) input.focus();
    }
  }

  window.sloppyBarToggleChat = function(ev) {
    if (ev) { ev.stopPropagation(); ev.preventDefault(); }
    if (_chatPanelOpen) { _hideChatPanel(); return; }
    // Mutual exclusion: close notif + notepad panels if open
    if (_notifPanelOpen)   { try { _hideNotifPanel(); } catch (_) {} }
    if (_notepadPanelOpen) { try { _hideNotepadPanel(); } catch (_) {} }
    _chatPanelOpen = true;
    _renderChatPanel();
    // Clear unseen badge on open
    _chatUnseenCount = 0;
    _updateChatBadge();
    // Lazy-load + subscribe on first open
    if (_chatMessages.length === 0) _chatLoadInitial();
    _chatSubscribe();
    // Outside-click closer
    setTimeout(function() {
      var off = function(e) {
        var panel = document.getElementById('sloppy-bar-chat-panel');
        if (!panel) return document.removeEventListener('click', off);
        if (panel.contains(e.target)) return;
        if (e.target.closest('.sloppy-bar-chat')) return;
        _hideChatPanel();
        document.removeEventListener('click', off);
      };
      document.addEventListener('click', off);
    }, 0);
  };

  // === Realtime notifications subscription ===
  // Subscribes to postgres_changes INSERT on the `notifications` table
  // filtered by recipient_id = current user. Any app on the network can
  // INSERT into `notifications` with {recipient_id, type, title, body, url,
  // source_app} and the header will:
  //   1. Surface a toast (via _pushNotification → _showToast)
  //   2. Add an entry to the persistent bell log (cap 30, localStorage-backed)
  //   3. Bump the unread badge on the bell button
  //   4. Re-emit the legacy `unread-changed` event so the red dot on the
  //      Vault link stays in sync with the bell badge
  //
  // The channel is torn down + recreated on user change. Only the leader
  // tab subscribes — non-leader tabs get the notification via the existing
  // BroadcastChannel propagation when the leader pushes it into the log.
  var _notifChannel = null;
  function _subscribeToNotifications() {
    // Always tear down any prior channel first
    if (_notifChannel) {
      try { supabase.removeChannel(_notifChannel); } catch (_) {}
      _notifChannel = null;
    }
    if (!supabase || !currentUser) return;
    // Only the leader tab subscribes — non-leaders receive via BroadcastChannel
    if (syncWorker && syncWorkerReady && !isLeaderTab) return;
    try {
      _notifChannel = supabase.channel('header-notif-' + currentUser.id)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'recipient_id=eq.' + currentUser.id
        }, function(payload) {
          var row = payload && payload.new;
          if (!row) return;
          var iconMap = {
            mention:  '@',
            dm:       '💌',
            vote:     '▲',
            comment:  '💬',
            follow:   '👤',
            reaction: '✨',
            karma:    '⚡',
            achievement: '🏆',
            custom:   'ℹ'
          };
          var icon = iconMap[row.type] || iconMap.custom;
          var typeMap = {
            vote:    'success',
            karma:   'success',
            achievement: 'success',
            mention: 'info',
            dm:      'info',
            comment: 'info',
            follow:  'info',
            reaction:'info',
            custom:  'info'
          };
          var toastType = typeMap[row.type] || 'info';
          // Push into the persistent bell log (also surfaces a toast)
          try {
            _pushNotification(row.title || 'New notification', {
              type: toastType,
              icon: icon,
              source: row.source_app || row.type || 'app',
              action: row.url ? { label: 'open', href: row.url } : null
            });
          } catch (e) { console.warn('[notif] push failed', e); }
          // Re-broadcast as unread-changed so the legacy red dot on the
          // Vault link updates too. Increment whichever bucket matches
          // the notification type (dm vs mentions vs other → bucket as
          // mentions). The existing handlers debounce + dedupe.
          try {
            var isDm = row.type === 'dm';
            var counts = isDm
              ? { dms: 1, mentions: 0 }
              : { dms: 0, mentions: 1 };
            broadcastEvent('unread-changed', counts);
          } catch (e) {}
        })
        .subscribe();
    } catch (e) {
      console.warn('[notif] subscribe failed (non-fatal)', e);
    }
  }

  // Update notification dot from unread-changed events
  function _applyUnreadCount(data) {
    var count = (data.dms || 0) + (data.mentions || 0);
    userContext.unreadCount = count;
    var dot = document.getElementById('sloppy-bar-notif');
    if (dot) {
      if (count > 0) dot.classList.add('show');
      else dot.classList.remove('show');
    }
  }

  // Update trust/verification from verification-changed events
  function _applyVerification(data) {
    if (data.trustScore !== undefined) { userData.trustScore = data.trustScore; userContext.trustScore = data.trustScore; }
    if (data.verificationLevel !== undefined) { userData.verificationLevel = data.verificationLevel; userContext.verificationLevel = data.verificationLevel; }
    if (data.verifiedProviders) { userData.verifiedProviders = data.verifiedProviders; userContext.verifiedProviders = data.verifiedProviders; }
    render();
  }

  function renderTrustBadge() {
    var lvl = userData.verificationLevel || 0;
    if (lvl <= 0) return '';
    var labels = ['', '✓', '✓✓', '✓✓✓'];
    var titles = ['', 'Basic Verified', 'Verified', 'Fully Verified'];
    return '<span class="sloppy-bar-badge-trust lvl' + lvl + '" title="' + titles[lvl] + ' (Trust: ' + (userData.trustScore || 0) + ')">' + labels[lvl] + '</span>';
  }

  // ===================================================================
  // === NOTIFICATIONS: toast API + bell panel ===
  // ===================================================================

  function _escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[<>&"]/g, function(c) {
      return ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;' })[c];
    });
  }

  function _relativeTime(ts) {
    var diff = Math.max(0, Date.now() - ts);
    if (diff < 30 * 1000) return 'just now';
    if (diff < 60 * 1000) return Math.floor(diff / 1000) + 's ago';
    if (diff < 60 * 60 * 1000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 24 * 60 * 60 * 1000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
  }

  function _getToastStack() {
    var stack = document.getElementById('sloppy-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'sloppy-toast-stack';
      stack.className = 'sloppy-toast-stack';
      stack.setAttribute('role', 'region');
      stack.setAttribute('aria-label', 'Notifications');
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    return stack;
  }

  // Show a transient toast. Returns the toast element (or null if rate-limited).
  // opts: { type, icon, duration, action: { label, href, onClick }, persist (bool) }
  function _showToast(message, opts) {
    opts = opts || {};
    var now = Date.now();

    // Rate limit
    if (now - _toastLastTime < TOAST_RATE_MIN) {
      // Coalesce by simply dropping rapid-fire repeats unless explicitly opts.bypassRate
      if (!opts.bypassRate) return null;
    }

    // Dedupe identical (type+message) within window
    var type = (opts.type || 'info').toLowerCase();
    _toastRecent = _toastRecent.filter(function(r) { return now - r.ts < TOAST_DEDUPE_WINDOW; });
    var dup = _toastRecent.find(function(r) { return r.msg === message && r.type === type; });
    if (dup) return null;
    _toastRecent.push({ msg: message, type: type, ts: now });
    _toastLastTime = now;

    var stack = _getToastStack();

    // Cap visible
    while (stack.children.length >= TOAST_MAX_VISIBLE) {
      var oldest = stack.firstElementChild;
      if (!oldest) break;
      oldest.classList.remove('in');
      oldest.classList.add('out');
      stack.removeChild(oldest);
    }

    var icon = opts.icon || _iconForType(type);
    var toast = document.createElement('div');
    toast.className = 'sloppy-toast sloppy-toast-' + type;
    toast.setAttribute('role', type === 'error' || type === 'warn' ? 'alert' : 'status');

    var actionHtml = '';
    if (opts.action && opts.action.label) {
      var aLabel = _escapeHtml(opts.action.label);
      if (opts.action.href) {
        actionHtml = '<a class="sloppy-toast-action" href="' + _escapeHtml(opts.action.href) + '">' + aLabel + '</a>';
      } else {
        actionHtml = '<button class="sloppy-toast-action" type="button" data-toast-action="1">' + aLabel + '</button>';
      }
    }
    toast.innerHTML =
      '<span class="sloppy-toast-icon" aria-hidden="true">' + _escapeHtml(icon) + '</span>' +
      '<div class="sloppy-toast-body"><div class="sloppy-toast-msg">' + _escapeHtml(message) + '</div>' + actionHtml + '</div>' +
      '<button class="sloppy-toast-close" type="button" aria-label="Dismiss">×</button>';

    stack.appendChild(toast);
    // animate in
    requestAnimationFrame(function() { toast.classList.add('in'); });

    var dismiss = function() {
      if (!toast.parentNode) return;
      toast.classList.remove('in');
      toast.classList.add('out');
      setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 280);
    };
    toast.querySelector('.sloppy-toast-close').onclick = dismiss;
    if (opts.action && opts.action.onClick) {
      var btn = toast.querySelector('[data-toast-action]');
      if (btn) btn.onclick = function(ev) { try { opts.action.onClick(ev); } catch(e) {} dismiss(); };
    }

    var duration = typeof opts.duration === 'number' ? opts.duration : 4000;
    if (duration > 0) setTimeout(dismiss, duration);

    return toast;
  }

  function _iconForType(type) {
    switch (type) {
      case 'success': return '✓';
      case 'warn':    return '⚠';
      case 'error':   return '✕';
      case 'info':
      default:        return 'ℹ';
    }
  }

  // Push an entry into the persistent log (and surface as toast unless silent).
  // opts: { type, icon, action, silent (don't toast), unread (default true), source }
  function _pushNotification(message, opts) {
    opts = opts || {};
    var entry = {
      id: 'n' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      type: (opts.type || 'info').toLowerCase(),
      icon: opts.icon || _iconForType((opts.type || 'info').toLowerCase()),
      msg: String(message || ''),
      ts: Date.now(),
      read: opts.unread === false,
      action: opts.action || null,
      source: opts.source || 'app'
    };
    _notifLog.unshift(entry);
    if (_notifLog.length > NOTIF_MAX) _notifLog.length = NOTIF_MAX;
    if (!entry.read) _notifUnreadCount++;
    _persistNotifLog();
    _updateBellBadge();
    if (_notifPanelOpen) _renderNotifPanel();
    if (!opts.silent) {
      _showToast(entry.msg, { type: entry.type, icon: entry.icon, action: entry.action });
    }
    return entry;
  }

  function _updateBellBadge() {
    var badge = document.getElementById('sloppy-bar-bell-badge');
    if (!badge) return;
    if (_notifUnreadCount > 0) {
      badge.textContent = _notifUnreadCount > 99 ? '99+' : String(_notifUnreadCount);
      badge.classList.add('show');
      var bell = badge.parentElement;
      if (bell) {
        bell.classList.remove('has-unread');
        // force reflow to retrigger wiggle on every increment
        void bell.offsetWidth;
        bell.classList.add('has-unread');
        bell.setAttribute('aria-expanded', String(_notifPanelOpen));
      }
    } else {
      badge.classList.remove('show');
      badge.textContent = '0';
    }
  }

  // Render bell panel
  function _renderNotifPanel() {
    var panel = document.getElementById('sloppy-bar-notif-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'sloppy-bar-notif-panel';
      panel.className = 'sloppy-bar-notif-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Notifications');
      document.body.appendChild(panel);
    }
    var listHtml;
    if (!_notifLog.length) {
      listHtml = '<div class="sloppy-np-empty">no notifications yet</div>';
    } else {
      listHtml = _notifLog.slice(0, 20).map(function(n) {
        var actionHtml = '';
        if (n.action && n.action.label) {
          var lbl = _escapeHtml(n.action.label);
          if (n.action.href) actionHtml = '<a class="sloppy-np-action" href="' + _escapeHtml(n.action.href) + '">' + lbl + '</a>';
        }
        return '<div class="sloppy-np-item ' + (n.read ? '' : 'unread') + '">' +
          '<span class="sloppy-np-icon sloppy-np-type-' + n.type + '" aria-hidden="true">' + _escapeHtml(n.icon) + '</span>' +
          '<div class="sloppy-np-body">' +
            '<div class="sloppy-np-msg">' + _escapeHtml(n.msg) + '</div>' +
            actionHtml +
            '<div class="sloppy-np-meta">' + _escapeHtml(_relativeTime(n.ts)) + (n.source && n.source !== 'app' ? ' · ' + _escapeHtml(n.source) : '') + '</div>' +
          '</div>' +
        '</div>';
      }).join('');
    }
    panel.innerHTML =
      '<div class="sloppy-np-header">' +
        '<div class="sloppy-np-title">🔔 Notifications' + (_notifUnreadCount > 0 ? ' · ' + _notifUnreadCount + ' new' : '') + '</div>' +
        (_notifUnreadCount > 0 ? '<button class="sloppy-np-mark" type="button" onclick="window.sloppyBarMarkAllRead()">Mark all read</button>' : '') +
      '</div>' +
      '<div class="sloppy-np-list">' + listHtml + '</div>' +
      '<div class="sloppy-np-footer">' +
        '<span>showing ' + Math.min(_notifLog.length, 20) + (_notifLog.length > 20 ? ' of ' + _notifLog.length : '') + '</span>' +
        (_notifLog.length ? '<button class="sloppy-np-clear" type="button" onclick="window.sloppyBarClearNotifications()">Clear all</button>' : '') +
      '</div>';
    panel.classList.add('open');
  }

  function _hideNotifPanel() {
    var panel = document.getElementById('sloppy-bar-notif-panel');
    if (panel) panel.classList.remove('open');
    _notifPanelOpen = false;
    var bell = document.querySelector('.sloppy-bar-bell');
    if (bell) bell.setAttribute('aria-expanded', 'false');
  }

  window.sloppyBarToggleNotifications = function(ev) {
    if (ev) { ev.stopPropagation(); ev.preventDefault(); }
    if (_notifPanelOpen) { _hideNotifPanel(); return; }
    // Mutual exclusion: close chat + notepad panels if open
    if (_chatPanelOpen)    { try { _hideChatPanel(); } catch (_) {} }
    if (_notepadPanelOpen) { try { _hideNotepadPanel(); } catch (_) {} }
    _notifPanelOpen = true;
    _renderNotifPanel();
    var bell = document.querySelector('.sloppy-bar-bell');
    if (bell) bell.setAttribute('aria-expanded', 'true');
    // Auto-mark as read after a half second of being open
    setTimeout(function() {
      if (_notifPanelOpen) window.sloppyBarMarkAllRead();
    }, 700);
    // Close on outside click
    setTimeout(function() {
      var off = function(e) {
        var panel = document.getElementById('sloppy-bar-notif-panel');
        if (!panel) return document.removeEventListener('click', off);
        if (panel.contains(e.target)) return;
        if (e.target.closest('.sloppy-bar-bell')) return;
        _hideNotifPanel();
        document.removeEventListener('click', off);
      };
      document.addEventListener('click', off);
    }, 0);
  };

  window.sloppyBarMarkAllRead = function() {
    var changed = false;
    for (var i = 0; i < _notifLog.length; i++) {
      if (!_notifLog[i].read) { _notifLog[i].read = true; changed = true; }
    }
    _notifUnreadCount = 0;
    if (changed) _persistNotifLog();
    _updateBellBadge();
    if (_notifPanelOpen) _renderNotifPanel();
  };

  window.sloppyBarClearNotifications = function() {
    _notifLog = [];
    _notifUnreadCount = 0;
    _persistNotifLog();
    _updateBellBadge();
    if (_notifPanelOpen) _renderNotifPanel();
  };

  // Auto-feed: convert relevant sync events into notification entries.
  // Returns true if an entry was added.
  function _autoFeedFromSyncEvent(event, data) {
    if (event === 'unread-changed' && data) {
      var dms = data.dms || 0;
      var mentions = data.mentions || 0;
      var dmDelta = dms - _lastSeenUnreadDmCount;
      var mentionDelta = mentions - _lastSeenUnreadMentionCount;
      _lastSeenUnreadDmCount = dms;
      _lastSeenUnreadMentionCount = mentions;
      if (dmDelta > 0) {
        _pushNotification(dmDelta + ' new direct message' + (dmDelta > 1 ? 's' : ''),
          { type: 'info', icon: '💌', source: 'sloppy-id',
            action: { label: 'open', href: '/sloppy-id' } });
        return true;
      }
      if (mentionDelta > 0) {
        _pushNotification(mentionDelta + ' new mention' + (mentionDelta > 1 ? 's' : ''),
          { type: 'info', icon: '@', source: 'sloppy-alerts',
            action: { label: 'view', href: '/sloppy-alerts' } });
        return true;
      }
    } else if (event === 'karma-changed' && data && typeof data.delta === 'number' && data.delta !== 0) {
      var sign = data.delta > 0 ? '+' : '';
      _pushNotification('Karma ' + sign + data.delta + (data.reason ? ' · ' + data.reason : ''),
        { type: data.delta > 0 ? 'success' : 'warn', icon: '⚡', source: 'karma' });
      return true;
    } else if (event === 'verification-changed' && data && data.verificationLevel) {
      // Only notify on level increase
      var prev = (userData.verificationLevel || 0);
      if (data.verificationLevel > prev) {
        _pushNotification('Verification upgraded · level ' + data.verificationLevel,
          { type: 'success', icon: '✓', source: 'sloppy-id',
            action: { label: 'view', href: '/sloppy-id' } });
        return true;
      }
    }
    return false;
  }

  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  // Recent apps management
  function getRecentApps() {
    try {
      const stored = localStorage.getItem(RECENT_APPS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function trackCurrentApp() {
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (!path || path === '' || path === 'index.html') return;

    // Get friendly name from path
    const appName = path.split('/')[0];
    if (!appName) return;

    const recentApps = getRecentApps();

    // Remove if already exists (will re-add at front)
    const filtered = recentApps.filter(app => app.path !== appName);

    // Add to front with timestamp
    filtered.unshift({
      path: appName,
      name: formatAppName(appName),
      timestamp: Date.now()
    });

    // Keep only MAX_RECENT_APPS
    const trimmed = filtered.slice(0, MAX_RECENT_APPS);

    try {
      localStorage.setItem(RECENT_APPS_KEY, JSON.stringify(trimmed));
    } catch {
      // localStorage might be full or disabled
    }
  }

  function formatAppName(path) {
    // Convert path like "neon-tetris" to "Neon Tetris"
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function getTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'now';
    if (mins < 60) return mins + 'm';
    if (hours < 24) return hours + 'h';
    return days + 'd';
  }

  function getAppIcon(appName) {
    // Map common app types to icons
    const lower = appName.toLowerCase();
    if (lower.includes('tetris') || lower.includes('game') || lower.includes('snake') || lower.includes('tower')) return '🎮';
    if (lower.includes('music') || lower.includes('synth') || lower.includes('beats') || lower.includes('radio')) return '🎵';
    if (lower.includes('art') || lower.includes('pixel') || lower.includes('draw') || lower.includes('paint')) return '🎨';
    if (lower.includes('chat') || lower.includes('gram') || lower.includes('social')) return '💬';
    if (lower.includes('crypto') || lower.includes('btc') || lower.includes('coin') || lower.includes('tracker')) return '📈';
    if (lower.includes('pet') || lower.includes('fish') || lower.includes('plant')) return '🐾';
    if (lower.includes('health') || lower.includes('system')) return '🩺';
    if (lower.includes('diary') || lower.includes('journal') || lower.includes('note')) return '📓';
    if (lower.includes('vault') || lower.includes('id') || lower.includes('identity')) return '🪪';
    return '🚀';
  }

  function renderDropdown() {
    const recentApps = getRecentApps();
    const currentPath = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').split('/')[0];
    const ecoPaths = new Set(ECOSYSTEM_MODULES.map(m => m.path));

    // Group ecosystem modules by category, preserving insertion order.
    const byCat = {};
    for (const m of ECOSYSTEM_MODULES) {
      if (!byCat[m.cat]) byCat[m.cat] = [];
      byCat[m.cat].push(m);
    }

    const ecoSections = Object.entries(byCat).map(([cat, modules]) => `
      <div class="sloppy-bar-dropdown-header">${cat}</div>
      <div class="sloppy-bar-ecogrid">
        ${modules.map(m => {
          const isCurrent = m.path && m.path === currentPath;
          // Action items (e.g. Notepad/Twitch widgets) render as <button> +
          // call the named global fn; non-action items are link navigation.
          if (m.action) {
            return `<button type="button" class="sloppy-bar-dropdown-item" title="${m.desc}" onclick="window.sloppyBarToggleDropdown(event); window.${m.action} && window.${m.action}(event);">
              <span class="sloppy-bar-dropdown-item-icon">${m.icon}</span>
              <span class="sloppy-bar-dropdown-item-name">${m.name}</span>
            </button>`;
          }
          return `<a href="/${m.path}" class="sloppy-bar-dropdown-item${isCurrent ? ' current' : ''}" title="${m.desc}">
            <span class="sloppy-bar-dropdown-item-icon">${m.icon}</span>
            <span class="sloppy-bar-dropdown-item-name">${m.name}</span>
          </a>`;
        }).join('')}
      </div>
    `).join('');

    // Recent apps section — filter out current AND modules already in the
    // Ecosystem grid above (no need to show them twice).
    const recentFiltered = recentApps
      .filter(app => app.path !== currentPath && !ecoPaths.has(app.path))
      .slice(0, 4);
    const recentSection = recentFiltered.length > 0 ? `
      <div class="sloppy-bar-dropdown-header">RECENT</div>
      ${recentFiltered.map(app => `
        <a href="/${app.path}" class="sloppy-bar-dropdown-item">
          <span class="sloppy-bar-dropdown-item-icon">${getAppIcon(app.name)}</span>
          <span class="sloppy-bar-dropdown-item-name">${app.name}</span>
          <span class="sloppy-bar-dropdown-item-time">${getTimeAgo(app.timestamp)}</span>
        </a>
      `).join('')}
    ` : '';

    return `
      ${ecoSections}
      ${recentSection}
      <div class="sloppy-bar-dropdown-footer">
        <a href="/app-directory">Browse All ${LIVE_INDEX ? LIVE_INDEX.length.toLocaleString() : ''} Apps →</a>
      </div>
    `;
  }

  // Global toggle function
  window.sloppyBarToggle = function() {
    isMinimized = !isMinimized;
    render();
    // Prevent event bubbling
    event?.stopPropagation();
  };

  // ===================================================================
  // === HARD RELOAD — nuke browser caches + service workers + reload ==
  // ===================================================================
  // Chat asked for an escape hatch when stale index.html (or any other
  // asset) is being served from the browser/CDN cache. This button:
  //   1) deletes every Cache API entry the page can touch
  //   2) unregisters any ServiceWorker registered for this scope
  //   3) wipes our own in-memory + localStorage 'shared' caches
  //   4) reloads the page with a fresh ?_r= cache-buster on the URL.
  // It does NOT touch auth tokens or per-app saves.
  window.sloppyBarHardReload = async function(ev) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    var btn = document.querySelector('.sloppy-bar-hardreload');
    if (btn) btn.classList.add('spinning');
    // 1) Cache API
    try {
      if (typeof caches !== 'undefined' && caches.keys) {
        var keys = await caches.keys();
        await Promise.all(keys.map(function(k) { return caches.delete(k); }));
        console.log('[SloppyBar] cleared', keys.length, 'cache entries');
      }
    } catch (e) { console.warn('[SloppyBar] cache clear failed', e); }
    // 2) ServiceWorkers
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        var regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(function(r) { return r.unregister(); }));
        console.log('[SloppyBar] unregistered', regs.length, 'service workers');
      }
    } catch (e) { console.warn('[SloppyBar] SW unregister failed', e); }
    // 3) In-memory + the bar's own shared context cache
    try {
      if (typeof cachedContext !== 'undefined') cachedContext = null;
      // Don't nuke auth tokens — but DO clear the recent-apps cache + worker cache
      localStorage.removeItem(RECENT_APPS_KEY);
      localStorage.removeItem('sloppy_bar_shared_context_v1');
    } catch (e) {}
    // 4) Reload with a fresh cache-buster query param
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('_r', Date.now().toString(36));
      window.location.replace(url.toString());
    } catch (e) {
      // Fallback for older browsers / weird URLs
      window.location.reload();
    }
  };

  // Global dropdown toggle function
  window.sloppyBarToggleDropdown = function(e) {
    e?.preventDefault();
    e?.stopPropagation();
    dropdownOpen = !dropdownOpen;
    const dropdown = document.getElementById('sloppy-bar-dropdown');
    if (dropdown) {
      dropdown.className = 'sloppy-bar-dropdown' + (dropdownOpen ? ' open' : '');
    }
  };

  // Teleport state
  // === Vote functions ===
  async function _sloppyLoadVote() {
    if (!_sloppyVoteSlug || !supabase) return;
    try {
      // Get vote count for this app
      const { data } = await supabase.from('app_votes').select('vote').eq('app_slug', _sloppyVoteSlug);
      _sloppyVoteCount = data ? data.reduce((s, r) => s + (r.vote || 1), 0) : 0;

      // Check if current user voted
      if (currentUser) {
        const { data: uv } = await supabase.from('app_votes').select('app_slug').eq('user_id', currentUser.id).eq('app_slug', _sloppyVoteSlug);
        _sloppyVoteUserVoted = !!(uv && uv.length > 0);
      }
      render();
    } catch (e) {}
  }

  window.sloppyBarVote = async function() {
    if (!_sloppyVoteSlug || !supabase || !currentUser) return;
    try {
      if (_sloppyVoteUserVoted) {
        await supabase.from('app_votes').delete().eq('user_id', currentUser.id).eq('app_slug', _sloppyVoteSlug);
        _sloppyVoteUserVoted = false;
        _sloppyVoteCount = Math.max(0, _sloppyVoteCount - 1);
      } else {
        const { error } = await supabase.from('app_votes').insert({ app_slug: _sloppyVoteSlug, vote: 1, user_id: currentUser.id });
        if (error) {
          await supabase.from('app_votes').upsert({ app_slug: _sloppyVoteSlug, vote: 1, user_id: currentUser.id }, { onConflict: 'user_id,app_slug' });
        }
        _sloppyVoteUserVoted = true;
        _sloppyVoteCount++;
      }
      render();
    } catch (e) {}
  };

  let teleportCategory = null; // null = all categories
  let teleportPanelOpen = false;

  // Open the teleport discovery panel
  window.sloppyBarTeleport = function() {
    teleportPanelOpen = true;
    renderTeleportPanel();
    // Kick off live-index load (lazy) — re-render once it lands
    loadLiveIndex().then(() => { if (teleportPanelOpen) renderTeleportPanel(); });
    event?.stopPropagation();
  };

  // Execute the teleport
  window.sloppyBarTeleportGo = function() {
    const currentPath = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').split('/')[0] || 'home';
    // Category mode: prefer curated category list (richer than auto-genre)
    // All mode: prefer full live index (1,292 apps) — fall back to curated
    const pool = teleportCategory
      ? (APP_CATEGORIES[teleportCategory] || TELEPORT_APPS).filter(a => a !== currentPath)
      : getTeleportPool().filter(a => a !== currentPath);

    const picked = weightedRandomPick(pool);

    // Log to analytics
    if (supabase && currentUser) {
      supabase.from('sloppy_analytics').insert({
        event_type: 'teleport',
        source_app: currentPath,
        destination_app: picked,
        username: userData.username,
        user_id: currentUser.id,
        metadata: { timestamp: Date.now(), category: teleportCategory || 'all' }
      }).then(() => {}).catch(() => {});
    }

    // Navigate
    const btn = document.querySelector('.sloppy-tp-go');
    if (btn) { btn.textContent = '⚡ Warping...'; btn.style.opacity = '0.6'; }
    setTimeout(() => { window.location.href = '/' + picked; }, 250);
  };

  window.sloppyBarTeleportClose = function() {
    teleportPanelOpen = false;
    const panel = document.getElementById('sloppy-tp-panel');
    const overlay = document.getElementById('sloppy-tp-overlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  };

  window.sloppyBarSetCategory = function(cat) {
    teleportCategory = teleportCategory === cat ? null : cat;
    renderTeleportPanel();
  };

  // Jump directly to a specific app (used by search results)
  window.sloppyBarJumpTo = function(slug) {
    if (!slug) return;
    const currentPath = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').split('/')[0] || 'home';
    if (slug === currentPath) { window.sloppyBarTeleportClose(); return; }
    if (supabase && currentUser) {
      supabase.from('sloppy_analytics').insert({
        event_type: 'teleport',
        source_app: currentPath,
        destination_app: slug,
        username: userData.username,
        user_id: currentUser.id,
        metadata: { timestamp: Date.now(), mode: 'search' }
      }).then(() => {}).catch(() => {});
    }
    window.location.href = '/' + slug;
  };

  // Debounced search handler (live-filter results from the loaded index)
  let _tpSearchDebounce = null;
  window.sloppyBarTeleportSearch = function(value) {
    clearTimeout(_tpSearchDebounce);
    _tpSearchDebounce = setTimeout(() => _renderTeleportSearchResults(value), 80);
  };

  function _renderTeleportSearchResults(query) {
    const host = document.getElementById('sloppy-tp-results');
    if (!host) return;
    const q = (query || '').trim().toLowerCase();
    if (!q) { host.innerHTML = ''; host.classList.remove('open'); return; }
    if (!LIVE_INDEX) {
      host.innerHTML = '<div class="sloppy-tp-empty">Loading catalogue…</div>';
      host.classList.add('open');
      return;
    }
    const visited = getVisitedApps();
    // Score: prefix-slug 3, prefix-title 2, substring-title 1.5, substring-slug 1, substring-desc 0.5
    const scored = [];
    for (const e of LIVE_INDEX) {
      const slug = (e.slug || '').toLowerCase();
      const title = (e.title || '').toLowerCase();
      const desc = (e.desc || '').toLowerCase();
      let s = 0;
      if (slug.startsWith(q)) s += 3;
      else if (slug.includes(q)) s += 1;
      if (title.startsWith(q)) s += 2;
      else if (title.includes(q)) s += 1.5;
      if (s === 0 && desc.includes(q)) s += 0.5;
      if (s > 0) scored.push({ e, s });
    }
    scored.sort((a, b) => b.s - a.s || a.e.slug.localeCompare(b.e.slug));
    if (!scored.length) {
      host.innerHTML = `<div class="sloppy-tp-empty">No app matches "${q.replace(/[<>&"]/g,'')}"</div>`;
      host.classList.add('open');
      return;
    }
    const top = scored.slice(0, 18);
    host.innerHTML = top.map(({ e }) => {
      const emoji = LIVE_GENRE_EMOJI[(e.genre || 'misc')] || '◆';
      const seen = visited[e.slug] ? '<span class="sloppy-tp-seen" title="visited">●</span>' : '';
      const htmlEsc = s => String(s == null ? '' : s).replace(/[<>&"]/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;' }[c]));
      const safeTitle = htmlEsc(e.title || e.slug);
      const safeSlugHtml = htmlEsc(e.slug);            // for HTML content + title attribute
      const safeSlugJs = e.slug.replace(/'/g, '&#39;'); // for the inline onclick="..." single-quoted arg
      const safeDesc = htmlEsc((e.desc || '').slice(0, 120));
      return `<button class="sloppy-tp-result" onclick="window.sloppyBarJumpTo('${safeSlugJs}')" title="${safeSlugHtml} — ${safeDesc}">
        <span class="sloppy-tp-result-emoji">${emoji}</span>
        <span class="sloppy-tp-result-name">${safeTitle}</span>
        <span class="sloppy-tp-result-slug">/${safeSlugHtml}</span>
        ${seen}
      </button>`;
    }).join('') + (scored.length > top.length ? `<div class="sloppy-tp-more">+${scored.length - top.length} more — refine search</div>` : '');
    host.classList.add('open');
  }

  function renderTeleportPanel() {
    let panel = document.getElementById('sloppy-tp-panel');
    let overlay = document.getElementById('sloppy-tp-overlay');

    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'sloppy-tp-panel';
      panel.className = 'sloppy-bar-teleport-panel';
      document.body.appendChild(panel);
    }
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'sloppy-tp-overlay';
      overlay.className = 'sloppy-bar-tp-overlay';
      overlay.onclick = window.sloppyBarTeleportClose;
      document.body.appendChild(overlay);
    }

    const visited = getVisitedApps();
    // Live mode: use the full app-directory catalogue when available
    const liveAvailable = !!LIVE_INDEX;
    const livePool = liveAvailable ? LIVE_INDEX.map(e => e.slug) : null;
    const liveTotal = liveAvailable ? livePool.length : 0;
    const liveVisited = liveAvailable ? livePool.filter(s => visited[s]).length : 0;
    const curatedTotal = TELEPORT_APPS.length;
    const curatedVisited = Object.keys(visited).filter(k => TELEPORT_APPS.includes(k)).length;

    const totalApps = liveAvailable ? liveTotal : curatedTotal;
    const visitedCount = liveAvailable ? liveVisited : curatedVisited;
    const pct = totalApps ? Math.round((visitedCount / totalApps) * 100) : 0;

    const catEmojis = { Games:'🎮', Creative:'🎨', Music:'🎵', Social:'💬', Tools:'🛠', Weird:'🤪', Sim:'🌿', Retro:'💾', Security:'🔒', Explore:'🧭', Sloppy:'🟣' };

    const catChips = Object.entries(APP_CATEGORIES).map(([cat, apps]) => {
      const active = teleportCategory === cat ? 'active' : '';
      return `<button class="sloppy-tp-cat ${active}" onclick="window.sloppyBarSetCategory('${cat}')">${catEmojis[cat] || '📦'} ${cat}<span class="sloppy-tp-cat-count">${apps.length}</span></button>`;
    }).join('');

    const poolSize = teleportCategory
      ? (APP_CATEGORIES[teleportCategory] || []).length
      : totalApps;

    const poolVisited = teleportCategory
      ? (APP_CATEGORIES[teleportCategory] || []).filter(a => visited[a]).length
      : visitedCount;

    const poolNew = poolSize - poolVisited;

    const liveBadge = liveAvailable
      ? `<span class="sloppy-tp-live" title="Full app-directory catalogue loaded">● live · ${liveTotal.toLocaleString()}</span>`
      : `<span class="sloppy-tp-live loading" title="Fetching /app-directory/index.json">○ loading catalogue…</span>`;

    panel.innerHTML = `
      <div class="sloppy-tp-title">🌀 Teleport Discovery ${liveBadge}</div>
      <div class="sloppy-tp-stats">
        ${teleportCategory
          ? `<strong>${teleportCategory}</strong> &middot; ${poolSize} apps &middot; <span>${poolNew} undiscovered</span>`
          : `${totalApps.toLocaleString()} apps &middot; <span>${(totalApps - visitedCount).toLocaleString()} undiscovered</span>`
        }
      </div>
      <div class="sloppy-tp-search-wrap">
        <input id="sloppy-tp-search"
               class="sloppy-tp-search"
               type="search"
               placeholder="${liveAvailable ? `Search ${liveTotal.toLocaleString()} apps…` : 'Search apps…'}"
               autocomplete="off"
               oninput="window.sloppyBarTeleportSearch(this.value)"
               onkeydown="if(event.key==='Escape'){this.value='';window.sloppyBarTeleportSearch('');}" />
        <div id="sloppy-tp-results" class="sloppy-tp-results"></div>
      </div>
      <div class="sloppy-tp-cats">${catChips}</div>
      <div class="sloppy-tp-actions">
        <button class="sloppy-tp-go" onclick="window.sloppyBarTeleportGo()">🌀 ${teleportCategory ? teleportCategory : 'Random'} Teleport</button>
        <button class="sloppy-tp-close" onclick="window.sloppyBarTeleportClose()">✕</button>
      </div>
      <div class="sloppy-tp-discovery">
        Explorer progress: ${visitedCount.toLocaleString()}/${totalApps.toLocaleString()} discovered (${pct}%)
        <div class="sloppy-tp-progress"><div class="sloppy-tp-progress-fill" style="width:${pct}%"></div></div>
      </div>
    `;

    panel.classList.add('open');
    overlay.classList.add('open');
    // Auto-focus search after a tick (don't yank focus before paint settles)
    setTimeout(() => { const s = document.getElementById('sloppy-tp-search'); if (s) s.focus(); }, 80);
  }

  // === PUBLIC API ===

  /**
   * Get the current user context object.
   * If context isn't ready yet, calls back when it is.
   * @param {Function} [callback] - Optional callback. If provided, called immediately with current context
   *                                 AND called again when context becomes ready (if not yet ready).
   * @returns {Object} Current context snapshot (may have ready=false if still loading)
   *
   * Usage:
   *   var ctx = window.sloppyBarGetContext();
   *   // or with callback:
   *   window.sloppyBarGetContext(function(ctx) { console.log(ctx.username); });
   */
  window.sloppyBarGetContext = function(callback) {
    if (callback) {
      callback(Object.assign({}, userContext));
      if (!userContext.ready) {
        // Call again when ready
        var onReady = function() {
          callback(Object.assign({}, userContext));
          window.sloppyBarOff('context-ready', onReady);
        };
        window.sloppyBarOn('context-ready', onReady);
      }
    }
    return Object.assign({}, userContext);
  };

  /**
   * Subscribe to sync events.
   * @param {string} eventName - Event to listen for, or '*' for all events
   * @param {Function} callback - Called with { event, data, source, timestamp }
   *
   * Events:
   *   'auth-changed'      - Auth state changed (login/logout/token refresh)
   *                         data: { isAuthenticated, authProvider, userId, event }
   *   'context-ready'     - User context loaded (fires once per tab)
   *   'identity-changed'  - Profile updated (username, avatar, etc.)
   *   'karma-changed'     - Karma score updated
   *   'theme-changed'     - Theme/colors changed (auto-applied to CSS vars)
   *   'unread-changed'    - Unread DMs/mentions count changed
   *                         data: { dms, mentions }
   *   'verification-changed' - Trust/verification updated
   *                         data: { trustScore, verificationLevel, verifiedProviders }
   *   'presence-update'   - User activity changed
   *   '*'                 - All events
   *
   * Usage:
   *   window.sloppyBarOn('karma-changed', function(e) { console.log('New karma:', e.data); });
   */
  window.sloppyBarOn = function(eventName, callback) {
    if (!eventName || typeof callback !== 'function') return;
    if (!_eventListeners[eventName]) _eventListeners[eventName] = [];
    _eventListeners[eventName].push(callback);
  };

  /**
   * Unsubscribe from sync events.
   * @param {string} eventName
   * @param {Function} callback - The same function reference passed to sloppyBarOn
   */
  window.sloppyBarOff = function(eventName, callback) {
    var listeners = _eventListeners[eventName];
    if (!listeners) return;
    _eventListeners[eventName] = listeners.filter(function(fn) { return fn !== callback; });
  };

  /**
   * Emit an event to all tabs + same-page listeners.
   * @param {string} eventName
   * @param {Object} [data] - Event payload
   *
   * Usage:
   *   window.sloppyBarEmit('karma-changed', { karma: 150, delta: +5 });
   *   window.sloppyBarEmit('theme-changed', { vars: { '--accent': '#ff0000' } });
   */
  window.sloppyBarEmit = function(eventName, data) {
    if (!eventName) return;
    broadcastEvent(eventName, data || {});
  };

  /**
   * Force-refresh the user context from DB + localStorage.
   * Useful after profile edits or karma changes.
   * @param {Function} [callback] - Called with updated context when done
   */
  window.sloppyBarRefresh = function(callback) {
    cacheTimestamp = 0; // Invalidate cache
    // Temporarily act as leader to force DB fetch even if not leader
    var wasLeader = isLeaderTab;
    isLeaderTab = true;
    fetchUserData().then(function() {
      isLeaderTab = wasLeader;
      syncContext();
      // Push fresh context to worker
      if (syncWorker && syncWorkerReady) {
        try {
          syncWorker.port.postMessage({ type: 'context-update', context: Object.assign({}, userContext) });
        } catch (e) {}
      }
      if (callback) callback(Object.assign({}, userContext));
    });
  };

  /**
   * Fire a transient toast notification (visible top-right, auto-dismisses ~4s).
   * @param {string} message - text to display
   * @param {Object} [opts]
   * @param {('info'|'success'|'warn'|'error')} [opts.type='info']
   * @param {string} [opts.icon] - emoji or single char (default: type-derived)
   * @param {number} [opts.duration=4000] - ms (0 = sticky until dismissed)
   * @param {{label:string, href?:string, onClick?:Function}} [opts.action]
   * @returns {HTMLElement|null} the toast element, or null if rate-limited/duplicate
   *
   * Usage:
   *   window.sloppyBarToast('Saved!');
   *   window.sloppyBarToast('Karma +5', { type: 'success', icon: '⚡' });
   *   window.sloppyBarToast('Connection lost', { type: 'error', duration: 0,
   *     action: { label: 'retry', onClick: () => retry() } });
   */
  window.sloppyBarToast = function(message, opts) {
    if (!message) return null;
    return _showToast(String(message), opts || {});
  };

  /**
   * Push a notification into the bell panel log AND optionally show a toast.
   * Persisted across page loads in localStorage (capped 30 entries).
   * @param {string} message
   * @param {Object} [opts]
   * @param {('info'|'success'|'warn'|'error')} [opts.type='info']
   * @param {string} [opts.icon]
   * @param {boolean} [opts.silent=false] - if true, skip the toast (bell only)
   * @param {boolean} [opts.unread=true] - mark as unread (default yes)
   * @param {{label:string, href?:string}} [opts.action]
   * @param {string} [opts.source] - origin label (e.g., 'karma', 'app-name')
   *
   * Usage:
   *   window.sloppyBarNotify('New comment on your app', {
   *     type: 'info', icon: '💬', source: 'sloppy-feed',
   *     action: { label: 'view', href: '/sloppy-feed' }
   *   });
   */
  window.sloppyBarNotify = function(message, opts) {
    if (!message) return null;
    return _pushNotification(String(message), opts || {});
  };

  /**
   * Get a snapshot of recent notifications from the bell log.
   * @returns {Array<{id, type, icon, msg, ts, read, action, source}>}
   */
  window.sloppyBarGetNotifications = function() {
    return _notifLog.slice();
  };

  /**
   * Get current unread notification count.
   * @returns {number}
   */
  window.sloppyBarGetUnreadCount = function() {
    return _notifUnreadCount;
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  async function init() {
    enrichContextFromLocalStorage(); // Pre-populate from localStorage before DB
    initSyncWorker(); // Start SharedWorker before DB queries
    render(); // Show placeholder immediately
    trackCurrentApp(); // Track this app visit
    await initSupabase();
    _sloppyLoadVote(); // Load vote state for current app
    render(); // Update with real data

    // SharedWorker heartbeat (30s interval)
    setInterval(function() {
      if (syncWorker && syncWorkerReady) {
        try { syncWorker.port.postMessage({ type: 'heartbeat', tabId: _tabId }); } catch (e) {}
      }
    }, 30000);

    // Clean up on tab close
    window.addEventListener('beforeunload', function() {
      if (syncWorker && syncWorkerReady) {
        try { syncWorker.port.postMessage({ type: 'unregister' }); } catch (e) {}
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (dropdownOpen) {
        const dropdown = document.getElementById('sloppy-bar-dropdown');
        const trigger = e.target.closest('.sloppy-bar-apps-trigger');
        if (!trigger && dropdown && !dropdown.contains(e.target)) {
          dropdownOpen = false;
          dropdown.className = 'sloppy-bar-dropdown';
        }
      }
    });

    // Listen for postMessage events from parent page (iframe apps can emit to header)
    window.addEventListener('message', function(e) {
      if (!e.data || !e.data.type) return;
      // Allow apps to emit sync events via postMessage
      if (e.data.type === 'sloppy-sync-emit' && e.data.event) {
        broadcastEvent(e.data.event, e.data.data || {});
      }
      // Allow apps to request context via postMessage
      if (e.data.type === 'sloppy-sync-get-context') {
        var source = e.source;
        if (source) {
          try {
            source.postMessage({ type: 'sloppy-sync-context', context: userContext }, '*');
          } catch (err) {}
        }
      }
    });
  }

})();
