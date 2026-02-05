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
  // Consolidated to primary instance — previous header instance (dtfaplmockmwvgyqxbep) is dead/unreachable
  const SUPABASE_URL = 'https://yjyxteqzhhmtrgcaekgz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqeXh0ZXF6aGhtdHJnY2Fla2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTg3NDIsImV4cCI6MjA3MjkzNDc0Mn0.G8SRde7IN2QFW1EnASM8IS32IUYR2eenCCjdDdioiBU';

  // Get script options
  const script = document.currentScript;
  const options = {
    position: script?.getAttribute('data-position') || 'bottom',
    theme: script?.getAttribute('data-theme') || 'dark',
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

  // Build flat list + reverse lookup
  const TELEPORT_APPS = [...new Set(Object.values(APP_CATEGORIES).flat())];
  const APP_TO_CATEGORY = {};
  for (const [cat, apps] of Object.entries(APP_CATEGORIES)) {
    for (const app of apps) APP_TO_CATEGORY[app] = APP_TO_CATEGORY[app] || cat;
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
  let userData = { karma: 0, rank: null, premium: false, username: 'Guest' };
  let isMinimized = options.minimized;
  let cacheTimestamp = 0;
  let dropdownOpen = false;

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
      syncWorker = new SharedWorker('/sloppy-header/sloppy-sync-worker.js', { name: 'sloppy-sync' });
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
                'karma','rank','premium','bio','color','bgUrl','theme','currentApp','ready','timestamp'];
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
    @keyframes sloppy-bar-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (max-width: 600px) {
      .sloppy-bar-center { display: none; }
      .sloppy-bar-username { max-width: 80px; }
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
      min-width: 200px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      z-index: 100000;
      display: none;
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
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

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
      fetchUserData();
    });

    await fetchUserData();
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
      // Parallel queries
      const [karmaResult, premiumResult] = await Promise.all([
        supabase
          .from('sloppygram_karma')
          .select('karma_total, rank, username')
          .eq('user_id', currentUser.id)
          .single(),
        supabase
          .from('users')
          .select('purchased_at')
          .eq('user_id', currentUser.id)
          .single()
      ]);

      if (karmaResult.data) {
        userData.karma = karmaResult.data.karma_total || 0;
        userData.rank = karmaResult.data.rank;
        if (karmaResult.data.username) userData.username = karmaResult.data.username;
      }

      userData.premium = !!premiumResult.data?.purchased_at;

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
            .single();
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
        </div>
      </div>
      ${!options.hideLinks ? `
      <div class="sloppy-bar-center">
        <a href="/sloppygram#karma" class="sloppy-bar-link" title="Karma Leaderboard">📊 Karma</a>
        <a href="/sloppy-id" class="sloppy-bar-link" title="Your Data Vault">🪪 Vault</a>
        <div class="sloppy-bar-dropdown-wrapper">
          <span class="sloppy-bar-link sloppy-bar-apps-trigger" onclick="window.sloppyBarToggleDropdown(event)" title="Recent Apps">🚀 Apps</span>
          <div class="sloppy-bar-dropdown ${dropdownOpen ? 'open' : ''}" id="sloppy-bar-dropdown">
            ${renderDropdown()}
          </div>
        </div>
        <a href="/system-health" class="sloppy-bar-link" title="System Status">🩺 Health</a>
      </div>
      ` : ''}
      <div class="sloppy-bar-right">
        <button class="sloppy-bar-teleport" onclick="window.sloppyBarTeleport()" title="Random app adventure!">
          <span class="sloppy-bar-teleport-icon">🌀</span> Teleport
        </button>
        ${isAnon && isLoggedIn ? `
          <a href="/sloppy-id" class="sloppy-bar-auth-btn">Connect Twitter</a>
        ` : ''}
        <a href="https://sloppy.live" class="sloppy-bar-home">← sloppy.live</a>
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

    // Filter out current app
    const filtered = recentApps.filter(app => app.path !== currentPath);

    if (filtered.length === 0) {
      return `
        <div class="sloppy-bar-dropdown-header">Recent Apps</div>
        <div class="sloppy-bar-dropdown-empty">No recent apps yet<br>Start exploring!</div>
        <div class="sloppy-bar-dropdown-footer">
          <a href="/app-directory">Browse All Apps →</a>
        </div>
      `;
    }

    const items = filtered.slice(0, 6).map(app => `
      <a href="/${app.path}" class="sloppy-bar-dropdown-item">
        <span class="sloppy-bar-dropdown-item-icon">${getAppIcon(app.name)}</span>
        <span class="sloppy-bar-dropdown-item-name">${app.name}</span>
        <span class="sloppy-bar-dropdown-item-time">${getTimeAgo(app.timestamp)}</span>
      </a>
    `).join('');

    return `
      <div class="sloppy-bar-dropdown-header">Recent Apps</div>
      ${items}
      <div class="sloppy-bar-dropdown-footer">
        <a href="/app-directory">Browse All Apps →</a>
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
  let teleportCategory = null; // null = all categories
  let teleportPanelOpen = false;

  // Open the teleport discovery panel
  window.sloppyBarTeleport = function() {
    teleportPanelOpen = true;
    renderTeleportPanel();
    event?.stopPropagation();
  };

  // Execute the teleport
  window.sloppyBarTeleportGo = function() {
    const currentPath = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').split('/')[0] || 'home';
    const pool = teleportCategory
      ? (APP_CATEGORIES[teleportCategory] || TELEPORT_APPS).filter(a => a !== currentPath)
      : TELEPORT_APPS.filter(a => a !== currentPath);

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
    const visitedCount = Object.keys(visited).filter(k => TELEPORT_APPS.includes(k)).length;
    const totalApps = TELEPORT_APPS.length;
    const pct = Math.round((visitedCount / totalApps) * 100);

    const catEmojis = { Games:'🎮', Creative:'🎨', Music:'🎵', Social:'💬', Tools:'🛠', Weird:'🤪', Sim:'🌿', Retro:'💾', Security:'🔒', Explore:'🧭', Sloppy:'🟣' };

    const catChips = Object.entries(APP_CATEGORIES).map(([cat, apps]) => {
      const unvisited = apps.filter(a => !visited[a]).length;
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

    panel.innerHTML = `
      <div class="sloppy-tp-title">🌀 Teleport Discovery</div>
      <div class="sloppy-tp-stats">
        ${teleportCategory
          ? `<strong>${teleportCategory}</strong> &middot; ${poolSize} apps &middot; <span>${poolNew} undiscovered</span>`
          : `${totalApps} apps &middot; <span>${totalApps - visitedCount} undiscovered</span>`
        }
      </div>
      <div class="sloppy-tp-cats">${catChips}</div>
      <div class="sloppy-tp-actions">
        <button class="sloppy-tp-go" onclick="window.sloppyBarTeleportGo()">🌀 ${teleportCategory ? teleportCategory : 'Random'} Teleport</button>
        <button class="sloppy-tp-close" onclick="window.sloppyBarTeleportClose()">✕</button>
      </div>
      <div class="sloppy-tp-discovery">
        Explorer progress: ${visitedCount}/${totalApps} discovered (${pct}%)
        <div class="sloppy-tp-progress"><div class="sloppy-tp-progress-fill" style="width:${pct}%"></div></div>
      </div>
    `;

    panel.classList.add('open');
    overlay.classList.add('open');
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
