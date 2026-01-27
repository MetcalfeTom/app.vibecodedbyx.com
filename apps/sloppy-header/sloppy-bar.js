/**
 * SloppyBar - Universal Identity Header for sloppy.live
 *
 * Usage: <script src="/sloppy-header/sloppy-bar.js"></script>
 *
 * Options (via data attributes on script tag):
 *   data-position="top|bottom" (default: top)
 *   data-theme="dark|light|auto" (default: dark)
 *   data-minimized="true|false" (default: false)
 *   data-hide-karma="true|false" (default: false)
 *   data-hide-links="true|false" (default: false)
 */

(function() {
  'use strict';

  // Configuration
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const SUPABASE_URL = 'https://dtfaplmockmwvgyqxbep.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZmFwbG1vY2ttd3ZneXF4YmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzODMxMjUsImV4cCI6MjA0OTk1OTEyNX0.gV1oTVJCfQ-eTvzlB2i4drf5Xv4NBzmBQUCTl76ufZE';

  // Get script options
  const script = document.currentScript;
  const options = {
    position: script?.getAttribute('data-position') || 'top',
    theme: script?.getAttribute('data-theme') || 'dark',
    minimized: script?.getAttribute('data-minimized') === 'true',
    hideKarma: script?.getAttribute('data-hide-karma') === 'true',
    hideLinks: script?.getAttribute('data-hide-links') === 'true'
  };

  // Curated app list for random teleport (mix of games, tools, creative apps)
  const TELEPORT_APPS = [
    'neon-tetris', 'breakout-terminal', 'icy-tower', 'star-catcher', 'neon-flappy',
    'snake', 'asteroids', 'space-invaders', 'platformer', 'minecraft',
    'sloppygram', 'sloppy-spectrum', 'graffiti-wall', 'pixel-editor', 'confession-wall',
    'wiki-scout', 'cosmic-chat', 'chat-buddy', 'knowledge-chaos', 'oracle-log',
    'neon-synth', 'lofi-beats', 'ghost-town-radio', 'oscillator', 'kaleidoscope',
    'generative-art', 'lava-lamp', 'fluid-sim', 'chrome-sphere', 'aurora-lab',
    'btc-tracker', 'solana-tracker', 'sloppy-coin-info', 'crypto-tools',
    'claudes-digital-diary', 'federated-truth', 'future-news', 'comedy-club',
    'toilet-run', 'coin-pusher', 'bouldering-game', 'candle-jumper', 'bug-zap',
    'cozy-pet', 'fish-tank', 'plant-cli', 'void-fishing', 'pancake-stack',
    'neon-casino', 'sloppy-slots', 'golden-game', 'treasure-calculator',
    'crt-calculator', 'chaos-organizer', 'tombstone-todo', 'cyber-vault',
    'text-effects', 'cowsay', 'ascii-art', 'quine-viz', 'deadfish',
    'romance-quest', 'medieval-romance', 'love-sloppy', 'horny-jail',
    'neon-guestbook', 'guestbook', 'the-last-word', 'lost-found'
  ];

  // State
  let supabase = null;
  let currentUser = null;
  let userData = { karma: 0, rank: null, premium: false, username: 'Guest' };
  let isMinimized = options.minimized;
  let cacheTimestamp = 0;

  // Inject styles
  const styles = `
    .sloppy-bar {
      position: fixed;
      ${options.position}: 0;
      left: 0;
      right: 0;
      height: 36px;
      background: ${options.theme === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(10,10,15,0.95)'};
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-${options.position === 'top' ? 'bottom' : 'top'}: 1px solid ${options.theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
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
      width: 40px;
      height: 40px;
      ${options.position}: 10px;
      left: 10px;
      right: auto;
      border-radius: 8px;
      border: 1px solid ${options.theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)'};
      justify-content: center;
      cursor: pointer;
    }
    .sloppy-bar.minimized:hover {
      transform: scale(1.1);
      border-color: #00ddff;
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
      font-size: 18px;
    }
    .sloppy-bar.minimized .sloppy-bar-left,
    .sloppy-bar.minimized .sloppy-bar-center,
    .sloppy-bar.minimized .sloppy-bar-right {
      display: none;
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
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Initialize Supabase
  async function initSupabase() {
    if (window.supabase) {
      supabase = window.supabase;
    } else {
      // Dynamically import Supabase
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
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
      currentUser = session?.user;
      cacheTimestamp = 0; // Force refresh
      fetchUserData();
    });

    await fetchUserData();
  }

  // Fetch user data
  async function fetchUserData() {
    if (!supabase || !currentUser) return;

    // Check cache
    if (Date.now() - cacheTimestamp < CACHE_DURATION) return;

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
        userData.username = karmaResult.data.username || generateUsername();
      } else {
        userData.username = generateUsername();
      }

      userData.premium = !!premiumResult.data?.purchased_at;

      // Check for Twitter username
      if (currentUser.user_metadata?.user_name) {
        userData.username = '@' + currentUser.user_metadata.user_name;
        userData.isTwitter = true;
      }

      cacheTimestamp = Date.now();
      render();
    } catch (e) {
      console.warn('SloppyBar: Error fetching user data', e);
    }
  }

  function generateUsername() {
    return 'Anon' + Math.floor(Math.random() * 9999);
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
      <span class="sloppy-bar-minimized-icon">🪪</span>
      <div class="sloppy-bar-left">
        <a href="/sloppy-id" class="sloppy-bar-identity" title="View your SloppyID profile">
          <span class="sloppy-bar-avatar">${userData.isTwitter ? '🐦' : '🪪'}</span>
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
        <a href="/app-directory" class="sloppy-bar-link" title="Browse Apps">🚀 Apps</a>
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

  // Global toggle function
  window.sloppyBarToggle = function() {
    isMinimized = !isMinimized;
    render();
    // Prevent event bubbling
    event?.stopPropagation();
  };

  // Global teleport function - random app adventure!
  window.sloppyBarTeleport = function() {
    // Get current app path to avoid teleporting to same app
    const currentPath = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');

    // Filter out current app
    const availableApps = TELEPORT_APPS.filter(app => app !== currentPath);

    // Pick a random app
    const randomApp = availableApps[Math.floor(Math.random() * availableApps.length)];

    // Navigate with a fun effect
    const btn = document.querySelector('.sloppy-bar-teleport');
    if (btn) {
      btn.style.transform = 'scale(1.2)';
      btn.style.boxShadow = '0 0 20px rgba(170, 102, 255, 0.8)';
    }

    setTimeout(() => {
      window.location.href = '/' + randomApp;
    }, 200);

    event?.stopPropagation();
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  async function init() {
    render(); // Show placeholder immediately
    await initSupabase();
    render(); // Update with real data
  }

})();
